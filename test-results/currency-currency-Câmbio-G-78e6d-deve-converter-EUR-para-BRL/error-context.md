# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: currency\currency.spec.js >> Câmbio >> GET /api/currency deve converter EUR para BRL
- Location: tests\currency\currency.spec.js:6:3

# Error details

```
Error: expect(received).toBe(expected) // Object.is equality

Expected: 200
Received: 503
```

# Test source

```ts
  1  | const { test, expect } = require('@playwright/test');
  2  | 
  3  | const BASE_URL = process.env.API_BASE_URL || 'http://localhost:3000';
  4  | 
  5  | test.describe('Câmbio', () => {
  6  |   test('GET /api/currency deve converter EUR para BRL', async ({ request }) => {
  7  |     const response = await request.get(`${BASE_URL}/api/currency?from=EUR&to=BRL&amount=100`);
> 8  |     expect(response.status()).toBe(200);
     |                               ^ Error: expect(received).toBe(expected) // Object.is equality
  9  |     const body = await response.json();
  10 |     expect(body.data).toBeTruthy();
  11 |     expect(body.data.from).toBe('EUR');
  12 |     expect(body.data.to).toBe('BRL');
  13 |     expect(body.data.amount).toBe(100);
  14 |     expect(typeof body.data.convertedAmount).toBe('number');
  15 |   });
  16 | });
  17 | 
```