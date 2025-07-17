// Configuración de Swagger UI para el Panel de Control (Dashboard)
window.addEventListener('DOMContentLoaded', function() {
  // Esperar a que SwaggerAuth esté disponible
  function initializeSwagger() {
    if (typeof window.SwaggerAuth === 'undefined') {
      console.log('Esperando a que SwaggerAuth se cargue...');
      setTimeout(initializeSwagger, 100);
      return;
    }

    // Configuración base de Swagger UI
    const baseConfig = {
      url: '/api/docs/swagger.json',
      dom_id: '#swagger-ui-main',
      presets: [SwaggerUIBundle.presets.apis, SwaggerUIStandalonePreset],
      layout: 'StandaloneLayout',
      filter: true,
      tagsSorter: 'alpha',
      docExpansion: 'list',
      deepLinking: true,
      displayRequestDuration: true,
      showExtensions: true,
      operationsSorter: 'alpha',
      supportedSubmitMethods: ['get', 'put', 'post', 'delete', 'patch'],
      persistAuthorization: true,
      tryItOutEnabled: true,
      defaultModelsExpandDepth: -1,
      defaultModelExpandDepth: 3,
      onComplete: function() {
        console.log('Swagger UI para Dashboard cargado correctamente');
      },
      onFailure: function(error) {
        console.error('Error cargando Swagger UI para Dashboard:', error);
      }
    };

    // Inicializar Swagger UI con configuración de autenticación automática
    SwaggerUIBundle(window.SwaggerAuth.createSwaggerConfig(baseConfig));
    
    // Configurar listener para cambios de autenticación
    window.SwaggerAuth.setupAuthListener();
  }

  initializeSwagger();
});
