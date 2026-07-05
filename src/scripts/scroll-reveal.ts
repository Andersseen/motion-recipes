import { prefersReducedMotion } from './reduced-motion';

function supportsScrollTimeline(): boolean {
  return CSS.supports('animation-timeline', 'view()');
}

export function initScrollReveal(container: HTMLElement): () => void {
  if (prefersReducedMotion()) {
    container.classList.add('reduced-motion');
    return () => {};
  }

  const items = Array.from(container.querySelectorAll<HTMLElement>('[data-reveal]'));
  if (items.length === 0) return () => {};

  // Modern path: CSS scroll-driven animations handle everything.
  if (supportsScrollTimeline()) {
    container.classList.add('supports-scroll-timeline');
    items.forEach((item, index) => {
      item.style.setProperty('--reveal-index', String(index));
    });
    return () => {};
  }

  // Fallback path: IntersectionObserver toggles a visible class.
  container.classList.add('fallback-io');

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    },
    {
      threshold: 0.15,
      rootMargin: '0px 0px -40px 0px',
    }
  );

  items.forEach((item, index) => {
    item.style.setProperty('--reveal-index', String(index));
    observer.observe(item);
  });

  return () => observer.disconnect();
}
