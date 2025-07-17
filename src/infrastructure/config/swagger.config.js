import swaggerJsDoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';

export class SwaggerConfig {
  constructor() {
    this.options = {
      definition: {
        openapi: '3.0.0',
        info: {
          title: 'Clean Architecture API',
          version: '1.0.0',
          description: 'API REST implementada con Clean Architecture',
        },
        components: {
          securitySchemes: {
            bearerAuth: {
              type: 'http',
              scheme: 'bearer',
              bearerFormat: 'JWT',
            }
          }
        },
        security: [
          {
            bearerAuth: []
          }
        ]
      },
      // Patrón relativo desde la raíz del proyecto (Windows y Unix)
      apis: ['src/**/*.js', 'src/infrastructure/web/routes/auth.routes.js'], // Incluye todos los archivos .js y específicamente auth.routes.js
    };
  }
  
  filterSpecsByTags(specs, allowedTags) {
    const filteredSpecs = JSON.parse(JSON.stringify(specs)); // Deep clone
    
    // Filter paths
    const filteredPaths = {};
    Object.keys(specs.paths || {}).forEach(path => {
      const pathItem = specs.paths[path];
      const filteredPathItem = {};
      
      Object.keys(pathItem).forEach(method => {
        const operation = pathItem[method];
        if (operation.tags && operation.tags.some(tag => allowedTags.includes(tag))) {
          filteredPathItem[method] = operation;
        }
      });
      
      if (Object.keys(filteredPathItem).length > 0) {
        filteredPaths[path] = filteredPathItem;
      }
    });
    
    filteredSpecs.paths = filteredPaths;
    
    // Filter tags
    if (filteredSpecs.tags) {
      filteredSpecs.tags = filteredSpecs.tags.filter(tag => allowedTags.includes(tag.name));
    }
    
    return filteredSpecs;
  }

  setup(app) {
    const specs = swaggerJsDoc(this.options);
    
    // Serve Swagger JSON for custom UI
    app.get('/api/docs/swagger.json', (_req, res) => {
      res.json(specs);
    });
    
    // Serve filtered Swagger JSON for specific tags
    app.get('/api/docs/swagger-heroes.json', (_req, res) => {
      const filteredSpecs = this.filterSpecsByTags(specs, ['Heroes']);
      res.json(filteredSpecs);
    });
    
    app.get('/api/docs/swagger-villains.json', (_req, res) => {
      const filteredSpecs = this.filterSpecsByTags(specs, ['Villains']);
      res.json(filteredSpecs);
    });
    
    app.get('/api/docs/swagger-battles.json', (_req, res) => {
      const filteredSpecs = this.filterSpecsByTags(specs, ['Battles']);
      res.json(filteredSpecs);
    });
    
    app.get('/api/docs/swagger-team-battles.json', (_req, res) => {
      const filteredSpecs = this.filterSpecsByTags(specs, ['TeamBattles', 'Heroes', 'Villains']);
      res.json(filteredSpecs);
    });
    
    // Default Swagger UI
    app.use('/api/docs', swaggerUi.serve, swaggerUi.setup(specs));

    const createSwaggerUIOptions = (title, tags) => ({
        swaggerOptions: {
            tagsSorter: 'alpha',
            filter: true,
            persistAuthorization: true,
            docExpansion: 'list',
            defaultModelsExpandDepth: -1,
            defaultModelExpandDepth: 3,
            displayRequestDuration: true,
            tryItOutEnabled: true,
            showExtensions: true,
            operationsSorter: 'alpha',
            supportedSubmitMethods: ['get', 'put', 'post', 'delete', 'patch'],
        },
        customCss: '.swagger-ui .topbar { display: none }',
        customSiteTitle: `API Superheroes - ${title} Documentation`,
        customfavIcon: '/swagger-custom/favicon.png',
        customJs: '/swagger-custom/custom.js',
    });

    const setupSwaggerUI = (path, title, tags) => {
        const filteredSpecs = this.filterSpecsByTags(specs, tags);
        app.use(path, swaggerUi.serve, swaggerUi.setup(filteredSpecs, createSwaggerUIOptions(title, tags)));
    };

    setupSwaggerUI('/api/docs/heroes', 'Heroes', ['Heroes']);
    setupSwaggerUI('/api/docs/villains', 'Villains', ['Villains']);
    setupSwaggerUI('/api/docs/battles', 'Battles', ['Battles']);
    setupSwaggerUI('/api/docs/team-battles', 'Team Battles', ['TeamBattles', 'Heroes', 'Villains']);
  }
}
