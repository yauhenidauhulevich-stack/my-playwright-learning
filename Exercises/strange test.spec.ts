import { test, expect } from "@playwright/test";
test("empty form validation", async ({ page }) => {
  await page.goto("/");
  // Username only
  await page.getByPlaceholder("Username").fill("standard_user");
  await page.getByRole("button", { name: "Login" }).click();
  const errorMessage = page.locator('[data-test="error"]');
  await expect(errorMessage).toBeVisible();
  await expect(errorMessage).toContainText(
    "Epic sadface: Password is required"
  );
  // Close error
  await page.locator(".error-button").click();
  await expect(errorMessage).toHaveCount(0);
  // Clear username
  await page.getByPlaceholder("Username").clear();
  // Password only
  await page.getByPlaceholder("Password").fill("secret_sauce");
  await page.getByRole("button", { name: "Login" }).click();
  await expect(errorMessage).toBeVisible();
  await expect(errorMessage).toContainText(
    "Epic sadface: Username is required"
  );
});