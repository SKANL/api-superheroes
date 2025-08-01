// Caso de uso: Listar todas las batallas
export class ListBattlesUseCase {
  constructor(battleRepository) {
    this.battleRepository = battleRepository;
  }

  async execute(userId = null) {
    if (userId) {
      // Filtrar por owner si se especifica un userId
      return await this.battleRepository.findByOwner(userId);
    }
    return await this.battleRepository.findAll();
  }
}

export default ListBattlesUseCase;
