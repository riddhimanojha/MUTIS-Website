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
import { IdKeyedImageUploader } from "../components/ImageUploader";
import { usePageCache, hasCached, useDrawerFormCache } from "../usePageCache";

type SpeakerRow = Database["public"]["Tables"]["past_speakers"]["Row"];

type FormState = {
  name: string;
  firm: string;
  role: string;
  event: string;
  is_published: boolean;
};

const EMPTY_FORM: FormState = { name: "", firm: "", role: "", event: "", is_published: true };

function photoUrl(id: string) {
  const { data } = supabase.storage.from("speaker_photos").getPublicUrl(`${id}.jpeg`);
  return data.publicUrl;
}

export function PastSpeakers() {
  const toast = useToast();
  const { insertRow, updateRow, deleteRow } = useAdminMutation();

  const [rows, setRows] = usePageCache<SpeakerRow[]>("admin:pastSpeakers:rows", []);
  const [loading, setLoading] = useState(!hasCached("admin:pastSpeakers:rows"));
  const [publishedFilter, setPublishedFilter] = usePageCache<"all" | "published" | "unpublished">("admin:pastSpeakers:publishedFilter", "all");
  const [search, setSearch] = usePageCache("admin:pastSpeakers:search", "");

  const { editing, setEditing, form, setForm, pendingDelete, setPendingDelete, closeDrawer, discardConfirmProps } =
    useDrawerFormCache<SpeakerRow, FormState>("pastSpeakers", EMPTY_FORM);
  const [photoVersion, setPhotoVersion] = useState(0);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const fetchRows = async () => {
    const { data, error } = await supabase.from("past_speakers").select("*");
    if (error) toast.error("Could not load past speakers.");
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
          if (!r.name.toLowerCase().includes(q) && !r.firm.toLowerCase().includes(q)) return false;
        }
        return true;
      })
      .sort((a, b) => b.created_at.localeCompare(a.created_at));
  }, [rows, publishedFilter, search]);

  const openCreate = () => {
    setForm(EMPTY_FORM);
    setEditing("new");
  };

  const openEdit = (row: SpeakerRow) => {
    setForm({ name: row.name, firm: row.firm, role: row.role, event: row.event, is_published: row.is_published });
    setEditing(row);
  };

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!form.name.trim() || !form.firm.trim() || !form.role.trim() || !form.event.trim()) return;
    setSaving(true);
    try {
      const values = {
        name: form.name.trim(),
        firm: form.firm.trim(),
        role: form.role.trim(),
        event: form.event.trim(),
        is_published: form.is_published,
      };
      if (editing === "new") {
        const created = await insertRow("past_speakers", values);
        toast.success("Speaker added — you can now upload a photo.");
        setRows((prev) => [...prev, created]);
        setEditing(created);
      } else if (editing) {
        await updateRow("past_speakers", editing.id, values, editing);
        toast.success("Speaker updated.");
        setEditing(null);
        fetchRows();
      }
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Could not save that speaker.");
    } finally {
      setSaving(false);
    }
  };

  const confirmDelete = async () => {
    if (!pendingDelete) return;
    setDeleting(true);
    try {
      await deleteRow("past_speakers", pendingDelete.id, pendingDelete);
      await supabase.storage.from("speaker_photos").remove([`${pendingDelete.id}.jpeg`]);
      toast.success(`${pendingDelete.name} deleted.`);
      setPendingDelete(null);
      fetchRows();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Could not delete that speaker.");
    } finally {
      setDeleting(false);
    }
  };

  const columns: DataTableColumn<SpeakerRow>[] = [
    {
      key: "photo",
      label: "",
      render: (r) => (
        <div className="h-[36px] w-[36px] overflow-hidden rounded-full border border-border bg-input">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={photoUrl(r.id)} alt="" className="h-full w-full object-cover" onError={(e) => (e.currentTarget.style.visibility = "hidden")} />
        </div>
      ),
    },
    { key: "name", label: "Name", render: (r) => r.name, sortValue: (r) => r.name },
    { key: "firm", label: "Firm", render: (r) => r.firm },
    { key: "role", label: "Role", render: (r) => r.role },
    { key: "event", label: "Event", render: (r) => r.event },
    {
      key: "is_published",
      label: "Published",
      render: (r) => (
        <PublishToggle
          checked={r.is_published}
          onChange={async (next) => {
            try {
              await updateRow("past_speakers", r.id, { is_published: next }, r);
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
          <h1 className="mt-[8px] text-[22px] font-medium text-foreground">Past Speakers</h1>
        </div>
        <button type="button" onClick={openCreate} className="inline-flex items-center gap-[6px] rounded-[10px] bg-primary px-[16px] py-[10px] text-[13px]! font-medium text-primary-foreground transition-colors hover:bg-primary/90">
          <Plus className="h-[14px] w-[14px]" />
          Add speaker
        </button>
      </div>

      <div className="mt-[24px] flex flex-wrap items-center gap-[8px]">
        <div className="relative">
          <Search className="pointer-events-none absolute left-[12px] top-1/2 h-[14px] w-[14px] -translate-y-1/2 text-muted-foreground" />
          <input type="text" placeholder="Search by name or firm…" value={search} onChange={(e) => setSearch(e.target.value)} className="w-[240px] rounded-[10px] border border-input bg-input py-[10px] pl-[36px] pr-[12px] text-[14px]! text-foreground outline-hidden transition-colors focus:border-accent" />
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
          <DataTable columns={columns} data={filtered} keyField={(r) => r.id} onRowClick={openEdit} emptyMessage="No speakers match." />
        )}
      </div>

      <Drawer open={editing !== null} title={editing === "new" ? "Add speaker" : "Edit speaker"} onClose={closeDrawer}>
        <form onSubmit={onSubmit} className="flex flex-col gap-[20px]">
          <Field label="Name" required>
            <input type="text" required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="w-full rounded-[10px] border border-input bg-input px-[14px] py-[12px] text-[15px]! text-foreground outline-hidden transition-colors focus:border-accent" />
          </Field>
          <Field label="Firm" required>
            <input type="text" required value={form.firm} onChange={(e) => setForm({ ...form, firm: e.target.value })} className="w-full rounded-[10px] border border-input bg-input px-[14px] py-[12px] text-[15px]! text-foreground outline-hidden transition-colors focus:border-accent" />
          </Field>
          <Field label="Role" required>
            <input type="text" required placeholder="Managing Director" value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })} className="w-full rounded-[10px] border border-input bg-input px-[14px] py-[12px] text-[15px]! text-foreground outline-hidden transition-colors focus:border-accent" />
          </Field>
          <Field label="Event" required>
            <input type="text" required placeholder="Fireside Chat 2024" value={form.event} onChange={(e) => setForm({ ...form, event: e.target.value })} className="w-full rounded-[10px] border border-input bg-input px-[14px] py-[12px] text-[15px]! text-foreground outline-hidden transition-colors focus:border-accent" />
          </Field>

          <div className="flex items-center justify-between rounded-[12px] border border-border px-[16px] py-[14px]">
            <span className="text-[13px] font-medium text-foreground">Published</span>
            <PublishToggle checked={form.is_published} onChange={(v) => setForm({ ...form, is_published: v })} />
          </div>

          <Field label="Photo">
            {editing === "new" ? (
              <p className="text-[13px] text-muted-foreground">Save this record first, then a photo uploader appears here.</p>
            ) : editing ? (
              <IdKeyedImageUploader key={photoVersion} bucket="speaker_photos" id={editing.id} currentUrl={photoUrl(editing.id)} aspect="square" onUploaded={() => setPhotoVersion((v) => v + 1)} />
            ) : null}
          </Field>

          <div className="mt-[8px] flex justify-end gap-[8px]">
            <button type="button" onClick={closeDrawer} className="rounded-[10px] border border-border px-[16px] py-[10px] text-[13px]! font-medium text-foreground transition-colors hover:bg-white/5">
              {editing !== "new" ? "Close" : "Cancel"}
            </button>
            <button type="submit" disabled={saving} className="rounded-[10px] bg-primary px-[16px] py-[10px] text-[13px]! font-medium text-primary-foreground transition-colors hover:bg-primary/90 disabled:opacity-60">
              {saving ? "Saving…" : editing === "new" ? "Add speaker" : "Save changes"}
            </button>
          </div>
        </form>
      </Drawer>

      <ConfirmDialog
        open={pendingDelete !== null}
        title="Delete speaker?"
        description={`${pendingDelete?.name ?? ""} will be permanently deleted.`}
        confirmLabel={deleting ? "Deleting…" : "Delete"}
        destructive
        onConfirm={confirmDelete}
        onCancel={() => setPendingDelete(null)}
      />

      <ConfirmDialog {...discardConfirmProps} />
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
