// Script para crear usuario administrador inicial
import 'dotenv/config';
import mongoose from 'mongoose';
import { AuthService } from '../src/domain/services/AuthService.js';
import { UserModel } from '../src/infrastructure/adapters/repositories/schemas/UserSchema.js';

const mongoUri = process.env.MONGODB_URI || process.env.MONGO_URI;
if (!mongoUri) {
  console.error('No se encontró la URI de MongoDB en las variables de entorno');
  process.exit(1);
}

async function createInitialAdmin() {
  try {
    await mongoose.connect(mongoUri);
    console.log('✅ Conectado a MongoDB');

    // Verificar si ya existe un admin
    const existingAdmin = await UserModel.findOne({ role: 'admin' });
    if (existingAdmin) {
      console.log('⚠️ Ya existe un usuario administrador:', existingAdmin.email);
      await mongoose.disconnect();
      return;
    }

    // Crear usuario administrador inicial
    const adminData = {
      username: 'admin',
      email: 'admin@superheroes.com',
      passwordHash: await AuthService.hashPassword('admin123'),
      role: 'admin'
    };

    const admin = await UserModel.create(adminData);
    console.log('👑 Usuario administrador creado:');
    console.log('  Email: admin@superheroes.com');
    console.log('  Password: admin123');
    console.log('  Role: admin');
    console.log('  ID:', admin._id);

    // Crear también un usuario normal de ejemplo
    const userPassword = await AuthService.hashPassword('user123');
    const normalUser = await UserModel.create({
      username: 'usuario',
      email: 'usuario@test.com',
      passwordHash: userPassword,
      role: 'user'
    });

    console.log('\n👤 Usuario normal creado:');
    console.log('  Email: usuario@test.com');
    console.log('  Password: user123');
    console.log('  Role: user');
    console.log('  ID:', normalUser._id);

    await mongoose.disconnect();
    console.log('\n✅ Usuarios iniciales creados exitosamente');
  } catch (err) {
    console.error('❌ Error al crear usuarios iniciales:', err);
    process.exit(1);
  }
}

createInitialAdmin();
