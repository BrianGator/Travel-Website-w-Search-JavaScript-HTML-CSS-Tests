/**
 * written by Brian McCarthy
 */
import { test, expect } from '@playwright/test';

test('has title', async ({ page }) => {
  await page.goto('/');
  await expect(page).toHaveTitle(/TravelBloom/);
});

test('search works', async ({ page }) => {
  await page.goto('/');
  await page.fill('input[placeholder*="Search"]', 'beach');
  await page.click('button:text("Search")');
  await expect(page.locator('text=Recommendations')).toBeVisible();
});
