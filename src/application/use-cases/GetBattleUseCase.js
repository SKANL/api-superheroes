// Caso de uso: Obtener una batalla por ID
export class GetBattleUseCase {
  constructor(battleRepository) {
    this.battleRepository = battleRepository;
  }

  async execute(id) {
    if (!id) throw new Error('Battle id is required');
    const battle = await this.battleRepository.findById(id);
    if (!battle) throw new Error('Battle not found');
    return battle;
  }
}

export default GetBattleUseCase;
