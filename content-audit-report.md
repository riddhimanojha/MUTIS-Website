# MUTIS Site — Content Audit (Non-Admin-Managed Pages)
Generated 2026-08-11. No code changes made — findings only.

## Methodology
Admin CRUD already covers Sponsors, Committee, Events, Alumni, Previous Presidents,
Articles, and Submissions, so Articles/ArticleDetail, Team, PreviousPresidents,
OurNetwork, and Events were excluded. Every other public route was read in full and
scanned for hardcoded text likely to go stale: stats/member counts, dates/years,
contact details, external links, leadership bios, copyright, and mission copy.

## Excluded — fully DB-driven
- Articles.tsx / ArticleDetail.tsx (articles table)
- Team.tsx (committee_members table)
- PreviousPresidents.tsx (presidents table)
- OurNetwork.tsx (alumni table)
- Events.tsx (events table)
- Sponsors.tsx — sponsor *list* only (sponsors table); static parts of this page are audited below

## ⚠️ Cross-file inconsistencies found (highest priority)
1. **Member count conflicts across the site**: About.tsx says "4,000+ members";
   Home.tsx and Sponsors.tsx say "1,000+ members" (repeated 5 times total across
   both pages); siteData.ts has an unused `stats` export also saying "1,000+".
   These are not just duplicates — they actively contradict each other.
2. **Founding year conflict**: Home.tsx hero says "Est. 2008"; About.tsx says
   "21 years of MUTIS" (implies founding ~2005), with an explicit unresolved
   dev TODO comment flagging the same conflict.
3. **Broken placeholder link**: Contact.tsx's Students' Union link is a literal
   dead anchor `href="#su-link-tbc"`, while Join.tsx has the real working URL
   right next to it (`https://manchesterstudentsunion.com/activities/view/mutis`).
4. **Contact email hardcoded independently 6+ times**: Header.tsx, Footer.tsx,
   Contact.tsx (×2), Sponsors.tsx (×2), Attendance.tsx (×2) all hardcode
   `mutis@manchesterstudentsunion.com` separately.
5. **Social links (Instagram/LinkedIn) hardcoded independently 5+ times**:
   Header.tsx, Footer.tsx, Contact.tsx, Recordings.tsx, Attendance.tsx.
6. **Two orphaned/dead pages**: `PastSponsors.tsx` and `Resources.tsx` exist as
   full page components but are **not registered in `routes.tsx`** — unreachable
   by any user. `PastSponsors.tsx` also duplicates a past-sponsors section that
   already exists live in `Sponsors.tsx`.
7. **`data/siteData.ts` file-header comment is factually wrong**: it claims
   "all content is static; no backend or database," but Contact.tsx writes to
   Supabase, and sponsor logos are already hosted on Supabase Storage.
8. ~~**Attendance.tsx form likely broken**~~ — **resolved**: it previously submitted via
   `fetch("/")` using a static-site forms-detection convention that only worked on a specific
   hosting provider, while every other form in the app (e.g. Sponsors enquiry) inserted directly
   into Supabase. It now inserts into `attendance_submissions` the same way, and the leftover
   hidden static form markup in `index.html` has been removed.

---

## Findings by file

### `app/pages/About.tsx`
| Line | Snippet | Description | Suggested action | Duplication |
|---|---|---|---|---|
| 21 | "MUTIS exists to give Manchester students a real edge..." | Hero mission statement | Leave static | none |
| 31 | "4,000+ members from every faculty" | Membership count | **Worth making admin-editable** | Conflicts with "1,000+" on Home.tsx:124/151/169, siteData.ts:7 |
| 32–33 | Weekly meetings / MEIF description | Program copy | Leave static | none |
| 44 | "21 years of MUTIS" | Society age | **Worth making admin-editable** (or compute from a founding-year constant) | Conflicts with Home.tsx:87 "Est. 2008" |
| 47–50 | `PENDING: 21-year history write-up... reconcile founding year` | Dev TODO, unresolved factual conflict | **One-off manual fix** — needs a direct answer from the club | See above |
| 51–55 | "MUTIS has been part of life... for over 21 years" | Same age claim | **One-off manual fix**, same root cause | none |
| 57–60 | `PENDING: replace with confirmed history narrative` / "coming soon" | Missing history section | **One-off manual fix** — content gap, not a CMS need | none |
| 79 | "led by Anna (Director) and Maya, Elsie, and Niyati (Co-Heads)" | WiF sub-committee leadership, first names only, prose | **Worth making admin-editable** | Should logically come from the same source as `/team` (committee_members), currently disconnected |

### `app/pages/Home.tsx`
| Line | Snippet | Description | Suggested action | Duplication |
|---|---|---|---|---|
| 87 | "Est. 2008" | Founding year | **Worth making admin-editable** | Conflicts with About.tsx "21 years" |
| 124 | "1,000+ members across every faculty" | Member count in hero prose | **Worth making admin-editable** | Dup of lines 151, 169; siteData.ts:7; conflicts with About.tsx "4,000+" |
| 150–153 | `{val:"1,000+",label:"Members"}, {val:"17",...}, {val:"5+",...}` | Hero stat panel | **Worth making admin-editable** — ideal candidate for live-computed stats | Dup of STRIP_STATS (168–173) and siteData.ts `stats` (unused) |
| 168–173 | `STRIP_STATS` array incl. "6 Sector Teams" | Second stats array, same page | **Worth making admin-editable** | Dup of 150–153 |
| 201–222 | `PROGRAMS` array naming AmplifyME, Morgan Stanley, Rothschild & Co, UBS, Houlihan Lokey | Program descriptions naming specific partner firms | **Worth making admin-editable** | Overlaps with siteData.ts `sponsors`; Morgan Stanley/Rothschild not present there — possible existing drift |
| 288–310 | `EVENTS` array (E.01–E.03): titles, terms, locations | Flagship event details hardcoded | **Worth making admin-editable** | Should likely pull from the same source as the live `/events` page |
| 492–493 | `PLACEHOLDER: org structure diagram` / `PLACEHOLDER: core values` | Missing sections | **One-off manual fix** — content gap | none |

### `app/pages/Join.tsx`
| Line | Snippet | Description | Suggested action | Duplication |
|---|---|---|---|---|
| 15 | SU sign-up process description | Process copy | Leave static | none |
| 36 | "Tuesdays at Alliance MBS" | Weekly meeting day/location | **Worth making admin-editable** — changes term to term | none |
| 44 | "Applications open early in Autumn term" | Term-specific claim | **One-off manual fix** — cheap to hand-update yearly | none |
| 56 | `href="https://manchesterstudentsunion.com/activities/view/mutis"` | Real, working SU link | Leave static, verify periodically | Contact.tsx has a broken placeholder instead of reusing this |

### `app/pages/Contact.tsx`
| Line | Snippet | Description | Suggested action | Duplication |
|---|---|---|---|---|
| 44 | Fallback error text with email | Hardcoded email in error copy | **Worth making admin-editable** (centralize as constant) | Dup of line 132, Footer.tsx:17 |
| 132 | `mailto:mutis@manchesterstudentsunion.com` | Primary contact email | **Worth making admin-editable** | Dup of line 44, Footer.tsx:17 |
| 133 | "Alliance Manchester Business School, Booth Street West, M15 6PB" | Physical address | Leave static | none |
| 134 | Instagram link/handle | Social link | **Worth making admin-editable** | Dup of Header.tsx:39, Footer.tsx:7 |
| 135 | LinkedIn link | Social link | **Worth making admin-editable** | Dup of Header.tsx:44, Footer.tsx:10–13 |
| 136 | `href="#su-link-tbc"` | **Broken placeholder link**, literally "to be confirmed" | **One-off manual fix — urgent**, swap for Join.tsx:56's real URL | Join.tsx already has the correct URL |

### `app/components/Header.tsx`
| Line | Snippet | Description | Suggested action | Duplication |
|---|---|---|---|---|
| 39 | Instagram URL in `SOCIALS` | Social link | **Worth making admin-editable** | Dup of Contact.tsx:134, Footer.tsx:7 |
| 44 | LinkedIn URL in `SOCIALS` | Social link | **Worth making admin-editable** | Dup of Contact.tsx:135, Footer.tsx:10–13 |
| 7–34 | `navLinks` array | Nav structure/labels | Leave static — this is app config, not content | none |

### `app/components/Footer.tsx`
| Line | Snippet | Description | Suggested action | Duplication |
|---|---|---|---|---|
| 2, 5 | `new Date().getFullYear()` | Copyright year | **No action — already correct**, computed dynamically | none |
| 7 | Instagram link | Social link | **Worth making admin-editable** | 3rd dup, see above |
| 10–13 | LinkedIn link | Social link | **Worth making admin-editable** | 3rd dup, see above |
| 17 | mailto link | Contact email | **Worth making admin-editable** | 3rd dup, see above |

### `app/data/siteData.ts`
| Line | Snippet | Description | Suggested action | Duplication |
|---|---|---|---|---|
| 1–3 | "all content is static; no backend or database" | File-header comment, now factually false | **One-off manual fix** — misleading to future contributors | none |
| 6–10 | `export const stats = [...]` | Unused/dead stats export ("1,000+" etc.) | **Worth making admin-editable** — strongest signal stats need one source of truth | Dup of Home.tsx stat arrays |
| 14–33 | `LOCAL_LOGOS` — 18 hardcoded Supabase Storage URLs | Sponsor logo map | **Worth making admin-editable** — effectively a hand-maintained sponsors table in source | Overlaps with DB `sponsors` table |
| 35–61 | `export const sponsors` — tiers + careers URLs | Sponsor tier/careers data | **Worth making admin-editable** — churns every sponsorship cycle | Adjacent to DB `sponsors` table; should likely be migrated in |
| 64–69 | `flagshipSupporters` | Flagship event supporter (Shade Tree) | **Worth making admin-editable** | Same pattern as sponsors |
| 71–127 | `meifTeams` — sector team descriptions | MEIF team copy, low churn | Leave static (descriptions); note `articles: true` flags per team | Confirm relationship to `articles` DB table |

### `app/pages/MEIF.tsx`
| Line | Snippet | Description | Suggested action | Duplication |
|---|---|---|---|---|
| 5–9 | `PREVIOUS_FUND_MANAGERS: [] // PENDING` | Empty placeholder, past fund managers | **Worth making admin-editable** — same pattern as Previous Presidents | Could reuse existing admin CRUD pattern |
| 23, 32–34 | Fund mission/process copy | Editorial description | Leave static | none |
| 44–60 | `meifTeams` cards, permanent "Coverage notes: coming soon" badge | Team cards with unresolved placeholder | **Worth making admin-editable** | siteData.ts `meifTeams` |
| 64–84 | "Live view of holdings... coming soon", perf placeholders | Explicit pending business decision (data vendor, ~£20/mo) | **One-off manual fix** — needs product/committee decision first | none |
| 92–96 | "We're compiling a record of past fund managers" | Fallback tied to empty array above | **Worth making admin-editable** (follows from above) | none |

### `app/pages/Media.tsx`
| Line | Snippet | Description | Suggested action | Duplication |
|---|---|---|---|---|
| 6–9 | `MEDIA_LINKS` (Gallery/Recordings cards) | Small stable nav list | Leave static | none |
| 11 | `PODCAST_INTRO` tagline | Static copy above DB-driven podcast embed | Leave static (optionally fold into `podcast_settings`) | Sits directly above DB-driven content, mild inconsistency |

### `app/pages/Sponsors.tsx` (static parts only — sponsor list itself is DB-driven)
| Line | Snippet | Description | Suggested action | Duplication |
|---|---|---|---|---|
| 33–65 | `PACKAGES` — Gold/Silver/Bronze deliverables | Hardcoded sponsorship tier benefits | **Worth making admin-editable** | none in DB yet, but adjacent to sponsors table |
| 67–71 | `PAST_SPONSORS: [] // populate once confirmed` | Empty placeholder, never rendered from real data | **Worth making admin-editable** — should come from `sponsors` table `tier: "past"`, which `TIER_ORDER` (line 20) already anticipates | Dead/duplicate logic vs. the DB-driven tier system |
| 85 | `logo.includes("barclays.svg") ? {maxWidth:"126%"} : undefined` | Brittle magic-string CSS hack keyed to one sponsor's filename | **One-off manual fix** — breaks silently if logo file renamed via admin | Couples to admin-managed `logo_url` field |
| 213 | Hero sub-copy | Marketing copy | Leave static | none |
| 222 | "reaching our 1,000+ members" | Member count | **Worth making admin-editable** | Dup of lines 362, 411; site-wide conflict |
| 362 | "reaching 1,000+ Manchester finance students?" | Member count | **Worth making admin-editable** | Dup of 222, 411 |
| 195, 410 | Contact email (×2 on this page) | Email | Leave static, but centralize | Dup across Attendance.tsx, Contact.tsx, Footer.tsx |
| 411 | "Reach: 1,000+ Members" | Member count | **Worth making admin-editable** | Dup of 222, 362 |

### `app/pages/Gallery.tsx`
| Line | Snippet | Description | Suggested action | Duplication |
|---|---|---|---|---|
| 4–16 | `GALLERY_IMAGES: [] `, commented-out `import.meta.glob` loader | Reachable (`/gallery`), genuine "coming soon" | **Worth making admin-editable**, or uncomment the existing glob loader | Identical pattern already *live* in Sponsors.tsx's `PAST_EVENT_IMAGES` |
| 44–47 | "Coming soon — we'll be adding event photos here shortly" | User-facing fallback | Tied to above | none |

### `app/pages/Recordings.tsx`
| Line | Snippet | Description | Suggested action | Duplication |
|---|---|---|---|---|
| 17–18 | `RECORDINGS: [] // PENDING` | Reachable (`/recordings`), empty placeholder | **Worth making admin-editable** — natural DB table like Articles/Events | none |
| 46–51 | "Recordings... will be published here soon" + Instagram link | Fallback + social link | Fallback tied to above; Instagram link leave static | Instagram URL dup of Attendance.tsx:247 |

### `app/pages/PastSpeakers.tsx`
| Line | Snippet | Description | Suggested action | Duplication |
|---|---|---|---|---|
| 4–9, 20–22 | `PAST_SPEAKERS: [] // PENDING — do not fabricate names` | **Reachable** (`/past-speakers`, confirmed in routes.tsx), empty placeholder | **Worth making admin-editable** — comparable to Committee/Alumni CRUD | Speaker records could link to existing `events` table instead of free-text |
| 52–57 | "We're compiling our archive... check back soon" | Live fallback text | Tied to above | none |

### `app/pages/PastSponsors.tsx` — ⚠️ orphaned page, not in `routes.tsx`
| Line | Snippet | Description | Suggested action | Duplication |
|---|---|---|---|---|
| 4–9, 17–19 | `PAST_SPONSORS: [] // PENDING` | Unreachable dead code | **One-off manual fix** — recommend deleting the file, or wiring it in if intended to replace Sponsors.tsx's inline past-sponsors section | Duplicates Sponsors.tsx lines 67–71 and 299–329 |
| 53–58 | "putting together a record..." | Never rendered | n/a | none |

### `app/pages/Resources.tsx` — ⚠️ orphaned page, not in `routes.tsx`
| Line | Snippet | Description | Suggested action | Duplication |
|---|---|---|---|---|
| 4–9, 18–20 | `RESOURCES: [] // PENDING` | Unreachable dead code | **One-off manual fix** — delete, or add to routes.tsx + nav if Resources is intended to ship | none |
| 50–55 | "curating a library of guides..." | Never rendered | n/a | none |

### `app/pages/Attendance.tsx`
| Line | Snippet | Description | Suggested action | Duplication |
|---|---|---|---|---|
| 53–59 | ~~`fetch("/", {...})` using a static-site forms-detection convention~~ | **Resolved** — now inserts directly into `attendance_submissions`, matching Sponsors.tsx's `sponsorship_enquiries` pattern | Done | Sponsors.tsx does the equivalent correctly via Supabase |
| 65 | Fallback error text with email | Email | Leave static, centralize | Dup of Sponsors.tsx, Footer.tsx, Contact.tsx |
| 239–241 | mailto link | Email | Leave static, centralize | same |
| 247 | Instagram link | Social link | Leave static | Dup of Recordings.tsx:49 |
| 166–175 | Year-of-study `<select>` options | Fixed academic-year enum | Leave static | none |

### `app/hooks/usePodcastSettings.ts`
Fully DB-driven — queries `podcast_settings` table, has a working admin editor at `/admin/podcast`. **No action needed.** Included here only to confirm it is *not* part of the hardcoded-content problem, unlike the static `PODCAST_INTRO` copy sitting above it in Media.tsx.

---

## Recommended next steps (for discussion, not decided here)
1. Resolve the two live factual conflicts first (member count, founding year) —
   these are user-visible contradictions today, independent of any CMS work.
2. Fix the dead SU link in Contact.tsx — trivial, ships immediately.
3. Decide whether `PastSponsors.tsx` / `Resources.tsx` should be deleted or wired up.
4. Verify whether Attendance.tsx's form actually submits anywhere in production.
5. If a "site settings" or "site stats" admin table is added, it would resolve
   the member-count/partner-count/founding-year duplication in one place rather
   than needing five separate one-off fixes.
