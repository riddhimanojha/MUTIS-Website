import { Link } from "react-router";
import { ArrowRight, TrendingUp, Users, Award, Briefcase } from "lucide-react";

export function Home() {
  return (
    <div className="relative min-h-screen overflow-hidden">
      <SilkWaveBackground />
      <div className="relative z-10">
        <HeroSection />
        <StatsSection />
        <SummarySection
          title="What MUTIS Offers"
          description="From trading competitions and networking events to educational workshops and career resources — we give you every tool to break into finance."
          linkTo="/about"
          linkLabel="Learn more about us"
        />
        <EventsSummary />
        <SummarySection
          title="Trusted By Industry Leaders"
          description="We partner with Goldman Sachs, JP Morgan, Barclays, Citi, Morgan Stanley, BlackRock, Bridgewater, and Citadel to bring you unrivalled opportunities."
          linkTo="/sponsors"
          linkLabel="View all sponsors"
        />
        <PeopleSummary />
        <MEIFSummary />
        <FinalCTA />
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

function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center justify-center px-8 pt-32 pb-20">
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div
          className="w-full max-w-[900px] h-[600px] rounded-[3rem]"
          style={{
            background: "radial-gradient(ellipse at center, rgba(43, 94, 168, 0.08) 0%, transparent 70%)",
            filter: "blur(40px)",
          }}
        />
      </div>

      <div className="relative z-10 max-w-[1000px] mx-auto text-center">
        <div className="mb-12">
          <h1
            className="mb-6 tracking-tight"
            style={{
              fontSize: "clamp(3.5rem, 9vw, 7.5rem)",
              lineHeight: "1.05",
              fontWeight: "800",
              color: "white",
              textShadow: "0 4px 40px rgba(0, 0, 0, 0.4)",
            }}
          >
            The UK's Leading<br />
            Student Investment Society
          </h1>
          <p
            className="text-xl md:text-2xl max-w-[700px] mx-auto"
            style={{
              color: "rgba(255, 255, 255, 0.85)",
              lineHeight: "1.6",
              textShadow: "0 2px 20px rgba(0, 0, 0, 0.3)",
            }}
          >
            Empowering Manchester students to master finance, trading, and investment through world-class opportunities
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-5 justify-center items-center">
          <Link
            to="/join"
            className="group relative px-12 py-5 rounded-2xl font-medium text-lg transition-all duration-500 overflow-hidden"
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
                animation: "pulse-glow 3s ease-in-out infinite",
              }}
            />
            <span className="relative z-10 flex items-center gap-3">
              Join MUTIS
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </span>
          </Link>

          <Link
            to="/about"
            className="px-12 py-5 rounded-2xl font-medium text-lg transition-all duration-300 hover:scale-105"
            style={{
              background: "rgba(255, 255, 255, 0.08)",
              backdropFilter: "blur(30px) saturate(180%)",
              WebkitBackdropFilter: "blur(30px) saturate(180%)",
              color: "white",
              border: "1px solid rgba(255, 255, 255, 0.18)",
              boxShadow: "0 8px 32px rgba(0, 0, 0, 0.2), inset 0 1px 2px rgba(255, 255, 255, 0.15)",
            }}
          >
            Explore
          </Link>
        </div>
      </div>

      <style>{`
        @keyframes pulse-glow {
          0%, 100% { opacity: 0.5; transform: scale(1); }
          50% { opacity: 0.7; transform: scale(1.05); }
        }
      `}</style>
    </section>
  );
}

function StatsSection() {
  const stats = [
    { number: "6000+", label: "Members" },
    { number: "100+", label: "Events Hosted" },
    { number: "Top UK", label: "Ranking" },
  ];

  return (
    <section className="relative py-12">
      <div className="max-w-[1200px] mx-auto px-8">
        <div
          className="rounded-3xl p-8"
          style={{
            background: "rgba(255, 255, 255, 0.06)",
            backdropFilter: "blur(40px) saturate(180%)",
            WebkitBackdropFilter: "blur(40px) saturate(180%)",
            border: "1px solid rgba(255, 255, 255, 0.12)",
            boxShadow: "0 20px 60px rgba(0, 0, 0, 0.3), inset 0 1px 3px rgba(255, 255, 255, 0.2), inset 0 -1px 2px rgba(0, 0, 0, 0.1)",
          }}
        >
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div
                  className="mb-2"
                  style={{
                    fontSize: "clamp(2.5rem, 4vw, 3.5rem)",
                    fontWeight: "700",
                    background: "linear-gradient(135deg, #ffffff 0%, rgba(255, 255, 255, 0.7) 100%)",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                    backgroundClip: "text",
                    lineHeight: "1",
                  }}
                >
                  {stat.number}
                </div>
                <div
                  className="text-sm uppercase tracking-widest"
                  style={{ color: "rgba(255, 255, 255, 0.6)" }}
                >
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function SummarySection({
  title,
  description,
  linkTo,
  linkLabel,
}: {
  title: string;
  description: string;
  linkTo: string;
  linkLabel: string;
}) {
  return (
    <section className="relative py-24">
      <div className="max-w-[900px] mx-auto px-8 text-center">
        <h2
          className="mb-6"
          style={{
            fontSize: "clamp(2.2rem, 5vw, 4rem)",
            fontWeight: "800",
            color: "white",
            lineHeight: "1.1",
            textShadow: "0 4px 30px rgba(0, 0, 0, 0.4)",
          }}
        >
          {title}
        </h2>
        <p
          className="text-lg mb-10 max-w-[650px] mx-auto"
          style={{ color: "rgba(255, 255, 255, 0.7)", lineHeight: "1.7" }}
        >
          {description}
        </p>
        <Link
          to={linkTo}
          className="inline-flex items-center gap-2 px-8 py-4 rounded-2xl font-medium transition-all duration-300 hover:scale-105"
          style={{
            background: "rgba(255, 255, 255, 0.08)",
            backdropFilter: "blur(30px) saturate(180%)",
            color: "white",
            border: "1px solid rgba(255, 255, 255, 0.18)",
            boxShadow: "0 8px 32px rgba(0, 0, 0, 0.2), inset 0 1px 2px rgba(255, 255, 255, 0.15)",
          }}
        >
          {linkLabel}
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </section>
  );
}

function EventsSummary() {
  const events = [
    { title: "Goldman Sachs Trading Floor Simulation", date: "May 15, 2026" },
    { title: "Private Equity Masterclass", date: "May 22, 2026" },
    { title: "Investment Banking Spring Insight", date: "June 3, 2026" },
  ];

  return (
    <section className="relative py-24">
      <div className="max-w-[1200px] mx-auto px-8">
        <h2
          className="mb-12 text-center"
          style={{
            fontSize: "clamp(2.2rem, 5vw, 4rem)",
            fontWeight: "800",
            color: "white",
            lineHeight: "1.1",
            textShadow: "0 4px 30px rgba(0, 0, 0, 0.4)",
          }}
        >
          Upcoming Events
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          {events.map((event, index) => (
            <div
              key={index}
              className="p-6 rounded-2xl"
              style={{
                background: "rgba(255, 255, 255, 0.04)",
                border: "1px solid rgba(255, 255, 255, 0.1)",
              }}
            >
              <h3 className="text-lg font-bold text-white mb-2">{event.title}</h3>
              <span className="text-sm" style={{ color: "rgba(255, 255, 255, 0.5)" }}>
                {event.date}
              </span>
            </div>
          ))}
        </div>

        <div className="text-center">
          <Link
            to="/events"
            className="inline-flex items-center gap-2 px-8 py-4 rounded-2xl font-medium transition-all duration-300 hover:scale-105"
            style={{
              background: "rgba(255, 255, 255, 0.08)",
              backdropFilter: "blur(30px) saturate(180%)",
              color: "white",
              border: "1px solid rgba(255, 255, 255, 0.18)",
              boxShadow: "0 8px 32px rgba(0, 0, 0, 0.2), inset 0 1px 2px rgba(255, 255, 255, 0.15)",
            }}
          >
            View all events
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}

function PeopleSummary() {
  const people = [
    { name: "Sarah Chen", role: "President" },
    { name: "James Morrison", role: "VP Events" },
    { name: "Priya Sharma", role: "Head of Education" },
    { name: "Marcus Laurent", role: "MEIF Director" },
  ];

  return (
    <section className="relative py-24">
      <div className="max-w-[1200px] mx-auto px-8">
        <h2
          className="mb-12 text-center"
          style={{
            fontSize: "clamp(2.2rem, 5vw, 4rem)",
            fontWeight: "800",
            color: "white",
            lineHeight: "1.1",
            textShadow: "0 4px 30px rgba(0, 0, 0, 0.4)",
          }}
        >
          Meet the Team
        </h2>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-10">
          {people.map((person, index) => (
            <div key={index} className="text-center">
              <div
                className="w-16 h-16 mx-auto mb-4 rounded-full"
                style={{
                  background: "linear-gradient(135deg, rgba(139, 69, 172, 0.4) 0%, rgba(43, 94, 168, 0.4) 100%)",
                  border: "2px solid rgba(255, 255, 255, 0.2)",
                }}
              />
              <h3 className="text-base font-bold text-white">{person.name}</h3>
              <p className="text-sm text-white/60">{person.role}</p>
            </div>
          ))}
        </div>

        <div className="text-center">
          <Link
            to="/alumni"
            className="inline-flex items-center gap-2 px-8 py-4 rounded-2xl font-medium transition-all duration-300 hover:scale-105"
            style={{
              background: "rgba(255, 255, 255, 0.08)",
              backdropFilter: "blur(30px) saturate(180%)",
              color: "white",
              border: "1px solid rgba(255, 255, 255, 0.18)",
              boxShadow: "0 8px 32px rgba(0, 0, 0, 0.2), inset 0 1px 2px rgba(255, 255, 255, 0.15)",
            }}
          >
            View committee & alumni
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}

function MEIFSummary() {
  return (
    <section className="relative py-24">
      <div className="max-w-[900px] mx-auto px-8 text-center">
        <h2
          className="mb-6"
          style={{
            fontSize: "clamp(2.2rem, 5vw, 4rem)",
            fontWeight: "800",
            color: "white",
            lineHeight: "1.1",
            textShadow: "0 4px 30px rgba(0, 0, 0, 0.4)",
          }}
        >
          MUTIS Equity Investment Fund
        </h2>
        <p
          className="text-lg mb-10 max-w-[600px] mx-auto"
          style={{ color: "rgba(255, 255, 255, 0.7)", lineHeight: "1.7" }}
        >
          Our flagship student-run investment fund managing real capital.
          Join a research team, pitch ideas, and build buyside experience.
        </p>
        <Link
          to="/meif"
          className="inline-flex items-center gap-2 px-8 py-4 rounded-2xl font-medium transition-all duration-300 hover:scale-105"
          style={{
            background: "rgba(255, 255, 255, 0.08)",
            backdropFilter: "blur(30px) saturate(180%)",
            color: "white",
            border: "1px solid rgba(255, 255, 255, 0.18)",
            boxShadow: "0 8px 32px rgba(0, 0, 0, 0.2), inset 0 1px 2px rgba(255, 255, 255, 0.15)",
          }}
        >
          Explore MEIF
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </section>
  );
}

function FinalCTA() {
  return (
    <section className="relative py-40">
      <div className="max-w-[900px] mx-auto px-8 text-center">
        <h2
          className="mb-12"
          style={{
            fontSize: "clamp(3rem, 7vw, 6rem)",
            fontWeight: "900",
            color: "white",
            lineHeight: "1.05",
            textShadow: "0 4px 40px rgba(0, 0, 0, 0.5)",
          }}
        >
          Your finance career starts here
        </h2>

        <Link
          to="/join"
          className="group relative inline-flex items-center gap-3 px-14 py-6 rounded-2xl font-medium text-xl transition-all duration-500 overflow-hidden"
          style={{
            background: "linear-gradient(135deg, rgba(15, 15, 25, 0.95) 0%, rgba(25, 25, 45, 0.9) 100%)",
            color: "white",
            border: "1px solid rgba(139, 69, 172, 0.5)",
            boxShadow: "0 30px 80px rgba(139, 69, 172, 0.4), inset 0 2px 4px rgba(255, 255, 255, 0.1)",
          }}
        >
          <div
            className="absolute inset-0 opacity-60 group-hover:opacity-80 transition-opacity duration-500"
            style={{
              background: "radial-gradient(circle at center, rgba(139, 69, 172, 0.5) 0%, transparent 70%)",
              animation: "pulse-glow 3s ease-in-out infinite",
            }}
          />
          <span className="relative z-10 flex items-center gap-3">
            Join MUTIS Now
            <ArrowRight className="w-6 h-6 group-hover:translate-x-2 transition-transform duration-300" />
          </span>
        </Link>
      </div>
    </section>
  );
}
