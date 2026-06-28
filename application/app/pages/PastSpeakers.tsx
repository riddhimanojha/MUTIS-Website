import { Link } from "react-router";
import { useReveal } from "@/app/hooks/useReveal";

/**
 * Past Speakers — to be populated from the MUTIS Instagram archive plus a manual
 * cross-check. The card layout below is drop-in ready.
 *
 * PENDING: real speaker name, firm, role, event, and (optionally) a photo.
 * Do not fabricate names — fill from confirmed sources only.
 */
type Speaker = {
  id: string;
  name: string;
  firm: string;
  role: string;
  event: string;
  photo: string | null;
};

const PAST_SPEAKERS: Speaker[] = [
  // { id: "1", name: "Speaker Name", firm: "Firm", role: "Managing Director", event: "Fireside Chat 2024", photo: null },
];

export function PastSpeakers() {
  useReveal([PAST_SPEAKERS.length]);

  return (
    <>
      <section className="page-hero">
        <div className="page-hero-inner">
          <div>
            <div className="crumb">
              <Link to="/">MUTIS</Link><span>/</span><span>Past Speakers</span>
            </div>
            <div className="page-eyebrow r-up"><span className="bar" />Past Speakers</div>
            <h1 className="page-title r-up">
              The people who<br />came to <span className="accent">speak</span>
            </h1>
          </div>
          <p className="page-sub r-up">
            Senior professionals from across banking, markets, and asset management who
            have shared their insight with MUTIS members.
          </p>
        </div>
      </section>

      <section className="page-section">
        <div className="inner">
          <div className="page-eyebrow r-up"><span className="bar" />Speaker Archive</div>
          <h2 className="r-up">Previous speakers</h2>

          {PAST_SPEAKERS.length === 0 ? (
            <p className="lede r-up">
              {/* PENDING: extract speaker list from Instagram archive + manual cross-check. */}
              We&apos;re compiling our archive of past speakers from previous events.
              Check back soon.
            </p>
          ) : (
            <div className="speaker-grid r-up">
              {PAST_SPEAKERS.map((s) => (
                <article className="speaker-card" key={s.id}>
                  <div className="speaker-photo">
                    {s.photo ? (
                      <img src={s.photo} alt={s.name} loading="lazy" decoding="async" />
                    ) : (
                      <span aria-hidden="true">{s.name.charAt(0)}</span>
                    )}
                  </div>
                  <div className="speaker-name">{s.name}</div>
                  <div className="speaker-role">{s.role}</div>
                  <div className="speaker-firm">{s.firm}</div>
                  <div className="speaker-event">{s.event}</div>
                </article>
              ))}
            </div>
          )}
        </div>
      </section>
    </>
  );
}
