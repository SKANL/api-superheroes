/**
 * Script de migración para agregar campo owner a entidades existentes
 * Asigna un usuario por defecto a todos los héroes y villanos existentes
 */

import fs from 'fs-extra';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DATA_DIR = path.resolve(__dirname, '../data');

const DEFAULT_USER_ID = 'migration-default-user';

async function migrateHeroes() {
  const heroesPath = path.join(DATA_DIR, 'superheroes.json');
  
  try {
    console.log('🔄 Migrando héroes...');
    const heroes = await fs.readJson(heroesPath);
    
    let migrated = 0;
    const updatedHeroes = heroes.map(hero => {
      if (!hero.owner) {
        migrated++;
        return { ...hero, owner: DEFAULT_USER_ID };
      }
      return hero;
    });
    
    await fs.writeJson(heroesPath, updatedHeroes, { spaces: 2 });
    console.log(`✅ ${migrated} héroes migrados con owner: ${DEFAULT_USER_ID}`);
  } catch (error) {
    console.log('ℹ️ No se encontró archivo de héroes o está vacío');
  }
}

async function migrateVillains() {
  const villainsPath = path.join(DATA_DIR, 'villains.json');
  
  try {
    console.log('🔄 Migrando villanos...');
    const villains = await fs.readJson(villainsPath);
    
    let migrated = 0;
    const updatedVillains = villains.map(villain => {
      if (!villain.owner) {
        migrated++;
        return { ...villain, owner: DEFAULT_USER_ID };
      }
      return villain;
    });
    
    await fs.writeJson(villainsPath, updatedVillains, { spaces: 2 });
    console.log(`✅ ${migrated} villanos migrados con owner: ${DEFAULT_USER_ID}`);
  } catch (error) {
    console.log('ℹ️ No se encontró archivo de villanos o está vacío');
  }
}

async function migrateBattles() {
  const battlesPath = path.join(DATA_DIR, 'battles.json');
  
  try {
    console.log('🔄 Verificando batallas...');
    const battles = await fs.readJson(battlesPath);
    
    let migrated = 0;
    const updatedBattles = battles.map(battle => {
      if (!battle.owner) {
        migrated++;
        return { ...battle, owner: DEFAULT_USER_ID };
      }
      return battle;
    });
    
    if (migrated > 0) {
      await fs.writeJson(battlesPath, updatedBattles, { spaces: 2 });
      console.log(`✅ ${migrated} batallas migradas con owner: ${DEFAULT_USER_ID}`);
    } else {
      console.log('✅ Todas las batallas ya tienen owner');
    }
  } catch (error) {
    console.log('ℹ️ No se encontró archivo de batallas o está vacío');
  }
}

async function migrateTeamBattles() {
  const teamBattlesPath = path.join(DATA_DIR, 'teamBattles.json');
  
  try {
    console.log('🔄 Verificando batallas por equipos...');
    const teamBattles = await fs.readJson(teamBattlesPath);
    
    let migrated = 0;
    const updatedTeamBattles = teamBattles.map(teamBattle => {
      if (!teamBattle.owner) {
        migrated++;
        return { ...teamBattle, owner: DEFAULT_USER_ID };
      }
      return teamBattle;
    });
    
    if (migrated > 0) {
      await fs.writeJson(teamBattlesPath, updatedTeamBattles, { spaces: 2 });
      console.log(`✅ ${migrated} batallas por equipos migradas con owner: ${DEFAULT_USER_ID}`);
    } else {
      console.log('✅ Todas las batallas por equipos ya tienen owner');
    }
  } catch (error) {
    console.log('ℹ️ No se encontró archivo de batallas por equipos o está vacío');
  }
}

async function createDefaultUser() {
  // Nota: Este script no crea el usuario en la base de datos
  // El usuario por defecto debe ser creado manualmente o en un script separado
  console.log(`ℹ️ Nota: Asegúrate de crear el usuario con ID: ${DEFAULT_USER_ID}`);
  console.log('   Puedes usar el endpoint /api/auth/signup para crear usuarios');
}

async function runMigration() {
  console.log('🚀 Iniciando migración de datos para ownership...\n');
  
  await migrateHeroes();
  await migrateVillains();
  await migrateBattles();
  await migrateTeamBattles();
  await createDefaultUser();
  
  console.log('\n✅ Migración completada!');
  console.log('📝 Los datos existentes ahora tienen un owner asignado');
  console.log('🔐 Nuevos datos requerirán autenticación para ser creados');
}

// Ejecutar migración si se llama directamente
if (import.meta.url === `file://${process.argv[1]}`) {
  runMigration().catch(console.error);
}

export { runMigration };
