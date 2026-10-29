import { getBlogPosts } from '../lib/blogLoader';
import { PostCard } from '../components/PostCard';

export function BlogPage() {
  const posts = getBlogPosts();

  return (
    <section className="mx-auto min-h-screen max-w-page px-6 pb-section pt-36 sm:px-10 lg:px-16 lg:pt-44">
      <h1 className="font-display text-display-md font-medium text-ink">Blog</h1>
      <div className="mt-7 flex items-center gap-5">
        <span className="h-px w-14 shrink-0 bg-accent" aria-hidden="true" />
        <p className="text-[1.0625rem] text-ink-muted">On minds, machines, and the world between</p>
      </div>

      {posts.length > 0 ? (
        <div className="mt-16 grid grid-cols-1 gap-x-12 gap-y-16 border-t border-rule pt-12 md:grid-cols-2">
          {posts.map((post) => (
            <div key={post.id} className="reveal">
              <PostCard post={post} />
            </div>
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
