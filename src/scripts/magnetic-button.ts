import { prefersReducedMotion } from './reduced-motion';

export function initMagneticButton(container: HTMLElement): () => void {
  const button = container.querySelector<HTMLElement>('[data-magnetic-button]');
  if (!button) return () => {};
  const buttonEl = button;

  if (prefersReducedMotion()) {
    buttonEl.classList.add('reduced-motion');
    return () => {};
  }

  const maxOffset = 12;
  const abortController = new AbortController();
  const { signal } = abortController;

  function update(event: PointerEvent): void {
    const rect = buttonEl.getBoundingClientRect();
    const x = event.clientX - rect.left - rect.width / 2;
    const y = event.clientY - rect.top - rect.height / 2;

    const offsetX = (x / (rect.width / 2)) * maxOffset;
    const offsetY = (y / (rect.height / 2)) * maxOffset;

    buttonEl.style.setProperty('--mx', `${offsetX}px`);
    buttonEl.style.setProperty('--my', `${offsetY}px`);
  }

  function reset(): void {
    buttonEl.style.setProperty('--mx', '0px');
    buttonEl.style.setProperty('--my', '0px');
  }

  buttonEl.addEventListener('pointermove', update, { signal });
  buttonEl.addEventListener('pointerleave', reset, { signal });

  return () => abortController.abort();
}
