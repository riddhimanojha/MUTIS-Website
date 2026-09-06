# MUTIS Backend: Supabase + Bespoke Admin Panel — Planning Document

## Context

The MUTIS site ([README.md](../../../Users/denial/Desktop/MUTIS/README.md)) is a fully static React/Vite SPA on Netlify. Despite a stale README claim, there is no Supabase backend today — confirmed by a full repo and git-history search: zero Supabase references anywhere. All content (sponsors, team, events, alumni, articles) is hardcoded in TypeScript, mostly in `application/app/data/siteData.ts` plus inline arrays inside individual page components. `Articles.tsx` exists as a page but has no real content — it's an empty array with a "coming soon" state. There is no database and no admin panel, so every content update today requires a developer to edit code and redeploy.

The decision has been made to build a custom backend on **Supabase (Postgres + Auth + Storage)** with a bespoke admin panel for non-technical committee members, so the committee can manage sponsors, team/alumni, events, and articles — plus review form submissions — without touching code. This document is **planning and schema design only**: no code, no migrations, no repo changes. It is meant to be reviewed and then used as the spec for a future, separate implementation effort.

This plan does not re-litigate the CMS-vs-custom-backend choice (already decided) or re-compare Strapi/Directus/git-based options (explicitly out of scope).

---

## Phase 1: Dynamic Content Audit

Every page/component file reviewed, classified as **Convert**, **Stays static**, or **Ambiguous**.

### Convert to database-driven

| Content | File | What currently hardcodes it | Frontend-level change |
|---|---|---|---|
| Sponsor tiers & firms | [siteData.ts:37-88](../../../Users/denial/Desktop/MUTIS/application/app/data/siteData.ts#L37-L88) (`sponsors` array, `LOCAL_LOGOS` map) | Two hardcoded tiers (Gold/Silver), each firm an object with name/logo/vacanciesUrl; logos imported as local files via `new URL(...)` | Sponsors page fetches published sponsors from the DB instead of importing the array; logo becomes a Storage-hosted or externally-linked URL instead of a bundled local asset |
| Sponsor role badges | [Sponsors.tsx:20-49](../../../Users/denial/Desktop/MUTIS/application/app/pages/Sponsors.tsx#L20-L49) (`FIRM_ROLE`, `TIER_LABEL` maps) | Lookup tables keyed by exact sponsor-name string — fragile, silently falls back to "Partner"/generic label on any mismatch | Role/tier label becomes a real column on the sponsor row, edited directly per-firm in the admin panel; no more name-keyed lookup |
| Past sponsors | [Sponsors.tsx:86-89](../../../Users/denial/Desktop/MUTIS/application/app/pages/Sponsors.tsx#L86-L89) (`PAST_SPONSORS`, currently empty) | Hardcoded empty array with a "coming soon" fallback state | Becomes a filter on the same sponsors table (a `past` tier value) rather than a separate array |
| Committee roster | [Team.tsx:25-62](../../../Users/denial/Desktop/MUTIS/application/app/pages/Team.tsx#L25-L62) (`FALLBACK_COMMITTEE`) | Hardcoded array already shaped like a DB row (`id`, `display_order`, `created_at`) | Team page fetches ordered, active committee members from the DB; admin panel gets an "add/edit/reorder committee member" screen |
| Alumni / placements directory | [OurNetwork.tsx:21-35](../../../Users/denial/Desktop/MUTIS/application/app/pages/OurNetwork.tsx#L21-L35) (`NETWORK_MEMBERS`, currently empty) | Hardcoded array; role/firm/location filter dropdowns are derived from the array itself at render time | Network page fetches published alumni rows; filter dropdowns still derive their options from the fetched data (no logic change there), just from a DB query instead of a local array |
| Previous presidents | [PreviousPresidents.tsx:14-26](../../../Users/denial/Desktop/MUTIS/application/app/pages/PreviousPresidents.tsx#L14-L26) | Hardcoded array, mostly "Name TBC" placeholders today | Becomes a DB-backed historical record the committee can fill in over time instead of editing code each year |
| Recurring industry events | [siteData.ts:12-35](../../../Users/denial/Desktop/MUTIS/application/app/data/siteData.ts#L12-L35) (`industryEvents`) | Hardcoded array; `date` is a vague free-text string like `"Termly"` | Events page fetches published, date-ordered events; the vague `"Termly"` text field is replaced by a real timestamp, which also unlocks event signup (see below) |
| Article content | [Articles.tsx:11-21](../../../Users/denial/Desktop/MUTIS/application/app/pages/Articles.tsx#L11-L21) (`ARTICLES`, currently empty) | Empty typed array, no CMS/workflow exists at all | Articles page fetches published articles from the DB; a fresh draft/published workflow is introduced (nothing to preserve — designed new in Phase 2) |
| Contact form submissions | [Contact.tsx](../../../Users/denial/Desktop/MUTIS/application/app/pages/Contact.tsx) | Currently posts to Netlify Forms | Form posts to Supabase instead of Netlify; committee reviews submissions in the admin panel instead of the Netlify dashboard |
| Sponsorship enquiry submissions | [Sponsors.tsx:129-163](../../../Users/denial/Desktop/MUTIS/application/app/pages/Sponsors.tsx#L129-L163) | Currently posts to Netlify Forms | Same change as above |
| Event signup | *(does not exist yet)* | Nothing today — only a post-event feedback form exists (see Ambiguous, below) | New form component on the Events/event-detail page; only shown when an event has `signup_enabled = true` |

### Stays static

| Content | File | One-line reason |
|---|---|---|
| Home page hero, "What We Do", flagship events section, sponsor logo marquee, final CTA | [Home.tsx](../../../Users/denial/Desktop/MUTIS/application/app/pages/Home.tsx) (`Hero`, `WhatWeDo`/`PROGRAMS`, `EventsSection`/`EVENTS`, `SponsorsStrip`, `FinalCTA`) | Copy is fused to per-index stagger animation timing (`i * 0.1s` delays) and a grid CSS tuned for an exact array length — resizing the array without a developer risks breaking the animation/layout |
| Flagship events cards | [Events.tsx:5-9](../../../Users/denial/Desktop/MUTIS/application/app/pages/Events.tsx#L5-L9) (`FLAGSHIP`) | Fixed 3-card layout with bespoke copy that changes rarely; same "array length is load-bearing for layout" issue as Home |
| Sponsor/photo marquee "duplicate array for seamless scroll" mechanism | [Sponsors.tsx:277](../../../Users/denial/Desktop/MUTIS/application/app/pages/Sponsors.tsx#L277), [Events.tsx:86](../../../Users/denial/Desktop/MUTIS/application/app/pages/Events.tsx#L86), [Home.tsx:405](../../../Users/denial/Desktop/MUTIS/application/app/pages/Home.tsx#L405) | The looping/duplication trick is glue code, not content — the underlying images can come from the DB, but the marquee mechanism itself stays in the component |
| Image-fallback-to-initials logic | [Team.tsx:64-95](../../../Users/denial/Desktop/MUTIS/application/app/pages/Team.tsx#L64-L95), [Sponsors.tsx:101-122](../../../Users/denial/Desktop/MUTIS/application/app/pages/Sponsors.tsx#L101-L122) | Presentation logic (image `onError` handling), not content — stays in code regardless of data source |
| Build-time event photo gallery | [Sponsors.tsx:7-14](../../../Users/denial/Desktop/MUTIS/application/app/pages/Sponsors.tsx#L7-L14), [Events.tsx:11-18](../../../Users/denial/Desktop/MUTIS/application/app/pages/Events.tsx#L11-L18), commented-out block in [Gallery.tsx:8-14](../../../Users/denial/Desktop/MUTIS/application/app/pages/Gallery.tsx#L8-L14) | Uses `import.meta.glob` to scan the filesystem at *build time*, not runtime — out of scope for this backend effort; converting it to a real media library is a separate, later decision |
| MEIF sector teams | [siteData.ts:98-153](../../../Users/denial/Desktop/MUTIS/application/app/data/siteData.ts#L98-L153) (`meifTeams`) | Not in the agreed scope (sponsors/team/alumni/events/articles only); changes rarely enough that a DB table isn't justified yet |
| Home-page stats strip | [siteData.ts:6-10](../../../Users/denial/Desktop/MUTIS/application/app/data/siteData.ts#L6-L10), duplicated inline in [Home.tsx:150-159](../../../Users/denial/Desktop/MUTIS/application/app/pages/Home.tsx#L150-L159) & [168-173](../../../Users/denial/Desktop/MUTIS/application/app/pages/Home.tsx#L168-L173) | Out of scope; three numbers, changes a couple times a year, not worth an admin UI |
| Routing shell, header/footer nav, SEO meta hook | [routes.tsx](../../../Users/denial/Desktop/MUTIS/application/app/routes.tsx), [Header.tsx](../../../Users/denial/Desktop/MUTIS/application/app/components/Header.tsx), [Footer.tsx](../../../Users/denial/Desktop/MUTIS/application/app/components/Footer.tsx) | App shell/navigation, not content |
| Attendance/feedback form | [Attendance.tsx](../../../Users/denial/Desktop/MUTIS/application/app/pages/Attendance.tsx) | Not in the agreed scope (only contact, sponsorship enquiry, and event signup were requested); this is a *post*-event feedback form, distinct from the new event-signup table below — convert later using the identical pattern if wanted |
| Media hub, Gallery, Recordings, Podcast pages | [Media.tsx](../../../Users/denial/Desktop/MUTIS/application/app/pages/Media.tsx), [Gallery.tsx](../../../Users/denial/Desktop/MUTIS/application/app/pages/Gallery.tsx), [Recordings.tsx](../../../Users/denial/Desktop/MUTIS/application/app/pages/Recordings.tsx), [Podcast.tsx](../../../Users/denial/Desktop/MUTIS/application/app/pages/Podcast.tsx) | All currently empty/placeholder ("coming soon"); out of agreed scope |
| Past Speakers | [PastSpeakers.tsx:20-22](../../../Users/denial/Desktop/MUTIS/application/app/pages/PastSpeakers.tsx#L20-L22) | Currently empty, out of agreed scope; same shape as alumni/team if converted later |
| About page prose, MEIF fund description | [About.tsx](../../../Users/denial/Desktop/MUTIS/application/app/pages/About.tsx), [MEIF.tsx](../../../Users/denial/Desktop/MUTIS/application/app/pages/MEIF.tsx) | Long-form prose fused directly into page layout (split-text sections); out of agreed scope, and the founding-year discrepancy noted in the code ([About.tsx:47-50](../../../Users/denial/Desktop/MUTIS/application/app/pages/About.tsx#L47-L50)) is an editorial fact to resolve, not something a DB fixes |

### Ambiguous

| Content | Tradeoff |
|---|---|
| `flagshipSupporters` ([siteData.ts:93-95](../../../Users/denial/Desktop/MUTIS/application/app/data/siteData.ts#L93-L95), currently just "Shade Tree") | Shares the exact shape of a sponsor row but isn't a sponsorship tier. **Decision (user confirmed): leave out of scope for now** — stays hardcoded, revisit if the list grows. |
| `PastSponsors.tsx` | This entire page/route is **orphaned dead code** — it duplicates `PAST_SPONSORS` from `Sponsors.tsx` verbatim but is never registered in [routes.tsx](../../../Users/denial/Desktop/MUTIS/application/app/routes.tsx), so it isn't reachable on the live site at all. Flagging for deletion during migration rather than converting it — converting dead code would be wasted scope. |
| `Alumni.tsx` route | Just a redirect to `/network` ([Alumni.tsx:3-5](../../../Users/denial/Desktop/MUTIS/application/app/pages/Alumni.tsx#L3-L5)) — no content of its own, nothing to convert. |

### Current state of the contact/signup forms

**Functional, not broken.** All three existing forms (contact, sponsorship enquiry, attendance) are correctly wired to Netlify Forms:
- Each page posts URL-encoded data via `fetch("/", { method: "POST", ... })` with a matching `form-name` field ([Contact.tsx:44-49](../../../Users/denial/Desktop/MUTIS/application/app/pages/Contact.tsx#L44-L49), [Sponsors.tsx:150-155](../../../Users/denial/Desktop/MUTIS/application/app/pages/Sponsors.tsx#L150-L155), [Attendance.tsx:53-58](../../../Users/denial/Desktop/MUTIS/application/app/pages/Attendance.tsx#L53-L58)).
- [index.html:40-73](../../../Users/denial/Desktop/MUTIS/index.html#L40-L73) contains a hidden static `<form>` for all three (`contact`, `sponsorship`, `attendance`), each with field names matching the live React forms exactly — this is required for Netlify's build bot to detect and register the forms, since it can't parse JSX. All three are correctly registered; none are missing.
- Each has a honeypot field (`bot-field`) for basic spam filtering.
- Confirmed in [DEPLOYMENT.md:35-44](../../../Users/denial/Desktop/MUTIS/DEPLOYMENT.md#L35-L44): submissions land in the Netlify dashboard → Forms, with optional email/Slack notification. This only works on Netlify — a known, documented limitation, not a bug.

This is the baseline being replaced for **contact** and **sponsorship enquiry** by Supabase tables in Phase 2 below. **Event signup** is new — nothing to preserve, nothing currently broken to fix.

---

## Phase 2: Database Schema

10 tables total: 6 content tables (sponsors, committee_members, alumni, presidents, events, articles), 1 auth-support table (admin_users), 3 form tables (contact_submissions, sponsorship_enquiries, event_signups).

### 1. Sponsors

```sql
create table public.sponsors (
  id            uuid primary key default gen_random_uuid(),
  name          text not null,
  tier          text not null check (tier in ('gold','silver','past')),
  logo_url      text,
  link_url      text,
  role_label    text,
  years_active  text,
  is_published  boolean not null default true,
  display_order integer not null default 0,
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now(),
  unique (name, tier)
);
```

**Plain language:** One table holds current sponsors (gold/silver) and past sponsors (`tier = 'past'`) — no more separate arrays or duplicated pages. `role_label` replaces the old hardcoded "UBS → Spring Insight" style lookup: it's now just a text field an admin fills in per sponsor, so a typo in a firm's name can never silently break its badge the way it can today. `is_published` lets an admin stage a sponsor before it goes live (e.g. finalize a deal before announcing it). `display_order` controls the order sponsors appear in on the page.

### 2. Team / Alumni / Presidents — three tables, not one

**Recommendation: keep these as three separate tables**, even though they look similar (name, headshot, LinkedIn). The fields that actually matter differ enough that merging them into one table with a "type" switch would just move the complexity into one confusing admin form instead of three simple ones:

| | committee | alumni | presidents |
|---|---|---|---|
| what's required that isn't shared | `display_order` (controls the grid) | `firm`, `cohort` (drives the filter dropdowns) | `year_label`/`start_year` |
| sensitivity | low — self-selected, currently-serving members | **high** — named former members + their employer; code already warns "do not publish without consent" | low — historical record |

```sql
create table public.committee_members (
  id            uuid primary key default gen_random_uuid(),
  name          text not null,
  role          text not null,
  headshot_url  text,
  linkedin_url  text,
  display_order integer not null default 0,
  is_active     boolean not null default true,
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now()
);
```
No `initials` column — both `Team.tsx` and `Sponsors.tsx` already derive a fallback monogram from the name client-side when there's no photo, so storing it separately is one more field an admin would have to remember to fill in for no real benefit. Easy to add back later if the committee wants to manually override a specific name's initials.

```sql
create table public.alumni (
  id                uuid primary key default gen_random_uuid(),
  name              text not null,
  firm              text not null,
  role              text not null,
  cohort            text not null,
  location          text,
  linkedin_url      text,
  headshot_url      text,
  consent_confirmed boolean not null default false,
  is_published      boolean not null default false,
  created_at        timestamptz not null default now(),
  updated_at        timestamptz not null default now(),
  check (not is_published or consent_confirmed)
);
```
**Plain language:** This is the one table where "published" defaults to **off**, not on, and the database itself refuses to let a row go public unless `consent_confirmed` is ticked first. That's a direct response to the code comment already in `OurNetwork.tsx`: alumni data is a named person plus their employer, which is more sensitive than a current committee member's self-submitted info — so the safety check is enforced by the database, not left as something an admin has to remember.

```sql
create table public.presidents (
  id            uuid primary key default gen_random_uuid(),
  year_label    text not null,
  start_year    integer not null,
  name          text not null,
  notes         text,
  headshot_url  text,
  linkedin_url  text,
  is_published  boolean not null default true,
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now()
);
```
**Plain language:** `year_label` is the text shown on the page (e.g. "2025–2026" or "Est. 2008"); `start_year` is a plain number (2025, 2008) used only for sorting, since "Est. 2008" doesn't sort correctly next to "2019–2020" as text.

### 3. Events

```sql
create table public.events (
  id              uuid primary key default gen_random_uuid(),
  title           text not null,
  description     text not null,
  location        text not null,
  starts_at       timestamptz not null,
  ends_at         timestamptz,
  cover_image_url text,
  capacity        integer,
  signup_enabled  boolean not null default false,
  is_published    boolean not null default true,
  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now()
);
```
**Plain language:** Today's vague `"Termly"` date text becomes a real date/time (`starts_at`). This isn't optional — event signup needs to know exactly *which occurrence* someone is registering for, and a free-text field like "Termly" can't support that. `signup_enabled` is a simple on/off switch per event: some events (e.g. informational partner sessions) don't need a signup form at all, so the page only shows one when this is turned on. `capacity` is optional — leave blank for unlimited.

*Home page's `FLAGSHIP` array and Home's hardcoded `EVENTS` stay static, as decided in Phase 1 — only the recurring `industryEvents`-style list converts.*

### 4. Articles — fresh design, nothing to preserve

```sql
create table public.articles (
  id              uuid primary key default gen_random_uuid(),
  tag             text not null,
  title           text not null,
  author_id       uuid references auth.users(id) on delete set null,
  author_name     text not null,
  cover_image_url text,
  body_markdown   text,
  pdf_url         text,
  status          text not null default 'draft' check (status in ('draft','published')),
  published_at    timestamptz,
  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now(),
  check (body_markdown is not null or pdf_url is not null)
);
```
**Plain language / decisions made:**
- **Draft/published workflow**: `status` starts as `'draft'` for every new article. An admin flips it to `'published'` when ready, and the admin panel sets `published_at` to the current time at that exact moment (handled by the app, not a database trigger — kept simple on purpose).
- **`author_id` is nullable, with `author_name` stored separately** as a plain-text snapshot of the writer's name at publish time. Reason: the committee turns over completely every year, and if an article were permanently tied to an author's login account, deleting that graduated student's account could either be blocked or silently break the article's byline. Storing the name as text means the byline survives forever regardless of what happens to the account later.
- **Article body is Markdown text, not a rich-text/HTML editor.** Two reasons: it's simpler to build a "Manage Articles" screen around a text box + preview than a full rich-text editor, and — more importantly — it avoids a real security risk. If admins could submit raw HTML that gets rendered directly on the public site, that's an opening for a malicious or careless paste to inject a script into the page (a "stored XSS" vulnerability). Markdown avoids that risk entirely.
- **`pdf_url` exists alongside the markdown body**, not instead of it, matching the current `Articles.tsx` type which already only supports linking to a hosted PDF. An article can be a normal web post (`body_markdown` filled in), a link to a formatted PDF research note (`pdf_url` filled in), or both — the database just requires at least one to be present.

### 5. Form submission tables

```sql
create table public.contact_submissions (
  id         uuid primary key default gen_random_uuid(),
  name       text not null,
  email      text not null,
  reason     text not null,
  message    text not null,
  status     text not null default 'new' check (status in ('new','read','archived')),
  created_at timestamptz not null default now()
);

create table public.sponsorship_enquiries (
  id         uuid primary key default gen_random_uuid(),
  company    text not null,
  name       text not null,
  email      text not null,
  message    text not null,
  status     text not null default 'new' check (status in ('new','read','archived')),
  created_at timestamptz not null default now()
);

create table public.event_signups (
  id         uuid primary key default gen_random_uuid(),
  event_id   uuid not null references public.events(id) on delete cascade,
  name       text not null,
  email      text not null,
  notes      text,
  status     text not null default 'confirmed' check (status in ('confirmed','cancelled')),
  created_at timestamptz not null default now(),
  unique (event_id, email)
);
```
**Plain language:**
- `status` on the two enquiry tables lets an admin mark a submission as read/archived once handled, so the inbox is manageable — this mirrors what the Netlify Forms dashboard already does informally today.
- `contact_submissions.reason` is deliberately **not** locked to the current 5 dropdown options at the database level — that dropdown's wording is just UI copy likely to be tweaked year to year, and this field never drives any access rule or logic, so pinning it in the database would only create friction (a migration every time the wording changes) for no real benefit. The options list lives in the frontend dropdown only.
- `event_signups` has a uniqueness rule preventing the same email from registering for the same event twice by accident.
- **Known, accepted gap**: moving these three forms off Netlify Forms and onto direct Supabase inserts drops Netlify's built-in spam filtering. As agreed, this plan keeps the existing honeypot field client-side and **documents this as a future hardening step** (a thin rate-limiting function in front of the inserts) rather than building it now.
- The existing **Attendance/feedback form** is out of scope per Phase 1, but if converted later it should follow this exact same pattern (public insert, admin-only read).

### 6. Image / logo / photo storage

**One shared Supabase Storage bucket (e.g. `media`), folder-organized (`sponsors/`, `headshots/`, `events/`, `articles/`) — no separate media/asset table.**

**Plain language:**
- Every logo, headshot, and cover image belongs to exactly one row in one table (a sponsor's logo, a committee member's headshot). There's no case here where the same file needs to be shared across many rows or tracked with its own extra metadata — so a separate "media library" table would just add a lookup step for no real benefit. Instead, each table simply has a plain text column (`logo_url`, `headshot_url`, `cover_image_url`) holding the final, ready-to-use image address.
- That address can be either a file the admin uploaded to Supabase Storage, or a link to an image hosted elsewhere (e.g. a firm's own logo URL) — one text field handles both identically.
- One bucket is used for everything (not one bucket per content type) because every one of these images has the exact same access rule: anyone can view it, only admins can upload/replace it. Splitting into multiple buckets would mean maintaining several near-identical access rules for zero actual security gain.
- **A limitation worth knowing, not solving**: making the bucket public means a file is reachable by its direct link even if the database row it belongs to is currently unpublished (e.g. a draft article's cover image). For logos, headshots, and event photos this doesn't matter — none of it is sensitive. The one habit worth keeping: don't upload a draft article's files until the moment it's actually published, so there's nothing exposed by a guessed URl during the draft period.

### 7. RLS policies — plain-language rules, per table

Every table has **Row Level Security (RLS) turned on**. RLS is Postgres's built-in gatekeeper: without it, whoever holds the site's public API key could potentially read or write any row directly; with it, each table has explicit rules for who can do what, and everything not explicitly allowed is denied by default.

**The core mechanism — one small "admin_users" table:**

```sql
create table public.admin_users (
  user_id    uuid primary key references auth.users(id) on delete cascade,
  email      text not null,
  full_name  text,
  added_by   uuid references auth.users(id),
  added_at   timestamptz not null default now()
);

create function public.is_admin() returns boolean
language sql security definer stable as $$
  select exists (select 1 from public.admin_users where user_id = auth.uid());
$$;
```

**Plain language:** `admin_users` is simply a list of "who currently has admin rights" — one row per committee member with access. `is_admin()` is a small reusable check ("is the person making this request in that list?") that every other table's rules refer to, so the rule is written once and reused everywhere instead of copy-pasted ~20 times across ~7 tables (which would risk one copy quietly drifting out of sync). This was chosen over two alternatives:
- *Baking "admin" into a login token* — rejected because a revoked admin's existing login would keep working until it naturally expires, which doesn't suit a committee that wants access cut off immediately at handover.
- *Managing access purely through the Supabase dashboard* — rejected because it requires dashboard access for every add/remove, rather than a simple in-app "Manage Admins" screen a non-technical committee member can use.

**Policy pattern for content tables** (sponsors, committee_members, alumni, presidents, events, articles):
```sql
alter table public.sponsors enable row level security;

create policy "public read published" on public.sponsors
  for select using (is_published = true);

create policy "admin read all" on public.sponsors
  for select using (public.is_admin());

create policy "admin write" on public.sponsors
  for all using (public.is_admin()) with check (public.is_admin());
```
**Plain language:** Anyone visiting the site can read *published* rows only. Anyone logged in as an admin can read *everything*, including drafts/unpublished rows, so they can preview before publishing. Only admins can create, edit, or delete rows at all. (For `articles`, "published" is checked via `status = 'published'` rather than a boolean.)

**Policy pattern for the 3 form tables** (contact_submissions, sponsorship_enquiries, event_signups):
```sql
alter table public.contact_submissions enable row level security;

create policy "public can submit" on public.contact_submissions
  for insert to anon, authenticated with check (true);

create policy "admin can read" on public.contact_submissions
  for select using (public.is_admin());

create policy "admin can update" on public.contact_submissions
  for update using (public.is_admin()) with check (public.is_admin());

create policy "admin can delete" on public.contact_submissions
  for delete using (public.is_admin());
```
**Plain language:** Anyone (including an anonymous website visitor, since they're not logged in) can *submit* a new form entry — but critically, **nobody except an admin can read the submissions back**, not even the person who just submitted one. That matches how the forms behave today: after submitting, the visitor just sees a local "Thanks, we got it" message on the page — the code never reads the row back — so there's no legitimate reason to allow public read access here at all. This is the exact spot a mistake is easy to make (e.g. adding a "let them view their own submission" rule and forgetting to remove it later); this design deliberately has no such rule on any of the three form tables.

**Non-negotiable rules that apply to every table, not just some:**
- RLS must be turned on for **all ten tables**, including `admin_users` and the form tables — a single forgotten table defeats the entire model, since Supabase's public API otherwise defaults to allowing access and relies entirely on these rules to restrict it.
- The website's frontend must only ever use Supabase's public **anon key**, never the **service_role key** (which bypasses every rule above completely) — the service_role key should never appear in any file that ships to a browser.
- Hiding an "Admin" link in the navigation for non-admins is fine for a tidy user experience, but it is not real security — the actual protection is entirely the database rules above, since anyone could still talk to Supabase directly.

### 8. Supabase Auth setup & annual handover

Two separate things need to be kept distinct, because conflating them is the biggest real risk in a project with 100% annual turnover:

1. **The Supabase project's own owner login** (the account with billing and full dashboard access) — this is the one true single point of failure.
2. **Rows in the `admin_users` table** — this is what actually rotates every year, and is low-stakes to get wrong (easy to fix either way).

**Recommendation:** Tie #1 to a durable, shared identity the society already controls — its role email (e.g. `mutis@manchesterstudentsunion.com`) — never one graduating student's personal account. Store its password wherever the society already keeps its Instagram/banking-equivalent credentials, not in one person's memory.

**Concrete annual handover steps:**
1. Before handover, each incoming committee member creates their own ordinary account on the site's admin login page (self-serve, just an email/password).
2. At the handover meeting, a current admin opens the "Manage Admins" screen in the panel and adds each incoming member's account.
3. Run a short overlap period (a couple of weeks) where outgoing and incoming members both have access, so the new team can actually try adding an event or editing a sponsor while someone experienced is still reachable.
4. Once the new team is comfortable, remove the outgoing members from `admin_users`. This instantly cuts off their ability to write anything — no separate "logging them out" step is needed, since a logged-in account that isn't in `admin_users` has no special access at all under this design.
5. The durable project-owner login (#1) never changes hands with the committee — it exists purely as a fallback (e.g. if `admin_users` is ever accidentally emptied out with no one left to re-add anyone, whoever holds that login can add the first row back directly through the Supabase dashboard).
6. One committee role each year (e.g. whichever Co-President "owns" the website) is responsible for actually doing steps 2 and 4 at handover — a short, non-technical task, just one that needs to actually happen.

---

## Migration order recommendation

Build and migrate **one content type at a time**, not the whole schema and admin panel in one pass — each phase below is independently useful and independently testable before moving to the next.

1. **Sponsors first.** Smallest, cleanest schema (one table, no relationships to anything else), directly fixes a real live bug (the `FIRM_ROLE` name-keyed lookup), and gives the committee an immediately visible, low-risk win to validate the whole admin-panel pattern (login → edit → publish → see it live) before anything more sensitive is involved.
2. **Committee/team next.** Still a single table, no cross-table relationships, and reuses everything learned building the sponsors admin screen (image upload, publish toggle, ordering).
3. **Events third.** Introduces the one real complexity increase — a genuine date/time field replacing free text — but still no dependency on anything not yet built.
4. **Event signup, immediately after events**, since it depends on the `events` table existing first (a signup always references a specific event) and is the first form to be moved off Netlify.
5. **Contact + sponsorship enquiry forms**, once the admin panel already has a working "review submissions" pattern from event signups to extend, rather than building that pattern three times independently.
6. **Alumni last, deliberately**, *after* the team is comfortable with the basic publish/unpublish flow from steps 1-2 — because alumni also requires understanding and correctly using the consent-gated publish rule (`is_published` can't be `true` without `consent_confirmed`), which is worth introducing once the simpler pattern is already second nature, not on day one.
7. **Articles last overall.** It has no existing content to migrate (starting from zero), the most novel workflow (draft/published, markdown body vs. PDF link), and is the least time-sensitive — nothing on the live site breaks by leaving `Articles.tsx` exactly as it is today until everything else is stable.

This document ends here — it stops at the point of implementation. Building the tables, RLS policies, Storage buckets, and the admin panel itself is future, separately-scoped work.
