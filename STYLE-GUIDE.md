# STYLE GUIDE — Frank Evbota Portfolio

Code-level conventions for this repository. `DESIGN.md` covers the visual
system; this file covers how to write code that stays consistent with it.

---

## 1. Naming

### CSS

- All custom classes are prefixed `fe-` (e.g. `fe-case-display`, `fe-footer__nav`).
- BEM-ish structure: block `__element` --modifier.
  - `fe-footer` / `fe-footer__inner` / `fe-footer__nav` / `fe-footer__cta` / `fe-footer__legal`
- State classes use `is-` or `has-` prefixes: `is-open`, `is-active`, `is-in`.
- Section rhythm marker: `fe-rhythm` — every direct child of `<main>` carries it.
- Custom properties use `--fe-` prefix.

### JavaScript

- Files are kebab-case: `scroll-animations.js`, `page-transitions.js`,
  `hero-premium.js`, `discovery-tabs.js`.
- Behaviour hooks are data attributes: `data-animate`, `data-animate-premium`,
  `data-parallax`, `data-stagger`, `data-delay`, `data-fe-menu`, `data-fe-nav`.
- Prefer data attributes over adding classes for JS hooks.

### HTML

- Pages: `kebab-case.html` at repo root (`case-study-readwell.html`).
- Case study assets live in `assets/images/case-<project>/` with sub-folders
  mirroring the case study chapters: `discovery/`, `ideation/`,
  `Guidelines & Libraries/`, `hifi/`, `Iterations/`, `Highlights/`, `outcomes/`.

---

## 2. HTML Conventions

- Semantic elements first: `<header>`, `<main>`, `<section>`, `<footer>`,
  `<nav>`. Never `<div>` for structural containers.
- Exactly one `<h1>` per page. Heading levels never skip.
- Interactive elements use the right element: `<a>` for navigation, `<button>`
  for actions, `<label for>` bound to every form control.
- Buttons that open UI carry `aria-expanded`, `aria-controls`, and an
  `aria-label` that reflects state ("Open menu" / "Close menu").
- Decorative elements get `aria-hidden="true"`.
- Images: descriptive `alt` for meaningful content, empty/decorative handling
  for chrome.
- Landmarks: one `<main>`, `<nav aria-label="...">` per navigation region.

### No inline styles

Layout and typography live in `brand.css`. If a value is needed more than
once, it is a rule. Inline `style="..."` is only acceptable for a true
one-off data value (e.g. a per-item progress width) — never for layout.

> Historical note: footers previously carried a large block of inline styles
> across all six pages. That was consolidated into
> `.fe-footer__inner / __nav / __cta / __legal` in `brand.css`. Do not
> reintroduce per-page inline layout.

---

## 3. CSS Conventions

### Ordering

Files load in this order, and specificity/ordering matters:

```
bootstrap.min.css  →  main.css  →  brand.css  →  page-transitions.css  →  discovery-tabs.css
```

`brand.css` is the brand overlay and must stay last among the base layers.

### The rhythm layer

`brand.css` ends with an authoritative override layer marked
`/* RHYTHM LAYER */`. It resolves section margins, gutters, and fill for
every `fe-rhythm` child of `<main>`. When a spacing problem appears, fix it
in the rhythm layer rather than adding a new `!important` rule earlier in
the file.

### `!important` policy

`!important` is used deliberately and sparingly in `brand.css` to beat the
legacy `bootstrap.min.css` and `main.css` cascade, and to keep the rhythm
layer authoritative. New rules should avoid it unless they are overriding
the legacy base.

### Specificity traps

`.fe-case-block h2` (0,1,1) outranks `.fe-case-display` (0,1,0). When an
element is both a chapter title and a section heading, scope the narrower
rule explicitly:

```css
/* Section headings — excludes the chapter title, which is also an h2 */
.fe-case-block h2:not(.fe-case-display),
.fe-iter-heading { … }
```

Before changing a heading tag, check every rule that targets it by tag.
`main.css` contains bare `h1`–`h6` rules that set `font-size` and
`font-family` from `--heading-*` variables, so tag changes are not
style-neutral unless the class rules already win.

### Mobile-first

Author base rules for the small screen, then layer up with
`@media (min-width: …)`. `360px` is the minimum supported width. Do not
introduce a layout that requires horizontal scrolling below `360px`.

Breakpoints in use: `400px`, `600px`, `960px`, `1200px`, `1440px`.

### Reduced motion

Any new animation needs a `prefers-reduced-motion: reduce` counterpart, and
JS-driven motion must check
`window.matchMedia("(prefers-reduced-motion: reduce)").matches`.

---

## 4. JavaScript Conventions

- Plain ES5-compatible IIFE style with `"use strict"` — no modules, no build
  step, no bundler. The site is served as static files.
- Guard on feature support before use (e.g. `IntersectionObserver`).
- Use `requestAnimationFrame` for scroll/resize handlers, with a ticking flag
  to avoid redundant frames.
- Scroll listeners must be `{ passive: true }`.
- Never block rendering: GSAP and ScrollTrigger load at the end of `<body>`.

---

## 5. Assets

- Pages use resized, compressed `.webp` delivery variants for large raster
  images; keep the original PNG/JPEG sources for editing and archive pages.
- Small raster images and vector icons may stay in their original format.
- Filenames: lowercase, hyphen-separated, prefixed with the project slug
  (`readwell-`, `theshop-`, `me-` for MexiEats).
- Spaces in filenames are allowed (they appear URL-encoded as `%20` in
  `src`), but prefer hyphens for new files.
- Every referenced asset must exist on disk — verify with the asset check in
  `output/qa/`.
- Favicons live in `assets/images/icons/`.

---

## 6. Adding a Page

1. Copy an existing page to preserve the `<head>` block and script order.
2. Use `<header class="fe-header">` + `<main>` + `<footer class="fe-footer">`.
3. Mark every direct child of `<main>` with `fe-rhythm`.
4. Use the existing `fe-footer` markup (the refactored, class-based version).
5. Reuse the shared footer markup verbatim — do not fork it per page.
6. Add the page to the nav in every page's `<header class="fe-nav">`.

---

## 7. Verification Before Committing

Run the checks in `output/qa/` against a local server on port `8765`
(`python -m http.server 8765 --bind 127.0.0.1`):

| Script | Checks |
|---|---|
| `audit_v2.js` | Overflow, broken images, console errors across 7 widths × 6 pages |
| `a11y.js` | Heading outline, tap targets, alt text, labels, contrast |
| `contrast.js` | WCAG AA contrast on rendered text |
| `fullcheck.js` | JS errors, 4xx responses, broken images over HTTP |
| `snapshot.js` + `snapdiff.js` | Computed-style regression diff |

Do not open a dev server on ports `20129`, `20128`, `8080`, or `8081`.
