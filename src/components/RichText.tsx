import { Fragment, ReactNode } from 'react';

/**
 * Minimal inline renderer for the small amount of markup the bio actually uses:
 * [label](href) links and paragraph breaks.
 *
 * This deliberately replaces a full react-markdown + remark-math + rehype-katex
 * + react-syntax-highlighter pipeline, which cost ~350 kB gzip to render one
 * paragraph containing four links. Blog posts are standalone static HTML in
 * public/blog/ and never pass through here.
 */

const LINK = /\[([^\]]+)\]\(([^)]+)\)/g;

function renderInline(text: string): ReactNode[] {
  const nodes: ReactNode[] = [];
  let cursor = 0;

  for (const match of text.matchAll(LINK)) {
    const [full, label, href] = match;
    const start = match.index ?? 0;

    if (start > cursor) nodes.push(text.slice(cursor, start));

    nodes.push(
      <a
        key={`${start}-${href}`}
        href={href}
        target={href.startsWith('http') ? '_blank' : undefined}
        rel={href.startsWith('http') ? 'noopener noreferrer' : undefined}
      >
        {label}
      </a>
    );

    cursor = start + full.length;
  }

  if (cursor < text.length) nodes.push(text.slice(cursor));
  return nodes;
}

export function RichText({ content, className = '' }: { content: string; className?: string }) {
  const paragraphs = content.split(/\n\s*\n/).map((p) => p.trim()).filter(Boolean);

  return (
    <div className={className}>
      {paragraphs.map((p, i) => (
        <p key={i}>{renderInline(p)}</p>
      ))}
    </div>
  );
}
