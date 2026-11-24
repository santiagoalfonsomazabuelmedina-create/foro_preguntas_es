// Prueba de integración: la API completa contra un PostgreSQL REAL (base app_test).
// Requisito: la base debe estar corriendo →  docker compose up -d
import request from 'supertest';
import { afterAll, beforeEach, describe, expect, it } from 'vitest';
import { createApp } from '../../src/app/create-app.ts';
import { createPool } from '../../src/shared/db.ts';

try {
  process.loadEnvFile('.env');
} catch {
  // En CI no hay .env.
}

const pool = createPool(process.env.TEST_DATABASE_URL!);
const app = createApp({ pool });

beforeEach(async () => {
  await pool.query('TRUNCATE tasks RESTART IDENTITY');
});

afterAll(async () => {
  await pool.end();
});

describe('API /api/tasks', () => {
  it('GET /api/health responde ok', async () => {
    const res = await request(app).get('/api/health');
    expect(res.status).toBe(200);
    expect(res.body).toEqual({ status: 'ok' });
  });

  it('crea una tarea y la devuelve en la lista', async () => {
    const created = await request(app).post('/api/tasks').send({ title: 'Estudiar SQL' });
    expect(created.status).toBe(201);
    expect(created.body).toMatchObject({ id: 1, title: 'Estudiar SQL', done: false });

    const list = await request(app).get('/api/tasks');
    expect(list.status).toBe(200);
    expect(list.body).toHaveLength(1);
  });

  it('rechaza un título vacío con 400', async () => {
    const res = await request(app).post('/api/tasks').send({ title: '   ' });
    expect(res.status).toBe(400);
    expect(res.body.error).toBe('Datos no válidos');
  });

  it('edita una tarea existente', async () => {
    await request(app).post('/api/tasks').send({ title: 'Original' });
    const res = await request(app).put('/api/tasks/1').send({ title: 'Editada', done: true });
    expect(res.status).toBe(200);
    expect(res.body).toMatchObject({ title: 'Editada', done: true });
  });

  it('elimina una tarea y luego responde 404', async () => {
    await request(app).post('/api/tasks').send({ title: 'Temporal' });
    expect((await request(app).delete('/api/tasks/1')).status).toBe(204);
    expect((await request(app).get('/api/tasks/1')).status).toBe(404);
  });

  it('no permite inyección SQL en el título: se guarda como texto', async () => {
    const malicious = "x'); DROP TABLE tasks; --";
    const res = await request(app).post('/api/tasks').send({ title: malicious });
    expect(res.status).toBe(201);
    expect(res.body.title).toBe(malicious);
    expect((await request(app).get('/api/tasks')).body).toHaveLength(1);
  });
});
