import { type APIRequestContext } from '@playwright/test';

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

export class BookingApi {
  readonly request: APIRequestContext;
  readonly baseURL = 'https://restful-booker.herokuapp.com';

  constructor(request: APIRequestContext) {
    this.request = request;
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
