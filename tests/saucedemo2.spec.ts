import { test, expect } from "@playwright/test";

test('Open site, login with valid credentials and verify redirect to inventory page', async ({ page }) => {
  await page.goto('/');
  await page.getByPlaceholder('Username').fill('standard_user');
  await page.getByPlaceholder('Password').fill('secret_sauce');
  await page.getByRole('button', { name: 'Login' }).click();
  await page.waitForURL('**/inventory.html');
  await expect(page, "User should be redirected to inventory page").toHaveURL(/inventory\.html/);
});
 
test('111 Login with wrong password. Verify that an error message is displayed', async ({ page }) => {
  await page.goto('/');
  await page.getByPlaceholder('Username').fill('standard_user');
  await page.getByPlaceholder('Password').fill('secretsauce');
  await page.getByRole('button', { name: 'Login' }).click();
  await expect(
    page.locator('[data-test="error"]'),
    'Error should appear for wrong credentials'
  ).toHaveText('Epic sadface: Username and password do not match any user in this service');
});

test("empty form validation", async ({ page }) => { 
await page.goto("/"); // Username only 
await page.getByPlaceholder("Username").fill("standard_user"); 
await page.getByRole("button", { name: "Login" }).click(); const errorMessage = page.locator('[data-test="error"]'); 
await expect(errorMessage).toBeVisible(); 
await expect(errorMessage).toContainText( "Epic sadface: Password is required" );

 // Close error 

await page. locator(".error-button").click(); 
await expect(errorMessage).toHaveCount(0); 

// Clear username 

await page.getByPlaceholder("Username").clear(); 

// Password only 

await page.getByPlaceholder("Password").fill("secret_sauce"); 
await page.getByRole("button", { name: "Login" }).click(); 
await expect(errorMessage).toBeVisible(); 
await expect(errorMessage).toContainText( "Epic sadface: Username is required" );
});



test('locked out user sees correct error message', async ({ page }) => {
  await page.goto('/');

  await page.getByPlaceholder('Username').fill('locked_out_user');
  await page.getByPlaceholder('Password').fill('secret_sauce');

  await page.getByRole('button', { name: 'Login' }).click();

  await expect(
    page.getByText('Epic sadface: Sorry, this user has been locked out.')
  ).toBeVisible();

  await expect(
    page.getByText('Epic sadface: Sorry, this user has been locked out.')
  ).toHaveText(
    'Epic sadface: Sorry, this user has been locked out.'
  );
});