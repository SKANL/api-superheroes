import { AuthService } from '../../../domain/services/AuthService.js';

export class RegisterUserUseCase {
  constructor(userRepository) {
    this.userRepository = userRepository;
  }

  async execute({ username, email, password }) {
    const existing = await this.userRepository.findByEmail(email);
    if (existing) {
      throw new Error('Email ya registrado');
    }
    const passwordHash = await AuthService.hashPassword(password);
    const user = await this.userRepository.create({ username, email, passwordHash });
    return user;
  }
}
