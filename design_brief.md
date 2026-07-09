# MUTIS Design Brief

---

## 1. Palette

### Dark mode (homepage / default) — defined in `mutis-base.css` `:root`

| Name | Hex / Value | Role |
|---|---|---|
| ink | `#010d2e` | Deepest navy — page backdrop, section backgrounds |
| base | `#02123b` | Deep navy — alternating section fill |
| panel | `#021967` | Brand navy — raised panels, subpage hero |
| rise | `#0a3083` | Lifted navy — elevated surface layer |
| text / ivory | `#f2f3ee` | Warm ivory — primary body text |
| near-white | `#f0f4f8` | Near-white — headings, UI labels, button text |
| muted / soft-blue | `#9ec1d4` | Soft blue — secondary text, `--pm-accent-2` |
| dim / slate | `#5d7da0` | Dim slate — captions, meta labels |
| cyan / accent | `#15b8e1` | Bright cyan — primary accent, CTAs, progress bar |
| cyan-dim | `rgba(21, 184, 225, 0.16)` | Subtle cyan fill — hover backgrounds |
| cyan-glow | `rgba(21, 184, 225, 0.30)` | Cyan glow — box-shadow accent halo |
| card-surface | `rgba(255, 255, 255, 0.025)` | Ghosted white — dark card background |
| hairline-dark | `rgba(255, 255, 255, 0.07–0.1)` | White-alpha — dividers, borders |
| overlay-nav | `rgba(2, 5, 13, 0.92)` | Near-opaque dark — scrolled nav background |
| background-app | `#02050d` | Tailwind `--background` — app shell background |

### Royal-blue scale — defined in `theme.css` (shared; used for chart colours and sidebar)

| Token | Hex |
|---|---|
| `--royal-blue-950` | `#0A1F44` |
| `--royal-blue-900` | `#0F2855` |
| `--royal-blue-800` | `#153366` |
| `--royal-blue-700` | `#1B3E77` |
| `--royal-blue-600` | `#214988` |
| `--royal-blue-500` | `#2B5EA8` |
| `--royal-blue-400` | `#4B7BC8` |
| `--royal-blue-300` | `#7A9FD9` |
| `--royal-blue-200` | `#A9C3EA` |
| `--royal-blue-100` | `#D8E7FB` |

### Light mode (interior pages, `.subpage-light`) — defined in `mutis-light.css`

| Name | Hex / Value | Role |
|---|---|---|
| surface | `#ffffff` | Default page surface |
| surface-alt | `#f2f3ee` | Alternating section band (warm ivory) |
| ink-text | `#021967` | Primary text (brand navy) |
| ink-soft | `#3c4a66` | Body / muted text (slate) |
| ink-faint | `#76869f` | Labels / dim text (grey) |
| hair | `rgba(2, 25, 103, 0.14)` | Navy-tinted hairline border |
| hair-soft | `rgba(2, 25, 103, 0.07)` | Softer hairline |
| blue-deep | `#0e7fa3` | Deeper cyan — readable accent text on white |
| blue-light | `#9ec1d4` | Soft blue — accent text on navy hero |
| destructive | `#EF4444` | Error / destructive state |

---

## 2. Typography

### Typefaces

| Role | Family | Weights loaded |
|---|---|---|
| Display / headings | `DM Serif Display` | Regular (0), Italic | Used for all h1–h6, hero masthead, section headings, stat values, card titles, member names, timeline items |
| Body / UI | `Manrope` | 400, 500, 600, 700, 800 | Used for body copy, nav links, buttons, labels, form inputs |
| Body fallbacks | `Inter` | 300–900 | Fallback, also `Open Sans` 300–700 |
| Imported but unused in CSS | `Anton`, `Archivo Black`, `Bebas Neue`, `Oswald` | — | Available; no CSS rules reference them |
| Monospace (imported, unused) | `JetBrains Mono` | 400, 500 | Imported; no CSS rules reference it |

Font stacks:
- `--font-display`: `'DM Serif Display', Georgia, 'Times New Roman', serif`
- `--font-body` / `--font-nav`: `'Manrope', 'Inter', 'Helvetica Neue', Helvetica, 'Open Sans', Arial, sans-serif`

### Type scale

| Label | Value | Usage |
|---|---|---|
| micro | `8px` / `8.5px` | Sponsor strip label at mobile |
| 2xs | `9px` / `9.5px` | Scroll hint, CTA eyebrow, captions |
| xs | `10px` | Eyebrows, footer, nav links, stat labels — the dominant label size |
| nav | `10.5px` | Nav links, nav CTA button |
| sm | `11px` | Buttons, event "more" links |
| sm+ | `12px` | Mobile nav links, article tags, sector descriptions |
| base- | `13px` | Article/timeline descriptions, skip link |
| base | `14px` | Program/event/card descriptions |
| base+ | `15px` | Events intro text, article titles, field inputs |
| md | `16px` | Body base, hero body, `html` root, form inputs |
| lg | `17px` | About lede, split text, MEIF body |
| xl | `19px` | Page section lede |
| 2xl | `20px` | Sponsor/contact info values, network names |
| 3xl | `22px` | Member names, numlist numbers, program titles |
| 4xl | `24px` | Sector ID and name (desktop) |
| 5xl | `28px` | Hero stat values, numlist list titles |
| 6xl | `30px` | Dark card headings |
| 7xl | `32px` | Tier heads |
| 8xl | `36px` | Performance card values, MEIF sector names |
| 9xl | `72px` | Sector block large numerals |
| fluid-hero | `clamp(5.5rem, 14vw, 12.5rem)` | Hero masthead title |
| fluid-subtitle | `clamp(1.6rem, 3.5vw, 3rem)` | Hero subtitle |
| fluid-heading | `clamp(2.8rem, 6vw, 6rem)` | About/events section headings |
| fluid-meif | `clamp(3rem, 7vw, 7.2rem)` | MEIF heading |
| fluid-cta | `clamp(3.2rem, 9.5vw, 9.5rem)` | Final CTA heading |
| fluid-page | `clamp(2.6rem, 6vw, 5rem)` | Subpage hero title |
| fluid-section | `clamp(2rem, 4vw, 3.4rem)` | Section h2 |
| fluid-stat | `clamp(2.2rem, 4.5vw, 3.8rem)` | Stats strip values |

### Weight conventions

| Weight | Context |
|---|---|
| `400` (`--font-weight-normal`) | Body copy, inputs |
| `500` (`--font-weight-medium`) | Headings h1–h4, labels, buttons (base), tier labels |
| `600` | CTA buttons, strong emphasis, nav CTA |
| `700` | Skip link (accessibility only) |

### Line-height conventions

| Value | Context |
|---|---|
| `0.92` | Hero title, CTA heading — ultra-tight display |
| `0.94–0.95` | Events/about headings |
| `1.0–1.04` | Page/section headings, event card titles |
| `1.5` | Default for h1–h4, labels, buttons, inputs |
| `1.55–1.65` | Cards and descriptions |
| `1.68–1.78` | Body copy lede paragraphs |

### Letter-spacing conventions

| Value | Context |
|---|---|
| `-0.025em` to `-0.012em` | Large display headings (negative tracking) |
| `0` to `0.01em` | Regular body text |
| `0.06em` | Numbered indices, sponsor fallbacks |
| `0.1em` to `0.2em` | Buttons |
| `0.24em` to `0.32em` | Eyebrow labels (most common range) |
| `0.38em` to `0.52em` | CTA eyebrow, hero eyebrow, sponsor label (maximum tracking) |

---

## 3. Spacing & Layout

### Recurring padding / margin values

`4px`, `6px`, `8px`, `10px`, `12px`, `14px`, `16px`, `18px`, `20px`, `22px`, `24px`, `28px`, `32px`, `36px`, `40px`, `44px`, `48px`, `52px`, `56px`, `60px`, `64px`, `72px`, `80px`, `88px`, `100px`, `110px`, `120px`, `140px`, `148px`

The dominant horizontal content padding is **`64px`** desktop → `28px` at 900px → `20px` at 640px → `16px` at 480px.
The dominant section vertical padding is **`140px`** desktop → `80px` at 900px → `72px` at 640px → `64px` at 480px.

### Max-widths

| Value | Usage |
|---|---|
| `1240px` | Main inner content wrapper — used on every section |
| `1280px` | Hero content max-width |

### Grid system

| Pattern | Columns | Usage |
|---|---|---|
| Stats strip | `repeat(4, 1fr)` → 2-col at 900px → 1-col at 480px | Homepage stats |
| About / MEIF | `1fr 1.1fr` / `1fr 1.05fr` | Two-column editorial |
| Events | `repeat(3, 1fr)` → 1-col at 900px | Event card grid |
| Card grid | `repeat(auto-fill, minmax(min(100%, 320px), 1fr))` | Dark card grid |
| Sponsor grid | `repeat(auto-fill, minmax(min(100%, 220px), 1fr))` | Sponsor cells |
| Committee | `repeat(auto-fill, minmax(min(100%, 240px), 1fr))` | Member grid |
| Network / speakers | `repeat(auto-fill, minmax(min(100%, 220–240px), 1fr))` | Light mode cards |
| Split layout | `1fr 1fr` | Page section splits |
| Subpage hero | `1.3fr 1fr` | Page hero two-column |
| Numlist | `minmax(44px, 60px) minmax(0, 1fr) 48px auto` | Numbered list rows |
| Sector block | `180px 1fr 1fr` → 1-col at 900px | MEIF sector deep dive |
| Timeline | `minmax(120px, 180px) minmax(0, 1fr) auto` | Event timeline |

### Breakpoints

| Width | Trigger |
|---|---|
| `1240px` | Nav link spacing reduces |
| `1100px` | Desktop nav → mobile hamburger |
| `900px` | Major layout collapse to single-column |
| `640px` | Tighter padding, smaller type |
| `480px` | Smallest breakpoint; full-width adjustments |

### Border-radius

| Value | Usage |
|---|---|
| `0` / none | Most buttons (square), form inputs |
| `4px` | Skip link |
| `8px` | Sponsor logo wrapper in `.pm-sponsor-logo-wrap` |
| `10px` | Sponsor logo card (homepage marquee) |
| `12px` (`calc(1rem - 4px)`) | `--radius-sm` (Tailwind theme alias) |
| `12px` | Podcast embed |
| `14px` (`calc(1rem - 2px)`) | `--radius-md` |
| `14px` | WIF logo slot |
| `1rem` (16px) | `--radius` / `--radius-lg` — base token |
| `20px` (`calc(1rem + 4px)`) | `--radius-xl` |
| `50%` | Social icon buttons, member portraits, network/speaker photos |

---

## 4. Elevation & Depth

### Flat

Most section dividers: `1px solid rgba(255,255,255,0.06–0.08)` (dark) or `1px solid var(--hair)` (light). No shadow.

### Raised

| Component | Shadow |
|---|---|
| `.pm-sponsor-logo-wrap` | `0 6px 20px rgba(0,0,0,0.25)` |
| `.sponsor-logo-wrap` (subpage, light bg) | `0 1px 3px rgba(10,31,68,0.06)` |
| `.dark-card`, `.network-card`, `.speaker-card`, `.perf-card` (light mode) | `0 1px 2px rgba(10,31,68,0.04)` |
| `.wif-logo-slot` | `0 2px 12px rgba(10,31,68,0.06)` |

### Floating / hover lift

| Component | Shadow |
|---|---|
| `.pm-event-card:hover` | `0 24px 60px -20px rgba(13,168,204,0.22)` |
| `.dark-card:hover` | `0 18px 50px -18px rgba(13,168,204,0.18)` |
| `.mutis-card:hover` | `0 12px 40px rgba(0,0,0,0.3)` |
| `.member:hover` | `0 18px 50px -18px rgba(13,168,204,0.22)` |
| `.network-card:hover`, `.speaker-card:hover` | `0 18px 50px -22px rgba(15,122,168,0.3)` |
| `.pm-sponsor-logo-wrap:hover` | `0 12px 30px rgba(0,0,0,0.35)` |

### Overlay / glow

| Component | Shadow |
|---|---|
| `.btn-primary` / `.pm-btn--primary` | `0 0 0 1px var(--pm-accent), 0 10px 36px -8px var(--pm-accent-glow)` |
| `.pm-cta-btn` | `0 0 0 1px rgba(20,181,212,0.9), 0 20px 70px -14px rgba(13,168,204,0.65)` |
| `.pm-nav-dropdown` | `0 24px 60px rgba(0,0,0,0.55)` |
| Mobile nav drawer | `-24px 0 60px rgba(0,0,0,0.6)` |
| Timeline dot `::before` | `0 0 10px var(--pm-accent-glow)` |
| Page eyebrow bar | `0 0 10px var(--pm-accent-glow)` |
| Hero title | `text-shadow: 0 6px 48px rgba(0,0,0,0.6)` |

---

## 5. Motion

### Transition durations and easings

| Duration | Easing | Applied to |
|---|---|---|
| `0.06s linear` | linear | Scroll progress bar width |
| `0.2s ease` | ease | Link colours, nav social icons, anchor hover, burger opacity |
| `0.22s ease` | ease | Nav dropdown opacity / transform |
| `0.25s ease` | ease | `.btn`, `.pm-nav-cta`, card borders, marquee image filter |
| `0.3s ease` | ease | Sector hover padding, numlist padding, sponsor cell bg |
| `0.3s cubic-bezier(.22,1,.36,1)` | spring-decelerate | Burger lines, nav underline `::after`, btn arrow, sponsor logo scale, gallery image zoom |
| `0.35s ease` | ease | Event card border/shadow |
| `0.35s cubic-bezier(.22,1,.36,1)` | spring-decelerate | CTA button |
| `0.4s cubic-bezier(.22,1,.36,1)` | spring-decelerate | Pointer tilt transform |
| `0.4s cubic-bezier(.22,1,.36,1)` | spring-decelerate | Mobile nav slide-in drawer |
| `0.45s ease` | ease | Nav background, padding, backdrop-filter on scroll |
| `0.9s cubic-bezier(.22,1,.36,1)` | spring-decelerate | Scroll reveal: opacity + translate |

**Dominant easing**: `cubic-bezier(.22,1,.36,1)` — springy deceleration, used for all interactive transforms and reveals.

### Keyframe animations

| Name | Duration | Easing | Element |
|---|---|---|---|
| `grain` | `1.4s steps(6) infinite` | steps | Film-grain noise overlay (`opacity: 0.055`) on full page; also on hero (`opacity: 0.08`) |
| `mutis-marquee` | `30s linear infinite` | linear | Sponsor logo marquee strip (legacy) |
| `pm-sponsors-scroll` | `36s linear infinite` | linear | Homepage sponsors track; also `image-track` at `72s` |
| `scrollDown` | `2.6s cubic-bezier(.65,0,.35,1) infinite` | custom | Scroll hint indicator line in hero |

### Scroll reveal classes

| Class | Initial state | Final state |
|---|---|---|
| `.r-up` | `opacity:0; translateY(32px)` | `opacity:1; translateY(0)` via `.in` |
| `.r-left` | `opacity:0; translateX(-50px)` | `opacity:1; translateX(0)` via `.in` |
| `.r-right` | `opacity:0; translateX(50px)` | `opacity:1; translateX(0)` via `.in` |

All three use `0.9s cubic-bezier(.22,1,.36,1)`.

### Reduced motion

Under `@media (prefers-reduced-motion: reduce)`, all animation and transition durations collapse to `0.001ms !important` and `scroll-behavior` reverts to `auto`.

---

## 6. Component Patterns

### Navigation (`.pm-nav`)

- Fixed bar, full-width, `z-index: 80`; transparent by default
- On scroll (`.pm-nav--scrolled`): `background: rgba(2,5,13,0.92)`, `backdrop-filter: blur(20px) saturate(160%)`, `border-bottom: 1px solid rgba(255,255,255,0.05)`
- Padding: `22px 52px` → `14px 52px` on scroll
- Logo: `172px × 56px`
- Nav links: `10.5px`, `letter-spacing: 0.18em`, uppercase; hover underline via `::after` `scaleX()` transition
- CTA button: `border: 1px solid rgba(240,244,248,0.22)`, transparent; hover fills cyan with glow
- Dropdown: `rgba(6,12,24,0.96)`, `blur(20px)`, fades in with `translateY(6px → 0)`
- Mobile (≤1100px): right-side slide-in drawer, `width: min(86vw, 360px)`, `background: linear-gradient(180deg, #080f22, #02050d)`

### Hero (`.pm-hero`)

- Full viewport height (`100svh`), background image with parallax `will-change: transform`
- Directional overlay: `linear-gradient(100deg, rgba(2,5,13,0.82) → 0.97)`
- SVG film grain texture at `opacity: 0.08`, `mix-blend-mode: overlay`
- Hero title: `DM Serif Display`, `clamp(5.5rem, 14vw, 12.5rem)`, `line-height: 0.92`, `letter-spacing: -0.02em`
- Hero subtitle: italic, `clamp(1.6rem, 3.5vw, 3rem)`, `line-height: 1`
- Body copy: `16px`, `line-height: 1.72`, `color: var(--muted)`
- Right-side stats panel: hairline left border, stacked stat items with hairline separators
- Scroll hint: animated 1px cyan line using `scrollDown` keyframe

### Buttons

| Variant | Background | Border | Text | Shadow |
|---|---|---|---|---|
| `.btn-primary` | `var(--pm-accent)` (#15b8e1) | cyan | `var(--ink)` | `0 0 0 1px cyan, 0 10px 36px -8px glow` |
| `.btn-ghost` | `rgba(240,244,248,0.02)` | `rgba(240,244,248,0.2)` | `#f0f4f8` | none |
| `.pm-cta-btn` | `linear-gradient(135deg, #14b5d4, #0a9bbf)` | none | `var(--ink)` | strong cyan glow |

All buttons: `min-height: 44px`, `padding: 13px 20–22px`, `font-size: 11px`, `font-weight: 600`, `letter-spacing: 0.2–0.24em`, `text-transform: uppercase`. **No border-radius** on most buttons (square corners). Hover: `translateY(-1px)` to `translateY(-4px)`.

### Cards (dark mode)

| Class | Background | Border | Padding | Hover effect |
|---|---|---|---|---|
| `.pm-event-card` | `rgba(255,255,255,0.025)` | `rgba(255,255,255,0.08)` | `32px` | cyan border + `0 24px 60px -20px rgba(13,168,204,0.22)` |
| `.dark-card` | `rgba(255,255,255,0.02)` | `rgba(255,255,255,0.08)` | `36px` | `translateY(-4px)` + cyan shadow |
| `.mutis-card` | — | — | — | `translateY(-4px)` + `0 12px 40px rgba(0,0,0,0.3)` |

### Cards (light mode)

| Class | Background | Border | Shadow | Hover |
|---|---|---|---|---|
| `.network-card`, `.speaker-card` | `#fff` | `var(--hair)` | `0 1px 2px rgba(10,31,68,0.04)` | `translateY(-4px)`, cyan-tinted border, `0 18px 50px -22px rgba(15,122,168,0.3)` |
| `.perf-card`, `.team-compact-card` | `#fff` | `var(--hair)` | `0 1px 2px rgba(10,31,68,0.04)` | — |

### Form inputs (dark mode)

- Background: `rgba(255,255,255,0.025)`, border: `rgba(255,255,255,0.1)`, color: `#f0f4f8`
- Padding: `14px`, no border-radius (square), `font-size: 15px`
- Focus: `border-color: var(--pm-accent)`, `background: rgba(13,168,204,0.08)`
- Error banner: `color: #ffd7d7`, `background: rgba(220,38,38,0.12)`, `border: 1px solid rgba(248,113,113,0.45)`
- Success banner: `color: #d6f5ff`, `background: rgba(13,168,204,0.12)`, `border: 1px solid rgba(13,168,204,0.45)`

### Form inputs (light mode)

- Background: `#fff`, border: `var(--hair)`, color: `var(--ink-text)`
- Focus: `border-color: var(--pm-accent)`, `background: rgba(15,122,168,0.05)`

### Section layouts

- Every section: `padding: 140px 64px` → `80px 28px` → `64px 16px`; `max-width: 1240px` inner
- Background alternation: `var(--ink)` (#010d2e) ↔ `var(--base)` (#02123b)
- Subtle radial accent: `radial-gradient(circle at X% Y%, rgba(13,168,204,0.06–0.12), transparent)`
- Eyebrow label: `10px`, `letter-spacing: 0.44em`, uppercase, `var(--pm-accent-2)` colour
- Section headings: `DM Serif Display`, fluid `clamp()` sizing, `line-height: 0.92–1.04`, negative tracking

### Subpage hero (`.page-hero`)

- Dark default: `linear-gradient(180deg, #050e1e 0%, var(--ink) 100%)` + radial cyan glow + `1px` grid overlay at `rgba(255,255,255,0.018)`
- Light variant: `linear-gradient(135deg, #021967, #0a2a6b, #0e7fa3)` — navy-to-cyan gradient banner
- Two-column `1.3fr 1fr` grid; padding `148px 64px 80px`

### Footer (`.footer`)

- `padding: 28px 52px`, `background: var(--ink)`, `border-top: 1px solid rgba(255,255,255,0.06)`
- `10px`, `letter-spacing: 0.26em`, `text-transform: uppercase`, `color: rgba(240,244,248,0.4)`
- Link hover: `color: var(--pm-accent)`

### Glass effect

- Pattern used for nav dropdown and popover: `backdrop-filter: blur(20px) saturate(160%)`
- Tokens: `--glass-bg: rgba(255,255,255,0.05)`, `--glass-border: rgba(255,255,255,0.12)`, `--glass-blur: 10px`

---

## 7. Design Tokens

### `theme.css` `:root`

| Token | Value | Role |
|---|---|---|
| `--font-size` | `16px` | Base font size |
| `--font-display` | `'DM Serif Display', Georgia, serif` | Display typeface |
| `--font-body` | `'Manrope', 'Inter', ... sans-serif` | Body typeface |
| `--font-nav` | same as `--font-body` | Nav typeface |
| `--font-weight-medium` | `500` | Heading weight |
| `--font-weight-normal` | `400` | Body weight |
| `--royal-blue-950…100` | `#0A1F44` → `#D8E7FB` | 10-step royal blue scale |
| `--background` | `#02050d` | App background |
| `--foreground` | `#FFFFFF` | Default text |
| `--card` | `rgba(255,255,255,0.05)` | Card surface |
| `--card-foreground` | `#FFFFFF` | Card text |
| `--popover` | `rgba(15,40,85,0.95)` | Popover background |
| `--popover-foreground` | `#FFFFFF` | Popover text |
| `--primary` | `#FFFFFF` | Primary action background |
| `--primary-foreground` | `var(--royal-blue-950)` | Primary action text |
| `--secondary` | `var(--royal-blue-700)` | Secondary action background |
| `--secondary-foreground` | `#FFFFFF` | Secondary action text |
| `--muted` | `rgba(255,255,255,0.1)` | Muted surface |
| `--muted-foreground` | `rgba(255,255,255,0.6)` | Muted text |
| `--accent` | `#15b8e1` | Accent colour (cyan) |
| `--accent-foreground` | `#FFFFFF` | Accent text |
| `--destructive` | `#EF4444` | Destructive / error |
| `--destructive-foreground` | `#FFFFFF` | Destructive text |
| `--border` | `rgba(255,255,255,0.1)` | Default border |
| `--input` | `rgba(255,255,255,0.05)` | Input background |
| `--input-background` | `rgba(255,255,255,0.05)` | Input background (alias) |
| `--switch-background` | `rgba(255,255,255,0.2)` | Toggle switch background |
| `--ring` | `rgba(255,255,255,0.3)` | Focus ring |
| `--chart-1` | `#4B7BC8` | Chart colour 1 |
| `--chart-2` | `#7A9FD9` | Chart colour 2 |
| `--chart-3` | `#A9C3EA` | Chart colour 3 |
| `--chart-4` | `#2B5EA8` | Chart colour 4 |
| `--chart-5` | `#1B3E77` | Chart colour 5 |
| `--radius` | `1rem` | Base border radius |
| `--radius-sm` | `calc(var(--radius) - 4px)` = 12px | Small radius |
| `--radius-md` | `calc(var(--radius) - 2px)` = 14px | Medium radius |
| `--radius-lg` | `var(--radius)` = 16px | Large radius |
| `--radius-xl` | `calc(var(--radius) + 4px)` = 20px | Extra-large radius |
| `--sidebar` | `var(--royal-blue-900)` | Sidebar background |
| `--sidebar-foreground` | `#FFFFFF` | Sidebar text |
| `--sidebar-primary` | `#FFFFFF` | Sidebar primary |
| `--sidebar-primary-foreground` | `var(--royal-blue-950)` | Sidebar primary text |
| `--sidebar-accent` | `rgba(255,255,255,0.1)` | Sidebar accent surface |
| `--sidebar-accent-foreground` | `#FFFFFF` | Sidebar accent text |
| `--sidebar-border` | `rgba(255,255,255,0.1)` | Sidebar border |
| `--sidebar-ring` | `rgba(255,255,255,0.3)` | Sidebar focus ring |
| `--glass-bg` | `rgba(255,255,255,0.05)` | Glassmorphism surface |
| `--glass-border` | `rgba(255,255,255,0.12)` | Glassmorphism border |
| `--glass-blur` | `10px` | Glassmorphism blur |

### `mutis-base.css` `:root` (cinematic layer)

| Token | Value | Role |
|---|---|---|
| `--ink` | `#010d2e` | Deepest navy backdrop |
| `--base` | `#02123b` | Deep navy alt section |
| `--panel` | `#021967` | Brand navy raised panel |
| `--rise` | `#0a3083` | Lifted navy layer |
| `--text` | `#f2f3ee` | Warm ivory body text |
| `--muted` | `#9ec1d4` | Soft blue muted text |
| `--dim` | `#5d7da0` | Dim slate-blue labels |
| `--pm-accent` | `#15b8e1` | Bright cyan primary accent |
| `--pm-accent-dim` | `rgba(21,184,225,0.16)` | Subtle cyan fill |
| `--pm-accent-glow` | `rgba(21,184,225,0.30)` | Cyan glow for shadows |
| `--pm-accent-2` | `#9ec1d4` | Soft blue secondary accent |
| `--hero-image` | `url("/WebsiteMainbg.webp")` | Hero background image (swap point) |

### `mutis-light.css` `.subpage-light`

| Token | Value | Role |
|---|---|---|
| `--navy` | `#021967` | Deep brand navy |
| `--navy-2` | `#0a2a6b` | Navy mid |
| `--blue` | `#15b8e1` | Bright cyan accent |
| `--blue-deep` | `#0e7fa3` | Deeper cyan for text on white |
| `--blue-light` | `#9ec1d4` | Soft blue (on navy hero) |
| `--ink-text` | `#021967` | Primary text |
| `--ink-soft` | `#3c4a66` | Body / muted text |
| `--ink-faint` | `#76869f` | Labels / dim text |
| `--hair` | `rgba(2,25,103,0.14)` | Navy-tinted hairline |
| `--hair-soft` | `rgba(2,25,103,0.07)` | Softer hairline |
| `--surface` | `#ffffff` | Page surface |
| `--surface-alt` | `#f2f3ee` | Alternating band (warm ivory) |
| `--pm-accent` | `#15b8e1` | Cyan (override) |
| `--pm-accent-2` | `#0e7fa3` | Deeper cyan (override) |
| `--pm-accent-dim` | `rgba(21,184,225,0.12)` | Accent fill |
| `--pm-accent-glow` | `rgba(21,184,225,0.22)` | Accent glow |
| `--muted` | `var(--ink-soft)` | Muted text alias |
| `--dim` | `var(--ink-faint)` | Dim text alias |

---

## 8. Overall Aesthetic Summary

MUTIS presents as dark-luxury editorial finance — cinematic, authoritative, and precise. The homepage is built on an almost black navy (`#010d2e`) with electric cyan (`#15b8e1`) as the sole accent colour, creating a palette that recalls a Bloomberg terminal rendered as a film poster. The typographic system is the defining signature: `DM Serif Display` at massive fluid sizes (`clamp(5.5rem, 14vw, 12.5rem)`) with sub-1 line-height and tight negative tracking collides with `Manrope` in 10px all-caps eyebrow labels tracked to `0.44em`, producing an editorial contrast between old-world serif gravitas and contemporary sans-serif utility. Motion is tactile and deliberate — a single custom springy easing (`cubic-bezier(.22,1,.36,1)`) governs nearly every hover and reveal, while SVG film-grain textures layered at 5–8% opacity and `mix-blend-mode: overlay` add analogue warmth that prevents the dark palette from feeling sterile. Interior pages switch to a clean white mode (`.subpage-light`) with `#021967` navy as both text colour and the subpage hero banner, preserving brand identity while maximising content legibility — the warm ivory `#f2f3ee` alternating band is the connective tissue between the two modes. The signature details worth preserving in new work are: fluid `clamp()` display type, the cyan ring-plus-glow button shadow, the hairline `rgba(255,255,255,0.018)` repeating-linear-gradient grid on page heroes, and the 1px fixed cyan scroll progress bar at the very top of the viewport.
