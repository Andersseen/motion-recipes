# Motion Recipes

> Beautiful web animation recipes, explained step by step.

A visual catalog of browser-native UI animation patterns with live demos, source code, accessibility notes and implementation recipes.

## Stack

- [Astro](https://astro.build)
- TypeScript
- Modern CSS
- Vanilla Web APIs

## Project Structure

```text
/
├── public/
├── src/
│   ├── components/
│   │   ├── layout/      # SiteLayout, Header, Footer
│   │   ├── catalog/     # RecipeCard, CodeTabs, BrowserSupport, etc.
│   │   └── demos/       # Interactive demo components
│   ├── data/
│   │   └── recipes.ts   # Catalog metadata
│   ├── pages/
│   │   ├── index.astro
│   │   └── recipes/
│   │       ├── index.astro
│   │       └── [slug].astro
│   ├── recipes/
│   │   └── {slug}/
│   │       ├── source.html
│   │       ├── source.css
│   │       ├── source.ts
│   │       └── recipe.md
│   ├── scripts/
│   │   └── {recipe}.ts
│   └── styles/
│       ├── tokens.css
│       ├── global.css
│       └── animations.css
└── package.json
```

## Commands

| Command        | Action                                      |
| :------------- | :------------------------------------------ |
| `pnpm install` | Installs dependencies                       |
| `pnpm dev`     | Starts local dev server at `localhost:4321` |
| `pnpm build`   | Build your production site to `./dist/`     |
| `pnpm preview` | Preview your build locally                  |
| `pnpm check`   | Run Astro type checks                       |
| `pnpm validate`| Run checks, unit tests, E2E tests and build |
| `pnpm deploy`  | Trigger the GitHub Pages workflow on `main` |

`pnpm deploy` requires the [GitHub CLI](https://cli.github.com/) to be installed and authenticated.
Commit and push local changes first: the command deploys the current remote `main` branch.

## Philosophy

This is not an installable library. It is a learning resource and visual cookbook. Each recipe can be copied, studied and adapted to any framework or vanilla project.

## Adding a New Recipe

1. Add metadata to `src/data/recipes.ts`.
2. Create a folder under `src/recipes/{slug}/` with `source.html`, `source.css`, `source.ts` and `recipe.md`.
3. Create a demo component in `src/components/demos/`.
4. Create the interactive script in `src/scripts/{recipe}.ts`.
5. The dynamic route `src/pages/recipes/[slug].astro` will pick it up automatically.
