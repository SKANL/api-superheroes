import { AuthService } from '../../../domain/services/AuthService.js';

export class RegisterUserUseCase {
  constructor(userRepository) {
    this.userRepository = userRepository;
  }

  async execute({ username, email, password, role = 'user' }) {
    const existing = await this.userRepository.findByEmail(email);
    if (existing) {
      throw new Error('Email ya registrado');
    }
    
    // Validar que el rol sea válido
    if (!['admin', 'user'].includes(role)) {
      throw new Error('Rol inválido. Debe ser "admin" o "user"');
    }
    
    const passwordHash = await AuthService.hashPassword(password);
    const user = await this.userRepository.create({ username, email, passwordHash, role });
    return user;
  }
}
