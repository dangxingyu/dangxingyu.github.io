import matter from 'gray-matter';
import { BlogPost } from '../types';

// Import markdown files as raw text
import futureHumanAiMd from '/blog/future-human-ai-collaboration.md?raw';
import transformerArchMd from '/blog/understanding-transformer-architecture.md?raw';

// Blog post mapping
const blogFiles = {
  'future-human-ai-collaboration': futureHumanAiMd,
  'understanding-transformer-architecture': transformerArchMd,
};

// Calculate reading time based on word count
const calculateReadingTime = (content: string): number => {
  const wordsPerMinute = 200;
  const words = content.trim().split(/\s+/).length;
  return Math.ceil(words / wordsPerMinute);
};

// Parse a markdown file and return a BlogPost
const parseBlogPost = (fileName: string, content: string): BlogPost => {
  const { data: frontmatter, content: markdownContent } = matter(content);
  
  return {
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
};

// Get all blog posts
export const getBlogPosts = (): BlogPost[] => {
  const posts: BlogPost[] = [];
  
  for (const [fileName, content] of Object.entries(blogFiles)) {
    try {
      const post = parseBlogPost(fileName, content);
      posts.push(post);
    } catch (error) {
      console.error(`Error parsing blog post ${fileName}:`, error);
    }
  }
  
  // Sort posts by published date (newest first)
  posts.sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime());
  
  return posts;
};

// Get a single blog post by slug
export const getBlogPost = (slug: string): BlogPost | undefined => {
  const posts = getBlogPosts();
  return posts.find(post => post.slug === slug);
};