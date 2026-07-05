function prefersReducedMotion(): boolean {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

function splitWords(text: string): string[] {
  if (typeof Intl !== "undefined" && "Segmenter" in Intl) {
    const segmenter = new Intl.Segmenter("en", { granularity: "word" });
    return Array.from(segmenter.segment(text))
      .filter((segment) => segment.isWordLike)
      .map((segment) => segment.segment);
  }
  return text.trim().split(/\s+/);
}

const target = document.querySelector<HTMLElement>("[data-reveal-text]");

if (target) {
  if (prefersReducedMotion()) {
    target.classList.add("is-revealed");
  } else {
    const words = splitWords(target.textContent ?? "");
    target.innerHTML = words
      .map(
        (word, index) =>
          `<span class="text-reveal__word"><span class="text-reveal__inner" style="--index: ${index}">${word}</span></span>`
      )
      .join(" ");
    target.classList.add("is-revealed");
  }
}

export {};
