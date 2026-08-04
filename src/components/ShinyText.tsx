import React, { useState, useCallback, useEffect, useRef } from 'react';
import { motion, useMotionValue, useAnimationFrame, useTransform } from 'motion/react';

interface ShinyTextProps {
  text: string;
  disabled?: boolean;
  speed?: number;
  className?: string;
  /** Base glyph colour. Left undefined so the text inherits the caller's ink. */
  color?: string;
  /** Colour of the travelling highlight. Must clear 4.5:1 on paper (#FAF8F4). */
  shineColor?: string;
  /** Width of the highlight band, as a percentage of the sweep. */
  spread?: number;
  /** Angle of the highlight band in degrees. */
  angle?: number;
  yoyo?: boolean;
  pauseOnHover?: boolean;
  direction?: 'left' | 'right';
  delay?: number;
}

const prefersReducedMotion = () =>
  typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

// `background-clip: text` is what confines the sheen to the glyphs. Without it
// the overlay would paint as a solid gradient rectangle across the heading, so
// the sheen layer is only mounted when the browser actually supports it.
const supportsTextClip = () =>
  typeof CSS !== 'undefined' &&
  typeof CSS.supports === 'function' &&
  (CSS.supports('background-clip', 'text') || CSS.supports('-webkit-background-clip', 'text'));

const ShinyText: React.FC<ShinyTextProps> = ({
  text,
  disabled = false,
  speed = 2,
  className = '',
  // Upstream defaulted to `color: '#b5b5b5'` with `shineColor: '#ffffff'` — a
  // grey-on-black pairing. On #FAF8F4 paper the base is 1.9:1 and the white
  // shine is invisible. `color` now defaults to undefined so the glyphs inherit
  // the caller's ink colour, and the sheen defaults to the rust accent (7.6:1).
  color,
  shineColor = '#8A3324',
  // Upstream named this prop `spread` but wired it to the gradient *angle*, so
  // a caller widening the band to `spread={200}` instead reversed the sweep
  // direction. `spread` is now the band width and `angle` carries the rotation.
  spread = 40,
  angle = 120,
  yoyo = false,
  pauseOnHover = false,
  direction = 'left',
  delay = 0
}) => {
  const [isPaused, setIsPaused] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(prefersReducedMotion);
  const [clipSupported] = useState(supportsTextClip);
  const progress = useMotionValue(0);
  const elapsedRef = useRef(0);
  const lastTimeRef = useRef<number | null>(null);
  const directionRef = useRef(direction === 'left' ? 1 : -1);

  const animationDuration = speed * 1000;
  const delayDuration = delay * 1000;

  // Upstream ran the sweep unconditionally. Every other animation on this site
  // sits behind `prefers-reduced-motion`, and a JS rAF loop is not covered by
  // the global CSS opt-out in index.css, so it is honoured explicitly here.
  useEffect(() => {
    const query = window.matchMedia('(prefers-reduced-motion: reduce)');
    const onChange = () => setReducedMotion(query.matches);
    query.addEventListener('change', onChange);
    return () => query.removeEventListener('change', onChange);
  }, []);

  const shineActive = !disabled && !reducedMotion && clipSupported;

  useAnimationFrame(time => {
    if (!shineActive || isPaused) {
      lastTimeRef.current = null;
      return;
    }

    if (lastTimeRef.current === null) {
      lastTimeRef.current = time;
      return;
    }

    const deltaTime = time - lastTimeRef.current;
    lastTimeRef.current = time;

    elapsedRef.current += deltaTime;

    // Animation goes from 0 to 100
    if (yoyo) {
      const cycleDuration = animationDuration + delayDuration;
      const fullCycle = cycleDuration * 2;
      const cycleTime = elapsedRef.current % fullCycle;

      if (cycleTime < animationDuration) {
        // Forward animation: 0 -> 100
        const p = (cycleTime / animationDuration) * 100;
        progress.set(directionRef.current === 1 ? p : 100 - p);
      } else if (cycleTime < cycleDuration) {
        // Delay at end
        progress.set(directionRef.current === 1 ? 100 : 0);
      } else if (cycleTime < cycleDuration + animationDuration) {
        // Reverse animation: 100 -> 0
        const reverseTime = cycleTime - cycleDuration;
        const p = 100 - (reverseTime / animationDuration) * 100;
        progress.set(directionRef.current === 1 ? p : 100 - p);
      } else {
        // Delay at start
        progress.set(directionRef.current === 1 ? 0 : 100);
      }
    } else {
      const cycleDuration = animationDuration + delayDuration;
      const cycleTime = elapsedRef.current % cycleDuration;

      if (cycleTime < animationDuration) {
        // Animation phase: 0 -> 100
        const p = (cycleTime / animationDuration) * 100;
        progress.set(directionRef.current === 1 ? p : 100 - p);
      } else {
        // Delay phase - hold at end (shine off-screen)
        progress.set(directionRef.current === 1 ? 100 : 0);
      }
    }
  });

  useEffect(() => {
    directionRef.current = direction === 'left' ? 1 : -1;
    elapsedRef.current = 0;
    // Upstream reset to 0 for both directions, which snapped a `right` sweep to
    // the far end of its travel. Each direction resets to its own start.
    progress.set(direction === 'left' ? 0 : 100);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [direction]);

  // Transform: p=0 -> 150% (shine off right), p=100 -> -50% (shine off left)
  const backgroundPosition = useTransform(progress, p => `${150 - p * 2}% center`);

  const handleMouseEnter = useCallback(() => {
    if (pauseOnHover) setIsPaused(true);
  }, [pauseOnHover]);

  const handleMouseLeave = useCallback(() => {
    if (pauseOnHover) setIsPaused(false);
  }, [pauseOnHover]);

  // Upstream put `background-clip: text` + `-webkit-text-fill-color: transparent`
  // on the text itself, so the glyphs were a permanent gradient fill: banned as
  // decoration here, and the content vanishes outright whenever the background
  // image does not paint (forced-colors mode, print, background images off).
  // The sheen is now a separate aria-hidden layer *on top of* solid ink text —
  // the band is opaque only at its centre and transparent everywhere else, so
  // if this layer never renders the heading is still fully legible.
  const sheenStyle: React.CSSProperties = {
    backgroundImage: `linear-gradient(${angle}deg, transparent 0%, transparent ${Math.max(
      0,
      50 - spread / 2
    )}%, ${shineColor} 50%, transparent ${Math.min(100, 50 + spread / 2)}%, transparent 100%)`,
    backgroundSize: '200% auto',
    backgroundRepeat: 'no-repeat',
    // `inset-0` pins the layer to the padding box; inheriting the padding keeps
    // its glyphs on top of the real ones when the caller adds padding.
    padding: 'inherit',
    WebkitBackgroundClip: 'text',
    backgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    // Firefox has no `-webkit-text-fill-color`; it clips against `color`.
    color: 'transparent'
  };

  return (
    <span
      className={`relative inline-block ${className}`}
      style={color ? { color } : undefined}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {text}
      {shineActive && (
        <motion.span
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 select-none"
          style={{ ...sheenStyle, backgroundPosition }}
        >
          {text}
        </motion.span>
      )}
    </span>
  );
};

export default ShinyText;
