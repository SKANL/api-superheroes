# 🚀 Guía de Migración de JSON a MongoDB

## Resumen de Cambios Realizados

### ✅ Archivos Creados/Modificados

#### **1. Esquemas MongoDB**
- `src/infrastructure/adapters/repositories/schemas/HeroSchema.js` - Esquema para héroes
- `src/infrastructure/adapters/repositories/schemas/VillainSchema.js` - Esquema para villanos

#### **2. Repositorios MongoDB**
- `src/infrastructure/adapters/repositories/MongoHeroRepository.js` - Repositorio MongoDB para héroes
- `src/infrastructure/adapters/repositories/MongoVillainRepository.js` - Repositorio MongoDB para villanos

#### **3. Scripts de Migración**
- `scripts/migrate-json-to-mongodb.js` - Script para migrar datos JSON a MongoDB

#### **4. Archivos Modificados**
- `src/infrastructure/config/app.js` - Configuración de inyección de dependencias actualizada
- `src/application/interfaces/repositories/HeroRepository.js` - Interfaz actualizada
- `src/application/interfaces/repositories/VillainRepository.js` - Interfaz actualizada
- `package.json` - Script de migración agregado

## 🔄 Proceso de Migración

### Paso 1: Asegurar MongoDB está configurado
```bash
# Verificar que MongoDB esté ejecutándose
# Y que las variables de entorno estén configuradas en .env:
# MONGODB_URI=mongodb://localhost:27017/api-superheroes
```

### Paso 2: Ejecutar migración de datos
```bash
npm run migrate:json-to-mongodb
```

### Paso 3: Configurar para usar MongoDB
```bash
# En tu archivo .env, asegurar:
DB_TYPE=mongodb
```

### Paso 4: Verificar migración
```bash
# Iniciar la aplicación y verificar que funciona correctamente
npm start
```

## 🎯 Endpoints Afectados

### **Heroes CRUD**
- `GET /api/heroes` - ✅ Ahora usa MongoDB
- `GET /api/heroes/:id` - ✅ Ahora usa MongoDB
- `GET /api/heroes/city/:city` - ✅ Ahora usa MongoDB
- `POST /api/heroes` - ✅ Ahora usa MongoDB
- `PUT /api/heroes/:id` - ✅ Ahora usa MongoDB
- `DELETE /api/heroes/:id` - ✅ Ahora usa MongoDB

### **Villains CRUD**
- `GET /api/villains` - ✅ Ahora usa MongoDB
- `GET /api/villains/:id` - ✅ Ahora usa MongoDB
- `GET /api/villains/city/:city` - ✅ Ahora usa MongoDB
- `POST /api/villains` - ✅ Ahora usa MongoDB
- `PUT /api/villains/:id` - ✅ Ahora usa MongoDB
- `DELETE /api/villains/:id` - ✅ Ahora usa MongoDB

### **Endpoints que ya usaban MongoDB**
- ✅ Battle CRUD - Sin cambios
- ✅ TeamBattle CRUD - Sin cambios
- ✅ Auth endpoints - Sin cambios

## 🔧 Configuración por Entorno

### Para Desarrollo
```env
DB_TYPE=mongodb
MONGODB_URI=mongodb://localhost:27017/api-superheroes
```

### Para Testing
```env
NODE_ENV=test
# Los tests seguirán usando repositorios en memoria
```

### Para Producción
```env
NODE_ENV=production
DB_TYPE=mongodb
MONGODB_URI=mongodb://production-server:27017/api-superheroes
```

## 📊 Beneficios de la Migración

### **Rendimiento**
- ✅ Consultas optimizadas con índices MongoDB
- ✅ Búsquedas más rápidas por ciudad, owner, alias
- ✅ Paginación nativa de base de datos

### **Escalabilidad**
- ✅ Manejo de grandes volúmenes de datos
- ✅ Transacciones ACID
- ✅ Replicación y sharding disponibles

### **Consistencia**
- ✅ Todos los datos en una sola base de datos
- ✅ Relaciones referenciadas entre colecciones
- ✅ Validación de esquemas automática

### **Desarrollo**
- ✅ No más archivos JSON que manejar
- ✅ Herramientas de administración (MongoDB Compass)
- ✅ Backups automáticos

## 🚨 Migración de Datos Existentes

El script de migración:
1. **Preserva** todos los archivos JSON originales
2. **Crea** un usuario por defecto para datos sin owner
3. **Mapea** automáticamente los campos JSON a MongoDB
4. **Valida** los datos durante la migración
5. **Reporta** el progreso y errores

## 🔄 Rollback (si es necesario)

Si necesitas volver a usar archivos JSON temporalmente:
```env
# En .env, cambiar:
DB_TYPE=json
# o comentar la línea para usar memoria:
# DB_TYPE=memory
```

## 🧪 Testing

Los tests siguen funcionando normalmente ya que usan repositorios en memoria cuando `NODE_ENV=test`.

```bash
npm test
```

## 📝 Notas Importantes

1. **Los archivos en `data/` ya NO se usan** cuando `DB_TYPE=mongodb`
2. **Los endpoints mantienen la misma API** - sin cambios en las respuestas
3. **La autenticación y autorización** funcionan igual
4. **Los tests no requieren MongoDB** - usan memoria
5. **El script de migración es seguro** - no elimina archivos JSON

---

## ✅ Verificación Post-Migración

Para verificar que todo funciona correctamente:

1. **Iniciar la aplicación**
   ```bash
   npm start
   ```

2. **Probar endpoints de héroes**
   ```bash
   curl -k https://localhost:3443/api/heroes
   ```

3. **Probar endpoints de villanos**
   ```bash
   curl -k https://localhost:3443/api/villains
   ```

4. **Verificar en MongoDB**
   ```bash
   # Conectar a MongoDB y verificar colecciones
   mongo api-superheroes
   db.heroes.find().count()
   db.villains.find().count()
   ```

¡La migración está completa! 🎉
