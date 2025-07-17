/**
 * Caso de uso: Validar propiedad de una batalla por equipos
 * 
 * Verifica si un usuario es el propietario de una batalla por equipos específica
 */
export class ValidateTeamBattleOwnershipUseCase {
  constructor(teamBattleRepository) {
    this.teamBattleRepository = teamBattleRepository;
  }

  /**
   * Ejecuta el caso de uso
   * @param {string} teamBattleId - ID de la batalla por equipos
   * @param {string} userId - ID del usuario
   * @returns {Promise<boolean>} - True si el usuario es propietario, false en caso contrario
   */
  async execute(teamBattleId, userId) {
    const teamBattle = await this.teamBattleRepository.getById(teamBattleId);
    
    if (!teamBattle) {
      return false;
    }
    
    return teamBattle.owner === userId;
  }
}

export default ValidateTeamBattleOwnershipUseCase;
