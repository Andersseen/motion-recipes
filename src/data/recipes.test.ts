import { describe, expect, it } from 'vitest';
import { recipes } from './recipes';
import { getRecipeDetailsBySlug } from './recipe-details';

describe('recipes data integrity', () => {
  it('has unique slugs', () => {
    const slugs = recipes.map((recipe) => recipe.slug);
    expect(new Set(slugs).size).toBe(slugs.length);
  });

  it('has matching recipe-details for every recipe', () => {
    const missing = recipes
      .map((recipe) => recipe.slug)
      .filter((slug) => !getRecipeDetailsBySlug(slug));

    expect(missing).toEqual([]);
  });

  it('every source file reference points under /recipes/<slug>/', () => {
    for (const recipe of recipes) {
      for (const path of Object.values(recipe.sourceFiles)) {
        if (path) expect(path.startsWith(`/recipes/${recipe.slug}/`)).toBe(true);
      }
    }
  });
});
