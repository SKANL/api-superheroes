/**
 * Caso de uso: Validar propiedad de un villano
 * 
 * Verifica si un usuario es el propietario de un villano específico
 */
export class ValidateVillainOwnershipUseCase {
  constructor(villainRepository) {
    this.villainRepository = villainRepository;
  }

  /**
   * Ejecuta el caso de uso
   * @param {string} villainId - ID del villano
   * @param {string} userId - ID del usuario
   * @returns {Promise<boolean>} - True si el usuario es propietario, false en caso contrario
   */
  async execute(villainId, userId) {
    const villain = await this.villainRepository.getById(villainId);
    
    if (!villain) {
      return false;
    }
    
    return villain.owner === userId;
  }
}

export default ValidateVillainOwnershipUseCase;
