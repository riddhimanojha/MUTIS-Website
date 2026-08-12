import type { ReactNode } from "react";
import { X } from "lucide-react";

interface DrawerProps {
  open: boolean;
  title: string;
  onClose: () => void;
  children: ReactNode;
  widthClass?: string;
}

export function Drawer({ open, title, onClose, children, widthClass = "max-w-[480px]" }: DrawerProps) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/60">
      <div className="absolute inset-0" onClick={onClose} aria-hidden="true" />
      <div className={`relative flex h-full w-full ${widthClass} flex-col overflow-y-auto border-l border-border bg-background`}>
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
        <div className="flex-1 px-[24px] py-[24px]">{children}</div>
      </div>
    </div>
  );
}
