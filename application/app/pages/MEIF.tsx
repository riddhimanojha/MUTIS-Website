import { useState } from "react";
import { ChevronRight, FileText, Users, MonitorPlay, Target, BarChart2 } from "lucide-react";

export function MEIF() {
  const [activeTab, setActiveTab] = useState("teams");

  const tabs = [
    { id: "teams", label: "Sector Teams", icon: <Users size={20} /> },
    { id: "competitions", label: "Competitions", icon: <FileText size={20} /> },
    { id: "workshops", label: "Workshops", icon: <MonitorPlay size={20} /> },
    { id: "outcomes", label: "Outcomes", icon: <Target size={20} /> },
  ];

  const teams = [
    {
      name: "TMT (Technology, Media, Telecom)",
      desc: "Researches high-growth technology and communications businesses across global equity markets.",
      focus: ["Earnings quality", "Valuation", "Catalyst tracking"],
      profile: "Ideal for members interested in innovation-led sectors.",
    },
    {
      name: "Energy",
      desc: "Covers conventional and transition energy names, macro drivers, and commodity-linked equity ideas.",
      focus: ["Macro sensitivity", "Commodity exposure", "Capital discipline"],
      profile: "Great for students who enjoy macro and market structure.",
    },
    {
      name: "Industrials",
      desc: "Analyses global industrial leaders, supply chains, and cyclical demand shifts.",
      focus: ["Operating leverage", "Order books", "Margin drivers"],
      profile: "Suited to members who like structured fundamental analysis.",
    },
    {
      name: "Cross-Sector Research",
      desc: "Supports stock pitches and portfolio reviews by comparing opportunities across covered sectors.",
      focus: ["Relative value", "Portfolio fit", "Risk management"],
      profile: "Useful for members developing broad investing judgment.",
    },
  ];

  const competitions = [
    {
      title: "Private Equity Challenge",
      detail: "Case-based investment challenge focused on deal analysis, valuation, and IC-style recommendations.",
    },
    {
      title: "Dare Trading Championship",
      detail: "Trading simulation that tests risk-taking, execution discipline, and portfolio decision-making under pressure.",
    },
    {
      title: "Stock Pitch Competitions",
      detail: "Members present long/short ideas with investment thesis, valuation framework, and risk controls.",
    },
    {
      title: "Trading Simulations",
      detail: "Hands-on sessions designed to build market intuition and real-time decision-making skills.",
    },
  ];

  const workshops = [
    "Weekly meetings on trading, investing, and investment banking fundamentals.",
    "Practical research training for idea generation and thesis development.",
    "Portfolio review sessions with feedback from experienced members and alumni.",
    "Professional development support: CV, cover letter, and interview preparation.",
  ];

  const outcomes = [
    "Members gain hands-on portfolio management experience through live fund participation.",
    "Students build sector-specific research capability used in internships and graduate applications.",
    "MEIF participation supports applications to spring weeks, internships, and analyst roles.",
    "Alumni progress to firms such as Goldman Sachs, J.P. Morgan, and other leading institutions.",
  ];

  return (
    <div className="relative min-h-screen overflow-hidden">
      <div className="relative z-10 pt-24 pb-20 px-8">
        <section className="max-w-[1400px] mx-auto mb-16">
          <div
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full mb-8"
            style={{
              background: "#132a5e",
              border: "1px solid #374151",
            }}
          >
            <BarChart2 size={16} className="text-white" />
            <span className="text-white font-semibold text-sm tracking-wider uppercase">MUTIS Ethical Investment Fund</span>
          </div>

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
            Student-Led Global Equity Fund
          </h1>

          <p
            className="text-lg max-w-3xl mb-10"
            style={{ color: "#c8d8f2", lineHeight: "1.7" }}
          >
            MEIF gives members direct experience in portfolio management and sector research. The programme is designed to translate classroom knowledge into practical investment work through structured team coverage and performance review.
          </p>

          <div className="flex flex-wrap gap-4">
            <button
              className="group px-10 py-4 rounded-md font-semibold transition-all duration-300"
              style={{
                background: "#0e2052",
                color: "white",
                border: "1px solid #2d5090",
              }}
            >
              <span className="flex items-center gap-2">
                Apply to MEIF
                <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </span>
            </button>
            <button
              className="px-10 py-4 rounded-md font-medium transition-all duration-300 hover:opacity-90"
              style={{
                background: "#1a3370",
                color: "white",
                border: "1px solid #374151",
              }}
            >
              View Programme Structure
            </button>
          </div>
        </section>

        <section className="max-w-[1400px] mx-auto mb-16">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className="p-7 rounded-lg flex flex-col items-center justify-center gap-4 transition-all duration-300"
                style={{
                  background: activeTab === tab.id ? "#1a3370" : "#111827",
                  border: activeTab === tab.id ? "1px solid #243e84" : "1px solid #2d3748",
                  transform: activeTab === tab.id ? "scale(1.03)" : "scale(1)",
                }}
              >
                <div
                  className="p-4 rounded-xl"
                  style={{ background: activeTab === tab.id ? "#1e3878" : "#132a5e" }}
                >
                  <div className="text-white">{tab.icon}</div>
                </div>
                <span className="font-bold tracking-wide text-white text-sm">{tab.label}</span>
              </button>
            ))}
          </div>
        </section>

        <section className="max-w-[1400px] mx-auto min-h-[420px]">
          {activeTab === "teams" && (
            <div>
              <h3
                className="mb-8"
                style={{
                  fontSize: "clamp(1.9rem, 3.8vw, 2.8rem)",
                  fontWeight: "600",
                  color: "white",
                  lineHeight: "1.14",
                  fontFamily: "var(--font-nav)",
                }}
              >
                Sector Coverage Teams
              </h3>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {teams.map((team, i) => (
                  <div
                    key={i}
                    className="rounded-lg p-8"
                    style={{
                      background: "#111827",
                      border: "1px solid #374151",
                    }}
                  >
                    <h4 className="text-2xl font-bold text-white mb-3">{team.name}</h4>
                    <p className="text-sm mb-5 leading-relaxed" style={{ color: "#c8d8f2" }}>
                      {team.desc}
                    </p>
                    <div className="flex flex-wrap gap-2 mb-5">
                      {team.focus.map((item, j) => (
                        <span
                          key={j}
                          className="text-xs font-medium px-3 py-1.5 rounded-lg"
                          style={{ background: "#1f2937", color: "#c8d8f2" }}
                        >
                          {item}
                        </span>
                      ))}
                    </div>
                    <p className="text-sm" style={{ color: "#b8cce8" }}>
                      {team.profile}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === "competitions" && (
            <div>
              <h3
                className="mb-8"
                style={{
                  fontSize: "clamp(1.9rem, 3.8vw, 2.8rem)",
                  fontWeight: "600",
                  color: "white",
                  lineHeight: "1.14",
                  fontFamily: "var(--font-nav)",
                }}
              >
                Competitions & Challenges
              </h3>

              <div className="grid md:grid-cols-2 gap-6">
                {competitions.map((item, i) => (
                  <div
                    key={i}
                    className="rounded-lg p-7"
                    style={{
                      background: "#111827",
                      border: "1px solid #374151",
                    }}
                  >
                    <h4 className="text-xl font-bold text-white mb-2">{item.title}</h4>
                    <p className="text-sm leading-relaxed" style={{ color: "#c8d8f2" }}>
                      {item.detail}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {(activeTab === "workshops" || activeTab === "outcomes") && (
            <div>
              <h3
                className="mb-8"
                style={{
                  fontSize: "clamp(1.9rem, 3.8vw, 2.8rem)",
                  fontWeight: "600",
                  color: "white",
                  lineHeight: "1.14",
                  fontFamily: "var(--font-nav)",
                }}
              >
                {activeTab === "workshops" ? "Training & Workshops" : "Member Outcomes"}
              </h3>

              <div
                className="rounded-lg p-10"
                style={{
                  background: "#111827",
                  border: "1px solid #374151",
                }}
              >
                <ul className="space-y-4">
                  {(activeTab === "workshops" ? workshops : outcomes).map((line, i) => (
                    <li key={i} className="flex items-start gap-3">
                      <span className="mt-2 w-2 h-2 rounded-full flex-shrink-0" style={{ background: "#5e9cda" }} />
                      <span className="text-base" style={{ color: "#c8d8f2" }}>
                        {line}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
