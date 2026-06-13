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