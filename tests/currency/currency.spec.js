const { test, expect } = require('@playwright/test');

const BASE_URL = process.env.API_BASE_URL || 'http://localhost:3000';

test.describe('Câmbio', () => {
  test('GET /api/currency deve converter EUR para BRL', async ({ request }) => {
    const response = await request.get(`${BASE_URL}/api/currency?from=EUR&to=BRL&amount=100`);
    expect(response.status()).toBe(200);
    const body = await response.json();
    expect(body.data).toBeTruthy();
    expect(body.data.from).toBe('EUR');
    expect(body.data.to).toBe('BRL');
    expect(body.data.amount).toBe(100);
    expect(typeof body.data.convertedAmount).toBe('number');
  });
});
