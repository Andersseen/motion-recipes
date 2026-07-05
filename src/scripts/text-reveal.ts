import { prefersReducedMotion } from './reduced-motion';

function splitWords(text: string): string[] {
  // Use Intl.Segmenter for word-level segmentation when available.
  if (typeof Intl !== 'undefined' && 'Segmenter' in Intl) {
    const segmenter = new Intl.Segmenter('en', { granularity: 'word' });
    return Array.from(segmenter.segment(text))
      .filter((segment) => segment.isWordLike)
      .map((segment) => segment.segment);
  }
  return text.trim().split(/\s+/);
}

export function initTextReveal(container: HTMLElement): () => void {
  const target = container.querySelector<HTMLElement>('[data-text-reveal]');
  if (!target) return () => {};

  const originalText = target.textContent ?? '';

  if (prefersReducedMotion()) {
    target.textContent = originalText;
    target.classList.add('reduced-motion');
    return () => {};
  }

  const words = splitWords(originalText);
  target.innerHTML = words
    .map(
      (word, index) =>
        `<span class="text-reveal-word" style="--reveal-index: ${index}"><span class="text-reveal-inner">${word}</span></span>`
    )
    .join(' ');

  target.classList.add('is-split');

  // Trigger animation after a short delay to ensure styles are applied.
  requestAnimationFrame(() => {
    target.classList.add('is-revealed');
  });

  return () => {
    target.textContent = originalText;
    target.classList.remove('is-split', 'is-revealed');
  };
}
