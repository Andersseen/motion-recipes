export interface BrowserSupportRow {
  name: string;
  support: string;
  fallback: string;
}

export interface RecipeDetails {
  slug: string;
  whatItDoes: string;
  whenToUse: string[];
  whenToAvoid: string[];
  howItWorks: string;
  accessibilityNotes: string[];
  performanceNotes: string[];
  browserSupport: BrowserSupportRow[];
}

export const recipeDetails: RecipeDetails[] = [
  {
    slug: "card-to-modal",
    whatItDoes:
      "This pattern expands a compact card into a larger modal while preserving visual continuity between the trigger and the detail view.",
    whenToUse: [
      "Portfolio project cards that open into case studies.",
      "Product cards that reveal details, specs or purchase options.",
      "Image galleries that zoom into a focused view.",
      "Dashboard widgets that expand into configuration panels.",
    ],
    whenToAvoid: [
      "Long forms that need a stable layout and scrolling.",
      "Destructive or confirmation actions where motion adds friction.",
      "Content that must load instantly on slow networks.",
      "When the user has requested reduced motion and no instant fallback is provided.",
    ],
    howItWorks: `
1. **Measure the trigger** — capture the card's bounding client rect before any layout change.
2. **Create the modal shell** — insert a fixed-position element directly over the card.
3. **Set initial styles** — size and position the shell to match the card exactly.
4. **Calculate the target rect** — decide the final modal position and size, usually centered with max dimensions.
5. **Animate** — use the FLIP technique or WAAPI to interpolate width, height, x and y.
6. **Reveal content** — fade in the modal body once the expansion is complete.
7. **Manage close and focus** — trap focus, close on Escape and return focus to the trigger.
8. **Respect reduced motion** — skip the interpolation and show the final state immediately.
    `.trim(),
    accessibilityNotes: [
      "Move focus to the modal container when it opens.",
      "Use role='dialog' and aria-modal='true' on the modal root.",
      "Label the modal with aria-labelledby pointing to the title.",
      "Close the modal when the user presses Escape.",
      "Return focus to the trigger card when the modal closes.",
      "Disable pointer events on the rest of the page while the modal is open.",
      "Honor prefers-reduced-motion by disabling the expansion animation.",
    ],
    performanceNotes: [
      "Animate only transform and opacity whenever possible.",
      "Capture getBoundingClientRect once per transition, not per frame.",
      "Use requestAnimationFrame only for the FLIP inversion step if needed.",
      "Avoid animating width, height, top and left on the compositor-critical path.",
      "Batch DOM reads and writes to prevent layout thrashing.",
      "Remove the cloned modal element from the DOM after the close animation.",
    ],
    browserSupport: [
      {
        name: "getBoundingClientRect",
        support: "All modern browsers",
        fallback: "Not required; universally supported.",
      },
      {
        name: "Web Animations API",
        support: "All modern browsers",
        fallback: "Use CSS transitions on transform/opacity.",
      },
      {
        name: "prefers-reduced-motion",
        support: "All modern browsers",
        fallback: "Instant state change with no animation.",
      },
    ],
  },
  {
    slug: "scroll-reveal",
    whatItDoes:
      "Elements fade and slide into view as they enter the viewport, creating a sense of progressive discovery while scrolling.",
    whenToUse: [
      "Landing page sections that you want to introduce gradually.",
      "Lists, cards or galleries where staggered entrance adds rhythm.",
      "Long-form content to keep the reader engaged.",
    ],
    whenToAvoid: [
      "Above-the-fold content that must be visible immediately.",
      "Critical UI controls that could be missed if hidden initially.",
      "Pages where users expect instant full content, such as documentation.",
      "When reduced motion is enabled unless content is shown instantly.",
    ],
    howItWorks: `
1. **Modern path** — use CSS 
\`animation-timeline: view()\`
 and 
\`animation-range\`
 to drive the reveal.
2. **Fallback path** — if 
\`animation-timeline\`
 is unsupported, use IntersectionObserver to toggle an 
\`is-visible\`
 class.
3. **Animate properties** — interpolate opacity, translateY and optionally filter blur.
4. **Stagger** — delay sibling elements with transition-delay or custom properties.
5. **Reduced motion** — show elements at full opacity with no transform.
    `.trim(),
    accessibilityNotes: [
      "Ensure content is readable and interactive even before the reveal completes.",
      "Do not hide focusable elements with opacity: 0 for long; they should be visible quickly.",
      "Respect prefers-reduced-motion by removing the reveal animation entirely.",
      "Keep the DOM order logical so screen readers announce content in the right sequence.",
    ],
    performanceNotes: [
      "Prefer animation-timeline over JavaScript scroll listeners.",
      "Use IntersectionObserver instead of scroll event handlers for the fallback.",
      "Animate only transform and opacity to stay on the compositor.",
      "Avoid blur filters on large areas; they can be GPU expensive.",
      "Throttle any remaining scroll work with requestAnimationFrame.",
    ],
    browserSupport: [
      {
        name: "animation-timeline: view()",
        support: "Chrome 115+, Edge 115+, Safari 18+",
        fallback: "IntersectionObserver toggles a visible class.",
      },
      {
        name: "IntersectionObserver",
        support: "All modern browsers",
        fallback: "Show all elements immediately.",
      },
      {
        name: "prefers-reduced-motion",
        support: "All modern browsers",
        fallback: "Instant visibility with no motion.",
      },
    ],
  },
  {
    slug: "view-transition-tabs",
    whatItDoes:
      "Tab panels cross-fade and slide smoothly when switching tabs, powered by the View Transitions API.",
    whenToUse: [
      "Settings panels with distinct sections.",
      "Dashboard tabs where visual continuity reduces cognitive load.",
      "Content switches where the tab indicator should feel connected.",
    ],
    whenToAvoid: [
      "Tabs that must switch instantly, such as form steps.",
      "Very large panels where the transition could feel slow.",
      "When the content height changes drastically and layout shift matters.",
    ],
    howItWorks: `
1. **Assign view-transition-name** to the tab panel container and active tab indicator.
2. **Start the transition** — call 
\`document.startViewTransition(callback)\`
 when the user selects a tab.
3. **Update state** inside the callback: switch the active tab class and panel content.
4. **Style the transition** with 
\`::view-transition-old(root)\`
 and 
\`::view-transition-new(root)\`
 pseudo-elements.
5. **Fallback** — if the API is missing, update the active state instantly.
6. **Reduced motion** — keep the API call but disable the transition pseudo-elements with CSS.
    `.trim(),
    accessibilityNotes: [
      "Use a tablist role with aria-selected on each tab.",
      "Support Left/Right Arrow keys to move between tabs.",
      "Keep focus on the selected tab after activation.",
      "Provide aria-controls linking each tab to its panel.",
      "Respect reduced motion by suppressing the cross-fade.",
    ],
    performanceNotes: [
      "View Transitions capture the DOM as an image; keep panels reasonably simple.",
      "Avoid starting a new transition while another is in flight.",
      "Animate only opacity and transform in the transition pseudo-elements.",
      "Use view-transition-name sparingly to reduce capture overhead.",
    ],
    browserSupport: [
      {
        name: "document.startViewTransition",
        support: "Chrome 111+, Edge 111+, Safari 18+",
        fallback: "Instant tab switch with no cross-fade.",
      },
      {
        name: "view-transition-name",
        support: "Same as startViewTransition",
        fallback: "Ignored by unsupported browsers.",
      },
      {
        name: "prefers-reduced-motion",
        support: "All modern browsers",
        fallback: "Disable transition pseudo-elements.",
      },
    ],
  },
  {
    slug: "magnetic-button",
    whatItDoes:
      "A button that subtly shifts toward the cursor on hover or pointer movement, adding tactile feedback without leaving its layout box.",
    whenToUse: [
      "Primary call-to-action buttons that deserve emphasis.",
      "Icon buttons in hero sections or navigation.",
      "Interactive controls where playful motion reinforces affordance.",
    ],
    whenToAvoid: [
      "Dense UIs where small shifts could feel jittery.",
      "Buttons near scroll edges where overflow could clip the effect.",
      "Users with vestibular disorders unless disabled by reduced motion.",
    ],
    howItWorks: `
1. **Track pointer position** relative to the button center on pointermove.
2. **Calculate offset** as a fraction of the button size, clamped to a small range.
3. **Update CSS custom properties** 
\`--mx\`
 and 
\`--my\`
 on the button.
4. **Apply transform** — translate the button by the offset using CSS.
5. **Reset on leave** — return the button to 0,0 with a springy transition.
6. **Reduced motion** — skip position updates and keep the button static.
    `.trim(),
    accessibilityNotes: [
      "The button remains fully clickable and keyboard focusable.",
      "Do not rely on motion alone to indicate interactivity; keep visible focus styles.",
      "Disable the magnetic pull when prefers-reduced-motion is active.",
      "Ensure the effect does not move the hit box outside the visible button area.",
    ],
    performanceNotes: [
      "Update custom properties instead of inline transforms when possible.",
      "Throttle pointermove handlers or use CSS :hover transitions for lighter effects.",
      "Use transform instead of left/top for the movement.",
      "Remove listeners when the element leaves the viewport or is hidden.",
    ],
    browserSupport: [
      {
        name: "Pointer events",
        support: "All modern browsers",
        fallback: "Not required; universally supported.",
      },
      {
        name: "CSS custom properties",
        support: "All modern browsers",
        fallback: "Static button with no magnetic effect.",
      },
      {
        name: "prefers-reduced-motion",
        support: "All modern browsers",
        fallback: "Static button.",
      },
    ],
  },
  {
    slug: "spotlight-card",
    whatItDoes:
      "A card whose border and surface are illuminated by a radial glow that follows the cursor, creating a reactive glass surface.",
    whenToUse: [
      "Feature cards in landing pages.",
      "Pricing or plan cards that need visual distinction.",
      "Interactive tiles where hover feedback improves perceived quality.",
    ],
    whenToAvoid: [
      "Cards in long lists where the effect could become distracting.",
      "Touch-only interfaces where hover tracking is unavailable.",
      "Low-contrast designs where the glow may hide text.",
    ],
    howItWorks: `
1. **Track pointer position** inside the card on pointermove.
2. **Convert to percentages** relative to the card width and height.
3. **Update CSS custom properties** 
\`--spotlight-x\`
 and 
\`--spotlight-y\`
.
4. **Render the glow** with a radial-gradient background layered behind the border.
5. **Fade on hover** — only show the glow when the card is hovered or focused.
6. **Reduced motion** — keep a static subtle gradient instead of cursor tracking.
    `.trim(),
    accessibilityNotes: [
      "The card content remains fully readable without the glow effect.",
      "Provide a visible focus state that does not depend solely on the spotlight.",
      "Disable cursor tracking under prefers-reduced-motion.",
      "Do not use fast pulsing or flashing colors.",
    ],
    performanceNotes: [
      "Update CSS custom properties; do not re-render DOM nodes.",
      "Use compositor-only properties; avoid reading layout per frame.",
      "Cache the card rect and recalculate only on resize.",
      "Use a single background layer for the gradient to minimize paint.",
    ],
    browserSupport: [
      {
        name: "Pointer events",
        support: "All modern browsers",
        fallback: "Static hover state.",
      },
      {
        name: "CSS custom properties",
        support: "All modern browsers",
        fallback: "Static gradient.",
      },
      {
        name: "radial-gradient",
        support: "All modern browsers",
        fallback: "Solid border or background.",
      },
    ],
  },
  {
    slug: "text-reveal",
    whatItDoes:
      "Text appears word by word or line by line with staggered motion, drawing attention to headings or key messages.",
    whenToUse: [
      "Hero headlines that need a cinematic entrance.",
      "Pull quotes or testimonials.",
      "Section titles that should be revealed on scroll.",
    ],
    whenToAvoid: [
      "Body text where readability is more important than flair.",
      "Content that users need to read quickly.",
      "Screen-reader-first content where wrapping words can complicate semantics.",
    ],
    howItWorks: `
1. **Split the text** into words or sentences using 
\`Intl.Segmenter\`
 or a whitespace split.
2. **Wrap each segment** in a span with overflow hidden and inline-block display.
3. **Animate children** — translateY from 100% to 0 and fade opacity.
4. **Stagger** — use CSS custom properties or transition-delay per word.
5. **Trigger** — start the animation on load, scroll or user interaction.
6. **Reduced motion** — keep the full text visible with no wrapping animation.
    `.trim(),
    accessibilityNotes: [
      "Preserve the original text content for screen readers; do not remove it.",
      "Use aria-label on the wrapper if the split structure affects pronunciation.",
      "Avoid creating empty or invisible focusable elements.",
      "Disable motion and show text immediately under prefers-reduced-motion.",
      "Keep color contrast high on the revealed text.",
    ],
    performanceNotes: [
      "Use transform and opacity for each word's reveal.",
      "Avoid splitting huge paragraphs; prefer short headlines.",
      "Use CSS transitions rather than per-frame JavaScript.",
      "Cache DOM references to the wrapped segments.",
      "Consider using content-visibility for off-screen text blocks.",
    ],
    browserSupport: [
      {
        name: "Intl.Segmenter",
        support: "Chrome 111+, Safari 16.4+, Firefox 125+",
        fallback: "Split on whitespace or sentence punctuation.",
      },
      {
        name: "CSS transitions",
        support: "All modern browsers",
        fallback: "Show final text state instantly.",
      },
      {
        name: "prefers-reduced-motion",
        support: "All modern browsers",
        fallback: "Instant full text visibility.",
      },
    ],
  },
];

export function getRecipeDetailsBySlug(slug: string): RecipeDetails | undefined {
  return recipeDetails.find((details) => details.slug === slug);
}
