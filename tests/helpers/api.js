const { expect } = require('@playwright/test');
const { randomUUID } = require('node:crypto');

const BASE_URL = process.env.API_BASE_URL || 'http://localhost:3000';

async function csrf(request) {
  const response = await request.get(BASE_URL + '/api/auth/csrf');
  expect(response.status()).toBe(200);
  const body = await response.json();
  expect(body.csrfToken).toEqual(expect.any(String));
  expect(body.csrfToken.length).toBeGreaterThan(0);
  return body.csrfToken;
}

const accounts = new WeakMap();
async function createAccount(request) {
  const account = {
    name: 'Viajante QA',
    email: 'qa-' + randomUUID() + '@example.com',
    password: 'Qa!' + randomUUID()
  };
  const response = await request.post(BASE_URL + '/api/register', { data: account });
  expect(response.status()).toBe(201);
  accounts.set(request, account);
  const body = await response.json();
  account.id = body.data.id;
  expect(body.data.id).toEqual(expect.any(String));
  expect(body.data.name).toBe(account.name);
  expect(body.data.email).toBe(account.email);
  expect(body.data).not.toHaveProperty('password');
  expect(body.data).not.toHaveProperty('passwordHash');
  return { ...account, id: body.data.id };
}

async function login(request, account) {
  const csrfToken = await csrf(request);
  const response = await request.post(BASE_URL + '/api/auth/callback/credentials', {
    headers: { 'X-Auth-Return-Redirect': '1' },
    form: { email: account.email, password: account.password, csrfToken, callbackUrl: '/' },
    maxRedirects: 0
  });
  expect(response.status()).toBe(200);
  const body = await response.json();
  expect(new URL(body.url, BASE_URL).searchParams.has('error')).toBe(false);

  const sessionResponse = await request.get(BASE_URL + '/api/auth/session');
  expect(sessionResponse.status()).toBe(200);
  const session = await sessionResponse.json();
  expect(session.user.id).toBe(account.id);
}

async function deleteAccount(request) {
  const response = await request.delete(BASE_URL + '/api/profile');
  expect(response.status()).toBe(204);
  accounts.delete(request);
  expect(await response.text()).toBe('');
}

async function cleanupAccount(request) {
  const account = accounts.get(request);
  if (!account) return;

  // O teste pode ter encerrado a sessão; autentica somente sua própria conta.
  await login(request, account);
  await deleteAccount(request);
}

module.exports = { createAccount, login, csrf, deleteAccount, cleanupAccount };
