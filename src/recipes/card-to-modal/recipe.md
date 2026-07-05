# Card to Modal Implementation Recipe

## Goal

Build a shared-element transition that expands a card into a centered modal while preserving visual continuity and remaining accessible.

## Requirements

- A trigger card with a known bounding rectangle.
- A modal shell that starts exactly over the card.
- Smooth interpolation of position and size.
- Keyboard support (Enter, Space, Escape, focus management).
- Reduced-motion fallback.

## Files to create

- `index.html`
- `styles.css`
- `card-to-modal.ts`

## Step 1: Build the static markup

Create a card element and a separate modal template you can inject dynamically. Keep the modal content simple: a close button, a title and a content area.

## Step 2: Add base styles

Style the card and the modal shell. The shell must use `position: fixed` so it can be placed anywhere on screen without affecting layout. Add a semi-transparent backdrop.

## Step 3: Capture the trigger rect

On trigger click, call `trigger.getBoundingClientRect()`. This gives you the exact pixel position and size to use as the animation start state.

## Step 4: Create and position the shell

Inject the modal into `document.body`. Set the shell's `left`, `top`, `width` and `height` to match the trigger rect. Force a layout read (`offsetWidth`) so the browser records the initial state.

## Step 5: Calculate the final state

Compute a centered rectangle that fits the viewport with comfortable padding:

```ts
const finalW = Math.min(640, window.innerWidth - 48);
const finalH = Math.min(420, window.innerHeight - 48);
const finalLeft = (window.innerWidth - finalW) / 2;
const finalTop = (window.innerHeight - finalH) / 2;
```

## Step 6: Animate with WAAPI

Use `element.animate` to interpolate the shell geometry. WAAPI keeps the animation off the main thread when possible and gives precise timing.

```ts
shell.animate(
  [
    { left: `${initialRect.left}px`, top: `${initialRect.top}px`, width: `${initialRect.width}px`, height: `${initialRect.height}px` },
    { left: `${finalLeft}px`, top: `${finalTop}px`, width: `${finalW}px`, height: `${finalH}px` },
  ],
  { duration: 400, easing: "cubic-bezier(0.16, 1, 0.3, 1)", fill: "both" }
);
```

## Step 7: Fade the backdrop and content

Animate the backdrop opacity from 0 to 1. Fade the modal content slightly after the expansion begins so it does not feel cramped inside the small card.

## Step 8: Add accessibility

- Set `role="dialog"`, `aria-modal="true"` and `aria-labelledby` on the modal root.
- Move focus to the modal title when the animation ends.
- Close on `Escape` and on backdrop click.
- Return focus to the trigger when closing.

## Step 9: Add reduced motion

If `prefers-reduced-motion` is active, set animation durations to `0` and apply the final state immediately.

## Step 10: Test manually

- Open and close with mouse.
- Open with keyboard (Enter/Space) and close with Escape.
- Enable reduced motion in your OS and verify the modal appears instantly.
- Resize the browser and confirm the modal still fits.

## Common pitfalls

- Animating `width`/`height`/`top`/`left` without a FLIP setup causes layout thrashing.
- Forgetting to force layout before starting the animation makes the shell jump to the final state.
- Not returning focus leaves keyboard users stranded.
- Creating the modal inside the card's layout context breaks the fixed positioning.

## Verification checklist

- [ ] Card expands smoothly to the modal position.
- [ ] Backdrop fades in.
- [ ] Escape closes the modal.
- [ ] Focus moves into the modal and returns to the trigger.
- [ ] Reduced motion disables the animation.
- [ ] The effect works at different viewport sizes.
