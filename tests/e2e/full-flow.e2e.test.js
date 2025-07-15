import request from 'supertest';
import { app } from '../../index.js';

describe('E2E: Full Hero-Villain-Battle Flow', () => {
  let heroId, villainId, battleId;

  it('should create a hero and a villain, then a battle', async () => {
    const heroRes = await request(app)
      .post('/api/heroes')
      .send({ name: 'Batman', alias: 'Murciélago', city: 'Ciudad Gótica' });
    expect(heroRes.statusCode).toBe(201);
    heroId = heroRes.body.id;

    const villainRes = await request(app)
      .post('/api/villains')
      .send({ name: 'Joker', alias: 'Joker', city: 'Ciudad Gótica' });
    expect(villainRes.statusCode).toBe(201);
    villainId = villainRes.body.id;

    const battleRes = await request(app)
      .post('/api/battles')
      .send({ heroId, villainId });
    expect(battleRes.statusCode).toBe(201);
    battleId = battleRes.body.id;
  });

  it('should get the created battle', async () => {
    const res = await request(app).get(`/api/battles/${battleId}`);
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('heroId', heroId);
    expect(res.body).toHaveProperty('villainId', villainId);
  });
});
