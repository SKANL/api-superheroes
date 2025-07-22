// Caso de uso: Verificar si un usuario tiene acceso a un héroe
export class VerifyHeroAccessUseCase {
  constructor(heroRepository, userRepository) {
    this.heroRepository = heroRepository;
    this.userRepository = userRepository;
  }

  async execute(heroId, userId) {
    const hero = await this.heroRepository.findById(heroId);
    if (!hero) {
      throw new Error('Héroe no encontrado');
    }

    const user = await this.userRepository.findById(userId);
    if (!user) {
      throw new Error('Usuario no encontrado');
    }

    // Administradores pueden acceder a cualquier héroe
    if (user.role === 'admin') {
      return hero;
    }

    // Usuarios pueden acceder a:
    // 1. Sus propios héroes
    if (hero.owner === userId) {
      return hero;
    }

    // 2. Héroes de administradores
    const heroOwner = await this.userRepository.findById(hero.owner);
    if (heroOwner && heroOwner.role === 'admin') {
      return hero;
    }

    // Si no cumple ninguna condición, denegar acceso
    throw new Error('No tienes permisos para acceder a este héroe');
  }
}

export default VerifyHeroAccessUseCase;
