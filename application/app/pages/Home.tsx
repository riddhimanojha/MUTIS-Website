import { Link, useNavigate } from "react-router";
import { ArrowRight, Instagram, Linkedin, MessageCircle, Mail } from "lucide-react";
import { motion } from "motion/react";

export function Home() {
  return (
    <div className="relative min-h-screen">
      <HeroSection />
      <StatsSection />
      <SummarySection
        title="Core Activities & Training"
        description="Weekly meetings, technical workshops, live competitions, and the MUTIS Ethical Investment Fund (MEIF) give members practical exposure to trading, investing, and investment banking."
        linkTo="/about"
        linkLabel="Explore all activities"
        withImage
      />
      <EventsSummary />
      <SummarySection
        title="Career & Professional Development"
        description="From CV and cover letter sessions to recruitment preparation for spring weeks, internships, and graduate roles, MUTIS helps students break into top financial institutions."
        linkTo="/join"
        linkLabel="Join the community"
        withImage
      />
      <CommunitySummary />
      <MEIFSummary />
      <FinalCTA />
    </div>
  );
}

function HeroSection() {
  const navigate = useNavigate();

  return (
    <section className="relative min-h-screen flex items-center justify-center px-8 pt-24 pb-12 overflow-hidden">
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: "url('/application/assets/backgrounds/Alliance-Manchester_2.jpeg')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
        }}
      />
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "linear-gradient(180deg, rgba(7, 17, 44, 0.72) 0%, rgba(11, 31, 73, 0.78) 100%), radial-gradient(circle at 80% 25%, rgba(112, 95, 222, 0.22) 0%, rgba(112, 95, 222, 0) 45%)",
        }}
      />

      <motion.div
        className="relative z-10 max-w-[980px] mx-auto text-center"
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
      >
        <motion.div
          className="mb-10"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.12, ease: [0.22, 1, 0.36, 1] }}
        >
          <motion.h1
            className="mb-6 tracking-tight"
            style={{
              fontSize: "clamp(2.2rem, 5.2vw, 4rem)",
              lineHeight: "1.08",
              fontWeight: "700",
              color: "white",
              fontFamily: "var(--font-nav)",
            }}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
          >
            <span className="block">University of Manchester</span>
            <span className="block">Trading and Investment Society</span>
          </motion.h1>
          <motion.p
            className="text-base md:text-xl max-w-[760px] mx-auto"
            style={{
              color: "#c8d8f2",
              lineHeight: "1.65",
            }}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, delay: 0.28, ease: [0.22, 1, 0.36, 1] }}
          >
            MUTIS is the largest business and finance society at the University of Manchester, with 5,000+ members from all academic backgrounds.
          </motion.p>
        </motion.div>

        <motion.div
          className="flex flex-col sm:flex-row gap-4 justify-center items-center"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, delay: 0.35, ease: [0.22, 1, 0.36, 1] }}
        >
          <motion.div whileHover={{ y: -2 }} transition={{ duration: 0.18 }}>
            <button
              type="button"
              onClick={() => navigate("/join")}
              className="group px-10 py-4 rounded-md font-semibold text-base transition-all duration-300 cursor-pointer"
              style={{
                background: "#12306d",
                color: "white",
                border: "1px solid #2d5090",
              }}
            >
              <span className="flex items-center gap-3">
                Join MUTIS
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </span>
            </button>
          </motion.div>

          <motion.div whileHover={{ y: -2 }} transition={{ duration: 0.18 }}>
            <button
              type="button"
              onClick={() => navigate("/events")}
              className="px-10 py-4 rounded-md font-medium text-base transition-all duration-300 hover:translate-y-[-1px] cursor-pointer"
              style={{
                background: "#1a3370",
                color: "white",
                border: "1px solid #374151",
              }}
            >
              See Events
            </button>
          </motion.div>
        </motion.div>

        <motion.div
          className="flex items-center justify-center gap-3 mt-7"
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, delay: 0.45, ease: [0.22, 1, 0.36, 1] }}
        >
          {[
            { icon: Instagram, href: "https://instagram.com/mutisfinancesoc", label: "Instagram" },
            { icon: Linkedin, href: "https://www.linkedin.com/company/mutis-finance-society", label: "LinkedIn" },
            { icon: MessageCircle, href: "#", label: "Discord" },
            { icon: Mail, href: "mailto:mutis@manchesterstudentsunion.com", label: "Email" },
          ].map((social) => (
            <a
              key={social.label}
              href={social.href}
              aria-label={social.label}
              className="w-10 h-10 rounded-md flex items-center justify-center"
              style={{ background: "#1a3370", border: "1px solid #374151", color: "#c8d8f2" }}
            >
              <social.icon className="w-4 h-4" />
            </a>
          ))}
        </motion.div>
      </motion.div>
    </section>
  );
}

function StatsSection() {
  const stats = [
    { number: "5000+", label: "Members" },
    { number: "19", label: "Industry Partners" },
    { number: "10+", label: "Flagship Events" },
  ];

  return (
    <section className="relative py-14">
      <div className="max-w-[1200px] mx-auto px-8">
        <div
          className="rounded-lg p-8 md:p-10"
          style={{
            background: "#111827",
            border: "1px solid #374151",
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
                    color: "white",
                    lineHeight: "1",
                  }}
                >
                  {stat.number}
                </div>
                <div className="text-sm uppercase tracking-wider" style={{ color: "#9ab8dc" }}>
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
  withImage,
}: {
  title: string;
  description: string;
  linkTo: string;
  linkLabel: string;
  withImage?: boolean;
}) {
  return (
    <section className="relative py-20 overflow-hidden">
      {withImage && (
        <>
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              backgroundImage: "url('/application/assets/backgrounds/Alliance-Manchester_2.jpeg')",
              backgroundSize: "cover",
              backgroundPosition: "center",
              opacity: 0.14,
            }}
          />
          <div
            className="absolute inset-0 pointer-events-none"
            style={{ background: "linear-gradient(180deg, rgba(9, 20, 49, 0.95) 0%, rgba(8, 18, 44, 0.98) 100%)" }}
          />
        </>
      )}
      <div className="max-w-[820px] mx-auto px-8 text-center">
        <h2
          className="mb-6"
          style={{
            fontSize: "clamp(2rem, 4.4vw, 3.2rem)",
            fontWeight: "600",
            color: "white",
            lineHeight: "1.14",
            fontFamily: "var(--font-nav)",
          }}
        >
          {title}
        </h2>
        <p
          className="text-base md:text-lg mb-9 max-w-[620px] mx-auto"
          style={{ color: "#c8d8f2", lineHeight: "1.72" }}
        >
          {description}
        </p>
        <Link
          to={linkTo}
          className="inline-flex items-center gap-2 px-8 py-4 rounded-md font-medium transition-all duration-300 hover:opacity-90"
          style={{
            background: "#1a3370",
            color: "white",
            border: "1px solid #374151",
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
    { title: "Women in Finance Conference", date: "Autumn Term" },
    { title: "UK Student Finance Summit", date: "Spring Term" },
    { title: "M&A Challenge", date: "Throughout the Year" },
  ];

  return (
    <section className="relative py-20">
      <div className="max-w-[1200px] mx-auto px-8">
        <h2
          className="mb-12 text-center"
          style={{
            fontSize: "clamp(2rem, 4.4vw, 3.2rem)",
            fontWeight: "600",
            color: "white",
            lineHeight: "1.14",
            fontFamily: "var(--font-nav)",
          }}
        >
          Flagship Events
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          {events.map((event, index) => (
            <div
              key={index}
              className="p-6 rounded-lg"
              style={{
                background: "#111827",
                border: "1px solid #374151",
              }}
            >
              <h3 className="text-lg font-bold text-white mb-2">{event.title}</h3>
              <span className="text-sm" style={{ color: "#9ab8dc" }}>
                {event.date}
              </span>
            </div>
          ))}
        </div>

        <div className="text-center">
          <Link
            to="/events"
            className="inline-flex items-center gap-2 px-8 py-4 rounded-md font-medium transition-all duration-300 hover:opacity-90"
            style={{
              background: "#1a3370",
              color: "white",
              border: "1px solid #374151",
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

function CommunitySummary() {
  const highlights = [
    {
      title: "Networking",
      text: "Meet like-minded students and industry professionals through an active alumni network.",
    },
    {
      title: "Socials",
      text: "Community socials include the annual Business Ball and termly holiday events.",
    },
    {
      title: "Open Membership",
      text: "Membership is open to all students and can be started anytime through MUTIS channels.",
    },
    {
      title: "Recruitment Support",
      text: "Get CV and cover letter support for spring weeks, internships, and graduate roles.",
    },
  ];

  return (
    <section className="relative py-20">
      <div className="max-w-[1200px] mx-auto px-8">
        <h2
          className="mb-12 text-center"
          style={{
            fontSize: "clamp(2rem, 4.4vw, 3.2rem)",
            fontWeight: "600",
            color: "white",
            lineHeight: "1.14",
            fontFamily: "var(--font-nav)",
          }}
        >
          Community & Membership
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
          {highlights.map((item, index) => (
            <div
              key={index}
              className="p-6 rounded-lg"
              style={{
                background: "#111827",
                border: "1px solid #374151",
              }}
            >
              <h3 className="text-lg font-bold text-white mb-2">{item.title}</h3>
              <p className="text-sm" style={{ color: "#b8cce8" }}>
                {item.text}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function MEIFSummary() {
  return (
    <section className="relative py-20">
      <div className="max-w-[820px] mx-auto px-8 text-center">
        <h2
          className="mb-6"
          style={{
            fontSize: "clamp(2rem, 4.4vw, 3.2rem)",
            fontWeight: "600",
            color: "white",
            lineHeight: "1.14",
            fontFamily: "var(--font-nav)",
          }}
        >
          MUTIS Ethical Investment Fund
        </h2>
        <p
          className="text-lg mb-10 max-w-[620px] mx-auto"
          style={{ color: "#c8d8f2", lineHeight: "1.7" }}
        >
          MEIF is a student-led global equity fund where members gain hands-on portfolio experience through sector coverage including Consumer Goods, Financials, and Macro Research.
        </p>
        <Link
          to="/meif"
          className="inline-flex items-center gap-2 px-8 py-4 rounded-md font-medium transition-all duration-300 hover:opacity-90"
          style={{
            background: "#1a3370",
            color: "white",
            border: "1px solid #374151",
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
    <section className="relative py-28">
      <div className="max-w-[860px] mx-auto px-8 text-center">
        <h2
          className="mb-10"
          style={{
            fontSize: "clamp(2.4rem, 6vw, 4.4rem)",
            fontWeight: "600",
            color: "white",
            lineHeight: "1.12",
            fontFamily: "var(--font-nav)",
          }}
        >
          Build your finance career with MUTIS
        </h2>

        <Link
          to="/join"
          className="group inline-flex items-center gap-3 px-14 py-6 rounded-md font-semibold text-xl transition-all duration-300 hover:opacity-90"
          style={{
            background: "#0e2052",
            color: "white",
            border: "1px solid #2d5090",
          }}
        >
          <span className="flex items-center gap-3">
            Become a Member
            <ArrowRight className="w-6 h-6 group-hover:translate-x-2 transition-transform duration-300" />
          </span>
        </Link>
      </div>
    </section>
  );
}
