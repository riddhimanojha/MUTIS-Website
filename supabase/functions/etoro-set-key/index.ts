import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "jsr:@supabase/supabase-js@2";

const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
const SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

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

  let body: { apiKey?: string; userKey?: string };
  try {
    body = await req.json();
  } catch {
    return json({ error: "Invalid request body" }, 400);
  }

  const apiKey = body.apiKey?.trim();
  const userKey = body.userKey?.trim();
  if (!apiKey || !userKey) return json({ error: "Both apiKey and userKey are required" }, 400);

  const { error: apiKeyError } = await admin.rpc("etoro_set_secret", {
    secret_name: "etoro_api_key",
    secret_value: apiKey,
  });
  if (apiKeyError) return json({ error: `Could not store API key: ${apiKeyError.message}` }, 500);

  const { error: userKeyError } = await admin.rpc("etoro_set_secret", {
    secret_name: "etoro_user_key",
    secret_value: userKey,
  });
  if (userKeyError) return json({ error: `Could not store user key: ${userKeyError.message}` }, 500);

  const { error: settingsError } = await admin
    .from("etoro_settings")
    .update({ is_configured: true, updated_at: new Date().toISOString(), updated_by: callerData.user.id })
    .eq("id", true);
  if (settingsError) return json({ error: settingsError.message }, 500);

  return json({ ok: true }, 200);
});
