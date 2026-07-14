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

// Display order follows the agreed layout — four per row:
//   Bhawat · Alex · Sandra · Victoria
//   Anna · Tanuska · Anthony · Kenneth
//   Rishik · Aditya · Malaika · Sebastian
//   Anass · Tomilola · Kashvi · Darryl
//   Phoebe · Alleluia · Quinella · Riddhiman
//   Daniel · Muskan · Mica · Elsie
//   Niyati · Maya
const FALLBACK_COMMITTEE: CommitteeRow[] = [
  { id: "fallback-bhawat", name: "Bhawat", role: "Co-President", initials: "B", headshot_url: "/headshots/Bhawat.jpeg", linkedin: "https://www.linkedin.com/in/bhawat-bansal", display_order: 10, created_at: "" },
  { id: "fallback-alex", name: "Alex", role: "Co-President", initials: "A", headshot_url: null, linkedin: null, display_order: 20, created_at: "" },
  { id: "fallback-sandra", name: "Sandra", role: "Fund Manager, VP", initials: "S", headshot_url: "/headshots/Sandra.jpeg", linkedin: "https://www.linkedin.com/in/sandrabinil30", display_order: 30, created_at: "" },
  { id: "fallback-victoria", name: "Victoria", role: "VP", initials: "V", headshot_url: null, linkedin: null, display_order: 40, created_at: "" },
  { id: "fallback-anna", name: "Anna", role: "Executive Committee | Chair", initials: "A", headshot_url: null, linkedin: null, display_order: 50, created_at: "" },
  { id: "fallback-tanuska", name: "Tanuska", role: "Executive Committee | Chair", initials: "T", headshot_url: null, linkedin: null, display_order: 60, created_at: "" },
  { id: "fallback-anthony", name: "Anthony", role: "Executive Committee | Chair", initials: "A", headshot_url: null, linkedin: null, display_order: 70, created_at: "" },
  { id: "fallback-kenneth", name: "Kenneth", role: "Executive Committee | Chair", initials: "K", headshot_url: null, linkedin: null, display_order: 80, created_at: "" },
  { id: "fallback-rishik", name: "Rishik", role: "Sponsorships | Co-Head", initials: "R", headshot_url: "/headshots/Rishik.jpeg", linkedin: "https://www.linkedin.com/in/rishik-k", display_order: 90, created_at: "" },
  { id: "fallback-aditya", name: "Aditya", role: "Sponsorships | Co-Head", initials: "A", headshot_url: "/headshots/Aditya.jpeg", linkedin: "https://www.linkedin.com/in/aditya-jain-uom", display_order: 100, created_at: "" },
  { id: "fallback-malaika", name: "Malaika", role: "Sponsorships | Co-Head", initials: "M", headshot_url: null, linkedin: null, display_order: 110, created_at: "" },
  { id: "fallback-sebastian", name: "Sebastian", role: "IBC | Co-Head", initials: "S", headshot_url: null, linkedin: null, display_order: 120, created_at: "" },
  { id: "fallback-anass", name: "Anass", role: "IBC | Co-Head", initials: "A", headshot_url: "/headshots/Anass.jpeg", linkedin: null, display_order: 130, created_at: "" },
  { id: "fallback-tomilola", name: "Tomilola", role: "IBC | Co-Head", initials: "T", headshot_url: "/headshots/Tomilola.jpeg", linkedin: null, display_order: 140, created_at: "" },
  { id: "fallback-kashvi", name: "Kashvi", role: "b.dev | Creative Director", initials: "K", headshot_url: "/headshots/Kashvi.jpeg", linkedin: "https://www.linkedin.com/in/kashvi-chhabra104", display_order: 150, created_at: "" },
  { id: "fallback-darryl", name: "Darryl", role: "b.dev | Co-Head", initials: "D", headshot_url: null, linkedin: null, display_order: 160, created_at: "" },
  { id: "fallback-phoebe", name: "Phoebe", role: "b.dev | Co-Head", initials: "P", headshot_url: "/headshots/Claresta.jpeg", linkedin: "https://www.linkedin.com/in/claresta-phoebe-arifin", display_order: 170, created_at: "" },
  { id: "fallback-alleluia", name: "Alleluia", role: "b.dev | Co-Head", initials: "A", headshot_url: null, linkedin: null, display_order: 180, created_at: "" },
  { id: "fallback-quinella", name: "Quinella", role: "b.dev | Co-Head", initials: "Q", headshot_url: null, linkedin: null, display_order: 190, created_at: "" },
  { id: "fallback-riddhiman", name: "Riddhiman", role: "Tech Team | Co-Head", initials: "R", headshot_url: null, linkedin: null, display_order: 200, created_at: "" },
  { id: "fallback-daniel", name: "Daniel", role: "Tech Team | Co-Head", initials: "D", headshot_url: null, linkedin: null, display_order: 210, created_at: "" },
  { id: "fallback-muskan", name: "Muskan", role: "Operations | Co-Head", initials: "M", headshot_url: "/headshots/Muskan.jpeg", linkedin: null, display_order: 220, created_at: "" },
  { id: "fallback-mica", name: "Mica", role: "Operations | Co-Head", initials: "M", headshot_url: null, linkedin: null, display_order: 230, created_at: "" },
  { id: "fallback-elsie", name: "Elsie", role: "WIF | Co-Head", initials: "E", headshot_url: "/headshots/Elsie.jpeg", linkedin: "https://www.linkedin.com/in/elsie-arvandita-b56b9a281", display_order: 240, created_at: "" },
  { id: "fallback-niyati", name: "Niyati", role: "WIF | Co-Head", initials: "N", headshot_url: null, linkedin: "https://www.linkedin.com/in/niyati-singh12", display_order: 250, created_at: "" },
  { id: "fallback-maya", name: "Maya", role: "WIF | Co-Head", initials: "M", headshot_url: null, linkedin: null, display_order: 260, created_at: "" },
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
      style={{ objectFit: "cover", objectPosition: "top center" }}
      onError={() => setFailed(true)}
    />
  );
}

export function Team() {
  const list = FALLBACK_COMMITTEE;
  useReveal([list.length]);

  const sortedCommittee = [...list].sort((a, b) => a.display_order - b.display_order);

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

          <div className="committee-grid committee-grid--4col" style={{ marginTop: 44 }}>
            {sortedCommittee.map(renderMember)}
          </div>
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
          <Link to="/network" className="btn btn-ghost" style={{ textDecoration: "none" }}>
            Our Network →
          </Link>
        </div>
      </section>
    </>
  );
}
