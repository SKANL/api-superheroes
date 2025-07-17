import path from 'path';
import fs from 'fs';
import dotenv from 'dotenv';
const pkg = require('../../../../package.json');

export class EnvironmentConfig {
  constructor() {
    this.env = process.env.NODE_ENV || 'development';
    this.loadEnvironmentFile();
    this.config = this.buildConfig();
  }
  loadEnvironmentFile() {
    const envFile = path.join(process.cwd(), `.env.${this.env}`);
    const defaultEnvFile = path.join(process.cwd(), '.env');
    if (fs.existsSync(envFile)) {
      dotenv.config({ path: envFile });
      console.log(`📁 Loaded environment from: .env.${this.env}`);
    } else if (fs.existsSync(defaultEnvFile)) {
      dotenv.config({ path: defaultEnvFile });
      console.log('📁 Loaded environment from: .env');
    }
  }
  buildConfig() {
    return {
      app: {
        name: process.env.APP_NAME || 'Parity API',
        timezone: process.env.TZ || 'UTC',
      },
      logging: {
        level:
          process.env.LOG_LEVEL ||
          (this.env === 'production' ? 'info' : 'debug'),
        enablePerformance: process.env.ENABLE_PERFORMANCE_LOGGING === 'true',
      },
      security: {
        enableHelmet: process.env.SECURITY_HELMET !== 'false',
        enableXssProtection: process.env.SECURITY_XSS_PROTECTION !== 'false',
      },
      database: {
        type: process.env.DB_TYPE || 'memory',
        maxRecords: parseInt(process.env.MEMORY_MAX_RECORDS) || 10000,
      },
      ssl: {
        enabled: process.env.SSL_ENABLED === 'true',
        port: parseInt(process.env.SSL_PORT) || 3443,
      },
      api: {
        prefix: process.env.API_PREFIX || '/api',
        bodyLimit: process.env.API_BODY_LIMIT || '10mb',
      },
      cache: {
        enabled: process.env.CACHE_ENABLED === 'true',
        maxSize: parseInt(process.env.CACHE_MAX_SIZE) || 1000,
      },
      notifications: {
        enabled: process.env.NOTIFICATIONS_ENABLED === 'true',
      },
      monitoring: {
        enabled: process.env.MONITORING_ENABLED === 'true',
      },
      version: pkg.version,
    };
  }
  getConfig() {
    return this.config;
  }
  get(section) {
    return this.config[section] || {};
  }
  validate() {
    const errors = [];
    if (!this.config.app.name) {
      errors.push('APP_NAME is required');
    }
    if (this.env === 'production') {
      if (
        this.config.security.corsOrigins &&
        this.config.security.corsOrigins.includes('*')
      ) {
        errors.push('CORS_ORIGINS should not include "*" in production');
      }
      if (this.config.logging.level === 'debug') {
        console.warn('⚠️  DEBUG logging enabled in production');
      }
      if (!this.config.ssl.enabled) {
        console.warn('⚠️  SSL not enabled in production');
      }
    }
    if (this.config.database.type !== 'memory') {
      if (!this.config.database.host || !this.config.database.name) {
        errors.push('Database configuration incomplete');
      }
    }
    if (errors.length > 0) {
      throw new Error(`Configuration validation failed: ${errors.join(', ')}`);
    }
  }
  isDevelopment() {
    return this.env === 'development';
  }
  isProduction() {
    return this.env === 'production';
  }
  isTest() {
    return this.env === 'test';
  }
  getDebugInfo() {
    return {
      nodeVersion: process.version,
      platform: process.platform,
      arch: process.arch,
      env: this.env,
      pid: process.pid,
      uptime: process.uptime(),
      memoryUsage: process.memoryUsage(),
      cwd: process.cwd(),
      timezone: this.config.app.timezone,
      configSections: Object.keys(this.config),
    };
  }
  exportConfig(filePath) {
    const configToExport = {
      ...this.config,
      database: {
        ...this.config.database,
        password: this.config.database.password ? '***HIDDEN***' : undefined,
      },
      notifications: {
        ...this.config.notifications,
      },
    };
    fs.writeFileSync(filePath, JSON.stringify(configToExport, null, 2), 'utf8');
  }
}
