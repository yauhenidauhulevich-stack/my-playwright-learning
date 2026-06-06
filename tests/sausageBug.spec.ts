import { test, expect } from "@playwright/test";
test("Checkout button is not visible when cart is empty", async ({
  page,
}) => {
  await page.goto("/");
  await page.getByPlaceholder("Username").fill("standard_user");
  await page.getByPlaceholder("Password").fill("secret_sauce");
  await page.getByRole("button", { name: "Login" }).click();
  await page.locator(".shopping_cart_link").click();
  const checkoutButton = page.locator(
    ".btn.btn_action.btn_medium.checkout_button"
  );
  await expect(checkoutButton).not.toBeVisible();
});