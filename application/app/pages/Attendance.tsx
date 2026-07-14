import { useState, type FormEvent } from "react";
import { Link } from "react-router";
import { useReveal } from "@/app/hooks/useReveal";

/**
 * Log My Attendance — the page our per-session QR codes point at.
 *
 * Submissions go to the Netlify form "attendance". Netlify keeps every
 * submission in the site dashboard (Forms → attendance), from where they can
 * be exported as CSV or piped straight into the attendance Google Sheet via a
 * Netlify → Google Sheets integration (e.g. Zapier/Make webhook notification).
 */

type Status = "idle" | "submitting" | "sent" | "error";

const encode = (data: Record<string, string>) =>
  Object.keys(data)
    .map((k) => encodeURIComponent(k) + "=" + encodeURIComponent(data[k]))
    .join("&");

const YEARS_OF_STUDY = [
  "Year 1",
  "Year 2",
  "Year 3",
  "Year 4",
  "Postgraduate",
];

export function Attendance() {
  useReveal();
  const [status, setStatus] = useState<Status>("idle");
  const [error, setError] = useState("");
  const [rating, setRating] = useState<string>("");

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;

    // Honeypot: if a bot filled the hidden field, silently succeed.
    if ((form.elements.namedItem("bot-field") as HTMLInputElement)?.value) {
      setStatus("sent");
      return;
    }

    const data = {
      "form-name": "attendance",
      name: (form.elements.namedItem("name") as HTMLInputElement).value.trim(),
      email: (form.elements.namedItem("email") as HTMLInputElement).value.trim(),
      course: (form.elements.namedItem("course") as HTMLInputElement).value.trim(),
      year: (form.elements.namedItem("year") as HTMLSelectElement).value,
      usefulness: rating,
      feedback: (form.elements.namedItem("feedback") as HTMLTextAreaElement).value.trim(),
    };

    if (!data.name || !data.email || !data.course || !data.year || !data.usefulness) {
      setError("Please fill in your name, university email, course, year of study, and a rating.");
      setStatus("error");
      return;
    }
    if (!/@([a-z0-9-]+\.)*manchester\.ac\.uk$/i.test(data.email)) {
      setError("Please use your University of Manchester email address (…@manchester.ac.uk).");
      setStatus("error");
      return;
    }

    setStatus("submitting");
    setError("");

    try {
      const res = await fetch("/", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: encode(data),
      });
      if (!res.ok) throw new Error(`Request failed (${res.status})`);
      setStatus("sent");
      form.reset();
      setRating("");
    } catch {
      setError("Something went wrong logging your attendance. Please try again, or flag it to a committee member.");
      setStatus("error");
    }
  };

  return (
    <>
      <section className="page-hero">
        <div className="page-hero-inner">
          <div>
            <div className="crumb">
              <Link to="/">MUTIS</Link><span>/</span><Link to="/events">Events</Link><span>/</span><span>Attendance</span>
            </div>
            <div className="page-eyebrow r-up"><span className="bar" />Attendance</div>
            <h1 className="page-title r-up">Log my<br /><span className="accent">attendance</span></h1>
          </div>
          <p className="page-sub r-up">
            Scanned the QR code at today&apos;s session? Fill this in so we can record your
            attendance — it takes less than a minute.
          </p>
        </div>
      </section>

      <section className="page-section">
        <div className="inner">
          <div className="contact-grid">
            <div>
              <div className="page-eyebrow r-up"><span className="bar" />Today&apos;s Session</div>
              <h2 className="r-up">You&apos;re here — tell us who you are</h2>

              <form
                className="contact-form r-up"
                name="attendance"
                method="POST"
                data-netlify="true"
                data-netlify-honeypot="bot-field"
                onSubmit={onSubmit}
                noValidate
              >
                <input type="hidden" name="form-name" value="attendance" />
                <p className="hidden-field">
                  <label>
                    Don’t fill this out if you’re human: <input name="bot-field" tabIndex={-1} autoComplete="off" />
                  </label>
                </p>

                <div className="field">
                  <label htmlFor="att-name">Name</label>
                  <input id="att-name" name="name" type="text" placeholder="First and last" autoComplete="name" required />
                </div>
                <div className="field">
                  <label htmlFor="att-email">University email</label>
                  <input id="att-email" name="email" type="email" placeholder="you@student.manchester.ac.uk" autoComplete="email" required />
                </div>
                <div className="field">
                  <label htmlFor="att-course">Course</label>
                  <input id="att-course" name="course" type="text" placeholder="e.g. BSc Economics" required />
                </div>
                <div className="field">
                  <label htmlFor="att-year">Year of study</label>
                  <select id="att-year" name="year" defaultValue="" required>
                    <option value="" disabled>Select your year</option>
                    {YEARS_OF_STUDY.map((y) => (
                      <option key={y} value={y}>{y}</option>
                    ))}
                  </select>
                </div>

                <div className="field">
                  <span className="rating-label" id="att-rating-label">
                    On a scale of 1–10, how useful was this event?
                  </span>
                  <div className="rating-scale" role="radiogroup" aria-labelledby="att-rating-label">
                    {Array.from({ length: 10 }, (_, i) => String(i + 1)).map((n) => (
                      <label key={n} className={"rating-dot" + (rating === n ? " rating-dot--active" : "")}>
                        <input
                          type="radio"
                          name="usefulness"
                          value={n}
                          checked={rating === n}
                          onChange={() => setRating(n)}
                          required
                        />
                        {n}
                      </label>
                    ))}
                  </div>
                </div>

                <div className="field">
                  <label htmlFor="att-feedback">Any feedback? <span style={{ opacity: 0.6 }}>(optional)</span></label>
                  <textarea id="att-feedback" name="feedback" placeholder="What worked? What should we improve?" />
                </div>

                {status === "error" && (
                  <p className="form-status form-error" role="alert">{error}</p>
                )}
                {status === "sent" && (
                  <p className="form-status form-success" role="status">
                    Attendance logged — thanks for coming. See you at the next one!
                  </p>
                )}

                <button
                  className="btn btn-primary"
                  type="submit"
                  disabled={status === "submitting"}
                  aria-busy={status === "submitting"}
                  style={{ alignSelf: "flex-start", marginTop: 8 }}
                >
                  {status === "submitting" ? "Logging…" : status === "sent" ? "Logged · Thanks" : "Log Attendance"}
                  <span className="arrow" />
                </button>
              </form>
            </div>

            <div className="contact-info r-up">
              <div className="row"><div className="l">Why</div><div className="v">Attendance helps us track engagement and improve every session.</div></div>
              <div className="row"><div className="l">Privacy</div><div className="v">Your details are only used for society records and are never shared with third parties.</div></div>
              <div className="row"><div className="l">Events</div><div className="v"><Link to="/events">See what&apos;s coming up →</Link></div></div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
