import { Linkedin } from "lucide-react";
import { committee } from "@/app/data/siteData";

type CommitteeMember = (typeof committee)[number];

export function Team() {
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
          Meet the Team
        </h1>

        <p className="text-lg max-w-4xl mb-14" style={{ color: "#c8d8f2", lineHeight: "1.72" }}>
          MUTIS is run by a dedicated student committee across events, research, careers, and operations. Meet the people behind the society.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {committee.map((member: CommitteeMember) => (
            <div
              key={member.name}
              className="p-7 rounded-lg flex flex-col items-center text-center"
              style={{ background: "#111827", border: "1px solid #374151" }}
            >
              {member.headshot ? (
                <img
                  src={member.headshot}
                  alt={member.name}
                  className="w-20 h-20 rounded-full object-cover mb-5"
                  style={{ border: "2px solid #2d5090" }}
                />
              ) : (
                <div
                  className="w-20 h-20 rounded-full flex items-center justify-center text-white text-2xl font-semibold mb-5"
                  style={{ background: "#1a3370", border: "1px solid #2d5090" }}
                >
                  {member.initials}
                </div>
              )}

              <h2 className="text-xl text-white font-semibold mb-1" style={{ fontFamily: "var(--font-nav)" }}>
                {member.name}
              </h2>
              <p className="text-sm mb-5" style={{ color: "#9ab8dc" }}>
                {member.role}
              </p>

              <a
                href={member.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium"
                style={{ background: "#1a1f2e", border: "1px solid #374151", color: "#c8d8f2" }}
              >
                <Linkedin className="w-4 h-4" />
                LinkedIn
              </a>
            </div>
          ))}
        </div>

        <p className="mt-10 text-sm text-center" style={{ color: "#7090b8" }}>
          To update committee members, edit
          <code className="px-1 py-0.5 rounded text-xs ml-1" style={{ background: "#1a1f2e" }}>
            application/app/data/siteData.ts
          </code>
          .
        </p>
      </div>
    </div>
  );
}
