import { Linkedin } from "lucide-react";

export function Team() {
  const members = [
    {
      name: "Aisha Khan",
      role: "President",
      initials: "AK",
      linkedin: "#",
    },
    {
      name: "Rohan Patel",
      role: "Vice President",
      initials: "RP",
      linkedin: "#",
    },
    {
      name: "Emily Li",
      role: "Head of MEIF",
      initials: "EL",
      linkedin: "#",
    },
    {
      name: "Daniel Smith",
      role: "Head of Events",
      initials: "DS",
      linkedin: "#",
    },
    {
      name: "Hannah Jones",
      role: "Head of Careers",
      initials: "HJ",
      linkedin: "#",
    },
    {
      name: "Omar Ibrahim",
      role: "Head of Sponsorship",
      initials: "OI",
      linkedin: "#",
    },
  ];

  return (
    <div className="relative min-h-screen pt-24 pb-20 px-8">
      <div className="max-w-[1400px] mx-auto">
        <h1
          className="mb-6"
          style={{
            fontSize: "clamp(2.6rem, 6vw, 4.8rem)",
            fontWeight: "700",
            color: "white",
            lineHeight: "1.08",
            fontFamily: "var(--font-nav)",
          }}
        >
          Team
        </h1>

        <p className="text-lg max-w-4xl mb-14" style={{ color: "#c8d8f2", lineHeight: "1.72" }}>
          Meet the MUTIS committee leading events, research, and career development across the society.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {members.map((member) => (
            <div
              key={member.name}
              className="p-7 rounded-lg"
              style={{ background: "#111827", border: "1px solid #374151" }}
            >
              <div
                className="w-16 h-16 rounded-full flex items-center justify-center text-white text-xl font-semibold mb-5"
                style={{ background: "#1a3370", border: "1px solid #2d5090" }}
              >
                {member.initials}
              </div>
              <h2 className="text-xl text-white font-semibold mb-1" style={{ fontFamily: "var(--font-nav)" }}>
                {member.name}
              </h2>
              <p className="text-sm mb-5" style={{ color: "#9ab8dc" }}>
                {member.role}
              </p>
              <a
                href={member.linkedin}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium"
                style={{ background: "#1a1f2e", border: "1px solid #374151", color: "#c8d8f2" }}
              >
                <Linkedin className="w-4 h-4" />
                LinkedIn
              </a>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
