import { test as base } from '@playwright/test';

export interface SauceDemoCredentials {
  username: string;
  password: string;
}

export interface BookingApiCredentials {
  username: string;
  password: string;
}

interface CredentialFixtures {
  sauceDemoCredentials: SauceDemoCredentials;
  bookingApiCredentials: BookingApiCredentials;
}

export const test = base.extend<CredentialFixtures>({
  sauceDemoCredentials: async ({}, use) => {
    await use({ username: 'standard_user', password: 'secret_sauce' });
  },

  bookingApiCredentials: async ({}, use) => {
    await use({ username: 'admin', password: 'password123' });
  },
});

export { expect } from '@playwright/test';
