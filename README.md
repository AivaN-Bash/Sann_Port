# SAAN NIZE — Portfolio

> Video Editor · Motion Designer · 日本語学習中

Cinematic portfolio built with React. Persona 5 × Editorial design aesthetic.
Bilingual: English / 日本語. Targeting the Japanese market.

## Stack

- React 18 with lazy loading + Suspense
- Custom SPA router (History API)
- CSS custom properties — 4 themes (Phantom, Velvet, Monochrome, Sakura)
- Zero external UI libraries

## Local development

```bash
npm install
npm start
```

Open [http://localhost:3000](http://localhost:3000)

## Deploy to GitHub Pages

1. Update `homepage` in `package.json`:
   ```json
   "homepage": "https://YOUR_USERNAME.github.io/YOUR_REPO"
   ```

2. Deploy:
   ```bash
   npm run deploy
   ```

## Adding project thumbnails

1. Drop images into `public/images/` (`.jpg`, `.png`, `.webp`)
2. Update `src/data/projects.js`:
   ```js
   thumbnail: process.env.PUBLIC_URL + '/images/your-image.jpg'
   ```

## Customise content

| File | What to edit |
|------|-------------|
| `src/data/me.js` | Name, email, social links |
| `src/data/projects.js` | Project titles, descriptions, links, thumbnails |
| `src/data/skills.js` | Skill levels (0–100) |
| `src/data/experience.js` | Work history |
| `src/AppContext.jsx` | All UI translations (EN + JA) |

## Run quality audit

```bash
python3 audit.py
```

Expected: **36/36 checks passed**

## Themes

Switch via the 🔴 button in the nav:

| Theme | Palette |
|-------|---------|
| Phantom | Red / Black (default) |
| Velvet | Purple / Gold |
| Monochrome | B&W Film Noir |
| Sakura | Pink / White (light mode) |

---

© 2026 Saan Nize. Built with precision & coffee.
