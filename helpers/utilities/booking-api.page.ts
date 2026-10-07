import { type APIRequestContext } from '@playwright/test';
import { faker } from '@faker-js/faker';

export interface BookingDates {
  checkin: string;
  checkout: string;
}

export interface BookingData {
  firstname: string;
  lastname: string;
  totalprice: number;
  depositpaid: boolean;
  bookingdates: BookingDates;
  additionalneeds?: string;
}

function formatDate(date: Date): string {
  return date.toISOString().split('T')[0];
}

export class BookingApi {
  readonly request: APIRequestContext;
  readonly baseURL = 'https://restful-booker.herokuapp.com';

  constructor(request: APIRequestContext) {
    this.request = request;
  }

  static buildBookingData(overrides: Partial<BookingData> = {}): BookingData {
    const checkin = faker.date.soon({ days: 10 });

    return {
      firstname: faker.person.firstName(),
      lastname: faker.person.lastName(),
      totalprice: faker.number.int({ min: 50, max: 999 }),
      depositpaid: faker.datatype.boolean(),
      bookingdates: {
        checkin: formatDate(checkin),
        checkout: formatDate(faker.date.soon({ days: 20, refDate: checkin })),
      },
      additionalneeds: faker.helpers.arrayElement(['Breakfast', 'Lunch', 'Dinner', 'Late checkout']),
      ...overrides,
    };
  }

  static nextCheckoutDate(fromDate: string, days = 14): string {
    return formatDate(faker.date.soon({ days, refDate: new Date(fromDate) }));
  }

  async auth(username: string, password: string) {
    return this.request.post(`${this.baseURL}/auth`, {
      data: { username, password },
    });
  }

  async createBooking(data: BookingData) {
    return this.request.post(`${this.baseURL}/booking`, { data });
  }

  async getBooking(bookingId: number) {
    return this.request.get(`${this.baseURL}/booking/${bookingId}`);
  }

  async updateBooking(bookingId: number, data: BookingData, token: string) {
    return this.request.put(`${this.baseURL}/booking/${bookingId}`, {
      data,
      headers: { Cookie: `token=${token}` },
    });
  }

  async deleteBooking(bookingId: number, token: string) {
    return this.request.delete(`${this.baseURL}/booking/${bookingId}`, {
      headers: { Cookie: `token=${token}` },
    });
  }
}
