// Caso de uso: Obtener el estado de la ronda actual de una batalla por equipos
export class GetTeamBattleStateUseCase {
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
    const { rounds, currentRoundIndex } = tb;
    const currentRound = rounds[currentRoundIndex] || null;
    return { 
      currentRoundIndex, 
      currentRound: currentRound || { heroActions: [], villainActions: [] }
    };
  }
}

export default GetTeamBattleStateUseCase;
