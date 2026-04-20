export function Sponsors() {
  const sponsors = [
    {
      name: "Goldman Sachs",
      tier: "Platinum",
      description: "Global leader in investment banking, securities, and asset management.",
    },
    {
      name: "JP Morgan",
      tier: "Platinum",
      description: "One of the world's largest financial institutions offering banking and investment services.",
    },
    {
      name: "Barclays",
      tier: "Gold",
      description: "British multinational banking and financial services company.",
    },
    {
      name: "Citi",
      tier: "Gold",
      description: "Global bank serving consumers, corporations, and governments across 160 countries.",
    },
    {
      name: "Morgan Stanley",
      tier: "Silver",
      description: "Leading global financial services firm providing investment banking and wealth management.",
    },
    {
      name: "BlackRock",
      tier: "Silver",
      description: "World's largest asset manager providing investment and risk management solutions.",
    },
    {
      name: "Bridgewater",
      tier: "Silver",
      description: "World's largest hedge fund, known for its macro strategy and unique culture.",
    },
    {
      name: "Citadel",
      tier: "Silver",
      description: "Leading global financial institution with hedge fund and market-making divisions.",
    },
  ];

  const tiers = ["Platinum", "Gold", "Silver"];

  return (
    <div className="relative min-h-screen pt-32 pb-24 px-8">
      <div className="max-w-[1400px] mx-auto">
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
          Our Sponsors
        </h1>

        <p
          className="text-xl max-w-3xl mb-20"
          style={{
            color: "rgba(255, 255, 255, 0.8)",
            lineHeight: "1.7",
            textShadow: "0 2px 20px rgba(0, 0, 0, 0.3)",
          }}
        >
          MUTIS is proud to partner with industry-leading financial institutions
          who support our mission of empowering student investors and future
          finance professionals.
        </p>

        {tiers.map((tier) => {
          const tierSponsors = sponsors.filter((s) => s.tier === tier);
          return (
            <div key={tier} className="mb-16">
              <h2
                className="mb-8 uppercase tracking-widest text-sm font-semibold"
                style={{ color: "rgba(255, 255, 255, 0.5)" }}
              >
                {tier} Partners
              </h2>

              <div
                className={`grid gap-6 ${
                  tier === "Platinum"
                    ? "grid-cols-1 md:grid-cols-2"
                    : "grid-cols-1 sm:grid-cols-2 lg:grid-cols-4"
                }`}
              >
                {tierSponsors.map((sponsor, index) => (
                  <div
                    key={index}
                    className="group relative p-8 rounded-3xl transition-all duration-500 hover:scale-[1.03]"
                    style={{
                      background: "rgba(255, 255, 255, 0.05)",
                      backdropFilter: "blur(30px) saturate(180%)",
                      WebkitBackdropFilter: "blur(30px) saturate(180%)",
                      border:
                        tier === "Platinum"
                          ? "1px solid rgba(255, 215, 0, 0.25)"
                          : "1px solid rgba(255, 255, 255, 0.12)",
                      boxShadow:
                        "0 20px 50px rgba(0, 0, 0, 0.25), inset 0 1px 2px rgba(255, 255, 255, 0.12)",
                    }}
                  >
                    <div className="relative z-10 text-center">
                      <h3 className="text-xl font-bold text-white mb-3">
                        {sponsor.name}
                      </h3>
                      <p
                        className="text-sm leading-relaxed"
                        style={{ color: "rgba(255, 255, 255, 0.55)" }}
                      >
                        {sponsor.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          );
        })}

        <div
          className="mt-12 p-10 rounded-3xl text-center"
          style={{
            background: "rgba(255, 255, 255, 0.04)",
            border: "1px solid rgba(255, 255, 255, 0.1)",
          }}
        >
          <h3 className="text-2xl font-bold text-white mb-4">
            Interested in sponsoring MUTIS?
          </h3>
          <p
            className="mb-6 text-base"
            style={{ color: "rgba(255, 255, 255, 0.6)" }}
          >
            Get in touch to learn about our sponsorship packages.
          </p>
          <a
            href="mailto:contact@mutis.co.uk"
            className="inline-flex px-10 py-4 rounded-2xl font-medium transition-all duration-300 hover:scale-105"
            style={{
              background: "rgba(255, 255, 255, 0.08)",
              backdropFilter: "blur(30px) saturate(180%)",
              color: "white",
              border: "1px solid rgba(255, 255, 255, 0.18)",
              boxShadow:
                "0 8px 32px rgba(0, 0, 0, 0.2), inset 0 1px 2px rgba(255, 255, 255, 0.15)",
            }}
          >
            Contact Us
          </a>
        </div>
      </div>
    </div>
  );
}
