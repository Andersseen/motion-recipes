# Magnetic Button Implementation Recipe

## Goal

Create a button that subtly pulls toward the cursor using pointer tracking and CSS custom properties.

## Requirements

- A button element.
- Pointer position relative to the button center.
- CSS custom properties to drive the transform.
- Reduced-motion fallback.

## Files to create

- `index.html`
- `styles.css`
- `magnetic.ts`

## Step 1: Markup

Use a `<button>` so the element remains accessible and keyboard-focusable.

## Step 2: Define custom properties

Expose `--mx` and `--my` on the button and use them in `transform`.

```css
.magnetic-button {
  --mx: 0px;
  --my: 0px;
  transform: translate(var(--mx), var(--my));
  transition: transform 120ms ease-out;
}
```

## Step 3: Track pointer movement

On `pointermove`, calculate the cursor distance from the button center normalized to a small range.

```ts
const rect = button.getBoundingClientRect();
const x = event.clientX - rect.left - rect.width / 2;
const y = event.clientY - rect.top - rect.height / 2;
const offsetX = (x / (rect.width / 2)) * maxOffset;
const offsetY = (y / (rect.height / 2)) * maxOffset;
```

## Step 4: Reset on leave

When the pointer leaves, set both custom properties back to `0px` so the button returns to its original position.

## Step 5: Reduced motion

If `prefers-reduced-motion` is active, skip the listeners and keep the button static.

## Common pitfalls

- Moving the hit area too far from the visual button can confuse users.
- Updating transform on every `pointermove` without a transition can feel twitchy.
- Forgetting `pointer-events: none` on inner text can cause the event target to flicker.

## Verification checklist

- [ ] Button pulls toward the cursor on hover.
- [ ] Button returns to center on pointer leave.
- [ ] Effect is disabled under reduced motion.
- [ ] Button remains keyboard-focusable and clickable.
