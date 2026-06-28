import { useState } from "react";
import { Link } from "react-router";
import { Linkedin } from "lucide-react";
import { useReveal } from "@/app/hooks/useReveal";

type CommitteeRow = {
  id: string;
  name: string;
  role: string;
  initials: string | null;
  headshot_url: string | null;
  linkedin: string | null;
  display_order: number;
  created_at: string;
};

const FALLBACK_COMMITTEE: CommitteeRow[] = [
  { id: "fallback-bhawat", name: "Bhawat", role: "Executive Committee | Co-President", initials: "B", headshot_url: null, linkedin: null, display_order: 10, created_at: "" },
  { id: "fallback-alex", name: "Alex", role: "Executive Committee | Co-President", initials: "A", headshot_url: null, linkedin: null, display_order: 11, created_at: "" },
  { id: "fallback-kenneth", name: "Kenneth", role: "Executive Committee | Chair", initials: "K", headshot_url: null, linkedin: null, display_order: 12, created_at: "" },
  { id: "fallback-tanuska", name: "Tanuska", role: "Executive Committee | Chair", initials: "T", headshot_url: null, linkedin: null, display_order: 13, created_at: "" },
  { id: "fallback-anna-exec", name: "Anna", role: "Executive Committee | Chair", initials: "A", headshot_url: null, linkedin: null, display_order: 13.5, created_at: "" },
  { id: "fallback-anthony", name: "Anthony", role: "Executive Committee | Chair", initials: "A", headshot_url: null, linkedin: null, display_order: 14, created_at: "" },
  { id: "fallback-sandra", name: "Sandra", role: "Executive Committee | Fund Manager, VP", initials: "S", headshot_url: null, linkedin: null, display_order: 15, created_at: "" },
  { id: "fallback-victoria", name: "Victoria", role: "Executive Committee | VP", initials: "V", headshot_url: null, linkedin: null, display_order: 16, created_at: "" },
  { id: "fallback-ryusei", name: "Ryusei", role: "Executive Committee | Fund Manager", initials: "R", headshot_url: null, linkedin: null, display_order: 17, created_at: "" },
  { id: "fallback-riddhiman", name: "Riddhiman", role: "Tech Team | Co-Head", initials: "R", headshot_url: null, linkedin: null, display_order: 20, created_at: "" },
  { id: "fallback-daniel", name: "Daniel", role: "Tech Team | Co-Head", initials: "D", headshot_url: null, linkedin: null, display_order: 21, created_at: "" },
  { id: "fallback-sebastian", name: "Sebastian", role: "IBC | Co-Head", initials: "S", headshot_url: null, linkedin: null, display_order: 30, created_at: "" },
  { id: "fallback-anass", name: "Anass", role: "IBC | Co-Head", initials: "A", headshot_url: null, linkedin: null, display_order: 31, created_at: "" },
  { id: "fallback-tomilola", name: "Tomilola", role: "IBC | Co-Head", initials: "T", headshot_url: null, linkedin: null, display_order: 32, created_at: "" },
  { id: "fallback-rishik", name: "Rishik", role: "Sponsorships | Co-Head", initials: "R", headshot_url: null, linkedin: null, display_order: 40, created_at: "" },
  { id: "fallback-aditya", name: "Aditya", role: "Sponsorships | Co-Head", initials: "A", headshot_url: null, linkedin: null, display_order: 41, created_at: "" },
  { id: "fallback-malaika", name: "Malaika", role: "Sponsorships | Co-Head", initials: "M", headshot_url: null, linkedin: null, display_order: 42, created_at: "" },
  { id: "fallback-alleluia", name: "Alleluia", role: "b.dev | Co-Head", initials: "A", headshot_url: null, linkedin: null, display_order: 50, created_at: "" },
  { id: "fallback-phoebe", name: "Phoebe", role: "b.dev | Co-Head", initials: "P", headshot_url: null, linkedin: null, display_order: 51, created_at: "" },
  { id: "fallback-quinella", name: "Quinella", role: "b.dev | Co-Head", initials: "Q", headshot_url: null, linkedin: null, display_order: 52, created_at: "" },
  { id: "fallback-darryl", name: "Darryl", role: "b.dev | Co-Head", initials: "D", headshot_url: null, linkedin: null, display_order: 53, created_at: "" },
  { id: "fallback-kashvi", name: "Kashvi", role: "b.dev | Creative Director", initials: "K", headshot_url: null, linkedin: null, display_order: 54, created_at: "" },
  { id: "fallback-mica", name: "Mica", role: "Operations | Co-Head", initials: "M", headshot_url: null, linkedin: null, display_order: 60, created_at: "" },
  { id: "fallback-muskan", name: "Muskan", role: "Operations | Co-Head", initials: "M", headshot_url: null, linkedin: null, display_order: 61, created_at: "" },
  { id: "fallback-anna", name: "Anna", role: "WIF | Director", initials: "A", headshot_url: null, linkedin: null, display_order: 70, created_at: "" },
  { id: "fallback-maya", name: "Maya", role: "WIF | Co-Head", initials: "M", headshot_url: null, linkedin: null, display_order: 71, created_at: "" },
  { id: "fallback-elsie", name: "Elsie", role: "WIF | Co-Head", initials: "E", headshot_url: null, linkedin: null, display_order: 72, created_at: "" },
  { id: "fallback-niyati", name: "Niyati", role: "WIF | Co-Head", initials: "N", headshot_url: null, linkedin: null, display_order: 73, created_at: "" },
];

/**
 * Committee portrait. Renders the headshot when available; otherwise (or if the
 * image fails to load) shows a polished initials avatar. To add a real photo,
 * set `headshot_url` on the member — no markup changes needed.
 */
function MemberPortrait({
  name,
  initials,
  headshotUrl,
}: {
  name: string;
  initials: string | null;
  headshotUrl: string | null;
}) {
  const [failed, setFailed] = useState(false);
  const fallbackText = initials || name.charAt(0).toUpperCase() || "·";

  if (!headshotUrl || failed) {
    return (
      <div className="portrait portrait-fallback" aria-hidden="true">
        <span>{fallbackText}</span>
      </div>
    );
  }

  return (
    <img
      className="portrait"
      src={headshotUrl}
      alt={name}
      loading="lazy"
      decoding="async"
      style={{ objectFit: "cover" }}
      onError={() => setFailed(true)}
    />
  );
}

export function Team() {
  const list = FALLBACK_COMMITTEE;
  useReveal([list.length]);

  const sortedCommittee = [...list].sort((a, b) => a.display_order - b.display_order);
  const presidents = sortedCommittee.filter((m) => /co-president/i.test(m.role));
  const restOfCommittee = sortedCommittee.filter((m) => !/co-president/i.test(m.role));

  const renderMember = (m: CommitteeRow) => (
    <div className="member" key={m.id}>
      <MemberPortrait name={m.name} initials={m.initials} headshotUrl={m.headshot_url} />
      <div className="name">{m.name}</div>
      <div className="role">{m.role}</div>
      {m.linkedin && (
        <a href={m.linkedin} target="_blank" rel="noreferrer" style={{ marginTop: 8, display: "inline-flex", alignItems: "center", gap: 6, color: "var(--pm-accent)", fontSize: 12 }}>
          <Linkedin size={14} /> LinkedIn
        </a>
      )}
    </div>
  );

  return (
    <>
      <section className="page-hero">
        <div className="page-hero-inner">
          <div>
            <div className="crumb">
              <Link to="/">MUTIS</Link><span>/</span><span>Team</span>
            </div>
            <div className="page-eyebrow r-up"><span className="bar" />The Committee</div>
            <h1 className="page-title r-up">The people<br />behind<br /><span className="accent">MUTIS</span></h1>
          </div>
          <p className="page-sub r-up">
            MUTIS is run entirely by students. Our committee spans investment, technology, sponsorships, operations, and Women in Finance — led by our Co-Presidents and Executive Committee.
          </p>
        </div>
      </section>

      <section className="page-section">
        <div className="inner">
          <div className="page-eyebrow"><span className="bar" />Team</div>
          <h2 className="r-up">Meet the committee</h2>

          {presidents.length > 0 && (
            <div className="committee-grid committee-grid--feature" style={{ marginTop: 44 }}>
              {presidents.map(renderMember)}
            </div>
          )}

          {restOfCommittee.length > 0 && (
            <div className="committee-grid committee-grid--3col" style={{ borderTop: "none" }}>
              {restOfCommittee.map(renderMember)}
            </div>
          )}
        </div>
      </section>

      <section className="page-section" style={{ borderTop: "1px solid var(--hair)" }}>
        <div className="inner" style={{ display: "flex", gap: 16, flexWrap: "wrap" }}>
          <Link to="/about" className="btn btn-ghost" style={{ textDecoration: "none" }}>
            About MUTIS →
          </Link>
          <Link to="/previous-presidents" className="btn btn-ghost" style={{ textDecoration: "none" }}>
            Previous Presidents →
          </Link>
          <Link to="/alumni" className="btn btn-ghost" style={{ textDecoration: "none" }}>
            Alumni →
          </Link>
        </div>
      </section>
    </>
  );
}
