import { useState, type FormEvent } from "react";
import { Link } from "react-router";
import { useReveal } from "@/app/hooks/useReveal";

type Status = "idle" | "submitting" | "sent" | "error";

const encode = (data: Record<string, string>) =>
  Object.keys(data)
    .map((k) => encodeURIComponent(k) + "=" + encodeURIComponent(data[k]))
    .join("&");

export function Contact() {
  useReveal();
  const [status, setStatus] = useState<Status>("idle");
  const [error, setError] = useState<string>("");

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;

    // Honeypot: if a bot filled the hidden field, silently succeed.
    if ((form.elements.namedItem("bot-field") as HTMLInputElement)?.value) {
      setStatus("sent");
      return;
    }

    const data = {
      "form-name": "contact",
      name: (form.elements.namedItem("name") as HTMLInputElement).value.trim(),
      email: (form.elements.namedItem("email") as HTMLInputElement).value.trim(),
      reason: (form.elements.namedItem("reason") as HTMLSelectElement).value,
      message: (form.elements.namedItem("message") as HTMLTextAreaElement).value.trim(),
    };

    if (!data.name || !data.email || !data.message) {
      setError("Please fill in your name, email, and a message.");
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
    } catch {
      setError(
        "Something went wrong sending your message. Please email us directly at mutis@manchesterstudentsunion.com."
      );
      setStatus("error");
    }
  };

  return (
    <>
      <section className="page-hero">
        <div className="page-hero-inner">
          <div>
            <div className="crumb"><Link to="/">MUTIS</Link><span>/</span><span>Contact</span></div>
            <div className="page-eyebrow r-up"><span className="bar" />Contact</div>
            <h1 className="page-title r-up">Get in<br /><span className="accent">touch</span></h1>
          </div>
          <p className="page-sub r-up">Members, prospective members, partners, and journalists  -  use the form or email us directly.</p>
        </div>
      </section>

      <section className="page-section">
        <div className="inner">
          <div className="contact-grid">
            <div>
              <div className="page-eyebrow r-up"><span className="bar" />Section 01  -  Get in touch</div>
              <h2 className="r-up">Drop us a line</h2>
              <p className="lede r-up">Members, prospective members, partners, and sponsors  -  use the form, or email us directly.</p>

              <form
                className="contact-form r-up"
                name="contact"
                method="POST"
                data-netlify="true"
                data-netlify-honeypot="bot-field"
                onSubmit={onSubmit}
                noValidate
              >
                <input type="hidden" name="form-name" value="contact" />
                <p className="hidden-field">
                  <label>
                    Don’t fill this out if you’re human: <input name="bot-field" tabIndex={-1} autoComplete="off" />
                  </label>
                </p>
                <div className="field">
                  <label htmlFor="contact-name">Name</label>
                  <input id="contact-name" name="name" type="text" placeholder="First and last" autoComplete="name" required />
                </div>
                <div className="field">
                  <label htmlFor="contact-email">Email</label>
                  <input id="contact-email" name="email" type="email" placeholder="you@manchester.ac.uk" autoComplete="email" required />
                </div>
                <div className="field">
                  <label htmlFor="contact-reason">Reason</label>
                  <select id="contact-reason" name="reason" defaultValue="I want to join MUTIS">
                    <option>I want to join MUTIS</option>
                    <option>Partnership / sponsorship enquiry</option>
                    <option>MEIF analyst application</option>
                    <option>Event press / media</option>
                    <option>Other</option>
                  </select>
                </div>
                <div className="field">
                  <label htmlFor="contact-message">Message</label>
                  <textarea id="contact-message" name="message" placeholder="Tell us a bit more…" required />
                </div>

                {status === "error" && (
                  <p className="form-status form-error" role="alert">{error}</p>
                )}
                {status === "sent" && (
                  <p className="form-status form-success" role="status">
                    Thanks, your message is on its way. We’ll be in touch soon.
                  </p>
                )}

                <button
                  className="btn btn-primary"
                  type="submit"
                  disabled={status === "submitting"}
                  aria-busy={status === "submitting"}
                  style={{ alignSelf: "flex-start", marginTop: 8 }}
                >
                  {status === "submitting" ? "Sending…" : status === "sent" ? "Sent · Thanks" : "Send Message"}
                  <span className="arrow" />
                </button>
              </form>
            </div>

            <div className="contact-info r-up">
              <div className="row"><div className="l">Email</div><div className="v"><a href="mailto:mutis@manchesterstudentsunion.com">mutis@<wbr />manchesterstudentsunion.com</a></div></div>
              <div className="row"><div className="l">Address</div><div className="v">Alliance Manchester Business School<br />Booth Street West, M15 6PB</div></div>
              <div className="row"><div className="l">Instagram</div><div className="v"><a href="https://instagram.com/mutisfinancesoc" target="_blank" rel="noreferrer">@mutisfinancesoc</a></div></div>
              <div className="row"><div className="l">LinkedIn</div><div className="v"><a href="https://www.linkedin.com/company/manchester-university-trading-&-investment-society/" target="_blank" rel="noreferrer">MUTIS LinkedIn</a></div></div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
