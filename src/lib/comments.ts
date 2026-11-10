import { giscus } from '@/data/site';

/** Threads load only once the comments repo and category IDs are set in `site.ts`. */
export const commentsEnabled = Boolean(giscus.repoId && giscus.categoryId);

interface CountsResponse {
  data?: {
    repository?: {
      discussions: {
        nodes: {
          title: string;
          comments: { totalCount: number; nodes: { replies: { totalCount: number } }[] };
        }[];
      };
    };
  };
}

const QUERY = `query ($owner: String!, $name: String!, $categoryId: ID!) {
  repository(owner: $owner, name: $name) {
    discussions(first: 100, categoryId: $categoryId) {
      nodes { title comments(first: 100) { totalCount nodes { replies { totalCount } } } }
    }
  }
}`;

/**
 * Comments plus replies per post slug, read from GitHub at build time, so they're as fresh as the
 * last deploy. GitHub's GraphQL API needs a token even for public repos; without
 * `GISCUS_COUNTS_TOKEN`, or if the request fails, this returns an empty map and counts are hidden.
 */
export async function getCommentCounts(): Promise<Map<string, number>> {
  const counts = new Map<string, number>();
  const token = process.env['GISCUS_COUNTS_TOKEN'];
  if (!commentsEnabled || !token) return counts;
  const [owner, name] = giscus.repo.split('/');
  try {
    const res = await fetch('https://api.github.com/graphql', {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        query: QUERY,
        variables: { owner, name, categoryId: giscus.categoryId },
      }),
      signal: AbortSignal.timeout(10_000),
    });
    if (!res.ok) throw new Error(`GitHub responded ${res.status}`);
    const json = (await res.json()) as CountsResponse;
    // giscus's `specific` mapping titles each discussion with the post's slug.
    for (const { title, comments } of json.data?.repository?.discussions.nodes ?? []) {
      const replies = comments.nodes.reduce((sum, c) => sum + c.replies.totalCount, 0);
      counts.set(title, comments.totalCount + replies);
    }
  } catch (error) {
    console.warn(`[comments] Skipping comment counts: ${String(error)}`);
  }
  return counts;
}
