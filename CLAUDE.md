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
  data/work.ts         Typed work history (WorkEntry / WorkTerm); facts from the résumé, wording from the mockups
  content.config.ts    `posts` collection (glob loader) + zod schema
  content/posts/       *.mdx posts
  lib/                 posts.ts (getPosts/getTags/postUrl), format.ts (dates), logos.ts (build-time logo check)
  layouts/             Base.astro (head, nav, main, footer), Post.astro (article + comments)
  components/          Static .astro components, zero client JS
  components/islands/  React .tsx components that hydrate (PostFilter, Comments)
  pages/               Routes; og/[...slug].png.ts renders OG images at build time with satori
  styles/global.css    Tailwind entry: @theme tokens, base + component classes
public/                favicon, robots.txt, _headers (Cloudflare), logos/, resume.pdf
scripts/contrast.mjs   WCAG check for the color tokens; update it when tokens change
```

## Conventions

- **UI work: load the `design-language` skill** (`.claude/skills/design-language/SKILL.md`). It
  covers the tokens, type scale, components, logos and the checklist for any visual change.
- **No copy in components.** Strings come from `src/data/*` or content frontmatter. Components take
  data as props; pages wire data to components.
- **The design handoff mockups (Main/Work/Writing/Post/Contact `.dc.html`) are the visual source of
  truth.** Their shared values live as tokens in `src/styles/global.css`; match new UI to them.
- **Design tokens only.** Use the semantic utilities from `@theme`. Colors: `bg`, `fg`, `body`,
  `secondary`, `muted`, `hairline`, `hairline-soft`, `border-strong`, `surface`, `chip`, `accent`,
  `inverse`/`on-inverse`. Type: `text-display`, `text-h1`, `text-h1-post`, `text-h2`, `text-pitch`,
  `text-lead`, `text-prose`, `text-body-lg`, `text-ui` (15px), `text-meta` (13px),
  `text-metric`. Also `rounded-chip|btn|card`, `max-w-content|post`, `min-h-touch`, `font-mono`,
  `font-plex-mono`. No raw hex or arbitrary color values in markup. The exception is the OG
  renderer, which can't read CSS variables.
- **Light mode only.** There is deliberately no dark mode: don't add `prefers-color-scheme` rules,
  `dark:` variants or dark logo variants.
- Shared patterns are `@layer components` classes: `.section`, `.section-label`, `.btn` +
  `.btn-primary`/`.btn-secondary`, `.link-accent`, `.tag`, `.page-header`, `.page-intro`,
  `.prose-site`. Everything else uses inline utilities.
- **`.astro` by default, `.tsx` only when interactive.** Islands must render meaningful HTML on
  the server (no-JS users see the full list). Prefer `client:visible` unless the island is
  above the fold. Pass pre-formatted strings (dates) as props so SSR and hydration match.
- Accessibility: one `h1` per page, labelled sections, 44px touch targets (`min-h-touch`),
  `:focus-visible` rings, `<time datetime>`. ESLint runs jsx-a11y in strict mode.
- Drafts: `draft: true` posts render in dev only; `getPosts()` handles the filtering. A post's first
  tag is its topic (shown in list and post meta), so use human-readable tags ("Distributed systems").
- Logos live in `public/logos/` (SVG, or the official PNG where that's what the brand supplies).
  In `work.ts`, `logo: { src, capHeight, padding? }`. `lib/logos.ts` scales every logo so its capital
  letters are 24px tall (`capHeight` is the measured fraction of the file's height), and
  `padding` hides built-in clear space by clipping it inside a wrapper (percentage margins, so the
  logo also shrinks to fit narrow phones) instead of editing the file.
  Missing files fall back to a text name.

## Phase 2 hooks

- `components/islands/Comments.tsx` is the placeholder. Keep its `slug` prop, and replace the body
  with the API client (comments list, GitHub sign-in, SSE subscription).
- `PostFilter` rows render `<span data-comment-count={slug}>`, and `PostSummary.commentCount`
  is the slot for counts.
