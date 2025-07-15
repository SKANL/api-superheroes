// Caso de uso: Listar todos los villanos
export class ListVillainsUseCase {
  constructor(villainRepository) {
    this.villainRepository = villainRepository;
  }

  async execute() {
    return await this.villainRepository.findAll();
  }
}

export default ListVillainsUseCase;
