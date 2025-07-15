// Caso de uso: Actualizar datos de una batalla por equipos
import { TeamBattleService } from '../../domain/services/TeamBattleService.js';
import { TeamBattle } from '../../domain/entities/TeamBattle.js';

export class UpdateTeamBattleUseCase {
  constructor(teamBattleRepository, heroRepository, villainRepository) {
    this.teamBattleRepository = teamBattleRepository;
    this.heroRepository = heroRepository;
    this.villainRepository = villainRepository;
  }

  async execute(id, { heroIds, villainIds }) {
    const existing = await this.teamBattleRepository.findById(id);
    if (!existing) {
      const error = new Error('TeamBattle not found');
      error.status = 404;
      throw error;
    }
    // Si cambian equipos, validar y regenerar rondas y resultado
    let rounds = existing.rounds;
    let result = existing.result;
    if (heroIds || villainIds) {
      const newHeroIds = heroIds || existing.heroIds;
      const newVillainIds = villainIds || existing.villainIds;
      // Validar
      const heroes = await Promise.all(newHeroIds.map(id => this.heroRepository.findById(id)));
      const villains = await Promise.all(newVillainIds.map(id => this.villainRepository.findById(id)));
      if (heroes.some(h => !h)) throw new Error('One or more heroes not found');
      if (villains.some(v => !v)) throw new Error('One or more villains not found');
      TeamBattleService.validateTeamBattle(heroes, villains);
      rounds = TeamBattleService.generateRounds(newHeroIds, newVillainIds);
      result = TeamBattleService.determineFinalResult(rounds);
      heroIds = newHeroIds;
      villainIds = newVillainIds;
    }
    const updated = new TeamBattle({
      id,
      heroIds: heroIds || existing.heroIds,
      villainIds: villainIds || existing.villainIds,
      date: existing.date,
      result,
      rounds,
      currentRoundIndex: 0
    });
    return await this.teamBattleRepository.update(id, updated);
  }
}

export default UpdateTeamBattleUseCase;
