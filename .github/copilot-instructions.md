## Purpose

This file helps automated coding agents and new contributors become productive quickly in this Nuxt.js PhD website repository. It focuses on the project's architecture, developer workflows, conventions, and integration points — citing concrete files and examples in the repo.

## Quick context
- Tech: Nuxt 3 (Vue 3 + Vite), Markdown content in `content/` (served via @nuxt/content)
- Site sections: Home (`/`), Blog (`/blog`), Publications (`/publications`), Contact (`/contact`)
- Project root: `package.json`, app routes in `pages/`, markdown content in `content/`

## Big-picture architecture (why and how)
- Single-page application with server-side rendering / static-generation via Nuxt 3. Use pages for routing and components for UI.
- Content-driven: all posts and publication records are stored as Markdown under `content/` and queried using the content module. This keeps content editable without changing code.
- Minimalist design: global layout (`components/SiteHeader.vue`, `components/Footer.vue`) + small atomic components (`PostCard.vue`) to keep pages readable and reusable.

## Key files and their roles
- `nuxt.config.ts` — central config (modules, meta tags, runtime config).
- `package.json` — scripts for local dev, build, generate and linting.
- `pages/` — routing. `pages/blog/index.vue`, `pages/publications.vue`, `pages/contact.vue` are the main entry points.
- `components/` — reusable UI (header, footer, post preview cards).
- `content/blog/*.md` — blog posts (frontmatter: title, date, tags, summary).
- `content/publications/*.md` — publication items (frontmatter: title, authors, venue, year, doi/url).
- `README.md` — local run & publish instructions (also check this when updating workflows).

## Data flows and service boundaries
- Author writes Markdown in `content/` -> Nuxt content module indexes it -> pages query content via `useAsyncData`/`useContent` -> server renders the HTML.
- No server-side backend in this repo. Contact form is a static page with instructions to use a third-party form provider (Formspree, Netlify Forms, or email link).

## Developer workflows & important commands
- Install deps (macOS/zsh):
  ```bash
  cd "Coding project"/phd-nuxt
  npm install
  ```
- Run dev server (hot reload):
  ```bash
  npm run dev
  # opens at http://localhost:3000 by default
  ```
- Build (SSR/static generation):
  ```bash
  npm run build
  npm run preview   # optional, serve built app
  ```
- Generate static site (if publishing to GitHub Pages):
  ```bash
  npx nuxi generate
  # or `npm run generate` if script exists
  ```
- Lint/format: follow `package.json` scripts if present. When adding linting, prefer Prettier for styles and ESLint (Vue 3 recommended rules).

If something doesn't start, check `node` and `npm` versions (Node 16+ recommended for Nuxt 3) and re-run `npm install`.

## Project-specific conventions & patterns
- Content-first: add new posts and publications as Markdown in `content/` — frontmatter fields are parsed and used in templates (see `pages/blog/index.vue` and `pages/publications.vue`).
- Layouts: keep page-specific markup in `pages/` and small presentational logic in `components/` (stateless whenever possible).
- Styling: minimal scoped CSS inside components. Prefer simple class names rather than heavy utility frameworks unless a theme is added.
- Date format: use ISO 8601 in frontmatter (YYYY-MM-DD) to simplify sorting.

## Integration points and external dependencies
- @nuxt/content — Markdown content querying. See `content/` and `pages/*` for usage patterns.
- Third-party for contact forms: repo only contains/contact instructions; form submission relies on external forms (Formspree, Netlify Forms) or a mailto fallback.
- Optional: citation import scripts (not included) — if you add BibTeX parsers, put scripts under `scripts/` and generate `content/publications/*.md`.

## Examples (patterns to copy)
- Blog post frontmatter (copy to `content/blog/sample-post.md`):
  ```yaml
  ---
  title: "Sample post"
  date: 2025-10-14
  summary: "Short summary used on the index card."
  tags: [methods, ml]
  ---
  ```
- Publication frontmatter (copy to `content/publications/sample-publication.md`):
  ```yaml
  ---
  title: "Paper Title"
  authors: ["A. Researcher", "B. Author"]
  venue: "Conf or Journal"
  year: 2024
  url: "https://doi.org/xxxx"
  ---
  ```

## When to ask for human help
- New integrations that require credentials (e.g., Google Scholar scraping, private APIs): request secrets and explicit approval — agents should not add secrets to the repo.
- Decisions about design or voice (e.g., layout changes beyond minimal CSS) — propose changes, but flag for review.

---
If anything here is unclear or you want additional automation (CI to auto-generate `public/` and deploy to GitHub Pages, a GitHub Action to publish on push to `main`), tell me which part to expand and I will add sample CI workflows or scripts.
