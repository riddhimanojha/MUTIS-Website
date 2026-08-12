import { useEffect, useMemo, useState, type FormEvent } from "react";
import { Loader2, Plus, Pencil, Trash2, Search } from "lucide-react";
import { supabase } from "@/lib/supabase";
import type { Database } from "@/lib/database.types";
import { useAdminMutation } from "../useAdminMutation";
import { useToast } from "../components/Toast";
import { Drawer } from "../components/Drawer";
import { ConfirmDialog } from "../components/ConfirmDialog";
import { DataTable, type DataTableColumn } from "../components/DataTable";
import { PublishToggle } from "../components/StatusBadge";

type RecordingRow = Database["public"]["Tables"]["recordings"]["Row"];

type FormState = {
  title: string;
  speaker: string;
  event_date: string;
  recording_url: string;
  is_published: boolean;
};

const EMPTY_FORM: FormState = { title: "", speaker: "", event_date: "", recording_url: "", is_published: true };

export function Recordings() {
  const toast = useToast();
  const { insertRow, updateRow, deleteRow } = useAdminMutation();

  const [rows, setRows] = useState<RecordingRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [publishedFilter, setPublishedFilter] = useState<"all" | "published" | "unpublished">("all");
  const [search, setSearch] = useState("");

  const [editing, setEditing] = useState<RecordingRow | "new" | null>(null);
  const [form, setForm] = useState<FormState>(EMPTY_FORM);
  const [saving, setSaving] = useState(false);
  const [pendingDelete, setPendingDelete] = useState<RecordingRow | null>(null);
  const [deleting, setDeleting] = useState(false);

  const fetchRows = async () => {
    setLoading(true);
    const { data, error } = await supabase.from("recordings").select("*");
    if (error) toast.error("Could not load recordings.");
    else setRows(data);
    setLoading(false);
  };

  useEffect(() => {
    fetchRows();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const filtered = useMemo(() => {
    return rows
      .filter((r) => {
        if (publishedFilter === "published" && !r.is_published) return false;
        if (publishedFilter === "unpublished" && r.is_published) return false;
        if (search.trim()) {
          const q = search.trim().toLowerCase();
          if (!r.title.toLowerCase().includes(q) && !(r.speaker ?? "").toLowerCase().includes(q)) return false;
        }
        return true;
      })
      .sort((a, b) => b.event_date.localeCompare(a.event_date));
  }, [rows, publishedFilter, search]);

  const openCreate = () => {
    setForm(EMPTY_FORM);
    setEditing("new");
  };

  const openEdit = (row: RecordingRow) => {
    setForm({
      title: row.title,
      speaker: row.speaker ?? "",
      event_date: row.event_date,
      recording_url: row.recording_url ?? "",
      is_published: row.is_published,
    });
    setEditing(row);
  };

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!form.title.trim() || !form.event_date) return;
    setSaving(true);
    try {
      const values = {
        title: form.title.trim(),
        speaker: form.speaker.trim() || null,
        event_date: form.event_date,
        recording_url: form.recording_url.trim() || null,
        is_published: form.is_published,
      };
      if (editing === "new") {
        await insertRow("recordings", values);
        toast.success("Recording added.");
      } else if (editing) {
        await updateRow("recordings", editing.id, values, editing);
        toast.success("Recording updated.");
      }
      setEditing(null);
      fetchRows();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Could not save that recording.");
    } finally {
      setSaving(false);
    }
  };

  const confirmDelete = async () => {
    if (!pendingDelete) return;
    setDeleting(true);
    try {
      await deleteRow("recordings", pendingDelete.id, pendingDelete);
      toast.success(`${pendingDelete.title} deleted.`);
      setPendingDelete(null);
      fetchRows();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Could not delete that recording.");
    } finally {
      setDeleting(false);
    }
  };

  const columns: DataTableColumn<RecordingRow>[] = [
    { key: "event_date", label: "Date", render: (r) => r.event_date, sortValue: (r) => r.event_date },
    { key: "title", label: "Title", render: (r) => r.title, sortValue: (r) => r.title },
    { key: "speaker", label: "Speaker", render: (r) => r.speaker ?? "—" },
    { key: "recording_url", label: "Link", render: (r) => (r.recording_url ? "Yes" : "—") },
    {
      key: "is_published",
      label: "Published",
      render: (r) => (
        <PublishToggle
          checked={r.is_published}
          onChange={async (next) => {
            try {
              await updateRow("recordings", r.id, { is_published: next }, r);
              setRows((prev) => prev.map((x) => (x.id === r.id ? { ...x, is_published: next } : x)));
            } catch {
              toast.error("Could not update publish state.");
            }
          }}
        />
      ),
    },
    {
      key: "actions",
      label: "",
      render: (r) => (
        <div className="flex items-center gap-[4px]">
          <button type="button" onClick={(e) => { e.stopPropagation(); openEdit(r); }} className="rounded-[8px] p-[6px] text-muted-foreground transition-colors hover:bg-white/5 hover:text-foreground">
            <Pencil className="h-[14px] w-[14px]" />
          </button>
          <button type="button" onClick={(e) => { e.stopPropagation(); setPendingDelete(r); }} className="rounded-[8px] p-[6px] text-muted-foreground transition-colors hover:bg-destructive/10 hover:text-destructive">
            <Trash2 className="h-[14px] w-[14px]" />
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="px-[24px] py-[48px] lg:px-[40px] lg:py-[56px]">
      <div className="flex flex-wrap items-start justify-between gap-[16px]">
        <div>
          <p className="text-[10px] font-medium uppercase tracking-[0.24em] text-muted-foreground">Content</p>
          <h1 className="mt-[8px] text-[22px] font-medium text-foreground">Recordings</h1>
        </div>
        <button type="button" onClick={openCreate} className="inline-flex items-center gap-[6px] rounded-[10px] bg-primary px-[16px] py-[10px] text-[13px]! font-medium text-primary-foreground transition-colors hover:bg-primary/90">
          <Plus className="h-[14px] w-[14px]" />
          Add recording
        </button>
      </div>

      <div className="mt-[24px] flex flex-wrap items-center gap-[8px]">
        <div className="relative">
          <Search className="pointer-events-none absolute left-[12px] top-1/2 h-[14px] w-[14px] -translate-y-1/2 text-muted-foreground" />
          <input type="text" placeholder="Search by title or speaker…" value={search} onChange={(e) => setSearch(e.target.value)} className="w-[240px] rounded-[10px] border border-input bg-input py-[10px] pl-[36px] pr-[12px] text-[14px]! text-foreground outline-hidden transition-colors focus:border-accent" />
        </div>
        <select value={publishedFilter} onChange={(e) => setPublishedFilter(e.target.value as typeof publishedFilter)} className="rounded-[10px] border border-input bg-input px-[12px] py-[10px] text-[13px]! text-foreground outline-hidden">
          <option value="all">All states</option>
          <option value="published">Published</option>
          <option value="unpublished">Unpublished</option>
        </select>
      </div>

      <div className="mt-[24px]">
        {loading ? (
          <div className="flex items-center justify-center py-[48px] text-muted-foreground">
            <Loader2 className="h-[18px] w-[18px] animate-spin" />
          </div>
        ) : (
          <DataTable columns={columns} data={filtered} keyField={(r) => r.id} onRowClick={openEdit} emptyMessage="No recordings match." />
        )}
      </div>

      <Drawer open={editing !== null} title={editing === "new" ? "Add recording" : "Edit recording"} onClose={() => setEditing(null)}>
        <form onSubmit={onSubmit} className="flex flex-col gap-[20px]">
          <Field label="Title" required>
            <input type="text" required value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} className="w-full rounded-[10px] border border-input bg-input px-[14px] py-[12px] text-[15px]! text-foreground outline-hidden transition-colors focus:border-accent" />
          </Field>
          <Field label="Event date" required>
            <input type="date" required value={form.event_date} onChange={(e) => setForm({ ...form, event_date: e.target.value })} className="w-full rounded-[10px] border border-input bg-input px-[14px] py-[12px] text-[15px]! text-foreground outline-hidden transition-colors focus:border-accent" />
          </Field>
          <Field label="Speaker">
            <input type="text" value={form.speaker} onChange={(e) => setForm({ ...form, speaker: e.target.value })} className="w-full rounded-[10px] border border-input bg-input px-[14px] py-[12px] text-[15px]! text-foreground outline-hidden transition-colors focus:border-accent" />
          </Field>
          <Field label="Recording URL">
            <input type="url" placeholder="https://…" value={form.recording_url} onChange={(e) => setForm({ ...form, recording_url: e.target.value })} className="w-full rounded-[10px] border border-input bg-input px-[14px] py-[12px] text-[15px]! text-foreground outline-hidden transition-colors focus:border-accent" />
          </Field>

          <div className="flex items-center justify-between rounded-[12px] border border-border px-[16px] py-[14px]">
            <span className="text-[13px] font-medium text-foreground">Published</span>
            <PublishToggle checked={form.is_published} onChange={(v) => setForm({ ...form, is_published: v })} />
          </div>

          <div className="mt-[8px] flex justify-end gap-[8px]">
            <button type="button" onClick={() => setEditing(null)} className="rounded-[10px] border border-border px-[16px] py-[10px] text-[13px]! font-medium text-foreground transition-colors hover:bg-white/5">
              Cancel
            </button>
            <button type="submit" disabled={saving} className="rounded-[10px] bg-primary px-[16px] py-[10px] text-[13px]! font-medium text-primary-foreground transition-colors hover:bg-primary/90 disabled:opacity-60">
              {saving ? "Saving…" : editing === "new" ? "Add recording" : "Save changes"}
            </button>
          </div>
        </form>
      </Drawer>

      <ConfirmDialog
        open={pendingDelete !== null}
        title="Delete recording?"
        description={`${pendingDelete?.title ?? ""} will be permanently deleted.`}
        confirmLabel={deleting ? "Deleting…" : "Delete"}
        destructive
        onConfirm={confirmDelete}
        onCancel={() => setPendingDelete(null)}
      />
    </div>
  );
}

function Field({ label, required, children }: { label: string; required?: boolean; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-[6px]">
      <label className="text-[12px] font-medium text-muted-foreground">
        {label}
        {required && <span className="text-destructive"> *</span>}
      </label>
      {children}
    </div>
  );
}
