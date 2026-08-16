import { useState } from "react";

interface ConfirmDialogProps {
  open: boolean;
  title: string;
  description: string;
  confirmLabel?: string;
  cancelLabel?: string;
  destructive?: boolean;
  /** If set, the confirm button stays disabled until the user types this exact string. */
  requireText?: string;
  onConfirm: () => void;
  onCancel: () => void;
}

export function ConfirmDialog({
  open,
  title,
  description,
  confirmLabel = "Confirm",
  cancelLabel = "Cancel",
  destructive = false,
  requireText,
  onConfirm,
  onCancel,
}: ConfirmDialogProps) {
  const [typed, setTyped] = useState("");

  if (!open) return null;

  const locked = Boolean(requireText) && typed !== requireText;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-[24px]">
      <div className="w-full max-w-[420px] rounded-[16px] border border-border bg-popover p-[32px] backdrop-blur-md shadow-2xl shadow-black/40">
        <h2 className="text-[17px] font-medium text-foreground">{title}</h2>
        <p className="mt-[12px] text-[13px] leading-[1.6] text-muted-foreground">{description}</p>

        {requireText && (
          <div className="mt-[20px] flex flex-col gap-[6px]">
            <label htmlFor="confirm-dialog-text" className="text-[12px] font-medium text-muted-foreground">
              Type <span className="text-foreground">{requireText}</span> to confirm
            </label>
            <input
              id="confirm-dialog-text"
              type="text"
              value={typed}
              onChange={(e) => setTyped(e.target.value)}
              autoComplete="off"
              className="w-full rounded-[10px] border border-input bg-input px-[14px] py-[12px] text-[15px]! text-foreground outline-hidden transition-colors focus:border-accent"
            />
          </div>
        )}

        <div className="mt-[24px] flex justify-end gap-[8px]">
          <button
            type="button"
            onClick={onCancel}
            className="rounded-[10px] border border-border px-[16px] py-[10px] text-[13px]! font-medium text-foreground transition-colors hover:bg-white/5"
          >
            {cancelLabel}
          </button>
          <button
            type="button"
            disabled={locked}
            onClick={onConfirm}
            className={`rounded-[10px] px-[16px] py-[10px] text-[13px]! font-medium transition-colors disabled:cursor-not-allowed disabled:opacity-40 ${
              destructive
                ? "bg-destructive text-destructive-foreground hover:bg-destructive/90"
                : "bg-primary text-primary-foreground hover:bg-primary/90"
            }`}
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
