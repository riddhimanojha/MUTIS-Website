# SEO Plan — MUTIS Website

Derived from `SEO-AUDIT.md`. Split into (a) tasks implemented directly in this sweep, and (b) tasks that require the site owner (credentials, DNS, content, design assets, or an architectural decision this sweep deliberately doesn't make).

## (a) Implemented in this sweep, in priority order

1. **Fix the domain mismatch** (Critical, 2.1) — replace `mutis.co.uk` with `https://www.mutisfinancesociety.com` in `index.html`, `usePageMeta.ts`, `robots.txt`, `sitemap.xml`.
2. **Fix the sitemap** (Critical, 4.2) — replace the static, stale `public/sitemap.xml` with a build-time generator that pulls published articles from Supabase and includes every real public route.
3. **Fix per-route meta coverage** (Critical, 2.2) — migrate to `react-helmet-async`; give every route (including `/articles/:id` dynamically, and `/alumni`, `/previous-presidents`, `/network`, `/past-speakers`, `/attendance`, `/media`, `/gallery`, `/recordings`, which currently have none) a correct, distinct title/description/canonical.
4. **Fix the homepage's missing `<h1>`** (Critical, 5.1) — convert the hero masthead wrapper to a semantic `<h1>`.
5. **Fix `robots.txt`** (High, 4.1) — add `Disallow: /admin`, correct the `Sitemap:` URL.
6. **Fix 404 handling** (High, 2.4) — add `noindex` meta and drop the broken self-referential canonical on `NotFound`.
7. **Add JSON-LD structured data** (High, 3.1) — sitewide `Organization` from live `site_settings` data; `Event` entries on `/events` from the live Supabase query.
8. **Fix `og:image`/`twitter:image`** (High, 2.3) — make the default image absolute; set a per-route/per-article image via the Helmet migration.
9. **Fix the two mis-tagged images on Events** (Medium, 5.2) — real `alt` text on the event card thumbnail and modal cover image.
10. **Add explicit image dimensions** where a stable aspect ratio already exists in CSS (Medium/Low, 5.3) — Events card thumbnails, Team committee portraits.
11. **Add font preconnect** (Medium, 5.5) — `preconnect` to `fonts.googleapis.com`/`fonts.gstatic.com` in `index.html`.
12. **Fix `/alumni`'s indexing signal** (Medium, 2.5) — noindex + canonical to `/network` via the Helmet migration (bundled into task 3).

Explicitly out of scope for direct implementation (see audit for why): full SSR/prerender migration (1.1/1.2), a true per-event detail route/URL, `BreadcrumbList` JSON-LD, converting the homepage hero to a real `<img>`, the `@import`→`<link>` font-loading rewrite, compressing/touching `public/headshots/*`, and favicon/touch-icon rework.

Admin routes (`/admin/*`) are explicitly left unoptimized and excluded from the sitemap/allowed in robots — that's the correct state for them, not a gap.

## (b) Manual steps required from the site owner

1. **DNS/redirect**: set up (or confirm) `mutis.co.uk` → `https://www.mutisfinancesociety.com` at the registrar/DNS level, so old links and any existing backlinks/bookmarks still resolve.
2. **Google Search Console**: verify `mutisfinancesociety.com` (both `www` and apex if not already unified), and once deployed, submit the corrected `sitemap.xml`.
3. **Bing Webmaster Tools**: same verification + sitemap submission.
4. **GA4** (or confirm existing analytics setup): the codebase has no analytics snippet at all currently — outside SEO scope strictly, but usually bundled into a sweep like this; flagging since none was found.
5. **Design a real Open Graph image** (1200×630) to replace the square logo currently used as the social-share fallback image.
6. **Confirm `public/headshots/*` legacy status** — are these files still referenced anywhere, or safe to delete/replace? (See audit 5.4.)
7. **Decide on SSR/prerendering investment** — the single highest-leverage remaining SEO fix is moving off pure CSR (via prerendering or a framework migration). This is a multi-week engineering decision, not something to fold into a sweep like this one.
8. ~~Review the unauthenticated `/admin/__preview-*` routes~~ — **resolved**: deleted outright rather than left for review, since there was no legitimate reason for them to be unauthenticated. See `SEO-CHANGELOG.md`.
9. ~~Confirm the deploy target~~ — **resolved**: the site is deployed on Vercel; the leftover config and redirects file for a never-actually-live second host have been deleted.
10. **Update `supabase/functions/admin-add-by-email/index.ts`'s `SITE_URL`** to the corrected domain and redeploy the Edge Function (left out of this sweep since it requires a function redeploy, not just a site rebuild).
11. **Periodic manual link check**: sponsor logos, committee LinkedIn URLs, and document/PDF links are all Supabase-driven content, not code — a broken link there is a content problem best caught via the admin panel, not a codebase audit.
12. **Live verification once deployed**: Lighthouse (mobile + desktop) on `/` and `/events`, Facebook Sharing Debugger / Twitter Card Validator against a few routes, `view-source:` spot-checks. None of this could be done from this sandbox (no live internet egress).
