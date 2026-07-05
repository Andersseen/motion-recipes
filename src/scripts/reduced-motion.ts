/**
 * Returns true when the user has requested reduced motion.
 * Use this to skip or simplify animations.
 */
export function prefersReducedMotion(): boolean {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}
