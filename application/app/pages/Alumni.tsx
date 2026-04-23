export function Alumni() {
  const outcomes = [
    {
      title: "Investment Banking",
      detail: "Members receive targeted preparation for spring weeks, internships, and graduate programmes at leading global banks.",
    },
    {
      title: "Asset Management",
      detail: "Portfolio research and market training through MUTIS and MEIF support applications in buy-side pathways.",
    },
    {
      title: "Markets & Trading",
      detail: "Trading simulations and competition exposure help students build practical market confidence.",
    },
    {
      title: "Private Equity & Advisory",
      detail: "Case-based challenges and workshops develop deal-thinking and commercial judgment.",
    },
  ];

  const community = [
    "Networking with like-minded students and an active alumni network.",
    "Social events including the annual Business Ball and holiday socials.",
    "Cross-discipline membership spanning STEM, Business, Economics, and other courses.",
    "Community support for members at every stage of their finance journey.",
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
          Alumni & Community
        </h1>

        <p
          className="text-lg max-w-4xl mb-14"
          style={{
            color: "#c8d8f2",
            lineHeight: "1.72",
          }}
        >
          MUTIS connects current students with alumni and professionals across financial services. The society's community is built around mentorship, peer learning, and long-term career support.
        </p>

        <h2 className="mb-8" style={{ fontSize: "clamp(1.8rem, 3.5vw, 2.6rem)", color: "white", fontFamily: "var(--font-nav)", fontWeight: 600 }}>
          Career Pathways
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-16">
          {outcomes.map((item, index) => (
            <div
              key={index}
              className="p-7 rounded-lg"
              style={{
                background: "#111827",
                border: "1px solid #374151",
              }}
            >
              <h3 className="text-xl font-bold text-white mb-2">{item.title}</h3>
              <p className="text-sm leading-relaxed" style={{ color: "#c8d8f2" }}>
                {item.detail}
              </p>
            </div>
          ))}
        </div>

        <h2 className="mb-8" style={{ fontSize: "clamp(1.8rem, 3.5vw, 2.6rem)", color: "white", fontFamily: "var(--font-nav)", fontWeight: 600 }}>
          Community Highlights
        </h2>

        <div
          className="rounded-lg p-8"
          style={{
            background: "#1a1f2e",
            border: "1px solid #2d3748",
          }}
        >
          <ul className="space-y-4">
            {community.map((line, index) => (
              <li key={index} className="flex items-start gap-3">
                <span className="mt-2 w-2 h-2 rounded-full flex-shrink-0" style={{ background: "#5e9cda" }} />
                <span className="text-base" style={{ color: "#c8d8f2" }}>
                  {line}
                </span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
