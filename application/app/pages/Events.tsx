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

  const upcoming = [
    { title: "Women in Finance Conference", date: "2026-10-12", venue: "Alliance Manchester Business School", register: "#" },
    { title: "UK Student Finance Summit (with Career26)", date: "2026-11-21", venue: "University of Manchester", register: "#" },
    { title: "M&A Challenge", date: "2027-01-24", venue: "Hybrid", register: "#" },
    { title: "Dare Trading Championship", date: "2027-02-13", venue: "AMBS Trading Lab", register: "#" },
    { title: "Business Ball", date: "2027-03-20", venue: "Manchester City Centre", register: "#" },
  ];

  const previous = [
    { title: "Stock Pitch Competition", date: "2026-03-06" },
    { title: "Trading Simulation Bootcamp", date: "2026-02-14" },
    { title: "Holiday Social", date: "2025-12-11" },
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
          Upcoming Events
        </h2>

        <div className="mb-16 rounded-lg overflow-hidden" style={{ border: "1px solid #374151" }}>
          <ul>
            {upcoming.map((event, index) => (
              <li
                key={event.title}
                className="px-6 py-5 flex flex-col md:flex-row md:items-center md:justify-between gap-4"
                style={{
                  background: index % 2 === 0 ? "#111827" : "#1a1f2e",
                  borderBottom: index === upcoming.length - 1 ? "none" : "1px solid #2d3748",
                }}
              >
                <div>
                  <h4 className="text-lg font-semibold text-white mb-1">{event.title}</h4>
                  <p className="text-sm" style={{ color: "#9ab8dc" }}>
                    {event.date} · {event.venue}
                  </p>
                </div>
                <a
                  href={event.register}
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-md text-sm font-medium"
                  style={{ background: "#1a3370", color: "white", border: "1px solid #374151" }}
                >
                  Register
                  <ArrowRight className="w-4 h-4" />
                </a>
              </li>
            ))}
          </ul>
        </div>

        <h3 className="mb-5" style={{ fontSize: "1.2rem", color: "white", fontFamily: "var(--font-nav)", fontWeight: 600 }}>
          Previous Events
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-16">
          {previous.map((event) => (
            <div key={event.title} className="p-5 rounded-lg" style={{ background: "#111827", border: "1px solid #374151" }}>
              <h4 className="text-white font-medium mb-1">{event.title}</h4>
              <p className="text-sm" style={{ color: "#9ab8dc" }}>{event.date}</p>
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
