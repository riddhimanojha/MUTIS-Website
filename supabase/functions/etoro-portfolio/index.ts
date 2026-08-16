import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "jsr:@supabase/supabase-js@2";

const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
const SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
const ETORO_BASE_URL = "https://public-api.etoro.com";

// How long a successful fetch is considered fresh before the next request
// triggers a live re-fetch from eToro. Keeps us well under eToro's 60
// req/60s (portfolio) and 120 req/60s (instruments) rate limits even under
// concurrent public traffic, without needing a cron job.
const CACHE_TTL_MS = 5 * 60 * 1000;

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

function json(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json", ...corsHeaders },
  });
}

// The eToro Public API docs we were given describe field meaning in prose,
// not an exact schema, so holdings/account totals are read defensively
// against a few plausible key casings rather than a single assumed name.
// The raw objects are kept alongside so nothing is lost if none match.
function pick(obj: Record<string, unknown>, keys: string[]): unknown {
  for (const key of keys) {
    if (obj[key] !== undefined) return obj[key];
  }
  return undefined;
}

type EtoroAccountTotals = Record<string, unknown>;
type EtoroInstrumentAggregate = Record<string, unknown>;

async function fetchAggregatePortfolio(apiKey: string, userKey: string) {
  const res = await fetch(`${ETORO_BASE_URL}/api/v1/trading/info/aggregate-portfolio`, {
    headers: {
      "x-api-key": apiKey,
      "x-user-key": userKey,
      "x-request-id": crypto.randomUUID(),
    },
  });
  if (!res.ok) {
    throw new Error(`eToro aggregate-portfolio returned ${res.status}: ${await res.text().catch(() => res.statusText)}`);
  }
  return res.json();
}

async function fetchInstrumentNames(apiKey: string, userKey: string, instrumentIds: number[]) {
  if (instrumentIds.length === 0) return new Map<number, Record<string, unknown>>();
  const res = await fetch(
    `${ETORO_BASE_URL}/api/v1/market-data/instruments?instrumentIds=${instrumentIds.join(",")}`,
    {
      headers: {
        "x-api-key": apiKey,
        "x-user-key": userKey,
        "x-request-id": crypto.randomUUID(),
      },
    },
  );
  if (!res.ok) {
    console.error(`eToro instruments lookup returned ${res.status}`);
    return new Map<number, Record<string, unknown>>();
  }
  const data = await res.json();
  const list: Record<string, unknown>[] = Array.isArray(data) ? data : data.instruments ?? data.items ?? [];
  const map = new Map<number, Record<string, unknown>>();
  for (const entry of list) {
    const id = Number(pick(entry, ["instrumentId", "id"]));
    if (!Number.isNaN(id)) map.set(id, entry);
  }
  return map;
}

function mergeHoldings(
  aggregates: EtoroInstrumentAggregate[],
  names: Map<number, Record<string, unknown>>,
) {
  return aggregates.map((agg) => {
    const instrumentId = Number(pick(agg, ["instrumentId", "id"]));
    const meta = names.get(instrumentId);
    return {
      instrumentId,
      name: (meta && (pick(meta, ["instrumentDisplayName", "displayName", "name"]) as string)) ?? null,
      symbol: (meta && (pick(meta, ["symbolFull", "symbol"]) as string)) ?? null,
      logoUrl: (meta && (pick(meta, ["logoUrl", "imageUrl", "logo", "image"]) as string)) ?? null,
      netUnits: pick(agg, ["netUnits", "units", "netPositionUnits", "quantity"]) ?? null,
      exposure: pick(agg, ["exposure", "currentExposure", "marketValue"]) ?? null,
      avgOpenPrice: pick(agg, ["avgOpenPrice", "averageOpenPrice", "avgPrice"]) ?? null,
      unrealizedPnl: pick(agg, ["unrealizedProfit", "unrealizedPnl", "unrealisedPnl", "pnl"]) ?? null,
      raw: agg,
    };
  });
}

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });

  const admin = createClient(SUPABASE_URL, SERVICE_ROLE_KEY);

  const { data: cacheRow, error: cacheError } = await admin
    .from("etoro_portfolio_cache")
    .select("*")
    .eq("id", true)
    .maybeSingle();
  if (cacheError) return json({ error: cacheError.message }, 500);

  const { data: settings } = await admin
    .from("etoro_settings")
    .select("is_configured")
    .eq("id", true)
    .maybeSingle();
  const configured = settings?.is_configured ?? false;

  const isFresh =
    cacheRow?.fetched_at != null &&
    Date.now() - new Date(cacheRow.fetched_at as string).getTime() < CACHE_TTL_MS;

  if (!configured || isFresh) {
    return json({ configured, ...cacheRow });
  }

  const { data: apiKey } = await admin.rpc("etoro_get_secret", { secret_name: "etoro_api_key" });
  const { data: userKey } = await admin.rpc("etoro_get_secret", { secret_name: "etoro_user_key" });

  if (!apiKey || !userKey) {
    return json({ configured: false, ...cacheRow });
  }

  try {
    const portfolio = await fetchAggregatePortfolio(apiKey, userKey);
    const accountTotals: EtoroAccountTotals = portfolio.accountTotals ?? {};
    const aggregates: EtoroInstrumentAggregate[] = portfolio.instrumentAggregates ?? [];

    const instrumentIds = [
      ...new Set(
        aggregates
          .map((a) => Number(pick(a, ["instrumentId", "id"])))
          .filter((id) => !Number.isNaN(id)),
      ),
    ];
    const names = await fetchInstrumentNames(apiKey, userKey, instrumentIds);
    const holdings = mergeHoldings(aggregates, names);

    const { data: updated, error: updateError } = await admin
      .from("etoro_portfolio_cache")
      .update({
        account_totals: accountTotals,
        holdings,
        sync_status: "ok",
        sync_error: null,
        fetched_at: new Date().toISOString(),
      })
      .eq("id", true)
      .select()
      .single();
    if (updateError) return json({ error: updateError.message }, 500);

    return json({ configured: true, ...updated });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error contacting eToro";
    console.error("eToro portfolio sync failed", message);
    await admin
      .from("etoro_portfolio_cache")
      .update({ sync_status: "error", sync_error: message })
      .eq("id", true);
    return json({ configured: true, ...cacheRow, sync_status: "error", sync_error: message });
  }
});
