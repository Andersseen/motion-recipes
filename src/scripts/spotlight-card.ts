import { prefersReducedMotion } from './reduced-motion';

export function initSpotlightCard(container: HTMLElement): () => void {
  const card = container.querySelector<HTMLElement>('[data-spotlight-card]');
  if (!card) return () => {};
  const cardEl = card;

  if (prefersReducedMotion()) {
    cardEl.classList.add('reduced-motion');
    return () => {};
  }

  const abortController = new AbortController();
  const { signal } = abortController;

  function update(event: PointerEvent): void {
    const rect = cardEl.getBoundingClientRect();
    const x = ((event.clientX - rect.left) / rect.width) * 100;
    const y = ((event.clientY - rect.top) / rect.height) * 100;
    cardEl.style.setProperty('--spotlight-x', `${x}%`);
    cardEl.style.setProperty('--spotlight-y', `${y}%`);
  }

  cardEl.addEventListener('pointermove', update, { signal });

  return () => abortController.abort();
}
