import { useState } from "react";
import { Link } from "react-router";
import { useReveal } from "@/app/hooks/useReveal";

// Company destinations — shown as logo bubbles. Replace text with <img> once logo assets are available.
const DESTINATION_GROUPS = [
  {
    category: "Investment Banking",
    firms: ["Goldman Sachs", "JPMorgan", "Morgan Stanley", "Houlihan Lokey", "Rothschild & Co", "UBS", "Bank of America"],
  },
  {
    category: "Markets & Asset Management",
    firms: ["BlackRock", "Barclays", "Invesco", "BNY"],
  },
  {
    category: "Advisory & Consulting",
    firms: ["Deloitte", "KPMG", "PwC"],
  },
];

type NetworkMember = {
  id: string;
  name: string;
  firm: string;
  role: string;
  cohort: string;
  location: string;
  linkedin: string | null;
  headshot: string | null;
};

// Populate once member data is confirmed. Do not publish names without consent.
const NETWORK_MEMBERS: NetworkMember[] = [
  // { id: "1", name: "Full Name", firm: "Goldman Sachs", role: "Summer Analyst", cohort: "2024", location: "London", linkedin: null, headshot: null },
];

function distinct(arr: string[]): string[] {
  return Array.from(new Set(arr)).sort();
}

export function OurNetwork() {
  useReveal([NETWORK_MEMBERS.length]);

  const [filterRole, setFilterRole]       = useState("");
  const [filterFirm, setFilterFirm]       = useState("");
  const [filterLocation, setFilterLocation] = useState("");

  const roles     = distinct(NETWORK_MEMBERS.map((m) => m.role));
  const firms     = distinct(NETWORK_MEMBERS.map((m) => m.firm));
  const locations = distinct(NETWORK_MEMBERS.map((m) => m.location));

  const filtered = NETWORK_MEMBERS.filter((m) => {
    if (filterRole     && m.role     !== filterRole)     return false;
    if (filterFirm     && m.firm     !== filterFirm)     return false;
    if (filterLocation && m.location !== filterLocation) return false;
    return true;
  });

  const hasFilters = filterRole || filterFirm || filterLocation;

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

      {/* Company destinations — logo bubble section */}
      <section className="page-section" style={{ borderBottom: "1px solid var(--hair)" }}>
        <div className="inner">
          <div className="page-eyebrow r-up"><span className="bar" />Destinations</div>
          <h2 className="r-up">Where MUTIS members go</h2>
          <p className="lede r-up">
            Graduate and internship destinations for MUTIS members across recent years.
            This list is indicative, not exhaustive.
          </p>

          {DESTINATION_GROUPS.map((group) => (
            <div key={group.category} className="r-up" style={{ marginTop: 32 }}>
              <div style={{ fontSize: 10, letterSpacing: "0.28em", textTransform: "uppercase", color: "var(--ink-soft)", marginBottom: 14 }}>
                {group.category}
              </div>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 10 }}>
                {group.firms.map((firm) => (
                  <span
                    key={firm}
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      justifyContent: "center",
                      padding: "10px 18px",
                      border: "1px solid var(--hair)",
                      borderRadius: 4,
                      fontFamily: "var(--font-display)",
                      fontSize: 13,
                      textTransform: "uppercase",
                      letterSpacing: "0.04em",
                      lineHeight: 1,
                      /* Swap for <img> once logo assets are available */
                    }}
                  >
                    {firm}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Member directory with filters */}
      <section className="page-section">
        <div className="inner">
          <div className="page-eyebrow r-up"><span className="bar" />Placements</div>
          <h2 className="r-up">Individual profiles</h2>

          {/* Filter bar */}
          <div className="r-up" style={{ display: "flex", gap: 12, flexWrap: "wrap", marginTop: 28, marginBottom: 36 }}>
            <div className="field" style={{ minWidth: 180, marginBottom: 0 }}>
              <label htmlFor="filter-role" style={{ fontSize: 10, letterSpacing: "0.2em", textTransform: "uppercase" }}>Role</label>
              <select
                id="filter-role"
                value={filterRole}
                onChange={(e) => setFilterRole(e.target.value)}
                disabled={roles.length === 0}
              >
                <option value="">All roles</option>
                {roles.map((r) => <option key={r} value={r}>{r}</option>)}
              </select>
            </div>
            <div className="field" style={{ minWidth: 180, marginBottom: 0 }}>
              <label htmlFor="filter-firm" style={{ fontSize: 10, letterSpacing: "0.2em", textTransform: "uppercase" }}>Company</label>
              <select
                id="filter-firm"
                value={filterFirm}
                onChange={(e) => setFilterFirm(e.target.value)}
                disabled={firms.length === 0}
              >
                <option value="">All companies</option>
                {firms.map((f) => <option key={f} value={f}>{f}</option>)}
              </select>
            </div>
            <div className="field" style={{ minWidth: 180, marginBottom: 0 }}>
              <label htmlFor="filter-location" style={{ fontSize: 10, letterSpacing: "0.2em", textTransform: "uppercase" }}>Location</label>
              <select
                id="filter-location"
                value={filterLocation}
                onChange={(e) => setFilterLocation(e.target.value)}
                disabled={locations.length === 0}
              >
                <option value="">All locations</option>
                {locations.map((l) => <option key={l} value={l}>{l}</option>)}
              </select>
            </div>
            {hasFilters && (
              <button
                className="btn btn-ghost"
                style={{ alignSelf: "flex-end", fontSize: 12 }}
                onClick={() => { setFilterRole(""); setFilterFirm(""); setFilterLocation(""); }}
              >
                Clear filters
              </button>
            )}
          </div>

          {NETWORK_MEMBERS.length === 0 ? (
            <p className="lede r-up">
              We&apos;re building out our network directory. If you&apos;re a former member
              who secured a placement and would like to be featured,{" "}
              <Link to="/contact" style={{ color: "var(--accent)" }}>get in touch</Link>.
            </p>
          ) : filtered.length === 0 ? (
            <p className="lede r-up" style={{ color: "var(--ink-soft)" }}>
              No members match the current filters.{" "}
              <button
                style={{ background: "none", border: "none", color: "var(--pm-accent)", cursor: "pointer", fontSize: "inherit", padding: 0 }}
                onClick={() => { setFilterRole(""); setFilterFirm(""); setFilterLocation(""); }}
              >
                Clear filters →
              </button>
            </p>
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
                  <div className="network-role">{m.role} · {m.cohort}</div>
                  {m.location && (
                    <div style={{ fontSize: 11, letterSpacing: "0.15em", textTransform: "uppercase", color: "var(--ink-soft)", marginTop: 4 }}>{m.location}</div>
                  )}
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
