import { useState, type FormEvent, type ChangeEvent } from "react";
import { Link } from "react-router";
import { useReveal } from "@/app/hooks/useReveal";
import { useSiteSettings } from "@/app/hooks/useSiteSettings";
import { supabase } from "@/lib/supabase";

type Status = "idle" | "submitting" | "sent" | "error";

export function Attendance() {
  useReveal();
  const { settings } = useSiteSettings();
  const [status, setStatus] = useState<Status>("idle");
  const [error, setError] = useState("");
  const [rating, setRating] = useState(5);

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;

    if ((form.elements.namedItem("bot-field") as HTMLInputElement)?.value) {
      setStatus("sent");
      return;
    }

    const name = (form.elements.namedItem("attendee-name") as HTMLInputElement).value.trim();
    const email = (form.elements.namedItem("email") as HTMLInputElement).value.trim();
    const course = (form.elements.namedItem("course") as HTMLInputElement).value.trim();
    const year = (form.elements.namedItem("year") as HTMLSelectElement).value;
    const ratingVal = (form.elements.namedItem("rating") as HTMLInputElement).value;
    const comments = (form.elements.namedItem("comments") as HTMLTextAreaElement).value.trim();

    if (!name || !email || !course || !year) {
      setError("Please fill in your name, email, course, and year of study.");
      setStatus("error");
      return;
    }

    setStatus("submitting");
    setError("");

    const { error: insertError } = await supabase.from("attendance_submissions").insert({
      name,
      email,
      course,
      year,
      rating: Number(ratingVal),
      comments: comments || null,
    });

    if (insertError) {
      console.error("Failed to submit attendance", insertError);
      setError(
        `Something went wrong. Please try again or email us at ${settings.contact_email}.`
      );
      setStatus("error");
      return;
    }

    setStatus("sent");
    form.reset();
    setRating(5);
  };

  return (
    <>
      <section className="page-hero">
        <div className="page-hero-inner">
          <div>
            <div className="crumb">
              <Link to="/">MUTIS</Link><span>/</span><Link to="/events">Events</Link><span>/</span><span>Attendance</span>
            </div>
            <div className="page-eyebrow r-up"><span className="bar" />Events</div>
            <h1 className="page-title r-up">Log your<br /><span className="accent">attendance</span></h1>
          </div>
          <p className="page-sub r-up">
            Attended a MUTIS event? Register your attendance below and share your feedback.
          </p>
        </div>
      </section>

      <section className="page-section">
        <div className="inner">
          <div className="contact-grid">
            <div>
              <div className="page-eyebrow r-up"><span className="bar" />Attendance Form</div>
              <h2 className="r-up">Sign in</h2>
              <p className="lede r-up">
                Fill in your details and let us know how the event went. All fields marked * are required.
              </p>

              {status === "sent" ? (
                <div className="r-up" style={{ marginTop: 32 }}>
                  <p className="form-status form-success" role="status" style={{ fontSize: 16 }}>
                    Thanks for logging your attendance — your response has been recorded.
                  </p>
                  <button
                    className="btn btn-ghost"
                    style={{ marginTop: 24, textDecoration: "none" }}
                    onClick={() => setStatus("idle")}
                  >
                    Submit another response
                  </button>
                </div>
              ) : (
                <form
                  className="contact-form r-up"
                  name="attendance"
                  onSubmit={onSubmit}
                  noValidate
                >
                  <p className="hidden-field">
                    <label>
                      Don't fill this out if you're human:{" "}
                      <input name="bot-field" tabIndex={-1} autoComplete="off" />
                    </label>
                  </p>

                  <div className="field">
                    <label htmlFor="att-name">Full name *</label>
                    <input
                      id="att-name"
                      name="attendee-name"
                      type="text"
                      placeholder="First and last name"
                      autoComplete="name"
                      required
                    />
                  </div>

                  <div className="field">
                    <label htmlFor="att-email">University email *</label>
                    <input
                      id="att-email"
                      name="email"
                      type="email"
                      placeholder="you@student.manchester.ac.uk"
                      autoComplete="email"
                      required
                    />
                  </div>

                  <div className="field">
                    <label htmlFor="att-course">Course *</label>
                    <input
                      id="att-course"
                      name="course"
                      type="text"
                      placeholder="e.g. BSc Finance"
                      required
                    />
                  </div>

                  <div className="field">
                    <label htmlFor="att-year">Year of study *</label>
                    <select id="att-year" name="year" defaultValue="" required>
                      <option value="" disabled>Select year…</option>
                      <option value="1st Year">1st Year</option>
                      <option value="2nd Year">2nd Year</option>
                      <option value="3rd Year">3rd Year</option>
                      <option value="4th Year">4th Year</option>
                      <option value="Masters">Masters</option>
                      <option value="PhD">PhD</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>

                  <div className="field">
                    <label htmlFor="att-rating">
                      How would you rate the event? *&nbsp;
                      <span style={{ color: "var(--pm-accent)", fontVariantNumeric: "tabular-nums" }}>
                        {rating} / 10
                      </span>
                    </label>
                    <input
                      id="att-rating"
                      name="rating"
                      type="range"
                      min={1}
                      max={10}
                      step={1}
                      value={rating}
                      onChange={(e: ChangeEvent<HTMLInputElement>) => setRating(Number(e.target.value))}
                      style={{ width: "100%", accentColor: "var(--pm-accent)", cursor: "pointer" }}
                    />
                    <div style={{ display: "flex", justifyContent: "space-between", fontSize: 11, color: "var(--ink-soft)", letterSpacing: "0.08em", marginTop: 4 }}>
                      <span>1 — Poor</span>
                      <span>10 — Excellent</span>
                    </div>
                  </div>

                  <div className="field">
                    <label htmlFor="att-comments">Any comments? (optional)</label>
                    <textarea
                      id="att-comments"
                      name="comments"
                      placeholder="What did you enjoy? What could be improved?"
                    />
                  </div>

                  {status === "error" && (
                    <p className="form-status form-error" role="alert">{error}</p>
                  )}

                  <button
                    className="btn btn-primary"
                    type="submit"
                    disabled={status === "submitting"}
                    aria-busy={status === "submitting"}
                    style={{ alignSelf: "flex-start", marginTop: 8 }}
                  >
                    {status === "submitting" ? "Submitting…" : "Log Attendance"}
                    <span className="arrow" />
                  </button>
                </form>
              )}
            </div>

            <div className="contact-info r-up">
              <div className="row">
                <div className="l">Events</div>
                <div className="v">
                  <Link to="/events" style={{ color: "var(--pm-accent)" }}>View all events →</Link>
                </div>
              </div>
              <div className="row">
                <div className="l">Questions</div>
                <div className="v">
                  <a href={`mailto:${settings.contact_email}`}>
                    {settings.contact_email}
                  </a>
                </div>
              </div>
              <div className="row">
                <div className="l">Instagram</div>
                <div className="v">
                  <a href={settings.instagram_url} target="_blank" rel="noreferrer">
                    @mutisfinancesoc
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
