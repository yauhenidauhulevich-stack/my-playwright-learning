# Final Project — Playwright Test Suite

## Test target
SauceDemo (https://www.saucedemo.com)

## Covered user journey
Login → product selection → cart → checkout

## Test cases
Login flow:
- Valid user can log in
- Locked user cannot log in
- User cannot login with wrong password
- User cannot submit login form with empty username
- User cannot submit empty login form 

Inventory/Cart flow:
- Cart badge shows correct count after adding a product
- Adding multiple products shows correct badge count
- Cart page shows the name of the selected product
- Removing a product updates the cart badge
- User can remove item from Cart (item removed, UI updates, badge disappears)
- User can sort products by price (low to high)

Checkout flow:
- User can enter first name, last name, and postal code on first Checkout page
- Checkout verview page shows the selected product
- Finish button completes the order
- Success message ("Thank you for your order!") is visible on CheckoutCompletePage
- Cart is reset after placing an order


## Project structure
- `pages/` — Page Object classes (LoginPage, InventoryPage, CartPage, CheckoutPage)
- `tests/` — test specs (*.spec.ts)
- `playwright.config.ts` — configuration

## How to run
```bash
npm install
npx playwright install
npx playwright test
npx playwright show-report
```

## Notes
- No hard waits (`waitForTimeout`) are used
- Tests use semantic locators (`getByRole`, `getByTestId`, `getByPlaceholder`)
- Test data is stored separately from test logic

## Known limitations
- This suite covers only the selected user journey
- It does not cover all possible edge cases