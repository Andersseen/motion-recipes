import { prefersReducedMotion } from './reduced-motion';

/**
 * Liquid theme switch: a "water drop" reveal built on the View Transitions API.
 *
 * 1. The theme swap runs inside `document.startViewTransition`.
 * 2. The new theme is revealed by an expanding `clip-path: circle()` that
 *    originates at the click point (the drop falling).
 * 3. An SVG turbulence + displacement filter wobbles the freshly revealed
 *    surface and settles it to flat, imitating ripples spreading on water.
 *
 * Everything is scoped to the scene via `view-transition-name: wd-scene`, so
 * only the demo card animates — the rest of the page stays still. Degrades to
 * an instant swap when View Transitions are unsupported or reduced motion is on.
 */

const REVEAL_MS = 760;
const REVEAL_EASE = 'cubic-bezier(0.22, 1, 0.36, 1)';

type Origin = { x: number; y: number };

type ViewTransitionDocument = Document & {
  startViewTransition?: (callback: () => void | Promise<void>) => {
    ready: Promise<void>;
    finished: Promise<void>;
  };
};

/** Click position relative to the scene box; falls back to its center (keyboard). */
function originInside(scene: HTMLElement, event?: Event): Origin {
  const rect = scene.getBoundingClientRect();
  const pointer = event as PointerEvent | undefined;
  if (pointer && typeof pointer.clientX === 'number' && (pointer.clientX || pointer.clientY)) {
    return { x: pointer.clientX - rect.left, y: pointer.clientY - rect.top };
  }
  return { x: rect.width / 2, y: rect.height / 2 };
}

export function initThemeWaterDrop(container: HTMLElement): () => void {
  const scene = container.querySelector<HTMLElement>('[data-wd-scene]');
  const button = container.querySelector<HTMLElement>('[data-wd-toggle]');
  if (!scene || !button) return () => {};

  // SMIL <animate> nodes that drive the water wobble (optional enhancement).
  const turbulence = container.querySelector<SVGAnimateElement>('[data-wd-turbulence]');
  const displace = container.querySelector<SVGAnimateElement>('[data-wd-displace]');

  const controller = new AbortController();
  const { signal } = controller;

  const swap = (): void => {
    const next = scene.dataset.mode === 'night' ? 'day' : 'night';
    scene.dataset.mode = next;
    button.setAttribute('aria-pressed', String(next === 'night'));
  };

  const supportsViewTransition = 'startViewTransition' in document;

  button.addEventListener(
    'click',
    (event) => {
      if (!supportsViewTransition || prefersReducedMotion()) {
        swap();
        return;
      }

      const origin = originInside(scene, event);
      const start = (document as ViewTransitionDocument).startViewTransition!;
      const transition = start(() => swap());

      transition.ready
        .then(() => {
          const w = scene.clientWidth;
          const h = scene.clientHeight;
          const radius = Math.hypot(
            Math.max(origin.x, w - origin.x),
            Math.max(origin.y, h - origin.y),
          );

          // The drop: reveal the new theme with an expanding circle.
          document.documentElement.animate(
            {
              clipPath: [
                `circle(0px at ${origin.x}px ${origin.y}px)`,
                `circle(${radius}px at ${origin.x}px ${origin.y}px)`,
              ],
            },
            {
              duration: REVEAL_MS,
              easing: REVEAL_EASE,
              pseudoElement: '::view-transition-new(wd-scene)',
            },
          );

          // The ripples: kick the SVG turbulence + displacement so the newly
          // revealed surface wobbles and settles like disturbed water.
          try {
            turbulence?.beginElement();
            displace?.beginElement();
          } catch {
            /* SMIL unsupported — the clip-path reveal still plays. */
          }
        })
        .catch(() => {
          /* Reveal is best-effort; the theme has already swapped. */
        });
    },
    { signal },
  );

  return () => controller.abort();
}
