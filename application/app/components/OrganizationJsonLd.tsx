import { Helmet } from "react-helmet-async";
import { useSiteSettings } from "@/app/hooks/useSiteSettings";
import { SITE_URL, DEFAULT_IMAGE } from "@/app/hooks/usePageMeta";

/**
 * Sitewide Organization JSON-LD, rendered once from Root(). Sourced live
 * from the site_settings table via useSiteSettings (falls back to its
 * last-known-good defaults if the row hasn't loaded yet) — not hardcoded.
 */
export function OrganizationJsonLd() {
  const { settings } = useSiteSettings();

  const sameAs = [settings.instagram_url, settings.linkedin_url].filter(Boolean);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "MUTIS Finance Society",
    alternateName: "Manchester University Trading and Investment Society",
    url: SITE_URL,
    logo: DEFAULT_IMAGE,
    email: settings.contact_email,
    foundingDate: String(settings.founding_year),
    sameAs,
  };

  return (
    <Helmet>
      <script type="application/ld+json">{JSON.stringify(jsonLd)}</script>
    </Helmet>
  );
}
