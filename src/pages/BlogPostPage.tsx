import { useParams, Link, Navigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Calendar, Clock, ExternalLink } from 'lucide-react';
import { getBlogPost } from '../lib/blogLoader';
import { staticBlogPosts } from '../lib/staticBlogData';
import { MarkdownRenderer } from '../components/MarkdownRenderer';
import { Section } from '../components/ui/Section';
import { Tag } from '../components/ui/Tag';
import { Button } from '../components/ui/Button';

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
    <div className="min-h-screen">
      <Section className="pt-20">
        <div className="max-w-4xl mx-auto">
          {/* Back button */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-8"
          >
            <Button variant="ghost" asChild>
              <Link to="/blog" className="flex items-center space-x-2">
                <ArrowLeft size={16} />
                <span>Back to Blog</span>
              </Link>
            </Button>
          </motion.div>
          
          {/* Article header */}
          <motion.header
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="mb-12"
          >
            <h1 className="text-4xl sm:text-5xl font-bold text-[var(--text-primary)] mb-6 leading-tight">
              {post.title}
            </h1>
            
            <div className="flex items-center space-x-6 text-[var(--text-secondary)] mb-6">
              <div className="flex items-center space-x-2">
                <Calendar size={16} />
                <span>{formattedDate}</span>
              </div>
              <div className="flex items-center space-x-2">
                <Clock size={16} />
                <span>{post.readingTime} min read</span>
              </div>
            </div>
            
            <div className="flex flex-wrap gap-2 mb-8">
              {post.tags.map((tag) => (
                <Tag key={tag} variant="accent">{tag}</Tag>
              ))}
            </div>
            
            <div className="h-px bg-gradient-to-r from-[var(--accent-cyan)]/50 via-[var(--accent-magenta)]/30 to-transparent" />
          </motion.header>
          
          {/* Article content */}
          <motion.article
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mb-12"
          >
            <MarkdownRenderer content={post.content} />
          </motion.article>
          
          {/* Article footer */}
          <motion.footer
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="border-t border-[var(--border-subtle)] pt-8"
          >
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
              <div className="text-[var(--text-secondary)]">
                <p>Thank you for reading! Share your thoughts and feedback.</p>
              </div>
              
              <div className="flex space-x-3">
                <Button variant="secondary" size="sm" asChild>
                  <a 
                    href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(post.title)}&url=${encodeURIComponent(window.location.href)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center space-x-2"
                  >
                    <ExternalLink size={14} />
                    <span>Share</span>
                  </a>
                </Button>
                
                <Button variant="ghost" size="sm" asChild>
                  <Link to="/blog">
                    More Articles
                  </Link>
                </Button>
              </div>
            </div>
          </motion.footer>
        </div>
      </Section>
    </div>
  );
}