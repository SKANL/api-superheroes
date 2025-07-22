import { IUserRepository } from '../../../application/interfaces/repositories/IUserRepository.js';
import { User } from '../../../domain/entities/User.js';

export class InMemoryUserRepository extends IUserRepository {
  constructor() {
    super();
    this.users = [];
    this.nextId = 1;
  }

  async create({ username, email, passwordHash, role = 'user' }) {
    const user = new User({
      id: String(this.nextId++),
      username,
      email,
      passwordHash,
      role,
      createdAt: new Date()
    });
    this.users.push(user);
    return user;
  }

  async findByEmail(email) {
    return this.users.find(u => u.email === email) || null;
  }

  async findById(id) {
    return this.users.find(u => u.id === id) || null;
  }
}
