# CLAUDE.md

## Project Overview

Static single-page landing site for a private lawyer — Anastasia Kochetkova (Екатеринбург).
Domain: **ak-law66.ru**. Deployed on **Vercel**.

## Tech Stack

- **No framework, no build step** — plain HTML + CSS + vanilla JavaScript
- Fonts: Google Fonts (Playfair Display, Inter)
- Icons: Font Awesome 6.5
- Hosting: Vercel (`vercel.json` with SPA fallback)
- Analytics: Yandex.Metrika (counter ID is a placeholder `XXXXX` — needs replacement)

## File Structure

```
index.html          — main page (all sections in one file)
style.css           — all styles, BEM-like naming, CSS custom properties
script.js           — sticky header, burger menu, scroll spy, phone mask,
                      form validation, IntersectionObserver animations,
                      FAB button, cookie banner, Yandex.Metrika goals
consent.html        — personal data consent page
privacy-policy.html — privacy policy page
vercel.json         — Vercel routing config
package.json        — minimal (no deps, no build)
img/                — images (photo-hero.jpg, photo-about.jpg)
feed.xml            — RSS feed
sitemap.xml         — sitemap
robots.txt          — robots
llms.txt            — LLM-friendly site description
```

## Conventions

- **CSS**: BEM-like methodology (`.block__element`, `.block--modifier`). Design tokens in `:root` variables (`--color-*`, `--font-*`, `--radius-*`, etc.).
- **JS**: All logic inside a single `DOMContentLoaded` listener. Numbered sections in comments.
- **HTML**: Semantic sections with `id` attributes for navigation anchors. Schema.org JSON-LD structured data in `<head>`.
- **Language**: All user-facing content is in Russian.

## Responsive Breakpoints

- `1100px` — tablet/small laptop adjustments
- `1024px` — burger menu activates, single-column about/contact
- `768px` — hero stacks vertically, single-column grids
- `600px` — smaller mobile tweaks
- `480px` — smallest mobile

## Known Placeholders / TODOs

- `XXXXX` in `index.html` and `script.js` — replace with real Yandex.Metrika counter ID
- Form submission is simulated with `setTimeout` — needs real backend integration
- Images in `img/` need real photos

## Common Tasks

- **Edit content**: directly in `index.html`
- **Edit styles**: `style.css`
- **Edit behavior**: `script.js`
- **Preview locally**: open `index.html` in browser (no server needed) or use `npx serve .`
