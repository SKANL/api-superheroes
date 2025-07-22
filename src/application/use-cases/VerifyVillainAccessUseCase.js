// Caso de uso: Verificar si un usuario tiene acceso a un villano
export class VerifyVillainAccessUseCase {
  constructor(villainRepository, userRepository) {
    this.villainRepository = villainRepository;
    this.userRepository = userRepository;
  }

  async execute(villainId, userId) {
    const villain = await this.villainRepository.findById(villainId);
    if (!villain) {
      throw new Error('Villano no encontrado');
    }

    const user = await this.userRepository.findById(userId);
    if (!user) {
      throw new Error('Usuario no encontrado');
    }

    // Administradores pueden acceder a cualquier villano
    if (user.role === 'admin') {
      return villain;
    }

    // Usuarios pueden acceder a:
    // 1. Sus propios villanos
    if (villain.owner === userId) {
      return villain;
    }

    // 2. Villanos de administradores
    const villainOwner = await this.userRepository.findById(villain.owner);
    if (villainOwner && villainOwner.role === 'admin') {
      return villain;
    }

    // Si no cumple ninguna condición, denegar acceso
    throw new Error('No tienes permisos para acceder a este villano');
  }
}

export default VerifyVillainAccessUseCase;
