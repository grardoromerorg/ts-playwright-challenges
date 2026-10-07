import { type Locator, type Page } from '@playwright/test';
import { faker } from '@faker-js/faker';

export interface CheckoutInfo {
  firstName: string;
  lastName: string;
  postalCode: string;
}

export class CheckoutInfoPage {
  readonly page: Page;
  readonly firstNameInput: Locator;
  readonly lastNameInput: Locator;
  readonly postalCodeInput: Locator;
  readonly continueButton: Locator;
  readonly cancelButton: Locator;
  readonly errorMessage: Locator;

  constructor(page: Page) {
    this.page = page;
    this.firstNameInput = page.locator('[data-test="firstName"]');
    this.lastNameInput = page.locator('[data-test="lastName"]');
    this.postalCodeInput = page.locator('[data-test="postalCode"]');
    this.continueButton = page.locator('[data-test="continue"]');
    this.cancelButton = page.locator('[data-test="cancel"]');
    this.errorMessage = page.locator('[data-test="error"]');
  }

  async fillInfo(overrides: Partial<CheckoutInfo> = {}): Promise<CheckoutInfo> {
    const info: CheckoutInfo = {
      firstName: overrides.firstName ?? faker.person.firstName(),
      lastName: overrides.lastName ?? faker.person.lastName(),
      postalCode: overrides.postalCode ?? faker.location.zipCode(),
    };

    await this.firstNameInput.pressSequentially(info.firstName, { delay: 100 });
    await this.lastNameInput.pressSequentially(info.lastName, { delay: 100 });
    await this.postalCodeInput.pressSequentially(info.postalCode, { delay: 100 });

    return info;
  }

  async continueToOverview() {
    await this.continueButton.click();
  }
}
