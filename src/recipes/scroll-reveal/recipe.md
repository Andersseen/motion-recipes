# Scroll Reveal Implementation Recipe

## Goal

Reveal elements as they scroll into the viewport using CSS scroll-driven animations, with a JavaScript fallback for older browsers.

## Requirements

- Elements hidden or offset before entering the viewport.
- Smooth entrance animation driven by scroll position.
- Fallback for browsers without `animation-timeline: view()`.
- Reduced-motion support.

## Files to create

- `index.html`
- `styles.css`
- `scroll-reveal.ts`

## Step 1: Markup

Add a `data-reveal` attribute to each element you want to animate.

## Step 2: Modern CSS animation

Use `animation-timeline: view()` to bind the animation to the element's visibility in the viewport. Define an `animation-range` to control when the animation starts and ends.

```css
.reveal-section {
  animation: reveal-enter both;
  animation-timeline: view();
  animation-range: entry 10% cover 30%;
}

@keyframes reveal-enter {
  from {
    opacity: 0;
    transform: translateY(30px);
    filter: blur(4px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
    filter: blur(0);
  }
}
```

## Step 3: Fallback CSS

Add classes that will be toggled by IntersectionObserver when scroll timelines are unavailable.

```css
.reveal-section.is-hidden {
  opacity: 0;
  transform: translateY(30px);
  filter: blur(4px);
  transition: opacity 500ms ease-out,
              transform 500ms ease-out,
              filter 500ms ease-out;
}

.reveal-section.is-visible {
  opacity: 1;
  transform: translateY(0);
  filter: blur(0);
}
```

## Step 4: Feature detection

Check support with `CSS.supports("animation-timeline", "view()")`. If supported, do nothing; the CSS handles everything.

## Step 5: IntersectionObserver fallback

If unsupported, add the hidden class to every item and observe them. When an item intersects, add `is-visible` and stop observing it.

```ts
const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add("is-visible");
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.15, rootMargin: "0px 0px -40px 0px" });
```

## Step 6: Reduced motion

If `prefers-reduced-motion` is active, skip the observer and make elements visible immediately.

## Common pitfalls

- Hiding focusable elements with `opacity: 0` can make them unreachable.
- Blur filters can be expensive on large areas.
- Forgetting the fallback leaves older browsers with invisible content.

## Verification checklist

- [ ] Elements reveal smoothly while scrolling.
- [ ] The effect works in browsers that support `animation-timeline: view()`.
- [ ] Unsupported browsers use the IntersectionObserver fallback.
- [ ] Reduced motion shows content immediately.
- [ ] Focusable elements become visible quickly enough to be usable.
