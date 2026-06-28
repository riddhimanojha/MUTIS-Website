# Accessibility

This document records the accessibility work done and the known gaps.

## Implemented

### Navigation
- **Mobile menu** (`Header.tsx`): real hamburger button with `aria-expanded`,
  `aria-controls`, and a contextual `aria-label` ("Open menu" / "Close menu").
- The panel is a `role="dialog"` + `aria-modal="true"` with `aria-label`.
- **Keyboard**: `Esc` closes the menu; `Tab`/`Shift+Tab` are trapped within the panel.
- **Focus management**: focus moves to the first menu link on open and returns to the
  hamburger button on close.
- **Scroll lock**: body scroll is disabled while the menu is open.
- Active route is highlighted in both desktop and mobile nav.

### Global
- **Skip link** ("Skip to content") jumps to `<main id="main-content">`.
- **`:focus-visible`** outlines (2px accent ring, 3px offset) on all interactive elements.
- **`prefers-reduced-motion`**: reduces animations/transitions to ~0ms and forces reveal
  elements (`.r-up/.r-left/.r-right`) to their final visible state, so no content is hidden.
- Semantic landmarks: `<nav>`, `<main>`, `<footer>`, headings per section.

### Forms (Contact)
- Every input has an associated `<label htmlFor>` ↔ `id`.
- `required` + client-side validation with an `role="alert"` error region and a
  `role="status"` success region.
- The submit button exposes `aria-busy` and is disabled while sending.
- Honeypot field is visually hidden and `tabIndex={-1}`.

### Media
- Decorative duplicated gallery images use empty `alt` + `aria-hidden`; the first copy
  carries descriptive alt text.
- Committee headshots fall back to an initials avatar (`aria-hidden`, name still in text).
- Sponsor logos fall back to initials on load error.

## Color contrast

Primary CTAs were failing WCAG AA (white `#fff` text on cyan `#15b8e1` ≈ **2.2:1**).
Fixed by switching button text to dark ink `#02050d` on cyan, raising contrast to ≈ **9:1**
(passes AA and AAA for normal text). Applies to `.btn-primary`, `.cta-btn`,
`.cta-section .cta-btn`, and `.nav-cta:hover`.

## Known gaps / future work

- The cinematic homepage still uses scroll-position-driven transforms; with reduced motion
  these snap rather than animate but are not fully removed.
- Color contrast of some secondary muted text (`--dim`, `--accent-2`) on dark panels should
  be re-checked against AA for small text if those strings become essential content.
- No automated a11y test in CI yet. Recommend adding `axe-core`/Playwright checks.

## How to verify

- Keyboard-only: Tab through nav, open/close the mobile menu, complete the form.
- Run Lighthouse → Accessibility, and/or axe DevTools, on each route.
- Toggle OS "Reduce motion" and confirm content remains visible and usable.
