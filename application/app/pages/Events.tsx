import { useEffect, useState, type FormEvent } from "react";
import { Link } from "react-router";
import DOMPurify from "dompurify";
import { useReveal } from "@/app/hooks/useReveal";
import { flagshipSupporters } from "@/app/data/siteData";
import { htmlToExcerpt } from "@/app/lib/htmlExcerpt";
import type { Tables } from "@/lib/database.types";
import { supabase } from "@/lib/supabase";
import { Modal } from "@/app/components/Modal";

const eventImageModules = import.meta.glob(
  "../../assets/events/*.{jpg,jpeg,png,webp,avif,JPG,JPEG,PNG,WEBP,AVIF}",
  { eager: true, import: "default" },
) as Record<string, string>;

const PAST_EVENT_IMAGES = Object.entries(eventImageModules)
  .sort(([a], [b]) => a.localeCompare(b))
  .map(([, src]) => src);

type EventRow = Tables<"events">;

const formatEventDate = (isoString: string) =>
  new Date(isoString).toLocaleString("en-GB", {
    weekday: "short",
    day: "numeric",
    month: "short",
    hour: "numeric",
    minute: "2-digit",
  });

type SignupStatus = "idle" | "submitting" | "sent" | "error";

function EventSignupForm({ eventId }: { eventId: string }) {
  const [status, setStatus] = useState<SignupStatus>("idle");
  const [error, setError] = useState("");

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;

    if ((form.elements.namedItem("bot-field") as HTMLInputElement)?.value) {
      setStatus("sent");
      return;
    }

    const name = (form.elements.namedItem("name") as HTMLInputElement).value.trim();
    const email = (form.elements.namedItem("email") as HTMLInputElement).value.trim();
    const notes = (form.elements.namedItem("notes") as HTMLTextAreaElement).value.trim();

    if (!name || !email) {
      setError("Please fill in your name and email.");
      setStatus("error");
      return;
    }

    setStatus("submitting");
    setError("");

    const { error: insertError } = await supabase
      .from("event_signups")
      .insert({ event_id: eventId, name, email, notes: notes || null });

    if (insertError) {
      console.error("Failed to submit event signup", insertError);
      setError(
        insertError.code === "23505"
          ? "You've already signed up for this event with that email."
          : "Something went wrong. Please try again or email us at mutis@manchesterstudentsunion.com.",
      );
      setStatus("error");
      return;
    }

    setStatus("sent");
    form.reset();
  };

  if (status === "sent") {
    return (
      <p className="form-status form-success" role="status" style={{ marginTop: 12 }}>
        You're signed up — see you there.
      </p>
    );
  }

  return (
    <form className="contact-form" onSubmit={onSubmit} noValidate style={{ marginTop: 16, gap: 10 }}>
      <p className="hidden-field">
        <label>
          Don't fill this out if you're human: <input name="bot-field" tabIndex={-1} autoComplete="off" />
        </label>
      </p>
      <div className="field">
        <label htmlFor={`su-name-${eventId}`}>Full name *</label>
        <input id={`su-name-${eventId}`} name="name" type="text" autoComplete="name" required />
      </div>
      <div className="field">
        <label htmlFor={`su-email-${eventId}`}>Email *</label>
        <input id={`su-email-${eventId}`} name="email" type="email" autoComplete="email" required />
      </div>
      <div className="field">
        <label htmlFor={`su-notes-${eventId}`}>Notes (optional)</label>
        <textarea id={`su-notes-${eventId}`} name="notes" />
      </div>
      {status === "error" && (
        <p className="form-status form-error" role="alert">{error}</p>
      )}
      <button
        className="btn btn-primary"
        type="submit"
        disabled={status === "submitting"}
        aria-busy={status === "submitting"}
        style={{ alignSelf: "flex-start" }}
      >
        {status === "submitting" ? "Signing up…" : "Sign up"}
        <span className="arrow" />
      </button>
    </form>
  );
}

export function Events() {
  const [events, setEvents] = useState<EventRow[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState("");
  const [modalEvent, setModalEvent] = useState<EventRow | null>(null);

  const [flagshipEvents, setFlagshipEvents] = useState<EventRow[]>([]);

  useEffect(() => {
    let cancelled = false;

    const loadEvents = async () => {
      setIsLoading(true);
      setLoadError("");

      // Hide events more than 24h past their scheduled start — a read-time filter,
      // not a cron job. Always sorted chronologically; there's no user-facing sort control.
      const expiryCutoff = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();
      const [upcoming, flagship] = await Promise.all([
        supabase
          .from("events")
          .select("*")
          .eq("is_published", true)
          .gt("starts_at", expiryCutoff)
          .order("starts_at", { ascending: true }),
        supabase
          .from("events")
          .select("*")
          .eq("is_published", true)
          .contains("tags", ["flagship"])
          .order("starts_at", { ascending: true }),
      ]);

      if (cancelled) {
        return;
      }

      if (upcoming.error || flagship.error) {
        console.error("Failed to load events", upcoming.error ?? flagship.error);
        setLoadError("We could not load upcoming events right now. Please refresh the page.");
        setEvents([]);
        setFlagshipEvents([]);
        setIsLoading(false);
        return;
      }

      setEvents(upcoming.data ?? []);
      setFlagshipEvents(flagship.data ?? []);
      setIsLoading(false);
    };

    void loadEvents();

    return () => {
      cancelled = true;
    };
  }, []);

  useReveal([flagshipEvents.length, events.length, isLoading, loadError]);

  return (
    <>
      <section className="page-hero page-hero-events">
        <div className="page-hero-inner">
          <div>
            <div className="crumb"><Link to="/">MUTIS</Link><span>/</span><span>Events</span></div>
            <div className="page-eyebrow r-up"><span className="bar" />Events</div>
            <h1 className="page-title r-up">Where members<br />meet <span className="accent">markets</span></h1>
          </div>
          <p className="page-sub r-up">From flagship conferences to weekly partner sessions  -  MUTIS events put members in the same room as the people hiring them.</p>
        </div>
      </section>

      <section className="page-section">
        <div className="inner">
          <div className="page-eyebrow r-up"><span className="bar" />Section 01  -  Flagship</div>
          <h2 className="r-up">Three events define the year</h2>
          {flagshipSupporters.length > 0 && (
            <p className="lede r-up" style={{ marginBottom: 32 }}>
              Our flagship events are supported by{" "}
              {flagshipSupporters.map((s, i) => (
                <span key={s.name}>
                  {i > 0 && ", "}
                  <a href={s.url} target="_blank" rel="noreferrer" style={{ color: "var(--pm-accent)", textDecoration: "underline" }}>{s.name}</a>
                </span>
              ))}
              .
            </p>
          )}
          {isLoading ? (
            <p className="lede r-up" role="status">Loading…</p>
          ) : flagshipEvents.length === 0 ? (
            <p className="lede r-up">Flagship events for this year are being finalised — check back soon.</p>
          ) : (
            <div className="card-grid">
              {flagshipEvents.map((e, i) => (
                <div className="dark-card r-up" key={e.id}>
                  <div className="num">{`E.${String(i + 1).padStart(2, "0")}`}</div>
                  <h3>{e.title}</h3>
                  <div className="meta">{formatEventDate(e.starts_at)}</div>
                  <p className="excerpt">{htmlToExcerpt(e.description)}</p>
                  <div className="foot"><span>{e.location}</span></div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      <section className="page-section" style={{ background: "var(--base)", borderTop: "1px solid rgba(255,255,255,0.05)", borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
        <div className="inner">
          <div className="page-eyebrow r-up"><span className="bar" />Section 02  -  Upcoming Term</div>
          <h2 className="r-up">Upcoming events</h2>
          {isLoading ? (
            <p className="lede r-up" role="status">Loading upcoming events…</p>
          ) : loadError ? (
            <p className="lede r-up" role="alert" style={{ color: "var(--ink-soft)" }}>{loadError}</p>
          ) : events.length === 0 ? (
            <p className="lede r-up">No upcoming events are currently scheduled  -  check back soon, or follow us on Instagram for the latest.</p>
          ) : (
            <div className="card-grid">
              {events.map((ev) => (
                <div className="dark-card r-up" key={ev.id}>
                  {ev.cover_image_url && (
                    <img src={ev.cover_image_url} alt="" className="article-thumb" loading="lazy" decoding="async" />
                  )}
                  <h3>{ev.title}</h3>
                  <div className="meta"><span>{formatEventDate(ev.starts_at)}</span><span>·</span><span>{ev.location}</span></div>
                  {ev.tags.length > 0 && (
                    <div className="tag-list">
                      {ev.tags.map((tag) => (
                        <span key={tag} className="tag-badge">{tag}</span>
                      ))}
                    </div>
                  )}
                  <p className="excerpt">{htmlToExcerpt(ev.description)}</p>
                  <div className="foot">
                    <span>{ev.signup_enabled ? "Signup open" : "Details"}</span>
                    <button type="button" className="more" onClick={() => setModalEvent(ev)}>View details →</button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      <section className="page-section">
        <div className="inner">
          <div className="page-eyebrow r-up"><span className="bar" />Section 03  -  Past Events</div>
          <h2 className="r-up">Past events</h2>
          <p className="lede r-up">
            Want to see who&apos;s spoken at MUTIS?{" "}
            <Link to="/past-speakers" style={{ color: "var(--pm-accent)", textDecoration: "underline" }}>
              Browse our past speakers →
            </Link>
          </p>
          <div className="image-belt r-up" aria-label="Past event photos">
            <div className="image-track">
              {[...PAST_EVENT_IMAGES, ...PAST_EVENT_IMAGES].map((src, i) => {
                const isDuplicate = i >= PAST_EVENT_IMAGES.length;
                return (
                  <div className="image-cell" key={src + i} aria-hidden={isDuplicate || undefined}>
                    <img
                      src={src}
                      alt={isDuplicate ? "" : "MUTIS event photo"}
                      width={220}
                      height={130}
                      loading="lazy"
                      decoding="async"
                    />
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      <Modal open={modalEvent !== null} onClose={() => setModalEvent(null)} labelledBy="event-modal-title">
        {modalEvent && (
          <>
            {modalEvent.cover_image_url && (
              <img src={modalEvent.cover_image_url} alt="" className="modal-cover" />
            )}
            <div className="modal-body">
              <h3 id="event-modal-title">{modalEvent.title}</h3>
              <div className="modal-meta">
                <span>{formatEventDate(modalEvent.starts_at)}</span>
                <span>·</span>
                <span>{modalEvent.location}</span>
              </div>
              {modalEvent.tags.length > 0 && (
                <div className="tag-list" style={{ marginBottom: 24 }}>
                  {modalEvent.tags.map((tag) => (
                    <span key={tag} className="tag-badge">{tag}</span>
                  ))}
                </div>
              )}
              <div
                className="article-body"
                dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(modalEvent.description) }}
              />
              {modalEvent.signup_enabled && (
                <>
                  <hr className="modal-divider" />
                  <p className="modal-signup-head">Sign up</p>
                  <p className="modal-signup-note">Reserve your spot — we'll only use these details for this event.</p>
                  <EventSignupForm eventId={modalEvent.id} />
                </>
              )}
            </div>
          </>
        )}
      </Modal>
    </>
  );
}
