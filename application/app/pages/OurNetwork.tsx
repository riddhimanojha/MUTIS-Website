import { useMemo, useState } from "react";
import { Link } from "react-router";
import { useReveal } from "@/app/hooks/useReveal";

/**
 * Our Network — where MUTIS members go next.
 *
 * Combines the old Alumni page (destination "logo bubbles") with a directory
 * of previous-years' members who secured placements, filterable by role,
 * company, and location — layout inspired by bscapitalmarkets.com/alumni.html.
 *
 * PENDING: real member names, firms, roles, cohorts, locations, and
 * (optionally) LinkedIn + headshots. The structure below is drop-in ready —
 * add rows to NETWORK_MEMBERS once the data is confirmed. Do not publish
 * names without consent.
 */

const DESTINATIONS = [
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

type NetworkMember = {
  id: string;
  name: string;
  firm: string;
  role: string;
  location: string;
  cohort: string;
  linkedin: string | null;
  headshot: string | null;
};

const NETWORK_MEMBERS: NetworkMember[] = [
  // { id: "1", name: "Full Name", firm: "Firm", role: "Summer Analyst", location: "London", cohort: "2024", linkedin: "https://linkedin.com/in/...", headshot: null },
];

const ALL = "All";

function uniqueValues(key: "role" | "firm" | "location") {
  return [ALL, ...Array.from(new Set(NETWORK_MEMBERS.map((m) => m[key]))).sort()];
}

export function OurNetwork() {
  const [role, setRole] = useState(ALL);
  const [firm, setFirm] = useState(ALL);
  const [location, setLocation] = useState(ALL);

  const filtered = useMemo(
    () =>
      NETWORK_MEMBERS.filter(
        (m) =>
          (role === ALL || m.role === role) &&
          (firm === ALL || m.firm === firm) &&
          (location === ALL || m.location === location),
      ),
    [role, firm, location],
  );

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
              Where MUTIS<br />members<br /><span className="accent">go next</span>
            </h1>
          </div>
          <p className="page-sub r-up">
            MUTIS members and alumni are working across investment banking, asset management,
            consulting, and markets at some of the most competitive firms in the world.
          </p>
        </div>
      </section>

      {/* Destination bubbles (formerly the Alumni page) */}
      <section className="page-section">
        <div className="inner">
          <div className="page-eyebrow r-up"><span className="bar" />Destinations</div>
          <h2 className="r-up">The firms our network reached</h2>
          <p className="lede r-up">
            Graduate and internship destinations for MUTIS members over recent years.
            This list is indicative, not exhaustive.
          </p>
          <div className="bubble-cloud r-up" aria-label="Destination firms">
            {DESTINATIONS.map((d, i) => (
              <div className={`firm-bubble firm-bubble--${(i % 3) + 1}`} key={d.name}>
                <span className="firm-bubble-name">{d.name}</span>
                <span className="firm-bubble-sector">{d.sector}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Filterable member directory */}
      <section className="page-section" style={{ background: "var(--base)", borderTop: "1px solid rgba(255,255,255,0.06)" }}>
        <div className="inner">
          <div className="page-eyebrow r-up"><span className="bar" />Placements</div>
          <h2 className="r-up">Members who made the leap</h2>

          {NETWORK_MEMBERS.length === 0 ? (
            <p className="lede r-up">
              {/* PENDING: add confirmed members + placements to NETWORK_MEMBERS. */}
              We&apos;re building out our network directory — people from previous years who
              secured placements, searchable by role, company, and location. If you&apos;re a
              former member who&apos;d like to be featured,{" "}
              <Link to="/contact" style={{ color: "var(--pm-accent)" }}>get in touch</Link>.
            </p>
          ) : (
            <>
              <div className="network-filters r-up">
                <div className="field">
                  <label htmlFor="filter-role">Role</label>
                  <select id="filter-role" value={role} onChange={(e) => setRole(e.target.value)}>
                    {uniqueValues("role").map((v) => <option key={v}>{v}</option>)}
                  </select>
                </div>
                <div className="field">
                  <label htmlFor="filter-firm">Company</label>
                  <select id="filter-firm" value={firm} onChange={(e) => setFirm(e.target.value)}>
                    {uniqueValues("firm").map((v) => <option key={v}>{v}</option>)}
                  </select>
                </div>
                <div className="field">
                  <label htmlFor="filter-location">Location</label>
                  <select id="filter-location" value={location} onChange={(e) => setLocation(e.target.value)}>
                    {uniqueValues("location").map((v) => <option key={v}>{v}</option>)}
                  </select>
                </div>
              </div>

              {filtered.length === 0 ? (
                <p className="lede">No members match those filters yet — try broadening your search.</p>
              ) : (
                <div className="network-grid r-up">
                  {filtered.map((m) => (
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
                      <div className="network-role">{m.role} · {m.location} · {m.cohort}</div>
                      {m.linkedin && (
                        <a className="network-linkedin" href={m.linkedin} target="_blank" rel="noreferrer">
                          LinkedIn →
                        </a>
                      )}
                    </article>
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      </section>

      {/* Stay connected (carried over from the Alumni page) */}
      <section className="page-section" style={{ borderTop: "1px solid var(--hair)" }}>
        <div className="inner">
          <div className="split">
            <div className="split-text">
              <div className="page-eyebrow"><span className="bar" />Stay Connected</div>
              <h2 className="r-up">Part of the network?</h2>
            </div>
            <div className="split-text r-up">
              <p>
                The MUTIS network connects graduates with current students through mentorship,
                insight sessions, and informal advice. If you&apos;re a former member working in
                finance, we&apos;d welcome you back as a speaker, mentor, or event guest.
              </p>
              <p>
                We particularly value honest, firsthand accounts of the recruitment process —
                the kind of input that makes a real difference for students starting out.
              </p>
              <div style={{ marginTop: "8px" }}>
                <Link to="/contact" className="btn btn-ghost" style={{ textDecoration: "none" }}>
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
