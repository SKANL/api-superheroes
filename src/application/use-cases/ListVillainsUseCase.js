// Caso de uso: Listar villanos accesibles al usuario (propios + de administradores)
export class ListVillainsUseCase {
  constructor(villainRepository, userRepository) {
    this.villainRepository = villainRepository;
    this.userRepository = userRepository;
  }

  async execute(userId) {
    return await this.villainRepository.findAccessibleByUser(userId, this.userRepository);
  }
}

export default ListVillainsUseCase;
