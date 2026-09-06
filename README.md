# MUTIS Website

The official website for the **Manchester University Trading & Investment Society (MUTIS)** - one of the UK's largest student finance societies with 4,000+ members.

Built with React + TypeScript + Vite. Fully static - no backend, no database, no login. Hosted on Netlify with zero running costs.

---

## What's on the site

| Page | URL | What it shows |
|------|-----|---------------|
| Home | `/` | Cinematic landing with stats, society overview, and CTAs |
| About | `/about` | Who we are + committee roster |
| Events | `/events` | Flagship events + past-event photo gallery |
| MEIF | `/meif` | Manchester Ethical Investment Fund |
| Articles | `/articles` | Member research (empty until articles are published) |
| Sponsors | `/sponsors` | Partner firms with logos and careers links |
| Join | `/join` | Membership sign-up funnel |
| Contact | `/contact` | Contact form (powered by Netlify Forms) |
| Alumni | `/alumni` | Alumni destinations (alias for Articles) |

---

## Running it locally

You'll need [Node.js](https://nodejs.org) and [pnpm](https://pnpm.io) installed.

```bash
pnpm install       # install dependencies (first time only)
pnpm dev           # start dev server → http://localhost:5173
pnpm build         # production build → dist/
pnpm exec tsc --noEmit   # type-check without building
```

---

## Project layout

```
MUTIS-merged/
├── application/              # All source code lives here
│   ├── main.tsx              # App entry point
│   ├── app/
│   │   ├── routes.tsx        # Page routing
│   │   ├── components/       # Shared UI: Header, Footer, BackToTop, ScrollProgressBar
│   │   ├── pages/            # One file per page (Home, About, Events, etc.)
│   │   ├── hooks/            # Reusable logic: animations, SEO, scroll effects
│   │   └── data/
│   │       └── siteData.ts   # All static content: sponsors, events, stats
│   ├── assets/
│   │   ├── logos/            # Sponsor logo images
│   │   └── events/           # Past-event photos (shown in gallery on /events)
│   └── styles/
│       ├── index.css         # Imports everything below
│       ├── tailwind.css      # Tailwind v4 entry
│       ├── theme.css         # Design tokens (colours, spacing, fonts)
│       ├── fonts.css         # Web font declarations
│       ├── mutis-base.css    # Nav, hero, buttons, responsive, accessibility
│       ├── mutis-scroll.css  # Homepage scroll animations
│       └── mutis-subpage.css # Inner page styles (cards, forms, committee grid)
│
├── public/                   # Static files served as-is
│   ├── favicon.svg
│   ├── mutislogo.jpg         # Logo used in the nav bar
│   ├── WebsiteMainbg.webp    # Homepage hero background
│   ├── eventsbg.jpg          # Events page hero background
│   ├── robots.txt
│   ├── sitemap.xml
│   └── _redirects            # Netlify SPA routing fallback
│
├── index.html                # HTML shell (SEO meta + hidden Netlify form)
├── netlify.toml              # Netlify build config
├── vite.config.ts            # Vite config
├── tsconfig.json             # TypeScript config (strict mode)
└── package.json
```

---

## Updating content

Almost everything you'd want to change is in one place: **`application/app/data/siteData.ts`**

- **Statistics** (members count, partner count, events count) - `stats` array
- **Sponsor logos and careers links** - `sponsors` array
- **Industry events list** - `industryEvents` array

For page-specific content (committee members, MEIF details, articles), edit the relevant page file in `application/app/pages/`.

### Adding event photos
Drop images into `application/assets/events/` - they'll automatically appear in the gallery on `/events`. Any `.jpg`, `.jpeg`, `.png`, or `.webp` works.

### Adding sponsor logos
Add the image to `application/assets/logos/`, then reference it in `siteData.ts`:
```ts
const LOCAL_LOGOS = {
  "New Firm": new URL("../../assets/logos/new-firm.jpeg", import.meta.url).href,
  // ...
};
```

---

## Tech stack

| What | Tool |
|------|------|
| UI framework | React 18 |
| Language | TypeScript (strict) |
| Build tool | Vite 6 |
| Router | React Router 7 |
| Styling | Tailwind CSS v4 + custom CSS design system |
| Icons | lucide-react |
| Animations | motion (Framer Motion) |
| Forms | Netlify Forms (no server needed) |
| Hosting | Netlify |
| Package manager | pnpm |

---

## Deployment

See [DEPLOYMENT.md](DEPLOYMENT.md) for the full Netlify setup guide.

The short version: push to your main branch and Netlify auto-deploys. The build command is `pnpm build` and the publish directory is `dist`.

---

## What's not done yet

- **Articles** - the `/articles` page is built and ready; it just needs content added to the `articles` array in `siteData.ts`
- **Committee headshots** - set `headshot_url` per committee member in `About.tsx` to show photos instead of initials
- **MEIF documents** - PDF links and coverage notes are marked "coming soon" in `MEIF.tsx`
- **Event photo optimisation** - the photos in `application/assets/events/` are raw exports; converting to WebP would improve load times (see `PERFORMANCE.md`)

---

## Other docs

- [DEPLOYMENT.md](DEPLOYMENT.md) - how to deploy to Netlify
- [ACCESSIBILITY.md](ACCESSIBILITY.md) - accessibility features and how to maintain them
- [SEO.md](SEO.md) - how SEO is set up (per-route meta, sitemap, Open Graph)
- [PERFORMANCE.md](PERFORMANCE.md) - performance tips and image optimisation guide
