import { useState, type FormEvent } from "react";
import { useNavigate, useSearchParams } from "react-router";
import { supabase } from "@/lib/supabase";
import { useAuth } from "../AuthProvider";
import { FormMessage } from "../components/FormMessage";

type Status = "idle" | "submitting" | "error" | "done";

export function SetPassword() {
  const { session, isLoading } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  // Supabase appends `?type=invite` or `?type=recovery` to the redirect URL —
  // both land here since they work identically once the magic link has
  // established a session; only the copy differs.
  const isInvite = searchParams.get("type") === "invite";

  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [status, setStatus] = useState<Status>("idle");
  const [error, setError] = useState("");

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (password.length < 8) {
      setError("Password must be at least 8 characters.");
      setStatus("error");
      return;
    }
    if (password !== confirm) {
      setError("Passwords don't match.");
      setStatus("error");
      return;
    }

    setStatus("submitting");
    setError("");

    const { error: updateError } = await supabase.auth.updateUser({ password });

    if (updateError) {
      setError(updateError.message);
      setStatus("error");
      return;
    }

    setStatus("done");
    setTimeout(() => navigate("/admin", { replace: true }), 1200);
  };

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center text-[14px] text-muted-foreground">
        Loading…
      </div>
    );
  }

  // The magic link establishes a session automatically on load
  // (detectSessionInUrl). No session here means the link is invalid,
  // already used, or expired.
  if (!session) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background px-[24px] text-center">
        <p className="max-w-[360px] text-[14px] leading-[1.6] text-muted-foreground">
          This link is invalid or has expired. Ask a current admin to send you a new invite, or use
          "Forgot password" on the login page.
        </p>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-[24px]">
      <div className="w-full max-w-[400px]">
        <div className="mb-[32px] text-center">
          <p className="text-[10px] font-medium uppercase tracking-[0.24em] text-muted-foreground">MUTIS</p>
          <h1 className="mt-[8px] text-[22px] font-medium text-foreground">
            {isInvite ? "Set your password" : "Reset your password"}
          </h1>
          <p className="mt-[8px] text-[13px] text-muted-foreground">Signed in as {session.user.email}</p>
        </div>

        <form onSubmit={onSubmit} className="flex flex-col gap-[20px] rounded-[16px] border border-border bg-card p-[32px]">
          <div className="flex flex-col gap-[6px]">
            <label htmlFor="set-password" className="text-[12px] font-medium text-muted-foreground">
              New password
            </label>
            <input
              id="set-password"
              type="password"
              required
              autoComplete="new-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-[10px] border border-input bg-input px-[14px] py-[12px] text-[15px]! text-foreground outline-hidden transition-colors focus:border-accent"
            />
          </div>
          <div className="flex flex-col gap-[6px]">
            <label htmlFor="set-password-confirm" className="text-[12px] font-medium text-muted-foreground">
              Confirm password
            </label>
            <input
              id="set-password-confirm"
              type="password"
              required
              autoComplete="new-password"
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
              className="w-full rounded-[10px] border border-input bg-input px-[14px] py-[12px] text-[15px]! text-foreground outline-hidden transition-colors focus:border-accent"
            />
          </div>

          {status === "error" && <FormMessage kind="error">{error}</FormMessage>}
          {status === "done" && <FormMessage kind="success">Password set — redirecting…</FormMessage>}

          <button
            type="submit"
            disabled={status === "submitting" || status === "done"}
            className="w-full rounded-[10px] bg-primary px-[20px] py-[12px] text-[14px]! font-medium text-primary-foreground transition-colors hover:bg-primary/90 disabled:opacity-60"
          >
            {status === "submitting" ? "Saving…" : "Set password & continue"}
          </button>
        </form>
      </div>
    </div>
  );
}
