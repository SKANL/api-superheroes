/**
 * Caso de uso: Validar propiedad de una batalla
 * 
 * Verifica si un usuario es el propietario de una batalla específica
 */
export class ValidateBattleOwnershipUseCase {
  constructor(battleRepository) {
    this.battleRepository = battleRepository;
  }

  /**
   * Ejecuta el caso de uso
   * @param {string} battleId - ID de la batalla
   * @param {string} userId - ID del usuario
   * @returns {Promise<boolean>} - True si el usuario es propietario, false en caso contrario
   */
  async execute(battleId, userId) {
    const battle = await this.battleRepository.getById(battleId);
    
    if (!battle) {
      return false;
    }
    
    return battle.owner === userId;
  }
}

export default ValidateBattleOwnershipUseCase;
