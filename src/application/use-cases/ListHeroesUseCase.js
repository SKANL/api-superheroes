import { Hero } from '../../domain/entities/Hero.js';

// Caso de uso: Listar héroes accesibles al usuario (propios + de administradores)
export class ListHeroesUseCase {
  constructor(heroRepository, userRepository) {
    this.heroRepository = heroRepository;
    this.userRepository = userRepository;
  }

  async execute(userId) {
    return await this.heroRepository.findAccessibleByUser(userId, this.userRepository);
  }
}
