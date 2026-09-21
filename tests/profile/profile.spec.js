const { test, expect } = require('@playwright/test');
const { createAccount, login, deleteAccount, cleanupAccount } = require('../helpers/api');
const BASE_URL = process.env.API_BASE_URL || 'http://localhost:3000';

test.describe('Exclusão de conta', () => {
  test.afterEach(async ({ request }) => {
    await cleanupAccount(request);
  });

  test('DELETE /api/profile deve exigir autenticação', async ({ request }) => {
    const response = await request.delete(`${BASE_URL}/api/profile`);
    expect(response.status()).toBe(401);
    const body = await response.json();
    expect(body.error.code).toBe('UNAUTHORIZED');
    expect(body.error.message).toEqual(expect.any(String));
  });

  test('DELETE /api/profile deve excluir a conta e rejeitar a sessão antiga', async ({ request, playwright }) => {
    const account = await createAccount(request);
    await login(request, account);
    const oldSession = await playwright.request.newContext({
      storageState: await request.storageState()
    });
    try {
      await deleteAccount(request);

      const response = await oldSession.delete(`${BASE_URL}/api/profile`);
      expect(response.status()).toBe(401);
      const body = await response.json();
      expect(body.error.code).toBe('UNAUTHORIZED');
      expect(body.error.message).toEqual(expect.any(String));

      const planner = await oldSession.get(`${BASE_URL}/api/planner`);
      expect(planner.status()).toBe(401);
      expect((await planner.json()).error.code).toBe('UNAUTHORIZED');
    } finally {
      await oldSession.dispose();
    }
  });
});
