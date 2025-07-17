import { AuthService } from '../../../domain/services/AuthService.js';
import { JWTService } from '../../../domain/services/JWTService.js';

export class LoginUserUseCase {
  constructor(userRepository) {
    this.userRepository = userRepository;
  }

  async execute({ email, password }) {
    const user = await this.userRepository.findByEmail(email);
    if (!user) {
      throw new Error('Credenciales inválidas');
    }
    const valid = await AuthService.comparePassword(password, user.passwordHash);
    if (!valid) {
      throw new Error('Credenciales inválidas');
    }
    const token = JWTService.sign({ userId: user.id });
    return { token, user: { id: user.id, username: user.username, email: user.email } };
  }
}
