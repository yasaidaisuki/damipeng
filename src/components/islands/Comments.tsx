interface Props {
  /** Post slug; Phase 2 uses it to load and stream comments for this post. */
  slug: string;
  heading: string;
  placeholder: string;
}

/** Placeholder for the Phase 2 comments client. Keep the props stable so the page doesn't change. */
export default function Comments({ slug, heading, placeholder }: Props) {
  return (
    <section
      aria-labelledby="discussion"
      data-comments-slug={slug}
      className="border-t border-hairline pt-10 pb-18"
    >
      <h2 id="discussion" className="text-h2">
        {heading}
      </h2>
      <p className="mt-5 text-ui text-muted">{placeholder}</p>
    </section>
  );
}
