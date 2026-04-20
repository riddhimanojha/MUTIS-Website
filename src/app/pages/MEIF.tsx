import { useState } from "react";
import { ChevronRight, FileText, Users, MonitorPlay, Target, BarChart2, Download } from "lucide-react";

export function MEIF() {
  const [activeTab, setActiveTab] = useState("teams");

  const tabs = [
    { id: "teams", label: "Teams", icon: <Users size={20} /> },
    { id: "pitches", label: "Past Pitches", icon: <FileText size={20} /> },
    { id: "articles", label: "Articles", icon: <Target size={20} /> },
    { id: "workshops", label: "Workshops", icon: <MonitorPlay size={20} /> },
  ];

  const teams = [
    { name: "TMT (Tech, Media, Telecom)", desc: "Analyzing high-growth tech firms, semiconductor trends, and telecommunications infrastructure.", drivers: ["Cloud Computing", "AI/ML Integration", "5G Rollout"], profile: "Strong analytical skills, passion for tech trends, basic valuation knowledge." },
    { name: "Consumer & Retail", desc: "Evaluating FMCG companies, luxury brands, and e-commerce platforms in changing macroeconomic environments.", drivers: ["Inflationary Pressures", "Supply Chain Resilience", "Consumer Sentiment"], profile: "Understanding of macroeconomics, interest in brand valuation." },
    { name: "Healthcare & Life Sciences", desc: "Researching pharmaceutical pipelines, med-tech innovations, and healthcare service providers.", drivers: ["Regulatory Approvals", "Patent Expiries", "Aging Demographics"], profile: "Scientific background (helpful but not required), detail-oriented." },
    { name: "Financial Institutions (FIG)", desc: "Assessing banks, asset managers, and fintech disruptors.", drivers: ["Interest Rate Environments", "Regulatory Capital", "Digital Transformation"], profile: "Strong grasp of accounting principles, interest in monetary policy." },
    { name: "Energy & Industrials", desc: "Focusing on traditional energy, renewables transition, and heavy manufacturing.", drivers: ["ESG Mandates", "Commodity Prices", "Infrastructure Spending"], profile: "Interest in geopolitics, understanding of complex supply chains." }
  ];

  const pitches = [
    { company: "NVIDIA Corp (NVDA)", type: "Long Pitch", date: "Feb 2026", team: "TMT", return: "+45.2%" },
    { company: "LVMH (MC.PA)", type: "Short Pitch", date: "Nov 2025", team: "Consumer & Retail", return: "+12.1%" },
    { company: "AstraZeneca (AZN)", type: "Long Pitch", date: "Oct 2025", team: "Healthcare", return: "+8.5%" },
    { company: "JPMorgan Chase (JPM)", type: "Long Pitch", date: "Sep 2025", team: "FIG", return: "+15.3%" },
  ];

  const placements = [
    "Goldman Sachs", "Morgan Stanley", "J.P. Morgan", "Citadel", "Point72", "BlackRock", "Bank of America", "Barclays"
  ];

  return (
    <div className="relative min-h-screen overflow-hidden">
      <SilkWaveBackground />

      <div className="relative z-10 pt-32 pb-24 px-8">
        <section className="max-w-[1400px] mx-auto mb-20">
          <div
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full mb-8"
            style={{
              background: "rgba(255, 255, 255, 0.08)",
              backdropFilter: "blur(20px) saturate(180%)",
              border: "1px solid rgba(255, 255, 255, 0.15)",
              boxShadow: "0 4px 20px rgba(0, 0, 0, 0.2), inset 0 1px 2px rgba(255, 255, 255, 0.1)",
            }}
          >
            <BarChart2 size={16} className="text-white" />
            <span className="text-white font-semibold text-sm tracking-wider uppercase">
              Real Capital, Real Returns
            </span>
          </div>

          <h1
            className="mb-6"
            style={{
              fontSize: "clamp(3rem, 7vw, 6rem)",
              fontWeight: "900",
              color: "white",
              lineHeight: "1.05",
              textShadow: "0 4px 40px rgba(0, 0, 0, 0.5)",
            }}
          >
            MUTIS Equity<br />Investment Fund
          </h1>

          <p
            className="text-xl max-w-3xl mb-12"
            style={{ color: "rgba(255, 255, 255, 0.8)", lineHeight: "1.7", textShadow: "0 2px 20px rgba(0, 0, 0, 0.3)" }}
          >
            MEIF is a student-led investment fund managing a live portfolio. We provide members with hands-on experience in equity research, financial modeling, and portfolio management, bridging the gap between academia and the buyside.
          </p>

          <div className="flex flex-wrap gap-4">
            <button
              className="group relative px-10 py-4 rounded-2xl font-medium transition-all duration-500 overflow-hidden"
              style={{
                background: "linear-gradient(135deg, rgba(15, 15, 25, 0.95) 0%, rgba(25, 25, 45, 0.9) 100%)",
                color: "white",
                border: "1px solid rgba(139, 69, 172, 0.4)",
                boxShadow: "0 20px 60px rgba(139, 69, 172, 0.3), inset 0 1px 2px rgba(255, 255, 255, 0.1)",
              }}
            >
              <div
                className="absolute inset-0 opacity-50 group-hover:opacity-70 transition-opacity duration-500"
                style={{
                  background: "radial-gradient(circle at center, rgba(139, 69, 172, 0.4) 0%, transparent 70%)",
                }}
              />
              <span className="relative z-10 flex items-center gap-2">
                Apply for Fall 2026
                <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </span>
            </button>
            <button
              className="px-10 py-4 rounded-2xl font-medium transition-all duration-300 hover:scale-105"
              style={{
                background: "rgba(255, 255, 255, 0.08)",
                backdropFilter: "blur(30px) saturate(180%)",
                color: "white",
                border: "1px solid rgba(255, 255, 255, 0.18)",
                boxShadow: "0 8px 32px rgba(0, 0, 0, 0.2), inset 0 1px 2px rgba(255, 255, 255, 0.15)",
              }}
            >
              View Portfolio Factsheet
            </button>
          </div>
        </section>

        <section className="max-w-[1400px] mx-auto mb-20">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className="p-8 rounded-3xl flex flex-col items-center justify-center gap-4 transition-all duration-500"
                style={{
                  background: activeTab === tab.id
                    ? "rgba(255, 255, 255, 0.08)"
                    : "rgba(255, 255, 255, 0.04)",
                  backdropFilter: "blur(30px) saturate(180%)",
                  WebkitBackdropFilter: "blur(30px) saturate(180%)",
                  border: activeTab === tab.id
                    ? "1px solid rgba(255, 255, 255, 0.2)"
                    : "1px solid rgba(255, 255, 255, 0.1)",
                  boxShadow: activeTab === tab.id
                    ? "0 20px 50px rgba(0, 0, 0, 0.3), inset 0 1px 3px rgba(255, 255, 255, 0.15)"
                    : "0 10px 30px rgba(0, 0, 0, 0.2)",
                  transform: activeTab === tab.id ? "scale(1.03)" : "scale(1)",
                }}
              >
                <div
                  className="p-4 rounded-xl"
                  style={{
                    background: activeTab === tab.id
                      ? "rgba(255, 255, 255, 0.15)"
                      : "rgba(255, 255, 255, 0.06)",
                  }}
                >
                  <div className="text-white">{tab.icon}</div>
                </div>
                <span className="font-bold tracking-wide text-white text-sm">
                  {tab.label}
                </span>
              </button>
            ))}
          </div>
        </section>

        <section className="max-w-[1400px] mx-auto min-h-[500px]">
          {activeTab === "teams" && (
            <div>
              <div className="mb-12">
                <h3
                  className="mb-4"
                  style={{
                    fontSize: "clamp(2rem, 4vw, 3.5rem)",
                    fontWeight: "800",
                    color: "white",
                    lineHeight: "1.1",
                    textShadow: "0 4px 30px rgba(0, 0, 0, 0.4)",
                  }}
                >
                  Coverage Sectors
                </h3>
                <p className="text-lg" style={{ color: "rgba(255, 255, 255, 0.7)" }}>
                  Explore our specialized sector coverage teams
                </p>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {teams.map((team, i) => (
                  <div
                    key={i}
                    className="group rounded-3xl p-8 transition-all duration-500 hover:scale-[1.02]"
                    style={{
                      background: "rgba(255, 255, 255, 0.05)",
                      backdropFilter: "blur(30px) saturate(180%)",
                      WebkitBackdropFilter: "blur(30px) saturate(180%)",
                      border: "1px solid rgba(255, 255, 255, 0.12)",
                      boxShadow: "0 20px 50px rgba(0, 0, 0, 0.25), inset 0 1px 2px rgba(255, 255, 255, 0.12)",
                    }}
                  >
                    <div
                      className="absolute inset-0 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
                      style={{
                        background: "radial-gradient(circle at center, rgba(139, 69, 172, 0.08) 0%, transparent 70%)",
                      }}
                    />

                    <div className="relative z-10">
                      <div
                        className="w-14 h-14 rounded-xl flex items-center justify-center mb-6"
                        style={{
                          background: "rgba(255, 255, 255, 0.1)",
                        }}
                      >
                        <Target size={28} className="text-white" />
                      </div>
                      <h4 className="text-2xl font-bold text-white mb-3">{team.name}</h4>
                      <p className="text-sm mb-6 leading-relaxed" style={{ color: "rgba(255, 255, 255, 0.7)" }}>
                        {team.desc}
                      </p>

                      <div className="space-y-5 pt-6" style={{ borderTop: "1px solid rgba(255, 255, 255, 0.1)" }}>
                        <div>
                          <span className="text-xs font-bold uppercase tracking-wider mb-2 block" style={{ color: "rgba(255, 255, 255, 0.5)" }}>
                            Key Drivers
                          </span>
                          <div className="flex flex-wrap gap-2">
                            {team.drivers.map((driver, j) => (
                              <span
                                key={j}
                                className="text-xs font-medium px-3 py-1.5 rounded-lg"
                                style={{
                                  background: "rgba(255, 255, 255, 0.08)",
                                  color: "rgba(255, 255, 255, 0.9)",
                                }}
                              >
                                {driver}
                              </span>
                            ))}
                          </div>
                        </div>
                        <div>
                          <span className="text-xs font-bold uppercase tracking-wider mb-1 block" style={{ color: "rgba(255, 255, 255, 0.5)" }}>
                            Ideal Candidate
                          </span>
                          <p className="text-sm font-medium" style={{ color: "rgba(255, 255, 255, 0.8)" }}>
                            {team.profile}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === "pitches" && (
            <div>
              <div className="mb-12">
                <h3
                  className="mb-4"
                  style={{
                    fontSize: "clamp(2rem, 4vw, 3.5rem)",
                    fontWeight: "800",
                    color: "white",
                    lineHeight: "1.1",
                    textShadow: "0 4px 30px rgba(0, 0, 0, 0.4)",
                  }}
                >
                  Recent Pitches
                </h3>
                <p className="text-lg" style={{ color: "rgba(255, 255, 255, 0.7)" }}>
                  Download our latest investment memos and presentations
                </p>
              </div>

              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                {pitches.map((pitch, i) => (
                  <div
                    key={i}
                    className="rounded-3xl p-6 flex flex-col h-full group cursor-pointer transition-all duration-500 hover:scale-[1.03]"
                    style={{
                      background: "rgba(255, 255, 255, 0.05)",
                      backdropFilter: "blur(30px) saturate(180%)",
                      WebkitBackdropFilter: "blur(30px) saturate(180%)",
                      border: "1px solid rgba(255, 255, 255, 0.12)",
                      boxShadow: "0 20px 50px rgba(0, 0, 0, 0.25), inset 0 1px 2px rgba(255, 255, 255, 0.12)",
                    }}
                  >
                    <div className="flex justify-between items-start mb-4">
                      <div
                        className="px-3 py-1.5 rounded-lg text-xs font-bold"
                        style={{
                          background: pitch.type === "Long Pitch"
                            ? "rgba(16, 185, 129, 0.15)"
                            : "rgba(239, 68, 68, 0.15)",
                          color: pitch.type === "Long Pitch" ? "#10b981" : "#ef4444",
                        }}
                      >
                        {pitch.type}
                      </div>
                      <span className="text-xs font-medium" style={{ color: "rgba(255, 255, 255, 0.5)" }}>
                        {pitch.date}
                      </span>
                    </div>

                    <h4 className="text-lg font-bold text-white mb-1">{pitch.company}</h4>
                    <p className="text-sm mb-6" style={{ color: "rgba(255, 255, 255, 0.6)" }}>
                      Team: {pitch.team}
                    </p>

                    <div className="mt-auto pt-6 flex items-center justify-between" style={{ borderTop: "1px solid rgba(255, 255, 255, 0.1)" }}>
                      <div>
                        <span className="text-[10px] uppercase font-bold block mb-1" style={{ color: "rgba(255, 255, 255, 0.4)" }}>
                          Est. Return
                        </span>
                        <span className="font-bold text-sm text-[#10b981]">{pitch.return}</span>
                      </div>
                      <button
                        className="p-2.5 rounded-lg transition-all duration-300 hover:scale-110"
                        style={{
                          background: "rgba(255, 255, 255, 0.1)",
                        }}
                      >
                        <Download size={18} className="text-white/70" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {(activeTab === "articles" || activeTab === "workshops") && (
            <div
              className="rounded-3xl p-16 flex flex-col items-center justify-center text-center"
              style={{
                background: "rgba(255, 255, 255, 0.04)",
                backdropFilter: "blur(30px) saturate(180%)",
                WebkitBackdropFilter: "blur(30px) saturate(180%)",
                border: "1px solid rgba(255, 255, 255, 0.1)",
                boxShadow: "0 20px 50px rgba(0, 0, 0, 0.25)",
              }}
            >
              <div
                className="w-20 h-20 rounded-full flex items-center justify-center mb-6"
                style={{
                  background: "rgba(255, 255, 255, 0.08)",
                }}
              >
                <Target size={36} className="text-white/60" />
              </div>
              <h3 className="text-3xl font-bold text-white mb-3">Content in Development</h3>
              <p className="max-w-md text-lg" style={{ color: "rgba(255, 255, 255, 0.6)" }}>
                We are currently migrating our {activeTab} archive to the new platform. Please check back soon.
              </p>
            </div>
          )}
        </section>

        <section className="max-w-[1400px] mx-auto mt-32 pt-20" style={{ borderTop: "1px solid rgba(255, 255, 255, 0.1)" }}>
          <div className="text-center mb-16">
            <div
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full mb-8"
              style={{
                background: "rgba(255, 255, 255, 0.08)",
                backdropFilter: "blur(20px) saturate(180%)",
                border: "1px solid rgba(255, 255, 255, 0.15)",
                boxShadow: "0 4px 20px rgba(0, 0, 0, 0.2), inset 0 1px 2px rgba(255, 255, 255, 0.1)",
              }}
            >
              <span className="text-white font-semibold text-sm tracking-wider uppercase">
                Track Record
              </span>
            </div>

            <h3
              className="mb-6"
              style={{
                fontSize: "clamp(2.5rem, 5vw, 4rem)",
                fontWeight: "800",
                color: "white",
                lineHeight: "1.1",
                textShadow: "0 4px 30px rgba(0, 0, 0, 0.4)",
              }}
            >
              Where Our Analysts Go
            </h3>
            <p className="max-w-2xl mx-auto text-xl" style={{ color: "rgba(255, 255, 255, 0.7)", lineHeight: "1.7" }}>
              MEIF alumni consistently secure placements at top-tier investment banks, hedge funds, and private equity firms globally
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {placements.map((company, i) => (
              <div
                key={i}
                className="h-28 rounded-2xl flex items-center justify-center p-6 transition-all duration-300 hover:scale-105 cursor-pointer"
                style={{
                  background: "rgba(255, 255, 255, 0.03)",
                  backdropFilter: "blur(20px) saturate(180%)",
                  border: "1px solid rgba(255, 255, 255, 0.1)",
                  boxShadow: "0 10px 30px rgba(0, 0, 0, 0.2), inset 0 1px 1px rgba(255, 255, 255, 0.08)",
                }}
              >
                <span className="font-bold text-base uppercase tracking-wider transition-colors hover:text-white" style={{ color: "rgba(255, 255, 255, 0.4)" }}>
                  {company}
                </span>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}

function SilkWaveBackground() {
  return (
    <div className="fixed inset-0 z-0">
      <div
        className="absolute inset-0"
        style={{
          background: `
            radial-gradient(ellipse 150% 100% at 20% 30%, rgba(139, 69, 172, 0.15) 0%, transparent 50%),
            radial-gradient(ellipse 120% 80% at 80% 70%, rgba(219, 39, 119, 0.12) 0%, transparent 50%),
            radial-gradient(circle at 50% 50%, #0F2855 0%, #0A1F44 50%, #06132A 100%)
          `,
        }}
      />

      <svg className="absolute inset-0 w-full h-full" preserveAspectRatio="none">
        <defs>
          <linearGradient id="wave-gradient-1" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="rgba(43, 94, 168, 0.3)" />
            <stop offset="50%" stopColor="rgba(139, 69, 172, 0.2)" />
            <stop offset="100%" stopColor="rgba(27, 62, 119, 0.25)" />
          </linearGradient>
          <linearGradient id="wave-gradient-2" x1="100%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="rgba(219, 39, 119, 0.15)" />
            <stop offset="50%" stopColor="rgba(139, 69, 172, 0.18)" />
            <stop offset="100%" stopColor="rgba(43, 94, 168, 0.2)" />
          </linearGradient>
          <filter id="wave-glow">
            <feGaussianBlur stdDeviation="40" result="coloredBlur"/>
            <feMerge>
              <feMergeNode in="coloredBlur"/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>
        </defs>

        <path
          d="M0,400 Q200,300 400,350 T800,400 T1200,350 T1600,400 T2000,350 L2000,0 L0,0 Z"
          fill="url(#wave-gradient-1)"
          filter="url(#wave-glow)"
          opacity="0.4"
        />
        <path
          d="M0,500 Q250,420 500,470 T1000,500 T1500,450 T2000,500 L2000,0 L0,0 Z"
          fill="url(#wave-gradient-2)"
          filter="url(#wave-glow)"
          opacity="0.3"
        />
        <path
          d="M0,600 Q300,520 600,580 T1200,600 T1800,560 T2400,600 L2400,0 L0,0 Z"
          fill="rgba(43, 94, 168, 0.15)"
          opacity="0.5"
        />
      </svg>

      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: "radial-gradient(circle at center, transparent 40%, rgba(6, 19, 42, 0.6) 100%)",
        }}
      />

      <div className="absolute inset-0 pointer-events-none opacity-30">
        <div
          className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full"
          style={{
            background: "radial-gradient(circle, rgba(219, 39, 119, 0.2) 0%, transparent 70%)",
            filter: "blur(60px)",
          }}
        />
        <div
          className="absolute bottom-1/3 right-1/4 w-96 h-96 rounded-full"
          style={{
            background: "radial-gradient(circle, rgba(139, 69, 172, 0.25) 0%, transparent 70%)",
            filter: "blur(80px)",
          }}
        />
      </div>
    </div>
  );
}
