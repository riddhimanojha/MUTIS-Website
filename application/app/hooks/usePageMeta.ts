import { useEffect } from "react";

const SITE_NAME = "MUTIS Finance Society";
const SITE_URL = "https://mutis.co.uk";
const DEFAULT_DESCRIPTION =
  "MUTIS is the University of Manchester's largest trading and investment society: events, the student-run Ethical Investment Fund (MEIF), member research, and industry partnerships.";

type Meta = { title: string; description: string };

/**
 * Per-route SEO metadata. Keys are pathnames. The title is the full
 * <title>; descriptions feed the meta description and Open Graph tags.
 */
const ROUTE_META: Record<string, Meta> = {
  "/": {
    title: "MUTIS Finance Society",
    description: DEFAULT_DESCRIPTION,
  },
  "/about": {
    title: "About | MUTIS Finance Society",
    description:
      "Who we are: a student-run finance society at the University of Manchester with 1,000+ members, a real investment fund, and a committee across events, research, and operations.",
  },
  "/network": {
    title: "Our Network | MUTIS Finance Society",
    description:
      "Where MUTIS members go next: placements and destinations across investment banking, asset management, consulting, and markets.",
  },
  "/previous-presidents": {
    title: "Previous Presidents | MUTIS Finance Society",
    description:
      "The presidents who have led MUTIS through each academic year since its founding in 2008.",
  },
  "/attendance": {
    title: "Log My Attendance | MUTIS Finance Society",
    description:
      "At a MUTIS session? Log your attendance in under a minute and tell us how useful you found the event.",
  },
  "/team": {
    title: "Team | MUTIS Finance Society",
    description:
      "Meet the MUTIS committee: our Co-Presidents, Executive Committee, and the tech, sponsorships, operations, and Women in Finance teams who run the society.",
  },
  "/events": {
    title: "Events | MUTIS Finance Society",
    description:
      "Flagship conferences, the UK Student Finance Summit, the M&A Challenge, and partner sessions that put MUTIS members in the room with the firms hiring them.",
  },
  "/meif": {
    title: "MEIF: Manchester Ethical Investment Fund | MUTIS Finance Society",
    description:
      "The MUTIS Ethical Investment Fund is a student-managed global equity fund with five equity coverage desks and a macro team, screened against ethical criteria.",
  },
  "/articles": {
    title: "Articles | MUTIS Finance Society Member Research",
    description:
      "Original notes, deep-dives, and market commentary from MUTIS analysts and MEIF coverage teams.",
  },
  "/sponsors": {
    title: "Sponsors & Partners | MUTIS Finance Society",
    description:
      "MUTIS partner firms across investment banking, markets, wealth management, and education underwrite events, host workshops, and meet members ahead of recruitment.",
  },
  "/join": {
    title: "Join MUTIS Finance Society: Become a Member",
    description:
      "Membership is open to every University of Manchester student. Sign up via the Students' Union, come to a weekly meeting, and apply to MEIF, IBC, or a sub-committee.",
  },
  "/contact": {
    title: "Contact | MUTIS Finance Society",
    description:
      "Get in touch with MUTIS: membership, partnerships and sponsorship, MEIF applications, or press enquiries.",
  },
};

function setMetaTag(attr: "name" | "property", key: string, content: string) {
  let el = document.head.querySelector<HTMLMetaElement>(`meta[${attr}="${key}"]`);
  if (!el) {
    el = document.createElement("meta");
    el.setAttribute(attr, key);
    document.head.appendChild(el);
  }
  el.setAttribute("content", content);
}

function setCanonical(href: string) {
  let el = document.head.querySelector<HTMLLinkElement>('link[rel="canonical"]');
  if (!el) {
    el = document.createElement("link");
    el.setAttribute("rel", "canonical");
    document.head.appendChild(el);
  }
  el.setAttribute("href", href);
}

/**
 * Applies dynamic <title>, meta description, canonical URL, and Open Graph /
 * Twitter tags for the current route. Falls back to the site defaults for
 * unknown paths (e.g. 404).
 */
export function usePageMeta(pathname: string) {
  useEffect(() => {
    const meta = ROUTE_META[pathname] ?? {
      title: `Page not found | ${SITE_NAME}`,
      description: DEFAULT_DESCRIPTION,
    };
    const url = SITE_URL + (pathname === "/" ? "" : pathname);

    document.title = meta.title;
    setMetaTag("name", "description", meta.description);
    setCanonical(url);

    setMetaTag("property", "og:title", meta.title);
    setMetaTag("property", "og:description", meta.description);
    setMetaTag("property", "og:url", url);
    setMetaTag("name", "twitter:title", meta.title);
    setMetaTag("name", "twitter:description", meta.description);
  }, [pathname]);
}
