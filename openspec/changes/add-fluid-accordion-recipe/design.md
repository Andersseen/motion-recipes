## Context

Animating an element to its intrinsic height has historically required
JavaScript to measure `scrollHeight` and animate `max-height`, because CSS could
not transition to or from the `auto` keyword. Chromium 129+ ships
`interpolate-size: allow-keywords`, which lets `height: auto` participate in
transitions. Motion Recipes needs a `layout-transitions` example, and this
feature is the canonical native-CSS answer to the height problem — a strong fit
for the catalog's three-tier progressive-enhancement house style.

## Goals / Non-Goals

**Goals:**
- Demonstrate `interpolate-size: allow-keywords` as the modern path.
- Keep the accordion fully accessible (keyboard + `aria-expanded`/`aria-controls`).
- Provide a JS `max-height` fallback and a reduced-motion path.
- Match the existing recipe anatomy exactly so the catalog stays uniform.

**Non-Goals:**
- No single-open ("exclusive") behavior requirement — allow multiple panels open;
  exclusivity can be a later variant.
- No use of the `<details>`/`<summary>` `name` attribute grouping (support is
  uneven); use button + panel with ARIA for predictable control.
- No animation library; native CSS + minimal vanilla TS only.

## Decisions

- **Trigger markup**: use `<button aria-expanded aria-controls>` + a panel
  `<div role="region">` rather than `<details>`. `<details>` cannot keep content
  in flow for a height transition without extra hacks, and the button pattern
  gives deterministic control across all three tiers.
- **Modern tier**: set `interpolate-size: allow-keywords` on a wrapping scope and
  transition the panel's `height` between `0` and `auto`; pair with `overflow:
  clip`. Gate this entirely in CSS so no JS runs on supporting browsers beyond
  toggling the expanded state/class.
- **Feature detection**: `CSS.supports('interpolate-size', 'allow-keywords')`.
  When false, add a `fallback-maxheight` class and drive `max-height` from the
  measured `scrollHeight`; reset to `auto`-equivalent on `transitionend` is
  avoided — instead keep `max-height` large enough, matching the scroll-reveal
  recipe's simple, disconnect-on-cleanup style.
- **Reduced motion**: checked first via the shared `prefersReducedMotion()`;
  add a `reduced-motion` class that zeroes transition durations.
- **Runtime contract**: export `initFluidAccordion(container: HTMLElement): () =>
  void` returning a cleanup that removes listeners — consistent with
  `initScrollReveal`.

## Risks / Trade-offs

- `interpolate-size` is Chromium-only at time of writing; Firefox/Safari take the
  fallback. Acceptable — the fallback is the tried-and-true `max-height` approach
  and is exercised by most users' browsers today.
- The `max-height` fallback animates to an approximate height; if content is
  taller than the chosen ceiling it could clip. Mitigate by setting `max-height`
  to the measured `scrollHeight` at open time.
- Keeping four tiers of state (collapsed/expanded × modern/fallback) in sync in
  CSS is fiddly; the demo keeps panels visually simple to stay legible as a
  teaching example.
