// Caso de uso: Eliminar una batalla por equipos
export class DeleteTeamBattleUseCase {
  constructor(teamBattleRepository) {
    this.teamBattleRepository = teamBattleRepository;
  }

  async execute(id) {
    const deleted = await this.teamBattleRepository.delete(id);
    if (!deleted) {
      const error = new Error('TeamBattle not found');
      error.status = 404;
      throw error;
    }
    return true;
  }
}

export default DeleteTeamBattleUseCase;
