// Type definitions for the homepage content

export interface Publication {
  id: string;
  title: string;
  authors: string[];
  venue: string;
  presentation?: 'Oral' | 'Spotlight' | 'Poster';
  /** A separate award venue, such as a workshop alongside the main conference. */
  award?: {
    venue: string;
    label: string;
  };
  year: number;
  type: 'conference' | 'journal' | 'preprint';
  doi?: string;
  pdf?: string;
  /** One line, in the author's own voice — not the paper abstract. */
  summary?: string;
}

export interface Talk {
  id: string;
  title: string;
  host: string;
  /** Seminar or event series, when the venue runs one. */
  series?: string;
  /** Display string, not ISO: authored for reading, so it never has to be
      parsed back out and cannot hit the UTC-midnight off-by-one. */
  date: string;
  year: number;
  url?: string;
  linkLabel?: string;
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
