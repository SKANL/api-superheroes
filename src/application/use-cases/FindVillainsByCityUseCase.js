// Caso de uso: Buscar villanos por ciudad del usuario autenticado
export class FindVillainsByCityUseCase {
  constructor(villainRepository) {
    this.villainRepository = villainRepository;
  }

  async execute(city, userId) {
    if (!city) throw new Error('City is required');
    if (!userId) throw new Error('User ID is required');
    return await this.villainRepository.findByCityAndOwner(city, userId);
  }
}

export default FindVillainsByCityUseCase;
