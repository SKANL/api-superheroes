// Test para verificar la seguridad de las partidas por equipo
import request from 'supertest';
import { app } from '../../index.js';
import jwt from 'jsonwebtoken';

describe('TeamBattle Security Tests', () => {
  let token1, token2;
  let userId1 = '111111111111111111111111';
  let userId2 = '222222222222222222222222';
  let teamBattleId;

  beforeAll(() => {
    // Crear tokens JWT para dos usuarios diferentes
    token1 = jwt.sign({ userId: userId1 }, process.env.JWT_SECRET || 'test-secret');
    token2 = jwt.sign({ userId: userId2 }, process.env.JWT_SECRET || 'test-secret');
  });

  it('should create a team battle for user 1', async () => {
    // Primero creamos algunos héroes y villanos
    const heroResponse = await request(app)
      .post('/api/heroes')
      .set('Authorization', `Bearer ${token1}`)
      .send({
        name: 'Test Hero',
        alias: 'TestHero1',
        city: 'Test City',
        power: 80,
        health: 100
      });

    const villainResponse = await request(app)
      .post('/api/villains')
      .set('Authorization', `Bearer ${token1}`)
      .send({
        name: 'Test Villain',
        alias: 'TestVillain1',
        city: 'Test City',
        power: 75,
        health: 90
      });

    const heroId = heroResponse.body.id;
    const villainId = villainResponse.body.id;

    // Crear una batalla por equipos con el usuario 1
    const response = await request(app)
      .post('/api/team-battles')
      .set('Authorization', `Bearer ${token1}`)
      .send({
        heroIds: [heroId],
        villainIds: [villainId],
        mode: 'manual'
      });

    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty('id');
    expect(response.body).toHaveProperty('owner', userId1);
    
    teamBattleId = response.body.id;
  });

  it('should allow user 1 to access their team battle', async () => {
    const response = await request(app)
      .get(`/api/team-battles/${teamBattleId}`)
      .set('Authorization', `Bearer ${token1}`);

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('id', teamBattleId);
  });

  it('should NOT allow user 2 to access user 1\'s team battle', async () => {
    const response = await request(app)
      .get(`/api/team-battles/${teamBattleId}`)
      .set('Authorization', `Bearer ${token2}`);

    expect(response.status).toBe(403);
  });

  it('should NOT allow user 2 to update user 1\'s team battle', async () => {
    const response = await request(app)
      .put(`/api/team-battles/${teamBattleId}`)
      .set('Authorization', `Bearer ${token2}`)
      .send({
        status: 'finished'
      });

    expect(response.status).toBe(403);
  });

  it('should NOT allow user 2 to delete user 1\'s team battle', async () => {
    const response = await request(app)
      .delete(`/api/team-battles/${teamBattleId}`)
      .set('Authorization', `Bearer ${token2}`);

    expect(response.status).toBe(403);
  });

  it('should NOT allow user 2 to perform actions on user 1\'s team battle', async () => {
    const response = await request(app)
      .post(`/api/team-battles/${teamBattleId}/attack`)
      .set('Authorization', `Bearer ${token2}`)
      .send({
        attackerType: 'hero',
        attackerId: 'some-id',
        targetId: 'some-other-id'
      });

    expect(response.status).toBe(403);
  });

  it('should only list team battles owned by the authenticated user', async () => {
    const response = await request(app)
      .get('/api/team-battles')
      .set('Authorization', `Bearer ${token1}`);

    expect(response.status).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
    
    // Todas las batallas listadas deben pertenecer al usuario 1
    response.body.forEach(battle => {
      expect(battle.owner).toBe(userId1);
    });
  });
});
