import { useEffect, useMemo, useState, type FormEvent } from "react";
import { Loader2, Plus, Pencil, Trash2, Search, CheckCircle2, Circle } from "lucide-react";
import { supabase } from "@/lib/supabase";
import type { Database } from "@/lib/database.types";
import { useAdminMutation } from "../useAdminMutation";
import { useToast } from "../components/Toast";
import { Drawer } from "../components/Drawer";
import { ConfirmDialog } from "../components/ConfirmDialog";
import { DataTable, type DataTableColumn } from "../components/DataTable";
import { PublishToggle } from "../components/StatusBadge";
import { IdKeyedImageUploader } from "../components/ImageUploader";
import { usePageCache, hasCached } from "../usePageCache";

type AlumniRow = Database["public"]["Tables"]["alumni"]["Row"];

type FormState = {
  name: string;
  firm: string;
  role: string;
  cohort: string;
  location: string;
  linkedin_url: string;
  consent_confirmed: boolean;
  is_published: boolean;
};

const EMPTY_FORM: FormState = {
  name: "",
  firm: "",
  role: "",
  cohort: "",
  location: "",
  linkedin_url: "",
  consent_confirmed: false,
  is_published: false,
};

function headshotUrl(id: string) {
  const { data } = supabase.storage.from("alumni_photos").getPublicUrl(`${id}.jpeg`);
  return data.publicUrl;
}

export function Alumni() {
  const toast = useToast();
  const { insertRow, updateRow, deleteRow } = useAdminMutation();

  const [rows, setRows] = usePageCache<AlumniRow[]>("admin:alumni:rows", []);
  const [loading, setLoading] = useState(!hasCached("admin:alumni:rows"));
  const [publishedFilter, setPublishedFilter] = usePageCache<"all" | "published" | "unpublished">("admin:alumni:publishedFilter", "all");
  const [consentFilter, setConsentFilter] = usePageCache<"all" | "confirmed" | "unconfirmed">("admin:alumni:consentFilter", "all");
  const [search, setSearch] = usePageCache("admin:alumni:search", "");

  const [editing, setEditing] = useState<AlumniRow | "new" | null>(null);
  const [form, setForm] = useState<FormState>(EMPTY_FORM);
  const [photoVersion, setPhotoVersion] = useState(0);
  const [saving, setSaving] = useState(false);
  const [pendingDelete, setPendingDelete] = useState<AlumniRow | null>(null);
  const [deleting, setDeleting] = useState(false);

  const fetchRows = async () => {
    const { data, error } = await supabase.from("alumni").select("*");
    if (error) toast.error("Could not load alumni.");
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
        if (consentFilter === "confirmed" && !r.consent_confirmed) return false;
        if (consentFilter === "unconfirmed" && r.consent_confirmed) return false;
        if (search.trim()) {
          const q = search.trim().toLowerCase();
          if (!r.name.toLowerCase().includes(q) && !r.firm.toLowerCase().includes(q)) return false;
        }
        return true;
      })
      .sort((a, b) => b.cohort.localeCompare(a.cohort) || a.name.localeCompare(b.name));
  }, [rows, publishedFilter, consentFilter, search]);

  const openCreate = () => {
    setForm(EMPTY_FORM);
    setEditing("new");
  };

  const openEdit = (row: AlumniRow) => {
    setForm({
      name: row.name,
      firm: row.firm,
      role: row.role,
      cohort: row.cohort,
      location: row.location ?? "",
      linkedin_url: row.linkedin_url ?? "",
      consent_confirmed: row.consent_confirmed,
      is_published: row.is_published,
    });
    setEditing(row);
  };

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!form.name.trim() || !form.firm.trim() || !form.role.trim() || !form.cohort.trim()) return;
    setSaving(true);
    try {
      const values = {
        name: form.name.trim(),
        firm: form.firm.trim(),
        role: form.role.trim(),
        cohort: form.cohort.trim(),
        location: form.location.trim() || null,
        linkedin_url: form.linkedin_url.trim() || null,
        consent_confirmed: form.consent_confirmed,
        is_published: form.consent_confirmed ? form.is_published : false,
      };
      if (editing === "new") {
        const created = await insertRow("alumni", values);
        toast.success("Alumnus added — you can now upload a photo.");
        setRows((prev) => [...prev, created]);
        setEditing(created);
      } else if (editing) {
        await updateRow("alumni", editing.id, values, editing);
        toast.success("Alumnus updated.");
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
      await deleteRow("alumni", pendingDelete.id, pendingDelete);
      await supabase.storage.from("alumni_photos").remove([`${pendingDelete.id}.jpeg`]);
      toast.success(`${pendingDelete.name} deleted.`);
      setPendingDelete(null);
      fetchRows();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Could not delete that record.");
    } finally {
      setDeleting(false);
    }
  };

  const columns: DataTableColumn<AlumniRow>[] = [
    {
      key: "headshot",
      label: "",
      render: (r) => (
        <div className="h-[36px] w-[36px] overflow-hidden rounded-full border border-border bg-input">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={headshotUrl(r.id)} alt="" className="h-full w-full object-cover" onError={(e) => (e.currentTarget.style.visibility = "hidden")} />
        </div>
      ),
    },
    { key: "name", label: "Name", render: (r) => r.name, sortValue: (r) => r.name },
    { key: "firm", label: "Firm", render: (r) => r.firm, sortValue: (r) => r.firm },
    { key: "role", label: "Role", render: (r) => r.role },
    { key: "cohort", label: "Cohort", render: (r) => r.cohort, sortValue: (r) => r.cohort },
    {
      key: "consent",
      label: "Consent",
      render: (r) =>
        r.consent_confirmed ? (
          <CheckCircle2 className="h-[15px] w-[15px] text-accent" />
        ) : (
          <Circle className="h-[15px] w-[15px] text-muted-foreground" />
        ),
    },
    {
      key: "is_published",
      label: "Published",
      render: (r) => (
        <PublishToggle
          checked={r.is_published}
          disabled={!r.consent_confirmed}
          onChange={async (next) => {
            try {
              await updateRow("alumni", r.id, { is_published: next }, r);
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
          <h1 className="mt-[8px] text-[22px] font-medium text-foreground">Alumni</h1>
        </div>
        <button type="button" onClick={openCreate} className="inline-flex items-center gap-[6px] rounded-[10px] bg-primary px-[16px] py-[10px] text-[13px]! font-medium text-primary-foreground transition-colors hover:bg-primary/90">
          <Plus className="h-[14px] w-[14px]" />
          Add alumnus
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
        <select value={consentFilter} onChange={(e) => setConsentFilter(e.target.value as typeof consentFilter)} className="rounded-[10px] border border-input bg-input px-[12px] py-[10px] text-[13px]! text-foreground outline-hidden">
          <option value="all">Consent: all</option>
          <option value="confirmed">Confirmed</option>
          <option value="unconfirmed">Unconfirmed</option>
        </select>
      </div>

      <div className="mt-[24px]">
        {loading ? (
          <div className="flex items-center justify-center py-[48px] text-muted-foreground">
            <Loader2 className="h-[18px] w-[18px] animate-spin" />
          </div>
        ) : (
          <DataTable columns={columns} data={filtered} keyField={(r) => r.id} onRowClick={openEdit} emptyMessage="No alumni match." />
        )}
      </div>

      <Drawer open={editing !== null} title={editing === "new" ? "Add alumnus" : "Edit alumnus"} onClose={() => setEditing(null)}>
        <form onSubmit={onSubmit} className="flex flex-col gap-[20px]">
          <Field label="Name" required>
            <input type="text" required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="w-full rounded-[10px] border border-input bg-input px-[14px] py-[12px] text-[15px]! text-foreground outline-hidden transition-colors focus:border-accent" />
          </Field>
          <Field label="Firm" required>
            <input type="text" required value={form.firm} onChange={(e) => setForm({ ...form, firm: e.target.value })} className="w-full rounded-[10px] border border-input bg-input px-[14px] py-[12px] text-[15px]! text-foreground outline-hidden transition-colors focus:border-accent" />
          </Field>
          <Field label="Role" required>
            <input type="text" required value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })} className="w-full rounded-[10px] border border-input bg-input px-[14px] py-[12px] text-[15px]! text-foreground outline-hidden transition-colors focus:border-accent" />
          </Field>
          <Field label="Cohort" required>
            <input type="text" required placeholder="e.g. 2024" value={form.cohort} onChange={(e) => setForm({ ...form, cohort: e.target.value })} className="w-full rounded-[10px] border border-input bg-input px-[14px] py-[12px] text-[15px]! text-foreground outline-hidden transition-colors focus:border-accent" />
          </Field>
          <Field label="Location">
            <input type="text" value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })} className="w-full rounded-[10px] border border-input bg-input px-[14px] py-[12px] text-[15px]! text-foreground outline-hidden transition-colors focus:border-accent" />
          </Field>
          <Field label="LinkedIn URL">
            <input type="url" placeholder="https://…" value={form.linkedin_url} onChange={(e) => setForm({ ...form, linkedin_url: e.target.value })} className="w-full rounded-[10px] border border-input bg-input px-[14px] py-[12px] text-[15px]! text-foreground outline-hidden transition-colors focus:border-accent" />
          </Field>

          <div className="flex items-center justify-between rounded-[12px] border border-border px-[16px] py-[14px]">
            <span className="text-[13px] font-medium text-foreground">Consent confirmed</span>
            <PublishToggle
              checked={form.consent_confirmed}
              onChange={(v) => setForm({ ...form, consent_confirmed: v, is_published: v ? form.is_published : false })}
            />
          </div>
          <div className={`flex items-center justify-between rounded-[12px] border px-[16px] py-[14px] ${form.consent_confirmed ? "border-border" : "border-border opacity-50"}`}>
            <div>
              <span className="text-[13px] font-medium text-foreground">Published</span>
              {!form.consent_confirmed && <p className="mt-[2px] text-[12px] text-muted-foreground">Requires consent confirmed.</p>}
            </div>
            <PublishToggle checked={form.is_published} disabled={!form.consent_confirmed} onChange={(v) => setForm({ ...form, is_published: v })} />
          </div>

          <Field label="Photo">
            {editing === "new" ? (
              <p className="text-[13px] text-muted-foreground">Save this record first, then a photo uploader appears here.</p>
            ) : editing ? (
              <IdKeyedImageUploader key={photoVersion} bucket="alumni_photos" id={editing.id} currentUrl={headshotUrl(editing.id)} aspect="square" onUploaded={() => setPhotoVersion((v) => v + 1)} />
            ) : null}
          </Field>

          <div className="mt-[8px] flex justify-end gap-[8px]">
            <button type="button" onClick={() => setEditing(null)} className="rounded-[10px] border border-border px-[16px] py-[10px] text-[13px]! font-medium text-foreground transition-colors hover:bg-white/5">
              {editing !== "new" ? "Close" : "Cancel"}
            </button>
            <button type="submit" disabled={saving} className="rounded-[10px] bg-primary px-[16px] py-[10px] text-[13px]! font-medium text-primary-foreground transition-colors hover:bg-primary/90 disabled:opacity-60">
              {saving ? "Saving…" : editing === "new" ? "Add alumnus" : "Save changes"}
            </button>
          </div>
        </form>
      </Drawer>

      <ConfirmDialog
        open={pendingDelete !== null}
        title="Delete this alumnus record?"
        description={`This will permanently remove ${pendingDelete?.name ?? "this"}'s record, including their employer and contact details.`}
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
