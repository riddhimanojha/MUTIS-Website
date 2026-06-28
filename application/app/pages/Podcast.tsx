import { Link } from "react-router";
import { useReveal } from "@/app/hooks/useReveal";

// PENDING: replace with the real MUTIS Spotify show URL.
// Format: https://open.spotify.com/embed/show/<SHOW_ID>?utm_source=generator
const SPOTIFY_SHOW_EMBED = "";

export function Podcast() {
  useReveal();

  return (
    <>
      <section className="page-hero">
        <div className="page-hero-inner">
          <div>
            <div className="crumb">
              <Link to="/">MUTIS</Link><span>/</span><span>Media</span><span>/</span><span>Podcast</span>
            </div>
            <div className="page-eyebrow r-up"><span className="bar" />Media</div>
            <h1 className="page-title r-up">Tune in to<br />the <span className="accent">MUTIS podcast</span></h1>
          </div>
          <p className="page-sub r-up">
            Conversations on markets, careers, and life inside the society — listen on
            Spotify wherever you are.
          </p>
        </div>
      </section>

      <section className="page-section">
        <div className="inner">
          <div className="page-eyebrow r-up"><span className="bar" />Listen</div>
          <h2 className="r-up">Latest episodes</h2>

          {SPOTIFY_SHOW_EMBED ? (
            <div className="podcast-embed r-up">
              <iframe
                title="MUTIS podcast on Spotify"
                src={SPOTIFY_SHOW_EMBED}
                width="100%"
                height="352"
                frameBorder={0}
                allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
                loading="lazy"
              />
            </div>
          ) : (
            <p className="lede r-up">
              {/* PENDING: paste the Spotify show embed URL into SPOTIFY_SHOW_EMBED above. */}
              Our podcast is launching soon. Once it&apos;s live, you&apos;ll be able to
              stream every episode right here.
            </p>
          )}
        </div>
      </section>
    </>
  );
}
