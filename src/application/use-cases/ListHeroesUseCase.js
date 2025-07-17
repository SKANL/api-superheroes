import { Hero } from '../../domain/entities/Hero.js';

// Caso de uso: Listar todos los héroes del usuario autenticado
export class ListHeroesUseCase {
  constructor(heroRepository) {
    this.heroRepository = heroRepository;
  }

  async execute(userId) {
    return await this.heroRepository.findByOwner(userId);
  }
}
