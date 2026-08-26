import { useEffect, useRef, useState, type Dispatch, type SetStateAction } from "react";

const cache = new Map<string, unknown>();

/**
 * Like useState, but the value survives this component unmounting — e.g. navigating
 * to another admin page and back — by persisting in a module-level cache keyed by
 * `key`. Used so list data, search text, and filters aren't reset on every visit.
 * Keys should be namespaced per page (e.g. "sponsors:rows", "sponsors:search").
 */
export function usePageCache<T>(key: string, initialValue: T): [T, Dispatch<SetStateAction<T>>] {
  const [value, setValue] = useState<T>(() => (cache.has(key) ? (cache.get(key) as T) : initialValue));

  useEffect(() => {
    cache.set(key, value);
  }, [key, value]);

  return [value, setValue];
}

/** Whether a page-cache key already has a value — used to decide whether a page's
 * first render this session should show a loading spinner or cached content. */
export function hasCached(key: string): boolean {
  return cache.has(key);
}

/**
 * The common "list page + edit drawer" shape: caches `editing`/`form`/`pendingDelete`
 * (via usePageCache) so an in-progress edit survives navigating away and back — an
 * in-app route change, or the auth-refresh loading gate remounting the page. Also
 * tracks whether the form is dirty against the snapshot taken when the drawer opened,
 * warns before a real tab close/reload while dirty, and gates the drawer's own close
 * affordances behind a discard confirmation instead of silently dropping the edit.
 *
 * `setEditing`/`setForm` are the raw cached setters — call them directly to close
 * after a successful save (no confirmation should show there). Use `closeDrawer` for
 * any user-initiated dismissal (Cancel button, the Drawer's own onClose).
 */
export function useDrawerFormCache<Row extends { id: string }, Form>(pageKey: string, emptyForm: Form) {
  const [editing, setEditing] = usePageCache<Row | "new" | null>(`admin:${pageKey}:editing`, null);
  const [form, setForm] = usePageCache<Form>(`admin:${pageKey}:form`, emptyForm);
  const [pendingDelete, setPendingDelete] = usePageCache<Row | null>(`admin:${pageKey}:pendingDelete`, null);
  const [baseline, setBaseline] = usePageCache<Form | null>(`admin:${pageKey}:formBaseline`, null);
  const [confirmingDiscard, setConfirmingDiscard] = useState(false);

  const editingKey = editing === null ? null : editing === "new" ? "new" : editing.id;
  // Tracks the previously-seen editingKey across renders. Initialized to the
  // current value (not null) so a mount that resumes an already-open drawer
  // from cache doesn't get treated as a fresh open and clobber the baseline.
  const prevEditingKeyRef = useRef(editingKey);

  useEffect(() => {
    if (editingKey === prevEditingKeyRef.current) return;
    prevEditingKeyRef.current = editingKey;
    // A genuine open (or switching which row is being edited) snapshots the
    // form as it stands right now as the dirty-check baseline; closing clears it.
    setBaseline(editingKey === null ? null : form);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [editingKey]);

  const isDirty = editing !== null && baseline !== null && JSON.stringify(form) !== JSON.stringify(baseline);

  useEffect(() => {
    if (!isDirty) return;
    const handler = (e: BeforeUnloadEvent) => {
      e.preventDefault();
      e.returnValue = "";
    };
    window.addEventListener("beforeunload", handler);
    return () => window.removeEventListener("beforeunload", handler);
  }, [isDirty]);

  const closeDrawer = () => {
    if (isDirty) setConfirmingDiscard(true);
    else setEditing(null);
  };

  const discardConfirmProps = {
    open: confirmingDiscard,
    title: "Discard unsaved changes?",
    description: "Your edits haven't been saved yet. Closing now will discard them.",
    confirmLabel: "Discard",
    destructive: true,
    onConfirm: () => {
      setConfirmingDiscard(false);
      setEditing(null);
    },
    onCancel: () => setConfirmingDiscard(false),
  };

  return {
    editing,
    setEditing,
    form,
    setForm,
    pendingDelete,
    setPendingDelete,
    isDirty,
    closeDrawer,
    discardConfirmProps,
  };
}
