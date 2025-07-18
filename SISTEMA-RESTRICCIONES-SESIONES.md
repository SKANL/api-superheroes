# 🔐 Análisis de Restricciones y Sesiones del Sistema

## 📊 Resumen de Restricciones por Entidad

### 👤 **Usuarios (User)**
- **Email**: ✅ **ÚNICO GLOBAL** - No pueden existir 2 usuarios con el mismo email
- **Username**: ✅ **ÚNICO GLOBAL** - No pueden existir 2 usuarios con el mismo username
- **Sesiones**: Cada usuario tiene su propia sesión autenticada

### 🦸 **Héroes (Hero)**
- **Alias**: ✅ **ÚNICO GLOBAL** - No pueden existir 2 héroes con el mismo alias (independiente del owner)
- **Name**: ❌ **No hay restricción** - Múltiples héroes pueden tener el mismo nombre
- **Owner**: ✅ **Cada héroe pertenece a un usuario específico**

### 🦹 **Villanos (Villain)**
- **Alias**: ✅ **ÚNICO GLOBAL** - No pueden existir 2 villanos con el mismo alias (independiente del owner)
- **Name**: ❌ **No hay restricción** - Múltiples villanos pueden tener el mismo nombre
- **Owner**: ✅ **Cada villano pertenece a un usuario específico**

### ⚔️ **Batallas (Battle)**
- **No hay restricciones de unicidad** - Se pueden crear múltiples batallas idénticas
- **Owner**: ✅ **Cada batalla pertenece a un usuario específico**
- **Pueden usar el mismo heroId y villainId múltiples veces**

### 👥 **Batallas de Equipo (TeamBattle)**
- **No hay restricciones de unicidad** - Se pueden crear múltiples batallas de equipo idénticas
- **Owner**: ✅ **Cada batalla de equipo pertenece a un usuario específico**
- **Pueden usar los mismos heroIds y villainIds múltiples veces**

---

## 🔍 **Respuesta a tu Pregunta**

### ¿Qué NO te permitiría crear exactamente lo mismo?

#### ❌ **Problemas que encontrarías:**

1. **Héroes con el mismo alias:**
   ```json
   // Usuario 1 crea:
   {
     "name": "Peter Parker",
     "alias": "Spider-Man",  // ❌ ÚNICO GLOBAL
     "city": "New York"
   }
   
   // Usuario 1 (o cualquier otro) intenta crear:
   {
     "name": "Miles Morales", 
     "alias": "Spider-Man",  // ❌ ERROR 409: Alias 'Spider-Man' already exists
     "city": "Brooklyn"
   }
   ```

2. **Villanos con el mismo alias:**
   ```json
   // Usuario 1 crea:
   {
     "name": "Norman Osborn",
     "alias": "Green Goblin",  // ❌ ÚNICO GLOBAL
     "city": "New York"
   }
   
   // Usuario 1 (o cualquier otro) intenta crear:
   {
     "name": "Harry Osborn",
     "alias": "Green Goblin",  // ❌ ERROR 409: Alias 'Green Goblin' already exists  
     "city": "New York"
   }
   ```

#### ✅ **Lo que SÍ puedes crear múltiples veces:**

1. **Héroes con diferente alias pero mismo nombre:**
   ```json
   // Usuario 1 puede crear:
   {
     "name": "Peter Parker",
     "alias": "Spider-Man",  // ✅ OK
     "city": "New York"
   }
   
   // Usuario 1 también puede crear:
   {
     "name": "Peter Parker",     // ✅ Mismo nombre OK
     "alias": "Scarlet Spider",  // ✅ Diferente alias OK
     "city": "New York"
   }
   ```

2. **Batallas idénticas:**
   ```json
   // Usuario 1 puede crear múltiples batallas con:
   {
     "heroId": "675a1b2c3d4e5f6789012345",     // ✅ Mismo héroe OK
     "villainId": "675a1b2c3d4e5f6789012346", // ✅ Mismo villano OK
     "location": "Central Park"               // ✅ Misma ubicación OK
   }
   ```

3. **TeamBattles idénticas:**
   ```json
   // Usuario 1 puede crear múltiples batallas de equipo con:
   {
     "heroIds": ["675a1b2c3d4e5f6789012345", "675a1b2c3d4e5f6789012347"],
     "villainIds": ["675a1b2c3d4e5f6789012346", "675a1b2c3d4e5f6789012348"]
   }
   ```

---

## 🎯 **Ejemplos Prácticos**

### Escenario 1: Usuario 1 crea contenido
```bash
POST /api/heroes
{
  "name": "Clark Kent",
  "alias": "Superman",     # ✅ ÚNICO - Se guarda
  "city": "Metropolis"
}

POST /api/villains  
{
  "name": "Lex Luthor",
  "alias": "Lex",          # ✅ ÚNICO - Se guarda
  "city": "Metropolis"
}

POST /api/battles
{
  "heroId": "superman_id",
  "villainId": "lex_id",   # ✅ Se puede crear
  "location": "Daily Planet"
}
```

### Escenario 2: Usuario 1 intenta duplicar
```bash
POST /api/heroes
{
  "name": "Kal-El",        # ✅ Diferente nombre OK
  "alias": "Superman",     # ❌ ERROR 409: Alias 'Superman' already exists
  "city": "Smallville"
}

POST /api/heroes
{
  "name": "Clark Kent",    # ✅ Mismo nombre OK
  "alias": "Man of Steel", # ✅ Diferente alias OK
  "city": "Metropolis"
}

POST /api/battles
{
  "heroId": "superman_id",
  "villainId": "lex_id",   # ✅ Se puede crear múltiples veces
  "location": "Daily Planet"
}
```

---

## 🔐 **Sistema de Ownership (Propiedad)**

### Cómo funciona:
1. **Cada entidad tiene un `owner`** (ID del usuario que la creó)
2. **Solo el owner puede modificar/eliminar** sus entidades
3. **Las consultas se filtran por owner** automáticamente
4. **Los alias son únicos GLOBALMENTE**, no por usuario

### Middleware de Ownership:
```javascript
// Solo puedes ver/editar TUS entidades
GET /api/heroes        // Solo devuelve héroes del usuario autenticado
PUT /api/heroes/:id    // Solo si eres el owner del héroe
DELETE /api/heroes/:id // Solo si eres el owner del héroe
```

---

## ✅ **Recomendaciones**

### Para evitar conflictos de alias:
1. **Usar nombres creativos y únicos:**
   - En lugar de "Superman", usar "Superman_2024" o "Superman_UserX"
   - Incluir variaciones: "Dark Superman", "Evil Superman", etc.

2. **Implementar validación en frontend:**
   ```javascript
   // Verificar disponibilidad de alias antes de enviar
   GET /api/heroes/check-alias/:alias
   ```

3. **Sugerir alias alternativos:**
   - Si "Batman" existe, sugerir "Batman_2", "Dark Knight", "Caped Crusader"

### Para identificar fácilmente tus entidades:
1. **Usar convenciones de naming:**
   - Prefijo con tu username: "John_Superman", "Jane_Batman"
   - Sufijo con número: "Superman_001", "Batman_v2"

---

## 🚀 **Conclusión**

**Respuesta directa:** NO podrías crear exactamente los mismos héroes y villanos con los mismos alias, pero SÍ podrías crear batallas y teamBattles idénticas tantas veces como quieras.

**La restricción principal es el ALIAS único global para héroes y villanos.**
