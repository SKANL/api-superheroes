export class GetUserProfileUseCase {
  constructor(userRepository) {
    this.userRepository = userRepository;
  }

  async execute(userId) {
    const user = await this.userRepository.findById(userId);
    if (!user) {
      throw new Error('Usuario no encontrado');
    }
    return { 
      id: user.id, 
      username: user.username, 
      email: user.email, 
      role: user.role || 'user' // Por compatibilidad con usuarios existentes
    };
  }
}
