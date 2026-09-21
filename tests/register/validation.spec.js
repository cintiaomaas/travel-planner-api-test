const { test, expect } = require('@playwright/test');
const { createAccount, cleanupAccount } = require('../helpers/api');
const BASE_URL = process.env.API_BASE_URL || 'http://localhost:3000';

test.describe('Validações de cadastro', () => {
  test.afterEach(async ({ request }) => {
    await cleanupAccount(request);
  });

  test('POST /api/register deve rejeitar nome ausente', async ({ request }) => {
    const response = await request.post(`${BASE_URL}/api/register`, {
      data: {
        email: 'qa-invalid@example.com',
        password: 'SenhaQA123!'
      }
    });
    expect(response.status()).toBe(400);
    const body = await response.json();
    expect(body.error.code).toEqual(expect.any(String));
    expect(body.error.message).toEqual(expect.any(String));
  });

  test('POST /api/register deve rejeitar e-mail ausente', async ({ request }) => {
    const response = await request.post(`${BASE_URL}/api/register`, {
      data: {
        name: 'Viajante QA',
        password: 'SenhaQA123!'
      }
    });
    expect(response.status()).toBe(400);
    const body = await response.json();
    expect(body.error.code).toEqual(expect.any(String));
    expect(body.error.message).toEqual(expect.any(String));
  });

  test('POST /api/register deve rejeitar senha ausente', async ({ request }) => {
    const response = await request.post(`${BASE_URL}/api/register`, {
      data: {
        name: 'Viajante QA',
        email: 'qa-invalid@example.com'
      }
    });
    expect(response.status()).toBe(400);
    const body = await response.json();
    expect(body.error.code).toEqual(expect.any(String));
    expect(body.error.message).toEqual(expect.any(String));
  });

  test('POST /api/register deve rejeitar nome com menos de 2 caracteres', async ({ request }) => {
    const response = await request.post(`${BASE_URL}/api/register`, {
      data: {
        name: 'A',
        email: 'qa-invalid@example.com',
        password: 'SenhaQA123!'
      }
    });
    expect(response.status()).toBe(400);
    const body = await response.json();
    expect(body.error.code).toEqual(expect.any(String));
    expect(body.error.message).toEqual(expect.any(String));
  });

  test('POST /api/register deve rejeitar nome com mais de 100 caracteres', async ({ request }) => {
    const response = await request.post(`${BASE_URL}/api/register`, {
      data: {
        name: 'A'.repeat(101),
        email: 'qa-invalid@example.com',
        password: 'SenhaQA123!'
      }
    });
    expect(response.status()).toBe(400);
    const body = await response.json();
    expect(body.error.code).toEqual(expect.any(String));
    expect(body.error.message).toEqual(expect.any(String));
  });

  test('POST /api/register deve rejeitar nome numérico', async ({ request }) => {
    const response = await request.post(`${BASE_URL}/api/register`, {
      data: {
        name: 123,
        email: 'qa-invalid@example.com',
        password: 'SenhaQA123!'
      }
    });
    expect(response.status()).toBe(400);
    const body = await response.json();
    expect(body.error.code).toEqual(expect.any(String));
    expect(body.error.message).toEqual(expect.any(String));
  });

  test('POST /api/register deve rejeitar e-mail inválido', async ({ request }) => {
    const response = await request.post(`${BASE_URL}/api/register`, {
      data: {
        name: 'Viajante QA',
        email: 'inválido',
        password: 'SenhaQA123!'
      }
    });
    expect(response.status()).toBe(400);
    const body = await response.json();
    expect(body.error.code).toEqual(expect.any(String));
    expect(body.error.message).toEqual(expect.any(String));
  });

  test('POST /api/register deve rejeitar e-mail com mais de 254 caracteres', async ({ request }) => {
    const response = await request.post(`${BASE_URL}/api/register`, {
      data: {
        name: 'Viajante QA',
        email: 'a'.repeat(243) + '@example.com',
        password: 'SenhaQA123!'
      }
    });
    expect(response.status()).toBe(400);
    const body = await response.json();
    expect(body.error.code).toEqual(expect.any(String));
    expect(body.error.message).toEqual(expect.any(String));
  });

  test('POST /api/register deve rejeitar e-mail numérico', async ({ request }) => {
    const response = await request.post(`${BASE_URL}/api/register`, {
      data: {
        name: 'Viajante QA',
        email: 123,
        password: 'SenhaQA123!'
      }
    });
    expect(response.status()).toBe(400);
    const body = await response.json();
    expect(body.error.code).toEqual(expect.any(String));
    expect(body.error.message).toEqual(expect.any(String));
  });

  test('POST /api/register deve rejeitar senha com menos de 8 caracteres', async ({ request }) => {
    const response = await request.post(`${BASE_URL}/api/register`, {
      data: {
        name: 'Viajante QA',
        email: 'qa-invalid@example.com',
        password: 'a'.repeat(7)
      }
    });
    expect(response.status()).toBe(400);
    const body = await response.json();
    expect(body.error.code).toEqual(expect.any(String));
    expect(body.error.message).toEqual(expect.any(String));
  });

  test('POST /api/register deve rejeitar senha com mais de 128 caracteres', async ({ request }) => {
    const response = await request.post(`${BASE_URL}/api/register`, {
      data: {
        name: 'Viajante QA',
        email: 'qa-invalid@example.com',
        password: 'a'.repeat(129)
      }
    });
    expect(response.status()).toBe(400);
    const body = await response.json();
    expect(body.error.code).toEqual(expect.any(String));
    expect(body.error.message).toEqual(expect.any(String));
  });

  test('POST /api/register deve rejeitar senha numérica', async ({ request }) => {
    const response = await request.post(`${BASE_URL}/api/register`, {
      data: {
        name: 'Viajante QA',
        email: 'qa-invalid@example.com',
        password: 123
      }
    });
    expect(response.status()).toBe(400);
    const body = await response.json();
    expect(body.error.code).toEqual(expect.any(String));
    expect(body.error.message).toEqual(expect.any(String));
  });

  test('cria conta e rejeita e-mail duplicado', async ({ request }) => {
    const account = await createAccount(request);
    const response = await request.post(`${BASE_URL}/api/register`, {
      data: {
        name: account.name,
        email: account.email,
        password: account.password
      }
    });
    expect(response.status()).toBe(409);
    const body = await response.json();
    expect(body.error.code).toEqual(expect.any(String));
    expect(body.error.message).toEqual(expect.any(String));
  });
});
