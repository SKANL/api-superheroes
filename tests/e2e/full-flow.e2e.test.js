import request from 'supertest';
import { app } from '../../index.js';

describe('E2E: Full Hero-Villain-Battle Flow', () => {
  let heroId, villainId, battleId;
  let cityName;

  it('should get API status', async () => {
    const res = await request(app).get('/api/status');
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('status');
  });

  it('should get health check', async () => {
    const res = await request(app).get('/health');
    expect(res.statusCode).toBe(200);
  });

  it('should get cities list and save one', async () => {
    const res = await request(app).get('/api/cities');
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.length).toBeGreaterThan(0);
    cityName = res.body[0];
  });

  it('should create a hero and a villain, then a battle', async () => {
    const heroRes = await request(app)
      .post('/api/heroes')
      .send({ name: 'Batman', alias: 'Murciélago', city: cityName || 'Ciudad Gótica' });
    expect(heroRes.statusCode).toBe(201);
    heroId = heroRes.body.id;

    const villainRes = await request(app)
      .post('/api/villains')
      .send({ name: 'Joker', alias: 'Joker', city: cityName || 'Ciudad Gótica' });
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

  it('should get API docs (Swagger)', async () => {
    const res = await request(app).get('/api/docs');
    expect(res.statusCode).toBe(200);
    expect(res.headers['content-type']).toContain('text/html');
  });

  it('should get Dashboard UI', async () => {
    const res = await request(app).get('/dashboard');
    expect(res.statusCode).toBe(200);
    expect(res.headers['content-type']).toContain('text/html');
  });

  it('should get Heroes Manager UI', async () => {
    const res = await request(app).get('/api/heroes-manager');
    expect(res.statusCode).toBe(200);
    expect(res.headers['content-type']).toContain('text/html');
  });

  it('should get Villains Manager UI', async () => {
    const res = await request(app).get('/api/villains-manager');
    expect(res.statusCode).toBe(200);
    expect(res.headers['content-type']).toContain('text/html');
  });

  it('should get Battles Manager UI', async () => {
    const res = await request(app).get('/api/battles-manager');
    expect(res.statusCode).toBe(200);
    expect(res.headers['content-type']).toContain('text/html');
  });

  it('should get Team Battles Manager UI', async () => {
    const res = await request(app).get('/api/team-battles-manager');
    expect(res.statusCode).toBe(200);
    expect(res.headers['content-type']).toContain('text/html');
  });

  it('should get Test Swagger UI', async () => {
    const res = await request(app).get('/test-swagger');
    expect(res.statusCode).toBe(200);
    expect(res.headers['content-type']).toContain('text/html');
  });

  it('should get Test Simple UI', async () => {
    const res = await request(app).get('/test-simple');
    expect(res.statusCode).toBe(200);
    expect(res.headers['content-type']).toContain('text/html');
  });

  it('should get Test Filter UI', async () => {
    const res = await request(app).get('/test-filter');
    expect(res.statusCode).toBe(200);
    expect(res.headers['content-type']).toContain('text/html');
  });
});
