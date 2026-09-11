import { Link } from "react-router";
import { useReveal } from "@/app/hooks/useReveal";
import { useSiteSettings } from "@/app/hooks/useSiteSettings";

export function Privacy() {
  useReveal();
  const { settings } = useSiteSettings();

  return (
    <>
      <section className="page-hero">
        <div className="page-hero-inner">
          <div>
            <div className="crumb"><Link to="/">MUTIS</Link><span>/</span><span>Privacy</span></div>
            <div className="page-eyebrow r-up"><span className="bar" />Legal</div>
            <h1 className="page-title r-up">Privacy<br /><span className="accent">notice</span></h1>
          </div>
          <p className="page-sub r-up">A plain-language explanation of what we collect through this site and why.</p>
        </div>
      </section>

      <section className="page-section">
        <div className="inner" style={{ maxWidth: 760 }}>
          <div className="article-body r-up">
            <p>
              <em>
                This is a short, plain-language notice written by the committee, not a formal legal document. If
                you have questions about how your data is handled, contact us at{" "}
                <a href={`mailto:${settings.contact_email}`}>{settings.contact_email}</a>.
              </em>
            </p>

            <h2>What we collect</h2>
            <p>
              MUTIS collects information you submit directly through forms on this site — for example the contact
              form, sponsorship enquiries, event sign-ups, event attendance/feedback, and the alumni directory
              registration. Each form only asks for what it needs to do its job (e.g. the alumni form asks for your
              career details so we can feature you in the network directory).
            </p>

            <h2>Why we collect it</h2>
            <p>
              We use this information to run the society: to respond to enquiries, manage event registrations, keep
              a record of attendance, evaluate sponsorship proposals, and — where you've explicitly agreed — to
              publish your details in the alumni network directory on this website and on MUTIS social media.
            </p>

            <h2>Publishing your details</h2>
            <p>
              Nothing you submit through the alumni registration form is published automatically. A committee member
              reviews every submission before it appears on the site, and we only publish what you've explicitly
              consented to via the "Permission to Publish" checkbox on that form.
            </p>

            <h2>Who can see it</h2>
            <p>
              Submitted data is stored in our database and is only accessible to committee members with admin access
              to the site, via a password-protected admin panel. We use Supabase as our database and hosting
              provider, which processes data on our behalf under its own security practices.
            </p>

            <h2>Your rights</h2>
            <p>
              You can ask us at any time what information we hold about you, ask us to correct it, or ask us to
              delete it — email <a href={`mailto:${settings.contact_email}`}>{settings.contact_email}</a> and we'll
              action your request. If you're featured in the alumni directory and want to be removed, the same
              applies.
            </p>

            <h2>Cookies and tracking</h2>
            <p>This site does not use advertising or tracking cookies.</p>
          </div>
        </div>
      </section>
    </>
  );
}
