// Caso de uso: Buscar villanos por ciudad
export class FindVillainsByCityUseCase {
  constructor(villainRepository) {
    this.villainRepository = villainRepository;
  }

  async execute(city) {
    if (!city) throw new Error('City is required');
    return await this.villainRepository.findByCity(city);
  }
}

export default FindVillainsByCityUseCase;
