import { useState } from "react";
import { FileText, Users, MonitorPlay, Target, ExternalLink } from "lucide-react";
import { meifTeams, meifPresentations } from "../data/siteData";

function PresentationCarousel() {
  const [activeTeam, setActiveTeam] = useState<string>("All");
  const teams = ["All", ...Array.from(new Set(meifPresentations.map((p) => p.team)))];
  const filtered =
    activeTeam === "All" ? meifPresentations : meifPresentations.filter((p) => p.team === activeTeam);

  return (
    <div className="mt-10">
      <h4 className="text-xl text-white mb-5" style={{ fontFamily: "var(--font-nav)", fontWeight: 600 }}>
        Team Presentations
      </h4>

      <div className="flex flex-wrap gap-2 mb-5">
        {teams.map((team) => (
          <button
            key={team}
            onClick={() => setActiveTeam(team)}
            className="px-4 py-1.5 rounded-full text-sm font-medium transition-all duration-200"
            style={{
              background: activeTeam === team ? "#1a3370" : "#1a1f2e",
              color: activeTeam === team ? "white" : "#9ab8dc",
              border: activeTeam === team ? "1px solid #2d5090" : "1px solid #374151",
            }}
          >
            {team}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {filtered.map((presentation) => (
          <div
            key={presentation.title}
            className="p-5 rounded-lg flex flex-col"
            style={{ background: "#1a1f2e", border: "1px solid #374151" }}
          >
            <p className="text-xs uppercase tracking-wider mb-2" style={{ color: "#9ab8dc" }}>
              {presentation.team}
            </p>
            <h5 className="text-white font-semibold mb-4 flex-1">{presentation.title}</h5>
            <a
              href={presentation.url}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium"
              style={{ background: "#1a3370", color: "white", border: "1px solid #374151" }}
            >
              <FileText className="w-4 h-4" />
              Open PDF
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        ))}
      </div>
    </div>
  );
}

export function MEIF() {
  const [activeTab, setActiveTab] = useState("teams");
  const [activeTeamId, setActiveTeamId] = useState("macro");

  const tabs = [
    { id: "teams", label: "Sector Teams", icon: <Users size={20} /> },
    { id: "competitions", label: "Competitions", icon: <FileText size={20} /> },
    { id: "workshops", label: "Workshops", icon: <MonitorPlay size={20} /> },
    { id: "outcomes", label: "Outcomes", icon: <Target size={20} /> },
  ];

  const activeTeam = meifTeams.find((team) => team.id === activeTeamId) ?? meifTeams[0];

  const competitions = [
    {
      title: "M&A Challenge",
      detail: "Case-based investment challenge focused on deal analysis, valuation, and IC-style recommendations.",
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
          MEIF: Ethical Investment Fund
        </h1>

        <p className="text-lg max-w-4xl mb-14" style={{ color: "#c8d8f2", lineHeight: "1.72" }}>
          The MUTIS Ethical Investment Fund (MEIF) is a student-led global equity fund. Members work in sector teams to research, pitch, and manage a real-money portfolio, gaining hands-on experience in investment analysis and portfolio management.
        </p>

        <div className="mb-10">
          <div className="flex flex-wrap gap-3 mb-6">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-5 py-2 rounded-full text-sm font-medium transition-all duration-200 ${activeTab === tab.id ? "bg-blue-800 text-white" : "bg-[#1a1f2e] text-[#9ab8dc] border border-[#374151]"}`}
                style={{ fontFamily: "var(--font-nav)" }}
              >
                <span className="inline-flex items-center gap-2">
                  {tab.icon}
                  {tab.label}
                </span>
              </button>
            ))}
          </div>

          {activeTab === "teams" && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {meifTeams.map((team) => (
                <div
                  key={team.id}
                  className={`p-7 rounded-lg cursor-pointer transition-all duration-200 ${activeTeamId === team.id ? "bg-blue-900 border-blue-700" : "bg-[#111827] border-[#374151]"}`}
                  style={{ border: "1px solid" }}
                  onClick={() => setActiveTeamId(team.id)}
                >
                  <h2 className="text-xl text-white font-semibold mb-2" style={{ fontFamily: "var(--font-nav)" }}>
                    {team.name}
                  </h2>
                  <p className="text-sm mb-3" style={{ color: "#9ab8dc" }}>
                    {team.desc}
                  </p>
                  <ul className="mb-3 text-xs" style={{ color: "#7090b8" }}>
                    {team.focus.map((focusItem) => (
                      <li key={focusItem}>• {focusItem}</li>
                    ))}
                  </ul>
                  <p className="text-xs" style={{ color: "#7090b8" }}>
                    {team.profile}
                  </p>
                </div>
              ))}

              <div
                className="p-7 rounded-lg lg:col-span-3"
                style={{ background: "#111827", border: "1px solid #374151" }}
              >
                <h3 className="text-lg text-white font-semibold mb-2">Selected Team</h3>
                <p className="text-sm" style={{ color: "#c8d8f2" }}>{activeTeam.name}</p>
              </div>
            </div>
          )}

          {activeTab === "competitions" && (
            <div className="p-7 rounded-lg bg-[#111827] border border-[#374151]">
              <h3 className="text-lg font-semibold text-white mb-2">Competitions</h3>
              <ul>
                {competitions.map((competition) => (
                  <li key={competition.title} className="mb-2">
                    <span className="font-semibold text-white">{competition.title}:</span> {competition.detail}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {activeTab === "workshops" && (
            <div className="p-7 rounded-lg bg-[#111827] border border-[#374151]">
              <h3 className="text-lg font-semibold text-white mb-2">Workshops</h3>
              <p className="text-sm" style={{ color: "#9ab8dc" }}>
                Technical workshops on valuation, financial modeling, and investment analysis.
              </p>
            </div>
          )}

          {activeTab === "outcomes" && (
            <div className="p-7 rounded-lg bg-[#111827] border border-[#374151]">
              <h3 className="text-lg font-semibold text-white mb-2">Outcomes</h3>
              <p className="text-sm" style={{ color: "#9ab8dc" }}>
                MEIF alumni have gone on to secure roles at leading investment banks, asset managers, and consulting firms.
              </p>
            </div>
          )}
        </div>

        <PresentationCarousel />
      </div>
    </div>
  );
}
