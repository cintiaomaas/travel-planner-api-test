const { test, expect } = require('@playwright/test');

const BASE_URL = process.env.API_BASE_URL || 'http://localhost:3000';

test.describe('Cadastro', () => {
  test('POST /api/register com dados inválidos deve retornar erro', async ({ request }) => {
    const response = await request.post(`${BASE_URL}/api/register`, {
      data: {}
    });
    expect(response.status()).toBe(400);
    expect((await response.json()).error).toEqual(expect.objectContaining({ code: expect.any(String), message: expect.any(String) }));
  });
});
