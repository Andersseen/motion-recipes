export type RecipeCategory =
  | "shared-element"
  | "scroll-driven"
  | "view-transitions"
  | "microinteractions"
  | "text-motion"
  | "layout-transitions"
  | "experimental";

export type RecipeDifficulty = "beginner" | "intermediate" | "advanced";

export interface Recipe {
  slug: string;
  title: string;
  description: string;
  category: RecipeCategory;
  difficulty: RecipeDifficulty;
  APIs: string[];
  hasReducedMotion: boolean;
  hasFallback: boolean;
  sourceFiles: {
    html?: string;
    css?: string;
    ts?: string;
  };
}

export const recipes: Recipe[] = [
  {
    slug: "card-to-modal",
    title: "Card to Modal",
    description:
      "Expand a compact card into an accessible modal using shared-element motion and FLIP measurements.",
    category: "shared-element",
    difficulty: "advanced",
    APIs: ["getBoundingClientRect", "FLIP", "WAAPI", "prefers-reduced-motion"],
    hasReducedMotion: true,
    hasFallback: true,
    sourceFiles: {
      html: "/recipes/card-to-modal/source.html",
      css: "/recipes/card-to-modal/source.css",
      ts: "/recipes/card-to-modal/source.ts",
    },
  },
  {
    slug: "scroll-reveal",
    title: "Scroll Reveal",
    description:
      "Reveal elements as they enter the viewport using CSS scroll-driven animations with an IntersectionObserver fallback.",
    category: "scroll-driven",
    difficulty: "intermediate",
    APIs: ["animation-timeline", "IntersectionObserver", "prefers-reduced-motion"],
    hasReducedMotion: true,
    hasFallback: true,
    sourceFiles: {
      html: "/recipes/scroll-reveal/source.html",
      css: "/recipes/scroll-reveal/source.css",
      ts: "/recipes/scroll-reveal/source.ts",
    },
  },
  {
    slug: "view-transition-tabs",
    title: "View Transition Tabs",
    description:
      "Switch tab panels smoothly with the View Transitions API and a no-animation fallback for unsupported browsers.",
    category: "view-transitions",
    difficulty: "intermediate",
    APIs: ["document.startViewTransition", "view-transition-name", "prefers-reduced-motion"],
    hasReducedMotion: true,
    hasFallback: true,
    sourceFiles: {
      html: "/recipes/view-transition-tabs/source.html",
      css: "/recipes/view-transition-tabs/source.css",
      ts: "/recipes/view-transition-tabs/source.ts",
    },
  },
  {
    slug: "magnetic-button",
    title: "Magnetic Button",
    description:
      "A button that subtly pulls toward the cursor using pointer tracking and CSS custom properties.",
    category: "microinteractions",
    difficulty: "beginner",
    APIs: ["pointer events", "CSS custom properties", "prefers-reduced-motion"],
    hasReducedMotion: true,
    hasFallback: true,
    sourceFiles: {
      html: "/recipes/magnetic-button/source.html",
      css: "/recipes/magnetic-button/source.css",
      ts: "/recipes/magnetic-button/source.ts",
    },
  },
  {
    slug: "spotlight-card",
    title: "Spotlight Card",
    description:
      "A card with a radial glow that follows the cursor, built with CSS custom properties and pointer tracking.",
    category: "microinteractions",
    difficulty: "beginner",
    APIs: ["pointer events", "CSS custom properties", "radial-gradient", "prefers-reduced-motion"],
    hasReducedMotion: true,
    hasFallback: true,
    sourceFiles: {
      html: "/recipes/spotlight-card/source.html",
      css: "/recipes/spotlight-card/source.css",
      ts: "/recipes/spotlight-card/source.ts",
    },
  },
  {
    slug: "text-reveal",
    title: "Text Reveal",
    description:
      "Reveal text word by word with staggered motion, preserving accessible reading order and respecting reduced motion.",
    category: "text-motion",
    difficulty: "intermediate",
    APIs: ["Intl.Segmenter", "WAAPI", "prefers-reduced-motion"],
    hasReducedMotion: true,
    hasFallback: true,
    sourceFiles: {
      html: "/recipes/text-reveal/source.html",
      css: "/recipes/text-reveal/source.css",
      ts: "/recipes/text-reveal/source.ts",
    },
  },
];

export function getRecipeBySlug(slug: string): Recipe | undefined {
  return recipes.find((recipe) => recipe.slug === slug);
}

export function getRecipesByCategory(category: RecipeCategory): Recipe[] {
  return recipes.filter((recipe) => recipe.category === category);
}
