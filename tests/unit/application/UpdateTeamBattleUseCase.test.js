import { UpdateTeamBattleUseCase } from '../../../src/application/use-cases/UpdateTeamBattleUseCase.js';
import { TeamBattle } from '../../../src/domain/entities/TeamBattle.js';

describe('UpdateTeamBattleUseCase - Owner Field Fix', () => {
  let updateTeamBattleUseCase;
  let mockTeamBattleRepository;
  let mockHeroRepository;
  let mockVillainRepository;

  beforeEach(() => {
    mockTeamBattleRepository = {
      findById: jest.fn(),
      update: jest.fn()
    };
    mockHeroRepository = {
      findById: jest.fn()
    };
    mockVillainRepository = {
      findById: jest.fn()
    };

    updateTeamBattleUseCase = new UpdateTeamBattleUseCase(
      mockTeamBattleRepository,
      mockHeroRepository,
      mockVillainRepository
    );
  });

  test('Should preserve owner field when updating battle status', async () => {
    const existingBattle = {
      id: 'battle123',
      heroIds: ['hero1'],
      villainIds: ['villain1'],
      date: '2025-07-18T10:00:00.000Z',
      result: null,
      rounds: [],
      currentRoundIndex: 0,
      status: 'in_progress',
      characters: [],
      mode: 'manual',
      owner: 'user123' // Este es el campo crítico
    };

    const updateData = {
      status: 'finished',
      result: 'heroes',
      rounds: [{ roundNumber: 1, result: 'heroes' }],
      currentRoundIndex: 1
    };

    mockTeamBattleRepository.findById.mockResolvedValue(existingBattle);
    mockTeamBattleRepository.update.mockResolvedValue({
      ...existingBattle,
      ...updateData
    });

    const result = await updateTeamBattleUseCase.execute('battle123', updateData);

    // Verificar que el update fue llamado con el owner preservado
    expect(mockTeamBattleRepository.update).toHaveBeenCalledWith('battle123', expect.objectContaining({
      owner: 'user123',
      status: 'finished',
      result: 'heroes'
    }));
  });

  test('Should throw error when battle not found', async () => {
    mockTeamBattleRepository.findById.mockResolvedValue(null);

    await expect(
      updateTeamBattleUseCase.execute('nonexistent', { status: 'finished' })
    ).rejects.toThrow('TeamBattle not found');
  });
});
