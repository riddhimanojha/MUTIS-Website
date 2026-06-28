# SEO

## What’s implemented

### Static (`index.html`)
- Descriptive `<title>` and `<meta name="description">`.
- Canonical link.
- Open Graph tags (`og:type`, `og:site_name`, `og:title`, `og:description`, `og:url`, `og:image`).
- Twitter Card tags (`summary_large_image`).
- `theme-color`, SVG + JPEG favicons, and an Apple touch icon.

### Per-route (`application/app/hooks/usePageMeta.ts`)
`usePageMeta(pathname)` runs in the router `Root` and updates, on every navigation:
- `document.title`
- `meta[name="description"]`
- canonical `link[rel="canonical"]`
- `og:title` / `og:description` / `og:url`
- `twitter:title` / `twitter:description`

Each route has hand-written title + description in the `ROUTE_META` table. Unknown paths
(404) fall back to a sensible default.

### Crawlability
- [`public/robots.txt`](public/robots.txt) - allows all, points to the sitemap.
- [`public/sitemap.xml`](public/sitemap.xml) - lists all public routes with priorities.

## Configure your domain

The production domain is currently `https://mutis.co.uk`. Before launch, update it in:
- `index.html` (canonical + `og:url`)
- `usePageMeta.ts` (`SITE_URL`)
- `public/robots.txt`
- `public/sitemap.xml`

## Limitations & recommendations

- **Client-side rendering**: metadata is set with JavaScript after load. Googlebot renders
  JS, so titles/descriptions are picked up, but some crawlers and social scrapers read only
  the initial HTML. The static `index.html` tags cover the homepage well; for
  per-route social previews consider:
  - Prerendering (e.g. `vite-plugin-prerender`, `react-snap`) at build time, or
  - Migrating to a meta framework (Next.js / React Router framework mode) for SSR.
- Add JSON-LD structured data (`Organization`, `EducationalOrganization`, `Event`) for
  richer results once real event data exists.
- Generate a real social share image (`og:image`) sized 1200×630 instead of the logo.
- Keep `sitemap.xml` in sync when routes change.

## How to verify

- Lighthouse → SEO on each route.
- Use the Facebook Sharing Debugger / Twitter Card Validator against the deployed URL.
- `view-source:` the deployed page to confirm the static tags, then inspect the live DOM
  `<head>` after navigation to confirm per-route updates.
