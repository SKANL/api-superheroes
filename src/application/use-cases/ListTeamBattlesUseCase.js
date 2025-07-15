// Caso de uso: Listar todas las batallas por equipos
export class ListTeamBattlesUseCase {
  constructor(teamBattleRepository) {
    this.teamBattleRepository = teamBattleRepository;
  }

  async execute() {
    return await this.teamBattleRepository.findAll();
  }
}

export default ListTeamBattlesUseCase;
