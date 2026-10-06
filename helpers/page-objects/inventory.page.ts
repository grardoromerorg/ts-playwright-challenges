import { type Locator, type Page } from '@playwright/test';

export interface CartItemSummary {
  name: string;
  price: string;
}

export class InventoryPage {
  readonly page: Page;
  readonly inventoryItems: Locator;
  readonly cartLink: Locator;
  readonly cartBadge: Locator;

  constructor(page: Page) {
    this.page = page;
    this.inventoryItems = page.locator('[data-test="inventory-item"]');
    this.cartLink = page.locator('[data-test="shopping-cart-link"]');
    this.cartBadge = page.locator('[data-test="shopping-cart-badge"]');
  }

  itemName(item: Locator): Locator {
    return item.locator('[data-test="inventory-item-name"]');
  }

  itemPrice(item: Locator): Locator {
    return item.locator('[data-test="inventory-item-price"]');
  }

  itemAddToCartButton(item: Locator): Locator {
    return item.locator('button[data-test^="add-to-cart-"]');
  }

  /** Adds the first `count` distinct inventory items to the cart, picked dynamically from whatever is rendered. */
  async addItemsToCart(count: number): Promise<CartItemSummary[]> {
    const added: CartItemSummary[] = [];
    const total = await this.inventoryItems.count();

    for (let i = 0; i < Math.min(count, total); i++) {
      const item = this.inventoryItems.nth(i);
      const name = await this.itemName(item).textContent();
      const price = await this.itemPrice(item).textContent();
      await this.itemAddToCartButton(item).click();
      added.push({ name: name ?? '', price: price ?? '' });
    }

    return added;
  }

  async goToCart() {
    await this.cartLink.click();
  }
}
