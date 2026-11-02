# CLAUDE.md

Static Astro 7 portfolio + blog. TypeScript (strictest), MDX, Tailwind CSS v4, React 19 islands.
Deploys to Cloudflare Pages as plain static files (no adapter). A Go comments service will live
in `/comments` (Phase 2); it's excluded from the site's tsconfig and ESLint.

## Commands

`npm run dev` · `npm run build` · `npm run check` · `npm run lint` · `npm run format`.
Run `format`, `lint`, `check` and `build` before committing; CI runs the same.
Node ≥ 22.23.4 is required by Astro 7.

## Layout

```
src/
  data/site.ts         ALL copy: site meta, links, nav, home sections, page headings, microcopy
  data/work.ts         Typed work history (WorkEntry / WorkTerm), transcribed from public/resume.pdf
  content.config.ts    `posts` collection (glob loader) + zod schema
  content/posts/       *.mdx posts
  lib/                 posts.ts (getPosts/getTags/postUrl), format.ts (dates), logos.ts (build-time logo check)
  layouts/             Base.astro (head, nav, main, footer), Post.astro (article + comments)
  components/          Static .astro components, zero client JS
  components/islands/  React .tsx components that hydrate (PostFilter, Comments)
  pages/               Routes; og/[...slug].png.ts renders OG images at build time with satori
  styles/global.css    Tailwind entry: @theme tokens, dark-mode overrides, base + component classes
public/                favicon, robots.txt, _headers (Cloudflare), logos/, resume.pdf
scripts/contrast.mjs   WCAG check for the color tokens; update it when tokens change
```

## Conventions

- **No copy in components.** Strings come from `src/data/*` or content frontmatter. Components take
  data as props; pages wire data to components.
- **Design tokens only.** Use the semantic utilities from `@theme` (`bg-bg`, `bg-surface`, `text-fg`,
  `text-body`, `text-muted`, `border-hairline`, `text-accent`, `rounded-card`, `rounded-chip`,
  `max-w-content`, `max-w-post`, `min-h-touch`, `py-section`, `font-mono`, `font-display`). No raw hex
  or arbitrary color values in markup. The exceptions are brand bar colors in `work.ts` and the OG
  renderer, which can't read CSS variables.
- **Dark mode** comes from `prefers-color-scheme`, which redefines the token variables in
  `global.css`. Don't add `dark:` variants.
- Shared patterns are `@layer components` classes: `.section`, `.section-label`, `.btn` +
  `.btn-primary`/`.btn-secondary`, `.chip`, `.card`, `.prose-site`. Everything else uses inline utilities.
- **`.astro` by default, `.tsx` only when interactive.** Islands must render meaningful HTML on
  the server (no-JS users see the full list). Prefer `client:visible` unless the island is
  above the fold. Pass pre-formatted strings (dates) as props so SSR and hydration match.
- Accessibility: one `h1` per page, labelled sections, 44px touch targets (`min-h-touch`),
  `:focus-visible` rings, `<time datetime>`. ESLint runs jsx-a11y in strict mode.
- Drafts: `draft: true` posts render in dev only; `getPosts()` handles the filtering.
- Logos: set `logo: '/logos/x.svg'` in `work.ts`. `lib/logos.ts` falls back to a text wordmark if the
  file is missing. `brand.logoTile: 'dark'` puts white logos on a dark tile, and `brand.wordmark`
  renders styled text instead.

## Phase 2 hooks

- `components/islands/Comments.tsx` is the placeholder. Keep its `slug` prop, and replace the body
  with the API client (comments list, GitHub sign-in, SSE subscription).
- `PostFilter` rows render `<span data-comment-count={slug}>`, and `PostSummary.commentCount`
  is the slot for counts.
