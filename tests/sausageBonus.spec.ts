import { test, expect } from "@playwright/test";
test("Multiple products - cart badge updates correctly", async ({
  page,
}) => {
  await page.goto("/");
  await page.getByPlaceholder("Username").fill("standard_user");
  await page.getByPlaceholder("Password").fill("secret_sauce");
  await page.getByRole("button", { name: "Login" }).click();
  const addToCartButtons = page.getByRole("button", {
    name: "Add to cart",
  });
  await addToCartButtons.nth(0).click();
  await addToCartButtons.nth(1).click();
  await addToCartButtons.nth(2).click();
  const cartBadge = page.locator(".shopping_cart_badge");
  await expect(cartBadge).toHaveText("3");
  const removeButtons = page.getByRole("button", {
    name: "Remove",
  });
  await removeButtons.nth(0).click();
  await expect(cartBadge).toHaveText("2");
});

test("Sorting changes the first product", async ({ page }) => {
  await page.goto("/");
  await page.getByPlaceholder("Username").fill("standard_user");
  await page.getByPlaceholder("Password").fill("secret_sauce");
  await page.getByRole("button", { name: "Login" }).click();
  const firstProduct = page.locator(".inventory_item_name").first();
  const initialProductName = await firstProduct.textContent();
  const sortDropdown = page.locator(".product_sort_container");
  await expect(sortDropdown).toHaveValue("az");
  await sortDropdown.selectOption("lohi");
  const sortedProductName = await firstProduct.textContent();
  expect(sortedProductName).not.toBe(initialProductName);
});

 
test("State after refresh with random product", async ({ page }) => {
  await page.goto("/");
 
  await page.getByPlaceholder("Username").fill("standard_user");
  await page.getByPlaceholder("Password").fill("secret_sauce");
  await page.getByRole("button", { name: "Login" }).click();

  const products = page.locator(".inventory_item");
  const count = await products.count();
 

  const randomIndex = Math.floor(Math.random() * count);
 
  const randomProduct = products.nth(randomIndex);
 

  const productName = await randomProduct
    .locator(".inventory_item_name")
    .innerText();
 
  console.log("Selected product:", productName);
 

  await randomProduct
    .getByRole("button", { name: "Add to cart" })
    .click();
 
  
  await expect(page.locator(".shopping_cart_badge")).toHaveText("1");
 

  await page.reload();
 

  await expect(page.locator(".shopping_cart_badge")).toHaveText("1");
 

  await page.locator(".shopping_cart_link").click();
 

  await expect(page.locator(".inventory_item_name"))
    .toHaveText(productName);
});