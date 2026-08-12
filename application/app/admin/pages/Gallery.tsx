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
import { UrlColumnImageUploader } from "../components/ImageUploader";
import { useIsMobile } from "../components/useIsMobile";

type GalleryImage = Database["public"]["Tables"]["gallery_images"]["Row"];

type FormState = {
  image_url: string;
  caption: string;
  is_published: boolean;
};

const EMPTY_FORM: FormState = { image_url: "", caption: "", is_published: true };

export function Gallery() {
  const toast = useToast();
  const { insertRow, updateRow, deleteRow } = useAdminMutation();

  const [rows, setRows] = useState<GalleryImage[]>([]);
  const [loading, setLoading] = useState(true);
  const [publishedFilter, setPublishedFilter] = useState<"all" | "published" | "unpublished">("all");

  const [editing, setEditing] = useState<GalleryImage | "new" | null>(null);
  const [form, setForm] = useState<FormState>(EMPTY_FORM);
  const [saving, setSaving] = useState(false);
  const [pendingDelete, setPendingDelete] = useState<GalleryImage | null>(null);
  const [deleting, setDeleting] = useState(false);

  const fetchRows = async () => {
    setLoading(true);
    const { data, error } = await supabase.from("gallery_images").select("*").order("display_order");
    if (error) toast.error("Could not load gallery images.");
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

  const openEdit = (row: GalleryImage) => {
    setForm({ image_url: row.image_url, caption: row.caption ?? "", is_published: row.is_published });
    setEditing(row);
  };

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!form.image_url.trim()) {
      toast.error("Upload or paste an image URL first.");
      return;
    }
    setSaving(true);
    try {
      const values = {
        image_url: form.image_url.trim(),
        caption: form.caption.trim() || null,
        is_published: form.is_published,
      };
      if (editing === "new") {
        const nextOrder = rows.length ? Math.max(...rows.map((r) => r.display_order)) + 1 : 0;
        await insertRow("gallery_images", { ...values, display_order: nextOrder });
        toast.success("Photo added.");
      } else if (editing) {
        await updateRow("gallery_images", editing.id, values, editing);
        toast.success("Photo updated.");
      }
      setEditing(null);
      fetchRows();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Could not save that photo.");
    } finally {
      setSaving(false);
    }
  };

  const confirmDelete = async () => {
    if (!pendingDelete) return;
    setDeleting(true);
    try {
      await deleteRow("gallery_images", pendingDelete.id, pendingDelete);
      toast.success("Photo deleted.");
      setPendingDelete(null);
      fetchRows();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Could not delete that photo.");
    } finally {
      setDeleting(false);
    }
  };

  const onReorder = async (orderedIds: string[]) => {
    const byId = new Map(rows.map((r) => [r.id, r]));
    const updates: { id: string; display_order: number; previous: GalleryImage }[] = [];
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
        updates.map((u) => updateRow("gallery_images", u.id, { display_order: u.display_order }, u.previous))
      );
    } catch {
      toast.error("Could not save the new order.");
      fetchRows();
    }
  };

  const isMobile = useIsMobile();
  const isReordering = publishedFilter === "all" && !isMobile;

  const columns: DataTableColumn<GalleryImage>[] = [
    {
      key: "thumb",
      label: "",
      render: (r) => (
        <div className="h-[36px] w-[56px] overflow-hidden rounded-[6px] border border-border bg-input">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={r.image_url} alt="" className="h-full w-full object-cover" />
        </div>
      ),
    },
    { key: "caption", label: "Caption", render: (r) => r.caption ?? "—" },
    {
      key: "is_published",
      label: "Published",
      render: (r) => (
        <PublishToggle
          checked={r.is_published}
          onChange={async (next) => {
            try {
              await updateRow("gallery_images", r.id, { is_published: next }, r);
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
          <h1 className="mt-[8px] text-[22px] font-medium text-foreground">Gallery</h1>
        </div>
        <button type="button" onClick={openCreate} className="inline-flex items-center gap-[6px] rounded-[10px] bg-primary px-[16px] py-[10px] text-[13px]! font-medium text-primary-foreground transition-colors hover:bg-primary/90">
          <Plus className="h-[14px] w-[14px]" />
          Add photo
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
            No photos yet.
          </div>
        ) : isReordering ? (
          <ReorderableList
            items={filtered}
            keyField={(r) => r.id}
            onReorder={onReorder}
            renderRow={(r) => (
              <div onClick={() => openEdit(r)} className="grid cursor-pointer grid-cols-[56px_1fr_auto_auto] items-center gap-[12px] py-[10px] pr-[10px] text-[13px]">
                <div className="flex h-[32px] w-[48px] items-center justify-center overflow-hidden rounded-[6px] border border-border bg-input">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={r.image_url} alt="" className="h-full w-full object-cover" />
                </div>
                <span className="min-w-0 truncate text-foreground">{r.caption ?? "Untitled"}</span>
                <span onClick={(e) => e.stopPropagation()}>
                  <PublishToggle
                    checked={r.is_published}
                    onChange={async (next) => {
                      try {
                        await updateRow("gallery_images", r.id, { is_published: next }, r);
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
          <DataTable columns={columns} data={filtered} keyField={(r) => r.id} onRowClick={openEdit} emptyMessage="No photos match." />
        )}
      </div>

      <Drawer open={editing !== null} title={editing === "new" ? "Add photo" : "Edit photo"} onClose={() => setEditing(null)}>
        <form onSubmit={onSubmit} className="flex flex-col gap-[20px]">
          <Field label="Photo" required>
            <div className="flex flex-col gap-[12px]">
              <UrlColumnImageUploader
                bucket="gallery_photos"
                currentUrl={form.image_url}
                aspect="banner"
                onUploaded={(url) => setForm((f) => ({ ...f, image_url: url }))}
              />
              <input
                type="text"
                placeholder="Or paste an image URL"
                value={form.image_url}
                onChange={(e) => setForm({ ...form, image_url: e.target.value })}
                className="w-full rounded-[10px] border border-input bg-input px-[14px] py-[12px] text-[15px]! text-foreground outline-hidden transition-colors focus:border-accent"
              />
            </div>
          </Field>

          <Field label="Caption">
            <input
              type="text"
              value={form.caption}
              onChange={(e) => setForm({ ...form, caption: e.target.value })}
              className="w-full rounded-[10px] border border-input bg-input px-[14px] py-[12px] text-[15px]! text-foreground outline-hidden transition-colors focus:border-accent"
            />
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
              {saving ? "Saving…" : editing === "new" ? "Add photo" : "Save changes"}
            </button>
          </div>
        </form>
      </Drawer>

      <ConfirmDialog
        open={pendingDelete !== null}
        title="Delete photo?"
        description="This photo will be permanently deleted."
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
