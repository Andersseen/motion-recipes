import { test, expect } from '@playwright/test';

test('home page loads and renders the navbar without console errors', async ({ page }) => {
  const errors: string[] = [];
  page.on('pageerror', (err) => errors.push(String(err)));
  page.on('console', (msg) => {
    if (msg.type() === 'error') errors.push(msg.text());
  });

  const response = await page.goto('./');
  expect(response?.status()).toBe(200);

  await expect(page.getByRole('navigation', { name: 'Primary' })).toBeVisible();
  await expect(page).toHaveTitle(/Motion Recipes/);

  expect(errors).toEqual([]);
});

test('about navigation opens the project documentation page', async ({ page }) => {
  await page.goto('./');

  const aboutLink = page.getByRole('link', { name: 'About', exact: true });
  await expect(aboutLink).toBeVisible();
  await aboutLink.click();

  await expect(page).toHaveURL(/\/about\/$/);
  await expect(page.getByRole('heading', { level: 1, name: 'About Motion Recipes' })).toBeVisible();
});
