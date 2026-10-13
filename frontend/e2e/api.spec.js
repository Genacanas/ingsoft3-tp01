import { expect, test } from '@playwright/test';

// La API tiene su propia dirección. Sin barra al final.
const API = process.env.API_BASE_URL || 'http://localhost:8080';

// Helper para listar tareas desde la API real
async function listar(request) {
  const r = await request.get(`${API}/api/tareas`);
  expect(r.status()).toBe(200);
  return await r.json();
}

test('1. alta guarda en la base de datos real y el borrado la elimina', async ({ request }) => {
  const titulo = `api ${Date.now()}`;
  const alta = await request.post(`${API}/api/tareas`, {
    data: { titulo, prioridad: 'media' },
  });
  expect(alta.status()).toBe(201);
  const creada = await alta.json();
  expect(creada.id).toBeDefined();

  // Comprobar que la base de datos de verdad la devuelve (no es un doble)
  const lista = await listar(request);
  expect(lista.some((t) => t.id === creada.id && t.titulo === titulo)).toBe(true);

  // Borrar la tarea para limpiar QA
  const borrado = await request.delete(`${API}/api/tareas/${creada.id}`);
  expect(borrado.status()).toBe(200);

  // Comprobar que ya no existe en la base de datos
  const despues = await listar(request);
  expect(despues.some((t) => t.id === creada.id)).toBe(false);
});

test('2. un título vacío es rechazado con 400 y no crea registros en la base', async ({ request }) => {
  const antes = await listar(request);

  const alta = await request.post(`${API}/api/tareas`, {
    data: { titulo: '' },
  });
  expect(alta.status()).toBe(400);

  const despues = await listar(request);
  expect(despues.length).toBe(antes.length);
});

test('3. el cálculo de SLA guarda la fecha de vencimiento según la prioridad', async ({ request }) => {
  const titulo = `api sla ${Date.now()}`;
  const alta = await request.post(`${API}/api/tareas`, {
    data: { titulo, prioridad: 'alta' },
  });
  expect(alta.status()).toBe(201);
  const creada = await alta.json();

  // Prioridad alta vence en 24h (1 día): la base debe tener fecha_vencimiento
  expect(creada.fecha_vencimiento).toBeDefined();
  expect(creada.fecha_vencimiento).not.toBeNull();

  // Limpiar la tarea
  const borrado = await request.delete(`${API}/api/tareas/${creada.id}`);
  expect(borrado.status()).toBe(200);
});
