interface Props {
  /** Post slug; Phase 2 uses it to load and stream comments for this post. */
  slug: string;
  heading: string;
  placeholder: string;
}

/** Placeholder for the Phase 2 comments client. Keep the props stable so the page doesn't change. */
export default function Comments({ slug, heading, placeholder }: Props) {
  return (
    <section aria-labelledby="comments-heading" data-comments-slug={slug} className="section">
      <h2 id="comments-heading" className="section-label mb-6">
        {heading}
      </h2>
      <p className="text-sm text-muted">{placeholder}</p>
    </section>
  );
}
