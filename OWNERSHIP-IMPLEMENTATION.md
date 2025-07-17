# Implementación de Sesiones con Aislamiento de Datos

## 🔐 Resumen de Cambios

Se ha implementado un sistema completo de **sesiones con aislamiento de datos** que garantiza que cada usuario solo pueda ver y modificar sus propios datos. Cada usuario tiene su propia "sesión virtual" de datos.

## 🏗️ Arquitectura Implementada

### **1. Entidades de Dominio**
- ✅ **Hero**: Agregado campo `owner` (obligatorio)
- ✅ **Villain**: Agregado campo `owner` (obligatorio)
- ✅ **Battle**: Ya tenía campo `owner` 
- ✅ **TeamBattle**: Ya tenía campo `owner`

### **2. Casos de Uso Actualizados**
- ✅ **CreateHeroUseCase**: Recibe `userId` y asigna como `owner`
- ✅ **CreateVillainUseCase**: Recibe `userId` y asigna como `owner`
- ✅ **ListHeroesUseCase**: Filtra por `owner` del usuario autenticado
- ✅ **ListVillainsUseCase**: Filtra por `owner` del usuario autenticado
- ✅ **FindHeroesByCityUseCase**: Filtra por ciudad AND owner
- ✅ **FindVillainsByCityUseCase**: Filtra por ciudad AND owner

### **3. Nuevos Casos de Uso de Validación**
- ✅ **ValidateHeroOwnershipUseCase**: Verifica propiedad de héroes
- ✅ **ValidateVillainOwnershipUseCase**: Verifica propiedad de villanos

### **4. Repositorios Extendidos**
- ✅ **findByOwner(ownerId)**: Encuentra entidades por propietario
- ✅ **findByCityAndOwner(city, ownerId)**: Búsqueda combinada

### **5. Middleware de Seguridad**
- ✅ **authMiddleware**: Extrae userId del JWT y lo inyecta en `req.user.id`
- ✅ **ownershipMiddleware**: Valida propiedad antes de acceso individual
  - `validateHeroOwnership`
  - `validateVillainOwnership`
  - `validateBattleOwnership` (existente)
  - `validateTeamBattleOwnership` (existente)

### **6. Controladores Actualizados**
- ✅ Todos los métodos reciben `req.user.id` del middleware de autenticación
- ✅ Pasan `userId` a los casos de uso correspondientes

### **7. Rutas Protegidas**
- ✅ **Todas las rutas requieren autenticación** (`authMiddleware`)
- ✅ **Operaciones individuales requieren ownership** (`ownershipMiddleware`)

## 🔒 Flujo de Seguridad

### **Creación de Recursos**
```
Cliente → JWT Token → authMiddleware → Controller → UseCase(data, userId) → Entity(owner: userId)
```

### **Listado de Recursos**
```
Cliente → JWT Token → authMiddleware → Controller → UseCase(userId) → Repository.findByOwner(userId)
```

### **Acceso Individual**
```
Cliente → JWT Token → authMiddleware → ownershipMiddleware → Controller → UseCase
                                     ↓
                          Valida: entity.owner === req.user.id
```

## 📋 Endpoints Afectados

### **Héroes** (`/api/heroes`)
- `POST /` - ✅ Requiere auth, asigna owner
- `GET /` - ✅ Requiere auth, filtra por owner
- `GET /city/:city` - ✅ Requiere auth, filtra por owner + ciudad
- `GET /:id` - ✅ Requiere auth + ownership
- `PUT /:id` - ✅ Requiere auth + ownership
- `DELETE /:id` - ✅ Requiere auth + ownership

### **Villanos** (`/api/villains`)
- `POST /` - ✅ Requiere auth, asigna owner
- `GET /` - ✅ Requiere auth, filtra por owner
- `GET /city/:city` - ✅ Requiere auth, filtra por owner + ciudad
- `GET /:id` - ✅ Requiere auth + ownership
- `PUT /:id` - ✅ Requiere auth + ownership
- `DELETE /:id` - ✅ Requiere auth + ownership

### **Batallas** (`/api/battles`)
- Todos los endpoints ya tenían validación de ownership

### **Batallas por Equipos** (`/api/teamBattles`)
- Todos los endpoints ya tenían validación de ownership

## 🛠️ Scripts y Utilidades

### **Migración de Datos**
```bash
npm run migrate:add-owner
```
- Asigna `owner: 'migration-default-user'` a datos existentes
- Preserva datos con owner ya asignado

### **Tests de Seguridad**
```bash
npm run test:security
```
- Pruebas de autenticación
- Pruebas de aislamiento de datos
- Pruebas de ownership

## 🚀 Cómo Usar el Sistema

### **1. Crear Usuario**
```bash
POST /api/auth/signup
{
  "username": "usuario1",
  "email": "usuario1@test.com", 
  "password": "password123"
}
```

### **2. Iniciar Sesión**
```bash
POST /api/auth/login
{
  "email": "usuario1@test.com",
  "password": "password123"
}
# Respuesta: { "token": "jwt.token.here", "user": {...} }
```

### **3. Usar Endpoints Protegidos**
```bash
GET /api/heroes
Authorization: Bearer jwt.token.here
```

## ✅ Garantías de Seguridad

1. **Autenticación Obligatoria**: Todos los endpoints requieren JWT válido
2. **Aislamiento de Datos**: Los usuarios solo ven sus propios datos
3. **Validación de Ownership**: No se puede acceder a recursos de otros usuarios
4. **Integridad de Datos**: Nuevos recursos se asignan automáticamente al usuario autenticado

## 🧪 Testing

El sistema incluye tests exhaustivos que verifican:
- ❌ Acceso sin autenticación → 401
- ❌ Acceso a datos de otros usuarios → 403
- ✅ Acceso solo a propios datos → 200
- ✅ Filtrado correcto en listados
- ✅ Búsquedas por ciudad respetan ownership

## 📊 Estado de Implementación

| Componente | Estado |
|------------|--------|
| Entidades Domain | ✅ Completado |
| Casos de Uso | ✅ Completado |
| Repositorios | ✅ Completado |
| Middleware | ✅ Completado |
| Controladores | ✅ Completado |
| Rutas | ✅ Completado |
| Tests | ✅ Completado |
| Migración | ✅ Completado |
| Documentación | ✅ Completado |

## 🎯 Resultado Final

**Cada usuario tiene ahora su propia "sesión virtual"** donde:
- Solo ve sus héroes, villanos, batallas y team battles
- No puede acceder a datos de otros usuarios
- Todos los nuevos datos se crean automáticamente con su ownership
- El sistema mantiene la seguridad a nivel de dominio y base de datos
