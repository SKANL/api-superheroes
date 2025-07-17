import request from 'supertest';
import jwt from 'jsonwebtoken';
import { createApp } from '../../src/infrastructure/config/app.js';

describe('Hero Security Tests', () => {
  let app;
  let user1Token, user2Token;
  let user1Id, user2Id;
  let heroCreatedByUser1;

  beforeAll(async () => {
    // Configurar aplicación de test
    app = createApp().app;
    
    // Crear tokens JWT para dos usuarios diferentes
    user1Id = 'test-user-1';
    user2Id = 'test-user-2';
    user1Token = jwt.sign({ userId: user1Id }, process.env.JWT_SECRET || 'test-secret');
    user2Token = jwt.sign({ userId: user2Id }, process.env.JWT_SECRET || 'test-secret');
  });

  describe('Hero Creation Security', () => {
    test('Should require authentication to create hero', async () => {
      const heroData = {
        name: 'Test Hero',
        alias: 'Tester',
        city: 'Test City'
      };

      const response = await request(app)
        .post('/api/heroes')
        .send(heroData);

      expect(response.status).toBe(401);
      expect(response.body.error).toBe('Token no proporcionado');
    });

    test('Should create hero with authenticated user as owner', async () => {
      const heroData = {
        name: 'Test Hero User1',
        alias: 'TestUser1',
        city: 'Test City'
      };

      const response = await request(app)
        .post('/api/heroes')
        .set('Authorization', `Bearer ${user1Token}`)
        .send(heroData);

      expect(response.status).toBe(201);
      expect(response.body.owner).toBe(user1Id);
      heroCreatedByUser1 = response.body;
    });
  });

  describe('Hero Access Security', () => {
    test('User can only see their own heroes in list', async () => {
      // User1 crea un héroe
      await request(app)
        .post('/api/heroes')
        .set('Authorization', `Bearer ${user1Token}`)
        .send({
          name: 'Hero User1',
          alias: 'HeroU1',
          city: 'City1'
        });

      // User2 crea un héroe
      await request(app)
        .post('/api/heroes')
        .set('Authorization', `Bearer ${user2Token}`)
        .send({
          name: 'Hero User2',
          alias: 'HeroU2',
          city: 'City2'
        });

      // User1 solo ve sus héroes
      const user1Response = await request(app)
        .get('/api/heroes')
        .set('Authorization', `Bearer ${user1Token}`);

      expect(user1Response.status).toBe(200);
      expect(Array.isArray(user1Response.body)).toBe(true);
      user1Response.body.forEach(hero => {
        expect(hero.owner).toBe(user1Id);
      });

      // User2 solo ve sus héroes
      const user2Response = await request(app)
        .get('/api/heroes')
        .set('Authorization', `Bearer ${user2Token}`);

      expect(user2Response.status).toBe(200);
      expect(Array.isArray(user2Response.body)).toBe(true);
      user2Response.body.forEach(hero => {
        expect(hero.owner).toBe(user2Id);
      });
    });

    test('User cannot access hero owned by another user', async () => {
      if (!heroCreatedByUser1) {
        // Crear héroe con user1 si no existe
        const response = await request(app)
          .post('/api/heroes')
          .set('Authorization', `Bearer ${user1Token}`)
          .send({
            name: 'Private Hero',
            alias: 'Private',
            city: 'Private City'
          });
        heroCreatedByUser1 = response.body;
      }

      // User2 intenta acceder al héroe de User1
      const response = await request(app)
        .get(`/api/heroes/${heroCreatedByUser1.id}`)
        .set('Authorization', `Bearer ${user2Token}`);

      expect(response.status).toBe(403);
      expect(response.body.error).toBe('No tienes permiso para acceder a este héroe');
    });

    test('User can access their own hero', async () => {
      if (!heroCreatedByUser1) return;

      const response = await request(app)
        .get(`/api/heroes/${heroCreatedByUser1.id}`)
        .set('Authorization', `Bearer ${user1Token}`);

      expect(response.status).toBe(200);
      expect(response.body.id).toBe(heroCreatedByUser1.id);
      expect(response.body.owner).toBe(user1Id);
    });

    test('User cannot update hero owned by another user', async () => {
      if (!heroCreatedByUser1) return;

      const response = await request(app)
        .put(`/api/heroes/${heroCreatedByUser1.id}`)
        .set('Authorization', `Bearer ${user2Token}`)
        .send({
          name: 'Hacked Name'
        });

      expect(response.status).toBe(403);
      expect(response.body.error).toBe('No tienes permiso para acceder a este héroe');
    });

    test('User cannot delete hero owned by another user', async () => {
      if (!heroCreatedByUser1) return;

      const response = await request(app)
        .delete(`/api/heroes/${heroCreatedByUser1.id}`)
        .set('Authorization', `Bearer ${user2Token}`);

      expect(response.status).toBe(403);
      expect(response.body.error).toBe('No tienes permiso para acceder a este héroe');
    });
  });

  describe('Hero Search Security', () => {
    test('Search by city only returns user own heroes', async () => {
      const testCity = 'SharedCity';
      
      // User1 crea héroe en la ciudad
      await request(app)
        .post('/api/heroes')
        .set('Authorization', `Bearer ${user1Token}`)
        .send({
          name: 'Hero User1 SharedCity',
          alias: 'HeroU1SC',
          city: testCity
        });

      // User2 crea héroe en la misma ciudad
      await request(app)
        .post('/api/heroes')
        .set('Authorization', `Bearer ${user2Token}`)
        .send({
          name: 'Hero User2 SharedCity',
          alias: 'HeroU2SC',
          city: testCity
        });

      // User1 busca en la ciudad y solo ve su héroe
      const user1Response = await request(app)
        .get(`/api/heroes/city/${testCity}`)
        .set('Authorization', `Bearer ${user1Token}`);

      expect(user1Response.status).toBe(200);
      expect(Array.isArray(user1Response.body)).toBe(true);
      user1Response.body.forEach(hero => {
        expect(hero.owner).toBe(user1Id);
        expect(hero.city).toBe(testCity);
      });

      // User2 busca en la ciudad y solo ve su héroe
      const user2Response = await request(app)
        .get(`/api/heroes/city/${testCity}`)
        .set('Authorization', `Bearer ${user2Token}`);

      expect(user2Response.status).toBe(200);
      expect(Array.isArray(user2Response.body)).toBe(true);
      user2Response.body.forEach(hero => {
        expect(hero.owner).toBe(user2Id);
        expect(hero.city).toBe(testCity);
      });
    });
  });
});
