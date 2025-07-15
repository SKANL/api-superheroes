import request from 'supertest';
import { app } from '../../index.js';

describe('Battle API Integration', () => {
  let heroId, villainId, battleId;

  beforeAll(async () => {
    // Crear un héroe y un villano para la batalla
    const heroRes = await request(app)
      .post('/api/heroes')
      .send({
        name: 'Superman',
        alias: 'Clark',
        city: 'Metrópolis',
        team: 'Liga de la Justicia',
      });
    heroId = heroRes.body.id;
    const villainRes = await request(app)
      .post('/api/villains')
      .send({ name: 'Lex Luthor', alias: 'Lex', city: 'Metrópolis' });
    villainId = villainRes.body.id;
  });

  it('POST /api/battles - should create a battle', async () => {
    const res = await request(app)
      .post('/api/battles')
      .send({ heroId, villainId });
    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty('id');
    battleId = res.body.id;
  });

  it('GET /api/battles/:id - should get a battle by id', async () => {
    const res = await request(app).get(`/api/battles/${battleId}`);
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('heroId', heroId);
    expect(res.body).toHaveProperty('villainId', villainId);
  });
});
