import rss from '@astrojs/rss';
import type { APIContext } from 'astro';
import { pages, site } from '@/data/site';
import { getPosts, postUrl } from '@/lib/posts';

export async function GET(context: APIContext) {
  const posts = (await getPosts()).filter((post) => !post.data.draft);
  return rss({
    title: `${site.name} · ${pages.writing.title}`,
    description: pages.writing.description,
    site: context.site ?? site.name,
    items: posts.map((post) => ({
      title: post.data.title,
      description: post.data.summary,
      pubDate: post.data.date,
      link: postUrl(post),
      categories: post.data.tags,
    })),
    customData: '<language>en-ca</language>',
  });
}
