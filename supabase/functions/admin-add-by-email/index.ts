import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "jsr:@supabase/supabase-js@2";

const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
const SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
const SITE_URL = "https://mutis.co.uk";

function json(body: unknown, status: number) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json" },
  });
}

Deno.serve(async (req: Request) => {
  if (req.method !== "POST") return json({ error: "Method not allowed" }, 405);

  const authHeader = req.headers.get("Authorization");
  if (!authHeader) return json({ error: "Missing Authorization header" }, 401);

  const admin = createClient(SUPABASE_URL, SERVICE_ROLE_KEY);

  // Identify the caller from their JWT.
  const jwt = authHeader.replace(/^Bearer\s+/i, "");
  const { data: callerData, error: callerError } = await admin.auth.getUser(jwt);
  if (callerError || !callerData.user) return json({ error: "Invalid session" }, 401);
  const caller = callerData.user;

  // Verify the caller is themselves already an admin before doing anything privileged.
  const { data: callerAdminRow } = await admin
    .from("admin_users")
    .select("user_id")
    .eq("user_id", caller.id)
    .maybeSingle();
  if (!callerAdminRow) return json({ error: "Only current admins can add new admins." }, 403);

  let body: { email?: string };
  try {
    body = await req.json();
  } catch {
    return json({ error: "Invalid request body" }, 400);
  }
  const email = body.email?.trim().toLowerCase();
  if (!email) return json({ error: "Email is required" }, 400);

  async function grantAdmin(userId: string, userEmail: string, fullName: string | null) {
    const { data: inserted, error: insertError } = await admin
      .from("admin_users")
      .insert({ user_id: userId, email: userEmail, full_name: fullName, added_by: caller.id })
      .select()
      .single();
    if (insertError) {
      if (insertError.code === "23505") return json({ error: "That person is already an admin." }, 409);
      return json({ error: insertError.message }, 500);
    }
    return json({ admin: inserted }, 200);
  }

  // Access is invite-only: this creates the auth account and grants admin
  // access in one step, rather than requiring a separate self-serve signup.
  const { data: invited, error: inviteError } = await admin.auth.admin.inviteUserByEmail(email, {
    redirectTo: `${SITE_URL}/admin/set-password`,
  });

  if (!inviteError) {
    return grantAdmin(invited.user.id, invited.user.email ?? email, (invited.user.user_metadata?.full_name as string | undefined) ?? null);
  }

  // inviteUserByEmail fails if the account already exists — that's fine if
  // they're not yet an admin (promotes the existing account); if they are,
  // fall through to the normal "already an admin" response.
  const alreadyExists = inviteError.message.toLowerCase().includes("already been registered") ||
    inviteError.message.toLowerCase().includes("already registered") ||
    inviteError.code === "email_exists";
  if (!alreadyExists) {
    return json({ error: inviteError.message }, 500);
  }

  const { data: usersPage, error: listError } = await admin.auth.admin.listUsers({ page: 1, perPage: 1000 });
  if (listError) return json({ error: "Could not look up that account." }, 500);
  const existingUser = usersPage.users.find((u) => u.email?.toLowerCase() === email);
  if (!existingUser) return json({ error: "Could not find that account." }, 500);

  return grantAdmin(existingUser.id, existingUser.email ?? email, (existingUser.user_metadata?.full_name as string | undefined) ?? null);
});
