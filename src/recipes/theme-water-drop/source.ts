const REVEAL_MS = 760;
const REVEAL_EASE = "cubic-bezier(0.22, 1, 0.36, 1)";

function prefersReducedMotion(): boolean {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

const scene = document.querySelector<HTMLElement>("[data-scene]")!;
const toggle = document.querySelector<HTMLElement>("[data-toggle]")!;
const turbulence = document.querySelector<SVGAnimateElement>("[data-turbulence]");
const displace = document.querySelector<SVGAnimateElement>("[data-displace]");

function swap(): void {
  const next = scene.dataset.mode === "night" ? "day" : "night";
  scene.dataset.mode = next;
  toggle.setAttribute("aria-pressed", String(next === "night"));
}

const hasViewTransition = "startViewTransition" in document;

toggle.addEventListener("click", (event) => {
  // Fallback: swap instantly with no animation.
  if (!hasViewTransition || prefersReducedMotion()) {
    swap();
    return;
  }

  // Click position relative to the scene (falls back to its center on keyboard).
  const rect = scene.getBoundingClientRect();
  const pointer = event as PointerEvent;
  const x = pointer.clientX || pointer.clientY ? pointer.clientX - rect.left : rect.width / 2;
  const y = pointer.clientX || pointer.clientY ? pointer.clientY - rect.top : rect.height / 2;

  const start = (
    document as Document & {
      startViewTransition: (cb: () => void) => { ready: Promise<void> };
    }
  ).startViewTransition;

  const transition = start(() => swap());

  transition.ready.then(() => {
    const radius = Math.hypot(
      Math.max(x, scene.clientWidth - x),
      Math.max(y, scene.clientHeight - y),
    );

    // The drop: expand a clip-path circle from the click point.
    document.documentElement.animate(
      {
        clipPath: [
          `circle(0px at ${x}px ${y}px)`,
          `circle(${radius}px at ${x}px ${y}px)`,
        ],
      },
      {
        duration: REVEAL_MS,
        easing: REVEAL_EASE,
        pseudoElement: "::view-transition-new(scene)",
      },
    );

    // The ripples: kick the SVG turbulence + displacement so the surface settles.
    try {
      turbulence?.beginElement();
      displace?.beginElement();
    } catch {
      /* SMIL unsupported — the clip-path reveal still plays. */
    }
  });
});

export {};
