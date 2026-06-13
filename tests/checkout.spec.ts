import { test, expect } from '@playwright/test';

import { LoginPage } from '../pages/LoginPage';
import { InventoryPage } from '../pages/InventoryPage';
import { CartPage } from '../pages/CartPage';
import { CheckoutPage } from '../pages/CheckoutPage';
import { CheckoutOverviewPage } from '../pages/CheckoutOverviewPage';
import { CheckoutCompletePage } from '../pages/CheckoutCompletePage';

test('User can enter first name, last name, and postal code', async ({ page }) => {
  const loginPage = new LoginPage(page);
  const inventoryPage = new InventoryPage(page);
  const cartPage = new CartPage(page);
  const checkoutPage = new CheckoutPage(page);

  const firstName = 'John';
  const lastName = 'Doe';
  const postalCode = '12345';

  // =========================
  // LOGIN
  // =========================
  await loginPage.open();
  await loginPage.login('standard_user', 'secret_sauce');

  await page.waitForURL('**/inventory.html');
  await loginPage.expectSuccessfulLogin();

  // =========================
  // ADD PRODUCT + GO TO CHECKOUT
  // =========================
  await inventoryPage.addProductToCart('Sauce Labs Backpack');
  await inventoryPage.openCart();

  await page.waitForURL('**/cart.html');

  await cartPage.clickCheckout();

  // =========================
  // CHECKOUT PAGE
  // =========================
  await checkoutPage.verifyPageLoaded();

  // Fill form fields
  await checkoutPage.fillFirstName(firstName);
  await checkoutPage.fillLastName(lastName);
  await checkoutPage.fillPostalCode(postalCode);

  // =========================
  // ASSERT VALUES ARE ENTERED
  // =========================
  await expect(checkoutPage.firstNameInput).toHaveValue(firstName);
  await expect(checkoutPage.lastNameInput).toHaveValue(lastName);
  await expect(checkoutPage.postalCodeInput).toHaveValue(postalCode);
});

test('Overview page shows the selected product', async ({ page }) => {
  const loginPage = new LoginPage(page);
  const inventoryPage = new InventoryPage(page);
  const cartPage = new CartPage(page);
  const checkoutPage = new CheckoutPage(page);
  const overviewPage = new CheckoutOverviewPage(page);

  const productName = 'Sauce Labs Backpack';

  // =========================
  // LOGIN
  // =========================
  await loginPage.open();
  await loginPage.login('standard_user', 'secret_sauce');

  await page.waitForURL('**/inventory.html');
  await loginPage.expectSuccessfulLogin();

  // =========================
  // ADD PRODUCT + CART
  // =========================
  await inventoryPage.addProductToCart(productName);
  await inventoryPage.openCart();

  await page.waitForURL('**/cart.html');

  await cartPage.clickCheckout();

  // =========================
  // CHECKOUT STEP ONE
  // =========================
  await checkoutPage.verifyPageLoaded();

  await checkoutPage.fillCheckoutInformation('John', 'Doe', '12345');

  await checkoutPage.clickContinue();

  // =========================
  // OVERVIEW PAGE
  // =========================
  await overviewPage.verifyPageLoaded();

  const itemsCount = await overviewPage.getItemsCount();
  expect(itemsCount).toBe(1);

  const isVisible = await overviewPage.isProductDisplayed(productName);
  expect(isVisible).toBeTruthy();

  const productNames = await overviewPage.getProductNames();
  expect(productNames).toContain(productName);
});

test('Finish button completes the order', async ({ page }) => {
  const loginPage = new LoginPage(page);
  const inventoryPage = new InventoryPage(page);
  const cartPage = new CartPage(page);
  const checkoutPage = new CheckoutPage(page);
  const overviewPage = new CheckoutOverviewPage(page);
  const completePage = new CheckoutCompletePage(page);

  const productName = 'Sauce Labs Backpack';

  // =========================
  // LOGIN
  // =========================
  await loginPage.open();
  await loginPage.login('standard_user', 'secret_sauce');

  await page.waitForURL('**/inventory.html');
  await loginPage.expectSuccessfulLogin();

  // =========================
  // INVENTORY → CART
  // =========================
  await inventoryPage.addProductToCart(productName);
  await inventoryPage.openCart();

  await page.waitForURL('**/cart.html');

  await cartPage.clickCheckout();

  // =========================
  // CHECKOUT STEP ONE
  // =========================
  await checkoutPage.verifyPageLoaded();

  await checkoutPage.fillCheckoutInformation('John', 'Doe', '12345');

  await checkoutPage.clickContinue();

  // =========================
  // CHECKOUT OVERVIEW
  // =========================
  await overviewPage.verifyPageLoaded();

  await overviewPage.completeOrder();

  // =========================
  // CHECKOUT COMPLETE
  // =========================
  await completePage.verifyPageLoaded();
  await completePage.verifyOrderCompleted();

  // EXTRA ASSERTION (URL sanity check)
  await expect(page).toHaveURL(/checkout-complete\.html/);
});

test('Success message ("Thank you for your order!") is visible', async ({ page }) => {
  const loginPage = new LoginPage(page);
  const inventoryPage = new InventoryPage(page);
  const cartPage = new CartPage(page);
  const checkoutPage = new CheckoutPage(page);
  const overviewPage = new CheckoutOverviewPage(page);
  const completePage = new CheckoutCompletePage(page);

  const productName = 'Sauce Labs Backpack';

  // =========================
  // LOGIN
  // =========================
  await loginPage.open();
  await loginPage.login('standard_user', 'secret_sauce');

  await page.waitForURL('**/inventory.html');
  await loginPage.expectSuccessfulLogin();

  // =========================
  // ADD PRODUCT
  // =========================
  await inventoryPage.addProductToCart(productName);
  await inventoryPage.openCart();

  await page.waitForURL('**/cart.html');

  // =========================
  // CHECKOUT FLOW
  // =========================
  await cartPage.clickCheckout();

  await checkoutPage.verifyPageLoaded();
  await checkoutPage.fillCheckoutInformation('John', 'Doe', '12345');
  await checkoutPage.clickContinue();

  await overviewPage.verifyPageLoaded();
  await overviewPage.completeOrder();

  // =========================
  // ASSERT SUCCESS MESSAGE
  // =========================
  await completePage.verifyPageLoaded();
  await completePage.verifyOrderCompleted();

  await expect(completePage.completeHeader).toHaveText('Thank you for your order!');
});

test('Verify cart is reset after order', async ({ page }) => {
  const loginPage = new LoginPage(page);
  const inventoryPage = new InventoryPage(page);
  const cartPage = new CartPage(page);
  const checkoutPage = new CheckoutPage(page);
  const overviewPage = new CheckoutOverviewPage(page);
  const completePage = new CheckoutCompletePage(page);

  const productName = 'Sauce Labs Backpack';

  // =========================
  // LOGIN
  // =========================
  await loginPage.open();
  await loginPage.login('standard_user', 'secret_sauce');

  await page.waitForURL('**/inventory.html');
  await loginPage.expectSuccessfulLogin();

  // =========================
  // ADD PRODUCT
  // =========================
  await inventoryPage.addProductToCart(productName);

  expect(await inventoryPage.getCartBadgeCount()).toBe(1);

  await inventoryPage.openCart();

  await page.waitForURL('**/cart.html');

  // =========================
  // CHECKOUT FLOW
  // =========================
  await cartPage.clickCheckout();

  await checkoutPage.verifyPageLoaded();
  await checkoutPage.fillCheckoutInformation('John', 'Doe', '12345');
  await checkoutPage.clickContinue();

  await overviewPage.verifyPageLoaded();
  await overviewPage.completeOrder();

  // =========================
  // COMPLETE PAGE
  // =========================
  await completePage.verifyOrderCompleted();

  // =========================
  // ASSERT CART RESET
  // =========================

  // Go back to inventory
  await completePage.returnToInventory();

  await page.waitForURL('**/inventory.html');

  // Badge should be gone or = 0
  const badgeCount = await inventoryPage.getCartBadgeCount();
  expect(badgeCount).toBe(0);

  // Cart should be empty when opened again
  await inventoryPage.openCart();

  await page.waitForURL('**/cart.html');

  const itemsCount = await cartPage.getItemsCount();
  expect(itemsCount).toBe(0);
});