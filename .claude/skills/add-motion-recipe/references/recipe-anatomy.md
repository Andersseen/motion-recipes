# Recipe anatomy — worked example

Concrete shape of every file, using the existing `scroll-reveal` recipe as the
reference. Copy these shapes for a new slug.

## `src/scripts/<slug>.ts` (runtime module)

```ts
import { prefersReducedMotion } from './reduced-motion';

function supportsX(): boolean {
  return CSS.supports('some-property', 'some-value');
}

// Return value is a cleanup fn — the demo may call it on teardown.
export function initScrollReveal(container: HTMLElement): () => void {
  // 1. Reduced motion first.
  if (prefersReducedMotion()) {
    container.classList.add('reduced-motion');
    return () => {};
  }

  const items = Array.from(container.querySelectorAll<HTMLElement>('[data-reveal]'));
  if (items.length === 0) return () => {};

  // 2. Modern path — CSS does the work, JS only marks support.
  if (supportsX()) {
    container.classList.add('supports-scroll-timeline');
    return () => {};
  }

  // 3. JS fallback.
  container.classList.add('fallback-io');
  const observer = new IntersectionObserver(/* ... */);
  items.forEach((item) => observer.observe(item));
  return () => observer.disconnect();
}
```

Key contract: `init<Name>(container) => cleanup`. Never assume a single instance —
query within `container`, not `document`, so multiple demos can coexist.

## `src/components/demos/<Name>Demo.astro`

```astro
---
---
<div class="scroll-reveal-demo" data-scroll-reveal>
  <!-- demo markup with [data-reveal] hooks -->
</div>

<script>
  import { initScrollReveal } from '../../scripts/scroll-reveal';
  document
    .querySelectorAll<HTMLElement>('[data-scroll-reveal]')
    .forEach((demo) => initScrollReveal(demo));
</script>

<style>
  /* scoped; use --mr-* tokens. Include:
     - modern animation (e.g. animation-timeline: view())
     - .fallback-io rules for the JS path
     - .reduced-motion + @media (prefers-reduced-motion: reduce) rules */
</style>
```

Scoped styles do NOT pierce the Shadow DOM of `and-*` components — that's fine,
demos are plain elements. Use the `--mr-*` tokens (or their Tailwind aliases like
`bg-bg-surface`, `text-fg-secondary`).

## `src/data/recipes.ts` — `Recipe` entry

```ts
{
  slug: "scroll-reveal",
  title: "Scroll Reveal",
  description: "Reveal elements as they enter the viewport…",
  category: "scroll-driven",           // RecipeCategory union
  difficulty: "beginner",              // beginner | intermediate | advanced
  APIs: ["animation-timeline", "IntersectionObserver", "prefers-reduced-motion"],
  hasReducedMotion: true,
  hasFallback: true,
  sourceFiles: {
    html: "/recipes/scroll-reveal/source.html",
    css: "/recipes/scroll-reveal/source.css",
    ts: "/recipes/scroll-reveal/source.ts",
  },
}
```

## `src/data/recipe-details.ts` — `RecipeDetails` entry

Same `slug`. Fields: `whatItDoes` (string), `whenToUse` / `whenToAvoid`
(string[]), `howItWorks` (markdown string), `accessibilityNotes` (string[]),
`performanceNotes` (string[]), `browserSupport` (array of
`{ name, support, fallback }`).

## `src/pages/recipes/[slug].astro` — register the demo

```ts
import ScrollRevealDemo from '../../components/demos/ScrollRevealDemo.astro';
// ...
const demoMap: Record<string, typeof CardToModalDemo> = {
  'scroll-reveal': ScrollRevealDemo,
  // ...
};
```

## Data-integrity test (already exists)

`src/data/recipes.test.ts` asserts: unique slugs, every recipe has matching
details, and every `sourceFiles` path starts with `/recipes/<slug>/`. Run
`pnpm test` after adding entries.
