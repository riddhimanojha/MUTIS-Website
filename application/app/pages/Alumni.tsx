import { Link } from "react-router";
import { useReveal } from "@/app/hooks/useReveal";

const ALUMNI_DESTINATIONS = [
  { name: "Goldman Sachs", sector: "Investment Banking" },
  { name: "JPMorgan", sector: "Markets & IB" },
  { name: "BlackRock", sector: "Asset Management" },
  { name: "Morgan Stanley", sector: "Investment Banking" },
  { name: "Barclays", sector: "Markets" },
  { name: "UBS", sector: "Investment Banking" },
  { name: "Deloitte", sector: "Advisory" },
  { name: "KPMG", sector: "Consulting" },
  { name: "PwC", sector: "Advisory" },
  { name: "Houlihan Lokey", sector: "Investment Banking" },
  { name: "Rothschild & Co", sector: "Advisory" },
  { name: "Bank of America", sector: "Markets & IB" },
];

export function Alumni() {
  useReveal();
  return (
    <>
      <section className="page-hero">
        <div className="page-hero-inner">
          <div>
            <div className="crumb">
              <Link to="/">MUTIS</Link>
              <span>/</span>
              <span>Alumni</span>
            </div>
            <div className="page-eyebrow r-up"><span className="bar" />Alumni Network</div>
            <h1 className="page-title r-up">
              Where MUTIS<br />members<br /><span className="accent">go next</span>
            </h1>
          </div>
          <p className="page-sub r-up">
            MUTIS alumni are working across investment banking, asset management, consulting,
            and markets at some of the most competitive firms in the world.
          </p>
        </div>
      </section>

      <section className="page-section">
        <div className="inner">
          <div className="page-eyebrow r-up"><span className="bar" />Alumni Destinations</div>
          <h2 className="r-up">Notable destinations</h2>
          <p className="lede r-up">
            The firms below represent graduate and internship destinations for MUTIS members
            over recent years. This list is indicative, not exhaustive.
          </p>

          <div
            className="r-up hair-grid"
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(min(100%, 220px), 1fr))",
            }}
          >
            {ALUMNI_DESTINATIONS.map((d) => (
              <div
                key={d.name}
                className="hair-cell"
                style={{ padding: "32px 24px" }}
              >
                <div
                  style={{
                    fontFamily: "var(--font-display)",
                    fontSize: "20px",
                    textTransform: "uppercase",
                    letterSpacing: "0.005em",
                    lineHeight: 1.1,
                    marginBottom: "10px",
                  }}
                >
                  {d.name}
                </div>
                <div
                  style={{
                    fontSize: "9.5px",
                    letterSpacing: "0.3em",
                    textTransform: "uppercase",
                    color: "var(--dim)",
                  }}
                >
                  {d.sector}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section
        className="page-section"
        style={{
          background: "var(--base)",
          borderTop: "1px solid rgba(255,255,255,0.06)",
        }}
      >
        <div className="inner">
          <div className="split">
            <div className="split-text">
              <div className="page-eyebrow"><span className="bar" />Stay Connected</div>
              <h2 className="r-up">The MUTIS network</h2>
            </div>
            <div className="split-text r-up">
              <p>
                The MUTIS alumni network connects graduates with current students through
                mentorship, insight sessions, and informal advice. If you&apos;re a MUTIS
                alum working in finance, we&apos;d welcome you back as a speaker, mentor,
                or event guest.
              </p>
              <p>
                We particularly value alumni who can offer honest, firsthand accounts of
                the recruitment process, the kind of input that makes a real difference
                for students starting out.
              </p>
              <p>
                To get in touch or re-connect with the society, reach out via our contact
                page or directly to the committee.
              </p>
              <div style={{ marginTop: "8px" }}>
                <Link
                  to="/contact"
                  className="btn btn-ghost"
                  style={{ textDecoration: "none" }}
                >
                  Get in touch →
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
