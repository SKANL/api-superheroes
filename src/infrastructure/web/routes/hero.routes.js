// Rutas para Hero
import { authMiddleware } from '../../middleware/auth.middleware.js';

/**
 * @swagger
 * tags:
 *   name: Heroes
 *   description: Gestión de superhéroes
 *
 * components:
 *   schemas:
 *     Hero:
 *       type: object
 *       required:
 *         - name
 *         - alias
 *         - city
 *       properties:
 *         id:
 *           type: string
 *           example: "172839"
 *         name:
 *           type: string
 *           example: "Chapulín Colorado"
 *         alias:
 *           type: string
 *           example: "Chapulín"
 *         city:
 *           type: string
 *           example: "Ciudad de México"
 *         team:
 *           type: string
 *           example: "Los Supergenios"
 *         health:
 *           type: integer
 *           minimum: 1
 *           maximum: 1000
 *           default: 100
 *           example: 100
 *           description: "Puntos de salud del héroe"
 *         attack:
 *           type: integer
 *           minimum: 1
 *           maximum: 200
 *           default: 50
 *           example: 75
 *           description: "Valor de ataque del héroe"
 *         defense:
 *           type: integer
 *           minimum: 0
 *           maximum: 200
 *           default: 30
 *           example: 45
 *           description: "Valor de defensa del héroe"
 *         specialAbility:
 *           type: string
 *           default: "Basic Attack"
 *           example: "Visión láser"
 *           description: "Habilidad especial del héroe"
 *         isAlive:
 *           type: boolean
 *           default: true
 *           example: true
 *           description: "Indica si el héroe está vivo"
 *         roundsWon:
 *           type: integer
 *           minimum: 0
 *           maximum: 1000
 *           default: 0
 *           example: 3
 *           description: "Número de rondas ganadas"
 *         damage:
 *           type: integer
 *           minimum: 0
 *           maximum: 1000
 *           default: 0
 *           example: 25
 *           description: "Daño infligido en la ronda actual"
 *         status:
 *           type: string
 *           enum: [normal, congelado, envenenado, fortalecido, debilitado, paralizado]
 *           default: "normal"
 *           example: "fortalecido"
 *           description: "Estado del héroe"
 *         stamina:
 *           type: integer
 *           minimum: 0
 *           maximum: 200
 *           default: 100
 *           example: 85
 *           description: "Energía o resistencia del héroe"
 *         speed:
 *           type: integer
 *           minimum: 1
 *           maximum: 200
 *           default: 50
 *           example: 90
 *           description: "Velocidad del héroe"
 *         critChance:
 *           type: integer
 *           minimum: 0
 *           maximum: 100
 *           default: 10
 *           example: 25
 *           description: "Probabilidad de golpe crítico (0-100%)"
 *         teamAffinity:
 *           type: integer
 *           minimum: -100
 *           maximum: 100
 *           default: 0
 *           example: 20
 *           description: "Afinidad con el equipo (-100 a 100)"
 *         energyCost:
 *           type: integer
 *           minimum: 0
 *           maximum: 100
 *           default: 20
 *           example: 30
 *           description: "Costo de energía para habilidades especiales"
 *         damageReduction:
 *           type: integer
 *           minimum: 0
 *           maximum: 100
 *           default: 0
 *           example: 15
 *           description: "Reducción de daño (0-100%)"
 */
import express from 'express';
import { heroValidation } from '../../middleware/validation.middleware.js';

export default (controller, ownershipMiddleware, roleAuthMiddleware) => {
  const router = express.Router();

  // Todas las rutas requieren autenticación y agregar rol del usuario
  router.use(authMiddleware);
  router.use(roleAuthMiddleware.addUserRole);

  /**
   * @swagger
   * /api/heroes:
   *   post:
   *     summary: Crear un nuevo héroe (Solo administradores)
   *     tags: [Heroes]
   *     security:
   *       - bearerAuth: []
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             $ref: '#/components/schemas/Hero'
   *           example:
   *             name: "Chapulín Colorado"
   *             alias: "Chapulín"
   *             city: "Ciudad de México"
   *             team: "Los Supergenios"
   *             health: 120
   *             attack: 85
   *             defense: 60
   *             specialAbility: "Antena de Vinil"
   *             isAlive: true
   *             roundsWon: 0
   *             damage: 0
   *             status: "normal"
   *             stamina: 110
   *             speed: 70
   *             critChance: 15
   *             teamAffinity: 25
   *             energyCost: 25
   *             damageReduction: 10
   *     responses:
   *       201:
   *         description: Héroe creado
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/Hero'
   *       400:
   *         description: Error de validación
   *       403:
   *         description: Se requieren permisos de administrador
   */
  router.post('/', roleAuthMiddleware.requireAdmin, heroValidation.create, controller.create.bind(controller));

  /**
   * @swagger
   * /api/heroes:
   *   get:
   *     summary: Listar héroes accesibles (propios + de administradores)
   *     tags: [Heroes]
   *     security:
   *       - bearerAuth: []
   *     responses:
   *       200:
   *         description: Lista de héroes accesibles
   *         content:
   *           application/json:
   *             schema:
   *               type: array
   *               items:
   *                 $ref: '#/components/schemas/Hero'
   */
  router.get('/', controller.list.bind(controller));

  /**
   * @swagger
   * /api/heroes/city/{city}:
   *   get:
   *     summary: Listar héroes por ciudad (accesibles por el usuario)
   *     tags: [Heroes]
   *     security:
   *       - bearerAuth: []
   *     parameters:
   *       - in: path
   *         name: city
   *         required: true
   *         schema:
   *           type: string
   *         description: Nombre de la ciudad
   *     responses:
   *       200:
   *         description: Lista de héroes accesibles en la ciudad
   *         content:
   *           application/json:
   *             schema:
   *               type: array
   *               items:
   *                 $ref: '#/components/schemas/Hero'
   */
  router.get('/city/:city', controller.findByCity.bind(controller));

  /**
   * @swagger
   * /api/heroes/{id}:
   *   get:
   *     summary: Obtener un héroe por ID
   *     tags: [Heroes]
   *     security:
   *       - bearerAuth: []
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema:
   *           type: string
   *         description: ID del héroe
   *     responses:
   *       200:
   *         description: Detalle del héroe
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/Hero'
   */
  // Para ver un héroe específico, debe tener acceso (propio o de admin)
  router.get('/:id', controller.get.bind(controller));

  /**
   * @swagger
   * /api/heroes/{id}:
   *   put:
   *     summary: Actualizar un héroe
   *     description: |
   *       - Administradores: pueden editar cualquier campo de cualquier héroe
   *       - Usuarios: solo pueden editar campos específicos (team, status, stamina, hpCurrent) de héroes accesibles
   *     tags: [Heroes]
   *     security:
   *       - bearerAuth: []
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema:
   *           type: string
   *         description: ID del héroe
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             $ref: '#/components/schemas/Hero'
   *           example:
   *             team: "Nuevo Equipo"
   *             status: "fortalecido"
   *             stamina: 95
   *             hpCurrent: 85
   *     responses:
   *       200:
   *         description: Héroe actualizado
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/Hero'
   *       403:
   *         description: Permisos insuficientes o campos no permitidos
   */
  router.put('/:id', roleAuthMiddleware.checkEditPermissions, heroValidation.update, controller.update.bind(controller));

  /**
   * @swagger
   * /api/heroes/{id}:
   *   delete:
   *     summary: Eliminar un héroe (Solo administradores o propietarios)
   *     tags: [Heroes]
   *     security:
   *       - bearerAuth: []
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema:
   *           type: string
   *         description: ID del héroe
   *     responses:
   *       204:
   *         description: Héroe eliminado
   *       403:
   *         description: Sin permisos para eliminar
   */
  router.delete('/:id', ownershipMiddleware.validateHeroOwnership, controller.delete.bind(controller));

  return router;
};
