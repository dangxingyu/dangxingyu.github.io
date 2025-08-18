import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Calendar, Clock } from 'lucide-react';
import { getBlogPosts } from '../lib/blogLoader';
import { staticBlogPosts } from '../lib/staticBlogData';
import { Section } from '../components/ui/Section';
import { Card } from '../components/ui/Card';
import { Tag } from '../components/ui/Tag';

function BlogPostCard({ post, index }: { post: ReturnType<typeof getBlogPosts>[0]; index: number }) {
  const formattedDate = new Date(post.publishedAt).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: index * 0.1 }}
      viewport={{ once: true }}
    >
      <Link to={`/blog/${post.slug}`}>
        <Card className="h-full flex flex-col cursor-pointer hover:border-[var(--accent-cyan)]/50">
          <div className="flex-1 space-y-4">
            <h2 className="text-xl font-semibold text-[var(--text-primary)] leading-tight hover:text-[var(--accent-cyan)] transition-colors">
              {post.title}
            </h2>
            
            <p className="text-[var(--text-secondary)] leading-relaxed">
              {post.excerpt}
            </p>
            
            <div className="flex flex-wrap gap-2">
              {post.tags.map((tag) => (
                <Tag key={tag}>{tag}</Tag>
              ))}
            </div>
          </div>
          
          <div className="flex items-center justify-between pt-4 mt-4 border-t border-[var(--border-subtle)] text-sm text-[var(--text-secondary)]">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-1">
                <Calendar size={14} />
                <span>{formattedDate}</span>
              </div>
              <div className="flex items-center space-x-1">
                <Clock size={14} />
                <span>{post.readingTime} min read</span>
              </div>
            </div>
          </div>
        </Card>
      </Link>
    </motion.div>
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
    <div className="min-h-screen">
      <Section 
        title="Blog" 
        subtitle="Life, the Universe and Everything"
        className="pt-20"
      >
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {blogPosts.map((post, index) => (
            <BlogPostCard key={post.id} post={post} index={index} />
          ))}
          
          {/* "To be continued" placeholder card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: blogPosts.length * 0.1 }}
            viewport={{ once: true }}
          >
            <Card className="h-full flex flex-col justify-center items-center text-center py-12 border-dashed border-2 border-[var(--border-subtle)] bg-[var(--bg-secondary)]/50">
              <div className="space-y-4">
                <div className="w-16 h-16 mx-auto rounded-full bg-[var(--bg-tertiary)] flex items-center justify-center">
                  <span className="text-2xl">✨</span>
                </div>
                <h3 className="text-lg font-semibold text-[var(--text-primary)]">
                  To be continued...
                </h3>
                <p className="text-sm text-[var(--text-secondary)] max-w-xs">
                  More research ideas, random thoughts, and occasional insights coming soon.
                </p>
              </div>
            </Card>
          </motion.div>
        </div>
      </Section>
      
      {/* Additional sections could go here */}
      <Section className="text-center">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <p className="text-[var(--text-secondary)] text-lg">
            Stay tuned for more insights.
          </p>
        </motion.div>
      </Section>
    </div>
  );
}