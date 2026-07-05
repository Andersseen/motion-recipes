function prefersReducedMotion(): boolean {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

function openCardModal(trigger: HTMLElement): void {
  const initialRect = trigger.getBoundingClientRect();

  const root = document.createElement("div");
  root.className = "card-modal-root";
  root.setAttribute("role", "dialog");
  root.setAttribute("aria-modal", "true");
  root.setAttribute("aria-labelledby", "modal-title");
  root.innerHTML = `
    <div class="card-modal-backdrop" data-backdrop></div>
    <div class="card-modal-shell" data-shell>
      <button class="card-modal-close" aria-label="Close" type="button">×</button>
      <div class="card-modal-content">
        <h2 id="modal-title" tabindex="-1">Aurora Dashboard</h2>
        <p>Expanded modal content goes here.</p>
      </div>
    </div>
  `;
  document.body.appendChild(root);

  const shell = root.querySelector<HTMLElement>("[data-shell]")!;
  const backdrop = root.querySelector<HTMLElement>("[data-backdrop]")!;

  shell.style.left = `${initialRect.left}px`;
  shell.style.top = `${initialRect.top}px`;
  shell.style.width = `${initialRect.width}px`;
  shell.style.height = `${initialRect.height}px`;

  void shell.offsetWidth;

  const viewportW = window.innerWidth;
  const viewportH = window.innerHeight;
  const finalW = Math.min(640, viewportW - 48);
  const finalH = Math.min(420, viewportH - 48);
  const finalLeft = (viewportW - finalW) / 2;
  const finalTop = (viewportH - finalH) / 2;

  const reduced = prefersReducedMotion();
  const duration = reduced ? 0 : 400;

  const animation = shell.animate(
    [
      { left: `${initialRect.left}px`, top: `${initialRect.top}px`, width: `${initialRect.width}px`, height: `${initialRect.height}px` },
      { left: `${finalLeft}px`, top: `${finalTop}px`, width: `${finalW}px`, height: `${finalH}px` },
    ],
    { duration, easing: "cubic-bezier(0.16, 1, 0.3, 1)", fill: "both" }
  );

  if (!reduced) {
    backdrop.animate([{ opacity: 0 }, { opacity: 1 }], { duration: 300, fill: "both" });
  } else {
    backdrop.style.opacity = "1";
  }

  animation.onfinish = () => {
    shell.style.left = `${finalLeft}px`;
    shell.style.top = `${finalTop}px`;
    shell.style.width = `${finalW}px`;
    shell.style.height = `${finalH}px`;
    root.querySelector<HTMLElement>("#modal-title")?.focus();
  };

  function close(): void {
    const currentRect = shell.getBoundingClientRect();
    const targetRect = trigger.getBoundingClientRect();
    const closeDuration = reduced ? 0 : 350;

    const closeAnimation = shell.animate(
      [
        { left: `${currentRect.left}px`, top: `${currentRect.top}px`, width: `${currentRect.width}px`, height: `${currentRect.height}px` },
        { left: `${targetRect.left}px`, top: `${targetRect.top}px`, width: `${targetRect.width}px`, height: `${targetRect.height}px` },
      ],
      { duration: closeDuration, easing: "cubic-bezier(0.16, 1, 0.3, 1)", fill: "both" }
    );

    if (!reduced) {
      backdrop.animate([{ opacity: 1 }, { opacity: 0 }], { duration: 300, fill: "both" });
    }

    closeAnimation.onfinish = () => {
      root.remove();
      trigger.focus();
    };
  }

  root.querySelector(".card-modal-close")?.addEventListener("click", close);
  backdrop.addEventListener("click", close);
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") close();
  }, { once: true });
}

const trigger = document.querySelector<HTMLElement>("[data-card-trigger]");
trigger?.addEventListener("click", () => openCardModal(trigger));

export {};
