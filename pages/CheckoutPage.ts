import { Page, Locator, expect } from '@playwright/test';

export class CheckoutPage {
  readonly page: Page;

  // Header
  readonly pageTitle: Locator;

  // Form fields
  readonly firstNameInput: Locator;
  readonly lastNameInput: Locator;
  readonly postalCodeInput: Locator;

  // Buttons
  readonly continueButton: Locator;
  readonly cancelButton: Locator;

  // Error message
  readonly errorMessage: Locator;

  constructor(page: Page) {
    this.page = page;

    this.pageTitle = page.locator('.title');

    this.firstNameInput = page.locator('[data-test="firstName"]');
    this.lastNameInput = page.locator('[data-test="lastName"]');
    this.postalCodeInput = page.locator('[data-test="postalCode"]');

    this.continueButton = page.locator('[data-test="continue"]');
    this.cancelButton = page.locator('[data-test="cancel"]');

    this.errorMessage = page.locator('[data-test="error"]');
  }

  async open() {
    await this.page.goto(
      'https://www.saucedemo.com/checkout-step-one.html'
    );
  }

  async verifyPageLoaded() {
    await expect(this.pageTitle).toHaveText('Checkout: Your Information');
  }

  async fillFirstName(firstName: string) {
    await this.firstNameInput.fill(firstName);
  }

  async fillLastName(lastName: string) {
    await this.lastNameInput.fill(lastName);
  }

  async fillPostalCode(postalCode: string) {
    await this.postalCodeInput.fill(postalCode);
  }

  async fillCheckoutInformation(
    firstName: string,
    lastName: string,
    postalCode: string
  ) {
    await this.firstNameInput.fill(firstName);
    await this.lastNameInput.fill(lastName);
    await this.postalCodeInput.fill(postalCode);
  }

  async clickContinue() {
    await this.continueButton.click();
  }

  async clickCancel() {
    await this.cancelButton.click();
  }

  async continueCheckout(
    firstName: string,
    lastName: string,
    postalCode: string
  ) {
    await this.fillCheckoutInformation(
      firstName,
      lastName,
      postalCode
    );
    await this.clickContinue();
  }

  async getErrorMessage() {
    return await this.errorMessage.textContent();
  }

  async isErrorDisplayed() {
    return await this.errorMessage.isVisible();
  }
}