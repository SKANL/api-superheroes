// Configuración de base de datos para Clean Architecture
class DatabaseConfig {
  constructor() {
    this.type = process.env.DB_TYPE || 'memory';
    this.config = this.getConfig();
  }

  getConfig() {
    switch (this.type) {
      case 'postgresql':
        return this.getPostgreSQLConfig();
      case 'mongodb':
        return this.getMongoDBConfig();
      case 'mysql':
        return this.getMySQLConfig();
      case 'memory':
      default:
        return this.getInMemoryConfig();
    }
  }

  getPostgreSQLConfig() {
    return {
      type: 'postgresql',
      host: process.env.DB_HOST || 'localhost',
      port: parseInt(process.env.DB_PORT) || 5432,
      database: process.env.DB_NAME || 'parity_api',
      username: process.env.DB_USER || 'postgres',
      password: process.env.DB_PASSWORD || '',
      ssl: process.env.DB_SSL === 'true',
      poolSize: parseInt(process.env.DB_POOL_SIZE) || 10,
      connectionTimeout: parseInt(process.env.DB_CONNECTION_TIMEOUT) || 30000,
      idleTimeout: parseInt(process.env.DB_IDLE_TIMEOUT) || 10000,
      schema: 'public',
    };
  }

  getMongoDBConfig() {
    return {
      type: 'mongodb',
      uri: process.env.MONGODB_URI || 'mongodb://localhost:27017/parity_api',
      options: {
        maxPoolSize: parseInt(process.env.DB_POOL_SIZE) || 10,
      },
    };
  }

  getMySQLConfig() {
    return {
      type: 'mysql',
      host: process.env.DB_HOST || 'localhost',
      port: parseInt(process.env.DB_PORT) || 3306,
      database: process.env.DB_NAME || 'parity_api',
      username: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD || '',
      charset: 'utf8mb4',
      timezone: '+00:00',
      pool: {
        max: parseInt(process.env.DB_POOL_SIZE) || 10,
        idle: parseInt(process.env.DB_IDLE_TIMEOUT) || 10000,
      },
    };
  }

  getInMemoryConfig() {
    return {
      type: 'memory',
      maxRecords: parseInt(process.env.MEMORY_MAX_RECORDS) || 10000,
      cleanupInterval: parseInt(process.env.MEMORY_CLEANUP_INTERVAL) || 300000,
      persistToFile: process.env.MEMORY_PERSIST_FILE || null,
    };
  }

  validate() {
    // Validación básica, puede expandirse
    if (!this.type) throw new Error('DB_TYPE is required');
  }

  getConnectionString() {
    const config = this.config;
    switch (this.type) {
      case 'postgresql':
        return `postgresql://${config.username}:${config.password}@${config.host}:${config.port}/${config.database}`;
      case 'mysql':
        return `mysql://${config.username}:${config.password}@${config.host}:${config.port}/${config.database}`;
      case 'mongodb':
        return config.uri;
      case 'memory':
        return 'memory://local';
      default:
        throw new Error(
          `Cannot generate connection string for type: ${this.type}`
        );
    }
  }

  isProduction() {
    return process.env.NODE_ENV === 'production';
  }

  getMigrationConfig() {
    return {
      directory: './migrations',
      tableName: 'knex_migrations',
      schemaName: this.config.schema || 'public',
      disableTransactions: false,
    };
  }
}
module.exports = { DatabaseConfig };
