import request from 'supertest';
import jwt from 'jsonwebtoken';
import { createApp } from '../../src/infrastructure/config/app.js';

describe('Villain Security Tests', () => {
  let app;
  let user1Token, user2Token;
  let user1Id, user2Id;
  let villainCreatedByUser1;

  beforeAll(async () => {
    // Configurar aplicación de test
    app = createApp().app;
    
    // Crear tokens JWT para dos usuarios diferentes
    user1Id = 'test-user-1';
    user2Id = 'test-user-2';
    user1Token = jwt.sign({ userId: user1Id }, process.env.JWT_SECRET || 'test-secret');
    user2Token = jwt.sign({ userId: user2Id }, process.env.JWT_SECRET || 'test-secret');
  });

  describe('Villain Creation Security', () => {
    test('Should require authentication to create villain', async () => {
      const villainData = {
        name: 'Test Villain',
        alias: 'TestVillain',
        city: 'Test City'
      };

      const response = await request(app)
        .post('/api/villains')
        .send(villainData);

      expect(response.status).toBe(401);
      expect(response.body.error).toBe('Token no proporcionado');
    });

    test('Should create villain with authenticated user as owner', async () => {
      const villainData = {
        name: 'Test Villain User1',
        alias: 'TestVillainUser1',
        city: 'Test City'
      };

      const response = await request(app)
        .post('/api/villains')
        .set('Authorization', `Bearer ${user1Token}`)
        .send(villainData);

      expect(response.status).toBe(201);
      expect(response.body.owner).toBe(user1Id);
      villainCreatedByUser1 = response.body;
    });
  });

  describe('Villain Access Security', () => {
    test('User can only see their own villains in list', async () => {
      // User1 crea un villano
      await request(app)
        .post('/api/villains')
        .set('Authorization', `Bearer ${user1Token}`)
        .send({
          name: 'Villain User1',
          alias: 'VillainU1',
          city: 'City1'
        });

      // User2 crea un villano
      await request(app)
        .post('/api/villains')
        .set('Authorization', `Bearer ${user2Token}`)
        .send({
          name: 'Villain User2',
          alias: 'VillainU2',
          city: 'City2'
        });

      // User1 solo ve sus villanos
      const user1Response = await request(app)
        .get('/api/villains')
        .set('Authorization', `Bearer ${user1Token}`);

      expect(user1Response.status).toBe(200);
      expect(Array.isArray(user1Response.body)).toBe(true);
      user1Response.body.forEach(villain => {
        expect(villain.owner).toBe(user1Id);
      });

      // User2 solo ve sus villanos
      const user2Response = await request(app)
        .get('/api/villains')
        .set('Authorization', `Bearer ${user2Token}`);

      expect(user2Response.status).toBe(200);
      expect(Array.isArray(user2Response.body)).toBe(true);
      user2Response.body.forEach(villain => {
        expect(villain.owner).toBe(user2Id);
      });
    });

    test('User cannot access villain owned by another user', async () => {
      if (!villainCreatedByUser1) {
        // Crear villano con user1 si no existe
        const response = await request(app)
          .post('/api/villains')
          .set('Authorization', `Bearer ${user1Token}`)
          .send({
            name: 'Private Villain',
            alias: 'PrivateVillain',
            city: 'Private City'
          });
        villainCreatedByUser1 = response.body;
      }

      // User2 intenta acceder al villano de User1
      const response = await request(app)
        .get(`/api/villains/${villainCreatedByUser1.id}`)
        .set('Authorization', `Bearer ${user2Token}`);

      expect(response.status).toBe(403);
      expect(response.body.error).toBe('No tienes permiso para acceder a este villano');
    });

    test('User can access their own villain', async () => {
      if (!villainCreatedByUser1) return;

      const response = await request(app)
        .get(`/api/villains/${villainCreatedByUser1.id}`)
        .set('Authorization', `Bearer ${user1Token}`);

      expect(response.status).toBe(200);
      expect(response.body.id).toBe(villainCreatedByUser1.id);
      expect(response.body.owner).toBe(user1Id);
    });

    test('User cannot update villain owned by another user', async () => {
      if (!villainCreatedByUser1) return;

      const response = await request(app)
        .put(`/api/villains/${villainCreatedByUser1.id}`)
        .set('Authorization', `Bearer ${user2Token}`)
        .send({
          name: 'Hacked Villain Name'
        });

      expect(response.status).toBe(403);
      expect(response.body.error).toBe('No tienes permiso para acceder a este villano');
    });

    test('User cannot delete villain owned by another user', async () => {
      if (!villainCreatedByUser1) return;

      const response = await request(app)
        .delete(`/api/villains/${villainCreatedByUser1.id}`)
        .set('Authorization', `Bearer ${user2Token}`);

      expect(response.status).toBe(403);
      expect(response.body.error).toBe('No tienes permiso para acceder a este villano');
    });
  });

  describe('Villain Search Security', () => {
    test('Search by city only returns user own villains', async () => {
      const testCity = 'SharedVillainCity';
      
      // User1 crea villano en la ciudad
      await request(app)
        .post('/api/villains')
        .set('Authorization', `Bearer ${user1Token}`)
        .send({
          name: 'Villain User1 SharedCity',
          alias: 'VillainU1SC',
          city: testCity
        });

      // User2 crea villano en la misma ciudad
      await request(app)
        .post('/api/villains')
        .set('Authorization', `Bearer ${user2Token}`)
        .send({
          name: 'Villain User2 SharedCity',
          alias: 'VillainU2SC',
          city: testCity
        });

      // User1 busca en la ciudad y solo ve su villano
      const user1Response = await request(app)
        .get(`/api/villains/city/${testCity}`)
        .set('Authorization', `Bearer ${user1Token}`);

      expect(user1Response.status).toBe(200);
      expect(Array.isArray(user1Response.body)).toBe(true);
      user1Response.body.forEach(villain => {
        expect(villain.owner).toBe(user1Id);
        expect(villain.city).toBe(testCity);
      });

      // User2 busca en la ciudad y solo ve su villano
      const user2Response = await request(app)
        .get(`/api/villains/city/${testCity}`)
        .set('Authorization', `Bearer ${user2Token}`);

      expect(user2Response.status).toBe(200);
      expect(Array.isArray(user2Response.body)).toBe(true);
      user2Response.body.forEach(villain => {
        expect(villain.owner).toBe(user2Id);
        expect(villain.city).toBe(testCity);
      });
    });
  });
});
