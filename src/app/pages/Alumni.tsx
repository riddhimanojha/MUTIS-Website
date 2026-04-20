export function Alumni() {
  const committee = [
    {
      name: "Sarah Chen",
      role: "President",
      company: "Goldman Sachs",
      bio: "Final-year Economics student leading MUTIS's strategic direction and industry partnerships.",
    },
    {
      name: "James Morrison",
      role: "VP Events",
      company: "JP Morgan",
      bio: "Manages the full events calendar including speaker series, competitions, and socials.",
    },
    {
      name: "Priya Sharma",
      role: "Head of Education",
      company: "Barclays",
      bio: "Designs and delivers the educational programme covering technicals and soft skills.",
    },
    {
      name: "Marcus Laurent",
      role: "MEIF Director",
      company: "Citadel Securities",
      bio: "Oversees the student-run investment fund, managing team leads and portfolio strategy.",
    },
  ];

  const alumni = [
    { name: "Alex Turner", year: "2023", firm: "Goldman Sachs", role: "Analyst" },
    { name: "Emily Zhao", year: "2022", firm: "Citadel", role: "Quant Researcher" },
    { name: "David Okonkwo", year: "2024", firm: "Morgan Stanley", role: "Associate" },
    { name: "Sophie Williams", year: "2023", firm: "BlackRock", role: "Portfolio Analyst" },
    { name: "Raj Patel", year: "2022", firm: "JP Morgan", role: "VP, Sales & Trading" },
    { name: "Hannah Clarke", year: "2024", firm: "Barclays", role: "Analyst" },
  ];

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
          Alumni & Committee
        </h1>

        <p
          className="text-xl max-w-3xl mb-20"
          style={{
            color: "rgba(255, 255, 255, 0.8)",
            lineHeight: "1.7",
            textShadow: "0 2px 20px rgba(0, 0, 0, 0.3)",
          }}
        >
          Meet the team driving MUTIS forward and the alumni who went on to lead
          careers at the world's top financial institutions.
        </p>

        {/* Committee */}
        <h2
          className="mb-10"
          style={{
            fontSize: "clamp(1.8rem, 3vw, 2.8rem)",
            fontWeight: "800",
            color: "white",
            textShadow: "0 4px 30px rgba(0, 0, 0, 0.4)",
          }}
        >
          Committee
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-24">
          {committee.map((person, index) => (
            <div
              key={index}
              className="group relative p-8 rounded-3xl transition-all duration-500 hover:scale-[1.03]"
              style={{
                background: "rgba(255, 255, 255, 0.05)",
                backdropFilter: "blur(30px) saturate(180%)",
                WebkitBackdropFilter: "blur(30px) saturate(180%)",
                border: "1px solid rgba(255, 255, 255, 0.15)",
                boxShadow:
                  "0 20px 50px rgba(0, 0, 0, 0.3), inset 0 1px 2px rgba(255, 255, 255, 0.15)",
              }}
            >
              <div
                className="absolute inset-0 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
                style={{
                  background:
                    "radial-gradient(circle at top, rgba(139, 69, 172, 0.15) 0%, transparent 70%)",
                }}
              />
              <div className="relative z-10 text-center">
                <div
                  className="w-20 h-20 mx-auto mb-5 rounded-full"
                  style={{
                    background:
                      "linear-gradient(135deg, rgba(139, 69, 172, 0.4) 0%, rgba(43, 94, 168, 0.4) 100%)",
                    border: "2px solid rgba(255, 255, 255, 0.2)",
                  }}
                />
                <h3 className="text-xl font-bold text-white mb-2">
                  {person.name}
                </h3>
                <p className="text-sm text-white/70 mb-1">{person.role}</p>
                <p
                  className="text-xs mb-4"
                  style={{ color: "rgba(255, 255, 255, 0.5)" }}
                >
                  {person.company}
                </p>
                <p
                  className="text-sm leading-relaxed"
                  style={{ color: "rgba(255, 255, 255, 0.55)" }}
                >
                  {person.bio}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Alumni */}
        <h2
          className="mb-10"
          style={{
            fontSize: "clamp(1.8rem, 3vw, 2.8rem)",
            fontWeight: "800",
            color: "white",
            textShadow: "0 4px 30px rgba(0, 0, 0, 0.4)",
          }}
        >
          Notable Alumni
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {alumni.map((person, index) => (
            <div
              key={index}
              className="p-6 rounded-2xl transition-all duration-300 hover:scale-[1.02]"
              style={{
                background: "rgba(255, 255, 255, 0.03)",
                border: "1px solid rgba(255, 255, 255, 0.08)",
              }}
            >
              <h4 className="text-base font-semibold text-white mb-1">
                {person.name}
              </h4>
              <p className="text-sm text-white/60">
                {person.role}, {person.firm}
              </p>
              <p
                className="text-xs mt-1"
                style={{ color: "rgba(255, 255, 255, 0.4)" }}
              >
                Class of {person.year}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
