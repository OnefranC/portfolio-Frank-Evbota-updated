# DESIGN.md — Frank Evbota Portfolio

Design system reference for the portfolio rebuild. This document describes the
system that is actually implemented in `assets/css/brand.css`, not an intended
future state.

---

## 1. Design Intent

A quiet, editorial product-design portfolio. The site reads as a long-form
case-study document rather than a marketing page: generous white space,
centred chapter titles, and a single dark "old Framer" shell colour that
anchors the case studies.

Two coexisting visual registers:

| Register | Where | Character |
|---|---|---|
| **Brand (home)** | `Home.html`, `projects.html`, `contact-me.html` | Manrope/Inter, near-black ink on white, pill buttons, rounded 20px surfaces, 3D parallax hero |
| **Case fidelity** | `case-study-*.html` | Lato, `#253746` shell text, flat square corners, centred chapter titles — reproduces the original Framer export |

Case studies deliberately keep the original Framer typography so the work
reads as authentic rather than re-skinned.

---

## 2. Colour

### Brand tokens (`brand.css` `:root`)

| Token | Value | Use |
|---|---|---|
| `--fe-ink` | `#121515` | Primary text, dark surfaces |
| `--fe-muted` | `#5c6568` | Secondary/supporting text |
| `--fe-line` | `#e8eef3` | Hairline borders, dividers |
| `--fe-soft` | `#f1f2f4` | Subtle fills, hover states |
| `--fe-accent` | `#1a1f20` | Accent ink |
| `--fe-white` | `#ffffff` | Page background |
| `--fe-radius` | `20px` | Card corner radius (brand register) |

### Case-study palette (not tokenised — literal values, intentional)

| Value | Use |
|---|---|
| `rgb(37, 55, 70)` / `#253746` | Case chapter titles, footer + CTA band background |
| `rgb(81, 95, 107)` | Case body copy |
| `rgb(94, 107, 129)` | Case meta / supporting copy |
| `rgba(255,255,255,0.72)` | Footer body text on the dark band |
| `rgba(255,255,255,0.85)` | Footer link text on the dark band |

### Contrast

All text/background pairs used in production pass WCAG 2.1 AA (4.5:1 for body,
3:1 for large text). Verified programmatically — see *Verification* below.

---

## 3. Typography

| Role | Stack | Where |
|---|---|---|
| Display | `"Manrope", "Inter", system-ui, sans-serif` (`--fe-display`) | Brand headings, marquee, project card titles |
| Body | `"Inter", "Manrope", system-ui, sans-serif` (`--fe-font`) | Brand body copy, nav, buttons |
| Logo | `"Fraunces", "Manrope", Georgia, serif` (`--fe-logo`) | The `fe.` monogram only |
| Case title | `"Lato", "Inter", system-ui, sans-serif` | All case-study headings and body |

Case-study sizing (as shipped):

| Element | Size | Line height | Weight |
|---|---|---|---|
| Chapter title (`.fe-case-display`) | `clamp(28px, 8vw, 40px)` | `1.15` | 400 |
| Chapter title, desktop | `52px` | `60px` | 400 |
| Section heading (`.fe-case-block h2`) | `28px` | `36px` | 400 |
| Sub-heading (`.fe-iter-title`, `.fe-retro__h`) | `32px` | `40px` | 400 |
| Body (`.fe-retro__p`) | `16px` | `24px` | 500 |

Mobile minimum: no text renders below `11px`. Body copy never drops below
`16px`; `11–12px` is reserved for uppercase eyebrow/label chips.

---

## 4. Spacing & Layout

### Rhythm layer

Page-level spacing is resolved by a single authoritative override layer at the
end of `brand.css`, marked `/* RHYTHM LAYER */`. Every direct child of `<main>`
carries the `fe-rhythm` marker class. This layer is the last word on section
margins and gutters; earlier rules are authoring conveniences.

### Gutters

| Breakpoint | Page margin | Notes |
|---|---|---|
| `≤ 600px` | `16px` | Mobile baseline; `360px` is the supported floor |
| `601–960px` | `32px` | Tablet |
| `≥ 961px` | `160px` | Desktop, with `.fe-footer` overridden to `80px` |

### Content width

`1200px` max-width on brand sections; `.fe-footer__inner` is `1280px`.

### Corners

- Brand register: `20px` radius on cards, `999px` (pill) on chips and buttons.
- Case-study register: square edges (`border-radius: 0`) on the dark bands,
  matching the original Framer export.

---

## 5. Mobile-First Approach

**Minimum supported width is `360px`.** The CSS is authored mobile-first:
base rules describe the small screen, and `@media (min-width: …)` layers add
complexity as space allows. Breakpoints used:

`400px` (extra-small) → `600px` → `601–960px` → `960px` → `1200px` → `1440px`

Mobile-specific behaviour:

- Below `960px` the primary nav collapses into a burger-triggered overlay card
  (`.fe-nav.is-open`), positioned top-right, with `aria-expanded` and
  `aria-label` state on the button.
- Discovery / Ideation tab panels stack to a single column.
- The evaluations table becomes a stacked layout.
- `prefers-reduced-motion: reduce` disables scroll reveals, the marquee
  animation, and parallax in both CSS and `assets/js/scroll-animations.js`.

---

## 6. Accessibility

| Rule | Implementation |
|---|---|
| One `<h1>` per page | Home, Projects, Contact, and each case study have exactly one |
| No heading-level skips | Case studies run `H1 → H2 → H3`; `projects.html` uses a visually-hidden `H2` to bridge `H1 → H3` |
| Visible focus | `:focus-visible` outlines on links, buttons, and the burger |
| Tap targets | Footer nav links and the burger are ≥ `32px` tall (WCAG 2.5.8) |
| Alt text | Every `<img>` has descriptive `alt`; decorative graphics use `aria-hidden` |
| Forms | Every input has a `<label for>`; the form posts to FormSubmit with `enctype="text/plain"` |
| Contrast | All text passes AA (4.5:1 body, 3:1 large) |
| Reduced motion | Honoured in CSS and JS |

---

## 7. Motion

| Motion | Trigger | Notes |
|---|---|---|
| Scroll reveal | `IntersectionObserver` on `[data-animate]` / `.fe-reveal` | Adds `.is-in`; staggered via `data-stagger` |
| Hero parallax | `[data-parallax]` | Desktop only (`> 900px`); disabled for reduced motion |
| Header auto-hide | Scroll direction | Hides past `240px` on scroll-down, desktop only |
| Page transition | `assets/js/page-transitions.js` | Fade/slide between pages |
| Marquee | CSS keyframes | `aria-hidden="true"`; 28s linear loop |

---

## 8. File Map

```
Home.html                     Home
projects.html                 Portfolio index
contact-me.html               Contact + form
case-study-*.html             Three case studies
brand.md                      Brand direction notes
STYLE-GUIDE.md                This document's companion: code-level conventions
assets/css/
  bootstrap.min.css           Legacy base (retained — still affects the cascade)
  main.css                    Legacy base + bare h1–h6 rules
  brand.css                   Brand overlay + rhythm layer (authoritative)
  page-transitions.css        Page transition animations
  discovery-tabs.css          Discovery/Ideation tab panels
assets/js/
  scroll-animations.js        Reveals, parallax, header, nav toggle
  page-transitions.js         Page transitions
  hero-premium.js             Hero 3D/parallax (home only)
  discovery-tabs.js           Tab panel logic (case studies)
  gsap/                       GSAP core + ScrollTrigger
assets/images/
  case-readwell/              case-readwell/
  case-theshop/
  case-mexieats/
  projects/                   Card thumbnails
  icons/                      Favicons
```

---

## 9. Verification

The following are enforced by scripts under `output/qa/` (gitignored) and must
pass before any change is considered complete:

| Check | Requirement |
|---|---|
| Horizontal overflow | `scrollWidth === viewportWidth` at 360 / 375 / 414 / 600 / 768 / 1024 / 1440 |
| Broken images | `naturalWidth > 0` for every `<img>` |
| Console errors | Zero `pageerror` and zero non-network console errors |
| Heading outline | Exactly one `<h1>`; no skipped levels |
| Contrast | AA pass on all rendered text |
| Tap targets | Interactive elements ≥ `32px` |
| Visual regression | Computed-style snapshot diff vs. baseline shows only intended deltas |
