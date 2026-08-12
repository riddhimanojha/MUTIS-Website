import type { ReactNode } from "react";
import { X } from "lucide-react";

interface ModalProps {
  open: boolean;
  title: string;
  onClose: () => void;
  children: ReactNode;
  widthClass?: string;
}

export function Modal({ open, title, onClose, children, widthClass = "max-w-[640px]" }: ModalProps) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-[24px] py-[24px]">
      <div className="absolute inset-0" onClick={onClose} aria-hidden="true" />
      <div className={`relative flex max-h-full w-full ${widthClass} flex-col overflow-hidden rounded-[16px] border border-border bg-background`}>
        <div className="flex items-center justify-between border-b border-border px-[24px] py-[20px]">
          <h2 className="text-[16px] font-medium text-foreground">{title}</h2>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="rounded-[8px] p-[6px] text-muted-foreground transition-colors hover:bg-white/5 hover:text-foreground"
          >
            <X className="h-[16px] w-[16px]" />
          </button>
        </div>
        <div className="flex-1 overflow-y-auto px-[24px] py-[24px]">{children}</div>
      </div>
    </div>
  );
}
