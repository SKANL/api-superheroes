import request from 'supertest';
import { createApp } from '../../src/infrastructure/config/app.js';

let app;
beforeAll(() => {
  process.env.NODE_ENV = 'test';
  app = createApp().app;
});

describe('Hero API Integration', () => {
  let heroId;

  it('POST /api/heroes - should create a hero', async () => {
    const res = await request(app)
      .post('/api/heroes')
      .send({
        name: 'Chapulín Colorado',
        alias: 'Chapulín',
        city: 'Ciudad de México',
        team: 'Los Supergenios',
      });
    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty('id');
    heroId = res.body.id;
  });

  it('GET /api/heroes/:id - should get a hero by id', async () => {
    const res = await request(app).get(`/api/heroes/${heroId}`);
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('alias', 'Chapulín');
  });

  it('PUT /api/heroes/:id - should update a hero', async () => {
    const res = await request(app)
      .put(`/api/heroes/${heroId}`)
      .send({
        name: 'Chapulín Colorado',
        alias: 'Chapulín',
        city: 'Ciudad Gótica',
        team: 'Los Supergenios',
      });
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('city', 'Ciudad Gótica');
  });

  it('DELETE /api/heroes/:id - should delete a hero', async () => {
    const res = await request(app).delete(`/api/heroes/${heroId}`);
    expect(res.statusCode).toBe(204);
  });
});
