import { useEffect, useState, type ReactNode } from "react";
import { GripVertical } from "lucide-react";

interface ReorderableListProps<T> {
  items: T[];
  keyField: (item: T) => string;
  onReorder: (orderedIds: string[]) => void;
  renderRow: (item: T) => ReactNode;
}

/** Hand-rolled HTML5 drag-and-drop reorder — no new dependency for what's a fairly small
 * interaction (drag handle + live reorder + commit on drop). */
export function ReorderableList<T>({ items, keyField, onReorder, renderRow }: ReorderableListProps<T>) {
  const [order, setOrder] = useState<string[]>(items.map(keyField));
  const [draggingId, setDraggingId] = useState<string | null>(null);

  useEffect(() => {
    setOrder(items.map(keyField));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [items]);

  const byId = new Map(items.map((item) => [keyField(item), item]));

  const moveOver = (overId: string) => {
    if (!draggingId || draggingId === overId) return;
    setOrder((prev) => {
      const next = prev.filter((id) => id !== draggingId);
      const overIndex = next.indexOf(overId);
      next.splice(overIndex, 0, draggingId);
      return next;
    });
  };

  return (
    <div className="flex flex-col gap-[6px]">
      {order.map((id) => {
        const item = byId.get(id);
        if (!item) return null;
        return (
          <div
            key={id}
            draggable
            onDragStart={() => setDraggingId(id)}
            onDragEnd={() => {
              setDraggingId(null);
              onReorder(order);
            }}
            onDragOver={(e) => {
              e.preventDefault();
              moveOver(id);
            }}
            className={`flex items-center gap-[8px] rounded-[12px] border border-border bg-card transition-opacity ${
              draggingId === id ? "opacity-40" : "opacity-100"
            }`}
          >
            <span className="cursor-grab pl-[10px] text-muted-foreground active:cursor-grabbing">
              <GripVertical className="h-[14px] w-[14px]" />
            </span>
            <div className="min-w-0 flex-1">{renderRow(item)}</div>
          </div>
        );
      })}
    </div>
  );
}
