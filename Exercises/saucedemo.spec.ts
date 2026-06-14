import { test, expect } from "@playwright/test";

/**
 * AUTHENTICATED AREA
 */
test.describe("SauceDemo - authenticated user", () => {

  test.beforeEach(async ({ page }) => {
    await page.goto("/");

    await page.getByPlaceholder("Username").fill("standard_user");
    await page.getByPlaceholder("Password").fill("secret_sauce");
    await page.getByRole("button", { name: "Login" }).click();

    await expect(page).toHaveURL(/inventory\.html/);
  });

  test("Add product to cart", async ({ page }) => {
    await page.locator('[data-test="add-to-cart-sauce-labs-backpack"]').click();

    await expect(page.locator (".shopping_cart_badge"), "Cart badge should show 1 after adding a product") 
      .toHaveText("1");
  });

  test("remove product from cart", async ({ page }) => {
    await page.locator('[data-test="add-to-cart-sauce-labs-backpack"]').click();

    await expect(page.locator(".shopping_cart_badge"), "Cart badge should show 1 after adding a product")
      .toHaveText("1");

    await page.locator(".shopping_cart_link").click();

    await page.locator('[data-test="remove-sauce-labs-backpack"]').click();

    await expect(page.locator(".shopping_cart_badge"), "Cart badge should not be visible after removing product")
      .not.toBeVisible();
  });

});


/**
 * AUTH / LOGIN TESTS
 */
test.describe("SauceDemo - login page", () => {

  test("Open site, login with valid credentials", async ({ page }) => {
    await page.goto("/");

    await page.getByPlaceholder("Username").fill("standard_user");
    await page.getByPlaceholder("Password").fill("secret_sauce");
    await page.getByRole("button", { name: "Login" }).click();

    await expect(page, "User should be redirected to inventory page").toHaveURL(/inventory\.html/);
  });

  test("Login with wrong password. Verify that an error message is displayed", async ({ page }) => {
    await page.goto("/");

    await page.getByPlaceholder("Username").fill("standard_user");
    await page.getByPlaceholder("Password").fill("secretsauce");
    await page.getByRole("button", { name: "Login" }).click();

    const errorMessage = page.locator('[data-test="error"]');

    await expect(errorMessage,"Error message should appear after login with invalid creds").toBeVisible();

    await expect(errorMessage, "Error message should display correct text").toHaveText(
      "Epic sadface: Username and password do not match any user in this service"
    );
  });

test("empty form validation", async ({ page }) => {
  await page.goto("/");

  const errorMessage = page.locator('[data-test="error"]');

  // Username only
  await page.getByPlaceholder("Username").fill("standard_user");
  await page.getByRole("button", { name: "Login" }).click();

  await expect(errorMessage, "Error message should appear for missing password").toBeVisible();
  await expect(errorMessage).toContainText("Password is required");

  await page.locator(".error-button").click();
  await expect(errorMessage, "Error message should not be visible after closing").toHaveCount(0);

  // RESET INPUTS 
  await page.getByPlaceholder("Username").fill("");
  await page.getByPlaceholder("Password").fill("");

  // Password only
  await page.getByPlaceholder("Password").fill("secret_sauce");
  await page.getByRole("button", { name: "Login" }).click();

  await expect(errorMessage, "Error message should appear for missing username").toBeVisible();
  await expect(errorMessage, "Error message should display correct text").toContainText("Username is required");
});

});