export function Sponsors() {
  const vacancyLinks: Record<string, string> = {
    "UBS": "https://www.ubs.com/global/en/careers.html",
    "Rothschild & Co": "https://www.rothschildandco.com/en/careers/",
    "Goldman Sachs": "https://www.goldmansachs.com/careers/",
    "Wall Street Oasis (WSO)": "https://www.wallstreetoasis.com/jobs",
    "TradingView": "https://www.tradingview.com/careers/",
    "Career26": "https://career26.com/",
    "Prima Ekuiti": "https://primaekuiti.com/",
    "Bank of America": "https://careers.bankofamerica.com/en-us",
    "Barclays": "https://search.jobs.barclays/",
    "BNY": "https://jobs.bny.com/",
    "Morgan Stanley": "https://www.morganstanley.com/careers",
    "NatWest": "https://jobs.natwestgroup.com/",
    "RBC": "https://jobs.rbc.com/",
    "LGT Wealth Management": "https://www.lgtwm.com/en/careers/",
    "Invesco": "https://careers.invesco.com/",
    "Volcafe": "https://www.volcafe.com/careers/",
    "AmplifyME": "https://www.amplifyme.com/careers",
    "Shade Tree Fund": "https://shadetreefund.org/",
    "Trackr": "https://www.trackr.com/",
  };

  const logoMap: Record<string, string> = {
    "UBS": "https://logo.clearbit.com/ubs.com",
    "Rothschild & Co": "https://logo.clearbit.com/rothschildandco.com",
    "Goldman Sachs": "https://logo.clearbit.com/goldmansachs.com",
    "Wall Street Oasis (WSO)": "https://logo.clearbit.com/wallstreetoasis.com",
    "TradingView": "https://logo.clearbit.com/tradingview.com",
    "Career26": "https://logo.clearbit.com/career26.com",
    "Prima Ekuiti": "https://logo.clearbit.com/primaekuiti.com",
    "Bank of America": "https://logo.clearbit.com/bankofamerica.com",
    "Barclays": "https://logo.clearbit.com/barclays.com",
    "BNY": "https://logo.clearbit.com/bny.com",
    "Morgan Stanley": "https://logo.clearbit.com/morganstanley.com",
    "NatWest": "https://logo.clearbit.com/natwest.com",
    "RBC": "https://logo.clearbit.com/rbc.com",
    "LGT Wealth Management": "https://logo.clearbit.com/lgt.com",
    "Invesco": "https://logo.clearbit.com/invesco.com",
    "Volcafe": "https://logo.clearbit.com/volcafe.com",
    "AmplifyME": "https://logo.clearbit.com/amplifyme.com",
    "Shade Tree Fund": "https://logo.clearbit.com/shadetreefund.org",
    "Trackr": "https://logo.clearbit.com/trackr.com",
  };

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
                <a
                  key={firm}
                  href={vacancyLinks[firm] ?? "#"}
                  target="_blank"
                  rel="noreferrer"
                  className="p-6 rounded-lg flex items-center justify-center min-h-[110px]"
                  style={{
                    background: "#111827",
                    border: "1px solid #374151",
                  }}
                >
                  <div className="text-center">
                    <div className="text-[0.68rem] uppercase tracking-[0.2em] mb-1" style={{ color: "#9ab8dc" }}>
                      Vacancies
                    </div>
                    <img src={logoMap[firm]} alt={firm} className="h-7 mx-auto mb-2 object-contain" />
                    <h3 className="text-lg font-semibold text-white" style={{ fontFamily: "var(--font-nav)" }}>
                      {firm}
                    </h3>
                  </div>
                </a>
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
