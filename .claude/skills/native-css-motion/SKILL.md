---
name: native-css-motion
description: Build web animation with browser-native APIs (no animation libraries) the way Motion Recipes does it. Use when writing or reviewing any motion in this repo — CSS animations/transitions, scroll-driven animations (animation-timeline), View Transitions, the Web Animations API (WAAPI), IntersectionObserver reveals, FLIP, interpolate-size, or @starting-style. Covers choosing the right native technique, feature detection, the mandatory three-tier progressive-enhancement + reduced-motion pattern, and performance/accessibility rules. For wiring a technique into a catalog recipe, pair with the add-motion-recipe skill.
metadata:
  author: motion-recipes
  version: "1.0"
---

# Native CSS / browser motion

This project animates with **browser-native APIs only** — no GSAP, Framer
Motion, anime.js, or similar. Motion should be small, GPU-friendly, and
accessible. This skill is the decision guide + the rules; techniques in depth
live in `references/techniques.md`.

## Rules that apply to all motion

1. **Compositor-only properties.** Animate `transform`, `opacity`, and (sparingly)
   `filter`. Avoid animating `width`, `height`, `top/left`, `margin` — they
   trigger layout. The exception is deliberate size interpolation
   (`interpolate-size` / measured `max-height`), which is its own technique.
2. **Three tiers, reduced-motion first.**
   - Check `prefers-reduced-motion: reduce` *before* any animation setup and jump
     to the final state. In JS use `prefersReducedMotion()` from
     `src/scripts/reduced-motion.ts`; in CSS use
     `@media (prefers-reduced-motion: reduce)`.
   - Provide the modern native path, **feature-detected**.
   - Provide a JS fallback for unsupported browsers.
3. **Feature-detect, never sniff.** `CSS.supports('animation-timeline', 'view()')`,
   `'startViewTransition' in document`, `CSS.supports('interpolate-size',
   'allow-keywords')`, `'IntersectionObserver' in window`.
4. **Don't trap focus or content.** Elements hidden for an entrance animation must
   become visible/reachable quickly; never leave focusable content at
   `opacity: 0` indefinitely. Keep DOM order = reading order.
5. **Keep JS scoped.** Runtime helpers take a `container` and query within it, and
   return a cleanup function. Prefer letting CSS do the animating so no JS runs on
   capable browsers.

## Pick the technique by intent

| Intent | Modern native path | Fallback |
|---|---|---|
| Reveal on scroll | `animation-timeline: view()` + `animation-range` | IntersectionObserver toggles a class |
| Parallax / scroll progress | `animation-timeline: scroll()` | scroll listener (throttled) or static |
| Page/state morph between DOM states | `document.startViewTransition()` + `view-transition-name` | swap without transition |
| Shared-element (card → modal) | View Transitions, or FLIP via `getBoundingClientRect` + WAAPI | instant open |
| Animate to intrinsic height | `interpolate-size: allow-keywords` + `transition: height` | measured `max-height` transition |
| Entry animation on insert | `@starting-style` + `transition` | class toggled next frame |
| Pointer-follow micro-interaction | CSS custom props updated on `pointermove` | static hover state |
| Staggered sequence | `animation-delay: calc(var(--i) * Nms)` | same, index set in JS |
| Precise scripted timeline | WAAPI `element.animate(...)` | — (WAAPI is broadly supported) |

## Minimal shapes

Reduced-motion gate (JS):
```ts
import { prefersReducedMotion } from './reduced-motion';
if (prefersReducedMotion()) { /* show final state */ return () => {}; }
```

Feature-detected CSS path:
```css
.item { /* fallback-safe base */ }
@supports (animation-timeline: view()) {
  .item { animation: enter both; animation-timeline: view(); animation-range: entry 10% cover 30%; }
}
@media (prefers-reduced-motion: reduce) {
  .item { animation: none; opacity: 1; transform: none; }
}
```

View Transition (JS):
```ts
if (!document.startViewTransition) { apply(); return; }        // fallback
document.startViewTransition(() => apply());                    // modern
```

## Verify motion actually works

Drive it in a real browser (dev server: `astro dev --background`), not just
typecheck. Check three states: modern path animates smoothly, fallback path
plays (or degrades cleanly), and reduced motion shows the end state with no
movement. Watch for dropped frames on `filter`/large blurs.

## Reference

`references/techniques.md` — each native technique with detection, a working
snippet, gotchas, and its fallback. Read it before implementing an unfamiliar one.
