import { test, expect } from '@playwright/test';

test('home page loads and renders the navbar without console errors', async ({ page }) => {
  const errors: string[] = [];
  page.on('pageerror', (err) => errors.push(String(err)));
  page.on('console', (msg) => {
    if (msg.type() === 'error') errors.push(msg.text());
  });

  const response = await page.goto('./');
  expect(response?.status()).toBe(200);

  await expect(page.locator('and-navbar')).toBeVisible();
  await expect(page).toHaveTitle(/Motion Recipes/);

  expect(errors).toEqual([]);
});
