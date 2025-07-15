// Caso de uso: Listar batallas por equipos por héroe
export class ListTeamBattlesByHeroUseCase {
  constructor(teamBattleRepository) {
    this.teamBattleRepository = teamBattleRepository;
  }

  async execute(heroId) {
    return await this.teamBattleRepository.findByHeroId(heroId);
  }
}

export default ListTeamBattlesByHeroUseCase;
