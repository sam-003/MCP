import { test, expect } from '@playwright/test';

const baseURL = 'https://www.saucedemo.com/';
const validPassword = 'secret_sauce';
const users = [
  'standard_user',
  'locked_out_user',
  'problem_user',
  'performance_glitch_user',
  'error_user',
  'visual_user',
];

test.describe('Login Tests for SauceDemo', () => {
  users.forEach((username) => {
    test(`Positive: Login with valid username: ${username}`, async ({ page }) => {
      await page.goto(baseURL);
      await page.fill('#user-name', username);
      await page.fill('#password', validPassword);
      await page.click('#login-button');
      if (username === 'locked_out_user') {
        await expect(page.locator('[data-test="error"]')).toHaveText(/locked out/);
      } else {
        await expect(page).toHaveURL(/inventory/);
        await expect(page.locator('.inventory_list')).toBeVisible();
        await page.click('#react-burger-menu-btn');
        await page.click('#logout_sidebar_link');
      }
    });
  });

  test('Negative: Login with invalid password', async ({ page }) => {
    await page.goto(baseURL);
    await page.fill('#user-name', 'standard_user');
    await page.fill('#password', 'wrong_password');
    await page.click('#login-button');
    await expect(page.locator('[data-test="error"]')).toHaveText(/Username and password do not match/);
  });

  test('Negative: Login with invalid username', async ({ page }) => {
    await page.goto(baseURL);
    await page.fill('#user-name', 'invalid_user');
    await page.fill('#password', validPassword);
    await page.click('#login-button');
    await expect(page.locator('[data-test="error"]')).toHaveText(/Username and password do not match/);
  });

  test('Negative: Login with empty username and password', async ({ page }) => {
    await page.goto(baseURL);
    await page.click('#login-button');
    await expect(page.locator('[data-test="error"]')).toHaveText(/Username is required/);
  });

  test('Negative: Login with empty password', async ({ page }) => {
    await page.goto(baseURL);
    await page.fill('#user-name', 'standard_user');
    await page.click('#login-button');
    await expect(page.locator('[data-test="error"]')).toHaveText(/Password is required/);
  });

  test('Negative: Login with empty username', async ({ page }) => {
    await page.goto(baseURL);
    await page.fill('#password', validPassword);
    await page.click('#login-button');
    await expect(page.locator('[data-test="error"]')).toHaveText(/Username is required/);
  });
});
