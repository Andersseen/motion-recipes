function prefersReducedMotion(): boolean {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

const button = document.querySelector<HTMLElement>("[data-magnetic]");
if (button && !prefersReducedMotion()) {
  const maxOffset = 12;

  button.addEventListener("pointermove", (event) => {
    const rect = button.getBoundingClientRect();
    const x = event.clientX - rect.left - rect.width / 2;
    const y = event.clientY - rect.top - rect.height / 2;

    const offsetX = (x / (rect.width / 2)) * maxOffset;
    const offsetY = (y / (rect.height / 2)) * maxOffset;

    button.style.setProperty("--mx", `${offsetX}px`);
    button.style.setProperty("--my", `${offsetY}px`);
  });

  button.addEventListener("pointerleave", () => {
    button.style.setProperty("--mx", "0px");
    button.style.setProperty("--my", "0px");
  });
}

export {};
