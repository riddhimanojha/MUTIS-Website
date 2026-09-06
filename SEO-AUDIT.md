# SEO Audit — MUTIS Website

**Date:** 2026-08-26
**Scope:** Full codebase audit of the React 18 + TypeScript + Vite 6 SPA (react-router v7, Vercel, Supabase backend), live at `mutisfinancesociety.com`.

## Method and a caveat on live verification

This audit is based on a full read of the codebase (routing, meta handling, site-level files, page components, image usage, Supabase data access) rather than a live crawl. The sandbox this audit was produced in has no general internet egress — direct requests to both `mutis.co.uk` and `mutisfinancesociety.com` are blocked by the environment's network policy — so nothing here was verified by actually fetching the live site, running Lighthouse against it, or testing social-share debuggers. Every finding below is derived from what the code will produce; findings that specifically need a live check are marked **[Needs live verification]**.

**Domain note:** the codebase hardcodes `https://mutis.co.uk` as the canonical domain in `index.html`, `usePageMeta.ts`, `robots.txt`, `sitemap.xml`, and one Supabase Edge Function. The site owner has confirmed the actual production domain is `https://www.mutisfinancesociety.com`, with `mutis.co.uk` intended to redirect to it. This mismatch is treated as a single Critical finding (below) rather than repeated per file.

---

## 1. Rendering and indexability

### 1.1 Pure client-side rendering — Critical — code fix (partial) + architectural decision
The app is a 100% CSR SPA: `vite.config.ts` has no SSR or prerender plugin, and `application/app/routes.tsx` uses `createBrowserRouter` in library mode. All per-route `<title>`, meta description, canonical, and Open Graph tags are set by `application/app/hooks/usePageMeta.ts`, which mutates `document.head` inside a `useEffect` — i.e. **after** the initial HTML has already been sent and after JS has executed. `view-source:` (or any crawler/scraper that doesn't execute JavaScript) sees only the static tags baked into `index.html`, which describe the homepage, on every single route.

Googlebot does execute JavaScript before indexing, so Google-driven organic search is degraded but not broken by this. However, most social-share unfurlers (Slack, iMessage, WhatsApp, Twitter/X, LinkedIn's crawler in many cases) and some secondary search engines do **not** run JS, so shared links to any non-home page currently show the homepage's title/description/image regardless of which page was actually shared.

- **Code fix now:** move to `react-helmet-async` for per-route tags (this sweep) — it doesn't change *when* tags are written (still client-side, still post-JS), but it fixes coverage (every route gets correct tags for JS-executing crawlers) and is a more maintainable primitive than hand-rolled DOM mutation.
- **Not fixed in this sweep — architectural decision for the owner:** true fix requires prerendering (e.g. a build-time static-HTML-per-route step) or migrating to SSR (Next.js, or react-router's framework/SSR mode). This is a meaningful engineering investment, not a drop-in fix, and is listed in `SEO-PLAN.md` under manual/owner decisions.

### 1.2 SPA fallback returns HTTP 200 for every route, including nonexistent ones — Critical — needs architectural decision
`vercel.json`'s rewrite sends `/*` → `/index.html` with **status 200**. This is required for client-side routing to survive a hard refresh, but it also means a truly nonexistent URL (typo, stale link, deleted content) returns HTTP 200 with the `NotFound` component rendered client-side — a "soft 404." Search engines generally handle soft-404s by demoting/dropping the page from the index once detected, but it takes longer than an honest 404 and can waste crawl budget.
- Fully solving this also requires server-side awareness of which routes are valid (i.e. SSR/prerendering, same as 1.1, or a Vercel Edge Middleware that checks the path) — flagged as the same architectural decision.
- Partial mitigation implemented this sweep: `NotFound.tsx` now sets `<meta name="robots" content="noindex, follow">` via Helmet, so once a crawler does render the page (which Googlebot will), it gets an explicit signal not to index it, and no misleading canonical is set.

### 1.3 Resolved: stray unused-host config — Low — code fix
The repo previously shipped config and a hidden form stub for a second, never-actually-live hosting provider alongside `vercel.json`. Confirmed the deploy target is Vercel; the unused config and the leftover hidden form stub in `index.html` have since been deleted.

---

## 2. Meta and social

### 2.1 Domain mismatch — Critical — code fix (in codebase) + DNS/registrar action (owner)
See the domain note above. `mutis.co.uk` appears in: `index.html` (canonical, `og:url`), `application/app/hooks/usePageMeta.ts` (`SITE_URL` constant), `public/robots.txt` (Sitemap: line), `public/sitemap.xml` (every `<loc>`), and `supabase/functions/admin-add-by-email/index.ts` (`SITE_URL`, used to build links in emails). All non-Edge-Function occurrences are corrected in this sweep to `https://www.mutisfinancesociety.com`. The Edge Function is left for the owner since changing it means redeploying a Supabase function, and the correct value depends on the owner's DNS/redirect plan (see Manual Steps).

### 2.2 Nine of eighteen public routes fall back to a "Page not found" title — Critical — code fix
`usePageMeta.ts`'s `ROUTE_META` table only has entries for `/`, `/about`, `/team`, `/events`, `/meif`, `/articles`, `/sponsors`, `/join`, `/contact` (9 routes). Every other real, linked, live route — `/alumni`, `/previous-presidents`, `/network`, `/past-speakers`, `/attendance`, `/media`, `/gallery`, `/recordings`, and the dynamic `/articles/:id` — falls through to the same fallback object used for genuine 404s:
```ts
const meta = ROUTE_META[pathname] ?? {
  title: `Page not found | ${SITE_NAME}`,
  description: DEFAULT_DESCRIPTION,
};
```
This means every published article, the entire Team page, Gallery, Recordings, Media, Past Speakers, Previous Presidents, and Our Network pages currently present the title **"Page not found | MUTIS Finance Society"** to any crawler or share-unfurler that reads document.title after JS runs. This is likely actively harming click-through from search results for those pages today.
- **Fixed this sweep:** every route gets a distinct title/description via the `react-helmet-async` migration; `ArticleDetail.tsx` gets per-article dynamic meta (title, description, image, canonical) sourced from the Supabase row.

### 2.3 `og:image`/`twitter:image` are relative and never updated per route — High — code fix
`index.html` sets `og:image`/`twitter:image` to `/mutislogo.jpg`, a relative path. Per the Open Graph spec, image URLs should be absolute — many scrapers (Facebook's in particular) silently fail to resolve relative image URLs, meaning shared links may show no preview image at all. `usePageMeta.ts` also never touches `og:image`/`twitter:image` on route change, so even once per-route titles/descriptions are fixed, every shared link (including individual articles with their own `cover_image_url`) shows the sitewide logo, not a relevant image. **[Needs live verification: confirm with Facebook Sharing Debugger / Twitter Card Validator once deployed]**
- **Fixed this sweep:** made the default `og:image` absolute; `react-helmet-async` migration sets a per-route/per-article `og:image` (falling back to the site default logo where a route has no better image).
- **Not fixed — needs a real asset (owner):** the current image is a 640×640 square logo, not the 1200×630 og:image standard. A properly composed social-share graphic is a design task, not something to fabricate; listed in Manual Steps.

### 2.4 NotFound page: no noindex, self-referential canonical — High — code fix
Previously, `usePageMeta`'s fallback set a canonical `link` pointing at the broken URL itself (e.g. a canonical of `https://mutis.co.uk/some-typo`), and no `robots` meta was ever set anywhere in the codebase — there was no concept of noindex at all. **Fixed this sweep**: `NotFound.tsx` now renders `<meta name="robots" content="noindex, follow">` and sets no canonical.

### 2.5 `/alumni` is a client-side redirect stub — Medium — code fix (partial) / architectural limitation
`Alumni.tsx` is `return <Navigate to="/network" replace />` — a JS-only redirect. A crawler that doesn't execute JS (or crawls before redirect fires) can index `/alumni` as its own thin, empty-of-unique-content page, distinct from but duplicating `/network`. It's correctly excluded from `sitemap.xml`, and it's not linked from the header nav, but `About.tsx` does link to it directly. A true fix (HTTP 301) isn't possible without server-side routing (same root cause as 1.1). **Fixed this sweep:** `/alumni`'s Helmet entry sets canonical to `/network` and noindex, so once a crawler does execute the JS it gets a clear non-indexing signal rather than nothing.

---

## 3. Structured data

### 3.1 No JSON-LD anywhere — High — code fix
Confirmed via full-text search: no `application/ld+json` script, no `Organization`, `Event`, or `BreadcrumbList` markup exists anywhere in the codebase or `index.html`.
- **Fixed this sweep:** a sitewide `Organization` JSON-LD block (name, url, logo, `sameAs` social links, sourced live from the `site_settings` table via the existing `useSiteSettings` hook — not hardcoded) rendered once in the shared `Root()` layout.
- **Fixed this sweep:** `Event` JSON-LD entries on the Events page (`/events`), one per currently-fetched upcoming event, built from the same Supabase `events` query the page already runs (`name`, `startDate`, `endDate`, `location`, `description`) — not hardcoded.
- **Known limitation, not fixed this sweep:** there is no `/events/:id` detail route — events only ever open in an in-page modal — so each `Event` entry's `url` field points at the shared `/events` listing page rather than a unique per-event URL. Rich snippets that expect a unique event page (e.g. Google's Event rich results) may not render fully until a dedicated event detail route exists. Adding that route is a larger feature change outside this sweep's scope; noted for the owner.
- **Not implemented — `BreadcrumbList`:** the site's `page-hero` sections already render a visual breadcrumb (`<div className="crumb">MUTIS / Section</div>`) on most subpages, but it isn't a semantic list and has no JSON-LD equivalent. Given the site's navigation is shallow (mostly one level deep off `/`), the incremental SEO value is low relative to the number of pages it would need touching; left out of this sweep and listed as an optional follow-up in `SEO-PLAN.md`.

---

## 4. Site-level files

### 4.1 `robots.txt` doesn't disallow `/admin` — High — code fix
Current file:
```
User-agent: *
Allow: /

Sitemap: https://mutis.co.uk/sitemap.xml
```
No `Disallow` at all. The `/admin/*` tree included both the authenticated admin dashboard and a set of **unauthenticated** `/admin/__preview-*` routes (`routes.tsx` lines 62–81 at the time of this audit) that rendered the same admin components with no session check — those were technically crawlable and indexable. (The `__preview-*` routes were an access-control question in their own right, separate from SEO — since resolved by deleting them outright, see `SEO-CHANGELOG.md`.)
- **Fixed this sweep:** `Disallow: /admin` added; `Sitemap:` line corrected to the right domain.

### 4.2 `sitemap.xml` is static and stale — Critical — code fix
Current file lists only 8 of the ~18 real public routes (missing `/team`, `/previous-presidents`, `/network`, `/past-speakers`, `/media`, `/gallery`, `/recordings`; correctly omits `/alumni` and `/admin/*`) and contains **zero** dynamic content — no individual `/articles/:id` URLs at all, meaning published articles have never been discoverable via sitemap.
- **Fixed this sweep:** a build-time generator script (`scripts/generate-sitemap.ts`) queries Supabase for published articles (`id`, `updated_at`) and combines them with the full static public route list, emitting a complete, accurate `sitemap.xml` on every build.
- **[Needs live verification]** once deployed: resubmit the sitemap in Google Search Console / Bing Webmaster Tools (owner action, see Manual Steps).

---

## 5. On-page technical

### 5.1 Homepage has no `<h1>` — Critical — code fix
`Home.tsx` — the single most important page on the site for SEO — has zero `<h1>` elements. The large "MUTIS" hero masthead text is rendered as nested `<div>`/`<span>` elements (`pm-hero-masthead` → `pm-hero-title-line` → animated inner `<span>`) purely for the letter-reveal animation; the first heading tag anywhere on the page is an `<h2>` roughly a third of the way down. Every other sampled page (About, Events, Team, Articles, ArticleDetail, MEIF, Sponsors, Recordings, Media, Gallery, PastSpeakers, PreviousPresidents, OurNetwork) has a correct single `<h1>` → `<h2>` → `<h3>` structure — this is isolated to the homepage.
- **Fixed this sweep:** the `pm-hero-masthead` wrapper is now a semantic `<h1>` instead of a `<div>`, verified against `mutis-base.css` — all the relevant styling (`.pm-hero-masthead`, `.pm-hero-title-line`, etc.) is class-selector-based with no tag-name dependency, and there is no global `h1 {}` reset rule, so the animation and visual layout are unaffected by the tag change.

### 5.2 Image alt text — Medium — code fix (partial) + one item flagged, not guessed
Sampled across `Home`, `Header`, `Articles`, `Events`, `Sponsors`, `PastSponsors`, `Team`/committee headshots, `Gallery`, `MEIF`. Overall coverage is good — most content images use `alt={name}` or `alt={title}` correctly, and decorative/duplicate marquee images correctly use empty `alt=""` with `aria-hidden`.
Two real gaps:
- `Events.tsx`'s upcoming-event card thumbnail and the event-details modal's cover image both use `alt=""` even though they're meaningful content images (the event's own cover photo), not decorative. **Fixed this sweep:** both now use `alt={ev.title}` / `alt={modalEvent.title}`.
- The homepage hero image is a pure CSS `background-image` (`.pm-hero-bg`), not an `<img>` — it has no alt text and is invisible to Google Images entirely. This is a deliberate design choice (parallax/overlay effects need a background image) and changing it to an `<img>` would be a larger visual-layer change; not altered this sweep, noted here as a known trade-off rather than a bug.

No alt text was invented for anything ambiguous (e.g. sponsor logos where the sponsor's identity isn't inferable from surrounding code/data were left untouched — in practice all sponsor/committee alt text in this codebase is already sourced from a `name` field in Supabase, so there was nothing left to guess at).

### 5.3 Missing explicit `width`/`height` on most content images — Medium/Low — code fix (partial)
Only the Events-past-photo image belt (`Events.tsx`, via the `Sponsors`-era pattern) sets explicit `width={220} height={130}`. Article cover images, event cards, and committee headshots have no explicit dimensions, which is a CLS risk while the image loads-in, particularly above the fold.
- **Fixed this sweep** where a fixed aspect ratio already exists in CSS (so the `width`/`height` attributes match reality rather than fighting the layout): `ArticleDetail`'s inline hero background is CSS, not an `<img>`, so it's not applicable there; `Events.tsx` card thumbnails and `Team.tsx` committee portraits now carry explicit dimensions matching their CSS-defined display size.
- Most of these images are also `loading="lazy"` and below the fold already, which caps the real-world CLS impact — this is a genuine but secondary issue relative to 5.1/2.2.

### 5.4 `public/headshots/*` — Low — needs owner confirmation, not touched
This folder holds 14 headshot JPEGs (80KB–1.8MB, one clear outlier at 1.8MB: `Anthony.jpeg`), but the live Team/Committee page actually sources committee photos from Supabase Storage (`committee_photos` bucket) via `committeePhotoUrl()` in `Team.tsx`, not from this folder. It's unclear from the codebase alone whether `public/headshots/*` is legacy/unused or referenced from somewhere else (e.g. `PastSpeakers` or `PreviousPresidents` admin uploads that happen to match these filenames). **Not touched this sweep** — compressing or deleting files without confirming they're dead risks breaking a page that does reference them. Flagged for the owner in Manual Steps.

### 5.5 No `preconnect`/`preload` for Google Fonts — Medium — code fix
`application/styles/fonts.css` pulls in 8 font families via a single `@import url("https://fonts.googleapis.com/...")`, which is render-blocking and, without a `preconnect`, requires a fresh DNS+TLS handshake to both `fonts.googleapis.com` and `fonts.gstatic.com` before the first font byte arrives.
- **Fixed this sweep:** added `<link rel="preconnect" href="https://fonts.googleapis.com">` and `<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>` to `index.html`.
- **Not fixed this sweep (stretch goal, left as-is):** converting the CSS `@import` to `<link rel="stylesheet">` tags directly in `index.html` would let the browser discover and fetch the font CSS earlier (before the main CSS bundle parses), a further LCP/render-blocking improvement. Left as a follow-up since it touches the font-loading strategy more invasively than a pure addition.

### 5.6 Favicon / touch icons — Low — not fixed this sweep, documentation was stale
`index.html` links a 640×640 JPEG (`/mutislogo.jpg`) as the sole favicon. An unreferenced `public/favicon.svg` exists but isn't wired into `<head>`, and there's no `apple-touch-icon` despite `SEO.md` claiming one exists (that doc is out of date). Left as-is this sweep — favicon presentation is a minor ranking factor at most, and swapping in the SVG without checking whether the mark still matches current branding is a judgment call better left to the owner; corrected the stale claim in `SEO.md` is out of scope, flagged here instead.

### 5.7 Internal links / broken links — none found — informational
No hardcoded broken links were found. Sponsor logos, committee LinkedIn URLs, recording URLs, and document/PDF links are all Supabase-driven (not hardcoded), so a broken link there is a content/data problem, not a code problem, and wouldn't show up in a codebase audit — worth a periodic manual check via the admin panel. All `<Link>` targets in `Header.tsx`'s navigation resolve to real routes in `routes.tsx`; no dead nav links.

### 5.8 Mobile viewport meta tag — present, correct — no action
`index.html` has `<meta name="viewport" content="width=device-width, initial-scale=1.0" />`. No issue.

### 5.9 Core Web Vitals sanity check — Medium — mostly already addressed, one code fix this sweep
Per `PERFORMANCE.md` (existing, current doc): JS bundle ~430KB (~136KB gzip, single chunk), gallery images already lazy-loaded with explicit dimensions, `prefers-reduced-motion` respected. The known remaining risks are the past-event JPEG gallery (~6-7MB total, flagged in `PERFORMANCE.md` already, not part of this SEO sweep's remit) and the font-loading issue in 5.5 (addressed above). **[Needs live verification]**: actual LCP/CLS/INP numbers require a real Lighthouse run against the deployed site, which this sandbox can't reach.

---

## Summary table

| # | Finding | Severity | Fix type |
|---|---|---|---|
| 1.1 | Pure CSR — no SSR/prerender | Critical | Partial code fix now; SSR/prerender is an owner decision |
| 1.2 | SPA fallback returns 200 for all routes | Critical | Partial code fix (noindex on 404); full fix needs 1.1 |
| 1.3 | Stray `vercel.json` | Low | Owner to confirm deploy target |
| 2.1 | Domain mismatch (`mutis.co.uk` vs `mutisfinancesociety.com`) | Critical | Code fix (this sweep) + DNS action (owner) |
| 2.2 | 10 routes show "Page not found" title | Critical | Code fix (this sweep) |
| 2.3 | Relative/generic `og:image` | High | Code fix (this sweep) + real asset (owner) |
| 2.4 | 404 page: no noindex, bad canonical | High | Code fix (this sweep) |
| 2.5 | `/alumni` is a JS-only redirect | Medium | Code fix (this sweep, partial) |
| 3.1 | No JSON-LD anywhere | High | Code fix (this sweep, Organization + Event); BreadcrumbList and true per-event URLs deferred |
| 4.1 | robots.txt doesn't block `/admin` | High | Code fix (this sweep) |
| 4.2 | Sitemap static and stale, no articles | Critical | Code fix (this sweep) |
| 5.1 | Homepage has no `<h1>` | Critical | Code fix (this sweep) |
| 5.2 | Two images with wrong empty alt | Medium | Code fix (this sweep) |
| 5.3 | Missing width/height on content images | Medium/Low | Partial code fix (this sweep) |
| 5.4 | Unclear legacy status of `public/headshots/*` | Low | Owner to confirm |
| 5.5 | No font preconnect | Medium | Code fix (this sweep) |
| 5.6 | Favicon/touch-icon setup stale | Low | Not fixed — owner/design call |
| 5.7 | Broken links | — | None found in code; DB content needs periodic manual check |
| 5.8 | Viewport meta | — | Already correct |
| 5.9 | Core Web Vitals | Medium | Mostly already addressed elsewhere; live verification needed |

See `SEO-PLAN.md` for the ordered task breakdown and `SEO-CHANGELOG.md` for exactly what was changed.
