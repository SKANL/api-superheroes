/**
 * Script para migrar datos JSON a MongoDB
 * Este script migra los datos de batalla y batalla por equipos de JSON a MongoDB
 */
import 'dotenv/config';
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import mongoose from 'mongoose';
import { v4 as uuidv4 } from 'uuid';

// Cargar modelos
import UserSchema from '../src/infrastructure/adapters/repositories/schemas/UserSchema.js';
import BattleSchema from '../src/infrastructure/adapters/repositories/schemas/BattleSchema.js';
import TeamBattleSchema from '../src/infrastructure/adapters/repositories/schemas/TeamBattleSchema.js';

// Obtener el directorio actual
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Configurar conexión a MongoDB
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/superheroes-api';

// Archivos de datos
const BATTLES_JSON_FILE = path.join(__dirname, '../data/battles.json');
const TEAM_BATTLES_JSON_FILE = path.join(__dirname, '../data/teamBattles.json');

// Crear usuario admin por defecto
const DEFAULT_ADMIN = {
  username: 'admin',
  email: 'admin@example.com',
  passwordHash: '$2a$10$eShxG5Gv27eVYB2A5Mt8WeYCcpR3gsSyjNqjEu7MKh1iK1b3bVo/a', // 'admin123'
  createdAt: new Date()
};

// Crear usuarios de prueba
const TEST_USERS = [
  {
    username: 'user1',
    email: 'user1@example.com',
    passwordHash: '$2a$10$zN4RM/UCbCVY/oH8YXh31eRxWmKz5NeNTA5poPO67FfgsSzLPoVNS', // 'password1'
    createdAt: new Date()
  },
  {
    username: 'user2',
    email: 'user2@example.com',
    passwordHash: '$2a$10$mkmvDX8QcN5Y3RjK2X6R8.7J.gNPzTEH0Kio1a5FRUCPzsYz7GPeS', // 'password2'
    createdAt: new Date()
  }
];

/**
 * Migrar datos a MongoDB
 */
async function migrateDataToMongoDB() {
  try {
    // Conectar a MongoDB
    console.log('Conectando a MongoDB...');
    await mongoose.connect(MONGODB_URI);
    console.log('Conexión a MongoDB establecida');

    // Crear usuarios
    console.log('Creando usuarios...');
    const User = mongoose.model('User', UserSchema);
    
    // Limpiar colecciones
    await User.deleteMany({});
    
    // Insertar usuario admin
    const adminUser = await User.create(DEFAULT_ADMIN);
    console.log(`Usuario admin creado con ID: ${adminUser._id}`);
    
    // Insertar usuarios de prueba
    const testUsersResult = await User.insertMany(TEST_USERS);
    console.log(`${testUsersResult.length} usuarios de prueba creados`);
    
    // Obtener todos los usuarios para asignar batallas
    const users = await User.find({});
    
    // Migrar batallas
    await migrateBattles(users);
    
    // Migrar batallas por equipos
    await migrateTeamBattles(users);
    
    console.log('Migración completada con éxito');
  } catch (error) {
    console.error('Error durante la migración:', error);
  } finally {
    // Cerrar conexión
    await mongoose.disconnect();
    console.log('Conexión a MongoDB cerrada');
  }
}

/**
 * Migrar batallas
 */
async function migrateBattles(users) {
  try {
    console.log('Migrando batallas...');
    const Battle = mongoose.model('Battle', BattleSchema);
    
    // Limpiar colección
    await Battle.deleteMany({});
    
    // Leer archivo JSON
    const battlesData = JSON.parse(await fs.readFile(BATTLES_JSON_FILE, 'utf8'));
    
    if (!Array.isArray(battlesData)) {
      throw new Error('El archivo de batallas no contiene un array');
    }
    
    // Asignar propietarios aleatorios a las batallas y convertir a formato MongoDB
    const battles = battlesData.map(battle => {
      const randomUser = users[Math.floor(Math.random() * users.length)];
      return {
        ...battle,
        owner: randomUser._id.toString()
      };
    });
    
    // Insertar batallas
    const result = await Battle.insertMany(battles);
    console.log(`${result.length} batallas migradas correctamente`);
  } catch (error) {
    console.error('Error migrando batallas:', error);
  }
}

/**
 * Migrar batallas por equipos
 */
async function migrateTeamBattles(users) {
  try {
    console.log('Migrando batallas por equipos...');
    const TeamBattle = mongoose.model('TeamBattle', TeamBattleSchema);
    
    // Limpiar colección
    await TeamBattle.deleteMany({});
    
    // Leer archivo JSON
    const teamBattlesData = JSON.parse(await fs.readFile(TEAM_BATTLES_JSON_FILE, 'utf8'));
    
    if (!Array.isArray(teamBattlesData)) {
      throw new Error('El archivo de batallas por equipos no contiene un array');
    }
    
    // Asignar propietarios aleatorios a las batallas por equipos y convertir a formato MongoDB
    const teamBattles = teamBattlesData.map(teamBattle => {
      const randomUser = users[Math.floor(Math.random() * users.length)];
      return {
        ...teamBattle,
        owner: randomUser._id.toString()
      };
    });
    
    // Insertar batallas por equipos
    const result = await TeamBattle.insertMany(teamBattles);
    console.log(`${result.length} batallas por equipos migradas correctamente`);
  } catch (error) {
    console.error('Error migrando batallas por equipos:', error);
  }
}

// Ejecutar migración
migrateDataToMongoDB();
