// Caso de uso: Buscar héroes por ciudad del usuario autenticado
export class FindHeroesByCityUseCase {
  constructor(heroRepository) {
    this.heroRepository = heroRepository;
  }

  async execute(city, userId) {
    if (!city) throw new Error('City is required');
    if (!userId) throw new Error('User ID is required');
    return await this.heroRepository.findByCityAndOwner(city, userId);
  }
}

export default FindHeroesByCityUseCase;
