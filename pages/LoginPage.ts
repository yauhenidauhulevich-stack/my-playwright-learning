import { type Locator, type Page, expect } from '@playwright/test';

export class LoginPage {
  readonly page: Page;

  readonly usernameInput: Locator;
  readonly passwordInput: Locator;
  readonly loginButton: Locator;
  readonly errorMessage: Locator;

  // Centralized error messages
  readonly errors = {
    lockedOut: 'Epic sadface: Sorry, this user has been locked out.',
    invalidCredentials: 'Epic sadface: Username and password do not match any user in this service',
    missingUsername: 'Epic sadface: Username is required',
    missingPassword: 'Epic sadface: Password is required',
  };

  constructor(page: Page) {
    this.page = page;

    this.usernameInput = page.locator('#user-name');
    this.passwordInput = page.locator('#password');
    this.loginButton = page.locator('#login-button');
    this.errorMessage = page.locator('[data-test="error"]');
  }

  async open() {
    await this.page.goto('https://www.saucedemo.com/');
  }

  async login(username: string, password: string) {
    await this.usernameInput.fill(username);
    await this.passwordInput.fill(password);
    await this.loginButton.click();
  }

  async expectError(type: keyof typeof this.errors) {
    await expect(this.errorMessage).toBeVisible();
    await expect(this.errorMessage).toHaveText(this.errors[type]);
  }

  async expectSuccessfulLogin() {
    await expect(this.page).toHaveURL(/inventory\.html/);
  }
}