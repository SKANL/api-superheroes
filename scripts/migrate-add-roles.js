/**
 * Script de migración para agregar campo role a usuarios existentes
 * Convierte el primer usuario en administrador y el resto en usuarios normales
 */

import fs from 'fs-extra';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const MONGODB_MIGRATION_MARKER = '📧 MIGRACIÓN A MONGODB COMPLETADA';

async function migrateUsersRole() {
  console.log('🔧 Migrando roles de usuarios...');
  
  // Si existe el marcador de MongoDB, no hacer nada (los usuarios de MongoDB ya tienen role)
  if (await fs.pathExists(path.resolve(__dirname, '../data/mongodb-migration-complete.txt'))) {
    console.log('✅ Sistema usando MongoDB - Los usuarios ya tienen roles definidos');
    return;
  }

  // Para sistemas que usan archivos JSON (desarrollo/testing)
  const userDataPath = path.resolve(__dirname, '../data/users.json');
  
  if (!(await fs.pathExists(userDataPath))) {
    console.log('ℹ️ No existe archivo de usuarios. Se crearán usuarios con roles cuando se registren.');
    return;
  }

  try {
    const users = await fs.readJson(userDataPath);
    let migrated = 0;

    // Convertir el primer usuario en admin si no tiene rol
    if (users.length > 0 && !users[0].role) {
      users[0].role = 'admin';
      migrated++;
      console.log(`👑 Usuario "${users[0].username}" convertido a administrador`);
    }

    // Convertir el resto en usuarios normales si no tienen rol
    for (let i = 1; i < users.length; i++) {
      if (!users[i].role) {
        users[i].role = 'user';
        migrated++;
      }
    }

    if (migrated > 0) {
      await fs.writeJson(userDataPath, users, { spaces: 2 });
      console.log(`✅ Migración de roles completada. ${migrated} usuarios actualizados.`);
    } else {
      console.log('ℹ️ Todos los usuarios ya tienen roles asignados.');
    }

  } catch (error) {
    console.error('❌ Error durante la migración de roles:', error);
    process.exit(1);
  }
}

async function createAdminUser() {
  console.log('\n🛠️ Creando usuario administrador por defecto...');
  
  const userDataPath = path.resolve(__dirname, '../data/users.json');
  
  try {
    let users = [];
    
    // Leer usuarios existentes si existen
    if (await fs.pathExists(userDataPath)) {
      users = await fs.readJson(userDataPath);
    } else {
      // Asegurar que el directorio data existe
      await fs.ensureDir(path.resolve(__dirname, '../data'));
    }

    // Verificar si ya existe un administrador
    const adminExists = users.some(user => user.role === 'admin');
    
    if (adminExists) {
      console.log('ℹ️ Ya existe un usuario administrador.');
      return;
    }

    // Crear usuario administrador por defecto
    const adminUser = {
      id: Date.now().toString(),
      username: 'admin',
      email: 'admin@superheroes.com',
      passwordHash: '$2b$10$EIXkRGQ/oU5V4F3gP7g3MOXvvKGcQ3W4qFzOVKz1NbJ1Fy1QxHvO.', // password: admin123
      role: 'admin',
      createdAt: new Date().toISOString()
    };

    users.push(adminUser);
    await fs.writeJson(userDataPath, users, { spaces: 2 });
    
    console.log('✅ Usuario administrador creado:');
    console.log('   📧 Email: admin@superheroes.com');
    console.log('   🔑 Password: admin123');
    console.log('   👑 Rol: admin');

  } catch (error) {
    console.error('❌ Error creando usuario administrador:', error);
    process.exit(1);
  }
}

async function runMigration() {
  console.log('🚀 Iniciando migración de sistema de roles...\n');
  
  await migrateUsersRole();
  await createAdminUser();
  
  console.log('\n✅ Migración de roles completada!');
  console.log('🔐 El sistema ahora soporta roles de usuario:');
  console.log('   👑 admin - Puede crear/editar/eliminar héroes y villanos');
  console.log('   👤 user - Solo puede usar héroes/villanos existentes y editarlos parcialmente');
  console.log('\n📖 Para más información, consulta SISTEMA-RESTRICCIONES-SESIONES.md');
}

// Ejecutar migración si se llama directamente
if (import.meta.url === `file://${process.argv[1]}`) {
  runMigration().catch(console.error);
}

export { runMigration };
