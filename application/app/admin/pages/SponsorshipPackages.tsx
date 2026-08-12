import { useEffect, useMemo, useState, type FormEvent } from "react";
import { Loader2, Plus, Pencil, Trash2 } from "lucide-react";
import { supabase } from "@/lib/supabase";
import type { Database } from "@/lib/database.types";
import { useAdminMutation } from "../useAdminMutation";
import { useToast } from "../components/Toast";
import { Drawer } from "../components/Drawer";
import { ConfirmDialog } from "../components/ConfirmDialog";
import { ReorderableList } from "../components/ReorderableList";
import { DataTable, type DataTableColumn } from "../components/DataTable";
import { PublishToggle } from "../components/StatusBadge";
import { useIsMobile } from "../components/useIsMobile";

type PackageRow = Database["public"]["Tables"]["sponsorship_packages"]["Row"];

type FormState = { tier: string; headline: string; deliverables: string; is_published: boolean };

const EMPTY_FORM: FormState = { tier: "", headline: "", deliverables: "", is_published: true };

function parseDeliverables(input: string): string[] {
  return input
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);
}

export function SponsorshipPackages() {
  const toast = useToast();
  const { insertRow, updateRow, deleteRow } = useAdminMutation();

  const [rows, setRows] = useState<PackageRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [publishedFilter, setPublishedFilter] = useState<"all" | "published" | "unpublished">("all");

  const [editing, setEditing] = useState<PackageRow | "new" | null>(null);
  const [form, setForm] = useState<FormState>(EMPTY_FORM);
  const [saving, setSaving] = useState(false);
  const [pendingDelete, setPendingDelete] = useState<PackageRow | null>(null);
  const [deleting, setDeleting] = useState(false);

  const fetchRows = async () => {
    setLoading(true);
    const { data, error } = await supabase.from("sponsorship_packages").select("*").order("display_order");
    if (error) toast.error("Could not load sponsorship packages.");
    else setRows(data);
    setLoading(false);
  };

  useEffect(() => {
    fetchRows();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const filtered = useMemo(() => {
    return rows.filter((r) => {
      if (publishedFilter === "published" && !r.is_published) return false;
      if (publishedFilter === "unpublished" && r.is_published) return false;
      return true;
    });
  }, [rows, publishedFilter]);

  const openCreate = () => {
    setForm(EMPTY_FORM);
    setEditing("new");
  };

  const openEdit = (row: PackageRow) => {
    setForm({ tier: row.tier, headline: row.headline, deliverables: row.deliverables.join("\n"), is_published: row.is_published });
    setEditing(row);
  };

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!form.tier.trim() || !form.headline.trim()) return;
    setSaving(true);
    try {
      const values = {
        tier: form.tier.trim(),
        headline: form.headline.trim(),
        deliverables: parseDeliverables(form.deliverables),
        is_published: form.is_published,
      };
      if (editing === "new") {
        const nextOrder = rows.length ? Math.max(...rows.map((r) => r.display_order)) + 1 : 0;
        await insertRow("sponsorship_packages", { ...values, display_order: nextOrder });
        toast.success("Package added.");
      } else if (editing) {
        await updateRow("sponsorship_packages", editing.id, values, editing);
        toast.success("Package updated.");
      }
      setEditing(null);
      fetchRows();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Could not save that package.");
    } finally {
      setSaving(false);
    }
  };

  const confirmDelete = async () => {
    if (!pendingDelete) return;
    setDeleting(true);
    try {
      await deleteRow("sponsorship_packages", pendingDelete.id, pendingDelete);
      toast.success(`${pendingDelete.tier} deleted.`);
      setPendingDelete(null);
      fetchRows();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Could not delete that package.");
    } finally {
      setDeleting(false);
    }
  };

  const onReorder = async (orderedIds: string[]) => {
    const byId = new Map(rows.map((r) => [r.id, r]));
    const updates: { id: string; display_order: number; previous: PackageRow }[] = [];
    orderedIds.forEach((id, index) => {
      const row = byId.get(id);
      if (row && row.display_order !== index) {
        updates.push({ id, display_order: index, previous: row });
      }
    });
    if (updates.length === 0) return;
    setRows((prev) =>
      prev.map((r) => {
        const match = updates.find((u) => u.id === r.id);
        return match ? { ...r, display_order: match.display_order } : r;
      })
    );
    try {
      await Promise.all(
        updates.map((u) => updateRow("sponsorship_packages", u.id, { display_order: u.display_order }, u.previous))
      );
    } catch {
      toast.error("Could not save the new order.");
      fetchRows();
    }
  };

  const isMobile = useIsMobile();
  const isReordering = publishedFilter === "all" && !isMobile;

  const columns: DataTableColumn<PackageRow>[] = [
    { key: "tier", label: "Tier", render: (r) => r.tier, sortValue: (r) => r.tier },
    { key: "headline", label: "Headline", render: (r) => r.headline },
    { key: "deliverables", label: "Deliverables", render: (r) => `${r.deliverables.length} items` },
    {
      key: "is_published",
      label: "Published",
      render: (r) => (
        <PublishToggle
          checked={r.is_published}
          onChange={async (next) => {
            try {
              await updateRow("sponsorship_packages", r.id, { is_published: next }, r);
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
          <h1 className="mt-[8px] text-[22px] font-medium text-foreground">Sponsorship Packages</h1>
        </div>
        <button type="button" onClick={openCreate} className="inline-flex items-center gap-[6px] rounded-[10px] bg-primary px-[16px] py-[10px] text-[13px]! font-medium text-primary-foreground transition-colors hover:bg-primary/90">
          <Plus className="h-[14px] w-[14px]" />
          Add package
        </button>
      </div>

      <div className="mt-[24px] flex flex-wrap items-center gap-[8px]">
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
        ) : filtered.length === 0 ? (
          <div className="rounded-[14px] border border-border bg-card px-[16px] py-[20px] text-center text-[13px] text-muted-foreground">
            No packages yet.
          </div>
        ) : isReordering ? (
          <ReorderableList
            items={filtered}
            keyField={(r) => r.id}
            onReorder={onReorder}
            renderRow={(r) => (
              <div onClick={() => openEdit(r)} className="grid cursor-pointer grid-cols-[1fr_1fr_auto_auto] items-center gap-[12px] py-[10px] pr-[10px] text-[13px]">
                <span className="min-w-0 truncate text-foreground">{r.tier}</span>
                <span className="min-w-0 truncate text-muted-foreground">{r.headline}</span>
                <span onClick={(e) => e.stopPropagation()}>
                  <PublishToggle
                    checked={r.is_published}
                    onChange={async (next) => {
                      try {
                        await updateRow("sponsorship_packages", r.id, { is_published: next }, r);
                        setRows((prev) => prev.map((x) => (x.id === r.id ? { ...x, is_published: next } : x)));
                      } catch {
                        toast.error("Could not update publish state.");
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
          <DataTable columns={columns} data={filtered} keyField={(r) => r.id} onRowClick={openEdit} emptyMessage="No packages match." />
        )}
      </div>

      <Drawer open={editing !== null} title={editing === "new" ? "Add package" : "Edit package"} onClose={() => setEditing(null)}>
        <form onSubmit={onSubmit} className="flex flex-col gap-[20px]">
          <Field label="Tier" required>
            <input type="text" required placeholder="Gold" value={form.tier} onChange={(e) => setForm({ ...form, tier: e.target.value })} className="w-full rounded-[10px] border border-input bg-input px-[14px] py-[12px] text-[15px]! text-foreground outline-hidden transition-colors focus:border-accent" />
          </Field>
          <Field label="Headline" required>
            <input type="text" required placeholder="Title Partner" value={form.headline} onChange={(e) => setForm({ ...form, headline: e.target.value })} className="w-full rounded-[10px] border border-input bg-input px-[14px] py-[12px] text-[15px]! text-foreground outline-hidden transition-colors focus:border-accent" />
          </Field>
          <Field label="Deliverables">
            <textarea rows={6} placeholder={"One per line"} value={form.deliverables} onChange={(e) => setForm({ ...form, deliverables: e.target.value })} className="w-full resize-y rounded-[10px] border border-input bg-input px-[14px] py-[12px] text-[15px]! leading-[1.6] text-foreground outline-hidden transition-colors focus:border-accent" />
            <p className="mt-[4px] text-[12px] text-muted-foreground">One deliverable per line.</p>
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
              {saving ? "Saving…" : editing === "new" ? "Add package" : "Save changes"}
            </button>
          </div>
        </form>
      </Drawer>

      <ConfirmDialog
        open={pendingDelete !== null}
        title="Delete package?"
        description={`${pendingDelete?.tier ?? ""} will be permanently deleted.`}
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
