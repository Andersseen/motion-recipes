function prefersReducedMotion(): boolean {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

const tabs = document.querySelectorAll<HTMLButtonElement>("[data-tab]");
const panels = document.querySelectorAll<HTMLElement>("[data-panel]");
let activeId = "overview";

function setActive(id: string): void {
  tabs.forEach((tab) => {
    const isActive = tab.dataset.tab === id;
    tab.classList.toggle("is-active", isActive);
    tab.setAttribute("aria-selected", String(isActive));
  });

  panels.forEach((panel) => {
    const isActive = panel.dataset.panel === id;
    panel.classList.toggle("is-active", isActive);
    panel.hidden = !isActive;
  });

  activeId = id;
}

const hasViewTransition = "startViewTransition" in document;

tabs.forEach((tab) => {
  tab.addEventListener("click", () => {
    const id = tab.dataset.tab;
    if (!id || id === activeId) return;

    if (!hasViewTransition || prefersReducedMotion()) {
      setActive(id);
      return;
    }

    const start = (document as Document & { startViewTransition?: (cb: () => void) => void }).startViewTransition;
    if (start) {
      start(() => setActive(id));
    } else {
      setActive(id);
    }
  });
});

export {};
