// Caso de uso: Reiniciar una batalla por equipos
import { TeamBattleService } from '../../domain/services/TeamBattleService.js';
import { TeamBattle } from '../../domain/entities/TeamBattle.js';

export class RestartTeamBattleUseCase {
  constructor(teamBattleRepository, heroRepository, villainRepository) {
    this.teamBattleRepository = teamBattleRepository;
    this.heroRepository = heroRepository;
    this.villainRepository = villainRepository;
  }

  async execute(id, { heroIds, villainIds } = {}) {
    const existing = await this.teamBattleRepository.findById(id);
    if (!existing) {
      const error = new Error('TeamBattle not found');
      error.status = 404;
      throw error;
    }
    // Determinar equipos a usar
    const newHeroIds = heroIds || existing.heroIds;
    const newVillainIds = villainIds || existing.villainIds;
    // Validar
    const heroes = await Promise.all(newHeroIds.map(i => this.heroRepository.findById(i)));
    const villains = await Promise.all(newVillainIds.map(i => this.villainRepository.findById(i)));
    if (heroes.some(h => !h)) throw new Error('One or more heroes not found');
    if (villains.some(v => !v)) throw new Error('One or more villains not found');
    TeamBattleService.validateTeamBattle(heroes, villains);
    // Reiniciar estado de batalla sin pre-simular rondas
    const characters = [...heroes, ...villains].map(c => ({
      id: c.id,
      hpCurrent: c.hpMax || c.health,
      hpMax: c.hpMax || c.health,
      isAlive: true,
      ...c
    }));
    const restarted = new TeamBattle({
      id,
      heroIds: newHeroIds,
      villainIds: newVillainIds,
      date: existing.date,
      rounds: [],
      currentRoundIndex: 0,
      status: 'in_progress',
      characters
    });
    return await this.teamBattleRepository.update(id, restarted);
  }
}

export default RestartTeamBattleUseCase;
