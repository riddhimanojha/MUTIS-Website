import { useEffect } from "react";
import { Helmet } from "react-helmet-async";
import { DEFAULT_IMAGE, SITE_URL, resolveRouteMeta, type Meta } from "@/app/hooks/usePageMeta";

type PageMetaProps = {
  pathname: string;
  /** Overrides the looked-up route meta — used by dynamic routes like /articles/:id. */
  override?: Partial<Meta>;
};

// react-helmet-async only ever manages tags it added itself (marked with a
// data-rh attribute) — it never touches pre-existing tags, so the static
// title/description/canonical/OG/Twitter tags baked into index.html (there
// as a non-JS fallback for the homepage) would otherwise sit in the DOM
// alongside Helmet's route-specific versions once JS runs, and a naive
// `document.querySelector` for e.g. link[rel="canonical"] would keep
// returning the stale static one. Removed once, on first mount, so
// JS-executing crawlers/browsers see exactly one (correct, per-route) copy
// of each tag; the static originals remain the only thing a non-JS scraper
// ever sees, unchanged.
const STATIC_TAG_SELECTORS = [
  'meta[name="description"]',
  'link[rel="canonical"]',
  'meta[property="og:title"]',
  'meta[property="og:description"]',
  'meta[property="og:url"]',
  'meta[property="og:image"]',
  'meta[name="twitter:title"]',
  'meta[name="twitter:description"]',
  'meta[name="twitter:image"]',
];

function removeStaticHeadTagsOnce() {
  for (const selector of STATIC_TAG_SELECTORS) {
    document.head.querySelectorAll(`${selector}:not([data-rh])`).forEach((el) => el.remove());
  }
}

/**
 * Renders <title>, meta description, canonical, Open Graph, and Twitter Card
 * tags for the current route. Rendered once per navigation from Root() with
 * the static ROUTE_META lookup; pages with dynamic content (e.g.
 * ArticleDetail) render a second <PageMeta override={...}> nested deeper in
 * the tree, whose tags win per react-helmet-async's child-overrides-parent
 * merge order.
 */
export function PageMeta({ pathname, override }: PageMetaProps) {
  useEffect(() => {
    removeStaticHeadTagsOnce();
  }, []);

  const base = resolveRouteMeta(pathname);
  const meta = { ...base, ...override };
  const canonicalPath = meta.canonicalPath ?? pathname;
  const canonicalUrl = SITE_URL + (canonicalPath === "/" ? "" : canonicalPath);
  const image = meta.image ?? DEFAULT_IMAGE;

  return (
    <Helmet>
      <title>{meta.title}</title>
      <meta name="description" content={meta.description} />
      <meta name="robots" content={meta.noindex ? "noindex, follow" : "index, follow"} />
      {!meta.noCanonical && <link rel="canonical" href={canonicalUrl} />}

      <meta property="og:title" content={meta.title} />
      <meta property="og:description" content={meta.description} />
      <meta property="og:url" content={canonicalUrl} />
      <meta property="og:image" content={image} />

      <meta name="twitter:title" content={meta.title} />
      <meta name="twitter:description" content={meta.description} />
      <meta name="twitter:image" content={image} />
    </Helmet>
  );
}
