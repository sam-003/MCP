import { test, expect } from '@playwright/test';
import { baseURL } from './test-config';

test.use({ storageState: '../Auth.json' });

test.describe('Integration Tests', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(`${baseURL}/dashboard`);
  });

  test('TC301 - Calendar Integration', async ({ page }) => {
    // Description: Verify calendar integration functionality
    // Precondition: User has calendar integration enabled
    
    await page.click('[data-test="calendar-settings"]');
    
    // Test Google Calendar integration
    await page.click('[data-test="connect-google-calendar"]');
    await expect(page.locator('[data-test="google-calendar-connected"]')).toBeVisible();
    
    // Verify event sync
    await page.click('[data-test="sync-calendar"]');
    await expect(page.locator('[data-test="calendar-event"]')).toBeVisible();
  });

  test('TC302 - Slack Integration', async ({ page }) => {
    // Description: Verify Slack integration functionality
    
    await page.click('[data-test="integrations-settings"]');
    
    // Connect Slack
    await page.click('[data-test="connect-slack"]');
    await expect(page.locator('[data-test="slack-connected"]')).toBeVisible();
    
    // Test notifications
    await page.click('[data-test="test-slack-notification"]');
    await expect(page.locator('[data-test="notification-sent"]')).toBeVisible();
  });

  test('TC303 - Email Notifications', async ({ page }) => {
    // Description: Verify email notification settings and delivery
    
    await page.click('[data-test="notification-settings"]');
    
    // Configure email preferences
    await page.check('[data-test="email-daily-summary"]');
    await page.check('[data-test="email-task-assignments"]');
    await page.click('[data-test="save-notification-settings"]');
    
    // Verify settings saved
    await page.reload();
    await expect(page.locator('[data-test="email-daily-summary"]')).toBeChecked();
    await expect(page.locator('[data-test="email-task-assignments"]')).toBeChecked();
  });

  test('TC304 - File Storage Integration', async ({ page }) => {
    // Description: Verify file storage integration
    
    // Test file upload to cloud storage
    await page.setInputFiles('[data-test="file-upload"]', 'path/to/test-file.pdf');
    await expect(page.locator('[data-test="upload-success"]')).toBeVisible();
    
    // Verify file sync with cloud storage
    await page.click('[data-test="sync-files"]');
    await expect(page.locator('[data-test="file-synced"]')).toBeVisible();
  });

  test('TC305 - API Integration Tests', async ({ page, request }) => {
    // Description: Verify external API integrations
    
    // Test API endpoints
    const response = await request.get(`${baseURL}/api/external/status`);
    expect(response.status()).toBe(200);
    
    // Verify webhook configuration
    await page.click('[data-test="webhook-settings"]');
    await page.fill('[data-test="webhook-url"]', 'https://api.example.com/webhook');
    await page.click('[data-test="save-webhook"]');
    
    // Test webhook delivery
    await page.click('[data-test="test-webhook"]');
    await expect(page.locator('[data-test="webhook-success"]')).toBeVisible();
  });

  test('TC306 - Third-Party Authentication', async ({ page }) => {
    // Description: Verify third-party authentication methods
    
    await page.goto(`${baseURL}/settings/security`);
    
    // Test OAuth providers
    await page.click('[data-test="connect-google"]');
    await expect(page.locator('[data-test="google-connected"]')).toBeVisible();
    
    // Test SSO configuration
    await page.click('[data-test="configure-sso"]');
    await page.fill('[data-test="sso-domain"]', 'company.com');
    await page.click('[data-test="save-sso"]');
    await expect(page.locator('[data-test="sso-active"]')).toBeVisible();
  });
});
