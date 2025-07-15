// Caso de uso: Listar batallas por villano
export class ListBattlesByVillainUseCase {
  constructor(battleRepository) {
    this.battleRepository = battleRepository;
  }

  async execute(villainId) {
    if (!villainId) throw new Error('villainId is required');
    return await this.battleRepository.findByVillainId(villainId);
  }
}

export default ListBattlesByVillainUseCase;
