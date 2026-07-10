## ADDED Requirements

### Requirement: Accessible accordion structure

The accordion SHALL present a list of disclosure items, each with a button
control and an associated panel, operable by keyboard and exposed to assistive
technology.

#### Scenario: Toggling a panel with the keyboard

- **WHEN** a user focuses an accordion trigger and presses Enter or Space
- **THEN** the associated panel toggles between expanded and collapsed
- **AND** the trigger's `aria-expanded` reflects the new state
- **AND** the panel is hidden from the accessibility tree when collapsed

#### Scenario: Multiple items

- **WHEN** the accordion contains more than one item
- **THEN** each trigger controls only its own panel via `aria-controls`

### Requirement: Native CSS height animation (modern tier)

When the browser supports `interpolate-size: allow-keywords`, panels SHALL
animate their height between collapsed and `auto` using a CSS `transition`,
without JavaScript measuring the DOM.

#### Scenario: Opening a panel in a supporting browser

- **WHEN** `CSS.supports('interpolate-size', 'allow-keywords')` is true and a
  panel expands
- **THEN** the panel height transitions from `0` to its intrinsic `auto` height
- **AND** only `height` (and optionally `opacity`) is transitioned

### Requirement: JavaScript max-height fallback

When `interpolate-size` is unsupported, the recipe SHALL animate panel height
using a measured `max-height` transition so the motion still plays.

#### Scenario: Opening a panel without interpolate-size support

- **WHEN** `interpolate-size` is unsupported and a panel expands
- **THEN** the script sets `max-height` to the panel's measured `scrollHeight`
- **AND** the panel transitions open, then settles without clipping its content

#### Scenario: Closing a panel without interpolate-size support

- **WHEN** the same panel collapses
- **THEN** `max-height` transitions back to `0`
- **AND** the collapsed panel is removed from the accessibility tree

### Requirement: Reduced-motion path

The recipe SHALL respect `prefers-reduced-motion: reduce` by toggling panels
instantly, and SHALL check this preference before any animation setup.

#### Scenario: Reduced motion enabled

- **WHEN** `prefers-reduced-motion: reduce` is active and a panel toggles
- **THEN** the panel shows or hides its final state immediately with no height
  animation

### Requirement: Recipe catalog integration

The recipe SHALL be discoverable in the catalog under the `layout-transitions`
category with a live demo and complete metadata.

#### Scenario: Recipe registered end-to-end

- **WHEN** the site is built
- **THEN** `fluid-accordion` has a `Recipe` entry (category `layout-transitions`)
  and a matching `RecipeDetails` entry
- **AND** its live demo is registered in `demoMap` and renders on
  `/recipes/fluid-accordion/`
- **AND** `hasReducedMotion` and `hasFallback` are both `true`
