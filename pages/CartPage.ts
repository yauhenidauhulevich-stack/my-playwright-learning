import { Page, Locator, expect } from '@playwright/test';

export class CartPage {
  readonly page: Page;

  // Header
  readonly pageTitle: Locator;
  readonly shoppingCart: Locator;
  readonly burgerMenu: Locator;

  // Cart
  readonly cartItems: Locator;
  readonly checkoutButton: Locator;
  readonly continueShoppingButton: Locator;

  constructor(page: Page) {
    this.page = page;

    this.pageTitle = page.locator('.title');
    this.shoppingCart = page.locator('.shopping_cart_link');
    this.burgerMenu = page.locator('#react-burger-menu-btn');

    this.cartItems = page.locator('.cart_item');
    this.checkoutButton = page.locator('[data-test="checkout"]');
    this.continueShoppingButton = page.locator('[data-test="continue-shopping"]');
  }

  async open() {
    await this.page.goto('https://www.saucedemo.com/cart.html');
  }

  async verifyPageLoaded() {
    await expect(this.pageTitle).toHaveText('Your Cart');
  }

  async getItemsCount() {
    return await this.cartItems.count();
  }

  async isProductInCart(productName: string) {
    return await this.page
      .locator('.inventory_item_name')
      .filter({ hasText: productName })
      .isVisible();
  }

  async removeProduct(productName: string) {
    await this.page
      .locator('.cart_item')
      .filter({
        has: this.page.locator('.inventory_item_name', {
          hasText: productName,
        }),
      })
      .getByRole('button')
      .click();
  }

  async clickCheckout() {
    await this.checkoutButton.click();
  }

  async clickContinueShopping() {
    await this.continueShoppingButton.click();
  }

  async getProductNames() {
    return await this.page.locator('.inventory_item_name').allTextContents();
  }

  async openMenu() {
    await this.burgerMenu.click();
  }

  async logout() {
    await this.openMenu();
    await this.page.locator('#logout_sidebar_link').click();
  }
}