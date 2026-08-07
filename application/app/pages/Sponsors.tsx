import { useEffect, useState, type FormEvent } from "react";
import { Link } from "react-router";
import { useReveal } from "@/app/hooks/useReveal";
import type { Tables } from "@/lib/database.types";
import { supabase } from "@/lib/supabase";

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
type SponsorRow = Tables<"sponsors">;
const encode = (data: Record<string, string>) =>
  Object.keys(data).map((k) => encodeURIComponent(k) + "=" + encodeURIComponent(data[k])).join("&");

const TIER_ORDER = ["gold", "silver", "past"] as const;

function formatTier(tier: string) {
  return tier ? tier.charAt(0).toUpperCase() + tier.slice(1) : tier;
}

function groupSponsors(rows: SponsorRow[]) {
  return TIER_ORDER.map((tier) => ({
    tier,
    firms: rows.filter((row) => row.tier === tier),
  })).filter((group) => group.firms.length > 0);
}

// Sponsorship packages — no pricing shown. Populate deliverables as agreed.
const PACKAGES = [
  {
    tier: "Gold",
    headline: "Title Partner",
    deliverables: [
      "Named title partner across all flagship events",
      "Exclusive branded session or keynote slot",
      "Priority recruitment access to MUTIS members",
      "Logo placement on all MUTIS communications",
      "Dedicated careers panel feature",
    ],
  },
  {
    tier: "Silver",
    headline: "Event Partner",
    deliverables: [
      "Co-branding on one or more flagship events",
      "Fireside chat or insight session slot",
      "Access to MUTIS member recruitment pipeline",
      "Logo placement on event materials",
    ],
  },
  {
    tier: "Bronze",
    headline: "Supporting Partner",
    deliverables: [
      "Logo placement on MUTIS website and socials",
      "Mention across MUTIS communications",
      "Access to member newsletter sponsorship",
    ],
  },
];

// Past sponsors — populate once confirmed (name, logo path/URL, years active, optional link).
type PastSponsor = { name: string; logo: string; years: string; url: string | null };
const PAST_SPONSORS: PastSponsor[] = [
  // { name: "Firm", logo: "", years: "2022–2023", url: null },
];

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
  const logoStyle = logo.includes("barclays.svg") ? { maxWidth: "126%" } : undefined;

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
      style={logoStyle}
      onError={() => setFailed(true)}
    />
  );
}

function SponsorGridSkeleton() {
  return (
    <div className="sponsor-grid r-up" aria-busy="true" aria-live="polite">
      {Array.from({ length: 4 }).map((_, index) => (
        <div className="sponsor-cell" key={index} aria-hidden="true">
          <div>
            <div className="sponsor-logo-wrap" style={{ background: "rgba(255,255,255,0.03)" }}>
              <div className="sponsor-logo-fallback" style={{ opacity: 0.35 }}>--</div>
            </div>
            <div style={{ height: 14, width: "72%", background: "rgba(255,255,255,0.08)", margin: "18px auto 10px", borderRadius: 999 }} />
            <div style={{ height: 10, width: "46%", background: "rgba(255,255,255,0.06)", margin: "0 auto" }} />
          </div>
          <div className="vac" style={{ opacity: 0.55 }}>Loading →</div>
        </div>
      ))}
    </div>
  );
}

export function Sponsors() {
  const [status, setStatus] = useState<FormState>("idle");
  const [error, setError] = useState("");
  const [sponsors, setSponsors] = useState<SponsorRow[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState("");

  useEffect(() => {
    let cancelled = false;

    const loadSponsors = async () => {
      setIsLoading(true);
      setLoadError("");

      const { data, error } = await supabase.from("sponsors").select("*").order("display_order");

      if (cancelled) {
        return;
      }

      if (error) {
        console.error("Failed to load sponsors", error);
        setLoadError("We could not load the sponsor list right now. Please refresh the page.");
        setSponsors([]);
        setIsLoading(false);
        return;
      }

      setSponsors(data ?? []);
      setIsLoading(false);
    };

    void loadSponsors();

    return () => {
      cancelled = true;
    };
  }, []);

  const sponsorGroups = groupSponsors(sponsors);

  useReveal([sponsorGroups.length, isLoading, loadError]);

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

      {/* Sponsorship packages */}
      <section className="page-section" style={{ borderBottom: "1px solid var(--hair)" }}>
        <div className="inner">
          <div className="page-eyebrow r-up"><span className="bar" />Packages</div>
          <h2 className="r-up">Sponsorship tiers</h2>
          <p className="lede r-up">Three partnership levels — each with tailored access to our 1,000+ members and flagship event programme. Contact us for full package details and pricing.</p>
          <div className="r-up" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(min(100%, 280px), 1fr))", gap: 0, borderTop: "1px solid var(--hair)", borderLeft: "1px solid var(--hair)", marginTop: 36 }}>
            {PACKAGES.map((pkg) => (
              <div key={pkg.tier} style={{ borderRight: "1px solid var(--hair)", borderBottom: "1px solid var(--hair)", padding: "36px 28px" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 20 }}>
                  <span style={{ fontFamily: "var(--font-display)", fontSize: 22, textTransform: "uppercase", letterSpacing: "0.005em" }}>{pkg.tier}</span>
                  <span className="label">{pkg.headline}</span>
                </div>
                <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
                  {pkg.deliverables.map((d) => (
                    <li key={d} style={{ fontSize: 13, color: "var(--ink-soft)", padding: "5px 0", borderBottom: "1px solid var(--hair)", lineHeight: 1.5 }}>
                      <span style={{ color: "var(--pm-accent)", marginRight: 8 }}>→</span>{d}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Current partners by tier */}
      <section className="page-section">
        <div className="inner">
          <div className="page-eyebrow r-up"><span className="bar" />Partners &amp; Sponsors</div>
          <h2 className="r-up">Who we work with</h2>
          <p className="lede r-up">Partners across investment banking, markets, wealth management, and education. Each commits to recruitment access, content, or both.</p>

          {isLoading ? (
            <>
              <p className="lede r-up" role="status">Loading sponsor partners…</p>
              <SponsorGridSkeleton />
            </>
          ) : loadError ? (
            <p className="lede r-up" role="alert" style={{ color: "var(--ink-soft)" }}>{loadError}</p>
          ) : sponsorGroups.length === 0 ? (
            <p className="lede r-up" role="status" style={{ color: "var(--ink-soft)" }}>
              No sponsors are published yet.
            </p>
          ) : (
            sponsorGroups.map((tier) => (
              <div className="r-up" key={tier.tier}>
                <div className="tier-head">
                  <span>{formatTier(tier.tier)} Sponsors</span>
                  <span className="label">{formatTier(tier.tier)}</span>
                </div>
                <div className="sponsor-grid">
                  {tier.firms.map((firm) => {
                    const card = (
                      <div>
                        <div className="sponsor-logo-wrap">
                          <SponsorLogo name={firm.name} logo={firm.logo_url ?? ""} />
                        </div>
                        <div className="name">{firm.name}</div>
                        <div className="role">{firm.sector ?? "Partner"}</div>
                      </div>
                    );

                    return firm.link_url ? (
                      <a className="sponsor-cell" key={firm.name} href={firm.link_url} target="_blank" rel="noreferrer" style={{ textDecoration: "none", color: "inherit" }}>
                        {card}
                        <div className="vac">Open Vacancies →</div>
                      </a>
                    ) : (
                      <div className="sponsor-cell" key={firm.name}>
                        {card}
                        <div className="vac">Open Vacancies →</div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))
          )}
        </div>
      </section>

      {/* Past Sponsors */}
      <section className="page-section" style={{ borderTop: "1px solid var(--hair)" }}>
        <div className="inner">
          <div className="page-eyebrow r-up"><span className="bar" />Previous Partners</div>
          <h2 className="r-up">Past sponsors</h2>
          {PAST_SPONSORS.length === 0 ? (
            <p className="lede r-up" style={{ color: "var(--ink-soft)" }}>
              We&apos;re putting together a record of the firms that have supported MUTIS in previous years. Check back soon.
            </p>
          ) : (
            <div className="sponsor-grid r-up">
              {PAST_SPONSORS.map((s) => {
                const inner = (
                  <div>
                    <div className="sponsor-logo-wrap">
                      <SponsorLogo name={s.name} logo={s.logo} />
                    </div>
                    <div className="name">{s.name}</div>
                    <div className="role">{s.years}</div>
                  </div>
                );
                return s.url ? (
                  <a className="sponsor-cell" key={s.name} href={s.url} target="_blank" rel="noreferrer" style={{ textDecoration: "none", color: "inherit" }}>{inner}</a>
                ) : (
                  <div className="sponsor-cell" key={s.name}>{inner}</div>
                );
              })}
            </div>
          )}
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
                Interested in reaching 1,000+ Manchester finance students? Tell us a little about
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
                  <label>Don't fill this out if you're human: <input name="bot-field" tabIndex={-1} autoComplete="off" /></label>
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
              <div className="row"><div className="l">Reach</div><div className="v">1,000+ Members</div></div>
              <div className="row"><div className="l">Channels</div><div className="v">Events · Workshops · MEIF · Media</div></div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
