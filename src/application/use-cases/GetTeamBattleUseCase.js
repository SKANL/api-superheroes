// Caso de uso: Obtener una batalla por equipos por ID
export class GetTeamBattleUseCase {
  constructor(teamBattleRepository) {
    this.teamBattleRepository = teamBattleRepository;
  }

  async execute(id) {
    const tb = await this.teamBattleRepository.findById(id);
    if (!tb) {
      const error = new Error('TeamBattle not found');
      error.status = 404;
      throw error;
    }
    return tb;
  }
}

export default GetTeamBattleUseCase;
