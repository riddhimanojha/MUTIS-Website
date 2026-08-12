import { useEffect, useMemo, useState } from "react";
import { Loader2, Trash2, Search, Inbox as InboxIcon } from "lucide-react";
import { supabase } from "@/lib/supabase";
import type { Database } from "@/lib/database.types";
import { useToast } from "../components/Toast";
import { Drawer } from "../components/Drawer";
import { ConfirmDialog } from "../components/ConfirmDialog";
import { DataTable, type DataTableColumn } from "../components/DataTable";
import { StatusBadge } from "../components/StatusBadge";

type Contact = Database["public"]["Tables"]["contact_submissions"]["Row"];
type Sponsorship = Database["public"]["Tables"]["sponsorship_enquiries"]["Row"];
type Signup = Database["public"]["Tables"]["event_signups"]["Row"];
type EventRow = Database["public"]["Tables"]["events"]["Row"];
type Attendance = Database["public"]["Tables"]["attendance_submissions"]["Row"];

type Tab = "contact" | "sponsorship" | "signups" | "attendance";

function formatDateTime(iso: string) {
  return new Date(iso).toLocaleString(undefined, { year: "numeric", month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" });
}

function truncate(s: string, n: number) {
  return s.length > n ? `${s.slice(0, n)}…` : s;
}

const TABS: { key: Tab; label: string }[] = [
  { key: "contact", label: "Contact" },
  { key: "sponsorship", label: "Sponsorship" },
  { key: "signups", label: "Event signups" },
  { key: "attendance", label: "Attendance" },
];

export function Submissions() {
  const toast = useToast();
  const [tab, setTab] = useState<Tab>("contact");

  const [contacts, setContacts] = useState<Contact[]>([]);
  const [sponsorships, setSponsorships] = useState<Sponsorship[]>([]);
  const [signups, setSignups] = useState<Signup[]>([]);
  const [attendances, setAttendances] = useState<Attendance[]>([]);
  const [events, setEvents] = useState<EventRow[]>([]);
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [eventFilter, setEventFilter] = useState("all");

  const [detail, setDetail] = useState<{ tab: Tab; row: Contact | Sponsorship | Signup | Attendance } | null>(null);
  const [pendingDelete, setPendingDelete] = useState<{ tab: Tab; row: Contact | Sponsorship | Signup | Attendance } | null>(null);
  const [deleting, setDeleting] = useState(false);

  const fetchAll = async () => {
    setLoading(true);
    const [c, s, sg, ev, a] = await Promise.all([
      supabase.from("contact_submissions").select("*"),
      supabase.from("sponsorship_enquiries").select("*"),
      supabase.from("event_signups").select("*"),
      supabase.from("events").select("*"),
      supabase.from("attendance_submissions").select("*"),
    ]);
    if (c.error || s.error || sg.error || ev.error || a.error) toast.error("Could not load submissions.");
    if (c.data) setContacts(c.data);
    if (s.data) setSponsorships(s.data);
    if (sg.data) setSignups(sg.data);
    if (ev.data) setEvents(ev.data);
    if (a.data) setAttendances(a.data);
    setLoading(false);
  };

  useEffect(() => {
    fetchAll();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    setSearch("");
    setStatusFilter("all");
    setEventFilter("all");
  }, [tab]);

  const eventTitle = (id: string) => events.find((e) => e.id === id)?.title ?? "Unknown event";

  const filteredContacts = useMemo(() => {
    return contacts
      .filter((r) => statusFilter === "all" || r.status === statusFilter)
      .filter((r) => {
        if (!search.trim()) return true;
        const q = search.trim().toLowerCase();
        return r.name.toLowerCase().includes(q) || r.email.toLowerCase().includes(q) || r.message.toLowerCase().includes(q);
      })
      .sort((a, b) => b.created_at.localeCompare(a.created_at));
  }, [contacts, statusFilter, search]);

  const filteredSponsorships = useMemo(() => {
    return sponsorships
      .filter((r) => statusFilter === "all" || r.status === statusFilter)
      .filter((r) => {
        if (!search.trim()) return true;
        const q = search.trim().toLowerCase();
        return r.name.toLowerCase().includes(q) || r.email.toLowerCase().includes(q) || r.message.toLowerCase().includes(q);
      })
      .sort((a, b) => b.created_at.localeCompare(a.created_at));
  }, [sponsorships, statusFilter, search]);

  const filteredSignups = useMemo(() => {
    return signups
      .filter((r) => statusFilter === "all" || r.status === statusFilter)
      .filter((r) => eventFilter === "all" || r.event_id === eventFilter)
      .filter((r) => {
        if (!search.trim()) return true;
        const q = search.trim().toLowerCase();
        return r.name.toLowerCase().includes(q) || r.email.toLowerCase().includes(q) || (r.notes ?? "").toLowerCase().includes(q);
      })
      .sort((a, b) => b.created_at.localeCompare(a.created_at));
  }, [signups, statusFilter, eventFilter, search]);

  const filteredAttendances = useMemo(() => {
    return attendances
      .filter((r) => statusFilter === "all" || r.status === statusFilter)
      .filter((r) => {
        if (!search.trim()) return true;
        const q = search.trim().toLowerCase();
        return r.name.toLowerCase().includes(q) || r.email.toLowerCase().includes(q) || r.course.toLowerCase().includes(q);
      })
      .sort((a, b) => b.created_at.localeCompare(a.created_at));
  }, [attendances, statusFilter, search]);

  const tableFor = (t: Tab) =>
    t === "contact" ? "contact_submissions" : t === "sponsorship" ? "sponsorship_enquiries" : t === "signups" ? "event_signups" : "attendance_submissions";

  const updateStatus = async (t: Tab, id: string, status: string) => {
    const { error } = await supabase.from(tableFor(t)).update({ status }).eq("id", id);
    if (error) {
      toast.error("Could not update status.");
      return;
    }
    if (t === "contact") setContacts((prev) => prev.map((r) => (r.id === id ? { ...r, status } : r)));
    if (t === "sponsorship") setSponsorships((prev) => prev.map((r) => (r.id === id ? { ...r, status } : r)));
    if (t === "signups") setSignups((prev) => prev.map((r) => (r.id === id ? { ...r, status } : r)));
    if (t === "attendance") setAttendances((prev) => prev.map((r) => (r.id === id ? { ...r, status } : r)));
    setDetail((prev) => (prev && prev.row.id === id ? { ...prev, row: { ...prev.row, status } } : prev));
    toast.success("Status updated.");
  };

  const confirmDelete = async () => {
    if (!pendingDelete) return;
    setDeleting(true);
    const { error } = await supabase.from(tableFor(pendingDelete.tab)).delete().eq("id", pendingDelete.row.id);
    setDeleting(false);
    if (error) {
      toast.error("Could not delete that submission.");
      return;
    }
    toast.success("Deleted.");
    setPendingDelete(null);
    setDetail(null);
    fetchAll();
  };

  const contactColumns: DataTableColumn<Contact>[] = [
    { key: "created_at", label: "Received", render: (r) => formatDateTime(r.created_at), sortValue: (r) => r.created_at },
    { key: "status", label: "Status", render: (r) => <StatusBadge status={r.status} /> },
    { key: "name", label: "Name", render: (r) => r.name },
    { key: "email", label: "Email", render: (r) => r.email },
    { key: "reason", label: "Reason", render: (r) => r.reason },
    { key: "message", label: "Message", render: (r) => truncate(r.message, 60) },
    {
      key: "actions",
      label: "",
      render: (r) => (
        <button type="button" onClick={(e) => { e.stopPropagation(); setPendingDelete({ tab: "contact", row: r }); }} className="rounded-[8px] p-[6px] text-muted-foreground transition-colors hover:bg-destructive/10 hover:text-destructive">
          <Trash2 className="h-[14px] w-[14px]" />
        </button>
      ),
    },
  ];

  const sponsorshipColumns: DataTableColumn<Sponsorship>[] = [
    { key: "created_at", label: "Received", render: (r) => formatDateTime(r.created_at), sortValue: (r) => r.created_at },
    { key: "status", label: "Status", render: (r) => <StatusBadge status={r.status} /> },
    { key: "company", label: "Company", render: (r) => r.company },
    { key: "name", label: "Name", render: (r) => r.name },
    { key: "email", label: "Email", render: (r) => r.email },
    { key: "message", label: "Message", render: (r) => truncate(r.message, 60) },
    {
      key: "actions",
      label: "",
      render: (r) => (
        <button type="button" onClick={(e) => { e.stopPropagation(); setPendingDelete({ tab: "sponsorship", row: r }); }} className="rounded-[8px] p-[6px] text-muted-foreground transition-colors hover:bg-destructive/10 hover:text-destructive">
          <Trash2 className="h-[14px] w-[14px]" />
        </button>
      ),
    },
  ];

  const signupColumns: DataTableColumn<Signup>[] = [
    { key: "created_at", label: "Signed up", render: (r) => formatDateTime(r.created_at), sortValue: (r) => r.created_at },
    { key: "status", label: "Status", render: (r) => <StatusBadge status={r.status} /> },
    { key: "event", label: "Event", render: (r) => eventTitle(r.event_id) },
    { key: "name", label: "Name", render: (r) => r.name },
    { key: "email", label: "Email", render: (r) => r.email },
    { key: "notes", label: "Notes", render: (r) => (r.notes ? truncate(r.notes, 40) : "—") },
    {
      key: "actions",
      label: "",
      render: (r) => (
        <button type="button" onClick={(e) => { e.stopPropagation(); setPendingDelete({ tab: "signups", row: r }); }} className="rounded-[8px] p-[6px] text-muted-foreground transition-colors hover:bg-destructive/10 hover:text-destructive">
          <Trash2 className="h-[14px] w-[14px]" />
        </button>
      ),
    },
  ];

  const attendanceColumns: DataTableColumn<Attendance>[] = [
    { key: "created_at", label: "Received", render: (r) => formatDateTime(r.created_at), sortValue: (r) => r.created_at },
    { key: "status", label: "Status", render: (r) => <StatusBadge status={r.status} /> },
    { key: "name", label: "Name", render: (r) => r.name },
    { key: "email", label: "Email", render: (r) => r.email },
    { key: "course", label: "Course", render: (r) => r.course },
    { key: "year", label: "Year", render: (r) => r.year },
    { key: "rating", label: "Rating", render: (r) => `${r.rating} / 10` },
    {
      key: "actions",
      label: "",
      render: (r) => (
        <button type="button" onClick={(e) => { e.stopPropagation(); setPendingDelete({ tab: "attendance", row: r }); }} className="rounded-[8px] p-[6px] text-muted-foreground transition-colors hover:bg-destructive/10 hover:text-destructive">
          <Trash2 className="h-[14px] w-[14px]" />
        </button>
      ),
    },
  ];

  const statusOptions = tab === "signups" ? ["confirmed", "cancelled"] : ["new", "read", "archived"];

  return (
    <div className="px-[24px] py-[48px] lg:px-[40px] lg:py-[56px]">
      <p className="text-[10px] font-medium uppercase tracking-[0.24em] text-muted-foreground">Submissions</p>
      <h1 className="mt-[8px] text-[22px] font-medium text-foreground">Inbox</h1>

      <div className="mt-[24px] flex flex-wrap items-center gap-[8px]">
        <div className="flex rounded-[10px] border border-border bg-card p-[3px]">
          {TABS.map((t) => (
            <button
              key={t.key}
              type="button"
              onClick={() => setTab(t.key)}
              className={`rounded-[8px] px-[14px] py-[8px] text-[12px]! font-medium transition-colors ${tab === t.key ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground"}`}
            >
              {t.label}
            </button>
          ))}
        </div>
        <div className="relative">
          <Search className="pointer-events-none absolute left-[12px] top-1/2 h-[14px] w-[14px] -translate-y-1/2 text-muted-foreground" />
          <input type="text" placeholder="Search name, email, message…" value={search} onChange={(e) => setSearch(e.target.value)} className="w-[240px] rounded-[10px] border border-input bg-input py-[10px] pl-[36px] pr-[12px] text-[14px]! text-foreground outline-hidden transition-colors focus:border-accent" />
        </div>
        <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="rounded-[10px] border border-input bg-input px-[12px] py-[10px] text-[13px]! text-foreground outline-hidden">
          <option value="all">All statuses</option>
          {statusOptions.map((s) => (
            <option key={s} value={s}>{s}</option>
          ))}
        </select>
        {tab === "signups" && (
          <select value={eventFilter} onChange={(e) => setEventFilter(e.target.value)} className="rounded-[10px] border border-input bg-input px-[12px] py-[10px] text-[13px]! text-foreground outline-hidden">
            <option value="all">All events</option>
            {events.map((ev) => (
              <option key={ev.id} value={ev.id}>{ev.title}</option>
            ))}
          </select>
        )}
      </div>

      <div className="mt-[24px]">
        {loading ? (
          <div className="flex items-center justify-center py-[48px] text-muted-foreground">
            <Loader2 className="h-[18px] w-[18px] animate-spin" />
          </div>
        ) : tab === "contact" ? (
          <DataTable columns={contactColumns} data={filteredContacts} keyField={(r) => r.id} onRowClick={(r) => setDetail({ tab: "contact", row: r })} emptyMessage="No contact submissions." />
        ) : tab === "sponsorship" ? (
          <DataTable columns={sponsorshipColumns} data={filteredSponsorships} keyField={(r) => r.id} onRowClick={(r) => setDetail({ tab: "sponsorship", row: r })} emptyMessage="No sponsorship enquiries." />
        ) : tab === "signups" ? (
          <DataTable columns={signupColumns} data={filteredSignups} keyField={(r) => r.id} onRowClick={(r) => setDetail({ tab: "signups", row: r })} emptyMessage="No event signups." />
        ) : (
          <DataTable columns={attendanceColumns} data={filteredAttendances} keyField={(r) => r.id} onRowClick={(r) => setDetail({ tab: "attendance", row: r })} emptyMessage="No attendance submissions." />
        )}
      </div>

      <Drawer open={detail !== null} title="Submission" onClose={() => setDetail(null)}>
        {detail && (
          <div className="flex flex-col gap-[20px]">
            <div className="flex items-center justify-between">
              <span className="inline-flex items-center gap-[6px] text-[12px] text-muted-foreground">
                <InboxIcon className="h-[13px] w-[13px]" />
                {formatDateTime(detail.row.created_at)}
              </span>
              <select
                value={detail.row.status}
                onChange={(e) => updateStatus(detail.tab, detail.row.id, e.target.value)}
                className="rounded-[8px] border border-input bg-input px-[10px] py-[6px] text-[12px]! text-foreground outline-hidden"
              >
                {(detail.tab === "signups" ? ["confirmed", "cancelled"] : ["new", "read", "archived"]).map((s) => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            </div>

            {detail.tab === "sponsorship" && "company" in detail.row && (
              <DetailRow label="Company" value={detail.row.company} />
            )}
            {detail.tab === "signups" && "event_id" in detail.row && (
              <DetailRow label="Event" value={eventTitle(detail.row.event_id)} />
            )}
            <DetailRow label="Name" value={detail.row.name} />
            <DetailRow label="Email" value={detail.row.email} />
            {detail.tab === "contact" && "reason" in detail.row && <DetailRow label="Reason" value={detail.row.reason} />}
            {detail.tab === "attendance" && "course" in detail.row && <DetailRow label="Course" value={detail.row.course} />}
            {detail.tab === "attendance" && "year" in detail.row && <DetailRow label="Year of study" value={detail.row.year} />}
            {detail.tab === "attendance" && "rating" in detail.row && <DetailRow label="Rating" value={`${detail.row.rating} / 10`} />}
            {"message" in detail.row && <DetailRow label="Message" value={detail.row.message} multiline />}
            {"notes" in detail.row && detail.row.notes && <DetailRow label="Notes" value={detail.row.notes} multiline />}
            {"comments" in detail.row && detail.row.comments && <DetailRow label="Comments" value={detail.row.comments} multiline />}

            <div className="mt-[8px] flex justify-end">
              <button
                type="button"
                onClick={() => setPendingDelete(detail)}
                className="inline-flex items-center gap-[6px] rounded-[10px] border border-destructive/40 px-[16px] py-[10px] text-[13px]! font-medium text-destructive transition-colors hover:bg-destructive/10"
              >
                <Trash2 className="h-[14px] w-[14px]" />
                Delete
              </button>
            </div>
          </div>
        )}
      </Drawer>

      <ConfirmDialog
        open={pendingDelete !== null}
        title="Delete submission?"
        description="This will be permanently deleted. Consider changing its status to archived/cancelled instead unless this is spam or a test entry."
        confirmLabel={deleting ? "Deleting…" : "Delete"}
        destructive
        onConfirm={confirmDelete}
        onCancel={() => setPendingDelete(null)}
      />
    </div>
  );
}

function DetailRow({ label, value, multiline }: { label: string; value: string; multiline?: boolean }) {
  return (
    <div className="flex flex-col gap-[4px]">
      <span className="text-[10px] font-medium uppercase tracking-[0.06em] text-muted-foreground">{label}</span>
      <p className={`text-[14px] text-foreground ${multiline ? "leading-[1.6] whitespace-pre-wrap" : ""}`}>{value}</p>
    </div>
  );
}
