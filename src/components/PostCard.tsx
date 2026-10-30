import { BlogPost } from '../types';
import { formatPostDate, postHref } from '../lib/blogLoader';

/**
 * Blog post card for the /blog index: ink-wash cover, then date, title,
 * excerpt and tags.
 * The cover is decorative (alt=""); the title carries the link's name, and its
 * ::before overlay makes the whole card clickable.
 */
export function PostCard({ post }: { post: BlogPost }) {
  return (
    <article className="group relative flex min-w-0 flex-col">
      <div className="ink-cover">
        {post.cover && (
          <img src={post.cover} alt="" width={1600} height={900} loading="lazy" decoding="async" />
        )}
      </div>

      <div className="mt-5 flex flex-wrap items-baseline gap-x-3 gap-y-1 text-micro uppercase text-ink-faint">
        <time dateTime={post.publishedAt} className="transition-colors duration-500 ease-out group-hover:text-accent">
          {formatPostDate(post.publishedAt)}
        </time>
        <span aria-hidden="true">&middot;</span>
        <span>{post.readingTime} min read</span>
      </div>

      <h2 className="mt-2 max-w-[34ch] font-display text-[1.5rem] leading-snug text-ink transition-colors duration-500 ease-out group-hover:text-accent">
        <a href={postHref(post)}>
          <span className="absolute inset-0" aria-hidden="true" />
          {post.title}
        </a>
      </h2>

      <p className="mt-3 max-w-measure text-[0.9375rem] leading-[1.7] text-ink-muted">{post.excerpt}</p>

      <div className="mt-4 flex flex-wrap items-baseline justify-between gap-x-6 gap-y-2 text-[0.875rem] text-ink-faint">
        <span>{post.tags.slice(0, 3).join(' · ')}</span>
        <span className="inline-flex items-baseline gap-2 transition-colors duration-500 ease-out group-hover:text-accent">
          Read
          <span className="inline-block transition-transform duration-500 ease-out group-hover:translate-x-1.5">
            &rarr;
          </span>
        </span>
      </div>
    </article>
  );
}
