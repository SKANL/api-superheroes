# API Superhéroes y Villanos

Implementación de una API REST de Superhéroes y Villanos siguiendo Clean Architecture (Onion Architecture) en Node.js/Express.

## Estructura

- `src/domain`: Entidades (Héroe, Villano, Batalla), servicios de dominio (BattleService)
- `src/application`: Casos de uso (CreateHero, ListVillains, CreateBattle, etc.), interfaces y DTOs
- `src/infrastructure`: Controladores, repositorios JSON, middlewares, configuración y rutas
- `src/shared`: Excepciones, constantes y utilidades
- `tests`: Unitarios, integración y e2e

## Funcionalidades

- CRUD completo de superhéroes y villanos
- Gestión de batallas entre héroes y villanos
- Búsqueda por ciudad, equipo y otros criterios

## Instalación

```bash
npm install
```

## Scripts útiles

- `npm run dev` — Desarrollo con recarga
- `npm test` — Ejecuta tests
- `npm run lint` — Linting
- `npm run format` — Formatea código

## Validación de estructura

```bash
npm run lint
npm test
```

## Documentación

Ver `/docs` y `/api/docs` (Swagger)

## Estructura del Proyecto

- `src/domain`: Contiene las entidades de negocio (como héroes, villanos y batallas), objetos de valor y servicios de dominio.
- `src/application`: Implementa los casos de uso, interfaces y lógica de aplicación.
- `src/infrastructure`: Incluye controladores, repositorios, middlewares, configuraciones y rutas.
- `src/shared`: Código compartido como excepciones, constantes y utilidades.
- `tests`: Tests organizados por tipo (unitarios, integración y end-to-end).
- `scripts`: Scripts de utilidad para tareas como limpieza y generación de datos.
- `data`: Archivos JSON con datos de ejemplo para pruebas locales.
- `docs`: Documentación generada automáticamente.
- `coverage`: Reportes de cobertura generados por herramientas de testing.
- `ssl`: Certificados SSL para desarrollo.

## Limpieza del Proyecto

Para limpiar archivos y directorios innecesarios, ejecuta:

```bash
npm run clean
```

Este comando eliminará directorios como `coverage/`, `lcov-report/`, `docs/generated/`, `tmp/` y `node_modules/.cache`.

## Casos de Uso

Los casos de uso implementados en el proyecto son:

- `CreateHeroUseCase`: Crear un nuevo héroe.
- `GetHeroUseCase`: Obtener un héroe por ID.
- `ListHeroesUseCase`: Listar todos los héroes.
- `FindHeroesByCityUseCase`: Buscar héroes por ciudad.
- `UpdateHeroUseCase`: Actualizar un héroe existente.
- `DeleteHeroUseCase`: Eliminar un héroe por ID.

- `CreateVillainUseCase`: Crear un nuevo villano.
- `GetVillainUseCase`: Obtener un villano por ID.
- `ListVillainsUseCase`: Listar todos los villanos.
- `FindVillainsByCityUseCase`: Buscar villanos por ciudad.
- `UpdateVillainUseCase`: Actualizar un villano existente.
- `DeleteVillainUseCase`: Eliminar un villano por ID.

- `CreateBattleUseCase`: Registrar una nueva batalla entre un héroe y un villano.
- `GetBattleUseCase`: Obtener una batalla por ID.
- `ListBattlesUseCase`: Listar todas las batallas.
- `ListBattlesByHeroUseCase`: Listar batallas por héroe.
- `ListBattlesByVillainUseCase`: Listar batallas por villano.
