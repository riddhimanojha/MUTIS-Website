import { Link } from "react-router";
import { TrendingUp, Users, Award, Briefcase, ArrowRight } from "lucide-react";

export function About() {
  const pillars = [
    {
      icon: <TrendingUp className="w-10 h-10" />,
      title: "Core Activities & Training",
      description:
        "Weekly meetings cover trading, investing, and investment banking fundamentals, alongside practical technical sessions and member-led learning.",
    },
    {
      icon: <Briefcase className="w-10 h-10" />,
      title: "MUTIS Ethical Investment Fund",
      description:
        "MEIF is a student-led global equity fund where members work on portfolio management and sector research, including TMT, Energy, and Industrials.",
    },
    {
      icon: <Award className="w-10 h-10" />,
      title: "Career Development",
      description:
        "MUTIS runs CV and cover letter workshops, interview preparation, and recruitment-focused support for spring weeks, internships, and graduate roles.",
    },
    {
      icon: <Users className="w-10 h-10" />,
      title: "Community & Network",
      description:
        "With 5,000+ members across STEM, Business, Economics, and more, MUTIS provides a strong community through networking, socials, and alumni connections.",
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
          About MUTIS
        </h1>

        <p
          className="text-lg max-w-4xl mb-14"
          style={{
            color: "#c8d8f2",
            lineHeight: "1.72",
          }}
        >
          Manchester University Trading and Investment Society (MUTIS) is the largest business and finance society at the University of Manchester. We serve as a career-focused hub for students from all academic backgrounds who want to explore and enter financial services.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-[1200px] mb-14">
          {pillars.map((pillar, index) => (
            <div
              key={index}
              className="p-8 rounded-lg"
              style={{
                background: "#111827",
                border: "1px solid #374151",
              }}
            >
              <div className="mb-5 text-white">
                {pillar.icon}
              </div>
              <h3 className="text-2xl font-semibold text-white mb-3" style={{ fontFamily: "var(--font-nav)" }}>
                {pillar.title}
              </h3>
              <p className="text-base leading-relaxed" style={{ color: "#c8d8f2" }}>
                {pillar.description}
              </p>
            </div>
          ))}
        </div>

        <div
          className="rounded-lg p-8 mb-12"
          style={{
            background: "#1a1f2e",
            border: "1px solid #2d3748",
          }}
        >
          <h2 className="text-2xl text-white mb-4" style={{ fontFamily: "var(--font-nav)", fontWeight: 600 }}>
            Competitions, Conferences, and Industry Access
          </h2>
          <p className="text-base leading-relaxed" style={{ color: "#c8d8f2" }}>
            Members take part in trading simulations, stock pitch competitions, and signature challenges like the Private Equity Challenge and Dare Trading Championship. MUTIS hosts flagship conferences including Women in Finance and the UK Student Finance Summit, supported by a broad partner network including UBS, Rothschild & Co, Goldman Sachs, Wall Street Oasis, TradingView, Career26, Prima Ekuiti, and educational support such as the Shade Tree Fund.
          </p>
        </div>

        <div className="text-center">
          <Link
            to="/join"
            className="inline-flex items-center gap-3 px-12 py-5 rounded-md font-medium text-lg transition-all duration-300 hover:opacity-90"
            style={{
              background: "#0e2052",
              color: "white",
              border: "1px solid #2d5090",
            }}
          >
            Become a Member
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </div>
    </div>
  );
}
