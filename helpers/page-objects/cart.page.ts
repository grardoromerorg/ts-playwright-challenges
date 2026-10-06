import { expect, type Locator, type Page } from '@playwright/test';

export interface CartItemRow {
  name: string;
  quantity: string;
}

export class CartPage {
  readonly page: Page;
  readonly cartItems: Locator;
  readonly checkoutButton: Locator;
  readonly continueShoppingButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.cartItems = page.locator('[data-test="inventory-item"]');
    this.checkoutButton = page.locator('[data-test="checkout"]');
    this.continueShoppingButton = page.locator('[data-test="continue-shopping"]');
  }

  itemName(item: Locator): Locator {
    return item.locator('[data-test="inventory-item-name"]');
  }

  itemQuantity(item: Locator): Locator {
    return item.locator('[data-test="item-quantity"]');
  }

  /**
   * Reads name/quantity for every row in the cart. Pass `expectedCount` so this waits for the
   * SPA's render to settle instead of racing a `.count()` read taken mid-transition.
   */
  async getCartSummaries(expectedCount?: number): Promise<CartItemRow[]> {
    if (expectedCount !== undefined) {
      await expect(this.cartItems).toHaveCount(expectedCount);
    }

    const count = await this.cartItems.count();
    const summaries: CartItemRow[] = [];

    for (let i = 0; i < count; i++) {
      const item = this.cartItems.nth(i);
      summaries.push({
        name: (await this.itemName(item).textContent()) ?? '',
        quantity: (await this.itemQuantity(item).textContent()) ?? '',
      });
    }

    return summaries;
  }

  async checkout() {
    await this.checkoutButton.click();
  }
}
