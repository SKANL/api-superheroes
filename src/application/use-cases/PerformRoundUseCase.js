// Caso de uso: Procesar una ronda manual en una batalla por equipos
import { TeamBattleService } from '../../domain/services/TeamBattleService.js';
export class PerformRoundUseCase {
  constructor(teamBattleRepository) {
    this.teamBattleRepository = teamBattleRepository;
  }

  async execute(id, heroActions, villainActions) {
    const battle = await this.teamBattleRepository.findById(id);
    if (!battle) {
      const error = new Error('TeamBattle not found');
      error.status = 404;
      throw error;
    }
    if (battle.status === 'finished') {
      const error = new Error('Battle already finished');
      error.status = 400;
      throw error;
    }
    // Procesar ronda con acciones del usuario
    const updated = TeamBattleService.processRound(battle, heroActions, villainActions);
    // Guardar estado actualizado
    // Pass both id and updated battle to repository.update
    return await this.teamBattleRepository.update(id, updated);
  }
}

export default PerformRoundUseCase;
