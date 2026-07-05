import { prefersReducedMotion } from './reduced-motion';

interface ModalElements {
  root: HTMLElement;
  shell: HTMLElement;
  backdrop: HTMLElement;
  content: HTMLElement;
  closeBtn: HTMLButtonElement;
  title: HTMLElement;
}

export function initCardToModal(container: HTMLElement): () => void {
  const trigger = container.querySelector<HTMLElement>('[data-card-trigger]');
  if (!trigger) return () => {};
  const triggerEl = trigger;

  let isOpen = false;
  let modal: ModalElements | null = null;
  let initialRect: DOMRect;
  const abortController = new AbortController();
  const { signal } = abortController;

  function buildModal(): ModalElements {
    const root = document.createElement('div');
    root.className = 'card-modal-root';
    root.setAttribute('role', 'dialog');
    root.setAttribute('aria-modal', 'true');
    root.setAttribute('aria-labelledby', 'card-modal-title');

    root.innerHTML = `
      <div class="card-modal-backdrop" data-backdrop></div>
      <div class="card-modal-shell" data-shell>
        <button class="card-modal-close" aria-label="Close modal" type="button">
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
            <path d="M3 3l10 10M13 3L3 13" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
          </svg>
        </button>
        <div class="card-modal-content" data-content>
          <span class="card-modal-tag">Case study</span>
          <h2 id="card-modal-title" class="card-modal-title" tabindex="-1">Aurora Dashboard</h2>
          <p class="card-modal-lead">
            A real-time analytics interface designed for clarity, speed and calm motion.
          </p>
          <p>
            The shared-element transition you just saw is built entirely with browser-native APIs.
            We measure the trigger card, create a fixed shell on top of it, then interpolate the
            geometry to the final modal position. No framework, no heavy runtime.
          </p>
          <div class="card-modal-actions">
            <button class="card-modal-button" type="button">View live project</button>
            <button class="card-modal-button card-modal-button-ghost" type="button">Read case study</button>
          </div>
        </div>
      </div>
    `;

    document.body.appendChild(root);

    return {
      root,
      shell: root.querySelector('[data-shell]') as HTMLElement,
      backdrop: root.querySelector('[data-backdrop]') as HTMLElement,
      content: root.querySelector('[data-content]') as HTMLElement,
      closeBtn: root.querySelector('.card-modal-close') as HTMLButtonElement,
      title: root.querySelector('#card-modal-title') as HTMLElement,
    };
  }

  function open(): void {
    if (isOpen) return;
    isOpen = true;
    initialRect = triggerEl.getBoundingClientRect();

    modal = buildModal();

    // Position the shell exactly over the trigger.
    modal.shell.style.left = `${initialRect.left}px`;
    modal.shell.style.top = `${initialRect.top}px`;
    modal.shell.style.width = `${initialRect.width}px`;
    modal.shell.style.height = `${initialRect.height}px`;

    // Force layout so the browser records the initial styles.
    void modal.shell.offsetWidth;

    const viewportW = window.innerWidth;
    const viewportH = window.innerHeight;
    const padding = 24;
    const maxW = Math.min(640, viewportW - padding * 2);
    const maxH = Math.min(520, viewportH - padding * 2);
    const finalLeft = (viewportW - maxW) / 2;
    const finalTop = (viewportH - maxH) / 2;

    const reduced = prefersReducedMotion();
    const duration = reduced ? 0 : 420;

    const shellAnimation = modal.shell.animate(
      [
        {
          left: `${initialRect.left}px`,
          top: `${initialRect.top}px`,
          width: `${initialRect.width}px`,
          height: `${initialRect.height}px`,
        },
        {
          left: `${finalLeft}px`,
          top: `${finalTop}px`,
          width: `${maxW}px`,
          height: `${maxH}px`,
        },
      ],
      {
        duration,
        easing: 'cubic-bezier(0.16, 1, 0.3, 1)',
        fill: 'both',
      }
    );

    if (reduced) {
      modal.backdrop.style.opacity = '1';
      modal.content.style.opacity = '1';
    } else {
      modal.backdrop.animate([{ opacity: 0 }, { opacity: 1 }], {
        duration: 300,
        easing: 'ease-out',
        fill: 'both',
      });
      modal.content.animate([{ opacity: 0 }, { opacity: 1 }], {
        duration: 250,
        delay: 180,
        easing: 'ease-out',
        fill: 'both',
      });
    }

    shellAnimation.onfinish = () => {
      if (!modal) return;
      modal.shell.style.left = `${finalLeft}px`;
      modal.shell.style.top = `${finalTop}px`;
      modal.shell.style.width = `${maxW}px`;
      modal.shell.style.height = `${maxH}px`;
      modal.title.focus();
    };

    modal.closeBtn.addEventListener('click', close, { signal });
    modal.backdrop.addEventListener('click', close, { signal });
    document.addEventListener(
      'keydown',
      (event) => {
        if (event.key === 'Escape') close();
      },
      { signal }
    );
  }

  function close(): void {
    if (!isOpen || !modal) return;
    isOpen = false;

    const currentRect = modal.shell.getBoundingClientRect();
    const targetRect = triggerEl.getBoundingClientRect();
    const reduced = prefersReducedMotion();
    const duration = reduced ? 0 : 360;

    const shellAnimation = modal.shell.animate(
      [
        {
          left: `${currentRect.left}px`,
          top: `${currentRect.top}px`,
          width: `${currentRect.width}px`,
          height: `${currentRect.height}px`,
        },
        {
          left: `${targetRect.left}px`,
          top: `${targetRect.top}px`,
          width: `${targetRect.width}px`,
          height: `${targetRect.height}px`,
        },
      ],
      {
        duration,
        easing: 'cubic-bezier(0.16, 1, 0.3, 1)',
        fill: 'both',
      }
    );

    if (reduced) {
      modal.backdrop.style.opacity = '0';
    } else {
      modal.backdrop.animate([{ opacity: 1 }, { opacity: 0 }], {
        duration: 280,
        easing: 'ease-in',
        fill: 'both',
      });
    }

    shellAnimation.onfinish = () => {
      modal?.root.remove();
      modal = null;
      triggerEl.focus();
    };
  }

  function handleTriggerClick(event: Event): void {
    event.preventDefault();
    open();
  }

  triggerEl.addEventListener('click', handleTriggerClick, { signal });
  triggerEl.setAttribute('role', 'button');
  triggerEl.setAttribute('tabindex', '0');
  triggerEl.addEventListener(
    'keydown',
    (event) => {
      if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        open();
      }
    },
    { signal }
  );

  return () => {
    abortController.abort();
    if (modal) {
      modal.root.remove();
      modal = null;
    }
  };
}
