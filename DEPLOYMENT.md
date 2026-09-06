# Deployment Guide

The MUTIS site is a fully static React SPA. It builds to `dist/` and can be hosted on any
static host. **Netlify** is the recommended target because the contact form uses Netlify Forms.

## Build

```bash
pnpm install
pnpm build        # outputs dist/
```

## Recommended: Netlify

Configuration lives in [`netlify.toml`](netlify.toml):

```toml
[build]
  command = "pnpm build"
  publish = "dist"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
```

Steps:

1. Connect the repository in Netlify (or `netlify deploy`).
2. Netlify reads `netlify.toml` - no manual settings needed.
3. The SPA redirect rule (also in [`public/_redirects`](public/_redirects)) makes deep links
   like `/meif` resolve to `index.html` so a refresh doesn’t 404.

### Contact form (Netlify Forms)

- The contact form posts URL-encoded data to `/` with a `form-name=contact` field
  (`application/app/pages/Contact.tsx`).
- A hidden static `<form name="contact" netlify>` in `index.html` lets Netlify’s build bot
  register the form (required for a Vite SPA, since Netlify doesn’t parse JSX).
- A honeypot field (`bot-field`) reduces spam.
- Submissions appear in **Netlify dashboard → Forms**. Configure email/Slack notifications there.
- The form fails gracefully off-Netlify (e.g. local `pnpm dev`): it shows an error state and
  points users to the email address.

## Alternative hosts

The site works on any static host **if you add an SPA fallback**:

| Host          | SPA fallback                                                        |
| ------------- | ------------------------------------------------------------------- |
| Vercel        | Add `vercel.json` with a rewrite `{ "source": "/(.*)", "destination": "/" }` |
| GitHub Pages  | Add a `404.html` copy of `index.html`                               |
| Cloudflare    | Pages auto-handles SPA; set output dir `dist`                       |
| Nginx/Apache  | `try_files $uri /index.html;` / rewrite to `index.html`             |

> Note: the contact form’s Netlify Forms integration only works on Netlify. On other hosts,
> swap the form action for an alternative (Formspree, Getform, a serverless function, etc.).

## Pre-deploy checklist

- [ ] `pnpm build` succeeds.
- [ ] `pnpm exec tsc --noEmit` reports no errors.
- [ ] Update the production domain in `index.html` (canonical/OG URLs),
      `usePageMeta.ts` (`SITE_URL`), `robots.txt`, and `sitemap.xml`
      (currently `https://mutis.co.uk`).
- [ ] Verify deep links (e.g. `/sponsors`) load after a hard refresh.
- [ ] Submit a test message and confirm it appears in Netlify Forms.
