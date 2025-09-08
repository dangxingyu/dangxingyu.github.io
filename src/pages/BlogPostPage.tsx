import { useParams, Link, Navigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft } from 'lucide-react';
import { getBlogPost } from '../lib/blogLoader';
import { staticBlogPosts } from '../lib/staticBlogData';
import { MarkdownRenderer } from '../components/MarkdownRenderer';

export function BlogPostPage() {
  const { slug } = useParams<{ slug: string }>();
  
  let post;
  try {
    post = slug ? getBlogPost(slug) : undefined;
    // Fallback to static data if not found in markdown
    if (!post && slug) {
      post = staticBlogPosts.find(p => p.slug === slug);
    }
  } catch (error) {
    console.error('Error loading blog post:', error);
    if (slug) {
      post = staticBlogPosts.find(p => p.slug === slug);
    }
  }
  
  if (!post) {
    return <Navigate to="/blog" replace />;
  }
  
  const formattedDate = new Date(post.publishedAt).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
  
  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-3xl mx-auto px-4 py-8">
        {/* Back button */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4 }}
          className="mb-12"
        >
          <Link 
            to="/blog" 
            className="inline-flex items-center space-x-2 text-gray-600 hover:text-black transition-colors duration-200"
          >
            <ArrowLeft size={18} />
            <span>Back</span>
          </Link>
        </motion.div>
        
        {/* Article header */}
        <motion.header
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="mb-16"
        >
          <h1 className="text-4xl sm:text-5xl font-bold text-black mb-8 leading-tight tracking-tight">
            {post.title}
          </h1>
          
          <div className="flex items-center space-x-6 text-gray-500 mb-8">
            <time dateTime={post.publishedAt}>{formattedDate}</time>
            <span>{post.readingTime} min read</span>
          </div>
          
          <div className="w-full h-px bg-gray-200" />
        </motion.header>
        
        {/* Article content */}
        <motion.article
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mb-16"
        >
          <MarkdownRenderer content={post.content} />
        </motion.article>
        
        {/* Article footer */}
        <motion.footer
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="border-t border-gray-200 pt-12"
        >
          <div className="text-center">
            <Link 
              to="/blog"
              className="inline-block text-gray-600 hover:text-black transition-colors duration-200 text-lg"
            >
              ← Back to all posts
            </Link>
          </div>
        </motion.footer>
      </div>
    </div>
  );
}