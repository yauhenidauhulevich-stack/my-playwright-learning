import { Page, Locator, expect } from '@playwright/test';

export class CheckoutCompletePage {
  readonly page: Page;

  // Header
  readonly pageTitle: Locator;

  // Completion message
  readonly completeHeader: Locator;
  readonly completeText: Locator;
  readonly completeImage: Locator;

  // Buttons
  readonly backHomeButton: Locator;

  constructor(page: Page) {
    this.page = page;

    this.pageTitle = page.locator('.title');

    this.completeHeader = page.locator(
      '[data-test="complete-header"]'
    );
    this.completeText = page.locator(
      '[data-test="complete-text"]'
    );
    this.completeImage = page.locator(
      '[data-test="pony-express"]'
    );

    this.backHomeButton = page.locator(
      '[data-test="back-to-products"]'
    );
  }

  async open() {
    await this.page.goto(
      'https://www.saucedemo.com/checkout-complete.html'
    );
  }

  async verifyPageLoaded() {
    await expect(this.pageTitle).toHaveText(
      'Checkout: Complete!'
    );
  }

  async verifyOrderCompleted() {
    await expect(this.completeHeader).toHaveText(
      'Thank you for your order!'
    );

    await expect(this.completeText).toBeVisible();
  }

  async getCompletionMessage() {
    return await this.completeHeader.textContent();
  }

  async getCompletionDescription() {
    return await this.completeText.textContent();
  }

  async clickBackHome() {
    await this.backHomeButton.click();
  }

  async returnToInventory() {
    await this.clickBackHome();
  }
}