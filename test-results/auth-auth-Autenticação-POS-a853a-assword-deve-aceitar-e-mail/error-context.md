# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: auth\auth.spec.js >> Autenticação >> POST /api/auth/forgot-password deve aceitar e-mail
- Location: tests\auth\auth.spec.js:13:3

# Error details

```
Error: expect(received).toBeTruthy()

Received: undefined
```

# Test source

```ts
  1  | const { test, expect } = require('@playwright/test');
  2  | 
  3  | const BASE_URL = process.env.API_BASE_URL || 'http://localhost:3000';
  4  | 
  5  | test.describe('Autenticação', () => {
  6  |   test('GET /api/auth/providers deve retornar provedores', async ({ request }) => {
  7  |     const response = await request.get(`${BASE_URL}/api/auth/providers`);
  8  |     expect(response.status()).toBe(200);
  9  |     const body = await response.json();
  10 |     expect(typeof body).toBe('object');
  11 |   });
  12 | 
  13 |   test('POST /api/auth/forgot-password deve aceitar e-mail', async ({ request }) => {
  14 |     const response = await request.post(`${BASE_URL}/api/auth/forgot-password`, {
  15 |       data: {
  16 |         email: 'teste+playwright@example.com'
  17 |       }
  18 |     });
  19 |     expect(response.status()).toBe(200);
  20 |     const body = await response.json();
> 21 |     expect(body.message).toBeTruthy();
     |                          ^ Error: expect(received).toBeTruthy()
  22 |   });
  23 | });
  24 | 
```