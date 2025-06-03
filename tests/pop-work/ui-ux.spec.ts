import { test, expect } from '@playwright/test';
import { baseURL, viewports } from './test-config';

test.use({ storageState: 'c:/Users/SamA/OneDrive - SecureW2/Desktop/AI/tests/Auth.json' });

test.describe('UI/UX Tests', () => {
  test('TC101 - Responsive Layout Tests', async ({ page }) => {
    // Description: Verify layout responsiveness across different viewports
    // Precondition: User is logged in
    
    for (const [device, viewport] of Object.entries(viewports)) {
      await page.setViewportSize(viewport);
      await page.goto('https://app.pop.work/workspace/answers?role=member');
      
      // Header visibility
      await expect(page.locator('header')).toBeVisible();
      
      // Navigation menu behavior
      if (viewport.width < 768) {
        await expect(page.locator('[data-test="mobile-menu"]')).toBeVisible();
        await expect(page.locator('[data-test="desktop-menu"]')).toBeHidden();
      } else {
        await expect(page.locator('[data-test="mobile-menu"]')).toBeHidden();
        await expect(page.locator('[data-test="desktop-menu"]')).toBeVisible();
      }
    }
  });

  test('TC102 - Form Elements Validation', async ({ page }) => {
    // Description: Verify all form elements are properly styled and interactive
    await page.goto('https://app.pop.work/workspace/answers?role=member');
    
    // Button states
    const primaryButton = page.locator('[data-test="primary-button"]');
    await expect(primaryButton).toBeVisible();
    await expect(primaryButton).toBeEnabled();
    await primaryButton.hover();
    // Verify hover state styles
    await expect(primaryButton).toHaveCSS('transform', 'matrix(1, 0, 0, 1, 0, -1)');
    
    // Input field validation
    const inputField = page.locator('[data-test="search-input"]');
    await inputField.fill('test');
    await expect(inputField).toHaveValue('test');
    await expect(inputField).toHaveCSS('border-color', 'rgb(59, 130, 246)');
  });

  test('TC103 - Loading States', async ({ page }) => {
    // Description: Verify loading states and spinners
    await page.goto('https://app.pop.work/workspace/answers?role=member');
    
    // Click refresh data
    await page.click('[data-test="refresh-button"]');
    await expect(page.locator('[data-test="loading-spinner"]')).toBeVisible();
    await expect(page.locator('[data-test="data-container"]')).toBeVisible();
  });

  test('TC104 - Error States', async ({ page }) => {
    // Description: Verify error states are properly displayed
    await page.goto('https://app.pop.work/workspace/answers?role=member');
    
    // Trigger error state
    await page.route('**/api/data', (route) => route.fulfill({
      status: 500,
      body: 'Server error'
    }));
    
    await page.click('[data-test="refresh-button"]');
    await expect(page.locator('[data-test="error-message"]')).toBeVisible();
    await expect(page.locator('[data-test="retry-button"]')).toBeVisible();
  });

  test('TC105 - Theme Switching', async ({ page }) => {
    // Description: Verify theme switching functionality
    await page.goto('https://app.pop.work/workspace/answers?role=member');
    
    // Toggle theme
    await page.click('[data-test="theme-toggle"]');
    await expect(page.locator('body')).toHaveAttribute('data-theme', 'dark');
    
    await page.click('[data-test="theme-toggle"]');
    await expect(page.locator('body')).toHaveAttribute('data-theme', 'light');
  });

  test('TC106 - Accessibility Navigation', async ({ page }) => {
    // Description: Verify keyboard navigation and accessibility features
    await page.goto('https://app.pop.work/workspace/answers?role=member');
    
    // Tab navigation
    await page.keyboard.press('Tab');
    await expect(page.locator(':focus')).toHaveAttribute('data-test', 'search-input');
    
    await page.keyboard.press('Tab');
    await expect(page.locator(':focus')).toHaveAttribute('data-test', 'filter-button');
    
    // ARIA labels
    await expect(page.locator('[data-test="user-menu"]')).toHaveAttribute('aria-label', 'User menu');
    await expect(page.locator('[data-test="notification-bell"]')).toHaveAttribute('aria-label', 'Notifications');
  });
});
