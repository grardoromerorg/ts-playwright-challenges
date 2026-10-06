import { test, expect } from '@playwright/test';
import { BookingApi, type BookingData } from '../../helpers/utilities/booking-api.page';

test.describe.serial('Booking lifecycle', () => {
  let bookingApi: BookingApi;
  let token: string;
  let bookingId: number;

  const bookingData: BookingData = {
    firstname: 'Jim',
    lastname: 'Brown',
    totalprice: 111,
    depositpaid: true,
    bookingdates: {
      checkin: '2026-01-01',
      checkout: '2026-01-05',
    },
    additionalneeds: 'Breakfast',
  };

  test.beforeAll(async ({ playwright }) => {
    const request = await playwright.request.newContext();
    bookingApi = new BookingApi(request);
  });

  test.afterAll(async () => {
    await bookingApi.request.dispose();
  });

  test('1. Authentication - generates an auth token', async () => {
    const response = await bookingApi.auth('admin', 'password123');

    expect(response.ok()).toBeTruthy();
    const body = await response.json();
    expect(body).toHaveProperty('token');

    token = body.token;
  });

  test('2. Create Booking - creates a booking and extracts the bookingid', async () => {
    const response = await bookingApi.createBooking(bookingData);

    expect(response.status()).toBe(200);
    const body = await response.json();
    expect(body).toHaveProperty('bookingid');
    expect(body.booking).toMatchObject(bookingData);

    bookingId = body.bookingid;
  });

  test('3. Read Booking - fetches the booking by id and validates the data', async () => {
    const response = await bookingApi.getBooking(bookingId);

    expect(response.ok()).toBeTruthy();
    const body = await response.json();
    expect(body).toMatchObject(bookingData);
  });

  test('4. Update Booking - updates the checkout date using the auth token', async () => {
    const updatedBookingData: BookingData = {
      ...bookingData,
      bookingdates: {
        ...bookingData.bookingdates,
        checkout: '2026-02-01',
      },
    };

    const response = await bookingApi.updateBooking(bookingId, updatedBookingData, token);

    expect(response.ok()).toBeTruthy();
    const body = await response.json();
    expect(body).toMatchObject(updatedBookingData);

    bookingData.bookingdates.checkout = updatedBookingData.bookingdates.checkout;
  });

  test('5. Delete Booking - deletes the booking and confirms removal', async () => {
    const deleteResponse = await bookingApi.deleteBooking(bookingId, token);
    expect(deleteResponse.status()).toBe(201);

    const getResponse = await bookingApi.getBooking(bookingId);
    expect(getResponse.status()).toBe(404);
  });
});
