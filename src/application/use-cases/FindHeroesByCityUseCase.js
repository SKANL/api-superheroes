// Caso de uso: Buscar héroes por ciudad accesibles al usuario (propios + de administradores)
export class FindHeroesByCityUseCase {
  constructor(heroRepository, userRepository) {
    this.heroRepository = heroRepository;
    this.userRepository = userRepository;
  }

  async execute(city, userId) {
    if (!city) throw new Error('City is required');
    if (!userId) throw new Error('User ID is required');
    return await this.heroRepository.findByCityAccessibleByUser(city, userId, this.userRepository);
  }
}

export default FindHeroesByCityUseCase;
