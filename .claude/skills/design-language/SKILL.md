---
name: design-language
description: Design language for the dami.peng portfolio site (Astro + Tailwind v4). Use when adding or changing any UI in this repo, including pages, components, React islands, the Phase 2 comments widget, colors, type, spacing or logos, so new work matches the existing system and keeps AA contrast and Lighthouse 95+.
---

# dami.peng design language

Minimal and engineering-flavoured. A wide centred page with a 760px text measure, hairline dividers, Geist with Geist Mono
labels, one blue accent, and almost no decoration. The one picture is the 3D room in the home hero. The approved mockups are the visual
source of truth. The tokens in `src/styles/global.css` encode them. **If this file and
`global.css` disagree, `global.css` wins. Update this file to match it.**

## Principles

1. **Type does the work.** Hierarchy comes from size, weight and the mono/sans contrast, not color
   or boxes. Most text is `fg`, `body` or `secondary`. Accent is for links, metrics and active state.
2. **Hairlines, not cards.** Sections are separated by a 1px `border-hairline` top rule with 48px
   vertical rhythm. Bordered boxes (`rounded-card border-hairline`) are reserved for metric and
   project cards. Never use a shadow.
3. **Quiet chrome.** The nav is a mono wordmark and three text links. The footer is one mono line.
   Apart from the home room, there are no hero images, gradients or icons beyond `→ ↗ ↓` glyphs.
4. **Data-driven copy.** Every string lives in `src/data/site.ts`, `src/data/work.ts` or post
   frontmatter. Components only render props.

## Tokens (use the Tailwind utilities, never raw hex)

### Color

| Token                    | Value                 | Use                                       |
| ------------------------ | --------------------- | ----------------------------------------- |
| `bg`                     | `#ffffff`             | Page background                           |
| `fg`                     | `#111113`             | Headings, primary text, link default      |
| `body`                   | `#26262c`             | Long-form paragraphs, bullets             |
| `secondary`              | `#3a3a42`             | Intros, summaries, card body              |
| `muted`                  | `#5b5b66`             | Labels, dates, meta, inactive nav         |
| `hairline`               | `#e6e6ea`             | Section rules, card borders               |
| `hairline-soft`          | `#efeff2`             | Dividers between list rows                |
| `border-strong`          | `#dadae0`             | Secondary buttons, idle chips, card hover |
| `surface`                | `#f6f6f8`             | Code blocks                               |
| `chip`                   | `#f3f3f5`             | Tech tag background                       |
| `accent`                 | `#2347c6`             | Links, metrics, status dot, focus ring    |
| `on-accent`              | `#ffffff`             | Text on accent                            |
| `inverse` / `on-inverse` | `#111113` / `#ffffff` | Primary button, active filter pill        |
| `brand-ibm`              | `#0f62fe`             | Hover on IBM's name (IBM Blue 60)         |
| `brand-shopify`          | `#008060`             | Hover on Shopify's name (Shopify green)   |
| `room`                   | `#7e8cd6`             | Room frame backdrop (the rendered floor)  |
| `scrim`                  | `#111113` at 55%      | Hint pill over the room                   |

**Light mode only.** The site deliberately has no dark mode: never add `prefers-color-scheme`
rules, `dark:` variants or dark logo variants. Every color change must pass
`node scripts/contrast.mjs` (update its table too). Brand colors appear only in logos, the OG image
renderer, and the `brand-*` hover tokens.

### Type

Fonts: `font-sans` (Geist Variable), `font-mono` (Geist Mono Variable). Brand faces are used only
for company names: `font-brand-ibm` (IBM Plex Sans), `font-brand-shopify` (Inter, the Polaris
face; Shopify Sans isn't publicly licensed), and `font-plex-mono` (IBM Plex Mono) for every role line on `/work`. Import brand
fonts per page (e.g. `@fontsource/inter/latin-600.css`), never globally.

| Utility           | Size / line-height   | Use                            |
| ----------------- | -------------------- | ------------------------------ |
| `text-display`    | 52px / 1.05, −0.03em | Home `h1` only                 |
| `text-h1`         | 40px / 1.1, −0.025em | Inner page `h1`                |
| `text-h1-post`    | 38px / 1.15          | Post title                     |
| `text-h2`         | 22px / 1.3           | Post list titles, "Discussion" |
| `text-pitch`      | 22px / 1.45          | Home pitch                     |
| `text-card-title` | 19px                 | Project card title             |
| `text-lead`       | 18px / 1.55          | Page intros (`.page-intro`)    |
| `text-prose`      | 18px / 1.7           | Post body (`.prose-site`)      |
| `text-body-lg`    | 17px / 1.65          | Home paragraphs                |
| `text-ui`         | 15px                 | Nav, buttons, roles, card body |
| `text-meta`       | 13px                 | Mono meta rows, footer, labels |

Headings are `font-semibold`. Labels are `.section-label`: mono, 13px (or `text-xs` for sub-labels),
medium, `tracking-[0.06em]`, uppercase, `muted`.

### Shape and layout

- Radii: `rounded-chip` 6px (tags), `rounded-btn` 8px (buttons), `rounded-card` 10px (cards, code),
  `rounded-frame` 16px (the room frame).
  Filter pills are `rounded-full`.
- Containers: every page is one centred `max-w-wide` (1200px) container with `px-6`, shared by the
  nav, sections and footer, so everything lines up. Sections and hairlines span the full width;
  paragraphs and bullet lists cap at `max-w-content` (760px), intros at 580px. Posts centre a
  `max-w-post` (680px) reading column. Grids (Now/Next, impact, projects) use the full width.
- Rhythm: home hero `pt-8 pb-12 sm:pt-14 sm:pb-16`, text and room side by side
  (`flex-[1_1_400px]` / `flex-[1_1_380px] max-w-135`), stacking on narrow screens; `.section` is `border-t py-12`; `.page-header` is `pt-24 pb-12`.
  Use Tailwind's 4px scale and avoid one-off pixel values.
- Work timeline: flex-wrap row with a `flex-[0_0_var(--spacing-date-col)]` (168px) mono date column
  and a `flex-[999_1_420px]` content column, so it stacks on mobile without breakpoints.

## Components (reuse before creating)

`.section`, `.section-label`, `.page-header` + `.page-intro`, `.btn` + `.btn-primary` /
`.btn-secondary`, `.link-accent`, `.tag`, `.prose-site`; Astro components `SectionLabel`,
`StatusLine`, `MetricCard`, `ProjectCard`, `TagList`, `TimelineEntry`, `CompanyHeader`.

- **Buttons:** 44px tall, `px-5`, 15px medium. There is one primary (inverse) per view; the rest are secondary.
- **Cards:** border only, `p-5`/`p-6`. A whole-card link uses a stretched `after:absolute
after:inset-0` title link, with secondary links at `relative z-10`.
- **Filter pills:** 36px visual height with an `::after` hit area padding to 44px. Active is
  `bg-inverse text-on-inverse`, idle is `border-border-strong`.
- **Meta rows:** `text-meta text-muted font-mono flex flex-wrap gap-3` (date · topic · extra).
- **Logos** (`/work` only): files in `public/logos/`, data in `work.ts` as `{ src, capHeight,
padding? }`. Logos are scaled so their capital letters are 24px tall, not by box
  height. Measure `capHeight` from the artwork. Official files the brand says not to alter
  (UWaterloo PNGs) stay untouched, and `padding` clips their clear space inside a wrapper.
  `lib/logos.ts` sizes the image in percentages of that wrapper, which is capped at `max-w-full`,
  so logos shrink on narrow phones instead of overflowing the page.
  The home page names companies in text with their brand font, without logos. Those names link to
  the company site and fade (`duration-300`) to their `brand-*` color on hover.
- **Room** (home hero only, `RoomHero.astro`): a square `rounded-frame border-hairline bg-room`
  frame holding a poster `<img>` with the three.js canvas faded in over it, a `bg-scrim
text-on-inverse text-meta` mono hint pill bottom-left that hides while dragging and fades back in 1.5s after release, and a mono
  `text-meta text-muted` caption. The frame is `touch-pan-y`, so vertical swipes still scroll.

## Interaction and accessibility

- Links are `fg` and turn `accent` on hover with no underline. Accent links stay accent and fade to 80% on hover.
- Every target is ≥44px (`min-h-touch`, plus `min-w-touch` for short labels like "RSS");
  `:focus-visible` gives a 2px accent outline. Inline links inside sentences get a `::before`
  hit area (`before:absolute before:-inset-y-3`) instead of padding, so line spacing doesn't change.
- Mobile: nothing may overflow at 280px (Galaxy Fold folded). The nav stays on one row from 320px
  (`px-2` links below `sm`) and wraps flush-left below that. Hover styles are cosmetic only
  (Tailwind v4 gates `hover:` to `(hover: hover)`), so never put information behind hover.
- Interactive UI is a React island in `src/components/islands/`, SSR-rendered and usable without
  JS where possible, and uses `client:visible` unless it sits above the fold.
- One `h1` per page, labelled sections, `<time datetime>`, `aria-current="page"` in the nav, and
  decorative glyphs in `aria-hidden`.

## Checklist for any UI change

1. Only semantic token utilities are used: no hex, no arbitrary colors, no dark-mode rules.
2. Check screenshots against the mockups at 1280px, 360px and 280px; no horizontal overflow.
3. `npm run format && npm run lint && npm run check && npm run build`
4. `node scripts/contrast.mjs` if colors changed. Lighthouse stays ≥95 (it's ~100 today).
