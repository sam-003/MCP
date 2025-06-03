import { test, expect } from '@playwright/test';
import { baseURL, testData } from './test-config';

test.use({ storageState: 'c:/Users/SamA/OneDrive - SecureW2/Desktop/AI/tests/Auth.json' });

test.describe('Dashboard Functionality Tests', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(`${baseURL}/dashboard`);
  });

  test('TC201 - Dashboard Loading and Initial State', async ({ page }) => {
    // Description: Verify dashboard loads correctly with all widgets
    // Precondition: User is logged in
    
    // Verify essential widgets
    await expect(page.locator('[data-test="tasks-widget"]')).toBeVisible();
    await expect(page.locator('[data-test="calendar-widget"]')).toBeVisible();
    await expect(page.locator('[data-test="notifications-widget"]')).toBeVisible();
    
    // Verify data loading states
    await expect(page.locator('[data-test="widget-loading"]')).toHaveCount(0);
    await expect(page.locator('[data-test="tasks-count"]')).not.toBeEmpty();
  });

  test('TC202 - Data Filtering and Sorting', async ({ page }) => {
    // Description: Verify filtering and sorting functionality
    
    // Test filtering
    await page.click('[data-test="filter-button"]');
    await page.selectOption('[data-test="status-filter"]', 'completed');
    await expect(page.locator('[data-test="task-item"][data-status="completed"]')).toHaveCount(5);
    
    // Test sorting
    await page.click('[data-test="sort-by-date"]');
    const dates = await page.locator('[data-test="task-date"]').allInnerTexts();
    expect([...dates].sort()).toEqual(dates);
  });

  test('TC203 - Large Dataset Handling', async ({ page }) => {
    // Description: Verify performance with large datasets
    
    // Mock large dataset
    await page.route('**/api/tasks', (route) => route.fulfill({
      status: 200,
      body: JSON.stringify(testData.largeDataSet)
    }));
    
    await page.reload();
    
    // Verify lazy loading
    const visibleTasks = await page.locator('[data-test="task-item"]').count();
    expect(visibleTasks).toBeLessThan(50); // Assuming 50 items per page
    
    // Scroll and verify more items load
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
    const newVisibleTasks = await page.locator('[data-test="task-item"]').count();
    expect(newVisibleTasks).toBeGreaterThan(visibleTasks);
  });

  test('TC204 - Widget Interactions', async ({ page }) => {
    // Description: Verify widget interactions and updates
    
    // Calendar widget
    await page.click('[data-test="calendar-widget"] [data-test="next-month"]');
    await expect(page.locator('[data-test="calendar-title"]')).toContainText(getNextMonth());
    
    // Tasks widget
    await page.click('[data-test="add-task-button"]');
    await page.fill('[data-test="task-title"]', 'New Test Task');
    await page.click('[data-test="save-task"]');
    await expect(page.locator('[data-test="task-item"]')).toContainText('New Test Task');
  });

  test('TC205 - Dashboard Search', async ({ page }) => {
    // Description: Verify search functionality
    
    await page.fill('[data-test="search-input"]', 'test');
    await page.keyboard.press('Enter');
    
    // Verify search results
    await expect(page.locator('[data-test="search-results"]')).toBeVisible();
    const results = await page.locator('[data-test="search-result-item"]').count();
    expect(results).toBeGreaterThan(0);
  });

  test('TC206 - Dashboard State Persistence', async ({ page }) => {
    // Description: Verify dashboard state persists after refresh
    
    // Set some filters
    await page.click('[data-test="filter-button"]');
    await page.selectOption('[data-test="status-filter"]', 'completed');
    
    // Refresh page
    await page.reload();
    
    // Verify filters persisted
    await expect(page.locator('[data-test="status-filter"]')).toHaveValue('completed');
    await expect(page.locator('[data-test="task-item"][data-status="completed"]')).toHaveCount(5);
  });
});

function getNextMonth() {
  const date = new Date();
  date.setMonth(date.getMonth() + 1);
  return date.toLocaleString('default', { month: 'long' });
}
