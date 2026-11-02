# damipeng

Personal portfolio and blog for Dami Peng. Static site built with [Astro](https://astro.build),
TypeScript, MDX, Tailwind CSS v4 and a couple of React islands. Deployed to Cloudflare Pages.

## Getting started

Requires Node 22.23.4+ (Node 24 recommended; see `.nvmrc`).

```sh
npm install
npm run dev        # http://localhost:4321, drafts visible
```

| Script                      | What it does                                   |
| --------------------------- | ---------------------------------------------- |
| `npm run dev`               | Dev server with hot reload                     |
| `npm run build`             | Production build to `dist/` (drafts excluded)  |
| `npm run preview`           | Serve the production build locally             |
| `npm run check`             | `astro check` (TypeScript + Astro diagnostics) |
| `npm run lint`              | ESLint (TS, Astro, React hooks, a11y)          |
| `npm run format`            | Prettier, including Tailwind class sorting     |
| `node scripts/contrast.mjs` | WCAG contrast check for the color tokens       |

CI (`.github/workflows/ci.yml`) runs format check, lint, `astro check` and build on every PR.

## Editing content

- **Work history**: `src/data/work.ts`. Typed entries; `/work` and the home page render from it.
  Multiple terms at one company go in `terms[]`.
- **Home, contact and page copy, links**: `src/data/site.ts`. GitHub and LinkedIn URLs are TODOs.
- **Posts**: add `src/content/posts/<slug>.mdx` with frontmatter:

  ```yaml
  ---
  title: 'Post title'
  date: 2026-11-01
  summary: 'One sentence shown in lists, RSS and OG images.'
  tags: ['infrastructure']
  draft: false
  ---
  ```

  Drafts show in `npm run dev` but are left out of builds, RSS and the sitemap.

- **Logos**: SVGs in `public/logos/`, referenced from `work.ts` as `{ src, darkSrc? }`. `darkSrc` is
  used in dark mode. If a file is missing, the work page falls back to a text wordmark.
- **Résumé**: put the PDF at `public/resume.pdf`.

## Deploying (Cloudflare Pages)

Connect the repo in the Cloudflare dashboard with:

- Framework preset: Astro
- Build command: `npm run build`
- Output directory: `dist`
- Environment variable: `NODE_VERSION=24`

`public/_headers` sets security headers and long-lived caching for hashed assets. After the
domain is live, update `SITE_URL` in `astro.config.mjs` and the sitemap line in `public/robots.txt`.
