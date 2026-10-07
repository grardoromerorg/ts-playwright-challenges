import { test, expect } from '../../fixtures/credentials.fixture';
import { BookingApi, type BookingData } from '../../helpers/utilities/booking-api.page';

test.describe.serial('Booking lifecycle', () => {
  let bookingApi: BookingApi;
  let token: string;
  let bookingId: number;
  let bookingData: BookingData;

  test.beforeAll(async ({ playwright }) => {
    const request = await playwright.request.newContext();
    bookingApi = new BookingApi(request);
    bookingData = BookingApi.buildBookingData();
  });

  test.afterAll(async () => {
    await bookingApi.request.dispose();
  });

  test('1. Authentication - generates an auth token', async ({ bookingApiCredentials }) => {
    const response = await bookingApi.auth(
      bookingApiCredentials.username,
      bookingApiCredentials.password,
    );

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
        checkout: BookingApi.nextCheckoutDate(bookingData.bookingdates.checkin),
      },
    };

    const response = await bookingApi.updateBooking(bookingId, updatedBookingData, token);

    expect(response.ok()).toBeTruthy();
    const body = await response.json();
    expect(body).toMatchObject(updatedBookingData);

    bookingData = updatedBookingData;
  });

  test('5. Delete Booking - deletes the booking and confirms removal', async () => {
    const deleteResponse = await bookingApi.deleteBooking(bookingId, token);
    expect(deleteResponse.status()).toBe(201);

    const getResponse = await bookingApi.getBooking(bookingId);
    expect(getResponse.status()).toBe(404);
  });
});
