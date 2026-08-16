import { useEffect, useMemo, useState, type FormEvent } from "react";
import { Loader2, Plus, Pencil, Trash2, Search, FileText, ExternalLink } from "lucide-react";
import { supabase } from "@/lib/supabase";
import type { Database } from "@/lib/database.types";
import { meifTeams } from "@/app/data/siteData";
import { useAdminMutation } from "../useAdminMutation";
import { useToast } from "../components/Toast";
import { Drawer } from "../components/Drawer";
import { ConfirmDialog } from "../components/ConfirmDialog";
import { DataTable, type DataTableColumn } from "../components/DataTable";
import { PublishToggle } from "../components/StatusBadge";
import { usePageCache, hasCached } from "../usePageCache";

type DocumentRow = Database["public"]["Tables"]["documents"]["Row"];
type Category = "general" | "meif_coverage";

type FormState = {
  title: string;
  description: string;
  category: Category;
  team_id: string;
  is_published: boolean;
};

const EMPTY_FORM: FormState = {
  title: "",
  description: "",
  category: "general",
  team_id: meifTeams[0]?.id ?? "",
  is_published: true,
};

function documentUrl(path: string) {
  return supabase.storage.from("documents").getPublicUrl(path).data.publicUrl;
}

function formatBytes(bytes: number | null) {
  if (!bytes) return "—";
  if (bytes < 1024 * 1024) return `${Math.round(bytes / 1024)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export function Documents() {
  const toast = useToast();
  const { insertRow, updateRow, deleteRow } = useAdminMutation();

  const [rows, setRows] = usePageCache<DocumentRow[]>("admin:documents:rows", []);
  const [loading, setLoading] = useState(!hasCached("admin:documents:rows"));
  const [search, setSearch] = usePageCache("admin:documents:search", "");

  const [editing, setEditing] = useState<DocumentRow | "new" | null>(null);
  const [form, setForm] = useState<FormState>(EMPTY_FORM);
  const [file, setFile] = useState<File | null>(null);
  const [saving, setSaving] = useState(false);
  const [pendingDelete, setPendingDelete] = useState<DocumentRow | null>(null);
  const [deleting, setDeleting] = useState(false);

  const fetchRows = async () => {
    const { data, error } = await supabase.from("documents").select("*").order("created_at", { ascending: false });
    if (error) toast.error("Could not load documents.");
    else setRows(data);
    setLoading(false);
  };

  useEffect(() => {
    fetchRows();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const filtered = useMemo(() => {
    if (!search.trim()) return rows;
    const q = search.trim().toLowerCase();
    return rows.filter((r) => r.title.toLowerCase().includes(q));
  }, [rows, search]);

  const teamName = (teamId: string | null) => meifTeams.find((t) => t.id === teamId)?.name ?? teamId ?? "—";

  const openCreate = () => {
    setForm(EMPTY_FORM);
    setFile(null);
    setEditing("new");
  };

  const openEdit = (row: DocumentRow) => {
    setForm({
      title: row.title,
      description: row.description ?? "",
      category: (row.category as Category) ?? "general",
      team_id: row.team_id ?? meifTeams[0]?.id ?? "",
      is_published: row.is_published,
    });
    setFile(null);
    setEditing(row);
  };

  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const picked = e.target.files?.[0] ?? null;
    e.target.value = "";
    if (picked && picked.type !== "application/pdf") {
      toast.error("Please choose a PDF file.");
      return;
    }
    setFile(picked);
  };

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!form.title.trim()) return;
    if (editing === "new" && !file) {
      toast.error("Choose a PDF to upload.");
      return;
    }
    setSaving(true);
    try {
      let storagePath = editing !== "new" && editing ? editing.storage_path : "";
      let fileSizeBytes = editing !== "new" && editing ? editing.file_size_bytes : null;

      if (file) {
        const path = `${crypto.randomUUID()}.pdf`;
        const { error: uploadError } = await supabase.storage
          .from("documents")
          .upload(path, file, { contentType: "application/pdf" });
        if (uploadError) throw uploadError;

        // Replacing an existing file: drop the old object now that the new one is up.
        if (editing !== "new" && editing?.storage_path) {
          await supabase.storage.from("documents").remove([editing.storage_path]);
        }
        storagePath = path;
        fileSizeBytes = file.size;
      }

      const values = {
        title: form.title.trim(),
        description: form.description.trim() || null,
        category: form.category,
        team_id: form.category === "meif_coverage" ? form.team_id : null,
        storage_path: storagePath,
        file_size_bytes: fileSizeBytes,
        is_published: form.is_published,
      };

      if (editing === "new") {
        const created = await insertRow("documents", values);
        toast.success("Document added.");
        setRows((prev) => [created, ...prev]);
        setEditing(null);
      } else if (editing) {
        const updated = await updateRow("documents", editing.id, values, editing);
        toast.success("Document updated.");
        setRows((prev) => prev.map((r) => (r.id === updated.id ? updated : r)));
        setEditing(null);
      }
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Could not save that document.");
    } finally {
      setSaving(false);
    }
  };

  const confirmDelete = async () => {
    if (!pendingDelete) return;
    setDeleting(true);
    try {
      await deleteRow("documents", pendingDelete.id, pendingDelete);
      await supabase.storage.from("documents").remove([pendingDelete.storage_path]);
      toast.success(`${pendingDelete.title} deleted.`);
      setRows((prev) => prev.filter((r) => r.id !== pendingDelete.id));
      setPendingDelete(null);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Could not delete that document.");
    } finally {
      setDeleting(false);
    }
  };

  const columns: DataTableColumn<DocumentRow>[] = [
    {
      key: "title",
      label: "Title",
      render: (r) => (
        <div className="flex items-center gap-[8px]">
          <FileText className="h-[14px] w-[14px] shrink-0 text-muted-foreground" />
          {r.title}
        </div>
      ),
      sortValue: (r) => r.title,
    },
    {
      key: "category",
      label: "Category",
      render: (r) => (r.category === "meif_coverage" ? `MEIF · ${teamName(r.team_id)}` : "General"),
    },
    { key: "size", label: "Size", render: (r) => formatBytes(r.file_size_bytes) },
    {
      key: "is_published",
      label: "Published",
      render: (r) => (
        <PublishToggle
          checked={r.is_published}
          onChange={async (next) => {
            try {
              await updateRow("documents", r.id, { is_published: next }, r);
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
          <a href={documentUrl(r.storage_path)} target="_blank" rel="noreferrer" onClick={(e) => e.stopPropagation()} title="Open PDF" className="rounded-[8px] p-[6px] text-muted-foreground transition-colors hover:bg-white/5 hover:text-foreground">
            <ExternalLink className="h-[14px] w-[14px]" />
          </a>
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
          <h1 className="mt-[8px] text-[22px] font-medium text-foreground">Documents</h1>
          <p className="mt-[8px] text-[13px] text-muted-foreground">
            PDFs shown inline via the site's document viewer — MEIF coverage notes, and any other
            downloadable document.
          </p>
        </div>
        <button type="button" onClick={openCreate} className="inline-flex items-center gap-[6px] rounded-[10px] bg-primary px-[16px] py-[10px] text-[13px]! font-medium text-primary-foreground transition-colors hover:bg-primary/90">
          <Plus className="h-[14px] w-[14px]" />
          Add document
        </button>
      </div>

      <div className="mt-[24px] flex flex-wrap items-center gap-[8px]">
        <div className="relative">
          <Search className="pointer-events-none absolute left-[12px] top-1/2 h-[14px] w-[14px] -translate-y-1/2 text-muted-foreground" />
          <input type="text" placeholder="Search by title…" value={search} onChange={(e) => setSearch(e.target.value)} className="w-[240px] rounded-[10px] border border-input bg-input py-[10px] pl-[36px] pr-[12px] text-[14px]! text-foreground outline-hidden transition-colors focus:border-accent" />
        </div>
      </div>

      <div className="mt-[24px]">
        {loading ? (
          <div className="flex items-center justify-center py-[48px] text-muted-foreground">
            <Loader2 className="h-[18px] w-[18px] animate-spin" />
          </div>
        ) : (
          <DataTable columns={columns} data={filtered} keyField={(r) => r.id} onRowClick={openEdit} emptyMessage="No documents yet." />
        )}
      </div>

      <Drawer open={editing !== null} title={editing === "new" ? "Add document" : "Edit document"} onClose={() => setEditing(null)}>
        <form onSubmit={onSubmit} className="flex flex-col gap-[20px]">
          <Field label="Title" required>
            <input type="text" required value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} className="w-full rounded-[10px] border border-input bg-input px-[14px] py-[12px] text-[15px]! text-foreground outline-hidden transition-colors focus:border-accent" />
          </Field>

          <Field label="Description">
            <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} rows={3} className="w-full rounded-[10px] border border-input bg-input px-[14px] py-[12px] text-[14px]! text-foreground outline-hidden transition-colors focus:border-accent" />
          </Field>

          <Field label="Category">
            <select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value as Category })} className="w-full rounded-[10px] border border-input bg-input px-[14px] py-[12px] text-[15px]! text-foreground outline-hidden transition-colors focus:border-accent">
              <option value="general">General</option>
              <option value="meif_coverage">MEIF coverage note</option>
            </select>
          </Field>

          {form.category === "meif_coverage" && (
            <Field label="MEIF sector team">
              <select value={form.team_id} onChange={(e) => setForm({ ...form, team_id: e.target.value })} className="w-full rounded-[10px] border border-input bg-input px-[14px] py-[12px] text-[15px]! text-foreground outline-hidden transition-colors focus:border-accent">
                {meifTeams.map((t) => (
                  <option key={t.id} value={t.id}>{t.name}</option>
                ))}
              </select>
            </Field>
          )}

          <Field label={editing === "new" ? "PDF file" : "Replace PDF file"} required={editing === "new"}>
            <input type="file" accept="application/pdf" onChange={onFileChange} className="w-full text-[13px]! text-foreground" />
            {editing !== "new" && editing && !file && (
              <p className="mt-[6px] text-[12px] text-muted-foreground">
                Current file: {formatBytes(editing.file_size_bytes)}. Choose a new file to replace it.
              </p>
            )}
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
              {saving ? "Saving…" : editing === "new" ? "Add document" : "Save changes"}
            </button>
          </div>
        </form>
      </Drawer>

      <ConfirmDialog
        open={pendingDelete !== null}
        title="Delete this document?"
        description={`This permanently removes "${pendingDelete?.title ?? ""}" and its file from storage.`}
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
