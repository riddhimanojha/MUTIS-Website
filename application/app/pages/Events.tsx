import { Link } from "react-router";
import { useReveal } from "@/app/hooks/useReveal";
import { industryEvents, flagshipSupporters } from "@/app/data/siteData";

const FLAGSHIP = [
  { num: "E.01", title: "Women in Finance Conference", term: "Autumn Term", desc: "A flagship day bringing senior women from across investment banking, asset management, and markets onto campus.", foot: "Manchester" },
  { num: "E.02", title: "UK Student Finance Summit", term: "Spring Term", desc: "The largest cross-university gathering of finance students in the UK, hosted by MUTIS in partnership with leading firms.", foot: "Manchester" },
  { num: "E.03", title: "M&A Challenge", term: "Year-round", desc: "A live deal simulation run across the year, judged by working bankers from sponsor firms.", foot: "Manchester" },
];

const eventImageModules = import.meta.glob(
  "../../assets/events/*.{jpg,jpeg,png,webp,avif,JPG,JPEG,PNG,WEBP,AVIF}",
  { eager: true, import: "default" },
) as Record<string, string>;

const PAST_EVENT_IMAGES = Object.entries(eventImageModules)
  .sort(([a], [b]) => a.localeCompare(b))
  .map(([, src]) => src);

export function Events() {
  useReveal([FLAGSHIP.length]);

  return (
    <>
      <section className="page-hero page-hero-events">
        <div className="page-hero-inner">
          <div>
            <div className="crumb"><Link to="/">MUTIS</Link><span>/</span><span>Events</span></div>
            <div className="page-eyebrow r-up"><span className="bar" />Events</div>
            <h1 className="page-title r-up">Where members<br />meet <span className="accent">markets</span></h1>
          </div>
          <p className="page-sub r-up">From flagship conferences to weekly partner sessions  -  MUTIS events put members in the same room as the people hiring them.</p>
        </div>
      </section>

      <section className="page-section">
        <div className="inner">
          <div className="page-eyebrow r-up"><span className="bar" />Section 01  -  Flagship</div>
          <h2 className="r-up">Three events define the year</h2>
          {flagshipSupporters.length > 0 && (
            <p className="lede r-up" style={{ marginBottom: 32 }}>
              Our flagship events are supported by{" "}
              {flagshipSupporters.map((s, i) => (
                <span key={s.name}>
                  {i > 0 && ", "}
                  <a href={s.url} target="_blank" rel="noreferrer" style={{ color: "var(--pm-accent)", textDecoration: "underline" }}>{s.name}</a>
                </span>
              ))}
              .
            </p>
          )}
          <div className="card-grid">
            {FLAGSHIP.map((e) => (
              <div className="dark-card r-up" key={e.num}>
                <div className="num">{e.num}</div>
                <h3>{e.title}</h3>
                <div className="meta">{e.term}</div>
                <p>{e.desc}</p>
                <div className="foot"><span>{e.foot}</span><span className="more">Register →</span></div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Attendance — the per-session QR code points at /attendance */}
      <section className="page-section" style={{ borderTop: "1px solid var(--hair)" }}>
        <div className="inner">
          <div className="split">
            <div className="split-text">
              <div className="page-eyebrow r-up"><span className="bar" />At a Session?</div>
              <h2 className="r-up">Log your attendance</h2>
            </div>
            <div className="split-text r-up">
              <p>
                At every MUTIS session we share a QR code that links to our attendance form.
                It takes under a minute — your name, university email, course, year, and a
                quick rating of the event.
              </p>
              <div style={{ marginTop: 8 }}>
                <Link to="/attendance" className="btn btn-primary" style={{ textDecoration: "none" }}>
                  Log My Attendance →
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="page-section" style={{ background: "var(--base)", borderTop: "1px solid rgba(255,255,255,0.05)", borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
        <div className="inner">
          <div className="page-eyebrow r-up"><span className="bar" />Section 02  -  Upcoming Term</div>
          <h2 className="r-up">Upcoming events</h2>
          <p className="lede r-up">No upcoming events are currently scheduled  -  check back soon, or follow us on Instagram for the latest.</p>
        </div>
      </section>

      <section className="page-section">
        <div className="inner">
          <div className="page-eyebrow r-up"><span className="bar" />Section 03  -  Past Events</div>
          <h2 className="r-up">Past events</h2>
          <p className="lede r-up">
            Want to see who&apos;s spoken at MUTIS?{" "}
            <Link to="/past-speakers" style={{ color: "var(--pm-accent)", textDecoration: "underline" }}>
              Browse our past speakers →
            </Link>
          </p>
          <div className="image-belt r-up" aria-label="Past event photos">
            <div className="image-track">
              {[...PAST_EVENT_IMAGES, ...PAST_EVENT_IMAGES].map((src, i) => {
                const isDuplicate = i >= PAST_EVENT_IMAGES.length;
                return (
                  <div className="image-cell" key={src + i} aria-hidden={isDuplicate || undefined}>
                    <img
                      src={src}
                      alt={isDuplicate ? "" : "MUTIS event photo"}
                      width={220}
                      height={130}
                      loading="lazy"
                      decoding="async"
                    />
                  </div>
                );
              })}
            </div>
          </div>
          <div className="card-grid">
            {industryEvents.map((e) => (
              <div className="dark-card r-up" key={e.title}>
                <h3>{e.title}</h3>
                <div className="meta"><span>{e.date}</span><span>·</span><span>{e.location}</span></div>
                <p>{e.description}</p>
                <div className="foot"><span>Open to Members</span><span className="more">Details →</span></div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
