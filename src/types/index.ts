// Type definitions for the homepage content

export interface Publication {
  id: string;
  title: string;
  authors: string[];
  venue: string;
  year: number;
  type: 'conference' | 'journal' | 'preprint';
  doi?: string;
  pdf?: string;
  abstract?: string;
}

export interface Project {
  id: string;
  title: string;
  description: string;
  technologies: string[];
  githubUrl?: string;
  demoUrl?: string;
  imageUrl?: string;
  featured: boolean;
}

export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  publishedAt: string;
  updatedAt?: string;
  tags: string[];
  readingTime: number;
}

export interface PersonalInfo {
  name: string;
  title: string;
  bio: string;
  email: string;
  avatar?: string;
  social: {
    github?: string;
    linkedin?: string;
    twitter?: string;
    scholar?: string;
  };
  researchInterests: string[];
}

export interface NavigationItem {
  name: string;
  href: string;
  current?: boolean;
}