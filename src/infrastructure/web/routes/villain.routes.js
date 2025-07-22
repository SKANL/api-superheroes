// Rutas para Villain
import { authMiddleware } from '../../middleware/auth.middleware.js';

/**
 * @swagger
 * tags:
 *   name: Villains
 *   description: Gestión de villanos
 *
 * components:
 *   schemas:
 *     Villain:
 *       type: object
 *       required:
 *         - name
 *         - alias
 *         - city
 *       properties:
 *         id:
 *           type: string
 *           example: "987654"
 *         name:
 *           type: string
 *           example: "El Rata"
 *         alias:
 *           type: string
 *           example: "Rata"
 *         city:
 *           type: string
 *           example: "Ciudad Gótica"
 *         team:
 *           type: string
 *           example: "Liga de la Maldad"
 *           description: "Equipo al que pertenece el villano"
 *         health:
 *           type: integer
 *           minimum: 1
 *           maximum: 1000
 *           default: 100
 *           example: 100
 *           description: "Puntos de salud del villano"
 *         attack:
 *           type: integer
 *           minimum: 1
 *           maximum: 200
 *           default: 50
 *           example: 75
 *           description: "Valor de ataque del villano"
 *         defense:
 *           type: integer
 *           minimum: 0
 *           maximum: 200
 *           default: 30
 *           example: 45
 *           description: "Valor de defensa del villano"
 *         specialAbility:
 *           type: string
 *           default: "Dark Attack"
 *           example: "Ataque tóxico"
 *           description: "Habilidad especial del villano"
 *         isAlive:
 *           type: boolean
 *           default: true
 *           example: true
 *           description: "Indica si el villano está vivo"
 *         roundsWon:
 *           type: integer
 *           minimum: 0
 *           maximum: 1000
 *           default: 0
 *           example: 2
 *           description: "Número de rondas ganadas"
 *         damage:
 *           type: integer
 *           minimum: 0
 *           maximum: 1000
 *           default: 0
 *           example: 30
 *           description: "Daño infligido en la ronda actual"
 *         status:
 *           type: string
 *           enum: [normal, congelado, envenenado, fortalecido, debilitado, paralizado]
 *           default: "normal"
 *           example: "envenenado"
 *           description: "Estado del villano"
 *         stamina:
 *           type: integer
 *           minimum: 0
 *           maximum: 200
 *           default: 100
 *           example: 80
 *           description: "Energía o resistencia del villano"
 *         speed:
 *           type: integer
 *           minimum: 1
 *           maximum: 200
 *           default: 50
 *           example: 60
 *           description: "Velocidad del villano"
 *         critChance:
 *           type: integer
 *           minimum: 0
 *           maximum: 100
 *           default: 10
 *           example: 20
 *           description: "Probabilidad de golpe crítico (0-100%)"
 *         teamAffinity:
 *           type: integer
 *           minimum: -100
 *           maximum: 100
 *           default: 0
 *           example: -10
 *           description: "Afinidad con el equipo (-100 a 100)"
 *         energyCost:
 *           type: integer
 *           minimum: 0
 *           maximum: 100
 *           default: 20
 *           example: 35
 *           description: "Costo de energía para habilidades especiales"
 *         damageReduction:
 *           type: integer
 *           minimum: 0
 *           maximum: 100
 *           default: 0
 *           example: 5
 *           description: "Reducción de daño (0-100%)"
 */
import express from 'express';
import { villainValidation } from '../../middleware/validation.middleware.js';

const router = express.Router();
export default (controller, ownershipMiddleware, roleAuthMiddleware) => {
  
  // Todas las rutas requieren autenticación y agregar rol del usuario
  router.use(authMiddleware);
  router.use(roleAuthMiddleware.addUserRole);

  /**
   * @swagger
   * /api/villains:
   *   post:
   *     summary: Crear un nuevo villano (Solo administradores)
   *     tags: [Villains]
   *     security:
   *       - bearerAuth: []
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             $ref: '#/components/schemas/Villain'
   *           example:
   *             name: "El Rata"
   *             alias: "Rata"
   *             city: "Ciudad Gótica"
   *             health: 100
   *             attack: 75
   *             defense: 45
   *             specialAbility: "Ataque tóxico"
   *             isAlive: true
   *             roundsWon: 0
   *             damage: 0
   *             status: "normal"
   *             stamina: 100
   *             speed: 60
   *             critChance: 20
   *             teamAffinity: -10
   *             energyCost: 35
   *             damageReduction: 5
   *     responses:
   *       201:
   *         description: Villano creado exitosamente
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/Villain'
   *       400:
   *         description: Datos inválidos
   */
  router.post('/', roleAuthMiddleware.requireAdmin, villainValidation.create, controller.create.bind(controller));
  
  /**
   * @swagger
   * /api/villains:
   *   get:
   *     summary: Listar villanos accesibles (propios + de administradores)
   *     tags: [Villains]
   *     security:
   *       - bearerAuth: []
   *     responses:
   *       200:
   *         description: Lista de villanos accesibles
   *         content:
   *           application/json:
   *             schema:
   *               type: array
   *               items:
   *                 $ref: '#/components/schemas/Villain'
   */
  router.get('/', controller.list.bind(controller));
  
  /**
   * @swagger
   * /api/villains/city/{city}:
   *   get:
   *     summary: Buscar villanos por ciudad (accesibles por el usuario)
   *     tags: [Villains]
   *     security:
   *       - bearerAuth: []
   *     parameters:
   *       - in: path
   *         name: city
   *         required: true
   *         schema:
   *           type: string
   *         description: Nombre de la ciudad para buscar
   *     responses:
   *       200:
   *         description: Lista de villanos accesibles en la ciudad especificada
   *         content:
   *           application/json:
   *             schema:
   *               type: array
   *               items:
   *                 $ref: '#/components/schemas/Villain'
   */
  router.get('/city/:city', controller.findByCity.bind(controller));
  
  /**
   * @swagger
   * /api/villains/{id}:
   *   get:
   *     summary: Obtener un villano por ID
   *     tags: [Villains]
   *     security:
   *       - bearerAuth: []
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema:
   *           type: string
   *     responses:
   *       200:
   *         description: Detalles del villano
   *       404:
   *         description: Villano no encontrado
   */
  router.get('/:id', controller.get.bind(controller));

  /**
   * @swagger
   * /api/villains/{id}:
   *   put:
   *     summary: Actualizar un villano
   *     description: |
   *       - Administradores: pueden editar cualquier campo de cualquier villano
   *       - Usuarios: solo pueden editar campos específicos (team, status, stamina, hpCurrent) de villanos accesibles
   *     tags: [Villains]
   *     security:
   *       - bearerAuth: []
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema:
   *           type: string
   *         description: ID del villano
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             $ref: '#/components/schemas/Villain'
   *           example:
   *             team: "Nueva Organización"
   *             status: "envenenado"
   *             stamina: 80
   *             hpCurrent: 70
   *     responses:
   *       200:
   *         description: Villano actualizado exitosamente
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/Villain'
   *       400:
   *         description: Datos inválidos
   *       403:
   *         description: Permisos insuficientes o campos no permitidos
   *       404:
   *         description: Villano no encontrado
   */
  router.put('/:id', roleAuthMiddleware.checkEditPermissions, villainValidation.update, controller.update.bind(controller));

  /**
   * @swagger
   * /api/villains/{id}:
   *   delete:
   *     summary: Eliminar un villano (Solo administradores o propietarios)
   *     tags: [Villains]
   *     security:
   *       - bearerAuth: []
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema:
   *           type: string
   *     responses:
   *       204:
   *         description: Villano eliminado exitosamente
   *       403:
   *         description: Sin permisos para eliminar
   */
  router.delete('/:id', ownershipMiddleware.validateVillainOwnership, controller.delete.bind(controller));

  return router;
};
