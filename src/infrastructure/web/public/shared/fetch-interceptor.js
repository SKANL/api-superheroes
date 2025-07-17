/**
 * Interceptor global de fetch para agregar automáticamente el token JWT
 * Esta solución intercepta todas las llamadas fetch() y agrega el header Authorization
 * sin necesidad de modificar cada archivo individual
 */

(function() {
  'use strict';

  // Guardar la función fetch original
  const originalFetch = window.fetch;

  // Función para verificar si una URL requiere autenticación
  function requiresAuth(url) {
    // Rutas que requieren autenticación (ajustar según necesidades)
    const authRequiredPaths = [
      '/api/heroes',
      '/api/villains', 
      '/api/battles',
      '/api/team-battles'
    ];
    
    // Rutas que NO requieren autenticación
    const publicPaths = [
      '/api/auth/login',
      '/api/auth/signup'
    ];

    // Si es una ruta pública, no agregar token
    if (publicPaths.some(path => url.includes(path))) {
      return false;
    }

    // Si es una ruta que requiere auth, agregar token
    return authRequiredPaths.some(path => url.includes(path));
  }

  // Función interceptora de fetch
  window.fetch = function(url, options = {}) {
    // Si la URL requiere autenticación, agregar token
    if (requiresAuth(url)) {
      const token = localStorage.getItem('token');
      
      if (token) {
        // Asegurar que headers existe
        options.headers = options.headers || {};
        
        // Agregar Authorization header si no existe ya
        if (!options.headers.Authorization && !options.headers.authorization) {
          options.headers.Authorization = `Bearer ${token}`;
          console.log('🔐 Token agregado automáticamente a fetch:', url);
        }
      } else {
        console.warn('⚠️ Token no encontrado para URL que requiere auth:', url);
      }
    }

    // Llamar a la función fetch original con los headers modificados
    return originalFetch.call(this, url, options)
      .then(response => {
        // Opcional: manejar respuestas 401 (no autorizado)
        if (response.status === 401 && requiresAuth(url)) {
          console.warn('🚫 Respuesta 401 - Token posiblemente expirado');
          // Opcional: disparar evento para que la aplicación maneje el logout
          window.dispatchEvent(new CustomEvent('tokenExpired', {
            detail: { url, response }
          }));
        }
        return response;
      })
      .catch(error => {
        console.error('❌ Error en fetch interceptado:', error);
        throw error;
      });
  };

  // Mantener las propiedades originales de fetch
  Object.setPrototypeOf(window.fetch, originalFetch);
  Object.defineProperty(window.fetch, 'name', { value: 'fetch' });

  console.log('✅ Interceptor de fetch configurado correctamente');

  // Opcional: Listener para token expirado
  window.addEventListener('tokenExpired', function(e) {
    console.log('🔄 Token expirado detectado, considerar logout automático');
    // Aquí puedes agregar lógica para logout automático si es necesario
  });

})();
