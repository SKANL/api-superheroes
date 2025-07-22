import { UserModel } from './schemas/UserSchema.js';
import { IUserRepository } from '../../../application/interfaces/repositories/IUserRepository.js';
import { User } from '../../../domain/entities/User.js';

export class MongoUserRepository extends IUserRepository {
  async create({ username, email, passwordHash, role = 'user' }) {
    const doc = await UserModel.create({ username, email, passwordHash, role });
    return new User({ 
      id: doc._id.toString(), 
      username: doc.username, 
      email: doc.email, 
      passwordHash: doc.passwordHash, 
      role: doc.role,
      createdAt: doc.createdAt 
    });
  }

  async findByEmail(email) {
    const doc = await UserModel.findOne({ email });
    if (!doc) return null;
    return new User({ 
      id: doc._id.toString(), 
      username: doc.username, 
      email: doc.email, 
      passwordHash: doc.passwordHash, 
      role: doc.role || 'user',
      createdAt: doc.createdAt 
    });
  }

  async findById(id) {
    const doc = await UserModel.findById(id);
    if (!doc) return null;
    return new User({ 
      id: doc._id.toString(), 
      username: doc.username, 
      email: doc.email, 
      passwordHash: doc.passwordHash, 
      role: doc.role || 'user',
      createdAt: doc.createdAt 
    });
  }

  async findByRole(role) {
    const docs = await UserModel.find({ role });
    return docs.map(doc => new User({ 
      id: doc._id.toString(), 
      username: doc.username, 
      email: doc.email, 
      passwordHash: doc.passwordHash, 
      role: doc.role || 'user',
      createdAt: doc.createdAt 
    }));
  }
}
