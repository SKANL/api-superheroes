// Caso de uso: Buscar villanos por ciudad accesibles al usuario (propios + de administradores)
export class FindVillainsByCityUseCase {
  constructor(villainRepository, userRepository) {
    this.villainRepository = villainRepository;
    this.userRepository = userRepository;
  }

  async execute(city, userId) {
    if (!city) throw new Error('City is required');
    if (!userId) throw new Error('User ID is required');
    return await this.villainRepository.findByCityAccessibleByUser(city, userId, this.userRepository);
  }
}

export default FindVillainsByCityUseCase;
