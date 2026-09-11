import { useCallback, useState } from "react";

export type FormStatus = "idle" | "submitting" | "sent" | "error";

/**
 * Shared state machine behind every public-facing form's feedback banner
 * (see FormFeedback.tsx). Centralised so every form clears a stale
 * success/error message the same way: as soon as the visitor edits the
 * form again, not just on the next submit.
 */
export function useFormStatus() {
  const [status, setStatus] = useState<FormStatus>("idle");
  const [error, setError] = useState("");

  const submitting = useCallback(() => {
    setStatus("submitting");
    setError("");
  }, []);

  const fail = useCallback((message: string) => {
    setError(message);
    setStatus("error");
  }, []);

  const succeed = useCallback(() => {
    setStatus("sent");
    setError("");
  }, []);

  const reset = useCallback(() => {
    setStatus("idle");
    setError("");
  }, []);

  // Attach to the <form>'s onInput — form.reset() doesn't fire input events,
  // so this only clears the banner on genuine visitor interaction, not on
  // the programmatic reset that follows a successful submit. Clears "sent"
  // too, for forms that stay mounted (blank) after success instead of
  // swapping to a standalone confirmation view.
  const onFormInput = useCallback(() => {
    setStatus((prev) => (prev === "error" || prev === "sent" ? "idle" : prev));
  }, []);

  return { status, error, submitting, fail, succeed, reset, onFormInput };
}
