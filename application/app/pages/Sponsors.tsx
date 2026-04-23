export function Sponsors() {
  const partners = [
    {
      tier: "Current Corporate Sponsors & Partners",
      firms: [
        "UBS",
        "Rothschild & Co",
        "Goldman Sachs",
        "Wall Street Oasis (WSO)",
        "TradingView",
        "Career26",
        "Prima Ekuiti",
      ],
    },
    {
      tier: "Industry Event Partners",
      firms: [
        "Bank of America",
        "Barclays",
        "BNY",
        "Morgan Stanley",
        "NatWest",
        "RBC",
        "LGT Wealth Management",
        "Invesco",
        "Volcafe",
        "AmplifyME",
      ],
    },
    {
      tier: "Philanthropic & Educational Support",
      firms: [
        "Shade Tree Fund",
        "Trackr",
      ],
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
          Industry Partners
        </h1>

        <p
          className="text-lg max-w-4xl mb-14"
          style={{
            color: "#c8d8f2",
            lineHeight: "1.72",
          }}
        >
          MUTIS maintains a broad sponsorship ecosystem across investment banks, buy-side institutions, educational platforms, and career services to deliver high-impact opportunities for University of Manchester students.
        </p>

        {partners.map((group) => (
          <div key={group.tier} className="mb-12">
            <h2
              className="mb-6 uppercase tracking-widest text-sm font-semibold"
              style={{ color: "#9ab8dc" }}
            >
              {group.tier}
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {group.firms.map((firm) => (
                <div
                  key={firm}
                  className="p-6 rounded-lg"
                  style={{
                    background: "#111827",
                    border: "1px solid #374151",
                  }}
                >
                  <h3 className="text-base font-semibold text-white">{firm}</h3>
                </div>
              ))}
            </div>
          </div>
        ))}

        <div
          className="mt-14 p-10 rounded-lg text-center"
          style={{
            background: "#1a1f2e",
            border: "1px solid #2d3748",
          }}
        >
          <h3 className="text-2xl font-semibold text-white mb-4" style={{ fontFamily: "var(--font-nav)" }}>
            Interested in partnering with MUTIS?
          </h3>
          <p className="mb-6 text-base" style={{ color: "#c8d8f2" }}>
            Partnerships include recruitment events, competitions, trading simulations, educational bootcamps, and fund support initiatives.
          </p>
          <a
            href="mailto:mutis@manchesterstudentsunion.com"
            className="inline-flex px-10 py-4 rounded-md font-medium transition-all duration-300 hover:opacity-90"
            style={{
              background: "#0e2052",
              color: "white",
              border: "1px solid #2d5090",
            }}
          >
            Contact MUTIS
          </a>
        </div>
      </div>
    </div>
  );
}
