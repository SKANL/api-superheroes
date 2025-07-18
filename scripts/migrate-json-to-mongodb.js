#!/usr/bin/env node

/**
 * Script de migración de datos JSON a MongoDB
 * Migra héroes y villanos de archivos JSON a la base de datos MongoDB
 */

import 'dotenv/config';
import fs from 'fs-extra';
import path from 'path';
import { MongoDBConfig } from '../src/infrastructure/config/mongodb.config.js';
import { HeroModel } from '../src/infrastructure/adapters/repositories/schemas/HeroSchema.js';
import { VillainModel } from '../src/infrastructure/adapters/repositories/schemas/VillainSchema.js';
import { UserModel } from '../src/infrastructure/adapters/repositories/schemas/UserSchema.js';

// Configurar DB_TYPE para MongoDB
process.env.DB_TYPE = 'mongodb';

const HEROES_JSON_PATH = path.resolve('data/superheroes.json');
const VILLAINS_JSON_PATH = path.resolve('data/villains.json');

async function createDefaultUser() {
  console.log('📄 Creando usuario por defecto para datos sin owner...');
  
  const defaultUser = await UserModel.findOne({ email: 'migration@default.com' });
  if (defaultUser) {
    console.log('✅ Usuario por defecto ya existe:', defaultUser._id);
    return defaultUser._id;
  }

  const newUser = await UserModel.create({
    username: 'migration-default',
    email: 'migration@default.com',
    password: 'defaultpassword123',
    role: 'user'
  });
  
  console.log('✅ Usuario por defecto creado:', newUser._id);
  return newUser._id;
}

async function migrateHeroes(defaultUserId) {
  console.log('🦸 Iniciando migración de héroes...');
  
  let heroesData = [];
  try {
    heroesData = await fs.readJson(HEROES_JSON_PATH);
    console.log(`📊 ${heroesData.length} héroes encontrados en JSON`);
  } catch (error) {
    console.log('⚠️ No se encontró archivo de héroes JSON o está vacío');
    return;
  }

  // Limpiar colección existente
  await HeroModel.deleteMany({});
  console.log('🗑️ Colección de héroes limpiada');

  let migratedCount = 0;
  let skippedCount = 0;

  for (const heroData of heroesData) {
    try {
      // Asegurar que tiene owner, si no, usar el usuario por defecto
      const owner = heroData.owner || defaultUserId;
      
      // Mapear campos del JSON a esquema MongoDB
      const mongoHeroData = {
        name: heroData.name,
        alias: heroData.alias,
        city: heroData.city,
        team: heroData.team,
        hpMax: heroData.hpMax || heroData.health || 100,
        hpCurrent: heroData.hpCurrent || heroData.health || 100,
        attack: heroData.attack || 50,
        defense: heroData.defense || 30,
        specialAbility: heroData.specialAbility || 'Basic Attack',
        isAlive: heroData.isAlive !== undefined ? heroData.isAlive : true,
        roundsWon: heroData.roundsWon || 0,
        damage: heroData.damage || 0,
        status: heroData.status || 'normal',
        stamina: heroData.stamina || 100,
        speed: heroData.speed || 50,
        critChance: heroData.critChance || 10,
        teamAffinity: heroData.teamAffinity || 0,
        energyCost: heroData.energyCost || 20,
        damageReduction: heroData.damageReduction || 0,
        owner: owner
      };

      await HeroModel.create(mongoHeroData);
      migratedCount++;
      console.log(`✅ Héroe migrado: ${heroData.alias}`);
    } catch (error) {
      console.error(`❌ Error migrando héroe ${heroData.alias}:`, error.message);
      skippedCount++;
    }
  }

  console.log(`🎉 Migración de héroes completada: ${migratedCount} migrados, ${skippedCount} omitidos`);
}

async function migrateVillains(defaultUserId) {
  console.log('🦹 Iniciando migración de villanos...');
  
  let villainsData = [];
  try {
    villainsData = await fs.readJson(VILLAINS_JSON_PATH);
    console.log(`📊 ${villainsData.length} villanos encontrados en JSON`);
  } catch (error) {
    console.log('⚠️ No se encontró archivo de villanos JSON o está vacío');
    return;
  }

  // Limpiar colección existente
  await VillainModel.deleteMany({});
  console.log('🗑️ Colección de villanos limpiada');

  let migratedCount = 0;
  let skippedCount = 0;

  for (const villainData of villainsData) {
    try {
      // Asegurar que tiene owner, si no, usar el usuario por defecto
      const owner = villainData.owner || defaultUserId;
      
      // Mapear campos del JSON a esquema MongoDB
      const mongoVillainData = {
        name: villainData.name,
        alias: villainData.alias,
        city: villainData.city,
        health: villainData.health || 100,
        attack: villainData.attack || 50,
        defense: villainData.defense || 30,
        specialAbility: villainData.specialAbility || 'Dark Attack',
        isAlive: villainData.isAlive !== undefined ? villainData.isAlive : true,
        roundsWon: villainData.roundsWon || 0,
        damage: villainData.damage || 0,
        status: villainData.status || 'normal',
        stamina: villainData.stamina || 100,
        speed: villainData.speed || 50,
        critChance: villainData.critChance || 10,
        teamAffinity: villainData.teamAffinity || 0,
        energyCost: villainData.energyCost || 20,
        damageReduction: villainData.damageReduction || 0,
        owner: owner
      };

      await VillainModel.create(mongoVillainData);
      migratedCount++;
      console.log(`✅ Villano migrado: ${villainData.alias}`);
    } catch (error) {
      console.error(`❌ Error migrando villano ${villainData.alias}:`, error.message);
      skippedCount++;
    }
  }

  console.log(`🎉 Migración de villanos completada: ${migratedCount} migrados, ${skippedCount} omitidos`);
}

async function main() {
  console.log('🚀 Iniciando migración de datos JSON a MongoDB...');
  console.log('📋 Este script migrará héroes y villanos a MongoDB');
  
  // Conectar a MongoDB
  const mongodb = new MongoDBConfig();
  try {
    const connection = await mongodb.connect();
    if (!connection) {
      throw new Error('No se pudo conectar a MongoDB');
    }
    console.log('✅ Conectado a MongoDB');
    
    // Crear usuario por defecto para datos sin owner
    const defaultUserId = await createDefaultUser();
    
    // Migrar datos
    await migrateHeroes(defaultUserId);
    await migrateVillains(defaultUserId);
    
    console.log('');
    console.log('🎉 ¡Migración completada exitosamente!');
    console.log('📝 Los datos han sido transferidos de archivos JSON a MongoDB');
    console.log('⚙️ Ahora puedes configurar DB_TYPE=mongodb en tu .env');
    console.log('🗃️ Los archivos JSON originales permanecen intactos');
    
  } catch (error) {
    console.error('❌ Error durante la migración:', error);
    process.exit(1);
  } finally {
    // Cerrar conexión
    await mongodb.disconnect();
    console.log('🔌 Conexión a MongoDB cerrada');
    process.exit(0);
  }
}

// Verificar si se está ejecutando directamente
if (import.meta.url === `file://${process.argv[1]}`) {
  main().catch(console.error);
}
