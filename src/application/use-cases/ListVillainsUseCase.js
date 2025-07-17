// Caso de uso: Listar todos los villanos del usuario autenticado
export class ListVillainsUseCase {
  constructor(villainRepository) {
    this.villainRepository = villainRepository;
  }

  async execute(userId) {
    return await this.villainRepository.findByOwner(userId);
  }
}

export default ListVillainsUseCase;
