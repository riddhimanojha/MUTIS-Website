const STATUS_STYLES: Record<string, string> = {
  draft: "border-border text-muted-foreground",
  published: "border-accent/40 text-accent",
  new: "border-accent/40 text-accent",
  read: "border-border text-muted-foreground",
  archived: "border-border text-muted-foreground/60",
  confirmed: "border-accent/40 text-accent",
  cancelled: "border-destructive/40 text-destructive",
  insert: "border-accent/40 text-accent",
  update: "border-border text-muted-foreground",
  delete: "border-destructive/40 text-destructive",
};

export function StatusBadge({ status }: { status: string }) {
  const className = STATUS_STYLES[status] ?? "border-border text-muted-foreground";
  return (
    <span
      className={`inline-flex items-center rounded-[8px] border px-[8px] py-[2px] text-[10px]! font-medium uppercase tracking-[0.06em] ${className}`}
    >
      {status}
    </span>
  );
}

interface PublishToggleProps {
  checked: boolean;
  onChange: (next: boolean) => void;
  disabled?: boolean;
  label?: string;
}

export function PublishToggle({ checked, onChange, disabled = false, label }: PublishToggleProps) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={label ?? (checked ? "Published" : "Unpublished")}
      disabled={disabled}
      onClick={() => onChange(!checked)}
      className={`relative inline-flex h-[22px] w-[38px] shrink-0 items-center rounded-[12px] transition-colors disabled:cursor-not-allowed disabled:opacity-40 ${
        checked ? "bg-accent" : "bg-switch-background"
      }`}
    >
      <span
        className={`inline-block h-[16px] w-[16px] transform rounded-[8px] bg-white transition-transform ${
          checked ? "translate-x-[19px]" : "translate-x-[3px]"
        }`}
      />
    </button>
  );
}
