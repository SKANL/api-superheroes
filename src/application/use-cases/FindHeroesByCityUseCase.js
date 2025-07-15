// Caso de uso: Buscar héroes por ciudad
export class FindHeroesByCityUseCase {
  constructor(heroRepository) {
    this.heroRepository = heroRepository;
  }

  async execute(city) {
    if (!city) throw new Error('City is required');
    return await this.heroRepository.findByCity(city);
  }
}

export default FindHeroesByCityUseCase;
