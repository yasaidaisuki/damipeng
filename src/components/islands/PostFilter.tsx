import { useSyncExternalStore } from 'react';

export interface PostSummary {
  slug: string;
  url: string;
  title: string;
  summary: string;
  /** Pre-formatted on the server so SSR and hydration render identical text. */
  dateLabel: string;
  dateIso: string;
  /** Primary topic shown in the meta row. */
  topic?: string | undefined;
  tags: string[];
  draft: boolean;
  /** Pre-formatted count ("3 comments"), filled in by the Phase 2 comments API. */
  commentsLabel?: string;
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
        <div role="group" aria-label={labels.filter} className="mt-7 flex flex-wrap gap-2">
          {[null, ...tags].map((tag) => {
            const pressed = active === tag;
            return (
              <button
                key={tag ?? '__all'}
                type="button"
                aria-pressed={pressed}
                onClick={() => select(tag)}
                className={[
                  // 36px visual height per the design; the ::after pads the hit area to 44px.
                  "relative inline-flex min-h-9 cursor-pointer items-center rounded-full px-3.5 text-sm transition-colors after:absolute after:inset-x-0 after:-inset-y-1 after:content-['']",
                  pressed
                    ? 'bg-inverse text-on-inverse'
                    : 'border border-border-strong text-fg hover:text-accent',
                ].join(' ')}
              >
                {tag ?? labels.all}
              </button>
            );
          })}
        </div>
      )}

      {visible.length === 0 ? (
        <p className="mt-10 pb-12 text-muted">{labels.empty}</p>
      ) : (
        <ul className="mt-10" aria-live="polite">
          {visible.map((post) => (
            <li key={post.slug} className="border-t border-hairline">
              <a href={post.url} className="block py-7 text-fg">
                <p className="flex flex-wrap gap-3 font-mono text-meta text-muted">
                  <time dateTime={post.dateIso}>{post.dateLabel}</time>
                  {post.topic && <span>{post.topic}</span>}
                  {post.draft && <span>Draft</span>}
                  {post.commentsLabel && <span className="text-accent">{post.commentsLabel}</span>}
                </p>
                <h2 className="mt-2.5 text-h2">{post.title}</h2>
                <p className="mt-2 leading-[1.55] text-secondary">{post.summary}</p>
              </a>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
