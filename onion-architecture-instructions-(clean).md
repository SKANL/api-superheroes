# 🏗️ Guía Completa: Clean Architecture para APIs REST con Node.js

## 📋 Índice

1. [Introducción a Clean Architecture](#1-introducción-a-clean-architecture)
2. [Configuración del Proyecto Base](#2-configuración-del-proyecto-base)
3. [Configuración Extendida](#3-configuración-extendida)
4. [Capa de Dominio (Domain Layer)](#4-capa-de-dominio-domain-layer)
5. [Capa de Aplicación (Application Layer)](#5-capa-de-aplicación-application-layer)
6. [Capa de Infraestructura (Infrastructure Layer)](#6-capa-de-infraestructura-infrastructure-layer)
7. [Capa Compartida (Shared Layer)](#7-capa-compartida-shared-layer)
8. [Configuración de Express](#8-configuración-de-express)
9. [Estructura de Testing Completa](#9-estructura-de-testing-completa)
10. [Inyección de Dependencias Manual](#10-inyección-de-dependencias-manual)
11. [Ejemplo Concreto: Sistema Par/Impar](#11-ejemplo-concreto-sistema-parimpar)
12. [Plantillas Genéricas](#12-plantillas-genéricas)
13. [Preguntas para Personalización](#13-preguntas-para-personalización)
14. [Configuración de Producción](#14-configuración-de-producción)
15. [Troubleshooting y Mejores Prácticas](#15-troubleshooting-y-mejores-prácticas)
16. [Validación de Completitud del Tutorial](#16-validación-de-completitud-del-tutorial)

---

## 1. Introducción a Clean Architecture

### 🎯 ¿Qué es Clean Architecture?

Clean Architecture (también conocida como Onion Architecture o Hexagonal Architecture) es un patrón arquitectónico propuesto por Robert C. Martin que separa las preocupaciones del software en capas concéntricas, donde las dependencias apuntan hacia el centro.

### 📐 Principios Fundamentales

#### 1. **Regla de Dependencias**
- Las dependencias del código fuente solo pueden apuntar hacia adentro
- Nada en un círculo interno puede saber algo sobre un círculo externo
- Las entidades no pueden depender de casos de uso, ni casos de uso de controladores

#### 2. **Independencia de Frameworks**
- La arquitectura no depende de la existencia de bibliotecas específicas
- Permite usar frameworks como herramientas, no como restricciones

#### 3. **Testeable**
- Las reglas de negocio pueden probarse sin UI, base de datos, servidor web o cualquier elemento externo

#### 4. **Independiente de UI**
- La UI puede cambiar fácilmente sin cambiar el resto del sistema

#### 5. **Independiente de Base de Datos**
- Puedes cambiar Oracle por SQL Server, MongoDB, BigTable, CouchDB, o algo más

### 🔄 Flujo de Datos

```
Entrada (HTTP) → Controller → Use Case → Entity/Service → Repository → Database
              ↙                ↙           ↙              ↙
         Validation    Business Logic  Domain Rules   Data Access
```

### 📊 Diagrama de Capas

```
┌─────────────────────────────────────────────────────────────┐
│                    FRAMEWORKS & DRIVERS                     │
│  ┌─────────────────────────────────────────────────────┐   │
│  │              INTERFACE ADAPTERS                     │   │
│  │  ┌─────────────────────────────────────────────┐   │   │
│  │  │              APPLICATION                    │   │   │
│  │  │  ┌─────────────────────────────────────┐   │   │   │
│  │  │  │             DOMAIN                  │   │   │   │
│  │  │  │                                     │   │   │   │
│  │  │  │  • Entities                        │   │   │   │
│  │  │  │  • Value Objects                   │   │   │   │
│  │  │  │  • Domain Services                 │   │   │   │
│  │  │  │                                     │   │   │   │
│  │  │  └─────────────────────────────────────┘   │   │   │
│  │  │                                             │   │   │
│  │  │  • Use Cases                                │   │   │
│  │  │  • Application Services                     │   │   │
│  │  │                                             │   │   │
│  │  └─────────────────────────────────────────────┘   │   │
│  │                                                     │   │
│  │  • Controllers                                      │   │
│  │  • Presenters                                       │   │
│  │  • Gateways                                         │   │
│  │                                                     │   │
│  └─────────────────────────────────────────────────────┘   │
│                                                             │
│  • Web                                                      │
│  • DB                                                       │
│  • External Interfaces                                      │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

### 🎪 Capas Explicadas

#### **Domain Layer (Núcleo)**
- **Entidades**: Objetos de negocio con identidad única
- **Value Objects**: Objetos inmutables que se definen por sus atributos
- **Domain Services**: Lógica de negocio que no pertenece naturalmente a una entidad

#### **Application Layer (Casos de Uso)**
- **Use Cases**: Orquestación de la lógica de negocio
- **Interfaces/Ports**: Contratos para servicios externos

#### **Infrastructure Layer (Adaptadores)**
- **Controllers**: Manejo de requests HTTP
- **Repositories**: Implementaciones de acceso a datos
- **External Services**: APIs externas, email, etc.

#### **Shared Layer (Transversal)**
- **Exceptions**: Manejo de errores
- **Constants**: Valores constantes
- **Utils**: Utilidades compartidas

### 🚀 Beneficios para APIs REST Pequeñas/Medianas

1. **Escalabilidad**: Fácil agregar nuevas funcionalidades
2. **Mantenibilidad**: Código organizado y separado por responsabilidades
3. **Testabilidad**: Cada capa puede probarse independientemente
4. **Flexibilidad**: Cambiar tecnologías sin afectar lógica de negocio
5. **Claridad**: Estructura clara para nuevos desarrolladores

### ⚠️ Consideraciones

- **Overhead inicial**: Más estructura inicial para proyectos muy simples
- **Curva de aprendizaje**: Requiere entender los principios SOLID
- **Sobre-ingeniería**: No necesario para scripts simples o prototipos

### 🎯 Cuándo Usar Clean Architecture

**✅ Usar cuando:**
- El proyecto crecerá con el tiempo
- Múltiples desarrolladores trabajarán en el código
- Necesitas alta testabilidad
- Planeas cambiar tecnologías frecuentemente
- Mantienes múltiples versiones del producto

**❌ No usar cuando:**
- Script de una sola vez
- Prototipo rápido
- Aplicación extremadamente simple
- Recursos de desarrollo muy limitados

---

## 2. Configuración del Proyecto Base

### 📁 Estructura de Directorios Estándar

Crear la siguiente estructura de directorios en la raíz del proyecto:

```
proyecto-api/
├── src/
│   ├── domain/                    # Capa de Dominio
│   │   ├── entities/             # Entidades de negocio
│   │   ├── value-objects/        # Objetos de valor inmutables
│   │   └── services/             # Servicios de dominio
│   ├── application/              # Capa de Aplicación
│   │   ├── interfaces/           # Interfaces/Puertos
│   │   │   └── repositories/     # Contratos de repositorios
│   │   └── use-cases/            # Casos de uso
│   ├── infrastructure/           # Capa de Infraestructura
│   │   ├── adapters/             # Adaptadores
│   │   │   ├── controllers/      # Controladores HTTP
│   │   │   └── repositories/     # Implementaciones de repositorios
│   │   ├── config/               # Configuraciones
│   │   ├── middleware/           # Middlewares personalizados
│   │   └── web/                  # Servidor y rutas
│   │       └── routes/           # Definición de rutas
│   └── shared/                   # Código compartido
│       ├── constants/            # Constantes globales
│       ├── exceptions/           # Excepciones personalizadas
│       └── utils/                # Utilidades compartidas
├── tests/                        # Tests organizados por tipo
│   ├── unit/                     # Tests unitarios
│   │   ├── domain/               # Tests de dominio
│   │   ├── application/          # Tests de casos de uso
│   │   └── infrastructure/       # Tests de infraestructura
│   ├── integration/              # Tests de integración
│   └── e2e/                      # Tests end-to-end
├── ssl/                          # Certificados SSL (desarrollo)
├── docs/                         # Documentación
├── scripts/                      # Scripts de utilidades
├── .env                          # Variables de entorno (desarrollo)
├── .env.example                  # Ejemplo de variables de entorno
├── .gitignore                    # Archivos ignorados por Git
├── package.json                  # Configuración del proyecto
├── README.md                     # Documentación principal
├── Dockerfile                    # Configuración de Docker
└── index.js                      # Punto de entrada de la aplicación
```

### 📦 Comando para Crear Estructura

**Windows (PowerShell):**
```powershell
# Crear directorios principales
New-Item -ItemType Directory -Force -Path "src/domain/entities", "src/domain/value-objects", "src/domain/services"
New-Item -ItemType Directory -Force -Path "src/application/interfaces/repositories", "src/application/use-cases"
New-Item -ItemType Directory -Force -Path "src/infrastructure/adapters/controllers", "src/infrastructure/adapters/repositories"
New-Item -ItemType Directory -Force -Path "src/infrastructure/config", "src/infrastructure/middleware", "src/infrastructure/web/routes"
New-Item -ItemType Directory -Force -Path "src/shared/constants", "src/shared/exceptions", "src/shared/utils"
New-Item -ItemType Directory -Force -Path "tests/unit/domain", "tests/unit/application", "tests/unit/infrastructure"
New-Item -ItemType Directory -Force -Path "tests/integration", "tests/e2e"
New-Item -ItemType Directory -Force -Path "ssl", "docs", "scripts"
```

**Linux/Mac (Bash):**
```bash
mkdir -p src/{domain/{entities,value-objects,services},application/{interfaces/repositories,use-cases},infrastructure/{adapters/{controllers,repositories},config,middleware,web/routes},shared/{constants,exceptions,utils}}
mkdir -p tests/{unit/{domain,application,infrastructure},integration,e2e}
mkdir -p ssl docs scripts
```

### 📋 package.json Completo

Crear el archivo `package.json` con todas las dependencias necesarias:

```json
{
  "name": "api-clean-architecture",
  "version": "1.0.0",
  "description": "API REST implementada con Clean Architecture en Node.js/Express",
  "main": "index.js",
  "type": "commonjs",
  "engines": {
    "node": ">=14.0.0",
    "npm": ">=6.0.0"
  },
  "scripts": {
    "start": "node index.js",
    "dev": "nodemon index.js",
    "start:dev": "NODE_ENV=development node index.js",
    "start:prod": "NODE_ENV=production node index.js",
    "test": "jest",
    "test:coverage": "jest --coverage",
    "test:watch": "jest --watch",
    "test:unit": "jest tests/unit",
    "test:integration": "jest tests/integration",
    "test:e2e": "jest tests/e2e",
    "lint": "eslint src/ tests/ --ext .js",
    "lint:fix": "eslint src/ tests/ --ext .js --fix",
    "format": "prettier --write \"src/**/*.js\" \"tests/**/*.js\"",
    "format:check": "prettier --check \"src/**/*.js\" \"tests/**/*.js\"",
    "docs:generate": "jsdoc -c jsdoc.json",
    "docs:serve": "cd docs && python -m http.server 8080",
    "build": "echo 'Build process not needed for Node.js'",
    "clean": "rm -rf coverage/ docs/generated/ tmp/ node_modules/.cache",
    "health": "curl -k https://localhost:3443/api/health",
    "setup": "npm install && npm run format && echo 'Setup complete!'",
    "docker:build": "docker build -t api-clean-architecture .",
    "docker:run": "docker run -p 3443:3443 api-clean-architecture",
    "security:audit": "npm audit",
    "security:fix": "npm audit fix"
  },
  "keywords": [
    "api",
    "rest",
    "nodejs",
    "express",
    "clean-architecture",
    "onion-architecture",
    "hexagonal-architecture",
    "domain-driven-design",
    "ddd",
    "ssl",
    "https",
    "swagger",
    "openapi",
    "jest",
    "tdd",
    "repository-pattern",
    "dependency-injection"
  ],
  "author": {
    "name": "Tu Nombre",
    "email": "tu.email@ejemplo.com",
    "url": "https://github.com/tu-usuario"
  },
  "license": "MIT",
  "repository": {
    "type": "git",
    "url": "https://github.com/tu-usuario/api-clean-architecture.git"
  },
  "bugs": {
    "url": "https://github.com/tu-usuario/api-clean-architecture/issues"
  },
  "homepage": "https://github.com/tu-usuario/api-clean-architecture#readme",
  "dependencies": {
    "express": "^4.18.2",
    "express-validator": "^7.0.1",
    "swagger-jsdoc": "^6.2.8",
    "swagger-ui-express": "^5.0.0",
    "@scalar/express-api-reference": "^0.8.9",
    "selfsigned": "^2.4.1",
    "cors": "^2.8.5",
    "helmet": "^7.0.0",
    "morgan": "^1.10.0",
    "compression": "^1.7.4",
    "express-rate-limit": "^6.7.0",
    "dotenv": "^16.3.1"
  },
  "devDependencies": {
    "jest": "^29.5.0",
    "supertest": "^6.3.3",
    "nodemon": "^3.0.1",
    "eslint": "^8.43.0",
    "eslint-config-standard": "^17.1.0",
    "eslint-plugin-import": "^2.27.5",
    "eslint-plugin-n": "^16.0.1",
    "eslint-plugin-promise": "^6.1.1",
    "prettier": "^2.8.8",
    "jsdoc": "^4.0.2"
  },
  "jest": {
    "testEnvironment": "node",
    "collectCoverageFrom": [
      "src/**/*.js",
      "!src/**/*.test.js",
      "!src/**/*.spec.js",
      "!src/**/index.js"
    ],
    "coverageDirectory": "coverage",
    "coverageReporters": ["text", "lcov", "html", "json"],
    "testMatch": [
      "**/tests/**/*.test.js",
      "**/tests/**/*.spec.js"
    ],
    "coverageThreshold": {
      "global": {
        "branches": 80,
        "functions": 80,
        "lines": 80,
        "statements": 80
      }
    },
    "setupFilesAfterEnv": ["<rootDir>/tests/setup.js"],
    "testTimeout": 10000
  }
}
```

### ⚙️ Scripts npm Explicados

#### **Scripts de Desarrollo**
- `npm run dev`: Ejecuta con nodemon para recarga automática
- `npm start`: Ejecuta en modo producción
- `npm run start:dev`: Ejecuta con NODE_ENV=development
- `npm run start:prod`: Ejecuta con NODE_ENV=production

#### **Scripts de Testing**
- `npm test`: Ejecuta todos los tests
- `npm run test:coverage`: Tests con reporte de cobertura
- `npm run test:watch`: Tests en modo watch
- `npm run test:unit`: Solo tests unitarios
- `npm run test:integration`: Solo tests de integración
- `npm run test:e2e`: Solo tests end-to-end

#### **Scripts de Calidad de Código**
- `npm run lint`: Verifica estilo de código con ESLint
- `npm run lint:fix`: Corrige automáticamente problemas de estilo
- `npm run format`: Formatea código con Prettier
- `npm run format:check`: Verifica formato sin modificar

#### **Scripts de Documentación**
- `npm run docs:generate`: Genera documentación JSDoc
- `npm run docs:serve`: Sirve documentación en puerto 8080

#### **Scripts de Utilidad**
- `npm run clean`: Limpia directorios temporales
- `npm run health`: Verifica estado de la API
- `npm run setup`: Configuración inicial completa

#### **Scripts de Docker y Seguridad**
- `npm run docker:build`: Construye imagen Docker
- `npm run docker:run`: Ejecuta contenedor
- `npm run security:audit`: Auditoría de seguridad
- `npm run security:fix`: Corrige vulnerabilidades automáticamente

### 🔧 Configuración de Herramientas

#### **ESLint (.eslintrc.json)**
```json
{
  "env": {
    "browser": true,
    "commonjs": true,
    "es2021": true,
    "node": true,
    "jest": true
  },
  "extends": [
    "standard"
  ],
  "parserOptions": {
    "ecmaVersion": "latest"
  },
  "rules": {
    "indent": ["error", 2],
    "linebreak-style": ["error", "unix"],
    "quotes": ["error", "single"],
    "semi": ["error", "always"],
    "no-console": "warn",
    "no-unused-vars": "error",
    "prefer-const": "error",
    "no-var": "error"
  },
  "ignorePatterns": [
    "node_modules/",
    "coverage/",
    "docs/generated/"
  ]
}
```

#### **Prettier (.prettierrc)**
```json
{
  "semi": true,
  "trailingComma": "es5",
  "singleQuote": true,
  "printWidth": 80,
  "tabWidth": 2,
  "useTabs": false,
  "bracketSpacing": true,
  "arrowParens": "avoid",
  "endOfLine": "lf"
}
```

#### **GitIgnore (.gitignore)**
```gitignore
# Dependencies
node_modules/
npm-debug.log*
yarn-debug.log*
yarn-error.log*

# Runtime data
pids
*.pid
*.seed
*.pid.lock

# Coverage directory used by tools like istanbul
coverage/
*.lcov

# nyc test coverage
.nyc_output

# Grunt intermediate storage
.grunt

# node-waf configuration
.lock-wscript

# Compiled binary addons
build/Release

# Dependency directories
jspm_packages/

# Optional npm cache directory
.npm

# Optional REPL history
.node_repl_history

# Output of 'npm pack'
*.tgz

# Yarn Integrity file
.yarn-integrity

# dotenv environment variables file
.env
.env.local
.env.development.local
.env.test.local
.env.production.local

# parcel-bundler cache
.cache
.parcel-cache

# next.js build output
.next

# nuxt.js build output
.nuxt

# vuepress build output
.vuepress/dist

# Serverless directories
.serverless

# FuseBox cache
.fusebox/

# DynamoDB Local files
.dynamodb/

# TernJS port file
.tern-port

# Stores VSCode versions used for testing VSCode extensions
.vscode-test

# Logs
logs
*.log

# Runtime data
tmp/

# Documentation
docs/generated/

# IDE
.vscode/
.idea/
*.swp
*.swo

# OS
.DS_Store
Thumbs.db

# SSL certificates (except example)
ssl/*.pem
ssl/*.key
!ssl/README.md
```

#### **JSDoc (jsdoc.json)**
```json
{
  "source": {
    "include": ["./src", "./README.md"],
    "includePattern": "\\.(js|jsx)$",
    "exclude": ["node_modules/", "tests/", "coverage/"]
  },
  "opts": {
    "destination": "./docs/generated/"
  },
  "plugins": ["plugins/markdown"],
  "templates": {
    "cleverLinks": false,
    "monospaceLinks": false
  }
}
```

#### **Variables de Entorno (.env.example)**
```env
# Server Configuration
NODE_ENV=development
PORT=3443
HOST=localhost
API_PREFIX=/api

# SSL Configuration
SSL_CERT_PATH=./ssl/cert.pem
SSL_KEY_PATH=./ssl/key.pem

# Database Configuration (si aplica)
DB_HOST=localhost
DB_PORT=5432
DB_NAME=api_database
DB_USER=api_user
DB_PASSWORD=api_password

# External Services (si aplica)
EXTERNAL_API_URL=https://api.ejemplo.com
EXTERNAL_API_KEY=tu_api_key_aqui

# Logging
LOG_LEVEL=debug
LOG_FILE=./logs/app.log

# Security
JWT_SECRET=tu_jwt_secret_super_seguro
SESSION_SECRET=tu_session_secret

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
```

### 🚀 Comandos de Instalación

#### **1. Instalación de Dependencias**
```bash
npm install
```

#### **2. Configuración de Git (opcional)**
```bash
git init
git add .
git commit -m "Initial commit: Clean Architecture project setup"
```

#### **3. Verificar Configuración**
```bash
npm run lint
npm run format:check
npm test
```

### ✅ Validación de Configuración

Para verificar que todo está configurado correctamente:

1. **Verificar estructura de directorios:**
   ```bash
   # Windows
   Get-ChildItem -Recurse -Directory
   
   # Linux/Mac
   find . -type d
   ```

2. **Verificar dependencias:**
   ```bash
   npm list
   ```

3. **Verificar scripts:**
   ```bash
   npm run
   ```

4. **Ejecutar tests básicos:**
   ```bash
   npm test
   ```

---

## 3. Configuración Extendida

### 🌐 Variables de Entorno Completas

#### **Archivo .env para Desarrollo**
Crear el archivo `.env` en la raíz del proyecto:

```env
# ===========================================
# CONFIGURACIÓN DEL SERVIDOR
# ===========================================
NODE_ENV=development
PORT=3443
HOST=localhost
API_PREFIX=/api

# ===========================================
# CONFIGURACIÓN SSL/HTTPS
# ===========================================
SSL_CERT_PATH=./ssl/cert.pem
SSL_KEY_PATH=./ssl/key.pem
SSL_ENABLED=true

# ===========================================
# CONFIGURACIÓN DE BASE DE DATOS
# ===========================================
# PostgreSQL
DB_TYPE=postgresql
DB_HOST=localhost
DB_PORT=5432
DB_NAME=api_clean_architecture
DB_USER=api_user
DB_PASSWORD=secure_password
DB_SSL=false
DB_POOL_MIN=2
DB_POOL_MAX=10

# MongoDB (alternativo)
MONGO_URI=mongodb://localhost:27017/api_clean_architecture
MONGO_OPTIONS={"useNewUrlParser":true,"useUnifiedTopology":true}

# ===========================================
# SERVICIOS EXTERNOS
# ===========================================
EXTERNAL_API_URL=https://jsonplaceholder.typicode.com
EXTERNAL_API_KEY=your_api_key_here
EXTERNAL_API_TIMEOUT=5000

# Email Service
EMAIL_SERVICE=smtp
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password

# ===========================================
# LOGGING Y MONITOREO
# ===========================================
LOG_LEVEL=debug
LOG_FILE=./logs/app.log
LOG_MAX_SIZE=10m
LOG_MAX_FILES=5
LOG_DATE_PATTERN=YYYY-MM-DD

# ===========================================
# SEGURIDAD
# ===========================================
JWT_SECRET=your_super_secure_jwt_secret_at_least_32_characters
JWT_EXPIRES_IN=24h
SESSION_SECRET=your_super_secure_session_secret
CORS_ORIGIN=http://localhost:3000,https://yourdomain.com
BCRYPT_ROUNDS=12

# ===========================================
# RATE LIMITING
# ===========================================
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
RATE_LIMIT_MESSAGE=Too many requests from this IP

# ===========================================
# CACHE
# ===========================================
REDIS_URL=redis://localhost:6379
CACHE_TTL=3600

# ===========================================
# SWAGGER/DOCUMENTACIÓN
# ===========================================
SWAGGER_ENABLED=true
SWAGGER_TITLE=Clean Architecture API
SWAGGER_DESCRIPTION=API REST implementada con Clean Architecture
SWAGGER_VERSION=1.0.0

# ===========================================
# MONITOREO Y HEALTH CHECKS
# ===========================================
HEALTH_CHECK_INTERVAL=30000
METRICS_ENABLED=true
PROMETHEUS_PORT=9090
```

#### **Configuración por Ambientes**

**Crear `config/environments/development.env`:**
```env
NODE_ENV=development
LOG_LEVEL=debug
SWAGGER_ENABLED=true
METRICS_ENABLED=true
DB_SSL=false
CORS_ORIGIN=*
```

**Crear `config/environments/production.env`:**
```env
NODE_ENV=production
LOG_LEVEL=info
SWAGGER_ENABLED=false
METRICS_ENABLED=true
DB_SSL=true
CORS_ORIGIN=https://yourdomain.com
```

**Crear `config/environments/test.env`:**
```env
NODE_ENV=test
LOG_LEVEL=error
SWAGGER_ENABLED=false
METRICS_ENABLED=false
DB_NAME=api_clean_architecture_test
RATE_LIMIT_ENABLED=false
```

### ⚙️ Configuración del Sistema

#### **Configuración del Servidor**

**Actualizar `src/infrastructure/config/server.config.js`:**
```javascript
const express = require('express');
const { ErrorHandlerMiddleware } = require('../middleware/error-handler.middleware');
const { LoggerMiddleware } = require('../middleware/logger.middleware');
const { ValidationMiddleware } = require('../middleware/validation.middleware');
const { CorsMiddleware } = require('../middleware/cors.middleware');
const { SecurityMiddleware } = require('../middleware/security.middleware');
const { rateLimitInstance } = require('../middleware/rate-limit.middleware;

/**
 * Configuración del servidor Express
 */
class ServerConfig {
  constructor() {
    this.app = express();
    this.port = process.env.PORT || 3000;
    this.env = process.env.NODE_ENV || 'development';
  }

  /**
   * Configura todos los middlewares
   */
  setupMiddleware() {
    // Middleware de seguridad (debe ir primero)
    this.app.use(SecurityMiddleware.helmet());
    this.app.use(SecurityMiddleware.securityHeaders());
    this.app.use(SecurityMiddleware.xssProtection());

    // CORS
    if (this.env === 'development') {
      this.app.use(CorsMiddleware.permissive());
    } else {
      this.app.use(CorsMiddleware.fromEnvironment());
    }

    // Rate limiting
    this.app.use('/api', rateLimitInstance.basic({
      windowMs: 15 * 60 * 1000, // 15 minutos
      maxRequests: this.env === 'production' ? 100 : 1000
    }));

    // Rate limiting estricto para endpoints sensibles
    this.app.use('/api/parity/batch', rateLimitInstance.strict({
      windowMs: 5 * 60 * 1000, // 5 minutos
      maxRequests: 10
    }));

    // Parsing de body
    this.app.use(express.json({ 
      limit: '10mb',
      type: 'application/json'
    }));
    
    this.app.use(express.urlencoded({ 
      extended: true, 
      limit: '10mb' 
    }));

    // Validación de Content-Type
    this.app.use(SecurityMiddleware.validateContentType(['application/json', 'application/x-www-form-urlencoded']));

    // Sanitización de entrada
    this.app.use(ValidationMiddleware.sanitize());

    // Logging
    if (this.env === 'development') {
      this.app.use(LoggerMiddleware.detailed());
    } else {
      this.app.use(LoggerMiddleware.basic());
    }

    // Logging de performance (opcional)
    if (process.env.ENABLE_PERFORMANCE_LOGGING === 'true') {
      this.app.use(LoggerMiddleware.performance());
    }

    // Middleware de validación de User-Agent
    if (this.env === 'production') {
      this.app.use(SecurityMiddleware.validateUserAgent());
    }

    // Trust proxy (para obtener IP real detrás de proxy)
    this.app.set('trust proxy', true);
  }

  /**
   * Configura las rutas
   * @param {Object} routes - Objeto con todas las rutas
   */
  setupRoutes(routes) {
    // Ruta raíz
    this.app.get('/', (req, res) => {
      res.json({
        success: true,
        message: 'Parity API is running',
        version: require('../../../package.json').version,
        environment: this.env,
        timestamp: new Date().toISOString(),
        endpoints: {
          health: '/health',
          api: '/api',
          docs: '/api/docs'
        }
      });
    });

    // Montar rutas
    this.app.use('/health', routes.health);
    this.app.use('/api', routes.api);
    this.app.use('/api/docs', routes.docs);

    // Endpoint para estadísticas de rate limiting (solo desarrollo)
    if (this.env === 'development') {
      this.app.get('/debug/rate-limit-stats', (req, res) => {
        res.json(rateLimitInstance.getStats());
      });
    }
  }

  /**
   * Configura el manejo de errores (debe ir al final)
   */
  setupErrorHandling() {
    // Manejo de rutas no encontradas (404)
    this.app.use(ErrorHandlerMiddleware.notFound());

    // Middleware de logging de errores
    this.app.use(LoggerMiddleware.error());

    // Manejador global de errores
    this.app.use(ErrorHandlerMiddleware.handle());
  }

  /**
   * Inicia el servidor
   * @returns {Promise<Server>} Servidor iniciado
   */
  async start() {
    return new Promise((resolve, reject) => {
      try {
        const server = this.app.listen(this.port, () => {
          console.log(`🚀 Server running on port ${this.port} in ${this.env} mode`);
          console.log(`📱 Health check: http://localhost:${this.port}/health`);
          console.log(`🔗 API: http://localhost:${this.port}/api`);
          console.log(`📖 Documentation: http://localhost:${this.port}/api/docs`);
          resolve(server);
        });

        // Manejo de errores del servidor
        server.on('error', (error) => {
          if (error.code === 'EADDRINUSE') {
            console.error(`❌ Port ${this.port} is already in use`);
          } else {
            console.error('❌ Server error:', error);
          }
          reject(error);
        });

        // Manejo de cierre graceful
        process.on('SIGTERM', () => {
          console.log('📤 SIGTERM received, shutting down gracefully');
          server.close(() => {
            console.log('✅ Process terminated');
            process.exit(0);
          });
        });

        process.on('SIGINT', () => {
          console.log('📤 SIGINT received, shutting down gracefully');
          server.close(() => {
            console.log('✅ Process terminated');
            process.exit(0);
          });
        });

      } catch (error) {
        reject(error);
      }
    });
  }

  /**
   * Obtiene la instancia de Express
   * @returns {Express} Aplicación Express
   */
  getApp() {
    return this.app;
  }

  /**
   * Configura variables de entorno específicas
   */
  validateEnvironment() {
    const requiredEnvVars = [
      'NODE_ENV'
    ];

    const missingVars = requiredEnvVars.filter(varName => !process.env[varName]);
    
    if (missingVars.length > 0) {
      console.warn(`⚠️  Missing environment variables: ${missingVars.join(', ')}`);
    }

    // Valores por defecto
    process.env.NODE_ENV = process.env.NODE_ENV || 'development';
    process.env.PORT = process.env.PORT || '3000';
    process.env.CORS_ORIGINS = process.env.CORS_ORIGINS || 'http://localhost:3000,http://localhost:3001';
  }
}

module.exports = { ServerConfig };
```

#### **Configuración de Base de Datos**

**Crear `src/infrastructure/config/database.config.js`:**
```javascript
/**
 * Configuración de base de datos
 * 
 * NOTA: Esta configuración está preparada para futuras implementaciones
 * de bases de datos reales (PostgreSQL, MongoDB, etc.)
 */
class DatabaseConfig {
  constructor() {
    this.type = process.env.DB_TYPE || 'memory';
    this.config = this.getConfig();
  }

  /**
   * Obtiene la configuración según el tipo de base de datos
   * @returns {Object} Configuración de la base de datos
   */
  getConfig() {
    switch (this.type) {
      case 'postgresql':
        return this.getPostgreSQLConfig();
      case 'mongodb':
        return this.getMongoDBConfig();
      case 'mysql':
        return this.getMySQLConfig();
      case 'memory':
      default:
        return this.getInMemoryConfig();
    }
  }

  /**
   * Configuración para PostgreSQL
   * @returns {Object} Configuración PostgreSQL
   */
  getPostgreSQLConfig() {
    return {
      type: 'postgresql',
      host: process.env.DB_HOST || 'localhost',
      port: parseInt(process.env.DB_PORT) || 5432,
      database: process.env.DB_NAME || 'parity_api',
      username: process.env.DB_USER || 'postgres',
      password: process.env.DB_PASSWORD || '',
      ssl: process.env.DB_SSL === 'true',
      poolSize: parseInt(process.env.DB_POOL_SIZE) || 10,
      connectionTimeout: parseInt(process.env.DB_CONNECTION_TIMEOUT) || 30000,
      idleTimeout: parseInt(process.env.DB_IDLE_TIMEOUT) || 10000,
      schema: 'public'
    };
  }

  /**
   * Configuración para MongoDB
   * @returns {Object} Configuración MongoDB
   */
  getMongoDBConfig() {
    return {
      type: 'mongodb',
      uri: process.env.MONGODB_URI || 'mongodb://localhost:27017/parity_api',
      options: {
        maxPoolSize: parseInt(process.env.DB_POOL_SIZE) || 10,
        serverSelectionTimeoutMS: parseInt(process.env.DB_CONNECTION_TIMEOUT) || 30000,
        socketTimeoutMS: parseInt(process.env.DB_SOCKET_TIMEOUT) || 45000,
        maxIdleTimeMS: parseInt(process.env.DB_IDLE_TIMEOUT) || 10000,
        retryWrites: true,
        writeConcern: {
          w: 'majority'
        }
      }
    };
  }

  /**
   * Configuración para MySQL
   * @returns {Object} Configuración MySQL
   */
  getMySQLConfig() {
    return {
      type: 'mysql',
      host: process.env.DB_HOST || 'localhost',
      port: parseInt(process.env.DB_PORT) || 3306,
      database: process.env.DB_NAME || 'parity_api',
      username: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD || '',
      charset: 'utf8mb4',
      timezone: '+00:00',
      pool: {
        max: parseInt(process.env.DB_POOL_SIZE) || 10,
        min: 0,
        acquire: parseInt(process.env.DB_CONNECTION_TIMEOUT) || 30000,
        idle: parseInt(process.env.DB_IDLE_TIMEOUT) || 10000
      }
    };
  }

  /**
   * Configuración para almacenamiento en memoria
   * @returns {Object} Configuración en memoria
   */
  getInMemoryConfig() {
    return {
      type: 'memory',
      maxRecords: parseInt(process.env.MEMORY_MAX_RECORDS) || 10000,
      cleanupInterval: parseInt(process.env.MEMORY_CLEANUP_INTERVAL) || 300000, // 5 minutos
      persistToFile: process.env.MEMORY_PERSIST_FILE || null
    };
  }

  /**
   * Valida la configuración de la base de datos
   * @throws {Error} Si la configuración es inválida
   */
  validate() {
    const config = this.config;

    switch (this.type) {
      case 'postgresql':
      case 'mysql':
        if (!config.host || !config.database || !config.username) {
          throw new Error(`Invalid ${this.type} configuration: host, database, and username are required`);
        }
        break;
      case 'mongodb':
        if (!config.uri) {
          throw new Error('Invalid MongoDB configuration: uri is required');
        }
        break;
      case 'memory':
        // Memoria no requiere validación especial
        break;
      default:
        throw new Error(`Unsupported database type: ${this.type}`);
    }
  }

  /**
   * Obtiene la cadena de conexión
   * @returns {string} Cadena de conexión
   */
  getConnectionString() {
    const config = this.config;

    switch (this.type) {
      case 'postgresql':
        return `postgresql://${config.username}:${config.password}@${config.host}:${config.port}/${config.database}`;
      case 'mysql':
        return `mysql://${config.username}:${config.password}@${config.host}:${config.port}/${config.database}`;
      case 'mongodb':
        return config.uri;
      case 'memory':
        return 'memory://local';
      default:
        throw new Error(`Cannot generate connection string for type: ${this.type}`);
    }
  }

  /**
   * Verifica si la configuración es para producción
   * @returns {boolean} True si es configuración de producción
   */
  isProduction() {
    return process.env.NODE_ENV === 'production';
  }

  /**
   * Obtiene configuración de migración (para futuras implementaciones)
   * @returns {Object} Configuración de migración
   */
  getMigrationConfig() {
    return {
      directory: './migrations',
      tableName: 'knex_migrations',
      schemaName: this.config.schema || 'public',
      disableTransactions: false
    };
  }
}

module.exports = { DatabaseConfig };
```

#### **Configuración de Entorno**

**Crear `src/infrastructure/config/environment.config.js`:**
```javascript
const path = require('path');
const fs = require('fs');

/**
 * Configuración de entorno centralizada
 */
class EnvironmentConfig {
  constructor() {
    this.env = process.env.NODE_ENV || 'development';
    this.loadEnvironmentFile();
    this.config = this.buildConfig();
  }

  /**
   * Carga archivo .env si existe
   */
  loadEnvironmentFile() {
    const envFile = path.join(process.cwd(), `.env.${this.env}`);
    const defaultEnvFile = path.join(process.cwd(), '.env');

    // Intentar cargar archivo específico del entorno
    if (fs.existsSync(envFile)) {
      require('dotenv').config({ path: envFile });
      console.log(`📁 Loaded environment from: .env.${this.env}`);
    } else if (fs.existsSync(defaultEnvFile)) {
      require('dotenv').config({ path: defaultEnvFile });
      console.log('📁 Loaded environment from: .env');
    }
  }

  /**
   * Construye la configuración completa
   * @returns {Object} Configuración del entorno
   */
  buildConfig() {
    return {
      // Configuración básica
      app: {
        name: process.env.APP_NAME || 'Parity API',
        version: require('../../../package.json').version,
        env: this.env,
        port: parseInt(process.env.PORT) || 3000,
        host: process.env.HOST || 'localhost',
        timezone: process.env.TZ || 'UTC'
      },

      // Configuración de logging
      logging: {
        level: process.env.LOG_LEVEL || (this.env === 'production' ? 'info' : 'debug'),
        format: process.env.LOG_FORMAT || 'json',
        enableConsole: process.env.LOG_CONSOLE !== 'false',
        enableFile: process.env.LOG_FILE === 'true',
        filePath: process.env.LOG_FILE_PATH || './logs/app.log',
        enablePerformance: process.env.ENABLE_PERFORMANCE_LOGGING === 'true'
      },

      // Configuración de seguridad
      security: {
        enableHelmet: process.env.SECURITY_HELMET !== 'false',
        enableCors: process.env.SECURITY_CORS !== 'false',
        corsOrigins: process.env.CORS_ORIGINS?.split(',') || ['http://localhost:3000'],
        enableRateLimit: process.env.SECURITY_RATE_LIMIT !== 'false',
        rateLimitWindow: parseInt(process.env.RATE_LIMIT_WINDOW) || 900000, // 15 min
        rateLimitMax: parseInt(process.env.RATE_LIMIT_MAX) || 100,
        enableXssProtection: process.env.SECURITY_XSS_PROTECTION !== 'false'
      },

      // Configuración de base de datos
      database: {
        type: process.env.DB_TYPE || 'memory',
        host: process.env.DB_HOST || 'localhost',
        port: parseInt(process.env.DB_PORT) || 5432,
        name: process.env.DB_NAME || 'parity_api',
        username: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        ssl: process.env.DB_SSL === 'true',
        poolSize: parseInt(process.env.DB_POOL_SIZE) || 10,
        maxRecords: parseInt(process.env.MEMORY_MAX_RECORDS) || 10000
      },

      // Configuración de SSL/TLS
      ssl: {
        enabled: process.env.SSL_ENABLED === 'true',
        keyPath: process.env.SSL_KEY_PATH || './ssl/key.pem',
        certPath: process.env.SSL_CERT_PATH || './ssl/cert.pem',
        port: parseInt(process.env.SSL_PORT) || 3443
      },

      // Configuración de API
      api: {
        prefix: process.env.API_PREFIX || '/api',
        version: process.env.API_VERSION || 'v1',
        enableDocs: process.env.API_DOCS !== 'false',
        enableMetrics: process.env.API_METRICS === 'true',
        requestTimeout: parseInt(process.env.API_REQUEST_TIMEOUT) || 30000,
        bodyLimit: process.env.API_BODY_LIMIT || '10mb'
      },

      // Configuración de caché
      cache: {
        enabled: process.env.CACHE_ENABLED === 'true',
        type: process.env.CACHE_TYPE || 'memory',
        ttl: parseInt(process.env.CACHE_TTL) || 300, // 5 minutos
        maxSize: parseInt(process.env.CACHE_MAX_SIZE) || 1000
      },

      // Configuración de notificaciones
      notifications: {
        enabled: process.env.NOTIFICATIONS_ENABLED === 'true',
        email: {
          enabled: process.env.EMAIL_ENABLED === 'true',
          provider: process.env.EMAIL_PROVIDER || 'nodemailer',
          host: process.env.EMAIL_HOST,
          port: parseInt(process.env.EMAIL_PORT) || 587,
          username: process.env.EMAIL_USERNAME,
          password: process.env.EMAIL_PASSWORD,
          from: process.env.EMAIL_FROM
        }
      },

      // Configuración de monitoreo
      monitoring: {
        enabled: process.env.MONITORING_ENABLED === 'true',
        healthCheck: {
          enabled: process.env.HEALTH_CHECK_ENABLED !== 'false',
          interval: parseInt(process.env.HEALTH_CHECK_INTERVAL) || 30000,
          timeout: parseInt(process.env.HEALTH_CHECK_TIMEOUT) || 5000
        },
        metrics: {
          enabled: process.env.METRICS_ENABLED === 'true',
          endpoint: process.env.METRICS_ENDPOINT || '/metrics',
          collectInterval: parseInt(process.env.METRICS_COLLECT_INTERVAL) || 15000
        }
      }
    };
  }

  /**
   * Obtiene toda la configuración
   * @returns {Object} Configuración completa
   */
  getConfig() {
    return this.config;
  }

  /**
   * Obtiene configuración específica por sección
   * @param {string} section - Sección de configuración
   * @returns {Object} Configuración de la sección
   */
  get(section) {
    return this.config[section] || {};
  }

  /**
   * Valida la configuración requerida
   * @throws {Error} Si falta configuración crítica
   */
  validate() {
    const errors = [];

    // Validaciones básicas
    if (!this.config.app.name) {
      errors.push('APP_NAME is required');
    }

    // Validaciones de producción
    if (this.env === 'production') {
      if (this.config.security.corsOrigins.includes('*')) {
        errors.push('CORS_ORIGINS should not include "*" in production');
      }

      if (this.config.logging.level === 'debug') {
        console.warn('⚠️  DEBUG logging enabled in production');
      }

      if (!this.config.ssl.enabled) {
        console.warn('⚠️  SSL not enabled in production');
      }
    }

    // Validaciones de base de datos
    if (this.config.database.type !== 'memory') {
      if (!this.config.database.host || !this.config.database.name) {
        errors.push('Database configuration incomplete');
      }
    }

    if (errors.length > 0) {
      throw new Error(`Configuration validation failed: ${errors.join(', ')}`);
    }
  }

  /**
   * Verifica si está en modo de desarrollo
   * @returns {boolean} True si está en desarrollo
   */
  isDevelopment() {
    return this.env === 'development';
  }

  /**
   * Verifica si está en modo de producción
   * @returns {boolean} True si está en producción
   */
  isProduction() {
    return this.env === 'production';
  }

  /**
   * Verifica si está en modo de testing
   * @returns {boolean} True si está en testing
   */
  isTest() {
    return this.env === 'test';
  }

  /**
   * Obtiene información del entorno para debugging
   * @returns {Object} Información del entorno
   */
  getDebugInfo() {
    return {
      nodeVersion: process.version,
      platform: process.platform,
      arch: process.arch,
      env: this.env,
      pid: process.pid,
      uptime: process.uptime(),
      memoryUsage: process.memoryUsage(),
      cwd: process.cwd(),
      timezone: this.config.app.timezone,
      configSections: Object.keys(this.config)
    };
  }

  /**
   * Exporta configuración a archivo (para debugging)
   * @param {string} filePath - Ruta del archivo
   */
  exportConfig(filePath) {
    const configToExport = {
      ...this.config,
      // Remover información sensible
      database: {
        ...this.config.database,
        password: this.config.database.password ? '***HIDDEN***' : undefined
      },
      notifications: {
        ...this.config.notifications,
        email: {
          ...this.config.notifications.email,
          password: this.config.notifications.email.password ? '***HIDDEN***' : undefined
        }
      }
    };

    fs.writeFileSync(
      filePath,
      JSON.stringify(configToExport, null, 2),
      'utf8'
    );
  }
}

module.exports = { EnvironmentConfig };
```

#### **Configuración de SSL**

**Crear `src/infrastructure/config/ssl.config.js`:**
```javascript
const fs = require('fs');
const path = require('path');

/**
 * Configuración de SSL/TLS
 */
class SSLConfig {
  constructor() {
    this.enabled = process.env.SSL_ENABLED === 'true';
    this.keyPath = process.env.SSL_KEY_PATH || './ssl/key.pem';
    this.certPath = process.env.SSL_CERT_PATH || './ssl/cert.pem';
  }

  /**
   * Carga las credenciales SSL
   * @returns {Object} Credenciales SSL
   */
  getCredentials() {
    if (!this.enabled) {
      return null;
    }

    const key = fs.readFileSync(path.resolve(this.keyPath), 'utf8');
    const cert = fs.readFileSync(path.resolve(this.certPath), 'utf8');

    return { key, cert };
  }

  /**
   * Verifica si SSL está habilitado
   * @returns {boolean} True si SSL está habilitado
   */
  isEnabled() {
    return this.enabled;
  }
}

// Instancia singleton
const sslConfig = new SSLConfig();

module.exports = { 
  SSLConfig, 
  sslConfig 
};
```

### 🌐 Configuración de Swagger

**Crear `src/infrastructure/config/swagger.config.js`:**
```javascript
const swaggerJsDoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

/**
 * Configuración de Swagger para documentación de API
 */
class SwaggerConfig {
  constructor() {
    this.options = {
      definition: {
        openapi: '3.0.0',
        info: {
          title: process.env.SWAGGER_TITLE || 'API REST',
          version: process.env.SWAGGER_VERSION || '1.0.0',
          description: process.env.SWAGGER_DESCRIPTION || 'Documentación de la API REST',
          contact: {
            name: 'Soporte API',
            email: 'soporte@ejemplo.com'
          }
        },
        servers: [
          {
            url: `http://localhost:${process.env.PORT || 3000}/api`,
            description: 'Servidor de desarrollo'
          }
        ]
      },
      apis: ['./src/routes/*.js']
    };
  }

  /**
   * Configura Swagger en una aplicación Express
   * @param {Object} app - Aplicación Express
   */
  setup(app) {
    const specs = swaggerJsDoc(this.options);
    app.use('/api/docs', swaggerUi.serve, swaggerUi.setup(specs));
  }
}

module.exports = { SwaggerConfig };
```

### 🚀 Comandos de Despliegue

#### **1. Despliegue en Entorno de Desarrollo**
```bash
# Crear y iniciar contenedor en desarrollo
docker-compose -f docker-compose.development.yml up -d --build

# Ejecutar migraciones (si aplica)
docker-compose -f docker-compose.development.yml exec api npm run migrate

# Sembrar datos iniciales (si aplica)
docker-compose -f docker-compose.development.yml exec api npm run seed

# Verificar estado de la aplicación
docker-compose -f docker-compose.development.yml exec api npm run health

# Acceder a los logs
docker-compose -f docker-compose.development.yml logs -f
```

#### **2. Despliegue en Entorno de Producción**
```bash
# Construir imagen de producción
npm run docker:build

# Detener y eliminar contenedores existentes
docker-compose -f docker-compose.production.yml down

# Iniciar nuevos contenedores
docker-compose -f docker-compose.production.yml up -d

# Verificar estado de la aplicación
docker-compose -f docker-compose.production.yml exec api npm run health

# Acceder a los logs
docker-compose -f docker-compose.production.yml logs -f
```

#### **3. Despliegue en Servidor Remoto (Ejemplo con SSH)**
```bash
# Variables
REMOTE_USER=usuario
REMOTE_HOST=ip_del_servidor
REMOTE_PORT=22
APP_DIR=/ruta/al/directorio/app

# Construir imagen localmente
npm run docker:build

# Taggear imagen
docker tag api-clean-architecture:latest ${REMOTE_USER}@${REMOTE_HOST}:${APP_DIR}/api-clean-architecture:latest

# Push de imagen al servidor remoto
docker push ${REMOTE_USER}@${REMOTE_HOST}:${APP_DIR}/api-clean-architecture:latest

# Conectar por SSH y desplegar
ssh -p ${REMOTE_PORT} ${REMOTE_USER}@${REMOTE_HOST} << 'EOF'
  cd ${APP_DIR}
  docker-compose down
  docker-compose up -d --build
  docker-compose exec api npm run migrate
  docker-compose exec api npm run seed
  docker-compose exec api npm run health
EOF
```

---

## 16. Validación de Completitud del Tutorial

### ✅ **Checklist Master de Implementación Completa**

Usa este checklist para verificar que has implementado todos los componentes de Clean Architecture:

#### **🏗️ Fase 1: Configuración Base**
- [ ] Estructura de directorios creada según especificaciones
- [ ] `package.json` configurado con todas las dependencias
- [ ] Scripts npm implementados y funcionando
- [ ] Variables de entorno configuradas (`.env` y `.env.example`)
- [ ] Herramientas de desarrollo configuradas (ESLint, Prettier, Jest)
- [ ] Git inicializado con `.gitignore` apropiado

**Comando de validación:**
```bash
npm run diagnose && npm run lint && echo "✅ Fase 1 completada"
```

#### **🎯 Fase 2: Domain Layer (Capa de Dominio)**
- [ ] **Entidades**: `NumberEntity` implementada con validaciones
- [ ] **Value Objects**: `ParityValueObject` con inmutabilidad
- [ ] **Servicios de Dominio**: `ParityService` con lógica de negocio
- [ ] **Plantillas**: Templates genéricos para futuras entidades
- [ ] **Tests**: Cobertura completa de la capa de dominio

**Comando de validación:**
```bash
npm run test:unit -- tests/unit/domain/ && echo "✅ Domain Layer completada"
```

#### **🔄 Fase 3: Application Layer (Capa de Aplicación)**
- [ ] **Interfaces**: Contratos de repositorios y servicios
- [ ] **DTOs**: Request/Response objects con validación
- [ ] **Use Cases**: Casos de uso implementados correctamente
- [ ] **Mappers**: Transformación entre capas
- [ ] **Tests**: Casos de uso testeados completamente

**Comando de validación:**
```bash
npm run test:unit -- tests/unit/application/ && echo "✅ Application Layer completada"
```

#### **🏭 Fase 4: Infrastructure Layer (Capa de Infraestructura)**
- [ ] **Controladores**: HTTP controllers con validación
- [ ] **Repositorios**: Implementaciones concretas
- [ ] **Middleware**: Error handling, logging, validación, seguridad
- [ ] **Configuración**: Server, database, SSL, swagger
- [ ] **Rutas**: Sistema de routing implementado
- [ ] **Tests**: Infraestructura testeada

**Comando de validación:**
```bash
npm run test:unit -- tests/unit/infrastructure/ && echo "✅ Infrastructure Layer completada"
```

#### **🛠️ Fase 5: Shared Layer (Capa Compartida)**
- [ ] **Excepciones**: Jerarquía de errores personalizada
- [ ] **Constantes**: HTTP status codes y otros valores
- [ ] **Utilidades**: Helpers para validación, response, etc.
- [ ] **Tests**: Shared components testeados

**Comando de validación:**
```bash
npm run test:unit -- tests/unit/shared/ && echo "✅ Shared Layer completada"
```

#### **🧪 Fase 6: Testing Integral**
- [ ] **Tests Unitarios**: Todas las capas cubiertas >80%
- [ ] **Tests de Integración**: API endpoints funcionando
- [ ] **Tests E2E**: Workflows completos testeados
- [ ] **Test Helpers**: Utilities y mocks implementados
- [ ] **Coverage**: Thresholds cumplidos

**Comando de validación:**
```bash
npm run test:coverage && echo "✅ Testing completado"
```

#### **🚀 Fase 7: Producción y Despliegue**
- [ ] **Docker**: Dockerfile optimizado para producción
- [ ] **Docker Compose**: Servicios completos configurados
- [ ] **SSL**: Certificados generados y configurados
- [ ] **Nginx**: Reverse proxy configurado
- [ ] **Scripts**: Despliegue automatizado
- [ ] **Monitoring**: Health checks y métricas

**Comando de validación:**
```bash
npm run docker:build && npm run health && echo "✅ Producción lista"
```

#### **📚 Fase 8: Documentación**
- [ ] **API Docs**: Swagger/OpenAPI funcionando
- [ ] **README**: Documentación completa del proyecto
- [ ] **Ejemplos**: Casos de uso documentados
- [ ] **Troubleshooting**: Guía de resolución de problemas
- [ ] **Comentarios**: Código autodocumentado

**Comando de validación:**
```bash
curl -k https://localhost:3443/api/docs && echo "✅ Documentación accesible"
```

### 🎯 **Script de Validación Automática Final**

**Crear `scripts/validate-completeness.js`:**
```javascript
#!/usr/bin/env node

const fs = require('fs');
const { execSync } = require('child_process');

class CompletenessValidator {
  constructor() {
    this.score = 0;
    this.maxScore = 0;
    this.results = [];
  }

  async validateComplete() {
    console.log('🎯 Validando completitud de Clean Architecture...\n');

    await this.validateStructure();
    await this.validateImplementation();
    await this.validateTesting();
    await this.validateProduction();

    this.generateFinalReport();
  }

  checkItem(description, condition) {
    this.maxScore++;
    if (condition) {
      this.score++;
      console.log(`✅ ${description}`);
      this.results.push({ description, status: 'passed' });
    } else {
      console.log(`❌ ${description}`);
      this.results.push({ description, status: 'failed' });
    }
  }

  async validateStructure() {
    console.log('🏗️ Validando estructura...');
    
    this.checkItem('Estructura de directorios Clean Architecture', 
      fs.existsSync('src/domain') && 
      fs.existsSync('src/application') && 
      fs.existsSync('src/infrastructure') && 
      fs.existsSync('src/shared')
    );

    this.checkItem('package.json configurado correctamente', 
      fs.existsSync('package.json')
    );

    this.checkItem('Variables de entorno configuradas', 
      fs.existsSync('.env.example')
    );

    console.log();
  }

  async validateImplementation() {
    console.log('💻 Validando implementación...');
    
    this.checkItem('Domain Layer implementado', 
      fs.existsSync('src/domain/entities') && 
      fs.existsSync('src/domain/services')
    );

    this.checkItem('Application Layer implementado', 
      fs.existsSync('src/application/use-cases') && 
      fs.existsSync('src/application/interfaces')
    );

    this.checkItem('Infrastructure Layer implementado', 
      fs.existsSync('src/infrastructure/adapters/controllers') && 
      fs.existsSync('src/infrastructure/config')
    );

    this.checkItem('Shared Layer implementado', 
      fs.existsSync('src/shared/exceptions') && 
      fs.existsSync('src/shared/utils')
    );

    console.log();
  }

  async validateTesting() {
    console.log('🧪 Validando testing...');
    
    this.checkItem('Tests unitarios presentes', 
      fs.existsSync('tests/unit')
    );

    this.checkItem('Tests de integración presentes', 
      fs.existsSync('tests/integration')
    );

    this.checkItem('Configuración Jest presente', 
      fs.existsSync('jest.config.js') || 
      fs.readFileSync('package.json', 'utf8').includes('"jest"')
    );

    // Ejecutar tests si existen
    try {
      execSync('npm test', { stdio: 'pipe' });
      this.checkItem('Tests pasan correctamente', true);
    } catch (error) {
      this.checkItem('Tests pasan correctamente', false);
    }

    console.log();
  }

  async validateProduction() {
    console.log('🚀 Validando configuración de producción...');
    
    this.checkItem('Dockerfile presente', fs.existsSync('Dockerfile'));
    
    this.checkItem('Docker Compose configurado', 
      fs.existsSync('docker-compose.yml') || 
      fs.existsSync('docker-compose.production.yml')
    );

    this.checkItem('SSL configurado', 
      fs.existsSync('ssl') || 
      fs.existsSync('scripts/generate-ssl.js')
    );

    this.checkItem('Health checks implementados', 
      fs.existsSync('src/infrastructure/adapters/controllers/health.controller.js')
    );

    console.log();
  }

  generateFinalReport() {
    const percentage = (this.score / this.maxScore) * 100;
    
    console.log('📊 REPORTE FINAL DE COMPLETITUD');
    console.log('='.repeat(50));
    console.log(`Puntuación: ${this.score}/${this.maxScore} (${percentage.toFixed(1)}%)`);
    
    if (percentage >= 90) {
      console.log('🏆 ¡EXCELENTE! Tu implementación está completa.');
      console.log('🎉 Clean Architecture implementada correctamente.');
    } else if (percentage >= 70) {
      console.log('👍 BIEN. Tu implementación está casi completa.');
      console.log('🔧 Revisa los elementos faltantes para mejorar.');
    } else {
      console.log('⚠️  NECESITA TRABAJO. Implementación incompleta.');
      console.log('📚 Revisa el tutorial y completa los elementos faltantes.');
    }

    console.log('\n📋 Elementos faltantes:');
    this.results
      .filter(r => r.status === 'failed')
      .forEach(r => console.log(`   - ${r.description}`));

    console.log('\n🎯 Próximos pasos recomendados:');
    if (percentage < 100) {
      console.log('   1. Completar elementos faltantes');
      console.log('   2. Ejecutar npm run validate:full');
      console.log('   3. Revisar documentación');
    } else {
      console.log('   1. ¡Comenzar a desarrollar nuevas funcionalidades!');
      console.log('   2. Implementar base de datos persistente');
      console.log('   3. Agregar autenticación');
    }
  }
}

// Ejecutar validación
if (require.main === module) {
  new CompletenessValidator().validateComplete();
}

module.exports = { CompletenessValidator };
```

### 🎓 **Graduación: Has Completado Clean Architecture**

**Si has llegado hasta aquí y tienes >90% en la validación:**

```
🎉 ¡FELICITACIONES! 🎉

Has completado exitosamente la implementación de Clean Architecture.
Tu sistema incluye:

✅ Arquitectura limpia y escalable
✅ Testing robusto (unitario, integración, E2E)
✅ Configuración de producción completa
✅ Documentación exhaustiva
✅ Herramientas de desarrollo avanzadas
✅ Monitoring y observabilidad
✅ Seguridad implementada
✅ Despliegue automatizado

🚀 PRÓXIMOS DESAFÍOS:
- Implementar base de datos real (PostgreSQL/MongoDB)
- Agregar autenticación JWT
- Crear frontend con React/Vue
- Implementar microservicios
- Configurar CI/CD pipeline
- Escalar a múltiples instancias
```

### 📊 **Comandos Finales de Validación**

```bash
# Validación completa final
npm run validate:full

# Diagnóstico del sistema
npm run diagnose

# Verificar completitud
node scripts/validate-completeness.js

# Iniciar en producción
npm run deploy:production

# Verificar que todo funciona
npm run health && echo "🎉 ¡Sistema completamente funcional!"
```

---
