# Blog Management

This directory contains all blog posts as Markdown files with frontmatter.

## Adding a New Blog Post

1. Create a new `.md` file in this directory with a descriptive filename (e.g., `my-new-post.md`)

2. Add frontmatter at the top of the file:

```markdown
---
title: "Your Post Title"
slug: "your-post-slug"  # Used in the URL
publishedAt: "2024-01-01"  # YYYY-MM-DD format
tags: ["AI", "Research", "Technical"]  # Array of tags
readingTime: 5  # Estimated reading time in minutes (optional)
excerpt: "A brief description of your post that appears in the blog listing."
---

# Your Post Title

Your markdown content goes here...
```

3. Update `src/lib/blogLoader.ts` to include your new file:
   - Import the markdown file: `import myNewPostMd from '/blog/my-new-post.md?raw';`
   - Add it to the `blogFiles` object: `'my-new-post': myNewPostMd,`

## Frontmatter Fields

- **title** (required): The title of the blog post
- **slug** (required): URL-friendly version of the title
- **publishedAt** (required): Publication date in YYYY-MM-DD format
- **tags** (required): Array of tags for categorization
- **excerpt** (required): Brief description for blog listing
- **readingTime** (optional): If not provided, it will be calculated automatically
- **updatedAt** (optional): Update date if the post has been modified

## Markdown Features

You can use standard Markdown syntax plus:

- **Math formulas**: Inline `$E = mc^2$` or block `$$\frac{\partial}{\partial x}$$`
- **Code blocks**: With syntax highlighting
- **Lists, tables, links, images**: Standard Markdown features

## Example Structure

```
blog/
├── README.md
├── future-human-ai-collaboration.md
├── understanding-transformer-architecture.md
└── your-new-post.md
```

The blog posts will be automatically sorted by publication date (newest first) and displayed on the blog page.