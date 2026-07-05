# Spotlight Card Implementation Recipe

## Goal

Build a card whose border and surface glow follows the cursor, using CSS custom properties and a radial gradient.

## Requirements

- A card element.
- Pointer tracking inside the card.
- CSS custom properties for spotlight coordinates.
- A radial-gradient layer for the glow.
- Reduced-motion fallback.

## Files to create

- `index.html`
- `styles.css`
- `spotlight.ts`

## Step 1: Markup

Use an `<article>` for the card and wrap the content so the gradient layer sits behind it.

## Step 2: Define spotlight coordinates

Expose `--spotlight-x` and `--spotlight-y` on the card.

```css
.spotlight-card {
  --spotlight-x: 50%;
  --spotlight-y: 50%;
}
```

## Step 3: Create the glow layer

Use a radial gradient as the card background, centered on the custom properties.

```css
background: radial-gradient(
  600px circle at var(--spotlight-x) var(--spotlight-y),
  rgba(139, 92, 246, 0.35),
  transparent 40%
);
```

## Step 4: Add a border highlight

Use a masked pseudo-element to draw a subtle border glow that also follows the cursor.

## Step 5: Track the pointer

Convert pointer coordinates to percentages relative to the card.

```ts
const x = ((event.clientX - rect.left) / rect.width) * 100;
const y = ((event.clientY - rect.top) / rect.height) * 100;
card.style.setProperty("--spotlight-x", `${x}%`);
card.style.setProperty("--spotlight-y", `${y}%`);
```

## Step 6: Reduced motion

Disable cursor tracking and use a static top-down gradient.

## Common pitfalls

- Reading layout on every `pointermove` can cause minor overhead; cache the rect when possible.
- The glow can reduce text contrast if the gradient is too strong.
- Touch devices do not have hover, so provide a meaningful static state.

## Verification checklist

- [ ] Glow follows the cursor smoothly.
- [ ] Border highlight stays aligned with the glow.
- [ ] Text remains readable.
- [ ] Reduced motion shows a static gradient.
- [ ] The card looks acceptable on touch devices.
