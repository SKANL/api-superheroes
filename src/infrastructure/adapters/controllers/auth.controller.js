import { JWTService } from '../../../domain/services/JWTService.js';

export class AuthController {
  constructor({ registerUserUseCase, loginUserUseCase, getUserProfileUseCase }) {
    this.registerUserUseCase = registerUserUseCase;
    this.loginUserUseCase = loginUserUseCase;
    this.getUserProfileUseCase = getUserProfileUseCase;
  }

  async signup(req, res) {
    try {
      const user = await this.registerUserUseCase.execute(req.body);
      const token = JWTService.sign({ userId: user.id });
      res.status(201).json({ token, user });
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  }

  async login(req, res) {
    try {
      const result = await this.loginUserUseCase.execute(req.body);
      res.json(result);
    } catch (err) {
      res.status(401).json({ error: err.message });
    }
  }

  async me(req, res) {
    try {
      const profile = await this.getUserProfileUseCase.execute(req.user.id);
      res.json(profile);
    } catch (err) {
      res.status(404).json({ error: err.message });
    }
  }
}
