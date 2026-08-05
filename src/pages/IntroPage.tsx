import { ReactNode, useRef } from 'react';
import { personalInfo, publications } from '../data/content';
import { siteConfig } from '../config/siteConfig';
import { RichText } from '../components/RichText';
import { MailIcon, ScholarIcon, GithubIcon, XIcon, LinkedinIcon } from '../components/icons';
import VariableProximity from '../components/VariableProximity';
import Threads from '../components/Threads';
import SpotlightCard from '../components/SpotlightCard';
import { TiltCard } from '../components/TiltCard';
import { TracingBeam } from '../components/ui/tracing-beam';
import ScrollReveal from '../components/ScrollReveal';
import ShinyText from '../components/ShinyText';

/**
 * The bio's first paragraph carries the advisor links and must stay real
 * markup; the closing statement is plain prose, so it gets the word-by-word
 * scroll reveal (which only splits plain-string children).
 */
const BIO_PARAGRAPHS = personalInfo.bio.split(/\n\s*\n/).map((p) => p.trim()).filter(Boolean);
const BIO_LEAD = BIO_PARAGRAPHS[0] ?? personalInfo.bio;
const BIO_STATEMENT = BIO_PARAGRAPHS.slice(1).join(' ');

/** Rust accent (#8A3324) normalised for the Threads shader. */
const THREAD_COLOR: [number, number, number] = [0.541, 0.2, 0.141];

const AUTHOR = 'Xingyu Dang';

/**
 * Section entrance. Driven by `animation-timeline: view()` in index.css, not by
 * a JS observer: a rAF/IntersectionObserver reveal leaves `opacity: 0` baked in
 * whenever the callback never fires (background tab, no JS, observer error),
 * which would hide the entire publication list.
 */
function Reveal({
  children,
  className = '',
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={`reveal ${className}`}>
      {children}
    </div>
  );
}

const CONTACTS = [
  { label: 'Email', href: `mailto:${personalInfo.email}`, Icon: MailIcon },
  { label: 'Google Scholar', href: personalInfo.social.scholar, Icon: ScholarIcon },
  { label: 'GitHub', href: personalInfo.social.github, Icon: GithubIcon },
  { label: 'X', href: personalInfo.social.twitter, Icon: XIcon },
  { label: 'LinkedIn', href: personalInfo.social.linkedin, Icon: LinkedinIcon },
].filter((c): c is { label: string; href: string; Icon: typeof MailIcon } => Boolean(c.href));

function Hero() {
  const proximityRef = useRef<HTMLDivElement>(null);

  return (
    <section
      ref={proximityRef}
      className="relative mx-auto max-w-page px-6 pb-section pt-28 sm:px-10 lg:px-16 lg:pt-36"
    >
      {/* Animated thread field. Purely decorative: it sits behind the content,
          is pointer-transparent to everything except its own mouse tracking,
          and is masked so it dissolves into the paper instead of ending on a
          hard edge. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 -top-10 h-[620px] opacity-70"
        style={{
          maskImage:
            'radial-gradient(115% 78% at 62% 34%, #000 12%, rgba(0,0,0,0.55) 48%, transparent 82%)',
          WebkitMaskImage:
            'radial-gradient(115% 78% at 62% 34%, #000 12%, rgba(0,0,0,0.55) 48%, transparent 82%)',
        }}
      >
        <Threads
          color={THREAD_COLOR}
          amplitude={1.9}
          distance={0.32}
          enableMouseInteraction
        />
      </div>

      {/* The name responds to pointer distance through Fraunces' own variable
          axes — weight, softness and the WONK alternate — rather than through
          a transform. Real text, always rendered: nothing here can hide it. */}
      <h1 className="hero-name relative font-display text-display-xl text-ink">
        <VariableProximity
          label={personalInfo.name}
          containerRef={proximityRef}
          radius={190}
          falloff="gaussian"
          fromFontVariationSettings="'wght' 340, 'SOFT' 0, 'WONK' 0, 'opsz' 144"
          toFontVariationSettings="'wght' 900, 'SOFT' 100, 'WONK' 1, 'opsz' 144"
        />
      </h1>

      <div className="relative mt-7 flex items-center gap-5">
        <span className="h-px w-14 shrink-0 bg-accent" aria-hidden="true" />
        <p className="text-[1.0625rem] text-ink-muted">{personalInfo.title}</p>
      </div>

      <div className="relative mt-12 grid grid-cols-1 gap-x-16 gap-y-10 lg:grid-cols-12">
        <div className="lg:col-span-7">
          <RichText content={BIO_LEAD} className="prose-editorial max-w-measure text-body" />

          {BIO_STATEMENT && (
            <ScrollReveal
              baseRotation={0}
              baseOpacity={0.28}
              blurStrength={5}
              containerClassName="my-0 mt-[1.1em] max-w-measure"
              /* Arbitrary-value font size on purpose: the component's built-in
                 `text-[clamp(1.6rem,4vw,3rem)]` is an arbitrary value too, and
                 twMerge only dedupes it against another arbitrary one — a named
                 key like `text-body` loses and the statement renders at display
                 size, competing with the h1. */
              textClassName="font-text text-[1.0625rem] leading-[1.75] font-normal text-ink-muted"
            >
              {BIO_STATEMENT}
            </ScrollReveal>
          )}

          {/* Icon-only links, so each one carries its own accessible name via
              aria-label; the title attribute gives sighted users the tooltip. */}
          <ul className="mt-8 flex flex-wrap items-center gap-3">
            {CONTACTS.map(({ label, href, Icon }) => (
              <li key={label}>
                <a
                  href={href}
                  aria-label={label}
                  title={label}
                  className="contact-dot"
                  target={href.startsWith('http') ? '_blank' : undefined}
                  rel={href.startsWith('http') ? 'noopener noreferrer' : undefined}
                >
                  <Icon />
                </a>
              </li>
            ))}
          </ul>
        </div>

        <div className="lg:col-span-5 lg:pt-1">
          <figure className="max-w-[19rem]">
            <TiltCard className="bg-paper-raised p-2 shadow-[0_18px_40px_-24px_rgba(22,19,15,0.45)] ring-1 ring-rule">
              <img
                src={personalInfo.avatar}
                alt={`Portrait of ${personalInfo.name}`}
                width={400}
                height={400}
                className="aspect-square w-full object-cover object-top"
              />
            </TiltCard>
          </figure>
        </div>
      </div>
    </section>
  );
}

function ResearchInterests() {
  if (!siteConfig.sections.researchInterests) return null;

  return (
    <section className="mx-auto max-w-page px-6 sm:px-10 lg:px-16">
      <Reveal>
        <div className="border-y border-rule py-6">
          <ul className="flex flex-wrap items-baseline gap-x-4 gap-y-3">
            {personalInfo.researchInterests.map((interest, i) => (
              <li key={interest} className="flex items-baseline gap-4">
                {i > 0 && (
                  <span className="text-rule-strong" aria-hidden="true">
                    /
                  </span>
                )}
                <span className="font-display text-[1.0625rem] text-ink-muted">
                  {interest}
                </span>
              </li>
            ))}
          </ul>
        </div>
      </Reveal>
    </section>
  );
}

/** Author list with the site owner set in ink and everyone else muted. */
function Authors({ authors }: { authors: string[] }) {
  return (
    <p className="mt-2 text-[0.9375rem] text-ink-faint">
      {authors.map((a, i) => {
        const isOwner = a.replace(/\*/g, '').trim() === AUTHOR;
        return (
          <span key={a}>
            <span className={isOwner ? 'font-semibold text-ink-muted' : undefined}>{a}</span>
            {i < authors.length - 1 && ', '}
          </span>
        );
      })}
    </p>
  );
}

function Publications() {
  if (!siteConfig.sections.publications) return null;

  // The tracing beam parks itself at -left-4 / md:-left-20, so the section has
  // to leave a left gutter at lg+ or the beam clips off-screen.
  return (
    <section className="mx-auto max-w-page px-6 py-section sm:px-10 lg:pl-28 lg:pr-16">
      <Reveal>
        <h2 className="font-display text-display-md font-medium text-ink">
          <ShinyText text="Selected Publications" className="text-ink" speed={3.2} delay={5} />
        </h2>
      </Reveal>

      <TracingBeam className="mt-10 max-w-none">
      <ol>
        {publications.map((pub, i) => (
          <li key={pub.id}>
            <Reveal>
              <SpotlightCard
                className="border-t border-rule"
                spotlightColor="rgba(138, 51, 36, 0.13)"
              >
              <article className="group relative grid grid-cols-1 gap-x-10 py-6 sm:grid-cols-[5.5rem_1fr]">
                <div className="mb-3 sm:mb-0">
                  <span className="text-micro uppercase text-ink-faint transition-colors duration-500 ease-out group-hover:text-accent">
                    {pub.year}
                  </span>
                </div>

                <div>
                  <h3 className="max-w-[52ch] text-title text-ink transition-colors duration-500 ease-out group-hover:text-accent">
                    {pub.pdf ? (
                      <a href={pub.pdf} target="_blank" rel="noopener noreferrer">
                        <span className="absolute inset-0" aria-hidden="true" />
                        {pub.title}
                      </a>
                    ) : (
                      pub.title
                    )}
                  </h3>

                  <Authors authors={pub.authors} />

                  <p className="mt-1 text-[0.9375rem] text-ink-muted">{pub.venue}</p>

                  {(pub.summary || pub.pdf) && (
                    <div className="mt-3 flex items-baseline justify-between gap-8">
                      <p className="pub-summary max-w-measure">{pub.summary}</p>
                      {pub.pdf && (
                        <span className="inline-flex shrink-0 items-baseline gap-2 text-[0.9375rem] text-ink-muted transition-colors duration-500 ease-out group-hover:text-accent">
                          arXiv
                          <span className="inline-block transition-transform duration-500 ease-out group-hover:translate-x-1.5">
                            &rarr;
                          </span>
                        </span>
                      )}
                    </div>
                  )}
                </div>
              </article>
              </SpotlightCard>
            </Reveal>
          </li>
        ))}
      </ol>
      </TracingBeam>

      {personalInfo.social.scholar && (
        <Reveal>
          <div className="border-t border-rule pt-8">
            <a
              href={personalInfo.social.scholar}
              target="_blank"
              rel="noopener noreferrer"
              className="link-rule text-[0.9375rem]"
            >
              Full publication list on Google Scholar
            </a>
          </div>
        </Reveal>
      )}
    </section>
  );
}

function Footer() {
  return (
    <footer className="mx-auto max-w-page px-6 pb-20 sm:px-10 lg:px-16">
      <div className="border-t border-rule pt-8">
        <p className="text-[0.875rem] text-ink-faint">Last updated {__BUILD_DATE__}</p>
      </div>
    </footer>
  );
}

export function IntroPage() {
  return (
    <>
      {siteConfig.sections.hero && <Hero />}
      <ResearchInterests />
      <Publications />
      <Footer />

    </>
  );
}
