import { Link } from "react-router";

// SEO/robots: this route resolves via resolveRouteMeta()'s fallback in
// usePageMeta.ts (any pathname not in ROUTE_META → NOT_FOUND_META), which
// sets `noindex` and skips the canonical tag — <PageMeta> in routes.tsx
// renders that into <meta name="robots" content="noindex, follow">.
//
// Known constraint: Netlify's SPA fallback (public/_redirects, netlify.toml)
// serves index.html with an HTTP 200 for any unmatched path so client-side
// routing works on deep links and refreshes. That means even once this
// component renders, the server response for the URL was still 200, not a
// real 404 — search engines and non-JS clients see "200 OK" with this page's
// content, not a hard 404 status. Fixing that server-side would require an
// edge function or moving off pure static hosting; this component is the
// correct fix for anything that executes JS (browsers, most crawlers), but
// it can't change the HTTP status code itself.
export function NotFound() {
  return (
    <section className="page-hero">
      <div className="page-hero-inner">
        <div>
          <div className="crumb"><Link to="/">MUTIS</Link><span>/</span><span>404</span></div>
          <div className="page-eyebrow"><span className="bar" />Error 404</div>
          <h1 className="page-title">Page not<br /><span className="accent">found</span></h1>
        </div>
        <div>
          <p className="page-sub">
            The page you're looking for has moved, was renamed, or never existed. Check the URL, or
            head back to somewhere that does.
          </p>
          <div style={{ marginTop: 32, display: "flex", gap: 16, flexWrap: "wrap" }}>
            <Link to="/" className="btn btn-primary" style={{ textDecoration: "none" }}>
              Back to home <span className="arrow" />
            </Link>
            <Link to="/contact" className="btn btn-ghost" style={{ textDecoration: "none" }}>
              Contact us <span className="arrow" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
