import { expect, test } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import { InventoryPage } from '../pages/InventoryPage';

test('standard_user can log in and sees inventory page', async ({ page }) => {
  const loginPage = new LoginPage(page);
  const inventoryPage = new InventoryPage(page);

  // Open login page
  await loginPage.open();

  // Login (after click Playwright will auto-wait navigation)
  await loginPage.login('standard_user', 'secret_sauce');

  // Verify we are on inventory page via POM
  await inventoryPage.verifyPageLoaded();
});

test('locked_out_user cannot log in', async ({ page }) => {
  const loginPage = new LoginPage(page);

  // Open login page
  await loginPage.open();

  // Attempt login with locked user credentials
  await loginPage.login('locked_out_user', 'secret_sauce');

  // Verify locked out error is shown
  await loginPage.expectError('lockedOut');
});

test('wrong password shows error message', async ({ page }) => {
  const loginPage = new LoginPage(page);

  // Open login page
  await loginPage.open();

  // Try to login with invalid password
  await loginPage.login('standard_user', 'wrong_password');

  // Verify error message is shown
  await loginPage.expectError('invalidCredentials');
});

test('empty username shows validation error', async ({ page }) => {
  const loginPage = new LoginPage(page);

  // Open login page
  await loginPage.open();

  // Try to login without username
  await loginPage.login('', 'secret_sauce');

  // Verify validation error for missing username
  await loginPage.expectError('missingUsername');
});

test('user cannot submit empty login form', async ({ page }) => {
  const loginPage = new LoginPage(page);

  // Open login page
  await loginPage.open();

  // Click login button without entering credentials
  await loginPage.loginButton.click();

  // Verify validation error for missing username
  await loginPage.expectError('missingUsername');
});