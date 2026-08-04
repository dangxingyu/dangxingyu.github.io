# CLAUDE.md

Guidance for Claude Code (claude.ai/code) when working in this repository.

## Commands

```bash
pnpm install       # pnpm version is pinned by "packageManager" in package.json
pnpm run dev       # Vite dev server on port 3000
pnpm run build     # tsc -b && vite build
pnpm run build:prod # same, with BUILD_MODE=prod (strips debug attributes)
pnpm run preview   # serve the production build
pnpm run lint      # eslint .
```

Scripts do **not** run `pnpm install` for you. An earlier version prefixed every
script with `yes | pnpm install &&`, which auto-confirmed prompts and mutated the
lockfile in the middle of a build; do not reintroduce it.

`pnpm install` needs esbuild's build script approved. That approval lives in
`pnpm-workspace.yaml` (`allowBuilds: esbuild: true`) and is committed — without it
pnpm 11 fails the install outright.

## Architecture

Static personal homepage: React 18 + TypeScript + Vite 6 + React Router v6 +
Tailwind 3. Deployed to GitHub Pages from `master` by `.github/workflows/deploy.yml`.

### Routes

- `/` — `src/pages/IntroPage.tsx`: hero, research interests, selected publications, footer
- `/blog` — `src/pages/BlogPage.tsx`: post index
- `*` — redirects to `/`

Individual blog posts are **not** React routes. They are standalone, self-contained
HTML documents in `public/blog/*.html`, linked directly as `/blog/<slug>.html`. Each
one carries its own `<style>` and loads KaTeX from a CDN itself, so it does not
depend on the app's CSS or JS at all. This is deliberate: static HTML per post is
better for search indexing and social previews than a client-rendered route.

`public/404.html` rewrites deep links into `/?/path`, which the inline script in
`index.html` decodes — the standard GitHub Pages SPA shim.

### Content

All content lives in `src/data/content.ts` (`personalInfo`, `publications`).
Post metadata lives in `src/lib/blogLoader.ts`.

`src/config/siteConfig.ts` toggles sections. Every flag there **must** be read by
`IntroPage.tsx`; an unwired flag is documentation for behaviour that does not exist.

### Design system

Warm-paper editorial. Tokens are defined as **literal values** in
`tailwind.config.js` — never as `hsl(var(--x))` referencing variables that do not
exist in `index.css`, which is what the previous config did.

- Paper `#FAF8F4`, raised `#FFFDFA`, sunk `#F3EFE7`
- Ink `#16130F` / muted `#4A443C` / faint `#736A5F` — 17.5:1, 9.1:1, 5.0:1 on paper
- Rule `#E3DDD2`, accent `#8A3324` (deep rust)
- Display face: **Fraunces Variable** (`full.css` build — the default entrypoint
  ships only the `wght` axis and would silently drop SOFT/WONK/opsz)
- Text face: **Newsreader Variable** (wght-only build; the opsz and italic builds
  cost 74 kB and 147 kB for differences that do not earn it)

Both faces are self-hosted via `@fontsource-variable/*`. No webfont CDN at runtime.

### Motion

All motion is **CSS-driven**. There is no `framer-motion` / `motion` dependency.

This is a correctness requirement, not a preference. JS entrance animations gated
on `IntersectionObserver` and driven by `requestAnimationFrame` never run while the
document is hidden, so an element with `initial={{ opacity: 0 }}` stays invisible
permanently when the page is rendered in a background tab. That bug hid the `h1`
and the entire publication list.

- Hero headline: `.blur-reveal-word` keyframes, inside
  `@media (prefers-reduced-motion: no-preference)` so the resting state is visible
- Section reveals: `.reveal` with `animation-timeline: view()`, wrapped in
  `@supports`, so unsupported browsers simply show the content

The rule: **content must be visible when no animation runs.** Never ship an
entrance whose un-run state is `opacity: 0`.

### Component registries

`components.json` wires up two shadcn-compatible registries:

```bash
npx shadcn@latest search @aceternity
npx shadcn@latest add @react-bits/BlurText-TS-TW
```

Vet what they emit. React Bits' `BlurText` shipped with three real defects
(`animateBy="words"` split on characters, the inter-word space rendered as `''`
inside a flex row, and the background-tab stall above); it was replaced by
`src/components/BlurReveal.tsx`.

## Adding content

**Publication** — append to `publications` in `src/data/content.ts`, newest first.
Mark equal-contribution asterisks exactly as the paper does; `Authors` in
`IntroPage.tsx` emphasises the entry matching `AUTHOR`.

**Blog post** — write a self-contained HTML document to `public/blog/<slug>.html`,
then add its metadata to `blogPostsData` in `src/lib/blogLoader.ts`. Add the URL to
`public/sitemap.xml`.

## SEO

`index.html` carries the description, canonical, Open Graph, Twitter card, and a
schema.org `Person` block linking Scholar/GitHub/X/LinkedIn. `public/robots.txt` and
`public/sitemap.xml` exist. Keep the sitemap current when adding posts.
