// Configuración de Swagger UI para Villains Manager
window.addEventListener('DOMContentLoaded', function() {
  SwaggerUIBundle({
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
    defaultModelExpandDepth: 3
  });
});
