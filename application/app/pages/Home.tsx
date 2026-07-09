import {
  useRef,
  type CSSProperties,
  type ReactNode,
} from "react";
import { Link } from "react-router";
import { useTilt } from "../hooks/useTilt";
import { sponsors } from "../data/siteData";

// ---- Utilities ----

const clamp = (v: number, a = 0, b = 1) => Math.max(a, Math.min(b, v));

// Scroll-triggered reveal is disabled on the home page by request: content is
// shown immediately with no scroll animation. The ref is kept for compatibility.
function useInView<T extends HTMLElement = HTMLElement>(
  _opts: { threshold?: number; once?: boolean } = {}
) {
  const ref = useRef<T | null>(null);
  return [ref, true] as const;
}

// ---- Tilt wrapper ----

type TiltProps = {
  as?: "div" | "a" | "button";
  to?: string;
  href?: string;
  intensity?: number;
  className?: string;
  style?: CSSProperties;
  children?: ReactNode;
  onClick?: () => void;
};

function Tilt({ as = "div", to, href, intensity = 8, className = "", style, children, ...rest }: TiltProps) {
  const tilt = useTilt(intensity);
  const combined = "tilt " + className;
  if (to) {
    return (
      <Link to={to} ref={tilt.ref as React.Ref<HTMLAnchorElement>}
        onMouseMove={tilt.onMouseMove} onMouseLeave={tilt.onMouseLeave}
        className={combined} style={style} {...rest}>{children}</Link>
    );
  }
  if (as === "a") {
    return (
      <a href={href} ref={tilt.ref as React.Ref<HTMLAnchorElement>}
        onMouseMove={tilt.onMouseMove} onMouseLeave={tilt.onMouseLeave}
        className={combined} style={style} {...rest}>{children}</a>
    );
  }
  if (as === "button") {
    return (
      <button ref={tilt.ref as React.Ref<HTMLButtonElement>}
        onMouseMove={tilt.onMouseMove} onMouseLeave={tilt.onMouseLeave}
        className={combined} style={style} {...rest}>{children}</button>
    );
  }
  return (
    <div ref={tilt.ref as React.Ref<HTMLDivElement>}
      onMouseMove={tilt.onMouseMove} onMouseLeave={tilt.onMouseLeave}
      className={combined} style={style} {...rest}>{children}</div>
  );
}

// ---- Hero ----

function Hero() {
  // Scroll/intro animation removed by request — hero renders fully static.
  const intro = 1;
  const fgOpacity = 1;

  return (
    <section className="pm-hero">
      {/* Background image (static, no parallax) */}
      <div className="pm-hero-bg" style={{ transform: "scale(1.1)" }} />
      <div className="pm-hero-overlay" />
      <div className="pm-hero-grain" aria-hidden="true" />

      {/* Main content */}
      <div className="pm-hero-content" style={{ opacity: fgOpacity }}>
        <div
          className="pm-hero-eyebrow"
          style={{ opacity: clamp(intro * 1.6 - 0.2), transform: `translateY(${(1 - clamp(intro * 1.6 - 0.2)) * 14}px)` }}
        >
          University of Manchester &nbsp;·&nbsp; Est. 2008
        </div>

        <div className="pm-hero-masthead">
          {["MUTIS"].map((word, i) => (
            <span className="pm-hero-title-line" key={i}>
              <span style={{
                display: "inline-block",
                transform: `translateY(${intro < 0.01 ? "105%" : "0%"})`,
                transition: `transform 1.1s cubic-bezier(.22,1,.36,1) ${i * 0.08}s`,
              }}>
                {word}
              </span>
            </span>
          ))}
          <div
            className="pm-hero-rule"
            style={{ transform: `scaleX(${intro})`, transformOrigin: "left", opacity: clamp(intro * 2 - 0.8) }}
          />
          <div
            className="pm-hero-subtitle"
            style={{
              opacity: clamp(intro * 1.5 - 0.5),
              transform: `translateY(${(1 - clamp(intro * 1.5 - 0.5)) * 12}px)`,
            }}
          >
            Finance Society
          </div>
        </div>

        <p
          className="pm-hero-body"
          style={{
            opacity: clamp(intro * 1.4 - 0.6),
            transform: `translateY(${(1 - clamp(intro * 1.4 - 0.6)) * 14}px)`,
          }}
        >
          We train Manchester students to compete for finance roles at the world&apos;s top banks, through real research, live capital, and direct access to industry. 4,000+ members across every faculty.
        </p>

        <div
          className="pm-hero-actions"
          style={{
            opacity: clamp(intro * 1.6 - 0.8),
            transform: `translateY(${(1 - clamp(intro * 1.6 - 0.8)) * 12}px)`,
          }}
        >
          <Tilt to="/join" className="pm-btn pm-btn--primary" intensity={8} style={{ textDecoration: "none" }}>
            Join MUTIS
            <span className="pm-btn-arrow" />
          </Tilt>
          <Tilt to="/events" className="pm-btn pm-btn--ghost" intensity={8} style={{ textDecoration: "none" }}>
            Flagship Events
            <span className="pm-btn-arrow" />
          </Tilt>
        </div>
      </div>

      {/* Right-side stat panel */}
      <div
        className="pm-hero-stats"
        style={{ opacity: clamp(intro * 2 - 1) * fgOpacity }}
      >
        {[
          { val: "4,000+", label: "Members" },
          { val: "17", label: "Industry Partners" },
          { val: "10+", label: "Flagship Events" },
        ].map((s, i) => (
          <div className="pm-hero-stat" key={i}>
            <div className="pm-hero-stat-val">{s.val}</div>
            <div className="pm-hero-stat-label">{s.label}</div>
          </div>
        ))}
      </div>

    </section>
  );
}

// ---- Stats strip ----

const STRIP_STATS = [
  { val: "4,000+", label: "Members" },
  { val: "17", label: "Industry Partners" },
  { val: "10+", label: "Flagship Events" },
  { val: "6", label: "Sector Teams" },
];

function StatsStrip() {
  const [ref, inView] = useInView<HTMLElement>({ threshold: 0.4 });
  return (
    <section className="pm-stats-strip" ref={ref}>
      <div className="pm-stats-inner">
        {STRIP_STATS.map((s, i) => (
          <div
            className="pm-stat"
            key={s.label}
            style={{
              opacity: inView ? 1 : 0,
              transform: `translateY(${inView ? "0px" : "16px"})`,
              transition: `opacity 0.7s ease ${i * 0.1}s, transform 0.7s ease ${i * 0.1}s`,
            }}
          >
            <div className="pm-stat-val">{s.val}</div>
            <div className="pm-stat-label">{s.label}</div>
          </div>
        ))}
      </div>
    </section>
  );
}

// ---- What We Do ----

const PROGRAMS = [
  {
    num: "01",
    title: "Technical Education",
    desc: "Weekly sessions on DCF, LBO modelling, portfolio construction, and market microstructure, taught by members and industry practitioners.",
  },
  {
    num: "02",
    title: "Trading Competitions",
    desc: "Live simulations and M&A challenges run in partnership with AmplifyME × Morgan Stanley. Market judgment tested under real pressure.",
  },
  {
    num: "03",
    title: "Industry Access",
    desc: "Termly fireside chats, insight days, and recruitment sessions with Rothschild & Co, UBS, Houlihan Lokey, and other partner firms.",
  },
  {
    num: "04",
    title: "MEIF: Student Fund",
    desc: "MUTIS's student-managed global equity fund. Coverage teams pitch and vote on positions, building the judgment buy-side desks hire for.",
  },
];

function WhatWeDo() {
  const [ref, inView] = useInView<HTMLElement>({ threshold: 0.15 });
  const t = inView ? 1 : 0;

  return (
    <section className="pm-about" ref={ref}>
      <div className="pm-about-inner">
        <div className="pm-about-left">
          <div
            className="pm-eyebrow"
            style={{ opacity: t, transform: `translateY(${(1 - t) * 14}px)`, transition: "opacity 0.7s ease, transform 0.7s ease" }}
          >
            What We Do
          </div>
          <h2 className="pm-about-heading">
            {["Practical", "Finance", "Real Stakes"].map((line, i) => (
              <span className="pm-reveal-line" key={i}>
                <span style={{
                  display: "inline-block",
                  color: i === 2 ? "var(--pm-accent)" : "#021967",
                  transform: `translateY(${t ? "0%" : "108%"})`,
                  transition: `transform 1s cubic-bezier(.22,1,.36,1) ${i * 0.12}s`,
                }}>
                  {line}
                </span>
              </span>
            ))}
          </h2>
          <p
            className="pm-about-lede"
            style={{ opacity: t, transform: `translateY(${t ? "0px" : "20px"})`, transition: "opacity 0.9s ease 0.3s, transform 0.9s ease 0.3s" }}
          >
            MUTIS is built around one question: what does it actually take to succeed
            in finance? The answer is practice, access, and real responsibility. Not
            theory alone.
          </p>
        </div>

        <div className="pm-programs">
          {PROGRAMS.map((p, i) => (
            <div
              className="pm-program"
              key={p.num}
              style={{
                opacity: t,
                transform: `translateY(${t ? "0px" : "24px"})`,
                transition: `opacity 0.8s ease ${0.3 + i * 0.1}s, transform 0.8s cubic-bezier(.22,1,.36,1) ${0.3 + i * 0.1}s`,
              }}
            >
              <div className="pm-program-num">{p.num}</div>
              <div className="pm-program-body">
                <div className="pm-program-title">{p.title}</div>
                <div className="pm-program-desc">{p.desc}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ---- Events ----

const EVENTS = [
  {
    id: "E.01",
    term: "Autumn Term",
    title: "Women in Finance Conference",
    desc: "A flagship day bringing senior women from across investment banking, asset management, and markets onto campus.",
    location: "Manchester · Hybrid",
  },
  {
    id: "E.02",
    term: "Spring Term",
    title: "UK Student Finance Summit",
    desc: "The largest cross-university gathering of finance students in the UK, hosted by MUTIS in partnership with leading firms.",
    location: "Alliance MBS",
  },
  {
    id: "E.03",
    term: "Year-round",
    title: "M&A Challenge",
    desc: "A live deal simulation run across the year, judged by working bankers from our partner firms.",
    location: "Manchester",
  },
];

function EventsSection() {
  const [ref, inView] = useInView<HTMLElement>({ threshold: 0.1 });
  const t = inView ? 1 : 0;

  return (
    <section className="pm-events" ref={ref}>
      <div className="pm-events-inner">
        <div className="pm-events-head">
          <h2>
            {["Flagship", "Events"].map((w, i) => (
              <span className="pm-reveal-line" key={i}>
                <span style={{
                  display: "inline-block",
                  transform: `translateY(${t ? "0%" : "108%"})`,
                  transition: `transform 1s cubic-bezier(.22,1,.36,1) ${i * 0.12}s`,
                }}>
                  {w}
                </span>
              </span>
            ))}
          </h2>
          <p style={{ opacity: t, transition: "opacity 0.9s ease 0.35s" }}>
            Three events define the MUTIS year, drawing students from
            across the UK and senior speakers from the firms our members are targeting.
          </p>
        </div>

        <div className="pm-events-grid">
          {EVENTS.map((ev, i) => (
            <EventCard key={ev.id} ev={ev} index={i} inView={t} />
          ))}
        </div>

        <div
          className="pm-events-foot"
          style={{ opacity: t, transform: `translateY(${t ? "0px" : "16px"})`, transition: "opacity 0.9s ease 0.7s, transform 0.9s ease 0.7s" }}
        >
          <Tilt to="/events" className="pm-btn pm-btn--ghost" intensity={7} style={{ textDecoration: "none" }}>
            All Events
            <span className="pm-btn-arrow" />
          </Tilt>
        </div>
      </div>
    </section>
  );
}

function EventCard({ ev, index, inView }: { ev: typeof EVENTS[0]; index: number; inView: number }) {
  const tilt = useTilt(8);
  const delay = 0.3 + index * 0.18;
  return (
    <div
      style={{
        opacity: inView,
        transform: `translateY(${inView ? "0px" : "60px"})`,
        transition: `opacity 1.2s ease ${delay}s, transform 1.2s cubic-bezier(.22,1,.36,1) ${delay}s`,
      }}
    >
      <div
        className="pm-event-card tilt"
        ref={tilt.ref as React.Ref<HTMLDivElement>}
        onMouseMove={tilt.onMouseMove}
        onMouseLeave={tilt.onMouseLeave}
      >
        <div className="pm-event-top">
          <span className="pm-event-term">{ev.term}</span>
          <span className="pm-event-id">{ev.id}</span>
        </div>
        <div className="pm-event-body">
          <h3 className="pm-event-title">{ev.title}</h3>
          <p className="pm-event-desc">{ev.desc}</p>
        </div>
        <div className="pm-event-foot">
          <span className="pm-event-location">{ev.location}</span>
          <Link to="/events" className="pm-event-more" style={{ textDecoration: "none" }}>
            Details →
          </Link>
        </div>
      </div>
    </div>
  );
}

// ---- Sponsors Strip ----

const ALL_LOGOS = sponsors.flatMap((tier) => tier.firms);

function SponsorsStrip() {
  return (
    <div className="pm-sponsors">
      <div className="pm-sponsors-label">Our Partners &amp; Sponsors</div>
      <div className="pm-sponsors-track-wrap" aria-label="Partner and sponsor logos">
        <div className="pm-sponsors-track">
          {[...ALL_LOGOS, ...ALL_LOGOS].map((firm, i) => {
            const isDupe = i >= ALL_LOGOS.length;
            return (
              <a
                key={firm.name + i}
                href={firm.vacanciesUrl}
                target="_blank"
                rel="noreferrer"
                className="pm-sponsor-logo-wrap"
                aria-label={isDupe ? undefined : `${firm.name} careers`}
                aria-hidden={isDupe || undefined}
                tabIndex={isDupe ? -1 : undefined}
              >
                <img
                  src={firm.logo}
                  alt={isDupe ? "" : firm.name}
                  className="pm-sponsor-logo"
                  loading="lazy"
                  decoding="async"
                />
              </a>
            );
          })}
        </div>
      </div>
    </div>
  );
}

// ---- MEIF ----

const SECTORS = [
  { id: "01", name: "Macro", desc: "Top-down research on rates, inflation, FX, and global growth." },
  { id: "02", name: "Consumer", desc: "Brand durability, pricing power, and demand cycle analysis." },
  { id: "03", name: "Financials", desc: "Banks, insurers, and diversified financials across cycles." },
  { id: "04", name: "Industrials", desc: "Cyclicals, infrastructure, and capex-sensitive businesses." },
  { id: "05", name: "Energy", desc: "Traditional and transition energy across commodity cycles." },
  { id: "06", name: "TMT", desc: "Technology, media, and telecom with durable growth drivers." },
];

function MEIFSection() {
  const [ref, inView] = useInView<HTMLElement>({ threshold: 0.2 });
  const t = inView ? 1 : 0;

  return (
    <section className="pm-meif" ref={ref}>
      <div className="pm-meif-inner">
        <div className="pm-meif-left">
          <div
            className="pm-eyebrow"
            style={{ opacity: t, transform: `translateY(${(1 - t) * 14}px)`, transition: "opacity 0.7s ease, transform 0.7s ease" }}
          >
            MEIF: Ethical Investment Fund
          </div>
          <h2 className="pm-meif-heading">
            <span className="pm-reveal-line">
              <span style={{ display: "inline-block", transform: `translateY(${t ? "0%" : "108%"})`, transition: "transform 1s cubic-bezier(.22,1,.36,1) 0.1s" }}>
                A real fund
              </span>
            </span>
            <span className="pm-reveal-line pm-meif-em">
              <span style={{ display: "inline-block", transform: `translateY(${t ? "0%" : "108%"})`, transition: "transform 1s cubic-bezier(.22,1,.36,1) 0.22s" }}>
                Student run
              </span>
            </span>
          </h2>
          <p
            className="pm-meif-body"
            style={{ opacity: t, transform: `translateY(${t ? "0px" : "20px"})`, transition: "opacity 0.9s ease 0.4s, transform 0.9s ease 0.4s" }}
          >
            MEIF is MUTIS&apos;s student-managed global equity fund. Coverage teams pitch,
            debate, and vote on positions, building the judgment that buy-side
            desks actually hire for.
          </p>
          <Tilt
            to="/meif"
            className="pm-btn pm-btn--ghost"
            intensity={8}
            style={{
              textDecoration: "none",
              opacity: t,
              transform: `translateY(${t ? "0px" : "16px"})`,
              transition: "opacity 0.9s ease 0.6s, transform 0.9s ease 0.6s",
            }}
          >
            Explore MEIF
            <span className="pm-btn-arrow" />
          </Tilt>
        </div>

        <div className="pm-meif-sectors">
          {SECTORS.map((s, i) => (
            <div
              key={s.id}
              className="pm-sector tilt"
              ref={useTilt(5).ref as React.Ref<HTMLDivElement>}
              style={{
                opacity: t,
                transform: `translateX(${t ? "0px" : "50px"})`,
                transition: `opacity 0.8s ease ${0.5 + i * 0.1}s, transform 0.8s cubic-bezier(.22,1,.36,1) ${0.5 + i * 0.1}s`,
              }}
            >
              <div className="pm-sector-id">{s.id}</div>
              <div className="pm-sector-body">
                <div className="pm-sector-name">{s.name}</div>
                <div className="pm-sector-desc">{s.desc}</div>
              </div>
              <div className="pm-sector-arrow">→</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ---- Final CTA ----

function FinalCTA() {
  const [ref, inView] = useInView<HTMLElement>({ threshold: 0.25 });
  const t = inView ? 1 : 0;

  return (
    <section className="pm-cta" ref={ref}>
      <div
        className="pm-cta-eyebrow"
        style={{ opacity: t, transform: `translateY(${(1 - t) * 16}px)`, transition: "opacity 0.7s ease, transform 0.7s ease" }}
      >
        Your move
      </div>
      <h2 className="pm-cta-heading">
        {[["Build your", ""], ["finance", "accent"], ["career", "stroke"], ["with MUTIS", ""]].map(([word, cls], i) => (
          <span className="pm-reveal-line" key={i}>
            <span
              className={cls === "accent" ? "pm-cta-accent" : cls === "stroke" ? "pm-cta-stroke" : ""}
              style={{
                display: "inline-block",
                transform: `translateY(${t ? "0%" : "108%"})`,
                transition: `transform 1.1s cubic-bezier(.22,1,.36,1) ${i * 0.14}s`,
              }}
            >
              {word}
            </span>
          </span>
        ))}
      </h2>
      <Tilt
        to="/join"
        className="pm-cta-btn tilt"
        intensity={10}
        style={{
          textDecoration: "none",
          opacity: t,
          transform: `translateY(${t ? "0px" : "24px"}) scale(${t ? 1 : 0.96})`,
          transition: "opacity 0.9s ease 0.65s, transform 0.9s cubic-bezier(.22,1,.36,1) 0.65s",
        }}
      >
        Become a Member
        <span className="pm-btn-arrow" />
      </Tilt>
    </section>
  );
}

// ---- Home ----

export function Home() {
  return (
    <>
      <Hero />
      <StatsStrip />
      <WhatWeDo />
      <EventsSection />
      <SponsorsStrip />
      <MEIFSection />
      <FinalCTA />
    </>
  );
}
