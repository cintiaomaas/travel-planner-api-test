const { test, expect } = require('@playwright/test');
const BASE_URL = process.env.API_BASE_URL || 'http://localhost:3000';

test.describe('Validações de câmbio', () => {
  test('conversão local BRL', async ({ request }) => {
    const response = await request.get(`${BASE_URL}/api/currency`, {
      params: {
        from: 'BRL',
        to: 'BRL',
        amount: 100
      }
    });
    expect(response.status()).toBe(200);
    expect(response.headers()['content-type']).toContain('application/json');
    const { data } = await response.json();
    expect(data).toMatchObject({
      from: 'BRL',
      to: 'BRL',
      amount: 100,
      rate: 1,
      convertedAmount: 100,
      source: 'identity'
    });
    expect(data.quotationDate).toMatch(/^\d{4}-\d{2}-\d{2}$/);
  });

  test('conversão local USD', async ({ request }) => {
    const response = await request.get(`${BASE_URL}/api/currency`, {
      params: {
        from: 'USD',
        to: 'USD',
        amount: 100
      }
    });
    expect(response.status()).toBe(200);
    expect(response.headers()['content-type']).toContain('application/json');
    const { data } = await response.json();
    expect(data).toMatchObject({
      from: 'USD',
      to: 'USD',
      amount: 100,
      rate: 1,
      convertedAmount: 100,
      source: 'identity'
    });
    expect(data.quotationDate).toMatch(/^\d{4}-\d{2}-\d{2}$/);
  });

  test('conversão local EUR', async ({ request }) => {
    const response = await request.get(`${BASE_URL}/api/currency`, {
      params: {
        from: 'EUR',
        to: 'EUR',
        amount: 100
      }
    });
    expect(response.status()).toBe(200);
    expect(response.headers()['content-type']).toContain('application/json');
    const { data } = await response.json();
    expect(data).toMatchObject({
      from: 'EUR',
      to: 'EUR',
      amount: 100,
      rate: 1,
      convertedAmount: 100,
      source: 'identity'
    });
    expect(data.quotationDate).toMatch(/^\d{4}-\d{2}-\d{2}$/);
  });

  test('conversão local ARS', async ({ request }) => {
    const response = await request.get(`${BASE_URL}/api/currency`, {
      params: {
        from: 'ARS',
        to: 'ARS',
        amount: 100
      }
    });
    expect(response.status()).toBe(200);
    expect(response.headers()['content-type']).toContain('application/json');
    const { data } = await response.json();
    expect(data).toMatchObject({
      from: 'ARS',
      to: 'ARS',
      amount: 100,
      rate: 1,
      convertedAmount: 100,
      source: 'identity'
    });
    expect(data.quotationDate).toMatch(/^\d{4}-\d{2}-\d{2}$/);
  });

  test('conversão local GBP', async ({ request }) => {
    const response = await request.get(`${BASE_URL}/api/currency`, {
      params: {
        from: 'GBP',
        to: 'GBP',
        amount: 100
      }
    });
    expect(response.status()).toBe(200);
    expect(response.headers()['content-type']).toContain('application/json');
    const { data } = await response.json();
    expect(data).toMatchObject({
      from: 'GBP',
      to: 'GBP',
      amount: 100,
      rate: 1,
      convertedAmount: 100,
      source: 'identity'
    });
    expect(data.quotationDate).toMatch(/^\d{4}-\d{2}-\d{2}$/);
  });

  test('conversão local CLP', async ({ request }) => {
    const response = await request.get(`${BASE_URL}/api/currency`, {
      params: {
        from: 'CLP',
        to: 'CLP',
        amount: 100
      }
    });
    expect(response.status()).toBe(200);
    expect(response.headers()['content-type']).toContain('application/json');
    const { data } = await response.json();
    expect(data).toMatchObject({
      from: 'CLP',
      to: 'CLP',
      amount: 100,
      rate: 1,
      convertedAmount: 100,
      source: 'identity'
    });
    expect(data.quotationDate).toMatch(/^\d{4}-\d{2}-\d{2}$/);
  });

  test('conversão local JPY', async ({ request }) => {
    const response = await request.get(`${BASE_URL}/api/currency`, {
      params: {
        from: 'JPY',
        to: 'JPY',
        amount: 100
      }
    });
    expect(response.status()).toBe(200);
    expect(response.headers()['content-type']).toContain('application/json');
    const { data } = await response.json();
    expect(data).toMatchObject({
      from: 'JPY',
      to: 'JPY',
      amount: 100,
      rate: 1,
      convertedAmount: 100,
      source: 'identity'
    });
    expect(data.quotationDate).toMatch(/^\d{4}-\d{2}-\d{2}$/);
  });

  test('conversão local CAD', async ({ request }) => {
    const response = await request.get(`${BASE_URL}/api/currency`, {
      params: {
        from: 'CAD',
        to: 'CAD',
        amount: 100
      }
    });
    expect(response.status()).toBe(200);
    expect(response.headers()['content-type']).toContain('application/json');
    const { data } = await response.json();
    expect(data).toMatchObject({
      from: 'CAD',
      to: 'CAD',
      amount: 100,
      rate: 1,
      convertedAmount: 100,
      source: 'identity'
    });
    expect(data.quotationDate).toMatch(/^\d{4}-\d{2}-\d{2}$/);
  });

  test('conversão local AUD', async ({ request }) => {
    const response = await request.get(`${BASE_URL}/api/currency`, {
      params: {
        from: 'AUD',
        to: 'AUD',
        amount: 100
      }
    });
    expect(response.status()).toBe(200);
    expect(response.headers()['content-type']).toContain('application/json');
    const { data } = await response.json();
    expect(data).toMatchObject({
      from: 'AUD',
      to: 'AUD',
      amount: 100,
      rate: 1,
      convertedAmount: 100,
      source: 'identity'
    });
    expect(data.quotationDate).toMatch(/^\d{4}-\d{2}-\d{2}$/);
  });

  test('conversão local CHF', async ({ request }) => {
    const response = await request.get(`${BASE_URL}/api/currency`, {
      params: {
        from: 'CHF',
        to: 'CHF',
        amount: 100
      }
    });
    expect(response.status()).toBe(200);
    expect(response.headers()['content-type']).toContain('application/json');
    const { data } = await response.json();
    expect(data).toMatchObject({
      from: 'CHF',
      to: 'CHF',
      amount: 100,
      rate: 1,
      convertedAmount: 100,
      source: 'identity'
    });
    expect(data.quotationDate).toMatch(/^\d{4}-\d{2}-\d{2}$/);
  });

  test('conversão local MXN', async ({ request }) => {
    const response = await request.get(`${BASE_URL}/api/currency`, {
      params: {
        from: 'MXN',
        to: 'MXN',
        amount: 100
      }
    });
    expect(response.status()).toBe(200);
    expect(response.headers()['content-type']).toContain('application/json');
    const { data } = await response.json();
    expect(data).toMatchObject({
      from: 'MXN',
      to: 'MXN',
      amount: 100,
      rate: 1,
      convertedAmount: 100,
      source: 'identity'
    });
    expect(data.quotationDate).toMatch(/^\d{4}-\d{2}-\d{2}$/);
  });

  test('conversão local UYU', async ({ request }) => {
    const response = await request.get(`${BASE_URL}/api/currency`, {
      params: {
        from: 'UYU',
        to: 'UYU',
        amount: 100
      }
    });
    expect(response.status()).toBe(200);
    expect(response.headers()['content-type']).toContain('application/json');
    const { data } = await response.json();
    expect(data).toMatchObject({
      from: 'UYU',
      to: 'UYU',
      amount: 100,
      rate: 1,
      convertedAmount: 100,
      source: 'identity'
    });
    expect(data.quotationDate).toMatch(/^\d{4}-\d{2}-\d{2}$/);
  });

  test('padrões amount=1 e to=BRL', async ({ request }) => {
    const response = await request.get(`${BASE_URL}/api/currency`, {
      params: {
        from: 'BRL'
      }
    });
    expect(response.status()).toBe(200);
    expect(response.headers()['content-type']).toContain('application/json');
    const { data } = await response.json();
    expect(data).toMatchObject({
      amount: 1,
      from: 'BRL',
      to: 'BRL',
      rate: 1,
      convertedAmount: 1,
      source: 'identity'
    });
  });

  test('aceita amount=0.01', async ({ request }) => {
    const response = await request.get(`${BASE_URL}/api/currency`, {
      params: {
        from: 'BRL',
        to: 'BRL',
        amount: 0.01
      }
    });
    expect(response.status()).toBe(200);
    expect(response.headers()['content-type']).toContain('application/json');
    const { data } = await response.json();
    expect(data.convertedAmount).toBe(0.01);
  });

  test('aceita amount=1000000000', async ({ request }) => {
    const response = await request.get(`${BASE_URL}/api/currency`, {
      params: {
        from: 'BRL',
        to: 'BRL',
        amount: 1000000000
      }
    });
    expect(response.status()).toBe(200);
    expect(response.headers()['content-type']).toContain('application/json');
    const { data } = await response.json();
    expect(data.convertedAmount).toBe(1000000000);
  });

  test('câmbio rejeita origem ausente', async ({ request }) => {
    const response = await request.get(`${BASE_URL}/api/currency`, {
      params: {
        to: 'BRL'
      }
    });
    expect(response.status()).toBe(400);
    const body = await response.json();
    expect(body.error.code).toEqual(expect.any(String));
    expect(body.error.message).toEqual(expect.any(String));
  });

  test('câmbio rejeita origem inválida', async ({ request }) => {
    const response = await request.get(`${BASE_URL}/api/currency`, {
      params: {
        from: 'XXX'
      }
    });
    expect(response.status()).toBe(400);
    const body = await response.json();
    expect(body.error.code).toEqual(expect.any(String));
    expect(body.error.message).toEqual(expect.any(String));
  });

  test('câmbio rejeita destino inválido', async ({ request }) => {
    const response = await request.get(`${BASE_URL}/api/currency`, {
      params: {
        from: 'BRL',
        to: 'XXX'
      }
    });
    expect(response.status()).toBe(400);
    const body = await response.json();
    expect(body.error.code).toEqual(expect.any(String));
    expect(body.error.message).toEqual(expect.any(String));
  });

  test('câmbio rejeita amount=0', async ({ request }) => {
    const response = await request.get(`${BASE_URL}/api/currency`, {
      params: {
        from: 'BRL',
        amount: 0
      }
    });
    expect(response.status()).toBe(400);
    const body = await response.json();
    expect(body.error.code).toEqual(expect.any(String));
    expect(body.error.message).toEqual(expect.any(String));
  });

  test('câmbio rejeita amount=-1', async ({ request }) => {
    const response = await request.get(`${BASE_URL}/api/currency`, {
      params: {
        from: 'BRL',
        amount: -1
      }
    });
    expect(response.status()).toBe(400);
    const body = await response.json();
    expect(body.error.code).toEqual(expect.any(String));
    expect(body.error.message).toEqual(expect.any(String));
  });

  test('câmbio rejeita amount=1000000001', async ({ request }) => {
    const response = await request.get(`${BASE_URL}/api/currency`, {
      params: {
        from: 'BRL',
        amount: 1000000001
      }
    });
    expect(response.status()).toBe(400);
    const body = await response.json();
    expect(body.error.code).toEqual(expect.any(String));
    expect(body.error.message).toEqual(expect.any(String));
  });

  test('câmbio rejeita amount=abc', async ({ request }) => {
    const response = await request.get(`${BASE_URL}/api/currency`, {
      params: {
        from: 'BRL',
        amount: 'abc'
      }
    });
    expect(response.status()).toBe(400);
    const body = await response.json();
    expect(body.error.code).toEqual(expect.any(String));
    expect(body.error.message).toEqual(expect.any(String));
  });

  test('câmbio rejeita manualRate=0', async ({ request }) => {
    const response = await request.get(`${BASE_URL}/api/currency`, {
      params: {
        from: 'EUR',
        manualRate: 0
      }
    });
    expect(response.status()).toBe(400);
    const body = await response.json();
    expect(body.error.code).toEqual(expect.any(String));
    expect(body.error.message).toEqual(expect.any(String));
  });

  test('câmbio rejeita manualRate=-1', async ({ request }) => {
    const response = await request.get(`${BASE_URL}/api/currency`, {
      params: {
        from: 'EUR',
        manualRate: -1
      }
    });
    expect(response.status()).toBe(400);
    const body = await response.json();
    expect(body.error.code).toEqual(expect.any(String));
    expect(body.error.message).toEqual(expect.any(String));
  });

  test('câmbio rejeita manualRate=1000001', async ({ request }) => {
    const response = await request.get(`${BASE_URL}/api/currency`, {
      params: {
        from: 'EUR',
        manualRate: 1000001
      }
    });
    expect(response.status()).toBe(400);
    const body = await response.json();
    expect(body.error.code).toEqual(expect.any(String));
    expect(body.error.message).toEqual(expect.any(String));
  });

  test('câmbio rejeita manualRate=abc', async ({ request }) => {
    const response = await request.get(`${BASE_URL}/api/currency`, {
      params: {
        from: 'EUR',
        manualRate: 'abc'
      }
    });
    expect(response.status()).toBe(400);
    const body = await response.json();
    expect(body.error.code).toEqual(expect.any(String));
    expect(body.error.message).toEqual(expect.any(String));
  });
});
