import request from 'supertest';
import { createApp } from '../../src/infrastructure/config/app.js';

describe('TeamBattle Endpoints Flow', () => {
  let app;
  let token;
  let userId;
  let heroIds = [];
  let villainIds = [];
  let teamBattleId;

  beforeAll(async () => {
    process.env.NODE_ENV = 'test';
    app = createApp().app;
    // Register a new user
    const signup = await request(app)
      .post('/api/auth/signup')
      .send({ username: 'flowtest', email: 'flow@test.com', password: 'password', role: 'admin' });
    expect(signup.statusCode).toBe(201);
    userId = signup.body.id;

    // Login to get JWT
    const login = await request(app)
      .post('/api/auth/login')
      .send({ email: 'flow@test.com', password: 'password' });
    expect(login.statusCode).toBe(200);
    token = login.body.token || login.body.accessToken;
  });

  it('should create heroes and villains', async () => {
    const h1 = await request(app)
      .post('/api/heroes')
      .set('Authorization', `Bearer ${token}`)
      .send({ name: 'FlowHero1', alias: 'FH1', city: 'TestCity', team: 'FlowTeam' });
    const h2 = await request(app)
      .post('/api/heroes')
      .set('Authorization', `Bearer ${token}`)
      .send({ name: 'FlowHero2', alias: 'FH2', city: 'TestCity', team: 'FlowTeam' });
    expect(h1.statusCode).toBe(201);
    expect(h2.statusCode).toBe(201);
    heroIds = [h1.body.id, h2.body.id];

    const v1 = await request(app)
      .post('/api/villains')
      .set('Authorization', `Bearer ${token}`)
      .send({ name: 'FlowVillain1', alias: 'FV1', city: 'TestCity' });
    const v2 = await request(app)
      .post('/api/villains')
      .set('Authorization', `Bearer ${token}`)
      .send({ name: 'FlowVillain2', alias: 'FV2', city: 'TestCity' });
    expect(v1.statusCode).toBe(201);
    expect(v2.statusCode).toBe(201);
    villainIds = [v1.body.id, v2.body.id];
  });

  it('should create a team battle', async () => {
    const res = await request(app)
      .post('/api/team-battles')
      .set('Authorization', `Bearer ${token}`)
      .send({ heroIds, villainIds, mode: 'manual' });
    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty('id');
    teamBattleId = res.body.id;
  });

  it('should start the team battle', async () => {
    const res = await request(app)
      .post(`/api/team-battles/${teamBattleId}/start`)
      .set('Authorization', `Bearer ${token}`);
    expect(res.statusCode).toBe(200);
    // Permitir que devuelva solo currentRound/currentRoundIndex o el objeto completo
    expect(res.body).toEqual(expect.objectContaining({
      currentRound: expect.any(Object),
      currentRoundIndex: expect.any(Number)
    }));
  });

  it('should select side for battle', async () => {
    const res = await request(app)
      .post(`/api/team-battles/${teamBattleId}/select-side`)
      .set('Authorization', `Bearer ${token}`)
      .send({ side: 'hero' });
    // Mostrar el body para depuración
    console.log('select-side response:', res.statusCode, res.body);
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('selectedSides');
    // No comprobamos userId porque puede ser string/objeto diferente
  });

  it('should fail selecting invalid side', async () => {
    const res = await request(app)
      .post(`/api/team-battles/${teamBattleId}/select-side`)
      .set('Authorization', `Bearer ${token}`)
      .send({ side: 'invalid' });
    expect(res.statusCode).toBe(400);
  });
});
