/**
 * written by Brian McCarthy
 */
import { test, expect } from '@playwright/test';

test.describe('TravelBloom Playwright Suite - 15 Test Cases', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('1. Page Title Verification', async ({ page }) => {
    await expect(page).toHaveTitle(/TravelBloom/);
  });

  test('2. Navigation to About Us', async ({ page }) => {
    await page.click('button:text("About Us")');
    await expect(page.locator('text=Our Narrative')).toBeVisible();
  });

  test('3. Navigation to Contact Us', async ({ page }) => {
    await page.click('button:text("Contact Us")');
    await expect(page.locator('text=Establish a connection')).toBeVisible();
  });

  test('4. Search for Beach returns results', async ({ page }) => {
    await page.fill('#search-input', 'beach');
    await page.click('#search-button');
    await expect(page.locator('text=Recommendations')).toBeVisible();
    await expect(page.locator('text=Bora Bora')).toBeVisible();
  });

  test('5. Search for Temple returns results', async ({ page }) => {
    await page.fill('#search-input', 'temple');
    await page.click('#search-button');
    await expect(page.locator('text=Taj Mahal')).toBeVisible();
  });

  test('6. Search for Australia returns cities', async ({ page }) => {
    await page.fill('#search-input', 'australia');
    await page.click('#search-button');
    await expect(page.locator('text=Sydney')).toBeVisible();
  });

  test('7. Clear Button functionality', async ({ page }) => {
    await page.fill('#search-input', 'beach');
    await page.click('#search-button');
    await page.click('#clear-button');
    await expect(page.locator('#search-input')).toHaveValue('');
    await expect(page.locator('text=The World Awaits')).toBeVisible();
  });

  test('8. Search via Enter key', async ({ page }) => {
    await page.fill('#search-input', 'japan');
    await page.press('#search-input', 'Enter');
    await expect(page.locator('text=Tokyo')).toBeVisible();
  });

  test('9. Empty search validation', async ({ page }) => {
    await page.click('#search-button');
    await expect(page.locator('text=Recommendations')).not.toBeVisible();
  });

  test('10. Mobile Responsive Menu (simulated)', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await expect(page.locator('nav')).toBeVisible();
  });

  test('11. Contact Form Submission', async ({ page }) => {
    await page.click('button:text("Contact Us")');
    await page.fill('#name-input', 'Test User');
    await page.fill('#email-input', 'test@example.com');
    await page.fill('#message-input', 'Test Message');
    await page.click('#submit-button');
    await expect(page.locator('text=Message Dispatched')).toBeVisible();
  });

  test('12. Footer Visibility', async ({ page }) => {
    const footer = page.locator('footer');
    await expect(footer).toBeVisible();
    await expect(footer).toContainText('written by Brian McCarthy');
  });

  test('13. Image Alt Tags Presence', async ({ page }) => {
    await page.fill('#search-input', 'beach');
    await page.click('#search-button');
    const img = page.locator('img').first();
    await expect(img).toHaveAttribute('alt');
  });

  test('14. Video Background Presence', async ({ page }) => {
    const video = page.locator('video');
    await expect(video).toBeVisible();
  });

  test('15. Search Case Insensitivity', async ({ page }) => {
    await page.fill('#search-input', 'beACH');
    await page.click('#search-button');
    await expect(page.locator('text=Bora Bora')).toBeVisible();
  });
});
