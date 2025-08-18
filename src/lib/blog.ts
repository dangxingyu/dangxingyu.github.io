import matter from 'gray-matter';
import { BlogPost } from '../types';

// This will be populated at build time with all blog posts
let blogPostsCache: BlogPost[] = [];

// For development, we'll manually import the blog posts
// In a production setup, you might want to use a build-time script
const importBlogPosts = async (): Promise<BlogPost[]> => {
  // This is a simplified approach for development
  // In production, you might want to use a more sophisticated method
  
  const posts: BlogPost[] = [];
  
  try {
    // Import the markdown files directly
    const blogModules = import.meta.glob('/blog/*.md', { as: 'raw' });
    
    for (const path in blogModules) {
      const content = await blogModules[path]();
      const fileName = path.split('/').pop()?.replace('.md', '') || '';
      
      const { data: frontmatter, content: markdownContent } = matter(content);
      
      const post: BlogPost = {
        id: fileName,
        title: frontmatter.title || '',
        slug: frontmatter.slug || fileName,
        excerpt: frontmatter.excerpt || '',
        content: markdownContent,
        publishedAt: frontmatter.publishedAt || '',
        updatedAt: frontmatter.updatedAt,
        tags: frontmatter.tags || [],
        readingTime: frontmatter.readingTime || calculateReadingTime(markdownContent),
      };
      
      posts.push(post);
    }
    
    // Sort posts by published date (newest first)
    posts.sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime());
    
    return posts;
  } catch (error) {
    console.error('Error loading blog posts:', error);
    return [];
  }
};

// Calculate reading time based on word count
const calculateReadingTime = (content: string): number => {
  const wordsPerMinute = 200;
  const words = content.trim().split(/\s+/).length;
  return Math.ceil(words / wordsPerMinute);
};

// Get all blog posts
export const getBlogPosts = async (): Promise<BlogPost[]> => {
  if (blogPostsCache.length === 0) {
    blogPostsCache = await importBlogPosts();
  }
  return blogPostsCache;
};

// Get a single blog post by slug
export const getBlogPost = async (slug: string): Promise<BlogPost | undefined> => {
  const posts = await getBlogPosts();
  return posts.find(post => post.slug === slug);
};

// Clear cache (useful for development)
export const clearBlogCache = () => {
  blogPostsCache = [];
};