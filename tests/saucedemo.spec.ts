import { test, expect } from '@playwright/test';

const baseURL = 'https://www.saucedemo.com/';
const password = 'secret_sauce';

const users = [
  { username: 'standard_user', shouldLogin: true },
  { username: 'locked_out_user', shouldLogin: false, errorMsg: 'Sorry, this user has been locked out.' },
  { username: 'problem_user', shouldLogin: true }, // logs in, but app is broken
  { username: 'performance_glitch_user', shouldLogin: true }, // logs in slowly
  { username: 'error_user', shouldLogin: true }, // also logs in, UI errors possible
  { username: 'visual_user', shouldLogin: true }, // visual bugs but login works
];

// 🟢 Positive + Negative test cases based on behavior
for (const user of users) {
  test(`Login test for "${user.username}"`, async ({ page }) => {
    await page.goto(baseURL);
    await page.fill('[data-test="username"]', user.username);
    await page.fill('[data-test="password"]', password);
    await page.click('[data-test="login-button"]');

    if (user.shouldLogin) {
      await expect(page).toHaveURL(/.*inventory/);
      await expect(page.locator('.title')).toHaveText('Products');
    } else {
      const error = page.locator('[data-test="error"]');
      await expect(error).toBeVisible();
      if (user.errorMsg) {
        await expect(error).toContainText(user.errorMsg);
      }
    }

    // Reset for next test
    await page.context().clearCookies();
  });
}

// 🔴 Negative case: wrong password
test('Login fails with wrong password', async ({ page }) => {
  await page.goto(baseURL);
  await page.fill('[data-test="username"]', 'standard_user');
  await page.fill('[data-test="password"]', 'wrong_password');
  await page.click('[data-test="login-button"]');

  const error = page.locator('[data-test="error"]');
  await expect(error).toBeVisible();
  await expect(error).toContainText('Username and password do not match');
});

// 🔴 Negative case: no credentials
test('Login fails with empty username and password', async ({ page }) => {
  await page.goto(baseURL);
  await page.click('[data-test="login-button"]');

  const error = page.locator('[data-test="error"]');
  await expect(error).toBeVisible();
  await expect(error).toContainText('Username is required');
});

// 🔴 Negative case: username only
test('Login fails with only username', async ({ page }) => {
  await page.goto(baseURL);
  await page.fill('[data-test="username"]', 'standard_user');
  await page.click('[data-test="login-button"]');

  const error = page.locator('[data-test="error"]');
  await expect(error).toBeVisible();
  await expect(error).toContainText('Password is required');
});
