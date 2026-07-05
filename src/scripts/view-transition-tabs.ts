import { prefersReducedMotion } from './reduced-motion';

interface TabState {
  tab: HTMLElement;
  panel: HTMLElement;
}

export function initViewTransitionTabs(container: HTMLElement): () => void {
  const tabs = Array.from(container.querySelectorAll<HTMLButtonElement>('[data-tab]'));
  const panels = Array.from(container.querySelectorAll<HTMLElement>('[data-panel]'));
  if (tabs.length === 0 || panels.length === 0) return () => {};

  const tabMap = new Map<string, TabState>();
  tabs.forEach((tab) => {
    const id = tab.dataset.tab;
    if (!id) return;
    const panel = panels.find((p) => p.dataset.panel === id);
    if (panel) {
      tabMap.set(id, { tab, panel });
    }
  });

  let activeId = tabs.find((t) => t.getAttribute('aria-selected') === 'true')?.dataset.tab;
  if (!activeId) activeId = tabs[0].dataset.tab;

  const setActive = (id: string): void => {
    tabMap.forEach((state, key) => {
      const isActive = key === id;
      state.tab.setAttribute('aria-selected', String(isActive));
      state.tab.classList.toggle('is-active', isActive);
      state.panel.hidden = !isActive;
      state.panel.classList.toggle('is-active', isActive);
    });
    activeId = id;
  };

  const supportsViewTransition =
    typeof document !== 'undefined' && 'startViewTransition' in document;

  const abortController = new AbortController();
  const { signal } = abortController;

  tabs.forEach((tab) => {
    tab.addEventListener(
      'click',
      () => {
        const id = tab.dataset.tab;
        if (!id || id === activeId) return;

        const update = () => setActive(id);

        if (!supportsViewTransition || prefersReducedMotion()) {
          update();
          tab.focus();
          return;
        }

        const transition = (document as Document & { startViewTransition?: (callback: () => void) => { ready: Promise<void> } }).startViewTransition;
        if (!transition) {
          update();
          tab.focus();
          return;
        }

        transition.call(document, () => {
          update();
        });
      },
      { signal }
    );
  });

  // Keyboard navigation: Left/Right arrows move focus and selection.
  container.addEventListener(
    'keydown',
    (event) => {
      const ids = Array.from(tabMap.keys());
      const currentIndex = ids.indexOf(activeId ?? '');
      if (currentIndex === -1) return;

      let nextIndex = currentIndex;
      if (event.key === 'ArrowRight') {
        nextIndex = (currentIndex + 1) % ids.length;
      } else if (event.key === 'ArrowLeft') {
        nextIndex = (currentIndex - 1 + ids.length) % ids.length;
      } else {
        return;
      }

      event.preventDefault();
      const nextId = ids[nextIndex];
      const nextTab = tabMap.get(nextId)?.tab;
      if (nextTab) {
        nextTab.click();
        nextTab.focus();
      }
    },
    { signal }
  );

  return () => abortController.abort();
}
