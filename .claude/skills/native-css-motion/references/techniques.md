# Native motion techniques

Each entry: what it's for, feature detection, a minimal working snippet, the
fallback, and gotchas. All examples animate compositor-friendly properties and
assume the reduced-motion gate is handled separately (see SKILL.md).

---

## Scroll-driven animations — `animation-timeline`

Bind a CSS animation to scroll position or an element's viewport visibility. Runs
off the main thread. Two timelines: `view()` (element's own visibility) and
`scroll()` (a scroll container's progress).

**Detect:** `CSS.supports('animation-timeline', 'view()')`

```css
.reveal {
  animation: reveal-enter both;
  animation-timeline: view();
  animation-range: entry 10% cover 30%;   /* start..end relative to viewport */
}
@keyframes reveal-enter {
  from { opacity: 0; transform: translateY(30px); }
  to   { opacity: 1; transform: translateY(0); }
}
```

**Fallback:** IntersectionObserver adds an `is-visible` class:
```ts
const io = new IntersectionObserver((entries) => {
  entries.forEach((e) => {
    if (e.isIntersecting) { e.target.classList.add('is-visible'); io.unobserve(e.target); }
  });
}, { threshold: 0.15, rootMargin: '0px 0px -40px 0px' });
```

**Gotchas:** `animation-range` syntax is easy to get wrong — `entry`/`cover`/
`exit` phases. Stagger with `animation-delay: calc(var(--i) * 60ms)` and set
`--i` in JS. Reference recipe: `scroll-reveal`.

---

## View Transitions API — `document.startViewTransition`

Animate between two DOM states (tab swap, route change, card→modal) by letting the
browser cross-fade/morph snapshots. Pair names on shared elements to morph them.

**Detect:** `'startViewTransition' in document`

```ts
function swap(update: () => void) {
  if (!document.startViewTransition) { update(); return; }   // fallback: no anim
  document.startViewTransition(update);
}
```
```css
.card { view-transition-name: hero-card; }   /* same name on both states */
::view-transition-old(hero-card),
::view-transition-group(hero-card) { animation-duration: 300ms; }
```

**Gotchas:** only one element per `view-transition-name` may be visible at a time.
Snapshots freeze the element — long content can look janky. Guard with the
reduced-motion check. Reference recipes: `view-transition-tabs`, `theme-water-drop`.

---

## FLIP (First-Last-Invert-Play) + WAAPI

For shared-element motion when View Transitions aren't available/precise enough.
Measure start and end rects, invert the delta as a transform, then play to
identity. Only `transform`/`opacity` animate, so it's cheap.

```ts
const first = el.getBoundingClientRect();
moveToFinalPosition(el);                     // DOM/layout change
const last = el.getBoundingClientRect();
const dx = first.left - last.left, dy = first.top - last.top;
el.animate(
  [{ transform: `translate(${dx}px, ${dy}px)` }, { transform: 'none' }],
  { duration: 300, easing: 'cubic-bezier(0.16,1,0.3,1)' }
);
```

**Gotchas:** read all rects before writing styles (avoid layout thrash). Account
for scale as well as translate for size changes. Reference recipe: `card-to-modal`.

---

## interpolate-size — animate to `height: auto`

Lets `height`/`width` transitions involve intrinsic keywords (`auto`, `min-content`).
The native answer to the classic "animate an accordion open" problem.

**Detect:** `CSS.supports('interpolate-size', 'allow-keywords')`

```css
.scope { interpolate-size: allow-keywords; }
.panel { height: 0; overflow: clip; transition: height 300ms ease; }
.panel[data-open] { height: auto; }
```

**Fallback:** measure and transition `max-height`:
```ts
panel.style.maxHeight = open ? `${panel.scrollHeight}px` : '0px';
/* CSS: .panel { max-height: 0; overflow: clip; transition: max-height 300ms ease; } */
```

**Gotchas:** Chromium-first; Firefox/Safari take the fallback today. `max-height`
fallback can clip if the ceiling is below content height — set it from
`scrollHeight` at open time. This is the technique used by the planned
`fluid-accordion` recipe (see openspec change `add-fluid-accordion-recipe`).

---

## @starting-style — entry animation on insertion / display change

Define the "before" styles an element transitions *from* when it's first rendered
or changes from `display: none`. No `requestAnimationFrame` dance needed.

**Detect:** `CSS.supports('selector(:has(*))')` is unrelated — use
`CSS.supports('transition-behavior', 'allow-discrete')` as a proxy, or feature-test
`@starting-style` support via `CSS.supports('(top: 0)')`-style checks; in practice
gate behind a class fallback.

```css
.toast {
  opacity: 1; transform: translateY(0);
  transition: opacity 250ms, transform 250ms, display 250ms allow-discrete;
}
@starting-style { .toast { opacity: 0; transform: translateY(8px); } }
```

**Gotchas:** needs `transition-behavior: allow-discrete` to animate `display`.
Fallback: toggle a class on the next frame to trigger the transition.

---

## Pointer-driven micro-interactions (CSS custom properties)

Update CSS variables from `pointermove`; let CSS consume them. Keeps JS to a
single style write per event and animation on the compositor.

```ts
el.addEventListener('pointermove', (e) => {
  const r = el.getBoundingClientRect();
  el.style.setProperty('--x', `${e.clientX - r.left}px`);
  el.style.setProperty('--y', `${e.clientY - r.top}px`);
});
```
```css
.spotlight { background: radial-gradient(circle at var(--x) var(--y), …); }
.magnetic  { transform: translate(calc(var(--x) * .1), calc(var(--y) * .1)); }
```

**Gotchas:** throttle to animation frames if you do heavy work; here we don't —
one `setProperty` is fine. Remove listeners in the cleanup fn. Provide a static
hover fallback and disable under reduced motion. Reference recipes:
`spotlight-card`, `magnetic-button`.

---

## Web Animations API (WAAPI) — `element.animate()`

Scripted, promise-returning timelines when you need JS control (sequencing,
playback rate, cancel). Broadly supported — often needs no fallback itself, but
still gate behind reduced motion.

```ts
const anim = el.animate(
  [{ opacity: 0 }, { opacity: 1 }],
  { duration: 300, easing: 'ease-out', fill: 'both' }
);
await anim.finished;
```

**Gotchas:** `fill: 'both'` retains end state but accumulates — commit with
`anim.commitStyles()` + `anim.cancel()` if animating many elements. Reference
recipe: `text-reveal` (staggered WAAPI per word/segment).

---

## Staggering

Index-based delay, works for CSS animations and scroll-driven alike:
```ts
items.forEach((item, i) => item.style.setProperty('--i', String(i)));
```
```css
.item { animation-delay: calc(var(--i) * 60ms); }
```
Under reduced motion, zero the delay along with the animation.
