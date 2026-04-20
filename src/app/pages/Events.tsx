import { Link } from "react-router";
import { ArrowRight } from "lucide-react";

export function Events() {
  const upcoming = [
    {
      title: "Goldman Sachs Trading Floor Simulation",
      date: "May 15, 2026",
      location: "Alliance MBS",
      description:
        "Experience a live trading floor environment with real-time market data. Compete in teams managing a simulated portfolio under volatile conditions, judged by Goldman Sachs employees.",
    },
    {
      title: "Private Equity Masterclass",
      date: "May 22, 2026",
      location: "Kilburn Building",
      description:
        "A deep-dive workshop into LBO modeling, deal structuring, and due diligence led by senior PE professionals. Suitable for intermediate-level members.",
    },
    {
      title: "Investment Banking Spring Insight",
      date: "June 3, 2026",
      location: "The Spinningfields",
      description:
        "A full-day insight programme offering exposure to M&A advisory, equity capital markets, and debt financing with presentations from analysts and associates.",
    },
    {
      title: "Alumni Networking Gala",
      date: "June 12, 2026",
      location: "The Lowry Hotel",
      description:
        "Our annual flagship networking event bringing together current members and alumni working across the City and Canary Wharf. Smart dress code.",
    },
  ];

  const past = [
    { title: "Bloomberg Terminal Training", date: "March 2026" },
    { title: "Quantitative Finance Panel", date: "February 2026" },
    { title: "CV & Cover Letter Workshop", date: "January 2026" },
    { title: "Start-of-Year Social", date: "October 2025" },
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
          Events
        </h1>

        <p
          className="text-xl max-w-3xl mb-20"
          style={{
            color: "rgba(255, 255, 255, 0.8)",
            lineHeight: "1.7",
            textShadow: "0 2px 20px rgba(0, 0, 0, 0.3)",
          }}
        >
          From trading competitions to networking galas, MUTIS runs 100+ events
          each academic year to develop your skills and grow your network.
        </p>

        {/* Upcoming */}
        <h2
          className="mb-10"
          style={{
            fontSize: "clamp(1.8rem, 3vw, 2.8rem)",
            fontWeight: "800",
            color: "white",
            textShadow: "0 4px 30px rgba(0, 0, 0, 0.4)",
          }}
        >
          Upcoming
        </h2>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-24">
          {upcoming.map((event, index) => (
            <div
              key={index}
              className="group relative p-8 rounded-3xl transition-all duration-500 hover:scale-[1.02]"
              style={{
                background: "rgba(255, 255, 255, 0.04)",
                backdropFilter: "blur(30px) saturate(180%)",
                WebkitBackdropFilter: "blur(30px) saturate(180%)",
                border: "1px solid rgba(255, 255, 255, 0.12)",
                boxShadow:
                  "0 20px 50px rgba(0, 0, 0, 0.25), inset 0 1px 2px rgba(255, 255, 255, 0.12)",
              }}
            >
              <div className="relative z-10">
                <h3 className="text-xl font-bold text-white mb-3">
                  {event.title}
                </h3>
                <div
                  className="flex gap-4 text-sm mb-4"
                  style={{ color: "rgba(255, 255, 255, 0.5)" }}
                >
                  <span>{event.date}</span>
                  <span>·</span>
                  <span>{event.location}</span>
                </div>
                <p
                  className="text-sm leading-relaxed"
                  style={{ color: "rgba(255, 255, 255, 0.65)" }}
                >
                  {event.description}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Past */}
        <h2
          className="mb-10"
          style={{
            fontSize: "clamp(1.8rem, 3vw, 2.8rem)",
            fontWeight: "800",
            color: "white",
            textShadow: "0 4px 30px rgba(0, 0, 0, 0.4)",
          }}
        >
          Past Events
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-20">
          {past.map((event, index) => (
            <div
              key={index}
              className="p-6 rounded-2xl"
              style={{
                background: "rgba(255, 255, 255, 0.03)",
                border: "1px solid rgba(255, 255, 255, 0.08)",
              }}
            >
              <h4 className="text-base font-semibold text-white mb-2">
                {event.title}
              </h4>
              <span
                className="text-sm"
                style={{ color: "rgba(255, 255, 255, 0.45)" }}
              >
                {event.date}
              </span>
            </div>
          ))}
        </div>

        <div className="text-center">
          <Link
            to="/join"
            className="group relative inline-flex items-center gap-3 px-12 py-5 rounded-2xl font-medium text-lg transition-all duration-500 overflow-hidden"
            style={{
              background:
                "linear-gradient(135deg, rgba(15, 15, 25, 0.95) 0%, rgba(25, 25, 45, 0.9) 100%)",
              color: "white",
              border: "1px solid rgba(139, 69, 172, 0.4)",
              boxShadow:
                "0 20px 60px rgba(139, 69, 172, 0.3), inset 0 1px 2px rgba(255, 255, 255, 0.1)",
            }}
          >
            <span className="relative z-10 flex items-center gap-3">
              Register for Events
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </span>
          </Link>
        </div>
      </div>
    </div>
  );
}
