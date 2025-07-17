// Configuración de Swagger UI para Villains Manager
window.addEventListener('DOMContentLoaded', function() {
  // Verificar que los elementos necesarios estén disponibles
  if (typeof SwaggerUIBundle === 'undefined') {
    console.error('SwaggerUIBundle no está disponible');
    return;
  }
  
  if (!document.getElementById('swagger-ui')) {
    console.error('Elemento #swagger-ui no encontrado');
    return;
  }

  // Esperar a que SwaggerAuth esté disponible
  function initializeSwagger() {
    if (typeof window.SwaggerAuth === 'undefined') {
      console.log('Esperando a que SwaggerAuth se cargue...');
      setTimeout(initializeSwagger, 100);
      return;
    }

    try {
      // Configuración base de Swagger UI
      const baseConfig = {
        url: '/api/docs/swagger-villains.json',
        dom_id: '#swagger-ui',
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
          console.log('Swagger UI para Villains cargado correctamente');
        },
        onFailure: function(error) {
          console.error('Error cargando Swagger UI para Villains:', error);
        }
      };

      // Inicializar Swagger UI con configuración de autenticación automática
      SwaggerUIBundle(window.SwaggerAuth.createSwaggerConfig(baseConfig));
      
      // Configurar listener para cambios de autenticación
      window.SwaggerAuth.setupAuthListener();
    } catch (error) {
      console.error('Error al inicializar Swagger UI para Villains:', error);
    }
  }

  initializeSwagger();
});
