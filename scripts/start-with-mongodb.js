#!/usr/bin/env node

/**
 * Script para iniciar el proyecto con MongoDB
 * Configurado para iniciar la aplicación con la base de datos MongoDB
 */

// Establecer variables de entorno
process.env.NODE_ENV = 'production';
process.env.DB_TYPE = 'mongodb';
process.env.PORT = process.env.PORT || '3443';

// Importar y ejecutar el archivo principal
import('../index.js').catch(err => {
  console.error('Error iniciando la aplicación:', err);
  process.exit(1);
});
