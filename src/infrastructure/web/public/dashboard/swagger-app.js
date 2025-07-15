// Configuración de Swagger UI para el Panel de Control (Dashboard)
window.addEventListener('DOMContentLoaded', function() {
  // Inicializamos solo el Swagger UI principal (el de la sección de API Documentation)
  SwaggerUIBundle({
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
    defaultModelExpandDepth: 3
  });
});
