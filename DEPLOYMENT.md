# Deployment Guide

The MUTIS site is a React + Vite SPA that talks to a Supabase backend (Postgres, Auth, Storage,
Edge Functions). It builds to `dist/` and is hosted on **Vercel**.

## Build

```bash
pnpm install
pnpm build        # outputs dist/
```

## Vercel

Configuration lives in [`vercel.json`](vercel.json):

```json
{
  "rewrites": [
    { "source": "/(.*)", "destination": "/index.html" }
  ]
}
```

Steps:

1. Connect the repository in the Vercel dashboard (or `vercel deploy`).
2. Vercel auto-detects the Vite project — build command `pnpm build`, output directory `dist`.
3. The rewrite rule in `vercel.json` makes deep links like `/meif` or `/admin/sponsors` resolve
   to `index.html` so a refresh doesn't 404, while React Router handles the actual routing
   client-side (see `app/pages/NotFound.tsx` for the caveat this implies for real 404s).
4. Set the Supabase environment variables (see below) in the Vercel project's Environment
   Variables settings for Production, Preview, and Development as needed.

### Environment variables

The client reads its Supabase project URL and anon key via Vite env vars (see
`application/lib/supabase.ts`). Set these in Vercel:

- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_ANON_KEY`

Server-side secrets (e.g. the eToro API keys, service-role keys used by Edge Functions) live in
Supabase itself — either as Supabase Vault secrets or Edge Function environment variables — never
in the Vercel/client environment.

### Forms

All public forms (contact, sponsorship enquiry, event signup, attendance) insert directly into
Supabase tables from the client (`contact_submissions`, `sponsorship_enquiries`, `event_signups`,
`attendance_submissions` — see `supabase/migrations`). A client-side honeypot field
(`bot-field`) reduces spam; submissions are reviewed in the admin panel's **Submissions** inbox
(`/admin/submissions`), not a third-party forms dashboard.

## Supabase setup

- Apply migrations in `supabase/migrations/` to the project's Postgres database.
- Deploy the Edge Functions in `supabase/functions/` (`admin-add-by-email`, `etoro-portfolio`,
  `etoro-set-key`, `purge-storage-cache`) via the Supabase CLI or dashboard.
- Configure Supabase Auth (email/password) for admin accounts — access is invite-only via the
  Manage Admins page, backed by the `admin-add-by-email` function.

## Pre-deploy checklist

- [ ] `pnpm build` succeeds.
- [ ] `pnpm exec tsc --noEmit` reports no errors.
- [ ] Update the production domain in `index.html` (canonical/OG URLs) and `usePageMeta.ts`
      (`SITE_URL`), plus `robots.txt` and `sitemap.xml`.
- [ ] Verify deep links (e.g. `/sponsors`, `/admin/events`) load after a hard refresh.
- [ ] Confirm Supabase env vars are set for the target Vercel environment.
- [ ] Submit a test message on `/contact` and confirm it appears in the admin Submissions inbox.
