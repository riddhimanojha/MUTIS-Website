# MUTIS Admin Dashboard — Plan

This is a planning document only. No component code is included. It is meant to be reviewed and then used as the spec for a future, separate implementation effort — the same relationship `BackendPlan.md` has to the database schema it describes.

## How this was researched

- Read `BackendPlan.md` in full (schema design, RLS policy design, storage design, auth/handover reasoning).
- Audited `supabase/migrations/` against the actual live database (via Supabase MCP tools: `list_tables`, `execute_sql`, `list_storage_buckets`, `get_advisors`) — the migration files and the live schema mostly match, with one gap: `sponsors`, `admin_users`, `is_admin()`, and the `sponsor_logos` storage bucket were created directly against the database (dashboard/SQL editor) on 2026-07-31, before migration tracking started, and have no corresponding migration file. They exist and work; it's a reproducibility gap, not a missing feature.
- Audited the frontend (`application/app/pages/*`, `routes.tsx`, `lib/database.types.ts`, `lib/supabase.ts`) — every public content page (Team, Events, Sponsors, Our Network, Previous Presidents, Articles, Article Detail) already reads live from Supabase, and the Contact and Sponsorship Enquiry forms already write to Supabase tables. **Nothing admin-related exists yet**: no `/admin` route, no login page, no auth hook, no protected route, no shared table/form components.
- Queried the live database directly for row counts and RLS policy definitions, which surfaced two concrete, currently-blocking gaps (see Open Questions and Phase 0 below): `admin_users` has **zero rows** (nobody can be recognised as an admin yet), and the `sponsor_logos` storage bucket has **no write policy** on `storage.objects` (uploads would silently fail for everyone, including a future admin).
- Three product decisions were confirmed with the committee stakeholder before finalising this plan: a **brand-lite utilitarian** visual style for the admin UI (reuse the site's navy/cyan tokens and typefaces as accents, but a dense, functional dashboard layout — no cinematic motion, glow, or film-grain from the public site); **flat authorisation** (every admin has identical privileges, no role tiers); and an **`audit_log` table** recording full write history, justified by the committee's 100% annual turnover.

---

## 1. Open Questions

Two items that might look like open questions are **not** listed here, because they're already decided, concrete action items rather than decisions still needed — see Phase 0 of the Build Order: bootstrapping the first `admin_users` row, and fixing the missing `sponsor_logos` write policy.

| # | Question | Why it matters |
|---|---|---|
| 1 | **Audit log capture mechanism**: an app-side `useAdminMutation` wrapper (every admin write goes through one hook that also logs it) vs. a Postgres trigger on each of the 7 content tables. The wrapper is simpler and consistent with how the rest of this codebase is built, but silently misses any write that bypasses it (a bug, a future page that forgets to call it, a direct dashboard edit). A trigger is airtight but is genuinely new infrastructure. |
| 2 | **Exact `audit_log` schema.** Proposed: `id, actor_user_id, actor_email (snapshot), table_name, row_id, action (insert/update/delete), diff (jsonb, nullable), created_at`. Confirm whether a full before/after row snapshot is wanted (richer history, more storage) or just the names of changed fields (cheaper, less useful for "what did this used to say"). |
| 3 | **`articles.published_at`** — `BackendPlan.md` deliberately keeps this app-set-the-instant-status-flips rather than a DB trigger, "kept simple on purpose." Confirm that stance still holds now that a trigger is being considered anyway for the audit log (Q1) — reusing it here would be a two-line addition, or the inconsistency can stand deliberately. |
| 4 | **`contact_submissions.reason`** has no DB enum — it's freeform text typed by the public visitor. Does the admin inbox need fixed filter categories (which would mean also constraining the public Contact form's dropdown, outside this plan's scope), or is a text search across `reason`/`message` enough for triage? |
| 5 | **Upload vs. paste-a-link fields** (`sponsors.logo_url`, `articles.cover_image_url`, `articles.pdf_url`) were explicitly designed in `BackendPlan.md` to accept either an uploaded file or a link to something hosted elsewhere. Should the form show both an upload control and a raw URL field side by side, or default to upload-only with a "paste a link instead" toggle? |
| 6 | **No storage bucket is scoped for article PDFs.** The six live buckets are `sponsor_logos`, `committee_photos`, `event_photos`, `alumni_photos`, `article_covers`, `president_photos` — none for PDFs. Keep `pdf_url` paste-a-link-only (e.g. a Google Drive link), or add upload support? |
| 7 | **Spam/rate-limiting hardening** for the three public-insert tables (`contact_submissions`, `sponsorship_enquiries`, `event_signups`) — `BackendPlan.md` already flagged the loss of Netlify's built-in spam filtering as a known, accepted gap with a documented future fix (a thin rate-limiting function). Does that hardening need to land before or shortly after this admin panel ships, since the inbox is what will actually surface any spam? |
| 8 | **Supabase Auth project settings** — is "confirm email" required for self-serve signup? Who owns configuring the email template/sender, given the annual handover flow depends on incoming committee members being able to sign up smoothly? |
| 9 | Should the UI actively **block removing the last remaining `admin_users` row**, to avoid an accidental full lockout, on top of the documented owner-login SQL fallback? |
| 10 | Deleting a committee member / alumnus / president / event / article leaves its associated image **orphaned in storage** (harmless — nothing will reference that UUID again — but accumulates over years). Worth wiring deletes to also remove the storage object, or accept the slow accumulation? |

---

## 2. Shared Infrastructure

### Authentication

Supabase email/password, matching `BackendPlan.md` §8's handover design exactly: any incoming committee member can **self-serve create an ordinary account** on the login page; a separate, deliberate step by an *existing* admin adds their account to `admin_users`. Creating an account grants no privileges by itself.

A new `useAuth` hook wraps `supabase.auth.getSession()` / `onAuthStateChange` and exposes `{ session, isAdmin, isLoading }`. `isAdmin` is resolved by querying the caller's own `admin_users` row — already permitted without any elevated access, since the live `admin_users_read_self` RLS policy allows `user_id = auth.uid()`.

### Authorisation

Flat. Every row in `admin_users` carries identical privileges — this matches the live schema exactly (no `role` column exists on `admin_users`), so no schema change is needed. No page or action is gated by anything beyond "is this person in `admin_users`."

### Routing

`/admin/*` is added as a **sibling top-level branch** in `application/app/routes.tsx`, not nested under the existing public `Root` — the public layout's marketing header/footer and cinematic styling are the wrong shell for a dense dashboard. All `/admin/*` routes are lazy-loaded so the admin bundle never ships to public visitors.

Routes: `/admin/login`, `/admin` (landing/overview), `/admin/sponsors`, `/admin/committee`, `/admin/events`, `/admin/alumni`, `/admin/presidents`, `/admin/articles`, `/admin/submissions`, `/admin/admins`.

A `ProtectedRoute` layout wrapper covers everything except `/admin/login`, with three states:
1. No session → redirect to `/admin/login`.
2. Session exists, but no `admin_users` row → an "access pending" screen (not a redirect loop — this person is authenticated, just not yet authorised) with sign-out and a note to contact a current admin.
3. Session + admin row present → render inside `AdminLayout`.

### Layout & navigation

A persistent sidebar (desktop) plus a top bar (signed-in email, sign-out). Styled using the site's existing but currently-unused `theme.css` tokens — `--sidebar`, `--sidebar-accent`, `--primary`, `--card`, `--radius`, `--chart-1..5` — which read as if they were set up in anticipation of exactly this kind of dashboard UI. Per the confirmed "brand-lite utilitarian" direction: navy/cyan and the existing typefaces as accents only, dense functional layout, none of the public site's scroll-reveal motion, glow shadows, or film grain.

Sidebar grouped into three sections:
- **Content** — Sponsors, Committee, Events, Alumni, Previous Presidents, Articles.
- **Submissions** — one inbox covering all three form tables (or three entries with unread-count badges).
- **Settings** — Manage Admins.

### Shared components (build once, reuse everywhere)

| Component | Purpose |
|---|---|
| `DataTable` | Generic sortable/filterable table; collapses to a stacked-card layout on mobile. Backs every list view. |
| `ImageUploader` | Two variants sharing the same underlying resize/upload logic: **id-keyed convention** (committee/alumni/presidents — forces JPEG output, requires the row to already exist) and **URL-column** (sponsors/events/articles — order-independent, writes the returned public URL into a form field). |
| `ConfirmDialog` | Generic destructive-action confirmation, with an optional "type the name to confirm" mode for higher-stakes deletes (e.g. an event with existing signups). |
| `StatusBadge` / `PublishToggle` | Consistent rendering/editing of `is_published` (boolean pages) or `status` (articles, submissions). |
| `Toast` | Lightweight success/error feedback context after every mutation. |
| `PreviewCard` | Small, purpose-built preview of a single entity (sponsor tile, committee card, event card, etc.) rendered from in-progress form state. |

No new dependencies are required for any of the above — the codebase has no `react-hook-form`, `zod`, or `react-query` today, and every existing page (including the three live public forms) is hand-rolled `useState`/`useEffect`. Recommend keeping that pattern for consistency; revisit only if the Articles form (the most complex) proves painful in practice.

### Feedback

Loading skeletons and error/empty states following the pattern already used across Team/Events/Sponsors/etc. (`cancelled`-guarded `useEffect` fetch). Refetch-after-write rather than optimistic UI, again matching the codebase's existing simplicity.

### Audit trail

A new `audit_log` table (see Open Question 2 for exact shape), written on every admin create/update/delete across all 7 content tables plus `admin_users`, via one reusable `useAdminMutation` wrapper — the same "write the rule once, reuse everywhere" principle `is_admin()` already applies to authorisation. RLS: admin-only `select` and `insert`; no `update`/`delete` policy at all, making the log immutable by construction rather than by convention. A dedicated log-viewer page is deferred to Phase 10 (polish) — logging itself starts from day one regardless of whether a UI exists yet to browse it.

### Mobile responsiveness

Sidebar collapses to a hamburger-triggered slide-in drawer below the site's existing tablet breakpoint (matching current conventions rather than inventing a new one). `DataTable` switches to a stacked label/value card per row below the same breakpoint — the one genuinely new responsive pattern this project needs, since nothing table-shaped exists in the app today. Forms already stack naturally; `ImageUploader` accepts the mobile file picker/camera source with no extra work.

### Preview

Public pages hardcode published-only queries (`is_published = true` / `status = 'published'`), so there is no safe mechanism for an admin to see a real page render a draft row without either querying the live site with admin-elevated filters (security/complexity risk) or maintaining a second copy of every public page purely for preview (drift risk, and a style mismatch given the public site's cinematic components vs. the admin's utilitarian ones). Recommend the small `PreviewCard` component instead — good enough to sanity-check "does this look roughly right," not a pixel-accurate render.

### Bootstrap dependencies (context, not new decisions)

Nothing under `/admin/*` is reachable until at least one `admin_users` row exists — not even the Manage Admins page itself, since viewing it requires being an admin. The Sponsors page's image upload cannot function until the `sponsor_logos` bucket gets a write policy. Both are handled in Phase 0 below.

---

## 3. Page-by-Page Specification

### Sponsors

1. **Purpose** — Manage the sponsor logos, tiers, and details shown on the public Sponsors page.
2. **Backing table** — `sponsors`. Full CRUD. No foreign keys in or out.
3. **List view** — Logo thumbnail, name, tier badge (gold/silver/past), sector, years_active, published toggle, display_order. Sorted by `display_order` within each tier group (matches the public page's grouping). Filters: tier, published state. Search by name.
4. **Create/edit form**

   | Field | Input | Required | Validation |
   |---|---|---|---|
   | name | text | yes | non-empty; unique per tier (DB constraint `unique(name, tier)` — surface a conflict as a friendly "this name already exists at this tier" message) |
   | tier | select: gold / silver / past | yes | one of the three check-constraint values |
   | sector | text | no | this is the field actually rendered as the role/badge text on the public page — `role_label` also exists in the schema but is currently unused by the frontend and should **not** be surfaced here |
   | logo_url | upload or paste URL | no | if uploading: resize client-side, keep original format (PNG/WebP/SVG) rather than forcing JPEG, since logos need transparency |
   | link_url | text (URL) | no | basic URL shape check if filled |
   | years_active | text | no | free text, e.g. "2022–2023" |
   | display_order | integer | no | drag-and-drop reorder in the list view should write this rather than requiring manual entry |
   | is_published | toggle | — | defaults on |
5. **Delete behaviour** — Hard delete permitted (nothing references sponsors). Confirm dialog. Day-to-day, prefer unpublishing over deleting; reserve delete for genuine duplicates/mistakes.
6. **Ordering** — Manual, drag-and-drop within each tier group, writing `display_order`.
7. **Image handling** — Bucket `sponsor_logos` (needs the Phase 0 policy fix before uploads work). Displayed in a fixed-height "contain" box, not cropped, since logo shapes vary.

### Committee / Team

1. **Purpose** — Manage the current committee roster shown on the public Team page.
2. **Backing table** — `committee_members`. Full CRUD. No foreign keys.
3. **List view** — Headshot thumbnail, name, role, active toggle, display_order, LinkedIn icon. Sorted by `display_order`. Filter: active/inactive. Search by name/role.
4. **Create/edit form**

   | Field | Input | Required | Validation |
   |---|---|---|---|
   | name | text | yes | non-empty |
   | role | text | yes | non-empty, e.g. "President", "VP Events" |
   | linkedin_url | text (URL) | no | basic URL shape check if filled |
   | display_order | integer | no | drag-and-drop reorder preferred over manual entry |
   | is_active | toggle | — | doubles as the public visibility switch; defaults on |
   | headshot | upload | no | enabled only after the row has been saved once — see Image handling |
5. **Delete behaviour** — Hard delete permitted. Confirm dialog; best-effort delete the orphaned `{id}.jpeg` from storage at the same time.
6. **Ordering** — Manual, drag-and-drop, writing `display_order`.
7. **Image handling** — There is deliberately **no `headshot_url` column**. The public URL is always computed as `committee_photos/{id}.jpeg`. This makes creation a necessary **two-step flow**: save the row first to obtain its generated UUID, then enable the photo uploader keyed to that id. Non-JPEG source images (PNG, phone HEIC, etc.) must be converted to JPEG client-side before upload, since the read side never varies the extension. Crop to a square 1:1 aspect ratio to match the circular portrait treatment used on the public page. This convention is kept as-is rather than migrated to a URL column, to avoid touching three already-shipped, working public pages.

### Events

1. **Purpose** — Publish upcoming events, optionally with signup enabled. **Currently the most urgent page to build** — the public Events page shows zero upcoming events today.
2. **Backing table** — `events`. Full CRUD. Deleting an event **cascades** to delete all of its `event_signups` rows.
3. **List view** — Cover thumbnail, title, starts_at, location, signup_enabled badge, capacity (or "unlimited"), live signup count, published toggle. Toggle between upcoming/past, both sorted chronologically by `starts_at`. Filters: published, signup enabled. Search by title/location.
4. **Create/edit form**

   | Field | Input | Required | Validation |
   |---|---|---|---|
   | title | text | yes | non-empty |
   | description | textarea | yes | non-empty (DB not-null) |
   | location | text | yes | non-empty |
   | starts_at | datetime picker | yes | valid date; DB not-null |
   | ends_at | datetime picker | no | if set, should be ≥ starts_at (app-side check) |
   | cover_image_url | upload or paste URL | no | see Image handling |
   | capacity | integer | no | positive if set; blank = unlimited |
   | signup_enabled | toggle | — | defaults off — the public event-signup form only appears when this is on |
   | is_published | toggle | — | defaults on |
5. **Delete behaviour** — **Not a plain delete.** Count existing signups first; if non-zero, the confirm dialog must explicitly warn ("this event has N signups — they will be deleted too") and require typing the event title to proceed. For events with zero signups, a lighter single-click confirm is fine. Recommend unpublishing as the default day-to-day action once an event has any signups, reserving hard delete for mistakes made before anyone signed up.
6. **Ordering** — None needed; purely chronological via `starts_at`.
7. **Image handling** — Real `cover_image_url` column, bucket `event_photos` (already has a working write policy — no fix needed). Order-independent upload. 16:9 banner treatment, resized to a max width client-side (~1600px).

### Alumni / Network

1. **Purpose** — Build the alumni/placements directory on the public "Our Network" page. **Currently empty on the live site.**
2. **Backing table** — `alumni`. Full CRUD. DB constraint: cannot set `is_published = true` unless `consent_confirmed = true`.
3. **List view** — Headshot thumbnail, name, firm, role, cohort, consent-confirmed badge, published toggle. Sorted by cohort (desc) then name. Filters: published, consent confirmed. Search by name/firm.
4. **Create/edit form**

   | Field | Input | Required | Validation |
   |---|---|---|---|
   | name | text | yes | non-empty |
   | firm | text | yes | non-empty |
   | role | text | yes | non-empty |
   | cohort | text | yes | non-empty, e.g. graduating year label |
   | location | text | no | free text |
   | linkedin_url | text (URL) | no | basic URL shape check if filled |
   | consent_confirmed | toggle | — | defaults off; the `is_published` toggle should be visibly disabled until this is ticked, surfacing the DB constraint as a UX affordance instead of a raw error |
   | is_published | toggle | — | defaults **off** — the one entity type that defaults to unpublished, reflecting the extra sensitivity of alumni data (a named former member plus their employer) |
   | headshot | upload | no | same two-step convention pattern as Committee, targeting `alumni_photos/{id}.jpeg` |
5. **Delete behaviour** — Hard delete permitted. Confirm dialog with copy that reflects the data's sensitivity ("this will permanently remove this alumnus's record") rather than generic delete text. Best-effort orphan cleanup.
6. **Ordering** — None; no `display_order` column exists.
7. **Image handling** — Same convention pattern as Committee: `alumni_photos/{id}.jpeg`, two-step create, client-side JPEG conversion, square crop.

### Previous Presidents

1. **Purpose** — Maintain the historical list of society presidents. **Currently empty on the live site.**
2. **Backing table** — `presidents`. Full CRUD. No foreign keys.
3. **List view** — Headshot thumbnail, year_label, name, published toggle. Sorted by `start_year` descending (fixed). Filter: published. Search by name/year_label.
4. **Create/edit form**

   | Field | Input | Required | Validation |
   |---|---|---|---|
   | year_label | text | yes | non-empty display string, e.g. "2025–2026" |
   | start_year | integer | yes | drives the actual sort order — keep this field prominent in the form, not an afterthought next to year_label |
   | name | text | yes | non-empty |
   | notes | textarea | no | free text |
   | linkedin_url | text (URL) | no | basic URL shape check if filled |
   | is_published | toggle | — | defaults on |
   | headshot | upload | no | same two-step convention pattern, targeting `president_photos/{id}.jpeg` |
5. **Delete behaviour** — Hard delete permitted. Confirm dialog. Best-effort orphan cleanup.
6. **Ordering** — None. No `display_order` column; ordering is purely chronological via `start_year` — the simplest of the three currently-empty pages.
7. **Image handling** — Same convention pattern: `president_photos/{id}.jpeg`, two-step create, square crop, JPEG conversion.

### Articles

1. **Purpose** — Write and publish articles/blog posts. The most editorially complex content type (draft workflow, markdown body, optional PDF).
2. **Backing table** — `articles`. Full CRUD. DB constraint: `body_markdown` or `pdf_url` must be non-null (at least one). `author_id` is a nullable FK to `auth.users` (`on delete set null`); `author_name` is always a required, independent text snapshot.
3. **List view** — Cover thumbnail, title, tag, author_name, status badge (draft/published), published_at, updated_at. Sorted by `updated_at` desc (surfaces recent drafts) with a toggle to sort published items by `published_at` desc instead. Filters: status, tag (free-text — no DB enum exists for tags). Search by title/author.
4. **Create/edit form**

   | Field | Input | Required | Validation |
   |---|---|---|---|
   | title | text | yes | non-empty |
   | tag | text, with autocomplete from existing distinct tag values | yes | non-empty; free text, no DB enum |
   | author_name | text | yes | pre-filled from the logged-in admin's profile but editable, since it's a text snapshot independent of the account |
   | author_id | hidden, auto-set | — | set to the current user's id at creation; never a form field |
   | cover_image_url | upload or paste URL | no | see Image handling |
   | body_markdown | large textarea + a "Preview" tab (reusing the existing `react-markdown` + `remark-gfm` dependencies already used on the public Article Detail page) | conditionally required | must be present unless pdf_url is set — validate "at least one of body_markdown / pdf_url" client-side before submit, mirroring the DB check constraint, so the admin sees a friendly message instead of a raw database error |
   | pdf_url | text (URL) | conditionally required | required if body_markdown is blank |
   | status | select: draft / published | yes | defaults to draft |
   | published_at | read-only, auto-set | — | set by app code the instant status flips draft → published, per `BackendPlan.md`'s existing decision (Open Question 3) |
5. **Delete behaviour** — Hard delete permitted (the only FK points outward from articles to `auth.users`, irrelevant to deleting the article). Confirm dialog. Best-effort orphan cover cleanup.
6. **Ordering** — None; sorted by date fields only.
7. **Image handling** — Real `cover_image_url` column, bucket `article_covers` (already has a working write policy). Order-independent upload. 16:9 or 3:2 cover treatment, resized to ~1600px wide. `pdf_url` stays a plain paste-a-link field pending Open Question 6.

### Submissions Inbox

Covers `contact_submissions`, `sponsorship_enquiries`, and `event_signups` — three near-identical tables (public-insert only, admin-only select/update/delete, a `status` field for triage) that share **one generic list/detail pattern** rather than three bespoke UIs.

1. **Purpose** — Review and triage the three public forms (Contact, Sponsorship Enquiry, Event Signup) without needing Supabase dashboard access.
2. **Backing tables** — All three. Select, update (`status` only), delete — no admin-authored inserts; every row originates from a public submission.
3. **List view** — Shared columns: created_at (default sort, desc), status badge, primary contact fields. Per-table extras: Contact adds reason + message (truncated); Sponsorship adds company + message (truncated); Event Signups adds the joined event title + notes, with an event picker filter useful for pulling a day-of check-in list. Status filter tabs use each table's own vocabulary (new/read/archived for the two enquiry tables; confirmed/cancelled for signups). Search across name/email/message.
4. **Create/edit form** — No create form. A detail drawer shows the full, untruncated text plus a status dropdown.
5. **Delete behaviour** — Hard delete permitted (nothing downstream references any of these). Confirm dialog; archiving via status change is the default day-to-day action, delete reserved for spam/test entries.
6. **Ordering** — Chronological only.
7. **Image handling** — None; no image fields on any of the three tables.

### Manage Admins

1. **Purpose** — Grant or revoke admin access for already-registered accounts, implementing the annual handover flow from `BackendPlan.md` §8 without needing raw Supabase dashboard access.
2. **Backing table** — `admin_users`. Insert, select, delete — no update, since authorisation is flat (no role column to edit).
3. **List view** — Email, full_name, added_at, added_by (resolved to an email where possible). Sorted by added_at desc.
4. **Create/edit form** — "Add admin by email":

   | Field | Input | Required | Validation |
   |---|---|---|---|
   | email | text (email) | yes | must match an already-registered `auth.users` account |

   This lookup **cannot happen directly from the frontend** — the anon/authenticated Supabase key has no access to `auth.users`, and no RLS policy could safely expose it. It requires a **Supabase Edge Function** (`admin-add-by-email`, running with the `service_role` key) that: (1) verifies the caller is themselves already an admin before doing anything privileged, (2) looks up the given email via the Auth Admin API, (3) returns a clear "no account found — ask them to sign up on the login page first" error if none exists, and (4) either inserts the `admin_users` row itself or returns the resolved `user_id` for the frontend to insert (already permitted, since the caller is a confirmed admin under the existing `admin_users_manage` RLS policy).
5. **Delete behaviour** — Hard delete only — removal *is* the revocation; per `BackendPlan.md`, it "instantly cuts off their ability to write anything." Confirm dialog. Consider blocking or strongly warning against removing the last remaining row (Open Question 9) — the documented emergency fallback (the durable project-owner login re-adding a row via the Supabase SQL editor) still exists regardless, but a UI guardrail is cheap insurance.
6. **Ordering / Image handling** — None.

### Login

1. **Purpose** — Authenticate committee members, and let incoming members self-serve create an account ahead of being granted access.
2. **Backing table** — None directly; Supabase Auth manages `auth.users` internally. After login, the caller's own `admin_users` row is read (via the existing self-read RLS policy) to decide where to route them.
3. **List view** — N/A.
4. **Form** — Email + password fields, with a Sign in / Create account toggle on the same page, reflecting `BackendPlan.md`'s "each incoming committee member creates their own ordinary account, self-serve" handover step. On successful signup, show a message clarifying that account creation alone grants no access — a current admin must add them via Manage Admins next.
5. **Delete behaviour / Ordering / Image handling** — N/A.

---

## 4. Build Order

**Phase 0 — Bootstrap prerequisites** *(not app code, must happen first)*
- Manually insert the first `admin_users` row via the Supabase SQL editor. Nothing else — not even the Manage Admins page — is reachable without at least one admin row existing.
- Add the missing write policy on `storage.objects` for the `sponsor_logos` bucket (a small migration). Cheap and isolated; doing it now means Phase 3 (Sponsors) just works instead of hitting a silent upload failure.
- *(Optional, low priority)* Backfill a migration file capturing the objects created directly against the live DB before migration tracking started (`sponsors`, `admin_users`, `is_admin()`, the `sponsor_logos` bucket) — reproducibility only, no functional impact.

**Phase 1 — Shared infrastructure**
Auth hook, `ProtectedRoute`, `AdminLayout` (sidebar + top bar), the shared component set (`DataTable`, `ImageUploader`, `ConfirmDialog`, `StatusBadge`, `Toast`), and the `audit_log` table + write wrapper. Every page below depends on this; building it once avoids rebuilding auth/layout/logging piecemeal per page.

**Phase 2 — Login + Manage Admins + the `admin-add-by-email` Edge Function**
Proves the entire auth loop end-to-end (self-serve signup → the Phase 0 bootstrap admin grants access via the UI → the new admin logs in) before any content page exists to distract from validating that loop, and is immediately useful operationally.

**Phase 3 — Sponsors**
16 live rows, currently editable only by a developer redeploying code — highest-value, lowest-schema-complexity page (single table, no relationships), and the first real exercise of the Phase 0 storage policy fix.

**Phase 4 — Committee / Team**
28 live rows, the largest existing dataset needing regular edits as members join/leave. Introduces and proves the id-keyed two-step photo-upload pattern that Alumni and Presidents will directly reuse.

**Phase 5 — Events**
The public Events page currently renders zero upcoming events — missing content, not stale content, more urgent than headcount alone suggests. Also a prerequisite for Phase 9's event-signups inbox to have anything real to review, and introduces the real-URL-column image pattern (distinct from Phase 4's convention-based one) plus the cascade-delete warning UX.

**Phase 6 — Alumni / Network**
Also currently empty (0 rows). Reuses the photo pattern already proven in Phase 4, and is the first page to surface a DB-enforced cross-field constraint (`consent_confirmed` gating `is_published`) in the UI.

**Phase 7 — Previous Presidents**
Also empty, but the simplest of the three empty pages — no manual ordering UI at all. A good low-risk build once the more complex consent-gating pattern from Phase 6 is already solved and can be skipped here.

**Phase 8 — Articles**
Only 1 live row today, but the most editorially complex form (markdown editor + preview, conditional required-field validation mirroring a DB check constraint, draft/publish timestamping). Sequenced after five simpler CRUD pages so the general admin-page pattern and the hardest form aren't being learned simultaneously.

**Phase 9 — Submissions Inbox**
All three tables have 0 rows today — genuinely the least urgent, since there's nothing yet to triage. Also the cheapest of all nine pages to build, once `DataTable`/detail-drawer conventions are already established by the previous phases.

**Phase 10 — Polish**
Mobile responsiveness pass across all pages (if not already fully handled per-page), `PreviewCard` components per entity, an optional Audit Log viewer page, any deferred items from the Open Questions above, and a final RLS/security-advisor re-check now that `audit_log` and an Edge Function exist. Cross-cutting concerns are cheaper to apply consistently once all nine pages share the same underlying components than to bolt on per-page as each is built.
