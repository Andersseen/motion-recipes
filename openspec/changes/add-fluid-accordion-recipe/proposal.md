## Why

The catalog's **Layout Transitions** category is currently empty (0 recipes),
so the site has no example of animating an element's intrinsic size — one of the
most common and historically awkward motion problems on the web. Modern CSS now
solves it natively with `interpolate-size: allow-keywords`, which makes
transitions to `height: auto` possible without measuring the DOM. This is an
ideal browser-native recipe: it fills a gap in the catalog and showcases a 2024+
CSS feature with a clean three-tier enhancement story.

## What Changes

- Add a new recipe `fluid-accordion` in the `layout-transitions` category.
- Ship the full recipe file-set: teaching source, runtime script, live demo
  component, data entries, and demo registration.
- Enhancement tiers touched: **all three** —
  1. *Modern*: `interpolate-size: allow-keywords` + `transition` on `height`
     from `0`/`auto`, driven purely by CSS (`details[open]` / `aria-expanded`).
  2. *Fallback*: JS-measured `max-height` transition for browsers without
     `interpolate-size`, feature-detected via `CSS.supports`.
  3. *Reduced-motion*: panels open/close instantly, no height animation.

## Capabilities

### New Capabilities
- `fluid-accordion`: an accessible, keyboard-operable accordion whose panels
  animate their height open and closed using native CSS size interpolation, with
  a JS `max-height` fallback and a reduced-motion path.

### Modified Capabilities
<!-- No existing spec-level requirements change. -->

## Impact

- New files: `src/recipes/fluid-accordion/{source.html,source.css,source.ts,recipe.md}`,
  `src/scripts/fluid-accordion.ts`, `src/components/demos/FluidAccordionDemo.astro`.
- Edited files: `src/data/recipes.ts`, `src/data/recipe-details.ts`,
  `src/pages/recipes/[slug].astro` (demoMap import + entry).
- Tests: existing `src/data/recipes.test.ts` will assert the new slug has
  matching details and correctly-scoped source paths.
- No new runtime dependencies.
