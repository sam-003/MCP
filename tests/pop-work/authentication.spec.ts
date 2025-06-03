import { test, expect } from '@playwright/test';
import { faker } from '@faker-js/faker';
import {Page} from '@playwright/test';
test.describe('Authentication Tests', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('https://pop.work');
  });

  test('Login with valid credentials', async ({ page }) => {
    await test.step('Navigate to login page', async () => {
      await page.click('text=Login');
      await expect(page).toHaveURL(/.*login/);
    });

    await test.step('Fill login form', async () => {
      await page.fill('[data-test="email"]', 'test@example.com');
      await page.fill('[data-test="password"]', 'validPassword123');
      await page.click('[data-test="login-submit"]');
    });

    await test.step('Verify successful login', async () => {
      await expect(page).toHaveURL(/.*dashboard/);
      await expect(page.locator('[data-test="user-menu"]')).toBeVisible();
    });
  });

  test('Registration with new account', async ({ page }) => {
    const email = faker.internet.email();
    const password = faker.internet.password();

    await test.step('Navigate to registration page', async () => {
      await page.click('text=Sign Up');
      await expect(page).toHaveURL(/.*register/);
    });

    await test.step('Fill registration form', async () => {
      await page.fill('[data-test="name"]', faker.person.fullName());
      await page.fill('[data-test="email"]', email);
      await page.fill('[data-test="password"]', password);
      await page.fill('[data-test="confirm-password"]', password);
      await page.click('[data-test="register-submit"]');
    });

    await test.step('Verify successful registration', async () => {
      await expect(page).toHaveURL(/.*email-verification/);
      await expect(page.locator('text=Please verify your email')).toBeVisible();
    });
  });

  test('Forgot password flow', async ({ page }) => {
    await test.step('Navigate to forgot password page', async () => {
      await page.click('text=Login');
      await page.click('text=Forgot Password?');
      await expect(page).toHaveURL(/.*forgot-password/);
    });

    await test.step('Submit forgot password request', async () => {
      await page.fill('[data-test="email"]', 'test@example.com');
      await page.click('[data-test="submit"]');
    });

    await test.step('Verify reset password email sent', async () => {
      await expect(page.locator('text=Reset password link sent')).toBeVisible();
    });
  });

  test('Session expiration handling', async ({ page }) => {
    await test.step('Login with valid credentials', async () => {
      await page.click('text=Login');
      await page.fill('[data-test="email"]', 'test@example.com');
      await page.fill('[data-test="password"]', 'validPassword123');
      await page.click('[data-test="login-submit"]');
    });

    await test.step('Simulate session expiration', async () => {
      // Clear localStorage and sessionStorage
      await page.evaluate(() => {
        localStorage.clear();
        sessionStorage.clear();
      });
      await page.reload();
    });

    await test.step('Verify redirect to login page', async () => {
      await expect(page).toHaveURL(/.*login/);
    });
  });
});
