import { Link } from "react-router";
import { useReveal } from "@/app/hooks/useReveal";

// PENDING: confirm each year's president name, headshot, and LinkedIn URL.
// Set `headshot` to an imported image and `linkedin` to a profile URL to fill a card.
type President = {
  year: string;
  name: string;
  notes: string;
  headshot: string | null;
  linkedin: string | null;
};

const PREVIOUS_PRESIDENTS: President[] = [
  { year: "2025–2026", name: "Alex & Bhawat", notes: "Co-Presidents", headshot: null, linkedin: null },
  { year: "2024–2025", name: "Name TBC", notes: "", headshot: null, linkedin: null },
  { year: "2023–2024", name: "Name TBC", notes: "", headshot: null, linkedin: null },
  { year: "2022–2023", name: "Name TBC", notes: "", headshot: null, linkedin: null },
  { year: "2021–2022", name: "Name TBC", notes: "", headshot: null, linkedin: null },
  { year: "2020–2021", name: "Name TBC", notes: "", headshot: null, linkedin: null },
  { year: "2019–2020", name: "Name TBC", notes: "", headshot: null, linkedin: null },
  { year: "2018–2019", name: "Name TBC", notes: "", headshot: null, linkedin: null },
  { year: "2017–2018", name: "Name TBC", notes: "", headshot: null, linkedin: null },
  { year: "2016–2017", name: "Name TBC", notes: "", headshot: null, linkedin: null },
  { year: "Est. 2008", name: "Founding Committee", notes: "Founding year", headshot: null, linkedin: null },
];

export function PreviousPresidents() {
  useReveal();
  return (
    <>
      <section className="page-hero">
        <div className="page-hero-inner">
          <div>
            <div className="crumb">
              <Link to="/">MUTIS</Link>
              <span>/</span>
              <Link to="/about">About</Link>
              <span>/</span>
              <span>Previous Presidents</span>
            </div>
            <div className="page-eyebrow r-up"><span className="bar" />History</div>
            <h1 className="page-title r-up">
              Previous<br /><span className="accent">Presidents</span>
            </h1>
          </div>
          <p className="page-sub r-up">
            MUTIS has been shaped by each year&apos;s leadership. This page records the presidents who led the society through each academic year since its founding in 2008.
          </p>
        </div>
      </section>

      <section className="page-section">
        <div className="inner">
          <div className="page-eyebrow r-up"><span className="bar" />Leadership Record</div>
          <h2 className="r-up">Society Presidents</h2>

          <div className="network-grid r-up">
            {PREVIOUS_PRESIDENTS.map((p) => (
              <article className="network-card" key={p.year}>
                <div className="network-portrait">
                  {p.headshot ? (
                    <img src={p.headshot} alt={p.name} loading="lazy" decoding="async" />
                  ) : (
                    <span aria-hidden="true">
                      {p.name && p.name !== "Name TBC" ? p.name.charAt(0) : "?"}
                    </span>
                  )}
                </div>
                <div
                  className="network-role"
                  style={{ color: "var(--pm-accent-2)", marginTop: 0, marginBottom: 8 }}
                >
                  {p.year}
                </div>
                <div className="network-name">{p.name}</div>
                {p.notes && <div className="network-firm">{p.notes}</div>}
                {p.linkedin && (
                  <a className="network-linkedin" href={p.linkedin} target="_blank" rel="noreferrer">
                    LinkedIn →
                  </a>
                )}
              </article>
            ))}
          </div>

          <p
            style={{
              marginTop: "48px",
              fontSize: "13px",
              lineHeight: 1.6,
              color: "var(--dim)",
            }}
          >
            Know a name we&apos;re missing?{" "}
            <Link to="/contact" style={{ color: "var(--pm-accent-2)", textDecoration: "underline" }}>
              Let us know
            </Link>
            .
          </p>
        </div>
      </section>
    </>
  );
}
