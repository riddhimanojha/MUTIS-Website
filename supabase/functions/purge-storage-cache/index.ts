import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "jsr:@supabase/supabase-js@2";

const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
const SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

// Only buckets that reuse a deterministic path per row (IdKeyedImageUploader)
// ever need a cache purge after an overwrite — random-filename uploads never
// collide with a previously cached path.
const PURGEABLE_BUCKETS = new Set(["committee_photos", "alumni_photos", "president_photos"]);

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

function json(body: unknown, status: number) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json", ...corsHeaders },
  });
}

Deno.serve(async (req: Request) => {
  // supabase-js sends an Authorization header on every call, which makes the
  // browser preflight with OPTIONS first — without a 2xx response to that,
  // the actual POST never goes out and the purge silently never happens.
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });
  if (req.method !== "POST") return json({ error: "Method not allowed" }, 405);

  const authHeader = req.headers.get("Authorization");
  if (!authHeader) return json({ error: "Missing Authorization header" }, 401);

  const admin = createClient(SUPABASE_URL, SERVICE_ROLE_KEY);

  const jwt = authHeader.replace(/^Bearer\s+/i, "");
  const { data: callerData, error: callerError } = await admin.auth.getUser(jwt);
  if (callerError || !callerData.user) return json({ error: "Invalid session" }, 401);

  const { data: callerAdminRow } = await admin
    .from("admin_users")
    .select("user_id")
    .eq("user_id", callerData.user.id)
    .maybeSingle();
  if (!callerAdminRow) return json({ error: "Only admins can do this." }, 403);

  let body: { bucket?: string; path?: string };
  try {
    body = await req.json();
  } catch {
    return json({ error: "Invalid request body" }, 400);
  }

  const { bucket, path } = body;
  if (!bucket || !path) return json({ error: "bucket and path are required" }, 400);
  if (!PURGEABLE_BUCKETS.has(bucket)) return json({ error: "Unsupported bucket" }, 400);

  const { data, error } = await admin.storage.from(bucket).purgeCache(path);
  if (error) return json({ error: error.message }, 500);
  return json(data, 200);
});
