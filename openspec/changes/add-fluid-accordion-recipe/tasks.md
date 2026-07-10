## 1. Runtime script

- [ ] 1.1 Create `src/scripts/fluid-accordion.ts` exporting
      `initFluidAccordion(container: HTMLElement): () => void`.
- [ ] 1.2 Import `prefersReducedMotion` from `./reduced-motion` and short-circuit
      to instant open/close (add `reduced-motion` class) when it returns true.
- [ ] 1.3 Feature-detect `CSS.supports('interpolate-size', 'allow-keywords')`;
      when supported, only wire click/keyboard toggling of `aria-expanded` and
      let CSS animate. When unsupported, add `fallback-maxheight` and drive
      `max-height` from measured `scrollHeight`.
- [ ] 1.4 Return a cleanup function that removes listeners / observers.

## 2. Demo component

- [ ] 2.1 Create `src/components/demos/FluidAccordionDemo.astro` with 3–4
      accordion items (button + `role="region"` panel, `aria-expanded`/
      `aria-controls`).
- [ ] 2.2 Scoped styles use `--mr-*` tokens; modern tier uses
      `interpolate-size: allow-keywords` + `height` transition; fallback uses
      `max-height`; include `prefers-reduced-motion` and `.reduced-motion` rules.
- [ ] 2.3 Client script imports and calls `initFluidAccordion` per
      `[data-fluid-accordion]` container.

## 3. Teaching source

- [ ] 3.1 Create `src/recipes/fluid-accordion/source.html` (accordion markup).
- [ ] 3.2 Create `src/recipes/fluid-accordion/source.css` (modern + fallback +
      reduced-motion, mirroring the demo, standalone `:root` tokens).
- [ ] 3.3 Create `src/recipes/fluid-accordion/source.ts` (self-contained init).
- [ ] 3.4 Create `src/recipes/fluid-accordion/recipe.md` (Goal, Requirements,
      Steps, Common pitfalls, Verification checklist — match existing recipes).

## 4. Data + registration

- [ ] 4.1 Add the `Recipe` entry to `src/data/recipes.ts` (slug `fluid-accordion`,
      category `layout-transitions`, `hasReducedMotion: true`, `hasFallback: true`,
      source paths under `/recipes/fluid-accordion/`).
- [ ] 4.2 Add the `RecipeDetails` entry to `src/data/recipe-details.ts`
      (whatItDoes, whenToUse/Avoid, howItWorks, a11y/perf notes, browserSupport).
- [ ] 4.3 Register `FluidAccordionDemo` in `demoMap` in
      `src/pages/recipes/[slug].astro` (import + map entry).

## 5. Verify

- [ ] 5.1 Run `pnpm check` (0 errors) and `pnpm test` (recipes.test.ts passes for
      the new slug).
- [ ] 5.2 Drive `/recipes/fluid-accordion/` in the browser: confirm keyboard
      toggle, height animation (or fallback), and reduced-motion behavior.
- [ ] 5.3 Run `openspec validate add-fluid-accordion-recipe --strict`.
