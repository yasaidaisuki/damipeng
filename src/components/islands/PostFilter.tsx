import { useSyncExternalStore } from 'react';

export interface PostSummary {
  slug: string;
  url: string;
  title: string;
  summary: string;
  /** Pre-formatted on the server so SSR and hydration render identical text. */
  dateLabel: string;
  dateIso: string;
  tags: string[];
  draft: boolean;
  /** Filled in by the Phase 2 comments API; undefined renders nothing. */
  commentCount?: number;
}

interface Props {
  posts: PostSummary[];
  tags: string[];
  labels: { filter: string; all: string; empty: string };
}

const PARAM = 'tag';

// The selected tag lives in ?tag= so filtered views are shareable. The server snapshot is null, so the
// full list is server-rendered and the filter applies right after hydration.
function subscribe(onChange: () => void) {
  window.addEventListener('popstate', onChange);
  return () => window.removeEventListener('popstate', onChange);
}
const getTagParam = () => new URLSearchParams(window.location.search).get(PARAM);
const getServerTagParam = () => null;

function select(tag: string | null) {
  const url = new URL(window.location.href);
  if (tag) url.searchParams.set(PARAM, tag);
  else url.searchParams.delete(PARAM);
  window.history.pushState(null, '', url);
  window.dispatchEvent(new PopStateEvent('popstate'));
}

export default function PostFilter({ posts, tags, labels }: Props) {
  const param = useSyncExternalStore(subscribe, getTagParam, getServerTagParam);
  const active = param && tags.includes(param) ? param : null;

  const visible = active ? posts.filter((post) => post.tags.includes(active)) : posts;

  return (
    <div>
      {tags.length > 0 && (
        <div role="group" aria-label={labels.filter} className="mb-8 flex flex-wrap gap-2">
          {[null, ...tags].map((tag) => {
            const pressed = active === tag;
            return (
              <button
                key={tag ?? '__all'}
                type="button"
                aria-pressed={pressed}
                onClick={() => select(tag)}
                className={[
                  'min-h-touch rounded-chip border px-3 font-mono text-xs transition-colors',
                  pressed
                    ? 'border-accent bg-accent text-on-accent'
                    : 'border-hairline text-muted hover:border-muted hover:text-fg',
                ].join(' ')}
              >
                {tag ?? labels.all}
              </button>
            );
          })}
        </div>
      )}

      {visible.length === 0 ? (
        <p className="text-muted">{labels.empty}</p>
      ) : (
        <ul className="divide-y divide-hairline" aria-live="polite">
          {visible.map((post) => (
            <li key={post.slug} className="py-6 first:pt-0">
              <article>
                <p className="section-label flex flex-wrap gap-x-3">
                  <time dateTime={post.dateIso}>{post.dateLabel}</time>
                  {post.draft && <span>Draft</span>}
                  <span data-comment-count={post.slug}>
                    {post.commentCount !== undefined && `${post.commentCount} comments`}
                  </span>
                </p>
                <h2 className="mt-2 text-xl">
                  <a href={post.url} className="text-fg no-underline hover:text-accent">
                    {post.title}
                  </a>
                </h2>
                <p className="mt-2 text-muted">{post.summary}</p>
                {post.tags.length > 0 && (
                  <ul className="mt-3 flex flex-wrap gap-2" aria-label="Topics">
                    {post.tags.map((tag) => (
                      <li key={tag} className="chip">
                        {tag}
                      </li>
                    ))}
                  </ul>
                )}
              </article>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
