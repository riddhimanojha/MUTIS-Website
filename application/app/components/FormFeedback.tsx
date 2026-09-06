import type { CSSProperties, ReactNode } from "react";
import type { FormStatus } from "@/app/hooks/useFormStatus";

interface FormFeedbackProps {
  status: FormStatus;
  error?: string;
  successMessage?: ReactNode;
  className?: string;
  style?: CSSProperties;
}

/**
 * Shared success/error banner for every public-facing form (Contact,
 * Attendance, Sponsorship enquiry, Event signup). Renders nothing for
 * "idle"/"submitting" so it never occupies layout space until there's
 * something to announce. Styling comes from the existing .form-status/
 * .form-error/.form-success classes (mutis-subpage.css / mutis-light.css)
 * per design_brief.md's documented error/success banner tokens.
 */
export function FormFeedback({ status, error, successMessage, className, style }: FormFeedbackProps) {
  const classes = ["form-status", className].filter(Boolean).join(" ");

  if (status === "error" && error) {
    return (
      <p className={`${classes} form-error`} style={style} role="alert" aria-live="assertive" aria-atomic="true">
        {error}
      </p>
    );
  }

  if (status === "sent" && successMessage) {
    return (
      <p className={`${classes} form-success`} style={style} role="status" aria-live="polite" aria-atomic="true">
        {successMessage}
      </p>
    );
  }

  return null;
}
