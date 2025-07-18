# 📋 Prerrequisitos para la Migración

## ⚠️ MongoDB Requerido

Para completar la migración a MongoDB, necesitas tener MongoDB instalado y ejecutándose en tu sistema.

### 🔧 Instalación de MongoDB en Windows

#### Opción 1: MongoDB Community Server
1. Descargar desde: https://www.mongodb.com/try/download/community
2. Ejecutar el instalador
3. Configurar como servicio de Windows

#### Opción 2: Usando Chocolatey
```powershell
choco install mongodb
```

#### Opción 3: Usando Docker
```bash
docker run -d -p 27017:27017 --name mongodb mongo:latest
```

### 🚀 Iniciar MongoDB

#### Como servicio de Windows:
```powershell
net start MongoDB
```

#### Manualmente:
```powershell
mongod --dbpath C:\data\db
```

#### Con Docker:
```bash
docker start mongodb
```

### ✅ Verificar que MongoDB está funcionando
```bash
# Verificar proceso
Get-Process -Name "mongod"

# Conectar con mongo shell
mongo
# o con mongosh si tienes la versión nueva
mongosh
```

## 🔄 Después de Instalar MongoDB

Una vez que MongoDB esté instalado y ejecutándose:

1. **Ejecutar migración:**
   ```bash
   npm run migrate:json-to-mongodb
   ```

2. **Configurar variables de entorno:**
   ```env
   DB_TYPE=mongodb
   MONGODB_URI=mongodb://localhost:27017/api-superheroes
   ```

3. **Iniciar la aplicación:**
   ```bash
   npm start
   ```

## 🧪 Alternativa para Testing

Si prefieres probar sin instalar MongoDB, puedes usar los repositorios en memoria:

```env
# En .env o comentar DB_TYPE
DB_TYPE=memory
```

O mantener los archivos JSON temporalmente:
```env
DB_TYPE=json
```
