import { ReactNode, useRef } from 'react';

/**
 * Pointer-tracked 3D tilt with a moving specular sheen.
 *
 * Hand-written rather than pulled from a registry: it is ~40 lines, needs no
 * runtime dependency, and cannot strand its children — the transform is only
 * ever applied on top of normally-rendered content, and every value resets to
 * neutral on pointer leave.
 *
 * Honours `prefers-reduced-motion` by refusing to attach the handlers at all.
 */
export function TiltCard({
  children,
  className = '',
  max = 9,
}: {
  children: ReactNode;
  className?: string;
  /** Maximum rotation in degrees on each axis. */
  max?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const frame = useRef(0);

  const reduced =
    typeof window !== 'undefined' &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const apply = (rx: number, ry: number, mx: number, my: number, lift: number) => {
    const el = ref.current;
    if (!el) return;
    el.style.setProperty('--tilt-rx', `${rx}deg`);
    el.style.setProperty('--tilt-ry', `${ry}deg`);
    el.style.setProperty('--tilt-mx', `${mx}%`);
    el.style.setProperty('--tilt-my', `${my}%`);
    el.style.setProperty('--tilt-lift', String(lift));
  };

  const onPointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (reduced || !ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const px = (e.clientX - rect.left) / rect.width;
    const py = (e.clientY - rect.top) / rect.height;

    cancelAnimationFrame(frame.current);
    frame.current = requestAnimationFrame(() =>
      apply((0.5 - py) * max * 2, (px - 0.5) * max * 2, px * 100, py * 100, 1)
    );
  };

  const onPointerLeave = () => {
    if (reduced) return;
    cancelAnimationFrame(frame.current);
    apply(0, 0, 50, 50, 0);
  };

  return (
    <div
      ref={ref}
      onPointerMove={onPointerMove}
      onPointerLeave={onPointerLeave}
      className={`tilt-card ${className}`}
    >
      {children}
      <span className="tilt-sheen" aria-hidden="true" />
    </div>
  );
}
