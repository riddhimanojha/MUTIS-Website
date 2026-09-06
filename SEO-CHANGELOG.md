# SEO Changelog — MUTIS Website

Changes made in this sweep, grouped by area. See `SEO-AUDIT.md` for the findings behind each change and `SEO-PLAN.md` for the prioritized task list.

## Domain correction

- `index.html`, `application/app/hooks/usePageMeta.ts` (`SITE_URL`), `public/robots.txt`, and the sitemap generator now use `https://www.mutisfinancesociety.com` instead of the stale `mutis.co.uk`. (Audit 2.1)
- Not changed: `supabase/functions/admin-add-by-email/index.ts`'s `SITE_URL` — that's an Edge Function requiring a separate deploy, left for the owner (see Manual Steps).

## Per-route meta management

- Added `react-helmet-async`. Wrapped the app root (`application/main.tsx`) in `<HelmetProvider>`.
- Rewrote `application/app/hooks/usePageMeta.ts` from an imperative DOM-mutation hook into a plain data module (`ROUTE_META`, `resolveRouteMeta`) consumed by a new `application/app/components/PageMeta.tsx` component that renders title/description/robots/canonical/OG/Twitter tags via `<Helmet>`.
- Added `ROUTE_META` entries for every previously-uncovered route: `/previous-presidents`, `/network`, `/past-speakers`, `/media`, `/gallery`, `/recordings`, plus special-cased entries for `/alumni` (noindex, canonical → `/network`, since it's a client-side redirect stub) and `/attendance` (noindex — an unlisted, QR-code-only utility page). Previously all of these showed the literal title "Page not found | MUTIS Finance Society". (Audit 2.2)
- `ArticleDetail.tsx` now renders its own `<PageMeta override={...}>` once an article loads, with the real article title, an excerpt of its body as the description, and its `cover_image_url` as the OG/Twitter image; canonical is `/articles/{id}`. A separate override handles the not-found/error state (noindex, no canonical). (Audit 2.2)
- `og:image`/`twitter:image` now default to an absolute URL (`https://www.mutisfinancesociety.com/mutislogo.jpg`) and can be overridden per route/article. (Audit 2.3)
- `NotFound`'s meta (via the Root-level catch-all fallback) now sets `<meta name="robots" content="noindex, follow">` and omits the canonical tag entirely, instead of the old fallback that set a broken self-referential canonical and no robots signal at all. (Audit 2.4)

### A duplication bug caught and fixed during this sweep

`index.html` ships static title/description/canonical/OG/Twitter tags as a non-JS fallback for the homepage. `react-helmet-async` only ever manages tags it added itself (marked internally with a `data-rh` attribute) — it never removes or replaces pre-existing tags it didn't add. Left alone, this would have meant every route ended up with **two** copies of these tags once JS ran (the stale static ones plus Helmet's new ones), with `document.querySelector` picking up the stale, always-homepage static one first — i.e. the canonical migration would have silently made canonical/description/OG *worse* for every JS-executing crawler (multiple conflicting canonical tags is explicitly called out by Google as a signal it will disregard). `PageMeta.tsx` now removes those specific static tags once, on first mount, so the DOM ends up with exactly one (correct, per-route) copy of each — verified via a headless-browser smoke test across several routes (see Verification below). The static tags remain in `index.html`'s raw source, so a non-JS scraper still sees the homepage's own consistent tags — nothing worse than the pre-existing CSR limitation already documented in Audit 1.1.

A related merge-order subtlety: `react-helmet-async` only overrides a same-typed tag when a nested `<Helmet>` actually re-renders it — omitting a tag isn't a signal to remove an ancestor's version of it. The `/articles/:id` Root-level placeholder meta (`ARTICLE_LOADING_META`) was changed to never assert a canonical of its own (`noCanonical: true`), so an `ArticleDetail` error/loading state that also omits a canonical doesn't end up with a stray one left over from the Root-level default.

## Structured data (JSON-LD)

- Added `application/app/components/OrganizationJsonLd.tsx`: sitewide `Organization` schema (name, url, logo, email, founding year, `sameAs` social links) sourced live from the `site_settings` table via the existing `useSiteSettings` hook — not hardcoded. Rendered once from `Root()` in `routes.tsx`, so it appears on every public route. (Audit 3.1)
- Added `Event` JSON-LD to `application/app/pages/Events.tsx`, built from the same Supabase `events` query the page already runs (name, start/end date, location, description, image) — not hardcoded. Since there's no `/events/:id` detail route (events only open in a modal), each entry's `url` points at the `/events` listing page; noted as a known limitation in a code comment and in the audit. No `BreadcrumbList` was added — see Audit 3.1 for why it was judged low-value relative to its cost given the site's shallow navigation depth.

## Sitemap and robots.txt

- Added `scripts/generate-sitemap.mjs`: queries Supabase for published articles (`id`, `updated_at`) and combines them with the full static public route list to emit `public/sitemap.xml`. Degrades gracefully (logs a warning, writes static routes only) if Supabase credentials aren't available at build time. Wired into `package.json`'s `build` script (`node scripts/generate-sitemap.mjs && vite build`) and exposed standalone as `pnpm sitemap`. (Audit 4.2)
- `public/robots.txt` now has `Disallow: /admin` and points `Sitemap:` at the corrected domain. (Audit 4.1)

## On-page technical fixes

- `application/app/pages/Home.tsx`: the hero masthead ("MUTIS" / "Finance Society") is now a real `<h1>` instead of a `<div>` — the homepage previously had no `<h1>` at all. Verified against `mutis-base.css` that all relevant styling is class-selector-based with no tag-name dependency, so the letter-reveal animation is unaffected. (Audit 5.1)
- `application/app/pages/Events.tsx`: the upcoming-event card thumbnail and the event-details modal's cover image now use `alt={ev.title}` instead of `alt=""` (they're the event's own content image, not decorative), and both got explicit `width`/`height` attributes matching their CSS `aspect-ratio: 16/9`. (Audit 5.2, 5.3)
- `index.html`: added `<link rel="preconnect">` for `fonts.googleapis.com` and `fonts.gstatic.com`, ahead of `fonts.css`'s render-blocking `@import` of 8 Google Font families. (Audit 5.5)

## Access control

- Deleted the 20 `/admin/__preview-*` routes from `application/app/routes.tsx`. These were direct, unauthenticated children of `/admin` rendering the exact same admin CRUD pages (Dashboard, Sponsors, Committee, Events, Articles, Documents, Site Settings, etc.) as the real `/admin/*` tree, but with no `ProtectedRoute` wrapper — anyone with the URL could reach live admin panel pages without signing in. Flagged in `SEO-AUDIT.md`/`SEO-PLAN.md` as an access-control issue adjacent to (not caused by) the SEO work, then removed on request. `/admin/login` and `/admin/set-password` are untouched; the authenticated tree under `ProtectedRoute`/`AdminLayout` is untouched.

## Documentation

- Updated `SEO.md` (the repo's existing implementation reference, distinct from the three audit/plan/changelog docs) to describe the new `react-helmet-async`-based architecture, the domain, and the tag-duplication gotcha documented above, instead of the old hand-rolled hook it previously described.

## Deliberately not changed in this sweep

See `SEO-AUDIT.md` for the full reasoning; in short: full SSR/prerendering (an architectural decision, not a drop-in fix), a `BreadcrumbList` schema (low value relative to cost given shallow site navigation), converting the homepage's CSS hero background to a real `<img>`, the `@import`→`<link>` font-loading rewrite, `public/headshots/*` (legacy status unconfirmed), favicon/touch-icon rework, and the stray `vercel.json`.

## Verification performed

- `pnpm exec tsc --noEmit` — clean, no errors.
- `pnpm build` — succeeds; `dist/robots.txt`, `dist/sitemap.xml`, and `dist/index.html` all carry the corrected domain and new tags.
- `node scripts/generate-sitemap.mjs` run standalone — degrades gracefully without Supabase credentials (this sandbox has none), correctly emits all 15 static routes.
- Ran the dev server with dummy Supabase credentials and drove it with a headless Chromium (Playwright) across `/`, `/team`, `/events`, `/articles`, `/gallery`, a nonexistent route, `/alumni`, and `/articles/:fake-id`, checking `document.title`, canonical/description/og:image tag *counts* (to catch duplication), `robots` content, `<h1>` count, and JSON-LD presence on each. This is what caught the tag-duplication bug described above and confirmed the fix — every route ended up with exactly one canonical/description/og:image tag, correct per-route titles, and `noindex` correctly applied to the 404 and article-error states.
- **Not verified** (no internet egress in this sandbox — see the caveat at the top of `SEO-AUDIT.md`): the live site, real Supabase-backed data (Event JSON-LD content, dynamic sitemap article URLs, a successful `ArticleDetail` render), Lighthouse, or any social-share debugger.

## Manual Steps Required

Everything below needs the site owner — credentials, DNS, content decisions, or an architectural call this sweep deliberately didn't make. (Full detail in `SEO-PLAN.md` section (b).)

1. Set up the `mutis.co.uk` → `https://www.mutisfinancesociety.com` redirect at the DNS/registrar level.
2. Verify `mutisfinancesociety.com` in Google Search Console (and Bing Webmaster Tools), then submit the corrected `sitemap.xml` once deployed.
3. Set up GA4 (or confirm an existing analytics setup) — none was found in the codebase.
4. Design a real 1200×630 Open Graph image to replace the square logo currently used as the social-share fallback.
5. Confirm whether `public/headshots/*` is still referenced anywhere or safe to delete/replace (one file, `Anthony.jpeg`, is a 1.8MB outlier).
6. Decide whether to invest in SSR/prerendering — the single highest-leverage remaining SEO fix, but a multi-week engineering decision outside this sweep's scope.
7. ~~Review the unauthenticated `/admin/__preview-*` routes found during this audit~~ — **done**: these 20 routes rendered admin CRUD pages with no `ProtectedRoute` check at all, so they've been deleted from `application/app/routes.tsx` outright rather than just flagged. This was an access-control issue, not strictly an SEO one, but it was surfaced by this audit and directly addressed by `robots.txt`'s new `Disallow: /admin` — there's no longer anything unauthenticated left under `/admin` for that disallow to be a fig leaf for.
8. ~~Confirm the actual deploy target~~ — **done**: confirmed Vercel; the unused second-host config and redirects file have been removed.
9. Update `supabase/functions/admin-add-by-email/index.ts`'s `SITE_URL` to the corrected domain and redeploy that Edge Function.
10. Periodically spot-check sponsor/committee/document links via the admin panel — they're Supabase-driven content, not code, so a broken link there wouldn't show up in a codebase audit.
11. Once deployed: run Lighthouse (mobile + desktop) on `/` and `/events`, and check a few shared links in the Facebook Sharing Debugger / Twitter Card Validator.
