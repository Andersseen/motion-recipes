# View Transition Tabs Implementation Recipe

## Goal

Switch tab panels with a smooth cross-fade using the View Transitions API, falling back to an instant switch on unsupported browsers.

## Requirements

- A tablist with `role="tablist"` and tabs with `role="tab"`.
- Panels with `role="tabpanel"`.
- `view-transition-name` on the panel container.
- Fallback for browsers without `document.startViewTransition`.
- Reduced-motion support.

## Files to create

- `index.html`
- `styles.css`
- `tabs.ts`

## Step 1: Build the markup

Create a tablist and panels. Use `aria-selected`, `aria-controls` and `hidden` for accessibility and initial state.

## Step 2: Style the tabs and panels

Style active tabs distinctly. Add `view-transition-name: tab-panel` to the panel sections.

## Step 3: Customize the transition

Use the `::view-transition-old` and `::view-transition-new` pseudo-elements to control timing and easing.

```css
::view-transition-old(tab-panel),
::view-transition-new(tab-panel) {
  animation-duration: 300ms;
  animation-timing-function: cubic-bezier(0.16, 1, 0.3, 1);
}
```

## Step 4: Switch state inside the transition

When a tab is clicked, call `document.startViewTransition` and update the active tab and panel inside the callback.

```ts
document.startViewTransition(() => setActive(id));
```

## Step 5: Provide a fallback

If `startViewTransition` is missing or reduced motion is enabled, update state directly without animation.

## Step 6: Add keyboard navigation

Support Left and Right Arrow keys to move between tabs and activate the next/previous one.

## Common pitfalls

- Calling `startViewTransition` while another transition is active can throw or behave unexpectedly.
- Forgetting `hidden` on inactive panels makes all content visible at once.
- Not suppressing the transition under `prefers-reduced-motion` can violate user preferences.

## Verification checklist

- [ ] Tabs switch with a smooth cross-fade in supported browsers.
- [ ] Unsupported browsers switch instantly.
- [ ] Active tab has visible focus and `aria-selected="true"`.
- [ ] Left/Right Arrow keys move between tabs.
- [ ] Reduced motion disables the cross-fade.
