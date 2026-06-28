import { useState, type FormEvent } from "react";
import { Link } from "react-router";
import { sponsors } from "@/app/data/siteData";
import { useReveal } from "@/app/hooks/useReveal";

// Past event photos for the sponsorship showcase belt.
const eventImageModules = import.meta.glob(
  "../../assets/events/*.{jpg,jpeg,png,webp,avif,JPG,JPEG,PNG,WEBP,AVIF}",
  { eager: true, import: "default" },
) as Record<string, string>;
const PAST_EVENT_IMAGES = Object.entries(eventImageModules)
  .sort(([a], [b]) => a.localeCompare(b))
  .map(([, src]) => src)
  .slice(0, 14);

type FormState = "idle" | "submitting" | "sent" | "error";
const encode = (data: Record<string, string>) =>
  Object.keys(data).map((k) => encodeURIComponent(k) + "=" + encodeURIComponent(data[k])).join("&");

const TIER_LABEL: Record<string, string> = {
  "Current Corporate Sponsors & Partners": "Lead",
  "Industry Event Partners": "Events",
  "Philanthropic & Educational Support": "Support",
};

const FIRM_ROLE: Record<string, string> = {
  UBS: "Spring Insight",
  "Rothschild & Co": "Advisory",
  "Goldman Sachs": "Markets",
  "Wall Street Oasis": "Education",
  TradingView: "Tooling",
  Career26: "Coaching",
  "Prima Ekuiti": "Asset Mgmt",
  "Bank of America": "IBD",
  Barclays: "Markets",
  BNY: "Asset Servicing",
  "Morgan Stanley": "Markets",
  NatWest: "Banking",
  RBC: "Capital Markets",
  "LGT Wealth Management": "Wealth",
  Invesco: "Asset Mgmt",
  Volcafe: "Commodities",
  AmplifyME: "Simulations",
  "Shade Tree Fund": "Foundation",
  Trackr: "Edtech",
};

function initialsFromName(name: string) {
  const initials = name
    .split(/[^A-Za-z0-9]+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("");
  return initials || "CO";
}

function SponsorLogo({ name, logo }: { name: string; logo: string }) {
  const [failed, setFailed] = useState(false);

  if (!logo || failed) {
    return (
      <div className="sponsor-logo-fallback" aria-hidden="true">
        {initialsFromName(name)}
      </div>
    );
  }

  return (
    <img
      src={logo}
      alt={name}
      className="sponsor-logo"
      loading="lazy"
      decoding="async"
      onError={() => setFailed(true)}
    />
  );
}

export function Sponsors() {
  useReveal();
  const [status, setStatus] = useState<FormState>("idle");
  const [error, setError] = useState("");

  const onSponsorSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    if ((form.elements.namedItem("bot-field") as HTMLInputElement)?.value) {
      setStatus("sent");
      return;
    }
    const data = {
      "form-name": "sponsorship",
      company: (form.elements.namedItem("company") as HTMLInputElement).value.trim(),
      name: (form.elements.namedItem("name") as HTMLInputElement).value.trim(),
      email: (form.elements.namedItem("email") as HTMLInputElement).value.trim(),
      message: (form.elements.namedItem("message") as HTMLTextAreaElement).value.trim(),
    };
    if (!data.company || !data.name || !data.email || !data.message) {
      setError("Please fill in your company, name, email, and a message.");
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
      if (!res.ok) throw new Error(String(res.status));
      setStatus("sent");
      form.reset();
    } catch {
      setError("Something went wrong. Please email us directly at mutis@manchesterstudentsunion.com.");
      setStatus("error");
    }
  };

  return (
    <>
      <section className="page-hero">
        <div className="page-hero-inner">
          <div>
            <div className="crumb"><Link to="/">MUTIS</Link><span>/</span><span>Sponsors</span></div>
            <div className="page-eyebrow r-up"><span className="bar" />Sponsors</div>
            <h1 className="page-title r-up">Our<br />partners<br /><span className="accent">One pipeline</span></h1>
          </div>
          <p className="page-sub r-up">Sponsor firms underwrite our flagship events, host workshops, and  -  most importantly  -  meet our members ahead of recruitment.</p>
        </div>
      </section>

      <section className="page-section">
        <div className="inner">
          <div className="page-eyebrow r-up"><span className="bar" />Partners &amp; Sponsors</div>
          <h2 className="r-up">Who we work with</h2>
          <p className="lede r-up">17 partners across investment banking, markets, wealth management, and education. Each commits to recruitment access, content, or both.</p>

          {sponsors.map((tier) => (
            <div className="r-up" key={tier.tier}>
              <div className="tier-head">
                <span>{tier.tier}</span>
                <span className="label">{TIER_LABEL[tier.tier] ?? "Partner"}</span>
              </div>
              <div className="sponsor-grid">
                {tier.firms.map((firm) => (
                  <a className="sponsor-cell" key={firm.name} href={firm.vacanciesUrl} target="_blank" rel="noreferrer" style={{ textDecoration: "none", color: "inherit" }}>
                    <div>
                      <div className="sponsor-logo-wrap">
                        <SponsorLogo name={firm.name} logo={firm.logo} />
                      </div>
                      <div className="name">{firm.name}</div>
                      <div className="role">{FIRM_ROLE[firm.name] ?? "Partner"}</div>
                    </div>
                    <div className="vac">Open Vacancies →</div>
                  </a>
                ))}
              </div>
            </div>
          ))}

          <p className="r-up" style={{ marginTop: 40, fontSize: 14, color: "var(--ink-soft)" }}>
            Looking for firms that supported us in previous years?{" "}
            <Link to="/past-sponsors" style={{ color: "var(--pm-accent)", textDecoration: "underline" }}>
              See our past sponsors →
            </Link>
          </p>
        </div>
      </section>

      {/* Past events showcase */}
      {PAST_EVENT_IMAGES.length > 0 && (
        <section className="page-section" style={{ background: "var(--base)", borderTop: "1px solid rgba(255,255,255,0.05)", borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
          <div className="inner">
            <div className="page-eyebrow r-up"><span className="bar" />In Action</div>
            <h2 className="r-up">Where sponsorship goes</h2>
            <p className="lede r-up">Partner support powers the events, workshops, and conferences our members show up for.</p>
            <div className="image-belt r-up" aria-label="Past event photos">
              <div className="image-track">
                {[...PAST_EVENT_IMAGES, ...PAST_EVENT_IMAGES].map((src, i) => {
                  const dupe = i >= PAST_EVENT_IMAGES.length;
                  return (
                    <div className="image-cell" key={src + i} aria-hidden={dupe || undefined}>
                      <img src={src} alt={dupe ? "" : "MUTIS event photo"} width={220} height={130} loading="lazy" decoding="async" />
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Sponsorship enquiry form */}
      <section className="page-section">
        <div className="inner">
          <div className="contact-grid">
            <div>
              <div className="page-eyebrow r-up"><span className="bar" />Become a Partner</div>
              <h2 className="r-up">Enquire about sponsorship</h2>
              <p className="lede r-up">
                Interested in reaching 4,000+ Manchester finance students? Tell us a little about
                your firm and we&apos;ll be in touch with partnership options.
              </p>
              <form
                className="contact-form r-up"
                name="sponsorship"
                method="POST"
                data-netlify="true"
                data-netlify-honeypot="bot-field"
                onSubmit={onSponsorSubmit}
                noValidate
              >
                <input type="hidden" name="form-name" value="sponsorship" />
                <p className="hidden-field">
                  <label>Don’t fill this out if you’re human: <input name="bot-field" tabIndex={-1} autoComplete="off" /></label>
                </p>
                <div className="field">
                  <label htmlFor="sp-company">Company</label>
                  <input id="sp-company" name="company" type="text" placeholder="Firm name" required />
                </div>
                <div className="field">
                  <label htmlFor="sp-name">Contact name</label>
                  <input id="sp-name" name="name" type="text" placeholder="First and last" autoComplete="name" required />
                </div>
                <div className="field">
                  <label htmlFor="sp-email">Work email</label>
                  <input id="sp-email" name="email" type="email" placeholder="you@firm.com" autoComplete="email" required />
                </div>
                <div className="field">
                  <label htmlFor="sp-message">Message</label>
                  <textarea id="sp-message" name="message" placeholder="What are you interested in?" required />
                </div>

                {status === "error" && <p className="form-status form-error" role="alert">{error}</p>}
                {status === "sent" && (
                  <p className="form-status form-success" role="status">Thanks — your enquiry is on its way. We&apos;ll be in touch soon.</p>
                )}

                <button
                  className="btn btn-primary"
                  type="submit"
                  disabled={status === "submitting"}
                  aria-busy={status === "submitting"}
                  style={{ alignSelf: "flex-start", marginTop: 8 }}
                >
                  {status === "submitting" ? "Sending…" : status === "sent" ? "Sent · Thanks" : "Send Enquiry"}
                  <span className="arrow" />
                </button>
              </form>
            </div>

            <div className="contact-info r-up">
              <div className="row"><div className="l">Sponsorship</div><div className="v"><a href="mailto:mutis@manchesterstudentsunion.com">mutis@<wbr />manchesterstudentsunion.com</a></div></div>
              <div className="row"><div className="l">Reach</div><div className="v">4,000+ Members</div></div>
              <div className="row"><div className="l">Channels</div><div className="v">Events · Workshops · MEIF · Media</div></div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
