import { Link } from "react-router";
import { useReveal } from "@/app/hooks/useReveal";

/**
 * Our Network — previous-years' members who secured placements.
 * Layout inspired by the BSFS "network" page: a card per member with their
 * destination firm, role, and graduating cohort.
 *
 * PENDING: real member names, firms, roles, cohorts, and (optionally) LinkedIn
 * + headshots. The structure below is drop-in ready — replace the placeholder
 * rows once the data is confirmed. Do not publish names without consent.
 */
type NetworkMember = {
  id: string;
  name: string;
  firm: string;
  role: string;
  cohort: string;
  linkedin: string | null;
  headshot: string | null;
};

const NETWORK_MEMBERS: NetworkMember[] = [
  // { id: "1", name: "Full Name", firm: "Firm", role: "Summer Analyst", cohort: "2024", linkedin: "https://linkedin.com/in/...", headshot: null },
];

export function OurNetwork() {
  useReveal([NETWORK_MEMBERS.length]);

  return (
    <>
      <section className="page-hero">
        <div className="page-hero-inner">
          <div>
            <div className="crumb">
              <Link to="/">MUTIS</Link><span>/</span><span>Our Network</span>
            </div>
            <div className="page-eyebrow r-up"><span className="bar" />Our Network</div>
            <h1 className="page-title r-up">
              Members who<br />made the <span className="accent">leap</span>
            </h1>
          </div>
          <p className="page-sub r-up">
            Past MUTIS members now working across investment banking, markets, asset
            management, and consulting — and the placements that got them there.
          </p>
        </div>
      </section>

      <section className="page-section">
        <div className="inner">
          <div className="page-eyebrow r-up"><span className="bar" />Placements</div>
          <h2 className="r-up">Where our members landed</h2>

          {NETWORK_MEMBERS.length === 0 ? (
            <p className="lede r-up">
              {/* PENDING: add confirmed members + placements to NETWORK_MEMBERS. */}
              We&apos;re building out our network directory. If you&apos;re a former member
              who secured a placement and would like to be featured,{" "}
              <Link to="/contact" style={{ color: "var(--accent)" }}>get in touch</Link>.
            </p>
          ) : (
            <div className="network-grid r-up">
              {NETWORK_MEMBERS.map((m) => (
                <article className="network-card" key={m.id}>
                  <div className="network-portrait">
                    {m.headshot ? (
                      <img src={m.headshot} alt={m.name} loading="lazy" decoding="async" />
                    ) : (
                      <span aria-hidden="true">{m.name.charAt(0)}</span>
                    )}
                  </div>
                  <div className="network-name">{m.name}</div>
                  <div className="network-firm">{m.firm}</div>
                  <div className="network-role">{m.role} · {m.cohort}</div>
                  {m.linkedin && (
                    <a className="network-linkedin" href={m.linkedin} target="_blank" rel="noreferrer">
                      LinkedIn →
                    </a>
                  )}
                </article>
              ))}
            </div>
          )}
        </div>
      </section>
    </>
  );
}
