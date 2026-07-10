---
name: add-motion-recipe
description: Add a new browser-native animation recipe to the Motion Recipes catalog. Use whenever the user wants to add, scaffold, or wire up a new recipe/demo/pattern in this repo — it covers the exact file-set (src/recipes/<slug>/*, src/scripts/<slug>.ts, demo component, recipes.ts + recipe-details.ts entries, demoMap registration) and the three-tier progressive-enhancement + accessibility conventions every recipe must follow. For the animation techniques themselves (scroll-driven, view transitions, WAAPI, interpolate-size, @starting-style), pair with the native-css-motion skill.
metadata:
  author: motion-recipes
  version: "1.0"
---

# Add a motion recipe

A "recipe" is one animation pattern that spans a fixed set of files, all keyed by
a kebab-case `<slug>`. Adding one means creating every file below **and** keeping
the data/registration in sync — the test suite (`src/data/recipes.test.ts`)
fails if a slug is missing its details or has mis-scoped source paths.

If this recipe is a non-trivial addition, prefer driving it through OpenSpec:
`/opsx:propose "add <slug> recipe"` then `/opsx:apply`. For a quick add, follow
the steps here directly.

## The three-tier rule (non-negotiable)

Every recipe implements motion in three tiers, in this priority order:

1. **Reduced motion FIRST** — check `prefersReducedMotion()` before any setup;
   show the final state instantly, no motion.
2. **Modern path** — the browser-native feature, feature-detected
   (`CSS.supports(...)`, or `'feature' in window`). Prefer pure CSS so no JS runs
   on capable browsers.
3. **JS fallback** — for browsers without the modern feature, using a widely
   supported technique (IntersectionObserver, `max-height`, class toggling).

Animate only compositor-friendly properties: `transform`, `opacity`, `filter`.
Never hide focusable content permanently behind `opacity: 0`.

See the `native-css-motion` skill for which modern feature fits the pattern and
how to detect it.

## Files to create (all under slug `<slug>`, PascalCase `<Name>`)

1. `src/scripts/<slug>.ts` — runtime module the live demo imports. Export
   `init<Name>(container: HTMLElement): () => void` returning a cleanup fn. Import
   `prefersReducedMotion` from `./reduced-motion`. Mirror `src/scripts/scroll-reveal.ts`.
2. `src/components/demos/<Name>Demo.astro` — the live demo. Scoped `<style>` uses
   `--mr-*` tokens (or the Tailwind utilities aliased from them). A client
   `<script>` imports `init<Name>` and calls it per `[data-<slug>]` container.
3. `src/recipes/<slug>/source.html` — standalone teaching markup.
4. `src/recipes/<slug>/source.css` — standalone teaching CSS (its own `:root`
   tokens; includes modern + fallback + `prefers-reduced-motion` rules).
5. `src/recipes/<slug>/source.ts` — standalone teaching script (self-contained,
   inlines its own `prefersReducedMotion`).
6. `src/recipes/<slug>/recipe.md` — step-by-step guide. Match existing structure:
   `## Goal`, `## Requirements`, `## Files to create`, numbered `## Step N`,
   `## Common pitfalls`, `## Verification checklist` (with `- [ ]` items).

## Wiring to update

7. `src/data/recipes.ts` — add a `Recipe` entry. Required fields: `slug`, `title`,
   `description`, `category` (one of the `RecipeCategory` union), `difficulty`,
   `APIs` (string[]), `hasReducedMotion`, `hasFallback`, `sourceFiles` with paths
   under `/recipes/<slug>/`.
8. `src/data/recipe-details.ts` — add a matching `RecipeDetails` entry (same
   `slug`): `whatItDoes`, `whenToUse[]`, `whenToAvoid[]`, `howItWorks` (markdown),
   `accessibilityNotes[]`, `performanceNotes[]`, `browserSupport[]`.
9. `src/pages/recipes/[slug].astro` — import `<Name>Demo` and add
   `'<slug>': <Name>Demo` to `demoMap`.

## Verify before done

- `pnpm check` → 0 errors.
- `pnpm test` → `recipes.test.ts` passes (proves data/details/paths are in sync).
- Drive `/recipes/<slug>/` in the browser (dev server runs with
  `astro dev --background`): confirm the modern path animates, the demo is
  keyboard-operable, and reduced motion shows the final state instantly.
- If you added it via OpenSpec: `openspec validate <change> --strict`, then
  `/opsx:archive` once merged.

## Reference

`references/recipe-anatomy.md` shows a filled-in example slug end to end.
