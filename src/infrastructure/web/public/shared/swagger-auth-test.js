/**
 * Script de pruebas para verificar la implementación de autenticación automática
 * Este archivo puede ser cargado en cualquier página para probar las funciones
 */

(function() {
  'use strict';

  console.log('🧪 Iniciando pruebas de autenticación automática...');

  // Test 1: Verificar que el módulo swagger-auth esté disponible
  async function testModuleImport() {
    try {
      const module = await import('/shared/swagger-auth.js');
      console.log('✅ Test 1: Módulo swagger-auth importado correctamente');
      console.log('   - Funciones disponibles:', Object.keys(module));
      return true;
    } catch (error) {
      console.error('❌ Test 1: Error al importar módulo swagger-auth:', error);
      return false;
    }
  }

  // Test 2: Verificar localStorage
  function testLocalStorage() {
    try {
      const token = localStorage.getItem('token');
      if (token) {
        console.log('✅ Test 2: Token encontrado en localStorage');
        console.log('   - Token (primeros 20 chars):', token.substring(0, 20) + '...');
      } else {
        console.log('⚠️ Test 2: No hay token en localStorage');
      }
      return true;
    } catch (error) {
      console.error('❌ Test 2: Error al acceder a localStorage:', error);
      return false;
    }
  }

  // Test 3: Verificar que Swagger UI esté disponible
  function testSwaggerUI() {
    if (typeof SwaggerUIBundle !== 'undefined') {
      console.log('✅ Test 3: SwaggerUIBundle está disponible');
      return true;
    } else {
      console.log('⚠️ Test 3: SwaggerUIBundle no está disponible en esta página');
      return false;
    }
  }

  // Test 4: Simular configuración de Swagger
  async function testSwaggerConfig() {
    try {
      const { createSwaggerConfig } = await import('/shared/swagger-auth.js');
      
      const mockConfig = {
        url: '/api/docs/test.json',
        dom_id: '#test-ui',
        onComplete: () => console.log('Mock onComplete ejecutado'),
        onFailure: (error) => console.log('Mock onFailure ejecutado:', error)
      };

      const enhancedConfig = createSwaggerConfig(mockConfig);
      
      console.log('✅ Test 4: Configuración de Swagger creada correctamente');
      console.log('   - requestInterceptor:', typeof enhancedConfig.requestInterceptor === 'function' ? 'Presente' : 'Ausente');
      console.log('   - onComplete:', typeof enhancedConfig.onComplete === 'function' ? 'Presente' : 'Ausente');
      
      return true;
    } catch (error) {
      console.error('❌ Test 4: Error al crear configuración de Swagger:', error);
      return false;
    }
  }

  // Test 5: Probar interceptor de peticiones
  async function testRequestInterceptor() {
    try {
      const { createSwaggerConfig } = await import('/shared/swagger-auth.js');
      
      const mockConfig = { url: '/test' };
      const enhancedConfig = createSwaggerConfig(mockConfig);
      
      // Simular una petición
      const mockRequest = {
        headers: {}
      };
      
      const interceptedRequest = enhancedConfig.requestInterceptor(mockRequest);
      
      if (interceptedRequest.headers.Authorization) {
        console.log('✅ Test 5: Interceptor agregó header Authorization');
        console.log('   - Header:', interceptedRequest.headers.Authorization.substring(0, 20) + '...');
      } else {
        console.log('⚠️ Test 5: Interceptor no agregó header (posiblemente no hay token)');
      }
      
      return true;
    } catch (error) {
      console.error('❌ Test 5: Error en interceptor de peticiones:', error);
      return false;
    }
  }

  // Test 6: Verificar funciones globales de debugging
  function testGlobalFunctions() {
    if (window.swaggerAuth) {
      console.log('✅ Test 6: Funciones globales de debugging disponibles');
      console.log('   - Funciones:', Object.keys(window.swaggerAuth));
      
      // Probar función isAuthenticated
      const isAuth = window.swaggerAuth.isAuthenticated();
      console.log('   - isAuthenticated():', isAuth);
      
      return true;
    } else {
      console.log('⚠️ Test 6: Funciones globales no disponibles (normal si el módulo no se ha cargado aún)');
      return false;
    }
  }

  // Ejecutar todas las pruebas
  async function runAllTests() {
    console.log('🏁 Ejecutando batería de pruebas...\n');
    
    const results = [];
    
    results.push(await testModuleImport());
    results.push(testLocalStorage());
    results.push(testSwaggerUI());
    results.push(await testSwaggerConfig());
    results.push(await testRequestInterceptor());
    results.push(testGlobalFunctions());
    
    const passed = results.filter(r => r === true).length;
    const total = results.length;
    
    console.log(`\n📊 Resultados: ${passed}/${total} pruebas pasaron`);
    
    if (passed === total) {
      console.log('🎉 ¡Todas las pruebas pasaron! El sistema está funcionando correctamente.');
    } else {
      console.log('⚠️ Algunas pruebas fallaron. Revisa los logs anteriores para más detalles.');
    }
    
    return passed === total;
  }

  // Función para probar manualmente desde la consola
  window.testSwaggerAuth = runAllTests;
  
  // Auto-ejecutar si no estamos en producción
  if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
    setTimeout(runAllTests, 1000); // Esperar 1 segundo para que todo se cargue
  }

  console.log('🔧 Para ejecutar las pruebas manualmente, usa: testSwaggerAuth()');

})();
