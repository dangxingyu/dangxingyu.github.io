import { getBlogPosts } from '../lib/blogLoader';

function PostRow({
  post,
  index,
}: {
  post: ReturnType<typeof getBlogPosts>[0];
  index: number;
}) {
  // Build the date from explicit local components. `new Date('2025-11-08')`
  // parses as UTC midnight, which formats as the previous day in any timezone
  // behind UTC — the post dated 2025-11-08 rendered as "November 7, 2025".
  const [y, m, d] = post.publishedAt.split('-').map(Number);
  const formattedDate = new Date(y, m - 1, d).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <div className="reveal">
    <article className="group relative grid grid-cols-1 gap-x-10 border-t border-rule py-10 sm:grid-cols-[9rem_1fr]">
      <div className="mb-3 sm:mb-0">
        <time
          dateTime={post.publishedAt}
          className="text-micro uppercase text-ink-faint transition-colors duration-500 ease-out group-hover:text-accent"
        >
          {formattedDate}
        </time>
      </div>

      <div>
        <h2 className="max-w-[46ch] font-display text-[1.5rem] leading-snug text-ink transition-colors duration-500 ease-out group-hover:text-accent">
          {/* Posts are pre-rendered standalone HTML in public/blog/, so this is
              a real document navigation rather than a router link. */}
          <a href={`/blog/${post.slug}.html`}>
            <span className="absolute inset-0" aria-hidden="true" />
            {post.title}
          </a>
        </h2>

        <p className="mt-4 max-w-measure text-[0.9375rem] leading-[1.75] text-ink-muted">
          {post.excerpt}
        </p>

        <div className="mt-5 flex items-baseline gap-6 text-[0.875rem] text-ink-faint">
          <span>{post.readingTime} min read</span>
          <span className="inline-flex items-baseline gap-2 transition-colors duration-500 ease-out group-hover:text-accent">
            Read
            <span className="inline-block transition-transform duration-500 ease-out group-hover:translate-x-1.5">
              &rarr;
            </span>
          </span>
        </div>
      </div>
    </article>
    </div>
  );
}

export function BlogPage() {
  const posts = getBlogPosts();

  return (
    <section className="mx-auto min-h-screen max-w-page px-6 pb-section pt-36 sm:px-10 lg:px-16 lg:pt-44">
      <h1 className="font-display text-display-md font-medium text-ink">Blog</h1>
      <div className="mt-7 flex items-center gap-5">
        <span className="h-px w-14 shrink-0 bg-accent" aria-hidden="true" />
        <p className="text-[1.0625rem] text-ink-muted">Notes on reasoning, training and theory.</p>
      </div>

      {posts.length > 0 ? (
        <div className="mt-16">
          {posts.map((post, i) => (
            <PostRow key={post.id} post={post} index={i} />
          ))}
        </div>
      ) : (
        <p className="mt-16 border-t border-rule pt-10 text-ink-faint">
          No posts published yet.
        </p>
      )}
    </section>
  );
}
