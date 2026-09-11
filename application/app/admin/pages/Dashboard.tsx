import { Link } from "react-router";
import { useEffect } from "react";
import type { ComponentType } from "react";
import {
  Handshake,
  Users,
  CalendarDays,
  Network,
  Award,
  Newspaper,
  Inbox,
  ShieldCheck,
  ScrollText,
  UserCheck,
  CalendarClock,
  History,
  UserPlus,
} from "lucide-react";
import { useAuth } from "../AuthProvider";
import { supabase } from "@/lib/supabase";
import type { Database } from "@/lib/database.types";
import { usePageCache } from "../usePageCache";

type AttendanceTotals = Database["public"]["Views"]["dashboard_attendance_totals"]["Row"];

interface QuickLink {
  label: string;
  description: string;
  path: string;
  icon: ComponentType<{ className?: string }>;
}

const GROUPS: { label: string; items: QuickLink[] }[] = [
  {
    label: "Content",
    items: [
      { label: "Sponsors", description: "Tiers, logos, links", path: "/admin/sponsors", icon: Handshake },
      { label: "Committee", description: "Roster, roles, photos", path: "/admin/committee", icon: Users },
      { label: "Events", description: "Upcoming and past events", path: "/admin/events", icon: CalendarDays },
      { label: "Alumni", description: "Network directory", path: "/admin/alumni", icon: Network },
      { label: "Presidents", description: "Historical record", path: "/admin/presidents", icon: Award },
      { label: "Articles", description: "Drafts and published posts", path: "/admin/articles", icon: Newspaper },
    ],
  },
  {
    label: "Submissions",
    items: [{ label: "Submissions", description: "Contact, sponsorship, signups", path: "/admin/submissions", icon: Inbox }],
  },
  {
    label: "Settings",
    items: [
      { label: "Manage Admins", description: "Grant or revoke access", path: "/admin/admins", icon: ShieldCheck },
      { label: "Audit Log", description: "Full write history", path: "/admin/audit-log", icon: ScrollText },
    ],
  },
];

export function Dashboard() {
  const { session } = useAuth();
  const [totals, setTotals] = usePageCache<AttendanceTotals | null>("admin:dashboard:totals", null);
  const [newAlumniCount, setNewAlumniCount] = usePageCache<number | null>("admin:dashboard:newAlumniCount", null);

  useEffect(() => {
    let cancelled = false;
    supabase
      .from("dashboard_attendance_totals")
      .select("*")
      .single()
      .then(({ data }) => {
        if (cancelled) return;
        if (data) setTotals(data);
      });
    // count: 'exact', head: true — a real server-side count rather than
    // fetching rows and measuring the array (see BackendPlan.md's dashboard
    // counting fix: that pattern silently undercounts past PostgREST's
    // default page size).
    supabase
      .from("alumni_submissions")
      .select("*", { count: "exact", head: true })
      .eq("status", "new")
      .then(({ count }) => {
        if (cancelled) return;
        setNewAlumniCount(count ?? 0);
      });
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const statCards = [
    { label: "Total registrations", value: totals?.total_signups, icon: Inbox },
    { label: "Unique attendees", value: totals?.unique_attendees, icon: UserCheck },
    { label: "Upcoming events", value: totals?.upcoming_events, icon: CalendarClock },
    { label: "Past events", value: totals?.past_events, icon: History },
    { label: "New alumni submissions", value: newAlumniCount, icon: UserPlus },
  ];

  return (
    <div className="px-[24px] py-[48px] lg:px-[40px] lg:py-[56px]">
      <p className="text-[10px] font-medium uppercase tracking-[0.24em] text-muted-foreground">MUTIS Admin</p>
      <h1 className="mt-[8px] text-[22px] font-medium text-foreground">Welcome, {session?.user.email}</h1>
      <p className="mt-[12px] text-[14px] leading-[1.6] text-muted-foreground">Jump to a section below.</p>

      <div className="mt-[24px] grid grid-cols-2 gap-[12px] lg:grid-cols-4">
        {statCards.map((card) => {
          const Icon = card.icon;
          return (
            <div key={card.label} className="rounded-[14px] border border-border bg-card p-[16px]">
              <span className="flex h-[32px] w-[32px] items-center justify-center rounded-[10px] border border-border bg-input text-accent">
                <Icon className="h-[15px] w-[15px]" />
              </span>
              <p className="mt-[12px] text-[22px] font-medium text-foreground">
                {card.value == null ? "—" : card.value}
              </p>
              <p className="mt-[2px] text-[12px] text-muted-foreground">{card.label}</p>
            </div>
          );
        })}
      </div>

      <div className="mt-[32px] flex flex-col gap-[32px]">
        {GROUPS.map((group) => (
          <div key={group.label}>
            <p className="mb-[8px] text-[10px] font-medium uppercase tracking-[0.06em] text-muted-foreground">{group.label}</p>
            <div className="grid grid-cols-1 gap-[12px] sm:grid-cols-2 lg:grid-cols-3">
              {group.items.map((item) => {
                const Icon = item.icon;
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    className="flex items-start gap-[12px] rounded-[14px] border border-border bg-card p-[16px] transition-colors hover:border-accent/40 hover:bg-white/[0.02]"
                  >
                    <span className="flex h-[32px] w-[32px] shrink-0 items-center justify-center rounded-[10px] border border-border bg-input text-accent">
                      <Icon className="h-[15px] w-[15px]" />
                    </span>
                    <span>
                      <span className="block text-[13px] font-medium text-foreground">{item.label}</span>
                      <span className="mt-[2px] block text-[12px] text-muted-foreground">{item.description}</span>
                    </span>
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
