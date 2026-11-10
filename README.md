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
- **Home, contact and page copy, links**: `src/data/site.ts`.
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

- **Logos**: files in `public/logos/`, referenced from `work.ts` as `{ src, capHeight, padding? }`.
  If a file is missing, the work page falls back to a text name.
- **Résumé**: put the PDF at `public/resume.pdf`.

## Comments (giscus)

Each post's comments are a GitHub Discussion, shown with [giscus](https://giscus.app). One-time setup:

1. Make the repo named in `giscus.repo` (`src/data/site.ts`, this site's own repo) public and turn on Discussions.
2. Add a Discussions category called **Comments** with the **Announcements** format.
3. Install the [giscus app](https://github.com/apps/giscus) on that repo only.
4. `giscus.json` in this repo's root limits which sites can embed it:

   ```json
   {
     "origins": ["https://damipeng.pages.dev", "http://localhost:4321", "http://localhost:8788"],
     "defaultCommentOrder": "oldest"
   }
   ```

5. Fill in `repoId` and `categoryId` in `src/data/site.ts`:

   ```sh
   gh api graphql -f query='{ repository(owner: "yasaidaisuki", name: "damipeng") {
     id discussionCategories(first: 10) { nodes { id name } } } }'
   ```

**Comment counts** on `/writing` are fetched at build time. Set `GISCUS_COUNTS_TOKEN` in the
Cloudflare Pages build environment to a fine-grained token with read-only access to public
repositories. Without it, counts are hidden. Counts update on each deploy.

## Deploying (Cloudflare Pages)

Connect the repo in the Cloudflare dashboard with:

- Framework preset: Astro
- Build command: `npm run build`
- Output directory: `dist`
- Environment variable: `NODE_VERSION=24`

`public/_headers` sets security headers and long-lived caching for hashed assets. After the
domain is live, update `SITE_URL` in `astro.config.mjs` and the sitemap line in `public/robots.txt`.
