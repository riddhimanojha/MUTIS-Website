# Performance

## Current state (production build)

- JS bundle: ~430 KB (~136 KB gzip) - single chunk.
- CSS: ~66 KB (~13 KB gzip).
- Largest payload by far: the **past-event photo gallery** - 53 JPEGs in `Events/`,
  ~93–221 KB each (≈ 6–7 MB total), imported via `import.meta.glob`.

## Already done

- All gallery images use `loading="lazy"` + `decoding="async"`.
- Gallery `<img>` have explicit `width`/`height` (220×130) to prevent layout shift (CLS).
- Duplicated marquee copies use empty `alt` + `aria-hidden` (no a11y/SEO cost).
- Article and committee/sponsor images are lazy + async-decoded.
- Dependency tree trimmed (190 packages removed) → faster installs and smaller `node_modules`
  attack surface. (Unused deps did not affect the shipped bundle, which only includes imported
  modules.)
- `prefers-reduced-motion` halts the infinite marquee and other animations.

## High-impact next steps

### 1. Convert event photos to WebP/AVIF (biggest win)

The gallery renders at 220×130 but ships full-resolution WhatsApp JPEGs. Converting to WebP
at display size can cut the gallery payload by ~70–85%.

**One-off conversion (requires [sharp-cli](https://www.npmjs.com/package/sharp-cli) or `cwebp`):**

```powershell
# Using sharp-cli (npx, no install): resize to ~440px wide (2x for retina) + WebP
npx sharp-cli --input "Events/*.jpeg" --output "Events" `
  resize 440 --withoutEnlargement -- webp --quality 72
```

or with Google’s `cwebp`:

```powershell
Get-ChildItem "Events/*.jpeg" | ForEach-Object {
  cwebp -q 72 -resize 440 0 $_.FullName -o ("Events/" + $_.BaseName + ".webp")
}
```

Then update the glob in `application/app/pages/Events.tsx` (it already matches `webp`):

```ts
const eventImageModules = import.meta.glob(
  "../../../Events/*.{webp,avif,jpg,jpeg,png}",
  { eager: true, import: "default" },
);
```

Prefer WebP/AVIF when present. Keep originals in a separate `Events/originals/` folder
(outside the glob) so the source images aren’t lost. **No visual regression** expected - the
cells already crop with `object-fit: cover`.

### 2. Build-time image optimization (automated)

Add `vite-plugin-image-optimizer` (or `@vheemstra/vite-plugin-imagemin`) so every image is
compressed during `pnpm build` without manual steps.

### 3. Responsive `srcset`

For any large hero/article imagery, provide `srcset`/`sizes` so phones download smaller files.
The gallery is fixed-size so a single 2x WebP is sufficient.

### 4. Code-splitting

The app is one ~430 KB chunk. Route-level `React.lazy` + `Suspense` for heavy pages (e.g.
`Home` with its animations) would cut initial JS for users landing on subpages. Validate that
lazy boundaries don’t break the sticky/transform constraints noted in `routes.tsx`.

### 5. Font loading

Confirm web fonts in `fonts.css` use `font-display: swap` and are preconnected/preloaded to
avoid render-blocking.

## How to measure

- `pnpm build` then inspect the asset table for regressions.
- Lighthouse → Performance (mobile + desktop) on `/` and `/events`.
- Track LCP (hero) and CLS (gallery) specifically.
