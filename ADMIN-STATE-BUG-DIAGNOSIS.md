# Admin panel "soft refresh" — root cause diagnosis

## Summary

There are **two independent, compounding bugs**, not one. Neither is a real
page reload and neither is caused by a `key` prop forcing a remount.

1. **`ProtectedRoute` unmounts the entire admin subtree on every Supabase
   auth event, not just real sign-in/out.** This can happen with zero in-app
   navigation — e.g. an admin idles on a page and a background token refresh
   fires, or they alt-tab away and back.
2. **The edit-drawer form state (`editing`/`form`/`pendingDelete`) was never
   wired into the app's own existing "survive navigation" cache**, unlike
   every other piece of page state (list rows, filters, search), which
   already survives navigation correctly.

## What was ruled out

- **Real full-page reload**: no `window.location.href`/`window.location.reload()`
  navigation calls and no plain `<a href>` used for in-app navigation. The
  admin sidebar uses `<NavLink>` (`application/app/admin/AdminLayout.tsx`
  lines 90–104) — genuine SPA client-side routing. The only `window.location`
  usage in the admin app is `Login.tsx:55`, building a `redirectTo` string
  for a password-reset email — not a navigation call. The only `<a href>` in
  admin pages is `Documents.tsx:192`, opening a PDF in a new tab.
- **`key`-prop-forced remount**: no route component or `<Outlet/>` uses a
  `key` prop anywhere in `routes.tsx`, `AdminRoot.tsx`, or `AdminLayout.tsx`.
  The only `key=` usage found scoped to a form is `Events.tsx:319`
  (`key={editing === "new" ? "new" : editing?.id}` on a `RichTextEditor`),
  which resets that one rich-text editor when switching which row is being
  edited *within* an already-open drawer — unrelated to route navigation.
- **Refetch-on-window-focus from a data-fetching library**: no TanStack
  Query, SWR, or similar is installed or used anywhere in the repo (grep for
  `react-query|swr|useSWR|QueryClient|refetchOnWindowFocus` found no hits in
  application code; `admin-panel-plan.md` explicitly documents the decision
  not to use one — every page is hand-rolled `useState`/`useEffect`).
- **A custom `visibilitychange`/`focus` listener in app code**: none found
  anywhere in `application/`. Any visibility-triggered behavior comes from
  the Supabase SDK's own internals (see Bug 1 below), not from repo code.

## Bug 1 — `ProtectedRoute` unmount on every auth event

**Files:** `application/app/admin/AuthProvider.tsx` (lines 33–67),
`application/app/admin/ProtectedRoute.tsx` (lines 5–15)

`AuthProvider`'s `onAuthStateChange` handler:

```ts
const { data: subscription } = supabase.auth.onAuthStateChange((_event, nextSession) => {
  if (cancelled) return;
  setSession(nextSession);
  setIsLoading(true);                       // <-- fires on EVERY event, any type
  if (nextSession) {
    checkIsAdmin(nextSession.user.id).then((admin) => {
      if (!cancelled) {
        setIsAdmin(admin);
        setIsLoading(false);
      }
    });
  } else {
    setIsAdmin(false);
    setIsLoading(false);
  }
});
```

The event type (`_event`) is discarded, so `TOKEN_REFRESHED`, a re-fired
`SIGNED_IN`, `USER_UPDATED`, etc. are all treated identically to a genuine
sign-in: `isLoading` is set to `true` immediately, then an async
`admin_users` lookup runs before it's set back to `false`.

`@supabase/supabase-js` is `^2.111.0` (`package.json`), created with default
options (`application/lib/supabase.ts` — no explicit `autoRefreshToken`/
`persistSession` overrides), so `autoRefreshToken: true` and
`persistSession: true` are active. Supabase-js v2's internal `GoTrueClient`
registers its own `document.visibilitychange` listener and separately runs a
timer-based silent token refresh before expiry — both of which can emit
`onAuthStateChange` events with **no user action at all**. This is
documented, widely-reported behavior of the SDK itself, not something
specific to this repo — but this repo's handler reacts to it destructively.

`ProtectedRoute`:

```tsx
export function ProtectedRoute() {
  const { session, isAdmin, isLoading, signOut } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Loader2 className="h-6 w-6 animate-spin text-accent" aria-label="Loading" />
      </div>
    );
  }
  ...
  return <Outlet />;
}
```

`ProtectedRoute` sits directly above `AdminLayout` in the route tree
(`application/app/routes.tsx` lines 82–171:
`ProtectedRoute → AdminLayout → <individual admin page>`). Whenever
`isLoading` flips to `true`, `ProtectedRoute` stops rendering `<Outlet/>`
and renders a spinner `<div>` in its place — which unmounts `AdminLayout`
**and** the currently-active admin page, drawer, and all of its local
`useState`. When the async admin check resolves, `isLoading` flips back to
`false`, `<Outlet/>` renders again, and the page component **remounts from
scratch**, with fresh `useState` defaults — silently discarding any
unsaved local form state (see Bug 2).

Why this matches the reported symptom: it explains data loss correlated
with idling/being away (a background `TOKEN_REFRESHED` firing on its own
timer, or tab-refocus re-validation) even with **no** in-app navigation, and
explains why the loss feels intermittent/timing-dependent rather than
100%-reproducible on every single click — it depends on whether an auth
event happens to fire around the same time.

## Bug 2 — drawer/form state not wired into the existing cache pattern

**Files:** `application/app/admin/usePageCache.ts`,
`application/app/admin/pages/Sponsors.tsx` (representative; same pattern in
12 other pages)

The codebase already has a deliberate, working solution for "state that
should survive a route unmount":

```ts
// application/app/admin/usePageCache.ts
const cache = new Map<string, unknown>();

/**
 * Like useState, but the value survives this component unmounting — e.g. navigating
 * to another admin page and back — by persisting in a module-level cache keyed by
 * `key`. Used so list data, search text, and filters aren't reset on every visit.
 */
export function usePageCache<T>(key: string, initialValue: T): [T, Dispatch<SetStateAction<T>>] {
  const [value, setValue] = useState<T>(() => (cache.has(key) ? (cache.get(key) as T) : initialValue));
  useEffect(() => { cache.set(key, value); }, [key, value]);
  return [value, setValue];
}
```

Every list page already uses this correctly for list data and filters, e.g.
`Sponsors.tsx` lines 44–48:

```ts
const [rows, setRows] = usePageCache<Sponsor[]>("admin:sponsors:rows", []);
const [tierFilter, setTierFilter] = usePageCache<"all" | Tier>("admin:sponsors:tierFilter", "all");
const [publishedFilter, setPublishedFilter] = usePageCache(...);
const [search, setSearch] = usePageCache("admin:sponsors:search", "");
```

But the edit-drawer state on the same page is **not** cached — plain,
unlifted `useState`:

```ts
// Sponsors.tsx lines 50-53
const [editing, setEditing] = useState<Sponsor | "new" | null>(null);
const [form, setForm] = useState<FormState>(EMPTY_FORM);
const [saving, setSaving] = useState(false);
const [pendingDelete, setPendingDelete] = useState<Sponsor | null>(null);
```

So: open the "Add/Edit" drawer, start typing, navigate to a different admin
tab — the `Sponsors` component unmounts (a route change swaps which lazy
page is rendered under `AdminLayout`'s `<Outlet/>`, which is normal,
expected React Router behavior, not a bug by itself). Because `editing`/
`form` were never lifted into `usePageCache` the way `rows`/`search`/filters
were, they reset to `null`/`EMPTY_FORM` on remount — even navigating right
back to the same tab shows the drawer closed and the typed values gone. The
rest of the page (list, filters, search) correctly reappears exactly as
left, which is precisely what makes the form-field loss read as an
inconsistent, unannounced "soft refresh" rather than expected behavior.

The identical `editing`/`form`/`pendingDelete` pattern (same shape, verbatim
structurally) exists in 13 files: `Sponsors.tsx`, `Committee.tsx`,
`Events.tsx`, `Alumni.tsx`, `FundManagers.tsx`, `PreviousPresidents.tsx`,
`HomePrograms.tsx`, `Articles.tsx`, `Gallery.tsx`, `Recordings.tsx`,
`PastSpeakers.tsx`, `Documents.tsx`, `SponsorshipPackages.tsx`.

Single-form settings pages (`SiteSettings.tsx`, `PodcastSettings.tsx`)
**already do this correctly** — `form`/`url` are stored via `usePageCache`,
and a background refetch only populates the form if there's no cached draft
yet (`setForm((prev) => prev ?? {...freshData})`), with the comment: "Only
populate the form on first load — a background refetch on revisit shouldn't
clobber an in-progress edit the admin hasn't saved yet." This is the
reference pattern the fix generalizes to the other 13 pages.

No existing unsaved-changes protection was found anywhere (`beforeunload`,
`useBlocker`, `unstable_usePrompt` — no matches via repo-wide grep), so
there was also no warning before an intentional discard (closing the
drawer, closing the tab) — a gap the fix also closes.

## Fix

See the implementation for the concrete changes: `AuthProvider.tsx` now
only gates rendering on a genuine session-identity change (not every SDK
re-fire), and a new `useDrawerFormCache` hook lifts `editing`/`form`/
`pendingDelete` into the existing cache pattern across all 13 list+drawer
pages, plus a `beforeunload`/dirty-close guard so unsaved edits are never
silently discarded.
