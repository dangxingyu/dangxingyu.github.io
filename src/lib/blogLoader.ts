import { BlogPost } from '../types';

// Blog metadata: local HTML posts or independently hosted articles.
const blogPostsData: BlogPost[] = [
  {
    id: 'batch-size',
    title: 'The Best Optimizer Depends on Batch Size',
    slug: 'batch-size',
    url: 'https://batch-size-scaling.com/',
    excerpt: 'Optimizer rankings can reverse as batch size changes, even after retuning every optimizer at every batch size. In language-model pretraining, keeping small-batch updates in the sharpest 0.001% of matrix directions removes up to 59.5% of the error from scaling the batch size.',
    content: '',
    publishedAt: '2026-09-29',
    tags: ['Optimization', 'Batch Size', 'Interactive', 'Language Models'],
    readingTime: 12,
    cover: '/covers/blog-batch-size.webp',
    summary: 'the paper as an interactive article, with its measurements and simulations',
  },
  {
    id: 'rlvr-ttlm',
    title: 'RLVR is Time-Traveling',
    slug: 'rlvr-ttlm',
    excerpt: "In this blog, we'll connect RLVR to the modeling of Time-Traveling Turing Machines (TTTMs). We'll see that a \"one-bit signal from the future\" leads, mathematically, to the same equations that govern KL-regularized RLVR.",
    content: '', // Not needed - HTML is served directly from public/blog/
    publishedAt: '2025-11-08',
    tags: ['RLVR', 'Reinforcement Learning', 'Theory', 'Language Models'],
    readingTime: 12,
    cover: '/covers/blog-rlvr-ttlm.webp',
    summary: 'a one-bit signal from the future leads to the equations of KL-regularized RLVR',
  },
];

// Get all blog posts
export const getBlogPosts = (): BlogPost[] => {
  // Return pre-defined blog posts metadata
  // Entries may point to local HTML or a standalone research site.
  return [...blogPostsData].sort((a, b) =>
    new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
  );
};

/**
 * Display date for a post. Built from explicit local components:
 * `new Date('2025-11-08')` parses as UTC midnight, which formats as the
 * previous day in any timezone behind UTC — the post dated 2025-11-08 once
 * rendered as "November 7, 2025".
 */
export const formatPostDate = (publishedAt: string): string => {
  const [y, m, d] = publishedAt.split('-').map(Number);
  return new Date(y, m - 1, d).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
};

/** Articles use document navigation, including independently hosted posts. */
export const postHref = (post: BlogPost): string => post.url ?? `/blog/${post.slug}.html`;

// Get a single blog post by slug
export const getBlogPost = (slug: string): BlogPost | undefined => {
  const posts = getBlogPosts();
  return posts.find(post => post.slug === slug);
};