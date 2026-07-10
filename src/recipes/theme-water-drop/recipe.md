# Liquid Theme Switch (Water Drop) Implementation Recipe

## Goal

Reveal a new theme with an expanding `clip-path` circle that originates at the
click point — a drop falling — then ripple the freshly revealed surface with an
SVG turbulence filter so it settles like disturbed water. Built entirely on the
View Transitions API with a graceful instant-swap fallback.

## Requirements

- A "scene" element with a `view-transition-name`.
- A toggle that swaps theme state (CSS custom properties or a `data-` attribute).
- `document.startViewTransition` to capture the before/after snapshots.
- A WAAPI `clip-path` animation on `::view-transition-new(scene)`.
- An SVG `feTurbulence` + `feDisplacementMap` filter for the water wobble.
- Fallback for browsers without View Transitions, and reduced-motion support.

## Step 1: Build the scene

Give the themable container a `view-transition-name` so it is captured as its
own snapshot, independent of the rest of the page:

```css
.scene {
  view-transition-name: scene;
}
```

Drive its colors from custom properties that a `data-mode` attribute overrides,
so the swap is a single attribute change.

## Step 2: Swap state inside a view transition

```ts
const transition = document.startViewTransition(() => swap());
```

`swap()` just flips `scene.dataset.mode`. The API snapshots the old colors,
runs the callback, then snapshots the new colors.

## Step 3: Reveal with a clip-path circle (the drop)

Disable the default cross-fade and animate the new snapshot's `clip-path` from a
zero-radius circle at the click point out to the farthest corner:

```css
::view-transition-old(scene),
::view-transition-new(scene) { animation: none; }
::view-transition-new(scene) { z-index: 1; }
```

```ts
const radius = Math.hypot(
  Math.max(x, w - x),
  Math.max(y, h - y),
);
document.documentElement.animate(
  { clipPath: [
      `circle(0px at ${x}px ${y}px)`,
      `circle(${radius}px at ${x}px ${y}px)`,
  ] },
  { duration: 760, easing: "cubic-bezier(0.22, 1, 0.36, 1)",
    pseudoElement: "::view-transition-new(scene)" },
);
```

Coordinates are **relative to the scene box**, because the pseudo-element is
sized and positioned to the named element — not the viewport.

## Step 4: Ripple the surface (the water)

Apply an SVG turbulence + displacement filter to the new snapshot:

```css
::view-transition-new(scene) { filter: url(#liquid); }
```

Animate the displacement `scale` from a strong value down to `0`, and drift the
turbulence `baseFrequency`, so the incoming surface warps then settles:

```xml
<feDisplacementMap in="SourceGraphic" in2="noise" scale="0" ...>
  <animate data-displace attributeName="scale" dur="760ms"
    values="34;0" calcMode="spline" keySplines="0.22 1 0.36 1"
    fill="freeze" begin="indefinite" />
</feDisplacementMap>
```

Trigger the SMIL animations the moment the transition is ready:

```ts
transition.ready.then(() => {
  displace?.beginElement();
  turbulence?.beginElement();
});
```

## Step 5: Provide a fallback

If `startViewTransition` is missing or the user prefers reduced motion, call
`swap()` directly — the theme still changes, just without animation.

## Common pitfalls

- **Wrong coordinate space.** For a *named* transition the clip-path origin is
  relative to the element, not the viewport — subtract the scene's rect.
- **Animating on the wrong element.** View-transition pseudo-elements belong to
  the document root, so call `document.documentElement.animate(...)`, not
  `scene.animate(...)`.
- **Default cross-fade fighting the reveal.** Set `animation: none` on
  `::view-transition-old/new(scene)` or the built-in fade muddies the clip.
- **Root snapshot flashing.** Also silence `::view-transition-*(root)` so the
  unchanged page doesn't fade.
- **Astro-scoped pseudo rules.** View-transition pseudo-elements can't be
  scoped; put them in a global stylesheet.
- **Starting a transition while one is running** can throw — guard rapid clicks.

## Verification checklist

- [ ] The new theme reveals as a circle growing from the click point.
- [ ] The surface visibly ripples and settles (turbulence displacement).
- [ ] Clicking with the keyboard reveals from the scene's center.
- [ ] Unsupported browsers swap the theme instantly.
- [ ] Reduced motion disables the reveal and the ripple.
- [ ] Rapid repeated clicks never leave the scene half-clipped.
