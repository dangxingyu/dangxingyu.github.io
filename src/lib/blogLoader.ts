import { BlogPost } from '../types';

// Blog posts metadata (HTML files are in public/blog/)
const blogPostsData: BlogPost[] = [
  {
    id: 'rlvr-ttlm',
    title: 'RLVR is Time-Traveling',
    slug: 'rlvr-ttlm',
    excerpt: "In this blog, we'll connect RLVR to the modeling of Time-Traveling Turing Machines (TTTMs). We'll see that a \"one-bit signal from the future\" leads, mathematically, to the same equations that govern KL-regularized RLVR.",
    content: '', // Not needed - HTML is served directly from public/blog/
    publishedAt: '2025-11-08',
    tags: ['RLVR', 'Reinforcement Learning', 'Theory', 'Language Models'],
    readingTime: 12,
  },
];

// Get all blog posts
export const getBlogPosts = (): BlogPost[] => {
  // Return pre-defined blog posts metadata
  // HTML files are served directly from public/blog/
  return [...blogPostsData].sort((a, b) =>
    new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
  );
};

// Get a single blog post by slug
export const getBlogPost = (slug: string): BlogPost | undefined => {
  const posts = getBlogPosts();
  return posts.find(post => post.slug === slug);
};