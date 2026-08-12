import { Link } from "react-router";
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
} from "lucide-react";
import { useAuth } from "../AuthProvider";

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

  return (
    <div className="px-[24px] py-[48px] lg:px-[40px] lg:py-[56px]">
      <p className="text-[10px] font-medium uppercase tracking-[0.24em] text-muted-foreground">MUTIS Admin</p>
      <h1 className="mt-[8px] text-[22px] font-medium text-foreground">Welcome, {session?.user.email}</h1>
      <p className="mt-[12px] text-[14px] leading-[1.6] text-muted-foreground">Jump to a section below.</p>

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
