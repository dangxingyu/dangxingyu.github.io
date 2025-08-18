# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

### Development
```bash
# Start development server on port 3000
pnpm run dev

# Build for production
pnpm run build

# Build with production optimizations (removes debug attributes)
pnpm run build:prod

# Preview production build
pnpm run preview

# Run ESLint
pnpm run lint
```

### TypeScript
```bash
# Type check the project
tsc -b

# Type check in watch mode
tsc -b --watch
```

Note: All commands include automatic `pnpm install` to ensure dependencies are up to date.

## Architecture Overview

### Tech Stack
- **React 18** with TypeScript for the UI
- **Vite 6** for blazing fast development and optimized builds
- **React Router v6** for client-side routing
- **Tailwind CSS** for styling with custom CSS variables for theming
- **Framer Motion** for animations and page transitions
- **React Markdown** with KaTeX for rendering blog content with math formulas

### Project Structure
The application is a single-page personal portfolio/blog site with three main routes:
- `/` - Introduction page with personal info, publications, and projects
- `/blog` - Blog listing page
- `/blog/:slug` - Individual blog post pages

### Key Architectural Patterns

#### 1. Content Management
All content is centralized in `src/data/content.ts` with TypeScript interfaces defining the structure. This makes it easy to update personal information, publications, projects, and blog posts without touching component code.

#### 2. Component Organization
- **layout/**: Contains Layout and Header components that wrap all pages
- **ui/**: Reusable UI components (Button, Card, Section, Tag)
- **pages/**: Page-level components for each route
- **components/**: Other components like MarkdownRenderer and ErrorBoundary

#### 3. Styling System
Uses a hybrid approach:
- Tailwind CSS for utility classes
- CSS custom properties for theming (defined in `src/index.css`)
- Scoped component styles where needed

Key theme variables:
- `--bg-primary`: Main background (#0A0E1A)
- `--bg-secondary`: Secondary background (#1A1E29)
- `--accent-cyan`: Primary accent (#00F0FF)
- `--accent-magenta`: Secondary accent (#D900FF)

#### 4. Build Optimization
The Vite config implements code splitting to optimize bundle sizes:
- vendor: React core libraries
- router: React Router
- framer: Framer Motion animations
- markdown: Markdown rendering with KaTeX
- syntax: Syntax highlighting

#### 5. Path Aliasing
Uses `@/` alias for importing from `src/` directory, configured in both TypeScript and Vite.

#### 6. Deployment Configuration
- Base path set to `./` for GitHub Pages compatibility
- Assets served from `assets/` directory
- Production build removes debug attributes via `vite-plugin-source-info`

## Development Notes

### Adding New Content
1. **Blog Posts**: Add to `blogPosts` array in `src/data/content.ts`
2. **Projects**: Add to `projects` array with `featured: true` for homepage display
3. **Publications**: Add to `publications` array with appropriate type

### Routing
The app uses React Router with BrowserRouter. For static hosting (GitHub Pages), special handling may be needed for client-side routing.

### Math Rendering
Blog posts support LaTeX math:
- Inline: `$formula$`
- Block: `$$formula$$`

### Responsive Design
The site uses mobile-first responsive design with Tailwind breakpoints:
- Mobile: Default styles
- Tablet: `md:` prefix (768px+)
- Desktop: `lg:` prefix (1024px+)

### Animation System
Framer Motion is used for:
- Page transitions
- Scroll-triggered animations
- Hover effects
- Background animated elements

### Error Handling
An ErrorBoundary component wraps the application to gracefully handle runtime errors.

## Blog Management

The blog system uses a file-based approach with Markdown files stored in the `/blog` directory:

### Adding New Blog Posts
1. Create a new `.md` file in the `blog/` directory
2. Add frontmatter with required fields (title, slug, publishedAt, tags, excerpt)
3. Update `src/lib/blogLoader.ts` to import and include the new file
4. The post will automatically appear in the blog listing

### Blog Architecture
- **Blog files**: `/blog/*.md` - Markdown files with frontmatter
- **Parser**: `src/lib/blogLoader.ts` - Handles markdown parsing and blog post loading
- **Dependencies**: `gray-matter` for frontmatter parsing, `react-markdown` + `katex` for rendering

### Section Visibility Control
Edit `src/config/siteConfig.ts` to show/hide sections:
- `hero`: Main hero section
- `researchInterests`: Research interests tags
- `publications`: Publications list
- `projects`: Featured projects

## Important Files
- `src/data/content.ts`: Personal info, publications, and projects
- `src/config/siteConfig.ts`: Controls which sections are displayed
- `blog/`: Directory containing all blog posts as Markdown files
- `src/lib/blogLoader.ts`: Blog parsing and loading logic
- `vite.config.ts`: Build configuration and optimizations
- `src/App.tsx`: Main routing setup
- `src/components/layout/Layout.tsx`: Global layout wrapper
- `src/index.css`: Global styles and CSS variables