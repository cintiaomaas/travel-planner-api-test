const { test, expect } = require('@playwright/test');
const { createAccount, login, csrf, cleanupAccount } = require('../helpers/api');
const BASE_URL = process.env.API_BASE_URL || 'http://localhost:3000';

test.describe('Fluxos de autenticação', () => {
  test.afterEach(async ({ request }) => {
    await cleanupAccount(request);
  });

  test('contrato completo dos provedores', async ({ request }) => {
    const response = await request.get(`${BASE_URL}/api/auth/providers`);
    expect(response.status()).toBe(200);
    expect(response.headers()['content-type']).toContain('application/json');
    const body = await response.json();
    expect(body).not.toBeNull();
    expect(Array.isArray(body)).toBe(false);
    expect(typeof body).toBe('object');
    expect(body.credentials).toMatchObject({
      id: 'credentials',
      name: expect.any(String),
      type: 'credentials',
      signinUrl: expect.any(String),
      callbackUrl: expect.any(String)
    });
    expect(new URL(body.credentials.signinUrl).protocol).toMatch(/^https?:$/);
    expect(new URL(body.credentials.callbackUrl).protocol).toMatch(/^https?:$/);
  });

  test('obtém CSRF e consulta/atualiza sessão anônima', async ({ request }) => {
    const response = await request.get(`${BASE_URL}/api/auth/session`);
    expect(response.status()).toBe(200);
    expect(response.headers()['content-type']).toContain('application/json');
    expect(await response.json()).toBeNull();
    const response2 = await request.post(`${BASE_URL}/api/auth/session`, {
      data: {
        csrfToken: await csrf(request),
        data: {}
      }
    });
    expect(response2.status()).toBe(200);
    expect(response2.headers()['content-type']).toContain('application/json');
    expect(await response2.json()).toBeNull();
  });

  test('recuperação rejeita e-mail ausente', async ({ request }) => {
    const response = await request.post(`${BASE_URL}/api/auth/forgot-password`, {
      data: {}
    });
    expect(response.status()).toBe(400);
    const body = await response.json();
    expect(body.error.code).toEqual(expect.any(String));
    expect(body.error.message).toEqual(expect.any(String));
  });

  test('recuperação rejeita e-mail inválido', async ({ request }) => {
    const response = await request.post(`${BASE_URL}/api/auth/forgot-password`, {
      data: {
        email: 'abc'
      }
    });
    expect(response.status()).toBe(400);
    const body = await response.json();
    expect(body.error.code).toEqual(expect.any(String));
    expect(body.error.message).toEqual(expect.any(String));
  });

  test('recuperação rejeita e-mail longo', async ({ request }) => {
    const response = await request.post(`${BASE_URL}/api/auth/forgot-password`, {
      data: {
        email: 'a'.repeat(243) + '@example.com'
      }
    });
    expect(response.status()).toBe(400);
    const body = await response.json();
    expect(body.error.code).toEqual(expect.any(String));
    expect(body.error.message).toEqual(expect.any(String));
  });

  test('recuperação rejeita e-mail tipo incorreto', async ({ request }) => {
    const response = await request.post(`${BASE_URL}/api/auth/forgot-password`, {
      data: {
        email: 123
      }
    });
    expect(response.status()).toBe(400);
    const body = await response.json();
    expect(body.error.code).toEqual(expect.any(String));
    expect(body.error.message).toEqual(expect.any(String));
  });

  test('redefinição rejeita corpo vazio', async ({ request }) => {
    const response = await request.post(`${BASE_URL}/api/auth/reset-password`, {
      data: {}
    });
    expect(response.status()).toBe(400);
    const body = await response.json();
    expect(body.error.code).toEqual(expect.any(String));
    expect(body.error.message).toEqual(expect.any(String));
  });

  test('redefinição rejeita sem senha', async ({ request }) => {
    const response = await request.post(`${BASE_URL}/api/auth/reset-password`, {
      data: {
        token: 'a'.repeat(43)
      }
    });
    expect(response.status()).toBe(400);
    const body = await response.json();
    expect(body.error.code).toEqual(expect.any(String));
    expect(body.error.message).toEqual(expect.any(String));
  });

  test('redefinição rejeita sem token', async ({ request }) => {
    const response = await request.post(`${BASE_URL}/api/auth/reset-password`, {
      data: {
        password: 'SenhaQA123!'
      }
    });
    expect(response.status()).toBe(400);
    const body = await response.json();
    expect(body.error.code).toEqual(expect.any(String));
    expect(body.error.message).toEqual(expect.any(String));
  });

  test('redefinição rejeita token 42/a', async ({ request }) => {
    const response = await request.post(`${BASE_URL}/api/auth/reset-password`, {
      data: {
        token: 'a'.repeat(42),
        password: 'SenhaQA123!'
      }
    });
    expect(response.status()).toBe(400);
    const body = await response.json();
    expect(body.error.code).toEqual(expect.any(String));
    expect(body.error.message).toEqual(expect.any(String));
  });

  test('redefinição rejeita token 44/a', async ({ request }) => {
    const response = await request.post(`${BASE_URL}/api/auth/reset-password`, {
      data: {
        token: 'a'.repeat(44),
        password: 'SenhaQA123!'
      }
    });
    expect(response.status()).toBe(400);
    const body = await response.json();
    expect(body.error.code).toEqual(expect.any(String));
    expect(body.error.message).toEqual(expect.any(String));
  });

  test('redefinição rejeita token 64/a', async ({ request }) => {
    const response = await request.post(`${BASE_URL}/api/auth/reset-password`, {
      data: {
        token: 'a'.repeat(64),
        password: 'SenhaQA123!'
      }
    });
    expect(response.status()).toBe(400);
    const body = await response.json();
    expect(body.error.code).toEqual(expect.any(String));
    expect(body.error.message).toEqual(expect.any(String));
  });

  test('redefinição rejeita token 43/!', async ({ request }) => {
    const response = await request.post(`${BASE_URL}/api/auth/reset-password`, {
      data: {
        token: '!'.repeat(43),
        password: 'SenhaQA123!'
      }
    });
    expect(response.status()).toBe(400);
    const body = await response.json();
    expect(body.error.code).toEqual(expect.any(String));
    expect(body.error.message).toEqual(expect.any(String));
  });

  test('redefinição rejeita senha 7', async ({ request }) => {
    const response = await request.post(`${BASE_URL}/api/auth/reset-password`, {
      data: {
        token: 'a'.repeat(43),
        password: 'a'.repeat(7)
      }
    });
    expect(response.status()).toBe(400);
    const body = await response.json();
    expect(body.error.code).toEqual(expect.any(String));
    expect(body.error.message).toEqual(expect.any(String));
  });

  test('redefinição rejeita senha 129', async ({ request }) => {
    const response = await request.post(`${BASE_URL}/api/auth/reset-password`, {
      data: {
        token: 'a'.repeat(43),
        password: 'a'.repeat(129)
      }
    });
    expect(response.status()).toBe(400);
    const body = await response.json();
    expect(body.error.code).toEqual(expect.any(String));
    expect(body.error.message).toEqual(expect.any(String));
  });

  test('redefinição rejeita token inexistente', async ({ request }) => {
    const response = await request.post(`${BASE_URL}/api/auth/reset-password`, {
      data: {
        token: 'a'.repeat(43),
        password: 'SenhaQA123!'
      }
    });
    expect(response.status()).toBe(400);
    const body = await response.json();
    expect(body.error.code).toEqual(expect.any(String));
    expect(body.error.message).toEqual(expect.any(String));
  });

  test('login inválido JSON', async ({ request }) => {
    const response = await request.post(`${BASE_URL}/api/auth/callback/credentials`, {
      form: {
        email: 'qa-nonexistent@example.com',
        password: 'SenhaIncorreta123!',
        csrfToken: await csrf(request)
      },
      headers: {
        'X-Auth-Return-Redirect': '1'
      },
      maxRedirects: 0
    });
    expect(response.status()).toBe(200);
    const body = await response.json();
    const destination = body.url;
    expect(typeof destination).toBe('string');
    expect(new URL(destination, `${BASE_URL}/`).searchParams.has('error')).toBe(true);
    const response3 = await request.get(`${BASE_URL}/api/auth/session`);
    expect(response3.status()).toBe(200);
    expect(response3.headers()['content-type']).toContain('application/json');
    expect(await response3.json()).toBeNull();
  });

  test('login, atualização e logout JSON', async ({ request }) => {
    const account = await createAccount(request);
    await login(request, account);
    const response = await request.post(`${BASE_URL}/api/auth/session`, {
      data: {
        csrfToken: await csrf(request),
        data: {}
      }
    });
    expect(response.status()).toBe(200);
    expect(response.headers()['content-type']).toContain('application/json');
    const session = await response.json();
    expect(session.user).toMatchObject({
      id: account.id,
      email: account.email
    });
    expect(Number.isNaN(Date.parse(session.expires))).toBe(false);
    const response2 = await request.post(`${BASE_URL}/api/auth/signout`, {
      form: {
        csrfToken: await csrf(request),
        callbackUrl: '/'
      },
      headers: {
        'X-Auth-Return-Redirect': '1'
      },
      maxRedirects: 0
    });
    expect(response2.status()).toBe(200);
    const body = await response2.json();
    expect(body.url).toEqual(expect.any(String));
    const response4 = await request.get(`${BASE_URL}/api/auth/session`);
    expect(response4.status()).toBe(200);
    expect(response4.headers()['content-type']).toContain('application/json');
    expect(await response4.json()).toBeNull();
  });

  test('login inválido 302', async ({ request }) => {
    const response = await request.post(`${BASE_URL}/api/auth/callback/credentials`, {
      form: {
        email: 'qa-nonexistent@example.com',
        password: 'SenhaIncorreta123!',
        csrfToken: await csrf(request)
      },
      headers: {},
      maxRedirects: 0
    });
    expect(response.status()).toBe(302);
    const destination = response.headers().location;
    expect(typeof destination).toBe('string');
    expect(new URL(destination, `${BASE_URL}/`).searchParams.has('error')).toBe(true);
    const response2 = await request.get(`${BASE_URL}/api/auth/session`);
    expect(response2.status()).toBe(200);
    expect(response2.headers()['content-type']).toContain('application/json');
    expect(await response2.json()).toBeNull();
  });

  test('login, atualização e logout 302', async ({ request }) => {
    const account = await createAccount(request);
    await login(request, account);
    const response = await request.post(`${BASE_URL}/api/auth/session`, {
      data: {
        csrfToken: await csrf(request),
        data: {}
      }
    });
    expect(response.status()).toBe(200);
    expect(response.headers()['content-type']).toContain('application/json');
    const session = await response.json();
    expect(session.user).toMatchObject({
      id: account.id,
      email: account.email
    });
    expect(Number.isNaN(Date.parse(session.expires))).toBe(false);
    const response2 = await request.post(`${BASE_URL}/api/auth/signout`, {
      form: {
        csrfToken: await csrf(request),
        callbackUrl: '/'
      },
      headers: {},
      maxRedirects: 0
    });
    expect(response2.status()).toBe(302);
    expect(response2.headers().location).toBeTruthy();
    const response3 = await request.get(`${BASE_URL}/api/auth/session`);
    expect(response3.status()).toBe(200);
    expect(response3.headers()['content-type']).toContain('application/json');
    expect(await response3.json()).toBeNull();
  });
});
