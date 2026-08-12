import { useEffect, useState, type FormEvent } from "react";
import { Trash2, Loader2 } from "lucide-react";
import { supabase } from "@/lib/supabase";
import type { Database } from "@/lib/database.types";
import { useToast } from "../components/Toast";
import { DataTable, type DataTableColumn } from "../components/DataTable";
import { ConfirmDialog } from "../components/ConfirmDialog";

type AdminRow = Database["public"]["Tables"]["admin_users"]["Row"];

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString(undefined, { year: "numeric", month: "short", day: "numeric" });
}

export function ManageAdmins() {
  const toast = useToast();
  const [rows, setRows] = useState<AdminRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [email, setEmail] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [pendingDelete, setPendingDelete] = useState<AdminRow | null>(null);
  const [deleting, setDeleting] = useState(false);

  const fetchRows = async () => {
    setLoading(true);
    const { data, error } = await supabase.from("admin_users").select("*").order("added_at", { ascending: false });
    if (error) {
      toast.error("Could not load admins.");
    } else {
      setRows(data);
    }
    setLoading(false);
  };

  useEffect(() => {
    let cancelled = false;
    supabase
      .from("admin_users")
      .select("*")
      .order("added_at", { ascending: false })
      .then(({ data, error }) => {
        if (cancelled) return;
        if (error) {
          toast.error("Could not load admins.");
        } else {
          setRows(data);
        }
        setLoading(false);
      });
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const emailByUserId = new Map(rows.map((r) => [r.user_id, r.email]));

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!email.trim()) return;
    setSubmitting(true);
    const { data, error } = await supabase.functions.invoke<{ error?: string }>("admin-add-by-email", {
      body: { email: email.trim() },
    });
    setSubmitting(false);
    if (error || data?.error) {
      toast.error(data?.error ?? error?.message ?? "Could not add that admin.");
      return;
    }
    toast.success(`${email.trim()} invited as an admin.`);
    setEmail("");
    fetchRows();
  };

  const confirmDelete = async () => {
    if (!pendingDelete) return;
    setDeleting(true);
    const { error } = await supabase.from("admin_users").delete().eq("user_id", pendingDelete.user_id);
    setDeleting(false);
    if (error) {
      toast.error("Could not remove that admin.");
      return;
    }
    toast.success(`${pendingDelete.email} removed.`);
    setPendingDelete(null);
    fetchRows();
  };

  const columns: DataTableColumn<AdminRow>[] = [
    { key: "email", label: "Email", render: (r) => r.email, sortValue: (r) => r.email },
    { key: "full_name", label: "Name", render: (r) => r.full_name ?? "—" },
    {
      key: "added_by",
      label: "Added by",
      render: (r) => (r.added_by ? (emailByUserId.get(r.added_by) ?? "—") : "—"),
    },
    { key: "added_at", label: "Added", render: (r) => formatDate(r.added_at), sortValue: (r) => r.added_at },
    {
      key: "actions",
      label: "",
      render: (r) => (
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            setPendingDelete(r);
          }}
          disabled={rows.length <= 1}
          title={rows.length <= 1 ? "Can't remove the last remaining admin." : "Remove admin"}
          className="rounded-[8px] p-[6px] text-muted-foreground transition-colors hover:bg-destructive/10 hover:text-destructive disabled:cursor-not-allowed disabled:opacity-30 disabled:hover:bg-transparent disabled:hover:text-muted-foreground"
        >
          <Trash2 className="h-[14px] w-[14px]" />
        </button>
      ),
    },
  ];

  return (
    <div className="mx-auto max-w-[900px] px-[24px] py-[48px] lg:px-[40px] lg:py-[56px]">
      <p className="text-[10px] font-medium uppercase tracking-[0.24em] text-muted-foreground">Settings</p>
      <h1 className="mt-[8px] text-[22px] font-medium text-foreground">Manage admins</h1>
      <p className="mt-[8px] text-[13px] leading-[1.6] text-muted-foreground">
        Every admin has identical privileges. Invite someone by email — this sends them an invite
        link that lets them set a password directly. There's no public signup; access is invite-only.
      </p>

      <form onSubmit={onSubmit} className="mt-[24px] flex flex-col gap-[8px] sm:flex-row">
        <input
          type="email"
          required
          placeholder="name@example.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full flex-1 rounded-[10px] border border-input bg-input px-[14px] py-[12px] text-[15px]! text-foreground outline-hidden transition-colors focus:border-accent sm:max-w-[320px]"
        />
        <button
          type="submit"
          disabled={submitting}
          className="inline-flex items-center justify-center gap-[6px] rounded-[10px] bg-primary px-[20px] py-[12px] text-[14px]! font-medium text-primary-foreground transition-colors hover:bg-primary/90 disabled:opacity-60"
        >
          {submitting && <Loader2 className="h-[14px] w-[14px] animate-spin" />}
          {submitting ? "Inviting…" : "Invite admin"}
        </button>
      </form>

      <div className="mt-[32px]">
        {loading ? (
          <div className="flex items-center justify-center py-[48px] text-muted-foreground">
            <Loader2 className="h-[18px] w-[18px] animate-spin" />
          </div>
        ) : (
          <DataTable
            columns={columns}
            data={rows}
            keyField={(r) => r.user_id}
            emptyMessage="No admins yet."
          />
        )}
      </div>

      <ConfirmDialog
        open={pendingDelete !== null}
        title="Remove admin access?"
        description={`${pendingDelete?.email ?? ""} will immediately lose the ability to write anything in the admin panel. This does not delete their account, just their admin access.`}
        confirmLabel={deleting ? "Removing…" : "Remove"}
        destructive
        onConfirm={confirmDelete}
        onCancel={() => setPendingDelete(null)}
      />
    </div>
  );
}
