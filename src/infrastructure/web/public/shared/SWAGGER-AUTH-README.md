# 🔐 Sistema de Autenticación Automática para Swagger UI

## 📋 Descripción

Este sistema permite que el token JWT se configure automáticamente en todas las interfaces de Swagger UI después de que el usuario inicie sesión, eliminando la necesidad de pegar manualmente el token en cada interfaz.

## ✨ Características

- **Configuración automática**: El token se configura automáticamente al cargar Swagger UI
- **Interceptor de peticiones**: Todas las peticiones HTTP incluyen automáticamente el header `Authorization: Bearer {token}`
- **Múltiples pestañas**: Cambios de autenticación se sincronizan entre pestañas
- **Logging detallado**: Mensajes de consola para debugging
- **Compatibilidad**: Funciona con todos los módulos de Swagger UI existentes

## 🛠️ Implementación

### Archivos modificados:

1. **`/shared/swagger-auth.js`** - Módulo principal de autenticación
2. **`/dashboard/swagger-app.js`** - Dashboard con autenticación automática
3. **`/heroes-manager/swagger-app.js`** - Gestor de héroes
4. **`/villains-manager/swagger-app.js`** - Gestor de villanos
5. **`/battles-manager/swagger-app.js`** - Gestor de batallas
6. **`/team-battles-manager/swagger-app.js`** - Gestor de batallas en equipo

### Funciones principales:

#### `createSwaggerConfig(baseConfig)`
Extiende la configuración base de Swagger UI con autenticación automática.

```javascript
import { createSwaggerConfig } from '/shared/swagger-auth.js';

const config = createSwaggerConfig({
  url: '/api/docs/swagger.json',
  dom_id: '#swagger-ui',
  // ... otras configuraciones
});

SwaggerUIBundle(config);
```

#### `setupAuthListener()`
Configura listeners para cambios en el estado de autenticación.

```javascript
import { setupAuthListener } from '/shared/swagger-auth.js';
setupAuthListener();
```

#### `updateSwaggerToken(token)`
Actualiza manualmente el token en Swagger UI.

```javascript
import { updateSwaggerToken } from '/shared/swagger-auth.js';
updateSwaggerToken('nuevo-token-jwt');
```

## 🔍 Funcionamiento

### 1. Al cargar la página
- Se verifica si existe un token en `localStorage`
- Si existe, se configura automáticamente en Swagger UI
- Se muestran logs en consola para debugging

### 2. Durante las peticiones HTTP
- El interceptor `requestInterceptor` agrega automáticamente el header `Authorization`
- Todas las peticiones incluyen el token sin intervención manual

### 3. Al cambiar el estado de autenticación
- Login: El token se configura automáticamente en todas las instancias
- Logout: Se limpia la autorización de todas las instancias
- Cambios se sincronizan entre pestañas del navegador

## 🧪 Testing

### Casos de prueba implementados:

1. **Login exitoso**
   ```
   1. Usuario inicia sesión en /auth
   2. Navega a cualquier interfaz Swagger
   3. ✅ Token debe estar pre-configurado
   ```

2. **Peticiones automáticas**
   ```
   1. Usuario intenta realizar una petición en Swagger UI
   2. ✅ Header Authorization debe incluirse automáticamente
   ```

3. **Logout**
   ```
   1. Usuario hace logout
   2. ✅ Autorización debe limpiarse en todas las interfaces
   ```

4. **Múltiples pestañas**
   ```
   1. Usuario tiene múltiples pestañas abiertas
   2. Hace login en una pestaña
   3. ✅ Otras pestañas deben actualizarse automáticamente
   ```

## 🐛 Debugging

### Mensajes de consola:
- `🔐 Token agregado automáticamente a la petición`
- `✅ Token configurado automáticamente en Swagger UI`
- `🔄 Token actualizado en Swagger UI`
- `🧹 Autorización limpiada en Swagger UI`
- `📱 Token actualizado desde otra pestaña`

### Herramientas de debugging:
```javascript
// Funciones disponibles globalmente para debugging
window.swaggerAuth.updateToken('nuevo-token');
window.swaggerAuth.triggerUpdate();
window.swaggerAuth.isAuthenticated();
```

## 🔧 Configuración adicional

### Para módulos personalizados:
```javascript
import { createSwaggerConfig, setupAuthListener } from '/shared/swagger-auth.js';

// Configuración personalizada
const baseConfig = {
  url: '/api/docs/mi-modulo.json',
  dom_id: '#mi-swagger-ui',
  // ... configuraciones específicas
};

// Aplicar autenticación automática
SwaggerUIBundle(createSwaggerConfig(baseConfig));
setupAuthListener();
```

## 📈 Beneficios

- ✅ **Experiencia de usuario mejorada**: No más pegado manual de tokens
- ✅ **Menos errores**: Eliminación de errores por tokens no configurados
- ✅ **Consistencia**: Comportamiento uniforme en todas las interfaces
- ✅ **Mantenibilidad**: Código centralizado y reutilizable
- ✅ **Debugging**: Logs detallados para troubleshooting

## 🔮 Próximas mejoras

- [ ] Detección automática de tokens expirados
- [ ] Renovación automática de tokens
- [ ] Notificaciones visuales para cambios de autenticación
- [ ] Configuración personalizable de headers
- [ ] Soporte para múltiples esquemas de autenticación
