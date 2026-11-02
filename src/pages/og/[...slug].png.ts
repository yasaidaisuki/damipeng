import { readFile } from 'node:fs/promises';
import { createRequire } from 'node:module';
import { Resvg } from '@resvg/resvg-js';
import type { APIRoute, GetStaticPaths } from 'astro';
import satori from 'satori';
import { home, pages, site } from '@/data/site';
import { formatDate } from '@/lib/format';
import { getPosts } from '@/lib/posts';

// Open Graph images, rendered once at build time: /og/index.png, /og/work.png, /og/writing/<slug>.png, …
// Colors are the light-theme tokens from src/styles/global.css (satori can't read CSS variables).
const color = {
  bg: '#FFFFFF',
  fg: '#111113',
  muted: '#5B5B66',
  hairline: '#E6E6EA',
  accent: '#2347C6',
};

type OgProps = {
  label: string;
  title: string;
  subtitle: string;
};

export const getStaticPaths = (async () => {
  const posts = await getPosts();
  const fixed: { slug: string; props: OgProps }[] = [
    { slug: 'index', props: { label: site.status, title: site.name, subtitle: home.pitch } },
    {
      slug: 'work',
      props: {
        label: pages.work.title,
        title: pages.work.heading,
        subtitle: pages.work.description,
      },
    },
    {
      slug: 'writing',
      props: {
        label: pages.writing.title,
        title: pages.writing.heading,
        subtitle: pages.writing.description,
      },
    },
    {
      slug: 'contact',
      props: {
        label: pages.contact.title,
        title: pages.contact.heading,
        subtitle: pages.contact.intro,
      },
    },
  ];
  const postPaths = posts.map((post) => ({
    slug: `writing/${post.id}`,
    props: {
      label: formatDate(post.data.date),
      title: post.data.title,
      subtitle: post.data.summary,
    },
  }));
  return [...fixed, ...postPaths].map(({ slug, props }) => ({ params: { slug }, props }));
}) satisfies GetStaticPaths;

const require = createRequire(import.meta.url);
const font = (file: string) => readFile(require.resolve(file));
const fontsPromise = Promise.all([
  font('@fontsource/geist/files/geist-latin-400-normal.woff'),
  font('@fontsource/geist/files/geist-latin-600-normal.woff'),
  font('@fontsource/geist-mono/files/geist-mono-latin-500-normal.woff'),
]);

type Node = { type: string; props: Record<string, unknown> };
const h = (type: string, style: Record<string, unknown>, children?: unknown): Node => ({
  type,
  props: { style, children },
});

export const GET: APIRoute<OgProps> = async ({ props }) => {
  const [regular, semibold, mono] = await fontsPromise;

  const tree = h(
    'div',
    {
      width: '100%',
      height: '100%',
      // satori defaults to content-box, which would push the footer row off the canvas.
      boxSizing: 'border-box',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-between',
      padding: '72px 80px',
      backgroundColor: color.bg,
      borderTop: `12px solid ${color.accent}`,
      fontFamily: 'Geist',
    },
    [
      h(
        'div',
        {
          display: 'flex',
          fontFamily: 'Geist Mono',
          fontSize: 26,
          color: color.muted,
          letterSpacing: 2,
          textTransform: 'uppercase',
        },
        props.label,
      ),
      h('div', { display: 'flex', flexDirection: 'column', gap: 24 }, [
        h(
          'div',
          { fontSize: 76, fontWeight: 600, color: color.fg, letterSpacing: -2, lineHeight: 1.05 },
          props.title,
        ),
        h('div', { fontSize: 32, color: color.muted, lineHeight: 1.4 }, props.subtitle),
      ]),
      h(
        'div',
        {
          display: 'flex',
          justifyContent: 'space-between',
          borderTop: `2px solid ${color.hairline}`,
          paddingTop: 28,
          fontFamily: 'Geist Mono',
          fontSize: 24,
          color: color.muted,
        },
        [
          h('div', {}, site.name),
          h('div', { color: color.accent }, new URL(import.meta.env.SITE).host),
        ],
      ),
    ],
  );

  const svg = await satori(tree as Parameters<typeof satori>[0], {
    width: 1200,
    height: 630,
    fonts: [
      { name: 'Geist', data: regular, weight: 400, style: 'normal' },
      { name: 'Geist', data: semibold, weight: 600, style: 'normal' },
      { name: 'Geist Mono', data: mono, weight: 500, style: 'normal' },
    ],
  });
  const png = new Resvg(svg, { fitTo: { mode: 'width', value: 1200 } }).render().asPng();

  return new Response(new Uint8Array(png), { headers: { 'Content-Type': 'image/png' } });
};
