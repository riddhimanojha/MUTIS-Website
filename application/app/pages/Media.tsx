import { Link } from "react-router";
import { useReveal } from "@/app/hooks/useReveal";

const MEDIA_LINKS = [
  { to: "/gallery", num: "01", title: "Gallery", desc: "Photography from conferences, socials, and speaker nights across the MUTIS year." },
  { to: "/recordings", num: "02", title: "Recordings", desc: "Watch selected talks and panels on demand, published for members to catch up." },
  { to: "/podcast", num: "03", title: "Podcast", desc: "Conversations on markets, careers, and society life — stream every episode on Spotify." },
];

export function Media() {
  useReveal([MEDIA_LINKS.length]);

  return (
    <>
      <section className="page-hero">
        <div className="page-hero-inner">
          <div>
            <div className="crumb"><Link to="/">MUTIS</Link><span>/</span><span>Media</span></div>
            <div className="page-eyebrow r-up"><span className="bar" />Media</div>
            <h1 className="page-title r-up">See, hear, and<br /><span className="accent">relive it</span></h1>
          </div>
          <p className="page-sub r-up">
            Photos, recordings, and our podcast — everything from the MUTIS year in one place.
          </p>
        </div>
      </section>

      <section className="page-section">
        <div className="inner">
          <div className="page-eyebrow r-up"><span className="bar" />Explore</div>
          <h2 className="r-up">Media channels</h2>
          <div className="card-grid">
            {MEDIA_LINKS.map((m) => (
              <Link key={m.to} to={m.to} className="dark-card r-up" style={{ textDecoration: "none", color: "inherit" }}>
                <div className="num">{m.num}</div>
                <h3>{m.title}</h3>
                <p>{m.desc}</p>
                <div className="foot"><span>Media</span><span className="more">Open →</span></div>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
