/**
 * Configuración de autenticación automática para Swagger UI
 * Este módulo proporciona funciones para configurar automáticamente
 * el token JWT en todas las interfaces de Swagger UI
 * 
 * NOTA: Convertido a formato compatible con CSP (sin ES6 modules)
 */

// Namespace global para evitar conflictos
window.SwaggerAuth = window.SwaggerAuth || {};

// Variable global para evitar múltiples listeners
let authListenerSetup = false;

/**
 * Crea una configuración de Swagger UI con autenticación automática
 * @param {Object} baseConfig - Configuración base de Swagger UI
 * @returns {Object} Configuración extendida con autenticación automática
 */
window.SwaggerAuth.createSwaggerConfig = function(baseConfig) {
  return Object.assign({}, baseConfig, {
    requestInterceptor: function(request) {
      const token = localStorage.getItem('token');
      if (token) {
        request.headers = request.headers || {};
        request.headers.Authorization = 'Bearer ' + token;
        console.log('🔐 Token agregado automáticamente a la petición');
      }
      return request;
    },
    onComplete: function() {
      const token = localStorage.getItem('token');
      if (token && window.ui) {
        // Configurar la autorización automáticamente
        window.ui.preauthorizeApiKey('bearerAuth', token);
        console.log('✅ Token configurado automáticamente en Swagger UI');
      } else if (!token) {
        console.log('⚠️ No hay token disponible para configurar en Swagger UI');
      }
      
      // Ejecutar callback original si existe
      if (baseConfig.onComplete) {
        baseConfig.onComplete();
      }
    },
    onFailure: function(error) {
      console.error('❌ Error en Swagger UI:', error);
      
      // Ejecutar callback original si existe
      if (baseConfig.onFailure) {
        baseConfig.onFailure(error);
      }
    }
  });
};

/**
 * Actualiza el token en una instancia de Swagger UI ya existente
 * @param {string} newToken - Nuevo token JWT
 */
window.SwaggerAuth.updateSwaggerToken = function(newToken) {
  if (window.ui) {
    if (newToken) {
      window.ui.preauthorizeApiKey('bearerAuth', newToken);
      console.log('🔄 Token actualizado en Swagger UI');
    } else {
      // Limpiar autorización si no hay token
      window.ui.preauthorizeApiKey('bearerAuth', '');
      console.log('🧹 Autorización limpiada en Swagger UI');
    }
  }
};

/**
 * Configura un listener para cambios en el estado de autenticación
 */
window.SwaggerAuth.setupAuthListener = function() {
  // Evitar configurar múltiples listeners
  if (authListenerSetup) {
    return;
  }

  // Escuchar cambios en localStorage (para múltiples pestañas)
  window.addEventListener('storage', function(e) {
    if (e.key === 'token') {
      window.SwaggerAuth.updateSwaggerToken(e.newValue);
      console.log('📱 Token actualizado desde otra pestaña');
    }
  });

  // Escuchar eventos personalizados de autenticación
  window.addEventListener('authStateChanged', function(e) {
    const token = e.detail.isAuthenticated ? localStorage.getItem('token') : null;
    window.SwaggerAuth.updateSwaggerToken(token);
    console.log('🎭 Evento personalizado de autenticación recibido');
  });

  authListenerSetup = true;
  console.log('✅ Listeners de autenticación configurados');
};

/**
 * Función para disparar manualmente la configuración del token
 * Útil para llamar después de un login exitoso
 */
window.SwaggerAuth.triggerTokenUpdate = function() {
  const token = localStorage.getItem('token');
  window.SwaggerAuth.updateSwaggerToken(token);
  console.log('🎯 Actualización manual del token ejecutada');
};

/**
 * Función para verificar si el usuario está autenticado
 * @returns {boolean} True si está autenticado
 */
window.SwaggerAuth.isAuthenticated = function() {
  const token = localStorage.getItem('token');
  return !!token;
};

// Exponer funciones para debugging (compatibilidad con versión anterior)
window.swaggerAuth = {
  updateToken: window.SwaggerAuth.updateSwaggerToken,
  triggerUpdate: window.SwaggerAuth.triggerTokenUpdate,
  isAuthenticated: window.SwaggerAuth.isAuthenticated
};

console.log('📦 SwaggerAuth cargado correctamente - Versión compatible con CSP');
