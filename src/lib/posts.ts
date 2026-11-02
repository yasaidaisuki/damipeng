import { getCollection, type CollectionEntry } from 'astro:content';

export type Post = CollectionEntry<'posts'>;

/** Published posts, newest first. Drafts are included in dev so they can be previewed. */
export async function getPosts(): Promise<Post[]> {
  const posts = await getCollection('posts', ({ data }) => import.meta.env.DEV || !data.draft);
  return posts.sort((a, b) => b.data.date.valueOf() - a.data.date.valueOf());
}

/** Unique tags across posts, sorted by frequency then name. */
export function getTags(posts: Post[]): string[] {
  const counts = new Map<string, number>();
  for (const post of posts) {
    for (const tag of post.data.tags) counts.set(tag, (counts.get(tag) ?? 0) + 1);
  }
  return [...counts.entries()]
    .sort(([a, x], [b, y]) => y - x || a.localeCompare(b))
    .map(([tag]) => tag);
}

export function postUrl(post: Post): string {
  return `/writing/${post.id}`;
}

/** The post's primary topic, shown in list and post metadata: its first tag. */
export function postTopic(post: Post): string | undefined {
  return post.data.tags[0];
}

/** Estimated reading time in minutes (≈230 words/min, code included), at least 1. */
export function readingMinutes(post: Post): number {
  const words = (post.body ?? '').split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.round(words / 230));
}
