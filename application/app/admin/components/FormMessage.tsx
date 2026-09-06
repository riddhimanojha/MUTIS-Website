import type { ReactNode } from "react";

type Kind = "error" | "success";

/**
 * Shared inline success/error line for admin auth forms (Login,
 * SetPassword) that need a persistent, in-form message rather than a
 * transient Toast — e.g. "Incorrect password" should stay put while the
 * admin re-types, not auto-dismiss after 4s.
 */
export function FormMessage({ kind, children }: { kind: Kind; children: ReactNode }) {
  return (
    <p
      role={kind === "error" ? "alert" : "status"}
      aria-live={kind === "error" ? "assertive" : "polite"}
      aria-atomic="true"
      className={`text-[13px] ${kind === "error" ? "text-destructive" : "text-accent"}`}
    >
      {children}
    </p>
  );
}
