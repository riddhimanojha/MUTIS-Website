import { Link } from "react-router";
import { ArrowRight } from "lucide-react";

export function Events() {
  const industry = [
    {
      title: "Fireside Chats: Rothschild & Co",
      date: "Termly",
      location: "University of Manchester",
      description:
        "Exclusive Q&A and career-focused discussions with professionals across advisory and banking.",
    },
    {
      title: "Recruitment & Insight Sessions: UBS",
      date: "Termly",
      location: "Alliance Manchester Business School",
      description:
        "Sessions linked to spring insight programmes, internships, and early-career pathways.",
    },
    {
      title: "Simulation Events: AmplifyME x Morgan Stanley",
      date: "Termly",
      location: "Hybrid",
      description:
        "Trading and market-making simulations designed to build practical market decision-making skills.",
    },
  ];

  const flagship = [
    { title: "Women in Finance Conference", date: "Annual" },
    { title: "UK Student Finance Summit (with Career26)", date: "Annual" },
    { title: "UK Investment Competition", date: "Annual" },
    { title: "Private Equity Challenge", date: "Annual" },
    { title: "Dare Trading Championship", date: "Annual" },
    { title: "Stock Pitch Competitions", date: "Throughout the Year" },
    { title: "Trading Simulations", date: "Throughout the Year" },
    { title: "Business Ball", date: "Annual" },
    { title: "Holiday Socials", date: "Termly" },
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
          Events & Conferences
        </h1>

        <p
          className="text-lg max-w-4xl mb-16"
          style={{
            color: "#c8d8f2",
            lineHeight: "1.72",
          }}
        >
          MUTIS delivers a high-impact calendar spanning technical workshops, industry speaker sessions, flagship conferences, competitions, and socials to support career development and community.
        </p>

        <h2 className="mb-8" style={{ fontSize: "clamp(1.8rem, 3.5vw, 2.6rem)", color: "white", fontFamily: "var(--font-nav)", fontWeight: 600 }}>
          Industry Events
        </h2>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-16">
          {industry.map((event, index) => (
            <div
              key={index}
              className="p-7 rounded-lg"
              style={{
                background: "#111827",
                border: "1px solid #374151",
              }}
            >
              <h3 className="text-xl font-bold text-white mb-2">{event.title}</h3>
              <div className="flex gap-3 text-sm mb-4" style={{ color: "#9ab8dc" }}>
                <span>{event.date}</span>
                <span>·</span>
                <span>{event.location}</span>
              </div>
              <p className="text-sm leading-relaxed" style={{ color: "#c8d8f2" }}>
                {event.description}
              </p>
            </div>
          ))}
        </div>

        <h2 className="mb-8" style={{ fontSize: "clamp(1.8rem, 3.5vw, 2.6rem)", color: "white", fontFamily: "var(--font-nav)", fontWeight: 600 }}>
          Flagship Calendar
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-16">
          {flagship.map((event, index) => (
            <div
              key={index}
              className="p-6 rounded-lg"
              style={{
                background: "#1a1f2e",
                border: "1px solid #2d3748",
              }}
            >
              <h4 className="text-base font-semibold text-white mb-2">{event.title}</h4>
              <span className="text-sm" style={{ color: "#9ab8dc" }}>
                {event.date}
              </span>
            </div>
          ))}
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
            Register Interest
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </div>
    </div>
  );
}
