import { useParams, Link, Navigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft } from 'lucide-react';
import { getBlogPost } from '../lib/blogLoader';
import { staticBlogPosts } from '../lib/staticBlogData';
import { useEffect } from 'react';

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

  // Extract both style and body content from HTML
  const extractHtmlContent = (html: string): { styles: string; body: string } => {
    const styleMatch = html.match(/<style[^>]*>([\s\S]*?)<\/style>/i);
    const bodyMatch = html.match(/<body[^>]*>([\s\S]*?)<\/body>/i);

    return {
      styles: styleMatch ? styleMatch[1] : '',
      body: bodyMatch ? bodyMatch[1] : html
    };
  };

  const { styles: htmlStyles, body: bodyContent } = extractHtmlContent(post.content);

  // Run KaTeX rendering after component mounts
  useEffect(() => {
    // Load KaTeX if not already loaded
    if (typeof window !== 'undefined' && !(window as any).renderMathInElement) {
      const script = document.createElement('script');
      script.src = 'https://cdn.jsdelivr.net/npm/katex@0.16.9/dist/contrib/auto-render.min.js';
      script.integrity = 'sha384-+VBxd3r6XgURycqtZ117nYw44OOcIax56Z4dCRWbxyPt0Koah1uHoK0o4+/RRE05';
      script.crossOrigin = 'anonymous';
      script.onload = () => {
        (window as any).renderMathInElement(document.body, {
          delimiters: [
            {left: '\\[', right: '\\]', display: true},
            {left: '\\(', right: '\\)', display: false}
          ],
          throwOnError: false,
          trust: true
        });
      };
      document.head.appendChild(script);
    } else if ((window as any).renderMathInElement) {
      // KaTeX already loaded, just render
      (window as any).renderMathInElement(document.body, {
        delimiters: [
          {left: '\\[', right: '\\]', display: true},
          {left: '\\(', right: '\\)', display: false}
        ],
        throwOnError: false,
        trust: true
      });
    }
  }, [post.content]);

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

        {/* Article content - render HTML directly with styles */}
        <motion.article
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mb-16"
        >
          <style dangerouslySetInnerHTML={{ __html: htmlStyles }} />
          <div dangerouslySetInnerHTML={{ __html: bodyContent }} />
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