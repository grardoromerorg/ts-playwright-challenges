import { test, expect } from '../../fixtures/credentials.fixture';
import { LoginPage } from '../../helpers/page-objects/login.page';
import { InventoryPage } from '../../helpers/page-objects/inventory.page';
import { CartPage } from '../../helpers/page-objects/cart.page';
import { CheckoutInfoPage } from '../../helpers/page-objects/checkout-info.page';
import { CheckoutOverviewPage } from '../../helpers/page-objects/checkout-overview.page';
import { CheckoutCompletePage } from '../../helpers/page-objects/checkout-complete.page';

const ITEMS_TO_PURCHASE = 2;

test.describe('Sauce Demo checkout flow', () => {
  test('standard_user completes a purchase with two distinct items', async ({
    page,
    sauceDemoCredentials,
  }) => {
    const loginPage = new LoginPage(page);
    const inventoryPage = new InventoryPage(page);
    const cartPage = new CartPage(page);
    const checkoutInfoPage = new CheckoutInfoPage(page);
    const checkoutOverviewPage = new CheckoutOverviewPage(page);
    const checkoutCompletePage = new CheckoutCompletePage(page);

    await test.step('Login with standard_user', async () => {
      await loginPage.goto();
      await loginPage.login(sauceDemoCredentials.username, sauceDemoCredentials.password);
      await expect(page).toHaveURL(/inventory\.html/);
    });

    const addedItems = await test.step('Add two distinct items from the inventory page', async () => {
      const items = await inventoryPage.addItemsToCart(ITEMS_TO_PURCHASE);

      expect(items).toHaveLength(ITEMS_TO_PURCHASE);
      expect(new Set(items.map((item) => item.name)).size).toBe(ITEMS_TO_PURCHASE);
      await expect(inventoryPage.cartBadge).toHaveText(String(ITEMS_TO_PURCHASE));

      return items;
    });

    await test.step('Navigate to cart and validate items and quantity', async () => {
      await inventoryPage.goToCart();
      await expect(page).toHaveURL(/cart\.html/);

      const cartSummaries = await cartPage.getCartSummaries(ITEMS_TO_PURCHASE);

      expect(cartSummaries).toHaveLength(ITEMS_TO_PURCHASE);
      const toKey = (entry: { name: string; price: string }) => `${entry.name}|${entry.price}`;
      expect(cartSummaries.map(toKey).sort()).toEqual(addedItems.map(toKey).sort());
      for (const summary of cartSummaries) {
        expect(summary.quantity).toBe('1');
      }
    });

    await test.step('Complete the checkout form', async () => {
      await cartPage.checkout();
      await expect(page).toHaveURL(/checkout-step-one\.html/);
      await checkoutInfoPage.fillInfo();
      await checkoutInfoPage.continueToOverview();
      await expect(page).toHaveURL(/checkout-step-two\.html/);
    });

    await test.step('Complete the purchase and verify the confirmation message', async () => {
      await checkoutOverviewPage.finish();
      await expect(page).toHaveURL(/checkout-complete\.html/);
      await expect(checkoutCompletePage.completeHeader).toHaveText('Thank you for your order!');
    });
  });
});
