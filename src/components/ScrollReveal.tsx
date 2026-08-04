import React, { Fragment, useEffect, useRef, useMemo, ReactNode, RefObject } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { cn } from '@/lib/utils';

gsap.registerPlugin(ScrollTrigger);

interface ScrollRevealProps {
  children: ReactNode;
  scrollContainerRef?: RefObject<HTMLElement>;
  enableBlur?: boolean;
  baseOpacity?: number;
  baseRotation?: number;
  blurStrength?: number;
  containerClassName?: string;
  textClassName?: string;
  rotationEnd?: string;
  wordAnimationEnd?: string;
}

const ScrollReveal: React.FC<ScrollRevealProps> = ({
  children,
  scrollContainerRef,
  enableBlur = true,
  baseOpacity = 0.1,
  baseRotation = 3,
  blurStrength = 4,
  containerClassName = '',
  textClassName = '',
  // Upstream's defaults are the two-token "bottom bottom". This copy shipped a
  // bare "bottom", which ScrollTrigger resolves as "bottom top" — the reveal
  // only reached full opacity once the paragraph had scrolled off the top of
  // the screen, so it was blurred for its whole readable life.
  rotationEnd = 'bottom bottom',
  wordAnimationEnd = 'bottom bottom'
}) => {
  const containerRef = useRef<HTMLDivElement>(null);

  // Upstream did `typeof children === 'string' ? children : ''`, so any child
  // that was not a bare string — the bio on this site is a <RichText> element —
  // rendered as literally nothing. String children are still split into
  // animatable words; anything else is passed through untouched rather than
  // discarded.
  //
  // The split itself is `/(\s+)/`, which is correct: the capture group keeps the
  // whitespace runs as separate tokens so the words do not run together.
  const { nodes, textOnly } = useMemo(() => {
    const out: ReactNode[] = [];
    let allStrings = true;

    React.Children.toArray(children).forEach((child, childIndex) => {
      if (typeof child !== 'string') {
        allStrings = false;
        out.push(child);
        return;
      }

      child.split(/(\s+)/).forEach((token, tokenIndex) => {
        if (!token) return;
        const key = `${childIndex}-${tokenIndex}`;
        if (/^\s+$/.test(token)) {
          out.push(<Fragment key={key}>{token}</Fragment>);
          return;
        }
        out.push(
          <span className="inline-block word" key={key}>
            {token}
          </span>
        );
      });
    });

    return { nodes: out, textOnly: allStrings };
  }, [children]);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    // Upstream built both entrances as `fromTo` tweens, so GSAP renders the
    // *from* state (opacity 0.1, blur 4px, rotated 3deg) onto the DOM the
    // instant the component mounts, and only a scrubbed ScrollTrigger ever
    // clears it. ScrollTrigger advances on GSAP's rAF ticker, which does not
    // tick while the document is hidden, so a page opened in a background tab
    // kept the entire paragraph at 10% opacity forever — the same failure that
    // once hid this site's h1 and publication list. Nothing is written to the
    // DOM until we know the animation can actually run; the resting markup is
    // the fully readable end state.
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    let ctx: ReturnType<typeof gsap.context> | undefined;

    const build = () => {
      if (ctx || document.visibilityState !== 'visible') return;
      document.removeEventListener('visibilitychange', build);

      // Upstream's cleanup was `ScrollTrigger.getAll().forEach(t => t.kill())`,
      // which killed every ScrollTrigger on the page — including other
      // components' — and, because kill() does not revert, left the inline
      // opacity/blur it had applied frozen on the words. A gsap.context scopes
      // both the kill and the style revert to this component.
      ctx = gsap.context(() => {
        const scroller = scrollContainerRef?.current ?? window;

        gsap.fromTo(
          el,
          { transformOrigin: '0% 50%', rotate: baseRotation },
          {
            ease: 'none',
            rotate: 0,
            scrollTrigger: {
              trigger: el,
              scroller,
              start: 'top bottom',
              end: rotationEnd,
              scrub: true
            }
          }
        );

        const wordElements = el.querySelectorAll<HTMLElement>('.word');
        if (!wordElements.length) return;

        // Upstream passed `willChange: 'opacity'` in the from-vars. A scrubbed
        // tween never "completes", so that inline will-change stuck to every
        // word for the life of the page, promoting each one to its own
        // compositor layer and dropping subpixel antialiasing on the text.
        gsap.fromTo(
          wordElements,
          { opacity: baseOpacity },
          {
            ease: 'none',
            opacity: 1,
            stagger: 0.05,
            scrollTrigger: {
              trigger: el,
              scroller,
              start: 'top bottom-=20%',
              end: wordAnimationEnd,
              scrub: true
            }
          }
        );

        if (enableBlur) {
          gsap.fromTo(
            wordElements,
            { filter: `blur(${blurStrength}px)` },
            {
              ease: 'none',
              filter: 'blur(0px)',
              stagger: 0.05,
              scrollTrigger: {
                trigger: el,
                scroller,
                start: 'top bottom-=20%',
                end: wordAnimationEnd,
                scrub: true
              }
            }
          );
        }
      }, el);
    };

    // Mounted in a background tab: defer the whole thing until the tab is
    // actually visible, so the un-animated text stays readable in the meantime.
    document.addEventListener('visibilitychange', build);
    build();

    return () => {
      document.removeEventListener('visibilitychange', build);
      ctx?.revert();
    };
  }, [scrollContainerRef, enableBlur, baseRotation, baseOpacity, rotationEnd, wordAnimationEnd, blurStrength]);

  // Upstream rendered <h2><p>…</p></h2>. A <p> is not valid inside a heading
  // (headings take phrasing content only), and it promoted an ordinary body
  // paragraph into a document heading, distorting the outline this site's SEO
  // depends on. The inner element drops to a <div> when the children are not
  // plain text, since a passed-through element may itself contain paragraphs.
  const Text = textOnly ? 'p' : 'div';

  return (
    <div ref={containerRef} className={cn('my-5', containerClassName)}>
      {/* Upstream concatenated its own classes ahead of `textClassName`, but
          class-attribute order does not decide Tailwind precedence, so the
          caller could not reliably override the display-scale size below.
          cn() merges them, so caller classes win. */}
      <Text className={cn('text-[clamp(1.6rem,4vw,3rem)] leading-[1.5] font-semibold', textClassName)}>
        {nodes}
      </Text>
    </div>
  );
};

export default ScrollReveal;
