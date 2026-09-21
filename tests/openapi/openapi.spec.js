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
    expect(body.openapi).toBe('3.1.0');
    expect(body.info).toEqual(expect.objectContaining({ title: expect.any(String), version: expect.any(String) }));
    expect(body.paths['/api/profile'].delete.operationId).toBe('deleteProfile');
    expect(body.paths['/api/profile'].delete.security).toEqual([{ sessionCookie: [] }]);
    expect(body.paths['/api/profile'].delete).not.toHaveProperty('requestBody');
    expect(body.paths['/api/profile'].delete.responses).toHaveProperty('204');
    expect(body.paths['/api/profile'].delete.responses).toHaveProperty('401');
    expect(body.paths['/api/profile'].delete.responses).toHaveProperty('404');
    expect(body.paths['/api/profile'].delete.responses).toHaveProperty('500');

    expect(body.paths['/api/planner'].get.operationId).toBe('getPlannerState');
    expect(body.paths['/api/planner'].get.responses).toHaveProperty('200');
    expect(body.paths['/api/planner'].get.responses).toHaveProperty('401');
    expect(body.paths['/api/planner'].get.responses).toHaveProperty('500');
    expect(body.paths['/api/planner'].get.responses).toHaveProperty('503');

    expect(body.paths['/api/planner'].put.operationId).toBe('updatePlannerState');
    expect(body.paths['/api/planner'].put.responses).toHaveProperty('200');
    expect(body.paths['/api/planner'].put.responses).toHaveProperty('400');
    expect(body.paths['/api/planner'].put.responses).toHaveProperty('401');
    expect(body.paths['/api/planner'].put.responses).toHaveProperty('500');

    expect(body.paths['/api/planner/covers/{key}'].get.operationId).toBe('getPlannerCover');
    expect(body.paths['/api/planner/covers/{key}'].get.responses).toHaveProperty('200');
    expect(body.paths['/api/planner/covers/{key}'].get.responses).toHaveProperty('304');
    expect(body.paths['/api/planner/covers/{key}'].get.responses).toHaveProperty('401');
    expect(body.paths['/api/planner/covers/{key}'].get.responses).toHaveProperty('404');

    expect(body.paths['/api/openapi'].get.operationId).toBe('getOpenApiDocument');
    expect(body.paths['/api/openapi'].get.responses).toHaveProperty('200');

    expect(body.paths['/api/currency'].get.operationId).toBe('convertCurrency');
    expect(body.paths['/api/currency'].get.responses).toHaveProperty('200');
    expect(body.paths['/api/currency'].get.responses).toHaveProperty('400');
    expect(body.paths['/api/currency'].get.responses).toHaveProperty('500');
    expect(body.paths['/api/currency'].get.responses).toHaveProperty('503');

    expect(body.paths['/api/auth/providers'].get.operationId).toBe('listAuthProviders');
    expect(body.paths['/api/auth/providers'].get.responses).toHaveProperty('200');

    expect(body.paths['/api/auth/forgot-password'].post.operationId).toBe('requestPasswordReset');
    expect(body.paths['/api/auth/forgot-password'].post.responses).toHaveProperty('200');
    expect(body.paths['/api/auth/forgot-password'].post.responses).toHaveProperty('400');

    expect(body.paths['/api/auth/reset-password'].post.operationId).toBe('resetPassword');
    expect(body.paths['/api/auth/reset-password'].post.responses).toHaveProperty('200');
    expect(body.paths['/api/auth/reset-password'].post.responses).toHaveProperty('400');

    expect(body.paths['/api/register'].post.operationId).toBe('registerUser');
    expect(body.paths['/api/register'].post.responses).toHaveProperty('201');
    expect(body.paths['/api/register'].post.responses).toHaveProperty('400');
    expect(body.paths['/api/register'].post.responses).toHaveProperty('409');
    expect(body.paths['/api/register'].post.responses).toHaveProperty('500');

    expect(body.paths['/api/auth/csrf'].get.operationId).toBe('getCsrfToken');
    expect(body.paths['/api/auth/csrf'].get.responses).toHaveProperty('200');

    expect(body.paths['/api/auth/session'].get.operationId).toBe('getSession');
    expect(body.paths['/api/auth/session'].get.responses).toHaveProperty('200');

    expect(body.paths['/api/auth/session'].post.operationId).toBe('updateSession');
    expect(body.paths['/api/auth/session'].post.responses).toHaveProperty('200');

    expect(body.paths['/api/auth/callback/credentials'].post.operationId).toBe('signInWithCredentials');
    expect(body.paths['/api/auth/callback/credentials'].post.responses).toHaveProperty('200');
    expect(body.paths['/api/auth/callback/credentials'].post.responses).toHaveProperty('302');

    expect(body.paths['/api/auth/signout'].post.operationId).toBe('signOut');
    expect(body.paths['/api/auth/signout'].post.responses).toHaveProperty('200');
    expect(body.paths['/api/auth/signout'].post.responses).toHaveProperty('302');

  });
});
