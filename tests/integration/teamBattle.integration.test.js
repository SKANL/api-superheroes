import request from 'supertest';
import { createApp } from '../../src/infrastructure/config/app.js';

let app;
beforeAll(() => {
  process.env.NODE_ENV = 'test';
  app = createApp().app;
});

describe('TeamBattle API Integration', () => {
  let heroIds = [], villainIds = [], teamBattleId;

  it('should create heroes and villains for the team battle', async () => {
    const hero1 = await request(app)
      .post('/api/heroes')
      .send({ name: 'Iron Man', alias: 'Tony', city: 'Nueva York', team: 'Avengers' });
    const hero2 = await request(app)
      .post('/api/heroes')
      .send({ name: 'Spider-Man', alias: 'Peter', city: 'Nueva York', team: 'Avengers' });
    heroIds = [hero1.body.id, hero2.body.id];

    const villain1 = await request(app)
      .post('/api/villains')
      .send({ name: 'Thanos', alias: 'Thanos', city: 'Nueva York' });
    const villain2 = await request(app)
      .post('/api/villains')
      .send({ name: 'Loki', alias: 'Loki', city: 'Nueva York' });
    villainIds = [villain1.body.id, villain2.body.id];

    expect(hero1.statusCode).toBe(201);
    expect(hero2.statusCode).toBe(201);
    expect(villain1.statusCode).toBe(201);
    expect(villain2.statusCode).toBe(201);
  });

  it('POST /api/team-battles - should create a team battle', async () => {
    const res = await request(app)
      .post('/api/team-battles')
      .send({ heroIds, villainIds });
    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty('id');
    teamBattleId = res.body.id;
  });

  it('GET /api/team-battles/:id - should get the created team battle', async () => {
    const res = await request(app).get(`/api/team-battles/${teamBattleId}`);
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('heroIds');
    expect(res.body).toHaveProperty('villainIds');
  });

  it('GET /api/team-battles/:id/state - should get the state of the team battle', async () => {
    const res = await request(app).get(`/api/team-battles/${teamBattleId}/state`);
    expect(res.statusCode).toBe(200);
    // Verifica que la respuesta tenga información de la ronda actual y el índice
    expect(res.body).toHaveProperty('currentRound');
    expect(res.body).toHaveProperty('currentRoundIndex');
    // Opcional: verifica que currentRound tenga las acciones de héroes y villanos
    expect(res.body.currentRound).toHaveProperty('heroActions');
    expect(res.body.currentRound).toHaveProperty('villainActions');
  });

  it('POST /api/team-battles/:id/restart - should restart the team battle', async () => {
    const res = await request(app)
      .post(`/api/team-battles/${teamBattleId}/restart`)
      .send({ heroIds, villainIds });
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('id', teamBattleId);
  });

  it('DELETE /api/team-battles/:id - should delete the team battle', async () => {
    const res = await request(app).delete(`/api/team-battles/${teamBattleId}`);
    expect(res.statusCode).toBe(204);
  });
});
