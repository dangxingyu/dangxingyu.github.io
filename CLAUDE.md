# CLAUDE.md

Guidance for Claude Code (claude.ai/code) when working in this repository.

## Commands and dependencies

Use Node.js 22.13+; CI selects Node.js 22. pnpm is pinned by `packageManager` in
`package.json` (currently `pnpm@11.20.0`).

```bash
pnpm install
pnpm run dev        # Vite dev server, configured for port 3000
pnpm run lint       # eslint .
pnpm run build      # tsc -b && vite build; the current CI build command
pnpm run build:prod # same, with BUILD_MODE=prod to disable source-info attributes
pnpm run preview    # serve the existing dist/ build
```

Scripts do not install dependencies. Do not reintroduce the former
`yes | pnpm install &&` prefix, which mutated the lockfile during builds.
`pnpm-workspace.yaml` records approval for esbuild's install script through
`allowBuilds.esbuild: true`. Use pnpm and `pnpm-lock.yaml`; the checked-in
`package-lock.json` is not used by CI.

`vite.config.ts` enables `vite-plugin-source-info` unless `BUILD_MODE=prod`.
Both build commands produce Vite production bundles, but only `build:prod`
disables that plugin's `data-matrix-*` attributes. CI currently runs `build`,
not `build:prod`, and does not run lint. See `DEPLOYMENT.md` for the workflow.

## Architecture

Static personal homepage: React 18 + TypeScript + Vite 6 + React Router 6 +
Tailwind 3. There is no backend or CMS. `src/main.tsx` mounts the app inside
StrictMode and an ErrorBoundary. `src/App.tsx` defines the routes within a shared
Layout and fixed Header.

| Route | Implementation |
| --- | --- |
| `/` | `src/pages/IntroPage.tsx`: hero, research interests, selected publications, talks, footer |
| `/blog` | `src/pages/BlogPage.tsx`: post index, sorted newest first |
| `*` | Redirects to `/` |

Individual blog posts are standalone HTML documents in `public/blog/*.html`,
linked directly as `/blog/<slug>.html`. They do not pass through React Router or
inherit the app's CSS, JS, fonts, layout, or metadata. The existing article has
its own styles and loads KaTeX from a CDN. The homepage and blog index are
client-rendered; article bodies are already present in their HTML files.

`public/404.html` rewrites deep links into `/?/path`, which the inline script in
the root `index.html` decodes. This user site is served at the domain root:
keep Vite's `base: '/'` and the 404 shim's `pathSegmentsToKeep = 0` aligned.

### Content and configuration

- `src/data/content.ts`: `personalInfo`, `publications`, and `talks`.
- `src/types/index.ts`: content interfaces.
- `src/lib/blogLoader.ts`: manually maintained `blogPostsData`; this does not
  discover or parse the HTML files.
- `src/config/siteConfig.ts`: `hero`, `researchInterests`, `publications`, and
  `talks` section flags. Every flag must be wired into `IntroPage.tsx`.
- The footer is always rendered. Talks are also hidden when the array is empty.
- The footer's `__BUILD_DATE__` is formatted and injected by Vite at build time;
  it is not the last Git commit date.

`RichText.tsx` supports paragraph breaks and `[label](href)` links only. The
hero renders the first bio paragraph through RichText to preserve advisor links;
remaining paragraphs are passed separately to ScrollReveal as plain text,
preserving their paragraph breaks.
Do not put Markdown links in those later paragraphs without adapting the renderer.

### Design system

Warm-paper editorial. Design tokens are literal values in `tailwind.config.js`;
do not introduce references to CSS variables that do not exist. Global styles,
paper grain, CSS entrances, contact buttons, and publication summary bands live
in `src/index.css`.

- Paper `#FAF8F4`, raised `#FFFDFA`, sunk `#F3EFE7`.
- Ink `#16130F`, muted `#4A443C`, faint `#736A5F`.
- Rule `#E3DDD2`, accent `#8A3324` (deep rust).
- Display: **Fraunces Variable**, imported from `full.css` for the wght, SOFT,
  WONK, and opsz axes used by the page.
- Body: **Instrument Sans Variable**, using the wght-only build.
- Both application fonts are self-hosted through `@fontsource-variable/*`.
  The Chinese name uses the explicit `font-cjk` system-font stack.

Publication and talk rows use SpotlightCard. Publications use a two-column
compact index on desktop and collapse to one column below the `lg` breakpoint.
Each row keeps a narrow year column, condensed metadata, and a smaller neutral
summary band. The summary band has a left-only bleed so the card's
`overflow-hidden` does not clip the right edge or link arrow.
Presentation and award labels use the light accent wash with rust text, keeping
them visible without competing with the publication titles.

### Motion and interaction

The implementation combines CSS, Motion (`motion/react`), GSAP, and OGL/WebGL:

| Effect | Implementation |
| --- | --- |
| Hero name entrance | CSS `hero-letter-in` on VariableProximity's letter spans |
| Pointer-responsive name | `VariableProximity.tsx`: per-letter font-axis interpolation through a requestAnimationFrame loop, with Motion spans |
| Decorative hero threads | `Threads.tsx`: OGL shader, resolution capped at 1920 pixels on the longest side; skips rendering when offscreen or the document is hidden |
| Avatar tilt and sheen | `TiltCard.tsx`: pointer handlers update CSS variables |
| Section entrances | CSS `.reveal` with `animation-timeline: view()` inside `@supports` |
| Bio closing statement | `ScrollReveal.tsx`: GSAP ScrollTrigger controls word opacity and blur |
| Publication/talk spotlight | `SpotlightCard.tsx`: pointer/focus state and a CSS radial gradient |
| Publication-side tracing beam | `components/ui/tracing-beam.tsx`: Motion scroll progress and springs; ResizeObserver measures content height |
| Section-heading sheen | `ShinyText.tsx`: Motion animates an aria-hidden overlay above solid text |

The rule is **content must remain readable when its animation does not run**.
This concerns animation fallback after React renders, not support for disabling
JavaScript entirely. Preserve these component behaviors:

- The name and publication contents have visible resting markup. Do not make
  their visibility depend on an observer callback or a JS entrance completing.
- ScrollReveal defers tween setup until the document is visible, scopes cleanup
  through `gsap.context`, and uses `bottom bottom` end positions so the words
  become readable while still onscreen. Non-string children pass through.
- ShinyText keeps the actual heading in solid ink; only the decorative overlay
  uses transparent text clipping. The heading survives without the overlay.
- TracingBeam remeasures on layout changes and uses a unique SVG gradient ID.
  Its children have no hidden animated initial state.
- The hero's thread mask is set in `IntroPage.tsx`; keep the field clear of the
  bio when changing its dimensions or position.

Reduced-motion handling is component-specific: CSS entrances are gated,
TiltCard skips tilt updates, ScrollReveal skips tween setup, ShinyText disables
its overlay, and TracingBeam hides its animated stroke. Threads and
VariableProximity currently have no explicit reduced-motion gate. The global
CSS rule does not stop JavaScript animation loops.

### Component registries

`components.json` configures the `@aceternity` and `@react-bits` registries.
Their local components have been adapted to this site's palette, typography,
layout, and fallback behavior. Review generated code before replacing a local
copy; preserve the fixes described above and in component comments.

## Adding content

**Publication:** add to `publications` in `src/data/content.ts`, newest first;
the array is rendered in its authored order. Include a short `summary`. The
`pdf` field is currently used for arXiv URLs, and the UI labels it `arXiv`.
If adding other link destinations, update that label logic too. Preserve
equal-contribution asterisks exactly as on the paper; `Authors` strips them
for comparison with `AUTHOR` and emphasizes the site owner's name.
Keep `venue` separate from the optional `presentation` (`Oral`, `Spotlight`, or
`Poster`). Poster is retained as metadata but omitted from the page. Oral and
Spotlight use the `pub-distinction` style: bold light text on a deep rust badge.
Summary bands use a neutral ink tint and dark text to keep them visually distinct
from the badges. An optional `award` with `venue` and `label` renders on its own
line with the same badge style, keeping
workshop awards separate from the main conference venue.

**Talk:** add to `talks` in the same file, in display order. Supply the title,
host, display date, and year; `series`, `url`, and `linkLabel` are optional.
The date is authored text and is not parsed. Keep `sections.talks` enabled to
show the section.

**Blog post:** write a complete HTML document to `public/blog/<slug>.html`,
then add metadata to `blogPostsData` and the URL to `public/sitemap.xml`.
The metadata's `content` field can remain empty because the HTML is served
directly. Use `YYYY-MM-DD` for `publishedAt`; BlogPage formats it from local
date components to avoid displaying the previous day in timezones behind UTC.

## SEO and verification

The root `index.html` carries the description, canonical, Open Graph, Twitter
card, and a schema.org Person block. Keep those aligned with personal-profile
changes. `/blog` currently shares that app-shell metadata; independent posts
must define any desired metadata themselves. `public/robots.txt` points to
`public/sitemap.xml`.

For code changes, run `pnpm run lint` and `pnpm run build`. For visual or motion
changes, also inspect desktop and narrow layouts, background-tab loading, and
reduced-motion behavior. Check the biography, publication summary bands, link
arrows, and tracing-beam gutter after layout changes. For deployment changes,
follow the route and release checks in `DEPLOYMENT.md`.
