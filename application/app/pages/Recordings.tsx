import { Link } from "react-router";
import { useReveal } from "@/app/hooks/useReveal";

/**
 * Recorded / uploaded events. Add entries as recordings are published. Each item
 * may point to a hosted video (YouTube, Vimeo, etc.) via `url`. Until recordings
 * are available the page shows an honest "coming soon" state.
 */
type Recording = {
  id: string;
  title: string;
  speaker: string;
  when: string;
  url: string | null;
};

// PENDING: populate with real recorded events (title, speaker, date, video URL).
const RECORDINGS: Recording[] = [];

export function Recordings() {
  useReveal([RECORDINGS.length]);

  return (
    <>
      <section className="page-hero">
        <div className="page-hero-inner">
          <div>
            <div className="crumb">
              <Link to="/">MUTIS</Link><span>/</span><span>Media</span><span>/</span><span>Recordings</span>
            </div>
            <div className="page-eyebrow r-up"><span className="bar" />Media</div>
            <h1 className="page-title r-up">Watch events<br /><span className="accent">on demand</span></h1>
          </div>
          <p className="page-sub r-up">
            Missed a talk or panel? Recordings of selected MUTIS events are published here
            for members to catch up in their own time.
          </p>
        </div>
      </section>

      <section className="page-section">
        <div className="inner">
          <div className="page-eyebrow r-up"><span className="bar" />Recorded Events</div>
          <h2 className="r-up">Talks &amp; panels</h2>

          {RECORDINGS.length === 0 ? (
            <p className="lede r-up">
              Recordings of recent talks and panels will be published here soon. Follow us on{" "}
              <a href="https://instagram.com/mutisfinancesoc" target="_blank" rel="noreferrer" style={{ color: "var(--accent)" }}>Instagram</a>{" "}
              for announcements.
            </p>
          ) : (
            <div className="card-grid">
              {RECORDINGS.map((r) => (
                <a
                  key={r.id}
                  className="dark-card r-up"
                  href={r.url ?? undefined}
                  target="_blank"
                  rel="noreferrer"
                  style={{ textDecoration: "none", color: "inherit" }}
                >
                  <div className="num">▶ Watch</div>
                  <h3>{r.title}</h3>
                  <div className="meta"><span>{r.speaker}</span><span>·</span><span>{r.when}</span></div>
                  <div className="foot"><span>Recording</span><span className="more">Play →</span></div>
                </a>
              ))}
            </div>
          )}
        </div>
      </section>
    </>
  );
}
