import { jest } from '@jest/globals';
import { HeroController } from '../../../src/infrastructure/adapters/controllers/hero.controller.js';

describe('HeroController Unit', () => {
  const mockUseCases = {
    createHeroUseCase: { execute: jest.fn() },
    getHeroUseCase: { execute: jest.fn() },
    listHeroesUseCase: { execute: jest.fn() },
    findHeroesByCityUseCase: { execute: jest.fn() },
    updateHeroUseCase: { execute: jest.fn() },
    deleteHeroUseCase: { execute: jest.fn() },
  };
  const controller = new HeroController(mockUseCases);

  it('should call createHeroUseCase.execute on create', async () => {
    const req = { body: { name: 'A', alias: 'B', city: 'C' } };
    const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
    const next = jest.fn();
    await controller.create(req, res, next);
    expect(mockUseCases.createHeroUseCase.execute).toHaveBeenCalledWith(
      req.body
    );
  });
});
