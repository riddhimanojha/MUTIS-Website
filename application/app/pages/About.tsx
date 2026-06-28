import { Link } from "react-router";
import { useReveal } from "@/app/hooks/useReveal";

const WIF_LOGO = new URL("../../assets/wif-logo.svg", import.meta.url).href;

export function About() {
  useReveal([]);

  return (
    <>
      <section className="page-hero">
        <div className="page-hero-inner">
          <div>
            <div className="crumb">
              <Link to="/">MUTIS</Link><span>/</span><span>About</span>
            </div>
            <div className="page-eyebrow r-up"><span className="bar" />About the Society</div>
            <h1 className="page-title r-up">Built for<br />the next<br /><span className="accent">generation</span></h1>
          </div>
          <p className="page-sub r-up">
            MUTIS exists to give Manchester students a real edge in the most competitive corner of finance recruitment. We are run by students, funded by partners, and accountable to our members.
          </p>
        </div>
      </section>

      <section className="page-section">
        <div className="inner">
          <div className="split">
            <div className="split-text"><h2 className="r-up">What MUTIS Does</h2></div>
            <div className="split-text r-up">
              <p><strong>MUTIS is one of the largest business and finance societies at the University of Manchester</strong>, with 4,000+ members from every faculty. We bridge the gap between academic theory and the live market.</p>
              <p>Weekly meetings cover the building blocks  -  DCFs, LBOs, portfolio theory, macro frameworks. Workshops with sponsor banks go deeper into modelling, market structure, and the interview process itself.</p>
              <p>The MUTIS Ethical Investment Fund (MEIF) gives members hands-on responsibility for capital  -  the kind of experience that actually shows up in interviews.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="page-section" style={{ background: "var(--surface-alt)", borderTop: "1px solid var(--hair)" }}>
        <div className="inner">
          <div className="split">
            <div className="split-text">
              <div className="page-eyebrow"><span className="bar" />Our History</div>
              <h2 className="r-up">21 years of MUTIS</h2>
            </div>
            <div className="split-text r-up">
              {/* PENDING: 21-year history write-up from Bhawat & Alex.
                  NOTE: confirm the founding year — other pages currently say
                  "Est. 2008", but a 21-year history implies a founding date
                  around 2005. Reconcile before publishing. */}
              <p>
                <strong>MUTIS has been part of life at the University of Manchester for
                over 21 years</strong>, growing from a small group of students into one of
                the largest finance societies in the UK.
              </p>
              <p>
                {/* PENDING: replace with the confirmed history narrative. */}
                A fuller account of the society&apos;s history — its founding, milestones,
                and the people who built it — is coming soon.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="page-section" style={{ borderTop: "1px solid var(--hair)" }}>
        <div className="inner">
          <div className="split">
            <div className="split-text">
              <div className="page-eyebrow"><span className="bar" />Women in Finance</div>
              <div className="wif-logo-slot">
                <img src={WIF_LOGO} alt="Women in Finance — MUTIS" />
              </div>
              <h2 className="r-up">Women in Finance</h2>
            </div>
            <div className="split-text r-up">
              <p>Women in Finance (WiF) is MUTIS&apos;s dedicated sub-committee supporting women and gender minorities pursuing careers in finance. WiF runs its own events, mentorship programmes, and networking sessions alongside MUTIS&apos;s main calendar.</p>
              <p>WiF partners with sponsor firms to deliver targeted insight days, panels, and early-career access for members who are underrepresented in the industry.</p>
              <p>All MUTIS members are welcome at WiF events. The committee is led by Anna (Director) and Maya, Elsie, and Niyati (Co-Heads).</p>
            </div>
          </div>
        </div>
      </section>

      <section className="page-section" style={{ background: "var(--surface-alt)", borderTop: "1px solid var(--hair)" }}>
        <div className="inner" style={{ display: "flex", gap: 16, flexWrap: "wrap" }}>
          <Link to="/team" className="btn btn-primary" style={{ textDecoration: "none" }}>
            Meet the Team →
          </Link>
          <Link to="/previous-presidents" className="btn btn-ghost" style={{ textDecoration: "none" }}>
            View Previous Presidents →
          </Link>
          <Link to="/network" className="btn btn-ghost" style={{ textDecoration: "none" }}>
            Our Network →
          </Link>
          <Link to="/alumni" className="btn btn-ghost" style={{ textDecoration: "none" }}>
            Alumni →
          </Link>
        </div>
      </section>
    </>
  );
}
