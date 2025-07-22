/**
 * Caso de uso: Validar propiedad de un héroe
 * 
 * Verifica si un usuario es el propietario de un héroe específico
 */
export class ValidateHeroOwnershipUseCase {
  constructor(heroRepository) {
    this.heroRepository = heroRepository;
  }

  /**
   * Ejecuta el caso de uso
   * @param {string} heroId - ID del héroe
   * @param {string} userId - ID del usuario
   * @returns {Promise<boolean>} - True si el usuario es propietario, false en caso contrario
   */
  async execute(heroId, userId) {
    const hero = await this.heroRepository.findById(heroId);
    
    if (!hero) {
      return false;
    }
    
    return hero.owner === userId;
  }
}

export default ValidateHeroOwnershipUseCase;
