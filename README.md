# Portfolio — Frank Evbota

A custom product design portfolio website for **Frank Evbota** built with
semantic HTML, CSS3, and JavaScript, featuring responsive layouts, smooth
animations, and detailed case studies.

No build step, no framework, no dependencies — the site is static files served
as-is.

---

## Project Structure

- `Home.html`: Homepage — hero, about details, services summary, featured work.
- `projects.html`: Portfolio overview of the three case studies.
- `contact-me.html`: Contact page with direct links and a working form.
- `case-study-readwell.html`: ReadWell — adult literacy learning app.
- `case-study-theshop.html`: TheShop — cross-platform retail platform.
- `case-study-mexieats.html`: MexiEats — food delivery app.
- `DESIGN.md`: Design system reference (colour, type, spacing, motion, a11y).
- `STYLE-GUIDE.md`: Code conventions for this repository.
- `brand.md`: Brand direction notes.
- `PLACEHOLDERS.md`: Asset provenance and template-inventory notes.
- `assets/`:
  - `css/`: `bootstrap.min.css`, `main.css` (legacy base), `brand.css`
    (brand overlay + rhythm layer), `page-transitions.css`,
    `discovery-tabs.css`.
  - `images/`: `case-readwell/`, `case-theshop/`, `case-mexieats/`,
    `projects/`, `icons/`.
  - `js/`: `scroll-animations.js`, `page-transitions.js`, `hero-premium.js`,
    `discovery-tabs.js`, `gsap/`.
- `original-framer-export-old/`: Preserved backup of the original Framer export.

---

## Design & Branding

Two coexisting registers — see `DESIGN.md` for the full system.

**Brand (home, projects, contact)**

- **Typography**: Inter, Manrope, Fraunces (Google Fonts).
- **Colour**: Ink `#121515`, Muted `#5c6568`, Line `#e8eef3`, Soft `#f1f2f4`,
  White `#ffffff`, Radius `20px`.

**Case fidelity (case studies)**

- **Typography**: Lato.
- **Colour**: Shell `rgb(37, 55, 70)`, body `rgb(81, 95, 107)`,
  meta `rgb(94, 107, 129)`.

---

## Layout Rhythm

Page-level spacing and fill live in a single override layer at the end of
`brand.css`, marked `/* RHYTHM LAYER */`. Every direct child of `<main>`
carries a `fe-rhythm` marker class, and the layer resolves the section rhythm.

| Breakpoint | Page margin | Notes |
|---|---|---|
| `≤ 600px` | `16px` | Mobile; `360px` is the supported floor |
| `601–960px` | `32px` | Tablet |
| `≥ 961px` | `160px` | Desktop (footer overridden to `80px`) |

---

## Accessibility

- Exactly one `<h1>` per page; no skipped heading levels.
- All text meets WCAG 2.1 AA contrast.
- Interactive targets are ≥ `32px`; visible `:focus-visible` outlines.
- Every image has `alt`; every form control has a `<label for>`.
- `prefers-reduced-motion` honoured in CSS and JS.

---

## Local Development

Serve the directory over HTTP (port `8765` is used by the QA scripts):

```bash
python -m http.server 8765 --bind 127.0.0.1
```

Then open <http://127.0.0.1:8765/>.

Do not open a dev server on ports `20129`, `20128`, `8080`, or `8081`.

---

## Verification

QA scripts live in `output/qa/` (gitignored) and are run against the local
server. See `STYLE-GUIDE.md` §7 for the full list and what each script checks.
