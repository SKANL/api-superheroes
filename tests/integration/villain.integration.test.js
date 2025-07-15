import request from 'supertest';
import { createApp } from '../../src/infrastructure/config/app.js';

let app;
beforeAll(() => {
  process.env.NODE_ENV = 'test';
  app = createApp().app;
});

describe('Villain API Integration', () => {
  let villainId;

  it('POST /api/villains - should create a villain', async () => {
    const res = await request(app)
      .post('/api/villains')
      .send({ name: 'El Rata', alias: 'Rata', city: 'Ciudad Gótica' });
    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty('id');
    villainId = res.body.id;
  });

  it('GET /api/villains/:id - should get a villain by id', async () => {
    const res = await request(app).get(`/api/villains/${villainId}`);
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('alias', 'Rata');
  });

  it('PUT /api/villains/:id - should update a villain', async () => {
    const res = await request(app)
      .put(`/api/villains/${villainId}`)
      .send({ name: 'El Rata', alias: 'Rata', city: 'París' });
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('city', 'París');
  });

  it('DELETE /api/villains/:id - should delete a villain', async () => {
    const res = await request(app).delete(`/api/villains/${villainId}`);
    expect(res.statusCode).toBe(204);
  });
});
