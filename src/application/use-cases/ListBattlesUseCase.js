// Caso de uso: Listar todas las batallas
export class ListBattlesUseCase {
  constructor(battleRepository) {
    this.battleRepository = battleRepository;
  }

  async execute() {
    return await this.battleRepository.findAll();
  }
}

export default ListBattlesUseCase;
