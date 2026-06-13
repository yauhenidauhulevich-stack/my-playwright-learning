import { Page, Locator, expect } from '@playwright/test';

export class CheckoutOverviewPage {
  readonly page: Page;

  // Header
  readonly pageTitle: Locator;

  // Order items
  readonly cartItems: Locator;

  // Summary
  readonly paymentInfo: Locator;
  readonly shippingInfo: Locator;
  readonly itemTotal: Locator;
  readonly tax: Locator;
  readonly total: Locator;

  // Buttons
  readonly finishButton: Locator;
  readonly cancelButton: Locator;

  constructor(page: Page) {
    this.page = page;

    this.pageTitle = page.locator('.title');

    this.cartItems = page.locator('.cart_item');

    this.paymentInfo = page.locator(
      '[data-test="payment-info-value"]'
    );
    this.shippingInfo = page.locator(
      '[data-test="shipping-info-value"]'
    );

    this.itemTotal = page.locator(
      '[data-test="subtotal-label"]'
    );
    this.tax = page.locator(
      '[data-test="tax-label"]'
    );
    this.total = page.locator(
      '[data-test="total-label"]'
    );

    this.finishButton = page.locator(
      '[data-test="finish"]'
    );
    this.cancelButton = page.locator(
      '[data-test="cancel"]'
    );
  }

  async open() {
    await this.page.goto(
      'https://www.saucedemo.com/checkout-step-two.html'
    );
  }

  async verifyPageLoaded() {
    await expect(this.pageTitle).toHaveText(
      'Checkout: Overview'
    );
  }

  async getItemsCount() {
    return await this.cartItems.count();
  }

  async getProductNames() {
    return await this.page
      .locator('.inventory_item_name')
      .allTextContents();
  }

  async isProductDisplayed(productName: string) {
    return await this.page
      .getByText(productName)
      .isVisible();
  }

  async getPaymentInfo() {
    return await this.paymentInfo.textContent();
  }

  async getShippingInfo() {
    return await this.shippingInfo.textContent();
  }

  async getItemTotal() {
    return await this.itemTotal.textContent();
  }

  async getTax() {
    return await this.tax.textContent();
  }

  async getTotal() {
    return await this.total.textContent();
  }

  async clickFinish() {
    await this.finishButton.click();
  }

  async clickCancel() {
    await this.cancelButton.click();
  }

  async completeOrder() {
    await this.clickFinish();
  }
}