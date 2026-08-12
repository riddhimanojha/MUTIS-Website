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

type FundManagerRow = Database["public"]["Tables"]["fund_managers"]["Row"];

type FormState = {
  year_label: string;
  start_year: string;
  name: string;
  linkedin_url: string;
  is_published: boolean;
};

const EMPTY_FORM: FormState = { year_label: "", start_year: "", name: "", linkedin_url: "", is_published: true };

function photoUrl(id: string) {
  const { data } = supabase.storage.from("fund_manager_photos").getPublicUrl(`${id}.jpeg`);
  return data.publicUrl;
}

export function FundManagers() {
  const toast = useToast();
  const { insertRow, updateRow, deleteRow } = useAdminMutation();

  const [rows, setRows] = useState<FundManagerRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [publishedFilter, setPublishedFilter] = useState<"all" | "published" | "unpublished">("all");
  const [search, setSearch] = useState("");

  const [editing, setEditing] = useState<FundManagerRow | "new" | null>(null);
  const [form, setForm] = useState<FormState>(EMPTY_FORM);
  const [photoVersion, setPhotoVersion] = useState(0);
  const [saving, setSaving] = useState(false);
  const [pendingDelete, setPendingDelete] = useState<FundManagerRow | null>(null);
  const [deleting, setDeleting] = useState(false);

  const fetchRows = async () => {
    setLoading(true);
    const { data, error } = await supabase.from("fund_managers").select("*");
    if (error) toast.error("Could not load fund managers.");
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
          if (!r.name.toLowerCase().includes(q) && !r.year_label.toLowerCase().includes(q)) return false;
        }
        return true;
      })
      .sort((a, b) => b.start_year - a.start_year);
  }, [rows, publishedFilter, search]);

  const openCreate = () => {
    setForm(EMPTY_FORM);
    setEditing("new");
  };

  const openEdit = (row: FundManagerRow) => {
    setForm({
      year_label: row.year_label,
      start_year: String(row.start_year),
      name: row.name,
      linkedin_url: row.linkedin_url ?? "",
      is_published: row.is_published,
    });
    setEditing(row);
  };

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!form.year_label.trim() || !form.start_year.trim() || !form.name.trim()) return;
    setSaving(true);
    try {
      const values = {
        year_label: form.year_label.trim(),
        start_year: Number(form.start_year),
        name: form.name.trim(),
        linkedin_url: form.linkedin_url.trim() || null,
        is_published: form.is_published,
      };
      if (editing === "new") {
        const created = await insertRow("fund_managers", values);
        toast.success("Fund manager added — you can now upload a photo.");
        setRows((prev) => [...prev, created]);
        setEditing(created);
      } else if (editing) {
        await updateRow("fund_managers", editing.id, values, editing);
        toast.success("Fund manager updated.");
        setEditing(null);
        fetchRows();
      }
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Could not save that record.");
    } finally {
      setSaving(false);
    }
  };

  const confirmDelete = async () => {
    if (!pendingDelete) return;
    setDeleting(true);
    try {
      await deleteRow("fund_managers", pendingDelete.id, pendingDelete);
      await supabase.storage.from("fund_manager_photos").remove([`${pendingDelete.id}.jpeg`]);
      toast.success(`${pendingDelete.name} deleted.`);
      setPendingDelete(null);
      fetchRows();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Could not delete that record.");
    } finally {
      setDeleting(false);
    }
  };

  const columns: DataTableColumn<FundManagerRow>[] = [
    {
      key: "headshot",
      label: "",
      render: (r) => (
        <div className="h-[36px] w-[36px] overflow-hidden rounded-full border border-border bg-input">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={photoUrl(r.id)} alt="" className="h-full w-full object-cover" onError={(e) => (e.currentTarget.style.visibility = "hidden")} />
        </div>
      ),
    },
    { key: "year_label", label: "Year", render: (r) => r.year_label, sortValue: (r) => r.start_year },
    { key: "name", label: "Name", render: (r) => r.name, sortValue: (r) => r.name },
    {
      key: "is_published",
      label: "Published",
      render: (r) => (
        <PublishToggle
          checked={r.is_published}
          onChange={async (next) => {
            try {
              await updateRow("fund_managers", r.id, { is_published: next }, r);
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
          <h1 className="mt-[8px] text-[22px] font-medium text-foreground">MEIF Fund Managers</h1>
        </div>
        <button type="button" onClick={openCreate} className="inline-flex items-center gap-[6px] rounded-[10px] bg-primary px-[16px] py-[10px] text-[13px]! font-medium text-primary-foreground transition-colors hover:bg-primary/90">
          <Plus className="h-[14px] w-[14px]" />
          Add fund manager
        </button>
      </div>

      <div className="mt-[24px] flex flex-wrap items-center gap-[8px]">
        <div className="relative">
          <Search className="pointer-events-none absolute left-[12px] top-1/2 h-[14px] w-[14px] -translate-y-1/2 text-muted-foreground" />
          <input type="text" placeholder="Search by name or year…" value={search} onChange={(e) => setSearch(e.target.value)} className="w-[240px] rounded-[10px] border border-input bg-input py-[10px] pl-[36px] pr-[12px] text-[14px]! text-foreground outline-hidden transition-colors focus:border-accent" />
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
          <DataTable columns={columns} data={filtered} keyField={(r) => r.id} onRowClick={openEdit} emptyMessage="No fund managers match." />
        )}
      </div>

      <Drawer open={editing !== null} title={editing === "new" ? "Add fund manager" : "Edit fund manager"} onClose={() => setEditing(null)}>
        <form onSubmit={onSubmit} className="flex flex-col gap-[20px]">
          <Field label="Start year" required>
            <input type="number" required value={form.start_year} onChange={(e) => setForm({ ...form, start_year: e.target.value })} className="w-full rounded-[10px] border border-input bg-input px-[14px] py-[12px] text-[15px]! text-foreground outline-hidden transition-colors focus:border-accent" />
          </Field>
          <Field label="Year label" required>
            <input type="text" required placeholder="2025–2026" value={form.year_label} onChange={(e) => setForm({ ...form, year_label: e.target.value })} className="w-full rounded-[10px] border border-input bg-input px-[14px] py-[12px] text-[15px]! text-foreground outline-hidden transition-colors focus:border-accent" />
          </Field>
          <Field label="Name" required>
            <input type="text" required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="w-full rounded-[10px] border border-input bg-input px-[14px] py-[12px] text-[15px]! text-foreground outline-hidden transition-colors focus:border-accent" />
          </Field>
          <Field label="LinkedIn URL">
            <input type="url" placeholder="https://…" value={form.linkedin_url} onChange={(e) => setForm({ ...form, linkedin_url: e.target.value })} className="w-full rounded-[10px] border border-input bg-input px-[14px] py-[12px] text-[15px]! text-foreground outline-hidden transition-colors focus:border-accent" />
          </Field>

          <div className="flex items-center justify-between rounded-[12px] border border-border px-[16px] py-[14px]">
            <span className="text-[13px] font-medium text-foreground">Published</span>
            <PublishToggle checked={form.is_published} onChange={(v) => setForm({ ...form, is_published: v })} />
          </div>

          <Field label="Photo">
            {editing === "new" ? (
              <p className="text-[13px] text-muted-foreground">Save this record first, then a photo uploader appears here.</p>
            ) : editing ? (
              <IdKeyedImageUploader key={photoVersion} bucket="fund_manager_photos" id={editing.id} currentUrl={photoUrl(editing.id)} aspect="square" onUploaded={() => setPhotoVersion((v) => v + 1)} />
            ) : null}
          </Field>

          <div className="mt-[8px] flex justify-end gap-[8px]">
            <button type="button" onClick={() => setEditing(null)} className="rounded-[10px] border border-border px-[16px] py-[10px] text-[13px]! font-medium text-foreground transition-colors hover:bg-white/5">
              {editing !== "new" ? "Close" : "Cancel"}
            </button>
            <button type="submit" disabled={saving} className="rounded-[10px] bg-primary px-[16px] py-[10px] text-[13px]! font-medium text-primary-foreground transition-colors hover:bg-primary/90 disabled:opacity-60">
              {saving ? "Saving…" : editing === "new" ? "Add fund manager" : "Save changes"}
            </button>
          </div>
        </form>
      </Drawer>

      <ConfirmDialog
        open={pendingDelete !== null}
        title="Delete fund manager?"
        description={`${pendingDelete?.name ?? ""} will be permanently deleted.`}
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
