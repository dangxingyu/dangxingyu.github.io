import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { getBlogPosts } from '../lib/blogLoader';
import { staticBlogPosts } from '../lib/staticBlogData';

function BlogPostCard({ post, index }: { post: ReturnType<typeof getBlogPosts>[0]; index: number }) {
  const formattedDate = new Date(post.publishedAt).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  return (
    <motion.article
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.1 }}
      viewport={{ once: true }}
      className="group"
    >
      <a href={`/blog/${post.slug}.html`} className="block">
        <div className="py-8 border-b border-gray-200 last:border-b-0 hover:bg-gray-50 transition-colors duration-200 -mx-4 px-4">
          <div className="space-y-3">
            <h2 className="text-2xl font-semibold text-black group-hover:text-gray-600 transition-colors duration-200 leading-tight">
              {post.title}
            </h2>

            <p className="text-gray-600 leading-relaxed text-lg">
              {post.excerpt}
            </p>

            <div className="flex items-center space-x-6 text-sm text-gray-500">
              <time dateTime={post.publishedAt}>{formattedDate}</time>
              <span>{post.readingTime} min read</span>
            </div>
          </div>
        </div>
      </a>
    </motion.article>
  );
}

export function BlogPage() {
  // Try to load from markdown files first, fallback to static data
  let blogPosts;
  try {
    blogPosts = getBlogPosts();
    if (blogPosts.length === 0) {
      blogPosts = staticBlogPosts;
    }
  } catch (error) {
    console.error('Error loading markdown posts:', error);
    blogPosts = staticBlogPosts;
  }
  
  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-3xl mx-auto px-4 py-16">
        {/* Header */}
        <motion.header
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-16 text-center"
        >
          <h1 className="text-5xl font-bold text-black mb-4 tracking-tight">
            Blog
          </h1>
          <div className="w-16 h-0.5 bg-black mx-auto"></div>
        </motion.header>
        
        {/* Blog Posts */}
        <div className="space-y-0">
          {blogPosts.map((post, index) => (
            <BlogPostCard key={post.id} post={post} index={index} />
          ))}
        </div>
        
        {/* Footer Message */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mt-16 pt-8 border-t border-gray-200"
        >
          <p className="text-gray-500 text-lg">
            More thoughts coming soon.
          </p>
        </motion.div>
      </div>
    </div>
  );
}