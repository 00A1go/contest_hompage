# CLAUDE.md

## Project

Static website for the 2026 Gyeongsan Science High School AI Convergence Challenge (2026 AI 창의융합대회). Deployed to GitHub Pages. No server, no build step.

- **Stack**: Vanilla HTML + CSS + JavaScript. No frameworks.
- **Deployment**: GitHub Pages, auto-deploy on push to `main`.
- **Data source of truth**: `data/works.json`.
- **Full spec**: see `SPEC.md`. This file is for working conventions and gotchas.

---

## Directory Layout

```
/
├── *.html              # One file per page (index, about, schedule, works, results, contact)
├── assets/
│   ├── css/style.css   # Single stylesheet
│   ├── js/             # common.js, works.js, results.js
│   ├── images/
│   └── video/
├── data/works.json     # All competition entries
├── partials/           # header.html, footer.html — injected via fetch
└── .github/workflows/  # JSON validation on PR
```

---

## Non-Negotiables

- **No build step.** Do NOT introduce npm, bundlers, TypeScript, Sass, or frameworks. The site must run by opening HTML files with a static server.
- **No runtime dependencies.** Do NOT add `package.json`. If an external lib is truly required, vendor it under `assets/vendor/` as a static file.
- **No backend.** Contact and submission use `mailto:`. Do NOT add forms that require a server (Formspree, Netlify Forms, etc. are also out — this is meant to stay simple).
- **Data lives in JSON, not HTML.** Never hardcode competition entries into markup. `works.html` and `results.html` render from `data/works.json`.
- **Relative paths only.** Use `assets/css/style.css`, not `/assets/css/style.css`. GitHub Pages may serve from a subpath (`<user>.github.io/<repo>/`) and absolute paths will 404.

---

## Conventions

### HTML
- One file per page at repo root. No SPA routing.
- Every page includes these placeholders before `common.js`:
  ```html
  <div id="site-header"></div>
  <!-- page content -->
  <div id="site-footer"></div>
  <script src="assets/js/common.js" defer></script>
  ```
- Set unique `<title>` and `<meta name="description">` per page.
- Include Open Graph tags on all pages.
- Use semantic elements (`<nav>`, `<main>`, `<section>`, `<article>`).

### CSS
- Single stylesheet: `assets/css/style.css`.
- Design tokens as CSS custom properties in `:root`.
- Mobile-first: base styles target mobile, `@media (min-width: 641px)` scales up.
- Class naming: kebab-case; BEM-style modifiers (`card__title`, `card--featured`) allowed but not required.
- No preprocessors. No CSS-in-JS.

### JavaScript
- Plain `<script defer>`. No modules bundling required; native ES modules are fine if used sparingly.
- Target: last 2 versions of Chrome, Safari, Edge, Firefox. No transpilation.
- `const` / `let` only. No `var`.
- Wrap page-specific logic in an IIFE or module scope to avoid globals.
- Prefer `fetch` + `async/await` over callbacks.

### Naming
- Files & folders: `kebab-case`.
- JS: `camelCase` for identifiers, `UPPER_SNAKE` for constants.
- Data IDs (`works.json`): `{category}-{sequential}`, e.g. `physics-03`.

---

## Data Schema

`data/works.json`:

```json
{
  "works": [
    {
      "id": "math-01",
      "category": "math",
      "title": "...",
      "team": ["...", "..."],
      "youtubeId": "dQw4w9WgXcQ",
      "description": "",
      "award": null
    }
  ]
}
```

- `category` ∈ `math | physics | chemistry | biology | earth | humanities`
- `youtubeId` is the 11-char ID, not the full URL
- `award` is `null` before results announcement; set to `"대상" | "금상" | "은상" | "동상" | "장려상"` when results are posted
- See `SPEC.md` §5 for full field rules

---

## Common Tasks

### Add a new work entry
Edit `data/works.json`, append to `works[]`, ensure `id` is unique, commit. GitHub Actions validates JSON; Pages auto-deploys within 1-2 min.

### Update the schedule
Edit `schedule.html` directly. Dates are inline text.

### Post competition results
Set `award` field on winning entries in `data/works.json`. `results.html` renders from this — no template edits needed.

### Add a new category
1. Add key to `CATEGORIES` map in `assets/js/works.js`
2. Add tab button in `works.html`
3. Update `SPEC.md` §5.2

### Change the theme color
Edit CSS variables in `:root` inside `assets/css/style.css`. Do not scatter hex values.

---

## Local Preview

Opening HTML files directly with `file://` breaks `fetch()` for `partials/` and `data/` due to CORS. Always run a static server:

```bash
python3 -m http.server 8000
# then open http://localhost:8000
```

Or `npx serve .` if Node is available.

---

## Gotchas

- **Hero video autoplay** requires `muted playsinline` — browsers block autoplaying audio. Keep both attributes.
- **JSON syntax errors** (trailing comma, unquoted key) break the entire works page. The `validate.yml` workflow catches these on PR; still preview locally before pushing.
- **YouTube embeds** use `youtube-nocookie.com`, not `youtube.com/embed/`. Kept for privacy compliance.
- **GitHub Pages cache** takes 1-2 minutes to update. Hard-refresh (Cmd/Ctrl+Shift+R) if changes don't appear.
- **Category slugs** must match between `works.json`, `works.js` CATEGORIES map, `works.html` tab buttons, and URL hash. Renaming one without the others silently breaks the tab.
- **Do not URL-encode YouTube IDs** in the iframe `src` — they're already URL-safe.

---

## When Instructions Are Ambiguous

- If asked to "add a feature," first check whether it can be done by editing `data/works.json` or existing HTML/CSS. Prefer content changes over code changes.
- If a request implies a backend (form submission, live data, auth), stop and confirm — the project is intentionally static.
- If a request implies a framework (React component, Vue, etc.), stop and confirm — the project is intentionally vanilla.
- When editing data, preserve field order across entries for readability.

---

## Language

- Code, comments, commit messages, file/folder names: **English**
- UI text (page copy, button labels, error messages shown to users): **Korean**
- `SPEC.md`: Korean (audience is the maintainer)
- `README.md`: Korean (audience is the next-year admin, likely non-developer)
- `CLAUDE.md`: English (this file, audience is Claude)
