import request from 'supertest';
import jwt from 'jsonwebtoken';
import { app } from '../../index.js';

describe('Battle Creation Security Fix', () => {
  let user1Token;
  let heroId, villainId;

  beforeAll(async () => {
    // Create a test user token
    const user1Id = 'test-user-123';
    user1Token = jwt.sign({ userId: user1Id }, process.env.JWT_SECRET || 'test-secret');

    // Create a hero and villain with authentication
    const heroRes = await request(app)
      .post('/api/heroes')
      .set('Authorization', `Bearer ${user1Token}`)
      .send({
        name: 'Test Hero',
        alias: 'Test Alias',
        city: 'Test City',
      });
    heroId = heroRes.body.id;

    const villainRes = await request(app)
      .post('/api/villains')
      .set('Authorization', `Bearer ${user1Token}`)
      .send({
        name: 'Test Villain',
        alias: 'Test Villain Alias',
        city: 'Test City',
      });
    villainId = villainRes.body.id;
  });

  test('Should create battle with authenticated user as owner', async () => {
    const response = await request(app)
      .post('/api/battles')
      .set('Authorization', `Bearer ${user1Token}`)
      .send({
        heroId,
        villainId,
        mode: 'manual'
      });

    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty('id');
    expect(response.body).toHaveProperty('owner', 'test-user-123');
    expect(response.body).toHaveProperty('heroId', heroId);
    expect(response.body).toHaveProperty('villainId', villainId);
  });

  test('Should fail to create battle without authentication', async () => {
    const response = await request(app)
      .post('/api/battles')
      .send({
        heroId,
        villainId,
        mode: 'manual'
      });

    expect(response.status).toBe(401);
    expect(response.body.error).toBe('Token no proporcionado');
  });
});
