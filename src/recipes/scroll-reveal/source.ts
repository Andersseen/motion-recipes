function prefersReducedMotion(): boolean {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

function supportsScrollTimeline(): boolean {
  return CSS.supports("animation-timeline", "view()");
}

function initScrollReveal(): void {
  if (prefersReducedMotion()) return;
  if (supportsScrollTimeline()) return;

  const items = document.querySelectorAll<HTMLElement>("[data-reveal]");
  items.forEach((item) => item.classList.add("is-hidden"));

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.15, rootMargin: "0px 0px -40px 0px" }
  );

  items.forEach((item) => observer.observe(item));
}

initScrollReveal();

export {};
