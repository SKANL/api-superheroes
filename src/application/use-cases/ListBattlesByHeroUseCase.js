// Caso de uso: Listar batallas por héroe
export class ListBattlesByHeroUseCase {
  constructor(battleRepository) {
    this.battleRepository = battleRepository;
  }

  async execute(heroId) {
    if (!heroId) throw new Error('heroId is required');
    return await this.battleRepository.findByHeroId(heroId);
  }
}

export default ListBattlesByHeroUseCase;
