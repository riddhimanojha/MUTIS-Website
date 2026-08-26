import { useEffect, useMemo, useState, type FormEvent } from "react";
import { Loader2, Plus, Pencil, Trash2, Search, Linkedin } from "lucide-react";
import { supabase } from "@/lib/supabase";
import type { Database } from "@/lib/database.types";
import { useAdminMutation } from "../useAdminMutation";
import { useToast } from "../components/Toast";
import { Drawer } from "../components/Drawer";
import { ConfirmDialog } from "../components/ConfirmDialog";
import { ReorderableList } from "../components/ReorderableList";
import { DataTable, type DataTableColumn } from "../components/DataTable";
import { PublishToggle } from "../components/StatusBadge";
import { IdKeyedImageUploader } from "../components/ImageUploader";
import { useIsMobile } from "../components/useIsMobile";
import { usePageCache, hasCached, useDrawerFormCache } from "../usePageCache";

type Member = Database["public"]["Tables"]["committee_members"]["Row"];

type FormState = {
  name: string;
  role: string;
  linkedin_url: string;
  is_active: boolean;
};

const EMPTY_FORM: FormState = { name: "", role: "", linkedin_url: "", is_active: true };

// The storage CDN caches this deterministic path at the edge; a reupload purges it
// server-side, but that purge can lag at edges other than the one that served it.
// Appending updated_at guarantees a URL that edge has never cached, independent of
// purge propagation.
function headshotUrl(id: string, updatedAt: string) {
  const { data } = supabase.storage.from("committee_photos").getPublicUrl(`${id}.jpeg`);
  return `${data.publicUrl}?v=${new Date(updatedAt).getTime()}`;
}

export function Committee() {
  const toast = useToast();
  const { insertRow, updateRow, deleteRow } = useAdminMutation();

  const [rows, setRows] = usePageCache<Member[]>("admin:committee:rows", []);
  const [loading, setLoading] = useState(!hasCached("admin:committee:rows"));
  const [activeFilter, setActiveFilter] = usePageCache<"all" | "active" | "inactive">("admin:committee:activeFilter", "all");
  const [search, setSearch] = usePageCache("admin:committee:search", "");

  const { editing, setEditing, form, setForm, pendingDelete, setPendingDelete, closeDrawer, discardConfirmProps } =
    useDrawerFormCache<Member, FormState>("committee", EMPTY_FORM);
  const [photoVersion, setPhotoVersion] = useState(0);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const fetchRows = async () => {
    const { data, error } = await supabase.from("committee_members").select("*");
    if (error) toast.error("Could not load committee members.");
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
        if (activeFilter === "active" && !r.is_active) return false;
        if (activeFilter === "inactive" && r.is_active) return false;
        if (search.trim()) {
          const q = search.trim().toLowerCase();
          if (!r.name.toLowerCase().includes(q) && !r.role.toLowerCase().includes(q)) return false;
        }
        return true;
      })
      .sort((a, b) => a.display_order - b.display_order);
  }, [rows, activeFilter, search]);

  const isMobile = useIsMobile();
  const isReordering = search.trim() === "" && activeFilter === "all" && !isMobile;

  const openCreate = () => {
    setForm(EMPTY_FORM);
    setEditing("new");
  };

  const openEdit = (row: Member) => {
    setForm({ name: row.name, role: row.role, linkedin_url: row.linkedin_url ?? "", is_active: row.is_active });
    setEditing(row);
  };

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!form.name.trim() || !form.role.trim()) return;
    setSaving(true);
    try {
      const values = {
        name: form.name.trim(),
        role: form.role.trim(),
        linkedin_url: form.linkedin_url.trim() || null,
        is_active: form.is_active,
      };
      if (editing === "new") {
        const nextOrder = rows.length ? Math.max(...rows.map((r) => r.display_order)) + 1 : 0;
        const created = await insertRow("committee_members", { ...values, display_order: nextOrder });
        toast.success("Committee member added — you can now upload a photo.");
        setRows((prev) => [...prev, created]);
        setEditing(created);
      } else if (editing) {
        await updateRow("committee_members", editing.id, values, editing);
        toast.success("Committee member updated.");
        setEditing(null);
        fetchRows();
      }
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Could not save that member.");
    } finally {
      setSaving(false);
    }
  };

  const confirmDelete = async () => {
    if (!pendingDelete) return;
    setDeleting(true);
    try {
      await deleteRow("committee_members", pendingDelete.id, pendingDelete);
      await supabase.storage.from("committee_photos").remove([`${pendingDelete.id}.jpeg`]);
      toast.success(`${pendingDelete.name} deleted.`);
      setPendingDelete(null);
      fetchRows();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Could not delete that member.");
    } finally {
      setDeleting(false);
    }
  };

  const onReorder = async (orderedIds: string[]) => {
    const byId = new Map(rows.map((r) => [r.id, r]));
    const updates: { id: string; display_order: number; previous: Member }[] = [];
    orderedIds.forEach((id, index) => {
      const row = byId.get(id);
      if (row && row.display_order !== index) updates.push({ id, display_order: index, previous: row });
    });
    if (updates.length === 0) return;
    setRows((prev) => prev.map((r) => {
      const match = updates.find((u) => u.id === r.id);
      return match ? { ...r, display_order: match.display_order } : r;
    }));
    try {
      await Promise.all(updates.map((u) => updateRow("committee_members", u.id, { display_order: u.display_order }, u.previous)));
    } catch {
      toast.error("Could not save the new order.");
      fetchRows();
    }
  };

  const columns: DataTableColumn<Member>[] = [
    {
      key: "headshot",
      label: "",
      render: (r) => (
        <div className="h-[36px] w-[36px] overflow-hidden rounded-full border border-border bg-input">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={headshotUrl(r.id, r.updated_at)} alt="" className="h-full w-full object-cover" onError={(e) => (e.currentTarget.style.visibility = "hidden")} />
        </div>
      ),
    },
    { key: "name", label: "Name", render: (r) => r.name, sortValue: (r) => r.name },
    { key: "role", label: "Role", render: (r) => r.role, sortValue: (r) => r.role },
    { key: "linkedin", label: "LinkedIn", render: (r) => (r.linkedin_url ? <Linkedin className="h-[14px] w-[14px] text-accent" /> : "—") },
    {
      key: "is_active",
      label: "Active",
      render: (r) => (
        <PublishToggle
          checked={r.is_active}
          onChange={async (next) => {
            try {
              await updateRow("committee_members", r.id, { is_active: next }, r);
              setRows((prev) => prev.map((x) => (x.id === r.id ? { ...x, is_active: next } : x)));
            } catch {
              toast.error("Could not update active state.");
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
          <h1 className="mt-[8px] text-[22px] font-medium text-foreground">Committee</h1>
        </div>
        <button type="button" onClick={openCreate} className="inline-flex items-center gap-[6px] rounded-[10px] bg-primary px-[16px] py-[10px] text-[13px]! font-medium text-primary-foreground transition-colors hover:bg-primary/90">
          <Plus className="h-[14px] w-[14px]" />
          Add member
        </button>
      </div>

      <div className="mt-[24px] flex flex-wrap items-center gap-[8px]">
        <div className="relative">
          <Search className="pointer-events-none absolute left-[12px] top-1/2 h-[14px] w-[14px] -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search by name or role…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-[240px] rounded-[10px] border border-input bg-input py-[10px] pl-[36px] pr-[12px] text-[14px]! text-foreground outline-hidden transition-colors focus:border-accent"
          />
        </div>
        <select value={activeFilter} onChange={(e) => setActiveFilter(e.target.value as typeof activeFilter)} className="rounded-[10px] border border-input bg-input px-[12px] py-[10px] text-[13px]! text-foreground outline-hidden">
          <option value="all">All members</option>
          <option value="active">Active</option>
          <option value="inactive">Inactive</option>
        </select>
      </div>

      <div className="mt-[24px]">
        {loading ? (
          <div className="flex items-center justify-center py-[48px] text-muted-foreground">
            <Loader2 className="h-[18px] w-[18px] animate-spin" />
          </div>
        ) : filtered.length === 0 ? (
          <div className="rounded-[16px] border border-border bg-card px-[24px] py-[48px] text-center text-[13px] text-muted-foreground">
            No committee members match.
          </div>
        ) : isReordering ? (
          <ReorderableList
            items={filtered}
            keyField={(r) => r.id}
            onReorder={onReorder}
            renderRow={(r) => (
              <div onClick={() => openEdit(r)} className="grid cursor-pointer grid-cols-[36px_1fr_1fr_auto_auto] items-center gap-[12px] py-[10px] pr-[10px] text-[13px]">
                <div className="h-[32px] w-[32px] overflow-hidden rounded-full border border-border bg-input">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={headshotUrl(r.id, r.updated_at)} alt="" className="h-full w-full object-cover" onError={(e) => (e.currentTarget.style.visibility = "hidden")} />
                </div>
                <span className="min-w-0 truncate text-foreground">{r.name}</span>
                <span className="min-w-0 truncate text-muted-foreground">{r.role}</span>
                <span onClick={(e) => e.stopPropagation()}>
                  <PublishToggle
                    checked={r.is_active}
                    onChange={async (next) => {
                      try {
                        await updateRow("committee_members", r.id, { is_active: next }, r);
                        setRows((prev) => prev.map((x) => (x.id === r.id ? { ...x, is_active: next } : x)));
                      } catch {
                        toast.error("Could not update active state.");
                      }
                    }}
                  />
                </span>
                <div className="flex items-center gap-[4px]" onClick={(e) => e.stopPropagation()}>
                  <button type="button" onClick={() => openEdit(r)} className="rounded-[8px] p-[6px] text-muted-foreground transition-colors hover:bg-white/5 hover:text-foreground">
                    <Pencil className="h-[14px] w-[14px]" />
                  </button>
                  <button type="button" onClick={() => setPendingDelete(r)} className="rounded-[8px] p-[6px] text-muted-foreground transition-colors hover:bg-destructive/10 hover:text-destructive">
                    <Trash2 className="h-[14px] w-[14px]" />
                  </button>
                </div>
              </div>
            )}
          />
        ) : (
          <DataTable columns={columns} data={filtered} keyField={(r) => r.id} onRowClick={openEdit} />
        )}
      </div>

      <Drawer open={editing !== null} title={editing === "new" ? "Add committee member" : "Edit committee member"} onClose={closeDrawer}>
        <form onSubmit={onSubmit} className="flex flex-col gap-[20px]">
          <Field label="Name" required>
            <input type="text" required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="w-full rounded-[10px] border border-input bg-input px-[14px] py-[12px] text-[15px]! text-foreground outline-hidden transition-colors focus:border-accent" />
          </Field>

          <Field label="Role" required>
            <input type="text" required placeholder="President" value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })} className="w-full rounded-[10px] border border-input bg-input px-[14px] py-[12px] text-[15px]! text-foreground outline-hidden transition-colors focus:border-accent" />
          </Field>

          <Field label="LinkedIn URL">
            <input type="url" placeholder="https://…" value={form.linkedin_url} onChange={(e) => setForm({ ...form, linkedin_url: e.target.value })} className="w-full rounded-[10px] border border-input bg-input px-[14px] py-[12px] text-[15px]! text-foreground outline-hidden transition-colors focus:border-accent" />
          </Field>

          <div className="flex items-center justify-between rounded-[12px] border border-border px-[16px] py-[14px]">
            <span className="text-[13px] font-medium text-foreground">Active</span>
            <PublishToggle checked={form.is_active} onChange={(v) => setForm({ ...form, is_active: v })} />
          </div>

          <Field label="Photo">
            {editing === "new" ? (
              <p className="text-[13px] text-muted-foreground">Save this member first, then a photo uploader appears here.</p>
            ) : editing ? (
              <IdKeyedImageUploader
                key={photoVersion}
                bucket="committee_photos"
                id={editing.id}
                currentUrl={headshotUrl(editing.id, editing.updated_at)}
                aspect="square"
                onUploaded={async () => {
                  // Bumping updated_at gives every reader (this table, the public
                  // Team page) a fresh cache-busting URL, independent of how fast
                  // the CDN purge has propagated.
                  try {
                    const updated = await updateRow("committee_members", editing.id, { updated_at: new Date().toISOString() }, editing);
                    setRows((prev) => prev.map((x) => (x.id === updated.id ? updated : x)));
                    setEditing(updated);
                  } catch {
                    // Non-fatal: the photo itself uploaded fine, just the cache-bust version didn't update.
                  }
                  setPhotoVersion((v) => v + 1);
                }}
              />
            ) : null}
          </Field>

          <div className="mt-[8px] flex justify-end gap-[8px]">
            <button type="button" onClick={closeDrawer} className="rounded-[10px] border border-border px-[16px] py-[10px] text-[13px]! font-medium text-foreground transition-colors hover:bg-white/5">
              {editing !== "new" ? "Close" : "Cancel"}
            </button>
            <button type="submit" disabled={saving} className="rounded-[10px] bg-primary px-[16px] py-[10px] text-[13px]! font-medium text-primary-foreground transition-colors hover:bg-primary/90 disabled:opacity-60">
              {saving ? "Saving…" : editing === "new" ? "Add member" : "Save changes"}
            </button>
          </div>
        </form>
      </Drawer>

      <ConfirmDialog
        open={pendingDelete !== null}
        title="Delete committee member?"
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
