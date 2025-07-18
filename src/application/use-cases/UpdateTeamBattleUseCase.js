// Caso de uso: Actualizar datos de una batalla por equipos
import { TeamBattleService } from '../../domain/services/TeamBattleService.js';
import { TeamBattle } from '../../domain/entities/TeamBattle.js';

export class UpdateTeamBattleUseCase {
  constructor(teamBattleRepository, heroRepository, villainRepository) {
    this.teamBattleRepository = teamBattleRepository;
    this.heroRepository = heroRepository;
    this.villainRepository = villainRepository;
  }

  async execute(id, updateData) {
    const existing = await this.teamBattleRepository.findById(id);
    if (!existing) {
      const error = new Error('TeamBattle not found');
      error.status = 404;
      throw error;
    }

    // Si es una actualización completa (durante finishBattle), usar los datos proporcionados
    if (updateData.status || updateData.result || updateData.rounds || updateData.characters) {
      const updated = new TeamBattle({
        id,
        heroIds: updateData.heroIds || existing.heroIds,
        villainIds: updateData.villainIds || existing.villainIds,
        date: existing.date,
        result: updateData.result !== undefined ? updateData.result : existing.result,
        rounds: updateData.rounds !== undefined ? updateData.rounds : existing.rounds,
        currentRoundIndex: updateData.currentRoundIndex !== undefined ? updateData.currentRoundIndex : existing.currentRoundIndex,
        status: updateData.status || existing.status,
        characters: updateData.characters || existing.characters,
        mode: updateData.mode || existing.mode,
        owner: existing.owner // Siempre mantener el owner original
      });
      return await this.teamBattleRepository.update(id, updated);
    }

    // Si cambian equipos, validar y regenerar rondas y resultado (lógica original)
    const { heroIds, villainIds } = updateData;
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
      
      const updated = new TeamBattle({
        id,
        heroIds: newHeroIds,
        villainIds: newVillainIds,
        date: existing.date,
        result,
        rounds,
        currentRoundIndex: existing.currentRoundIndex || 0,
        status: existing.status,
        characters: existing.characters,
        mode: existing.mode,
        owner: existing.owner
      });
      return await this.teamBattleRepository.update(id, updated);
    }

    // Si no hay cambios en equipos, solo devolver el existente
    return existing;
  }
}

export default UpdateTeamBattleUseCase;
