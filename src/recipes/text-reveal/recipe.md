# Text Reveal Implementation Recipe

## Goal

Reveal a headline word by word with staggered motion while preserving the original text for screen readers.

## Requirements

- A text element.
- Word-level segmentation.
- Overflow-hidden wrappers and inner translating elements.
- Staggered timing via custom properties.
- Reduced-motion fallback.

## Files to create

- `index.html`
- `styles.css`
- `text-reveal.ts`

## Step 1: Markup

Place the full headline inside a single element. The script will split it and re-inject markup.

## Step 2: Split the text

Use `Intl.Segmenter` when available for proper word boundaries, falling back to whitespace splitting.

```ts
const segmenter = new Intl.Segmenter("en", { granularity: "word" });
const words = Array.from(segmenter.segment(text))
  .filter((s) => s.isWordLike)
  .map((s) => s.segment);
```

## Step 3: Wrap each word

Wrap every word in two spans: an outer `overflow: hidden` inline block and an inner block that starts translated down.

```html
<span class="word"><span class="inner" style="--index: 0">Motion</span></span>
```

## Step 4: Animate with CSS transitions

Use a custom property to stagger each word.

```css
.text-reveal__inner {
  transform: translateY(110%);
  opacity: 0;
  transition: transform 600ms ease-out,
              opacity 500ms ease-out;
  transition-delay: calc(var(--index, 0) * 80ms);
}

.text-reveal.is-revealed .text-reveal__inner {
  transform: translateY(0);
  opacity: 1;
}
```

## Step 5: Trigger the reveal

Add the `is-revealed` class after the DOM update. You can also trigger it on scroll or on user interaction.

## Step 6: Reduced motion

Show the text immediately without splitting or translating.

## Common pitfalls

- Removing the original text and replacing it with spans can change how screen readers pronounce content.
- Very long text splits create many DOM nodes and can hurt performance.
- Inline-block wrappers can introduce unwanted line-break behavior in some languages.

## Verification checklist

- [ ] Words reveal in sequence with a staggered delay.
- [ ] Text is still selectable and readable.
- [ ] Reduced motion shows the full text immediately.
- [ ] Screen readers announce the content in the correct order.
- [ ] Fallback segmentation works when Intl.Segmenter is unavailable.
