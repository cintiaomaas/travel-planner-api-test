const { test, expect } = require('@playwright/test');

const BASE_URL = process.env.API_BASE_URL || 'http://localhost:3000';

test.describe('Cadastro', () => {
  test('POST /api/register com dados inválidos deve retornar erro', async ({ request }) => {
    const response = await request.post(`${BASE_URL}/api/register`, {
      data: {}
    });
    expect([400, 422]).toContain(response.status());
  });
});
