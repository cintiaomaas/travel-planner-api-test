const { test, expect } = require('@playwright/test');

const BASE_URL = process.env.API_BASE_URL || 'http://localhost:3000';

test.describe('Autenticação', () => {
  test('GET /api/auth/providers deve retornar provedores', async ({ request }) => {
    const response = await request.get(`${BASE_URL}/api/auth/providers`);
    expect(response.status()).toBe(200);
    const body = await response.json();
    expect(typeof body).toBe('object');
  });

  test('POST /api/auth/forgot-password deve aceitar e-mail', async ({ request }) => {
    const response = await request.post(`${BASE_URL}/api/auth/forgot-password`, {
      data: {
        email: 'teste+playwright@example.com'
      }
    });
    expect(response.status()).toBe(200);
    const body = await response.json();
    expect(body.message).toBeTruthy();
  });
});
