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
  lib/room/scene.ts    three.js room for the home hero, loaded lazily by components/RoomHero.astro
  assets/room/         room.glb, screen.mp4 (monitor video), screen-still.webp (its frame at 5s)
  layouts/             Base.astro (head, nav, main with a `wide` slot, footer), Post.astro (article + comments)
  components/          Static .astro components, zero client JS
  components/islands/  React .tsx components that hydrate (PostFilter, Comments)
  pages/               Routes; og/[...slug].png.ts renders OG images at build time with satori
  styles/global.css    Tailwind entry: @theme tokens, base + component classes
public/                favicon, robots.txt, _headers (Cloudflare), logos/, resume.pdf, room/ (hero poster)
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
  `inverse`/`on-inverse`, `room`, `scrim`. Type: `text-display`, `text-h1`, `text-h1-post`, `text-h2`, `text-pitch`,
  `text-lead`, `text-prose`, `text-body-lg`, `text-ui` (15px), `text-meta` (13px),
  `text-metric`. Also `rounded-chip|btn|card|frame`, `max-w-wide|content|post`, `min-h-touch`, `font-mono`,
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
  The one exception is the home room (`RoomHero.astro`): a plain `<script>` that `import()`s three.js,
  so the home page doesn't ship React just to host a canvas.
- **Layout:** every page uses one centred `max-w-wide` (1200px) container for the nav, content and
  footer. Sections and hairlines span it; long-form text caps itself at `max-w-content` (760px) for
  line length. Posts (`width="post"`) centre a `max-w-post` reading column inside it.
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

## Home room

- Ported from the separate `portfolio_website` repo: its model and dark-theme lighting, posed where
  its intro animation ends.
- `room.glb` is an optimized copy of `portfolio_website/public/models/room.glb` (2 MB → 438 KB, which
  looks the same even at the largest desktop frame): `npx @gltf-transform/cli@4` `resize --width 256
--height 256`, `webp --quality 80`, `weld`, `simplify --ratio 0.5 --error 0.001`, then `draco`,
  run in that order. Don't use `optimize`: it joins and renames nodes the scene looks up by name. Drag (mouse or touch) turns it up to ±5° and it eases back on release.
- The poster `<img>` is the LCP element; the scene loads after `load` + idle and fades in over it.
  It stays on the poster for reduced motion, no WebGL, `deviceMemory < 4` or
  `hardwareConcurrency <= 4`. Renders are on demand only, capped at 30 fps, and pause off screen.
- Shadow maps were most of the GPU cost, so they redraw only when the room has turned (not on
  video frames), at 1024 (sun, its camera fitted to the room) and 512 (window light, with
  `normalBias` scaled up to match; lower and the bed shows shadow acne).
- The monitor plays `screen.mp4` (starting at 5s) only on `(hover: hover) and (pointer: fine)`;
  touch devices show `screen-still.webp` and never fetch the video.
- **`public/room/poster*.webp` is a render of this scene** (still screen, no hint, 1080px and 540px).
  Re-render it whenever the framing (`FRUSTUM`, camera), lighting, shadows or model changes, or the fade-in
  will visibly jump: screenshot the live canvas at 1280px wide, DPR 2, with the mp4 request blocked.
  `--color-room` is the rendered floor colour; re-sample it too.

## Phase 2 hooks

- `components/islands/Comments.tsx` is the placeholder. Keep its `slug` prop, and replace the body
  with the API client (comments list, GitHub sign-in, SSE subscription).
- `PostFilter` rows render `<span data-comment-count={slug}>`, and `PostSummary.commentCount`
  is the slot for counts.
