import express from 'express';
import { LoggerMiddleware } from '../middleware/logger.middleware.js';
import { CorsMiddleware } from '../middleware/cors.middleware.js';
import { SecurityMiddleware } from '../middleware/security.middleware.js';
import { rateLimitInstance } from '../middleware/rate-limit.middleware.js';
import fs from 'fs';
const pkg = JSON.parse(
  fs.readFileSync(new URL('../../../package.json', import.meta.url))
);
import path from 'path';
export class ServerConfig {
  constructor() {
    this.app = express();
    this.port = process.env.PORT || 3000;
    this.env = process.env.NODE_ENV || 'development';
  }

  setupMiddleware() {
    // Middlewares globales
    this.app.use(LoggerMiddleware.detailed());
    // CORS configurado para orígenes permitidos (incluye localhost:5173)
    this.app.use(CorsMiddleware.permissive());
    this.app.use(SecurityMiddleware.helmet());
    this.app.use(
      rateLimitInstance.basic({ windowMs: 15 * 60 * 1000, maxRequests: 200 })
    );
    this.app.use(express.json({ limit: '10mb', type: 'application/json' }));
    this.app.use(express.urlencoded({ extended: true, limit: '10mb' }));
    // Serve Team Battle Manager static assets
    this.app.use(
      '/api/team-battles-manager',
      express.static(
        path.join(process.cwd(), 'src/infrastructure/web/public/team-battles-manager')
      )
    );
    // Serve Heroes Manager static assets
    this.app.use(
      '/api/heroes-manager',
      express.static(
        path.join(process.cwd(), 'src/infrastructure/web/public/heroes-manager')
      )
    );
    // Serve Villains Manager static assets
    this.app.use(
      '/api/villains-manager',
      express.static(
        path.join(process.cwd(), 'src/infrastructure/web/public/villains-manager')
      )
    );
    
    // Serve Auth static assets
    this.app.use(
      '/auth',
      express.static(
        path.join(process.cwd(), 'src/infrastructure/web/public/auth')
      )
    );
    
    // Serve shared static assets
    this.app.use(
      '/shared',
      express.static(
        path.join(process.cwd(), 'src/infrastructure/web/public/shared')
      )
    );
    
    // Serve Swagger custom assets for all UIs
    this.app.use(
      '/swagger-custom',
      express.static(
        path.join(process.cwd(), 'src/infrastructure/web/public/swagger-custom')
      )
    );
    
    // Serve Swagger custom assets for API routes (relative paths from /api/)
    this.app.use(
      '/api/swagger-custom',
      express.static(
        path.join(process.cwd(), 'src/infrastructure/web/public/swagger-custom')
      )
    );
    
    // Serve shared assets for API routes (relative paths from /api/)
    this.app.use(
      '/api/shared',
      express.static(
        path.join(process.cwd(), 'src/infrastructure/web/public/shared')
      )
    );
    
    // Other static assets
    this.app.use(
      '/api/villains-manager',
      express.static(
        path.join(process.cwd(), 'src/infrastructure/web/public/villains-manager')
      )
    );
    // Serve Battles Manager static assets
    this.app.use(
      '/api/battles-manager',
      express.static(
        path.join(process.cwd(), 'src/infrastructure/web/public/battles-manager')
      )
    );
    // Serve Dashboard static assets
    this.app.use(
      '/dashboard',
      express.static(
        path.join(process.cwd(), 'src/infrastructure/web/public/dashboard')
      )
    );
  }

  setupRoutes(routes) {
    // Ruta raíz - Redirección al dashboard
    this.app.get('/', (req, res) => {
      res.redirect('/auth');
    });
    
    // Ruta de estado API (movida desde /)
    this.app.get('/api/status', (req, res) => {
      res.json({
        success: true,
        message: 'API is running',
        version: pkg.version,
        environment: this.env,
        timestamp: new Date().toISOString(),
      });
    });
    if (routes.health) this.app.use('/health', routes.health);
    if (routes.api) {
      const api = routes.api;
      if (api.heroes) this.app.use('/api/heroes', api.heroes);
      if (api.villains) this.app.use('/api/villains', api.villains);
      if (api.battles) this.app.use('/api/battles', api.battles);
      if (api.teamBattles) this.app.use('/api/team-battles', api.teamBattles);
    if (api.auth) {
      // Ruta auth con prefijo /api (para API)
      this.app.use('/api/auth', api.auth);
      // Ruta auth sin prefijo /api (para compatibilidad con frontend)
      this.app.use('/auth', api.auth);
    }
    if (api.cities) this.app.use('/api/cities', api.cities);
    }
    // Team Battle Manager UI
    this.app.get('/api/team-battles-manager', (_req, res) => {
      res.sendFile(
        path.join(
          process.cwd(),
          'src/infrastructure/web/public/team-battles-manager/index.html'
        )
      );
    });
    // Heroes Manager UI
    this.app.get('/api/heroes-manager', (_req, res) => {
      res.sendFile(
        path.join(
          process.cwd(),
          'src/infrastructure/web/public/heroes-manager/index.html'
        )
      );
    });
    // Villains Manager UI
    this.app.get('/api/villains-manager', (_req, res) => {
      res.sendFile(
        path.join(
          process.cwd(),
          'src/infrastructure/web/public/villains-manager/index.html'
        )
      );
    });
    // Battles Manager UI
    this.app.get('/api/battles-manager', (_req, res) => {
      res.sendFile(
        path.join(
          process.cwd(),
          'src/infrastructure/web/public/battles-manager/index.html'
        )
      );
    });
    // Dashboard UI
    this.app.get('/dashboard', (_req, res) => {
      res.sendFile(
        path.join(
          process.cwd(),
          'src/infrastructure/web/public/dashboard/index.html'
        )
      );
    });
    // Auth UI
    this.app.get('/auth', (_req, res) => {
      res.sendFile(
        path.join(
          process.cwd(),
          'src/infrastructure/web/public/auth/index.html'
        )
      );
    });
    
    // Test Swagger UI
    this.app.get('/test-swagger', (_req, res) => {
      res.sendFile(
        path.join(
          process.cwd(),
          'src/infrastructure/web/public/test-swagger.html'
        )
      );
    });
    
    // Test Simple Swagger UI
    this.app.get('/test-simple', (_req, res) => {
      res.sendFile(
        path.join(
          process.cwd(),
          'src/infrastructure/web/public/test-simple.html'
        )
      );
    });
    
    // Test Filter Swagger UI
    this.app.get('/test-filter', (_req, res) => {
      res.sendFile(
        path.join(
          process.cwd(),
          'src/infrastructure/web/public/test-filter.html'
        )
      );
    });
    
    // La ruta de docs la monta SwaggerConfig.setup, no agregar otro router vacío
    // if (routes.docs) this.app.use('/api/docs', routes.docs);
  }

  setupErrorHandling() {
    // Manejo de rutas no encontradas (404)
    this.app.use((req, res, next) => {
      res.status(404).json({ error: 'Not Found', path: req.originalUrl });
    });
    // Manejador global de errores
    this.app.use((err, req, res, next) => {
      // No exponer stack en producción
      const errorResponse = {
        error: err.message || 'Internal Server Error',
        ...(this.env !== 'production' && { stack: err.stack }),
      };
      res.status(err.status || 500).json(errorResponse);
    });
  }

  async start() {
    return new Promise((resolve, reject) => {
      try {
        this.app.listen(this.port, () => {
          console.log(`🚀 API listening on port ${this.port} (${this.env})`);
          resolve();
        });
      } catch (error) {
        reject(error);
      }
    });
  }

  validateEnvironment() {
    const requiredEnvVars = ['NODE_ENV'];
    const missingVars = requiredEnvVars.filter(
      varName => !process.env[varName]
    );
    if (missingVars.length > 0) {
      console.warn(
        `⚠️  Missing environment variables: ${missingVars.join(', ')}`
      );
    }
    process.env.NODE_ENV = process.env.NODE_ENV || 'development';
    process.env.PORT = process.env.PORT || '3000';
    process.env.CORS_ORIGINS =
      process.env.CORS_ORIGINS || 'http://localhost:3000,http://localhost:3001,http://localhost:5173';
  }
}

export const app = new ServerConfig().app;
