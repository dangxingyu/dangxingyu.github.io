"use client";
import React, { useEffect, useId, useRef, useState } from "react";
import {
  motion,
  useTransform,
  useScroll,
  useSpring,
  useMotionValueEvent,
} from "motion/react";
import { cn } from "@/lib/utils";

export const TracingBeam = ({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) => {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start", "end start"],
  });

  const contentRef = useRef<HTMLDivElement>(null);
  const [svgHeight, setSvgHeight] = useState(0);

  // Upstream measured `offsetHeight` once, in an effect with an empty dep array.
  // That single reading is taken before the self-hosted Fraunces/Newsreader
  // faces swap in and before any resize reflow, so a tall column (the
  // publication list) kept whatever height it happened to have at mount — and
  // stayed at 0 forever if the column was still collapsed or display:none then.
  // A ResizeObserver re-measures on every reflow instead.
  useEffect(() => {
    const el = contentRef.current;
    if (!el) return;

    const measure = () => setSvgHeight(el.offsetHeight);
    measure();

    if (typeof ResizeObserver === "undefined") {
      window.addEventListener("resize", measure);
      return () => window.removeEventListener("resize", measure);
    }

    const observer = new ResizeObserver(measure);
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const y1 = useSpring(
    useTransform(scrollYProgress, [0, 0.8], [50, svgHeight]),
    {
      stiffness: 500,
      damping: 90,
    },
  );
  // Upstream ended the gradient at a bare `svgHeight - 200`, which is -200 on
  // the first frame (svgHeight starts at 0) and runs above y1's start for any
  // column shorter than 250px, inverting the beam. Clamped to y1's start.
  const y2 = useSpring(
    useTransform(scrollYProgress, [0, 1], [50, Math.max(svgHeight - 200, 50)]),
    {
      stiffness: 500,
      damping: 90,
    },
  );

  // Upstream called `scrollYProgress.get()` inside the `animate` props during
  // render. Reading a MotionValue that way never re-renders the component, so
  // the dot was frozen in its at-rest state for the life of the page.
  const [hasScrolled, setHasScrolled] = useState(false);
  useMotionValueEvent(scrollYProgress, "change", (latest) => {
    setHasScrolled(latest > 0);
  });

  // Upstream hardcoded `id="gradient"`, so a second TracingBeam on the page
  // would collide and both beams would resolve `url(#gradient)` to the first.
  // React's useId contains colons, which are not legal in an XML id.
  const gradientId = `tracing-beam-gradient-${useId().replace(/:/g, "")}`;

  return (
    <motion.div
      ref={ref}
      className={cn("relative mx-auto h-full w-full max-w-4xl", className)}
    >
      <div className="absolute top-3 -left-4 md:-left-20">
        <motion.div
          transition={{
            duration: 0.2,
            delay: 0.5,
          }}
          animate={{
            // Upstream shipped `rgba(0, 0, 0.24) 0px 3px 8px` — a three-argument
            // rgba() where the intended alpha landed in the blue channel, so it
            // resolved to opaque black rather than 24% black. Retuned to a soft
            // ink shadow that sits on paper.
            boxShadow: hasScrolled
              ? "none"
              : "rgba(22, 19, 15, 0.14) 0px 3px 8px",
          }}
          // Upstream: `border-netural-200 ... border-oklch(0.92 0.004 286.32)
          // ... dark:border-oklch(1 0 0 / 10%)`. The typo and the bare oklch()
          // tokens are not Tailwind v3 classes at all (that needs
          // `border-[oklch(...)]` with no spaces), so the ring had no colour of
          // its own, and the `dark:` variants would fight this always-light
          // page. Replaced with the rule token.
          className="ml-[27px] flex h-4 w-4 items-center justify-center rounded-full border border-rule shadow-sm"
        >
          <motion.div
            transition={{
              duration: 0.2,
              delay: 0.5,
            }}
            animate={{
              // Upstream lit the dot emerald (#10b981 / #059669) at rest and
              // turned it white once scrolling — a dark-page palette. Retuned to
              // the rust accent, settling to paper-raised inside a rule ring.
              backgroundColor: hasScrolled ? "#FFFDFA" : "#8A3324",
              borderColor: hasScrolled ? "#E3DDD2" : "#8A3324",
            }}
            className="h-2 w-2 rounded-full border border-rule bg-paper-raised"
          />
        </motion.div>
        <svg
          viewBox={`0 0 20 ${svgHeight}`}
          width="20"
          height={svgHeight} // Set the SVG height
          className="ml-4 block"
          aria-hidden="true"
        >
          <motion.path
            d={`M 1 0V -36 l 18 24 V ${svgHeight * 0.8} l -18 24V ${svgHeight}`}
            fill="none"
            // Upstream: `#9091A0` at 0.16 opacity, a cool grey tuned for a black
            // page. This is the rule token, so the un-filled beam reads as the
            // same hairline as every other rule on the page.
            stroke="#E3DDD2"
            transition={{
              duration: 10,
            }}
          ></motion.path>
          <motion.path
            d={`M 1 0V -36 l 18 24 V ${svgHeight * 0.8} l -18 24V ${svgHeight}`}
            fill="none"
            stroke={`url(#${gradientId})`}
            strokeWidth="1.25"
            className="motion-reduce:hidden"
            transition={{
              duration: 10,
            }}
          ></motion.path>
          <defs>
            <motion.linearGradient
              id={gradientId}
              gradientUnits="userSpaceOnUse"
              x1="0"
              x2="0"
              y1={y1} // set y1 for gradient
              y2={y2} // set y2 for gradient
            >
              {/* Upstream ran cyan #18CCFC into indigo #6344F5 into violet
                  #AE48FF — a neon beam for a black page. Retuned to the rust
                  accent falling into ink so it reads as wet ink on paper. */}
              <stop stopColor="#8A3324" stopOpacity="0"></stop>
              <stop stopColor="#8A3324"></stop>
              <stop offset="0.325" stopColor="#16130F"></stop>
              <stop offset="1" stopColor="#16130F" stopOpacity="0"></stop>
            </motion.linearGradient>
          </defs>
        </svg>
      </div>
      {/* The children are never given an animated initial state, so the column
          is readable with no beam, no observer and no motion at all. */}
      <div ref={contentRef}>{children}</div>
    </motion.div>
  );
};
