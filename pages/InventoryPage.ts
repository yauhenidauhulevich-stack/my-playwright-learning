import { Page, Locator, expect } from '@playwright/test';

export class InventoryPage {
  readonly page: Page;

  // Header
  readonly pageTitle: Locator;
  readonly shoppingCart: Locator;
  readonly burgerMenu: Locator;

  // Products
  readonly inventoryItems: Locator;
  readonly addToCartButtons: Locator;

  constructor(page: Page) {
    this.page = page;

    this.pageTitle = page.locator('.title');
    this.shoppingCart = page.locator('.shopping_cart_link');
    this.burgerMenu = page.locator('#react-burger-menu-btn');

    this.inventoryItems = page.locator('.inventory_item');
    this.addToCartButtons = page.locator('button[data-test^="add-to-cart"]');
  }

  async open() {
    await this.page.goto('https://www.saucedemo.com/inventory.html');
  }

  async verifyPageLoaded() {
    await expect(this.pageTitle).toHaveText('Products');
  }

  async getProductsCount() {
    return await this.inventoryItems.count();
  }

  async addProductToCart(productName: string) {
    await this.page
      .locator('.inventory_item')
      .filter({
        has: this.page.locator('.inventory_item_name', {
          hasText: productName,
        }),
      })
      .getByRole('button')
      .click();
  }

  async removeProductFromCart(productName: string) {
    await this.page
      .locator('.inventory_item')
      .filter({
        has: this.page.locator('.inventory_item_name', {
          hasText: productName,
        }),
      })
      .getByRole('button')
      .click();
  }

  async openCart() {
    await this.shoppingCart.click();
  }

  async openMenu() {
    await this.burgerMenu.click();
  }

  async logout() {
    await this.openMenu();
    await this.page.locator('#logout_sidebar_link').click();
  }

  async sortBy(option: string) {
    await this.page.locator('[data-test="product-sort-container"]').selectOption({ label: option });
  }

  async getCartBadgeCount() {
    const badge = this.page.locator('.shopping_cart_badge');

    if (await badge.isVisible()) {
      return Number(await badge.textContent());
    }

    return 0;
  }
}