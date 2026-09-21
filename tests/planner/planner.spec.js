const { test, expect } = require('@playwright/test');
const { createAccount, login, cleanupAccount } = require('../helpers/api');
const BASE_URL = process.env.API_BASE_URL || 'http://localhost:3000';

const empty = () => ({
  trips: [],
  activities: [],
  expenses: [],
  checklist: [],
  selectedTripId: '',
  tripInfo: {},
  timeline: {}
});
const trip = (id = 'trip-qa') => ({
  id,
  name: 'Viagem QA',
  destination: 'Lisboa',
  country: 'Portugal',
  startDate: '2026-10-10',
  endDate: '2026-10-20',
  dateLabel: 'Outubro',
  travelers: 1,
  budget: 1000,
  currency: 'BRL',
  status: 'Planejada',
  total: 0,
  paid: 0,
  daysRemaining: 10,
  coverImage: '',
  accent: 'blue'
});
const activity = () => ({
  id: 'activity-qa',
  tripId: 'trip-qa',
  name: 'Museu',
  date: '2026-10-15',
  category: 'passeio',
  status: 'planejado'
});
const state = () => ({
  ...empty(),
  trips: [trip()],
  activities: [activity()],
  selectedTripId: 'trip-qa'
});
async function save(request, data) {
  const response = await request.put(`${BASE_URL}/api/planner`, {
    data
  });
  expect(response.status()).toBe(200);
  expect(response.headers()['content-type']).toContain('application/json');
  const body = await response.json();
  expect(typeof body.data.updatedAt).toBe('string');
  expect(Number.isNaN(Date.parse(body.data.updatedAt))).toBe(false);
}
async function read(request, compact = false) {
  const response = await request.get(BASE_URL + `/api/planner${compact ? '?compact=1' : ''}`);
  expect(response.status()).toBe(200);
  expect(response.headers()['content-type']).toContain('application/json');
  const body = await response.json();
  expect(body).toHaveProperty('data');
  expect(body).toHaveProperty('updatedAt');
  return body;
}
test.describe('Planejamento', () => {
  test.afterEach(async ({ request }) => {
    await cleanupAccount(request);
  });

  test('planejamento exige autenticação no GET e PUT', async ({ request }) => {
    const response = await request.get(`${BASE_URL}/api/planner`);
    expect(response.status()).toBe(401);
    const body = await response.json();
    expect(body.error.code).toEqual(expect.any(String));
    expect(body.error.message).toEqual(expect.any(String));
    const response2 = await request.get(`${BASE_URL}/api/planner?compact=1`);
    expect(response2.status()).toBe(401);
    const body2 = await response2.json();
    expect(body2.error.code).toEqual(expect.any(String));
    expect(body2.error.message).toEqual(expect.any(String));
    const response3 = await request.put(`${BASE_URL}/api/planner`, {
      data: empty()
    });
    expect(response3.status()).toBe(401);
    const body3 = await response3.json();
    expect(body3.error.code).toEqual(expect.any(String));
    expect(body3.error.message).toEqual(expect.any(String));
  });

  test('capa exige autenticação', async ({ request }) => {
    expect((await request.get(`${BASE_URL}/api/planner/covers/aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa`)).status()).toBe(401);
  });

  test('conta nova retorna planejamento nulo', async ({ request }) => {
    const account = await createAccount(request);
    await login(request, account);
    expect(await read(request)).toEqual({
      data: null,
      updatedAt: null
    });
  });

  test('persiste estado e substitui atividades ao omitir o campo', async ({ request }) => {
    const account = await createAccount(request);
    await login(request, account);
    const data = state();
    data.expenses = [{
      id: 'expense-qa',
      tripId: 'trip-qa',
      category: 'Passeios',
      description: 'Ingresso',
      quantity: 1,
      unitPrice: 10,
      currency: 'BRL',
      exchangeRate: 1,
      convertedAmount: 10,
      paid: false
    }];
    data.activities[0].expenseId = 'expense-qa';
    data.checklist = [{
      id: 'checklist-qa',
      tripId: 'trip-qa',
      title: 'Documentos',
      icon: 'documents',
      items: [{
        id: 'item-qa',
        label: 'Passaporte',
        done: false
      }]
    }];
    data.tripInfo = {
      'trip-qa': {
        accommodation: '',
        accommodationDetails: '',
        flight: '',
        flightDetails: '',
        transport: '',
        documents: '',
        usefulLink: '',
        notes: 'Notas QA'
      }
    };
    data.timeline = {
      'trip-qa': [{
        id: 'timeline-qa',
        date: '15/10',
        day: 'Quinta',
        title: 'Museu',
        subtitle: 'Visita',
        type: 'Passeios'
      }]
    };
    await save(request, data);
    expect((await read(request)).data).toEqual(data);
    expect((await read(request, true)).data).toEqual(data);
    delete data.activities;
    await save(request, data);
    expect((await read(request)).data).toEqual({
      ...data,
      activities: []
    });
    await save(request, empty());
    expect((await read(request)).data).toEqual(empty());
  });

  test('atividade rejeita nome vazio', async ({ request }) => {
    const account = await createAccount(request);
    await login(request, account);
    const data = state();
    data.activities[0].name = '';
    const response = await request.put(`${BASE_URL}/api/planner`, {
      data
    });
    expect(response.status()).toBe(400);
    const body = await response.json();
    expect(body.error.code).toEqual(expect.any(String));
    expect(body.error.message).toEqual(expect.any(String));
    expect(body.error.code).toBe('INVALID_PLANNER_STATE');
    expect((await read(request)).data).toBeNull();
  });

  test('atividade rejeita nome longo', async ({ request }) => {
    const account = await createAccount(request);
    await login(request, account);
    const data = state();
    data.activities[0].name = 'a'.repeat(161);
    const response = await request.put(`${BASE_URL}/api/planner`, {
      data
    });
    expect(response.status()).toBe(400);
    const body = await response.json();
    expect(body.error.code).toEqual(expect.any(String));
    expect(body.error.message).toEqual(expect.any(String));
    expect(body.error.code).toBe('INVALID_PLANNER_STATE');
    expect((await read(request)).data).toBeNull();
  });

  test('atividade rejeita horário inválido', async ({ request }) => {
    const account = await createAccount(request);
    await login(request, account);
    const data = state();
    data.activities[0].time = '24:00';
    const response = await request.put(`${BASE_URL}/api/planner`, {
      data
    });
    expect(response.status()).toBe(400);
    const body = await response.json();
    expect(body.error.code).toEqual(expect.any(String));
    expect(body.error.message).toEqual(expect.any(String));
    expect(body.error.code).toBe('INVALID_PLANNER_STATE');
    expect((await read(request)).data).toBeNull();
  });

  test('atividade rejeita duração zero', async ({ request }) => {
    const account = await createAccount(request);
    await login(request, account);
    const data = state();
    data.activities[0].duration = 0;
    const response = await request.put(`${BASE_URL}/api/planner`, {
      data
    });
    expect(response.status()).toBe(400);
    const body = await response.json();
    expect(body.error.code).toEqual(expect.any(String));
    expect(body.error.message).toEqual(expect.any(String));
    expect(body.error.code).toBe('INVALID_PLANNER_STATE');
    expect((await read(request)).data).toBeNull();
  });

  test('atividade rejeita duração fracionada', async ({ request }) => {
    const account = await createAccount(request);
    await login(request, account);
    const data = state();
    data.activities[0].duration = 1.5;
    const response = await request.put(`${BASE_URL}/api/planner`, {
      data
    });
    expect(response.status()).toBe(400);
    const body = await response.json();
    expect(body.error.code).toEqual(expect.any(String));
    expect(body.error.message).toEqual(expect.any(String));
    expect(body.error.code).toBe('INVALID_PLANNER_STATE');
    expect((await read(request)).data).toBeNull();
  });

  test('atividade rejeita duração acima do limite', async ({ request }) => {
    const account = await createAccount(request);
    await login(request, account);
    const data = state();
    data.activities[0].duration = 525601;
    const response = await request.put(`${BASE_URL}/api/planner`, {
      data
    });
    expect(response.status()).toBe(400);
    const body = await response.json();
    expect(body.error.code).toEqual(expect.any(String));
    expect(body.error.message).toEqual(expect.any(String));
    expect(body.error.code).toBe('INVALID_PLANNER_STATE');
    expect((await read(request)).data).toBeNull();
  });

  test('atividade rejeita categoria inválida', async ({ request }) => {
    const account = await createAccount(request);
    await login(request, account);
    const data = state();
    data.activities[0].category = 'invalid';
    const response = await request.put(`${BASE_URL}/api/planner`, {
      data
    });
    expect(response.status()).toBe(400);
    const body = await response.json();
    expect(body.error.code).toEqual(expect.any(String));
    expect(body.error.message).toEqual(expect.any(String));
    expect(body.error.code).toBe('INVALID_PLANNER_STATE');
    expect((await read(request)).data).toBeNull();
  });

  test('atividade rejeita status inválido', async ({ request }) => {
    const account = await createAccount(request);
    await login(request, account);
    const data = state();
    data.activities[0].status = 'invalid';
    const response = await request.put(`${BASE_URL}/api/planner`, {
      data
    });
    expect(response.status()).toBe(400);
    const body = await response.json();
    expect(body.error.code).toEqual(expect.any(String));
    expect(body.error.message).toEqual(expect.any(String));
    expect(body.error.code).toBe('INVALID_PLANNER_STATE');
    expect((await read(request)).data).toBeNull();
  });

  test('atividade rejeita estimativa negativa', async ({ request }) => {
    const account = await createAccount(request);
    await login(request, account);
    const data = state();
    data.activities[0].estimate = -1;
    data.activities[0].currency = 'BRL';
    const response = await request.put(`${BASE_URL}/api/planner`, {
      data
    });
    expect(response.status()).toBe(400);
    const body = await response.json();
    expect(body.error.code).toEqual(expect.any(String));
    expect(body.error.message).toEqual(expect.any(String));
    expect(body.error.code).toBe('INVALID_PLANNER_STATE');
    expect((await read(request)).data).toBeNull();
  });

  test('atividade rejeita estimativa sem moeda', async ({ request }) => {
    const account = await createAccount(request);
    await login(request, account);
    const data = state();
    data.activities[0].estimate = 10;
    const response = await request.put(`${BASE_URL}/api/planner`, {
      data
    });
    expect(response.status()).toBe(400);
    const body = await response.json();
    expect(body.error.code).toEqual(expect.any(String));
    expect(body.error.message).toEqual(expect.any(String));
    expect(body.error.code).toBe('INVALID_PLANNER_STATE');
    expect((await read(request)).data).toBeNull();
  });

  test('atividade rejeita moeda inválida', async ({ request }) => {
    const account = await createAccount(request);
    await login(request, account);
    const data = state();
    data.activities[0].estimate = 10;
    data.activities[0].currency = 'XXX';
    const response = await request.put(`${BASE_URL}/api/planner`, {
      data
    });
    expect(response.status()).toBe(400);
    const body = await response.json();
    expect(body.error.code).toEqual(expect.any(String));
    expect(body.error.message).toEqual(expect.any(String));
    expect(body.error.code).toBe('INVALID_PLANNER_STATE');
    expect((await read(request)).data).toBeNull();
  });

  test('atividade rejeita despesa e estimativa', async ({ request }) => {
    const account = await createAccount(request);
    await login(request, account);
    const data = state();
    data.activities[0].expenseId = 'expense';
    data.activities[0].estimate = 10;
    data.activities[0].currency = 'BRL';
    const response = await request.put(`${BASE_URL}/api/planner`, {
      data
    });
    expect(response.status()).toBe(400);
    const body = await response.json();
    expect(body.error.code).toEqual(expect.any(String));
    expect(body.error.message).toEqual(expect.any(String));
    expect(body.error.code).toBe('INVALID_PLANNER_STATE');
    expect((await read(request)).data).toBeNull();
  });

  test('atividade rejeita despesa e moeda', async ({ request }) => {
    const account = await createAccount(request);
    await login(request, account);
    const data = state();
    data.activities[0].expenseId = 'expense';
    data.activities[0].currency = 'BRL';
    const response = await request.put(`${BASE_URL}/api/planner`, {
      data
    });
    expect(response.status()).toBe(400);
    const body = await response.json();
    expect(body.error.code).toEqual(expect.any(String));
    expect(body.error.message).toEqual(expect.any(String));
    expect(body.error.code).toBe('INVALID_PLANNER_STATE');
    expect((await read(request)).data).toBeNull();
  });

  test('atividade rejeita URL não HTTP', async ({ request }) => {
    const account = await createAccount(request);
    await login(request, account);
    const data = state();
    data.activities[0].bookingUrl = 'ftp://example.com';
    const response = await request.put(`${BASE_URL}/api/planner`, {
      data
    });
    expect(response.status()).toBe(400);
    const body = await response.json();
    expect(body.error.code).toEqual(expect.any(String));
    expect(body.error.message).toEqual(expect.any(String));
    expect(body.error.code).toBe('INVALID_PLANNER_STATE');
    expect((await read(request)).data).toBeNull();
  });

  test('atividade rejeita ordem negativa', async ({ request }) => {
    const account = await createAccount(request);
    await login(request, account);
    const data = state();
    data.activities[0].order = -1;
    const response = await request.put(`${BASE_URL}/api/planner`, {
      data
    });
    expect(response.status()).toBe(400);
    const body = await response.json();
    expect(body.error.code).toEqual(expect.any(String));
    expect(body.error.message).toEqual(expect.any(String));
    expect(body.error.code).toBe('INVALID_PLANNER_STATE');
    expect((await read(request)).data).toBeNull();
  });

  test('atividade rejeita distância negativa', async ({ request }) => {
    const account = await createAccount(request);
    await login(request, account);
    const data = state();
    data.activities[0].distanceKm = -1;
    const response = await request.put(`${BASE_URL}/api/planner`, {
      data
    });
    expect(response.status()).toBe(400);
    const body = await response.json();
    expect(body.error.code).toEqual(expect.any(String));
    expect(body.error.message).toEqual(expect.any(String));
    expect(body.error.code).toBe('INVALID_PLANNER_STATE');
    expect((await read(request)).data).toBeNull();
  });

  test('atividade rejeita deslocamento negativo', async ({ request }) => {
    const account = await createAccount(request);
    await login(request, account);
    const data = state();
    data.activities[0].travelHours = -1;
    const response = await request.put(`${BASE_URL}/api/planner`, {
      data
    });
    expect(response.status()).toBe(400);
    const body = await response.json();
    expect(body.error.code).toEqual(expect.any(String));
    expect(body.error.message).toEqual(expect.any(String));
    expect(body.error.code).toBe('INVALID_PLANNER_STATE');
    expect((await read(request)).data).toBeNull();
  });

  test('atividade rejeita ID duplicado', async ({ request }) => {
    const account = await createAccount(request);
    await login(request, account);
    const data = state();
    data.activities.push(activity());
    const response = await request.put(`${BASE_URL}/api/planner`, {
      data
    });
    expect(response.status()).toBe(400);
    const body = await response.json();
    expect(body.error.code).toEqual(expect.any(String));
    expect(body.error.message).toEqual(expect.any(String));
    expect(body.error.code).toBe('INVALID_ACTIVITY');
    expect((await read(request)).data).toBeNull();
  });

  test('atividade rejeita viagem inexistente', async ({ request }) => {
    const account = await createAccount(request);
    await login(request, account);
    const data = state();
    data.activities[0].tripId = 'missing';
    const response = await request.put(`${BASE_URL}/api/planner`, {
      data
    });
    expect(response.status()).toBe(400);
    const body = await response.json();
    expect(body.error.code).toEqual(expect.any(String));
    expect(body.error.message).toEqual(expect.any(String));
    expect(body.error.code).toBe('INVALID_ACTIVITY');
    expect((await read(request)).data).toBeNull();
  });

  test('atividade rejeita data fora do período', async ({ request }) => {
    const account = await createAccount(request);
    await login(request, account);
    const data = state();
    data.activities[0].date = '2026-10-21';
    const response = await request.put(`${BASE_URL}/api/planner`, {
      data
    });
    expect(response.status()).toBe(400);
    const body = await response.json();
    expect(body.error.code).toEqual(expect.any(String));
    expect(body.error.message).toEqual(expect.any(String));
    expect(body.error.code).toBe('INVALID_ACTIVITY');
    expect((await read(request)).data).toBeNull();
  });

  test('atividade rejeita despesa inexistente', async ({ request }) => {
    const account = await createAccount(request);
    await login(request, account);
    const data = state();
    data.activities[0].expenseId = 'expense-qa';
    const response = await request.put(`${BASE_URL}/api/planner`, {
      data
    });
    expect(response.status()).toBe(400);
    const body = await response.json();
    expect(body.error.code).toEqual(expect.any(String));
    expect(body.error.message).toEqual(expect.any(String));
    expect(body.error.code).toBe('INVALID_ACTIVITY');
    expect((await read(request)).data).toBeNull();
  });

  test('atividade rejeita despesa de outra viagem', async ({ request }) => {
    const account = await createAccount(request);
    await login(request, account);
    const data = state();
    data.activities[0].expenseId = 'expense-qa';
    data.trips.push(trip('other'));
    data.expenses.push({
      id: 'expense-qa',
      tripId: 'other',
      category: 'Passeios',
      description: 'Ingresso',
      quantity: 1,
      unitPrice: 10,
      currency: 'BRL',
      exchangeRate: 1,
      convertedAmount: 10,
      paid: false
    });
    const response = await request.put(`${BASE_URL}/api/planner`, {
      data
    });
    expect(response.status()).toBe(400);
    const body = await response.json();
    expect(body.error.code).toEqual(expect.any(String));
    expect(body.error.message).toEqual(expect.any(String));
    expect(body.error.code).toBe('INVALID_ACTIVITY');
    expect((await read(request)).data).toBeNull();
  });

  test('preserva data antiga fora do período e vínculo antigo com despesa removida', async ({ request }) => {
    const account = await createAccount(request);
    await login(request, account);
    const data = state();
    data.expenses = [{
      id: 'expense-qa',
      tripId: 'trip-qa',
      category: 'Passeios',
      description: 'Ingresso',
      quantity: 1,
      unitPrice: 10,
      currency: 'BRL',
      exchangeRate: 1,
      convertedAmount: 10,
      paid: false
    }];
    data.activities[0].expenseId = 'expense-qa';
    await save(request, data);
    data.expenses = [];
    data.trips[0].endDate = '2026-10-14';
    await save(request, data);
    expect((await read(request)).data.activities).toEqual(data.activities);
    data.activities[0].date = '2026-10-16';
    const response = await request.put(`${BASE_URL}/api/planner`, {
      data
    });
    expect(response.status()).toBe(400);
    const body = await response.json();
    expect(body.error.code).toEqual(expect.any(String));
    expect(body.error.message).toEqual(expect.any(String));
    expect(body.error.code).toBe('INVALID_ACTIVITY');
    expect((await read(request)).data.activities[0].date).toBe('2026-10-15');
  });

  test('rejeita estado incompleto', async ({ request }) => {
    const account = await createAccount(request);
    await login(request, account);
    const response = await request.put(`${BASE_URL}/api/planner`, {
      data: {}
    });
    expect(response.status()).toBe(400);
    const body = await response.json();
    expect(body.error.code).toEqual(expect.any(String));
    expect(body.error.message).toEqual(expect.any(String));
    expect(body.error.code).toBe('INVALID_PLANNER_STATE');
  });

  test('capa inexistente retorna 404', async ({ request }) => {
    const account = await createAccount(request);
    await login(request, account);
    expect((await request.get(`${BASE_URL}/api/planner/covers/aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa`)).status()).toBe(404);
  });

  test('capa compacta retorna imagem privada e suporta cache condicional', async ({ request }) => {
    const account = await createAccount(request);
    await login(request, account);
    const data = state();
    data.trips[0].coverImage = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+aWQAAAABJRU5ErkJggg==';
    await save(request, data);
    const compact = await read(request, true);
    const cover = new URL(compact.data.trips[0].coverImage, `${BASE_URL}/`);
    expect(cover.origin).toBe(new URL(`${BASE_URL}/`).origin);
    expect(cover.pathname).toMatch(/^\/api\/planner\/covers\/[a-f0-9]{64}$/);
    const response = await request.get(cover.href);
    expect(response.status()).toBe(200);
    expect(response.headers()['content-type']).toContain('image/png');
    expect(response.headers()['cache-control']).toContain('private');
    expect(await response.body()).toEqual(Buffer.from(data.trips[0].coverImage.split(',')[1], 'base64'));
    const etag = response.headers().etag;
    expect(etag).toBeTruthy();
    const cached = await request.get(cover.href, {
      headers: {
        'If-None-Match': etag
      }
    });
    expect(cached.status()).toBe(304);
    expect((await cached.body()).length).toBe(0);
  });
});
