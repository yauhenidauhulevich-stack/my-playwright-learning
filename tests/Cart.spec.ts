import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import { InventoryPage } from '../pages/InventoryPage';
import { CartPage } from '../pages/CartPage';

test('Cart badge shows correct count after adding a product', async ({ page }) => {
  const loginPage = new LoginPage(page);
  const inventoryPage = new InventoryPage(page);

  // =========================
  // LOGIN
  // =========================
  await loginPage.open();

  await loginPage.login('standard_user', 'secret_sauce');

  await page.waitForURL('**/inventory.html');

  await loginPage.expectSuccessfulLogin();

  // =========================
  // INVENTORY ACTION
  // =========================
  await inventoryPage.verifyPageLoaded();

  // Add product (Clicking)
  await inventoryPage.addProductToCart('Sauce Labs Backpack');

  // =========================
  // ASSERT CART BADGE
  // =========================
  const badgeCount = await inventoryPage.getCartBadgeCount();

  expect(badgeCount).toBe(1);
});

test('Adding multiple products shows correct badge count', async ({ page }) => {
  const loginPage = new LoginPage(page);
  const inventoryPage = new InventoryPage(page);

  // =========================
  // LOGIN
  // =========================
  await loginPage.open();

  await loginPage.login('standard_user', 'secret_sauce');

  await page.waitForURL('**/inventory.html');

  await loginPage.expectSuccessfulLogin();

  // =========================
  // INVENTORY ACTIONS
  // =========================
  await inventoryPage.verifyPageLoaded();

  // Add multiple products (Clicking via POM)
  await inventoryPage.addProductToCart('Sauce Labs Backpack');
  await inventoryPage.addProductToCart('Sauce Labs Bike Light');
  await inventoryPage.addProductToCart('Sauce Labs Bolt T-Shirt');

  // =========================
  // ASSERT BADGE COUNT
  // =========================
  const badgeCount = await inventoryPage.getCartBadgeCount();

  expect(badgeCount).toBe(3);
});

test('Cart page shows the name of the selected product', async ({ page }) => {
  const loginPage = new LoginPage(page);
  const inventoryPage = new InventoryPage(page);
  const cartPage = new CartPage(page);

  // =========================
  // LOGIN
  // =========================
  await loginPage.open();

  await loginPage.login('standard_user', 'secret_sauce');

  await page.waitForURL('**/inventory.html');

  await loginPage.expectSuccessfulLogin();

  // =========================
  // INVENTORY ACTION
  // =========================
  const productName = 'Sauce Labs Backpack';

  await inventoryPage.verifyPageLoaded();

  await inventoryPage.addProductToCart(productName);

  await inventoryPage.openCart();

  await page.waitForURL('**/cart.html');

  // =========================
  // CART ASSERTION
  // =========================
  await cartPage.verifyPageLoaded();

  const isProductVisible = await cartPage.isProductInCart(productName);

  expect(isProductVisible).toBeTruthy();

  const productNames = await cartPage.getProductNames();

  expect(productNames).toContain(productName);
});

test('Removing a product updates the cart badge', async ({ page }) => {
  const loginPage = new LoginPage(page);
  const inventoryPage = new InventoryPage(page);

  // =========================
  // LOGIN
  // =========================
  await loginPage.open();

  await loginPage.login('standard_user', 'secret_sauce');

  await page.waitForURL('**/inventory.html');

  await loginPage.expectSuccessfulLogin();

  // =========================
  // INVENTORY ACTIONS
  // =========================
  const productName = 'Sauce Labs Backpack';

  await inventoryPage.verifyPageLoaded();

  // Add product
  await inventoryPage.addProductToCart(productName);

  let badgeCount = await inventoryPage.getCartBadgeCount();
  expect(badgeCount).toBe(1);

  // Remove product
  await inventoryPage.removeProductFromCart(productName);

  // =========================
  // ASSERT BADGE UPDATED
  // =========================
  badgeCount = await inventoryPage.getCartBadgeCount();

  expect(badgeCount).toBe(0);
});

test('User can remove item from Cart (item removed, UI updates, badge disappears)', async ({ page }) => {
  const loginPage = new LoginPage(page);
  const inventoryPage = new InventoryPage(page);
  const cartPage = new CartPage(page);

  // =========================
  // LOGIN
  // =========================
  await loginPage.open();

  await loginPage.login('standard_user', 'secret_sauce');

  await page.waitForURL('**/inventory.html');

  await loginPage.expectSuccessfulLogin();

  // =========================
  // ADD ITEM
  // =========================
  const productName = 'Sauce Labs Backpack';

  await inventoryPage.verifyPageLoaded();

  await inventoryPage.addProductToCart(productName);

  expect(await inventoryPage.getCartBadgeCount()).toBe(1);

  // =========================
  // GO TO CART
  // =========================
  await inventoryPage.openCart();

  await page.waitForURL('**/cart.html');

  await cartPage.verifyPageLoaded();

  expect(await cartPage.isProductInCart(productName)).toBeTruthy();

  // =========================
  // REMOVE ITEM
  // =========================
  await cartPage.removeProduct(productName);

  // =========================
  // UI UPDATE CHECK (IMPORTANT)
  // =========================

  // 1. Item should disappear from DOM
  await expect(
    page.locator('.inventory_item_name', { hasText: productName })
  ).toHaveCount(0);

  // 2. Cart should be empty
  expect(await cartPage.getItemsCount()).toBe(0);

  // =========================
  // BADGE CHECK
  // =========================
  const badgeCount = await inventoryPage.getCartBadgeCount();
  expect(badgeCount).toBe(0);
});

test('User can sort products by price (low to high)', async ({ page }) => {
  const loginPage = new LoginPage(page);
  const inventoryPage = new InventoryPage(page);

  // =========================
  // LOGIN
  // =========================
  await loginPage.open();

  await loginPage.login('standard_user', 'secret_sauce');

  await page.waitForURL('**/inventory.html');

  await loginPage.expectSuccessfulLogin();

  // =========================
  // INVENTORY PAGE
  // =========================
  await inventoryPage.verifyPageLoaded();

  // Apply sorting
  await inventoryPage.sortBy('Price (low to high)');

  // =========================
  // ASSERT SORTING
  // =========================

  const prices = await page.locator('.inventory_item_price').allTextContents();

  const numericPrices = prices.map(p =>
    Number(p.replace('$', '').trim())
  );

  const sortedPrices = [...numericPrices].sort((a, b) => a - b);

  // Full order check
  expect(numericPrices).toEqual(sortedPrices);

  // =========================
  // EXTRA VALIDATIONS
  // =========================

  // First item = cheapest
  expect(numericPrices[0]).toBe(Math.min(...numericPrices));

  // Last item = most expensive
  expect(numericPrices[numericPrices.length - 1]).toBe(
    Math.max(...numericPrices)
  );
});