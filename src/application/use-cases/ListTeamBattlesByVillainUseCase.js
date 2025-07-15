// Caso de uso: Listar batallas por equipos por villano
export class ListTeamBattlesByVillainUseCase {
  constructor(teamBattleRepository) {
    this.teamBattleRepository = teamBattleRepository;
  }

  async execute(villainId) {
    return await this.teamBattleRepository.findByVillainId(villainId);
  }
}

export default ListTeamBattlesByVillainUseCase;
