// Caso de uso: Listar todas las batallas por equipos
export class ListTeamBattlesUseCase {
  constructor(teamBattleRepository) {
    this.teamBattleRepository = teamBattleRepository;
  }

  /**
   * @param {string} ownerId
   */
  async execute(ownerId) {
    const all = await this.teamBattleRepository.findAll();
    return all.filter(tb => tb.owner === ownerId);
  }
}

export default ListTeamBattlesUseCase;
