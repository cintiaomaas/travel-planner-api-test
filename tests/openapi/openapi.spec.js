const { test, expect } = require('@playwright/test');

const BASE_URL = process.env.API_BASE_URL || 'http://localhost:3000';

test.describe('OpenAPI', () => {
  test('GET /api/openapi deve retornar a especificação OpenAPI', async ({ request }) => {
    const response = await request.get(`${BASE_URL}/api/openapi`);
    expect(response.status()).toBe(200);
    const body = await response.json();
    expect(body.openapi).toBeTruthy();
    expect(body.paths).toBeTruthy();
    expect(body.paths['/api/currency']).toBeTruthy();
  });
});
