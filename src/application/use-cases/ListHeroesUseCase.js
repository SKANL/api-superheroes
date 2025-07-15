import { Hero } from '../../domain/entities/Hero.js';

// Caso de uso: Listar todos los héroes
export class ListHeroesUseCase {
  constructor(heroRepository) {
    this.heroRepository = heroRepository;
  }

  async execute() {
    return await this.heroRepository.findAll();
  }
}
