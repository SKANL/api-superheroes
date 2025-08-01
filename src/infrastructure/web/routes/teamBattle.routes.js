// Rutas para TeamBattle
/**
 *           example: "user123"
 *           description: "ID del usuario propietario de la batalla por equipos"
 *         rounds:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/Round'
 *         currentRoundIndex:
 *           type: integer
 *           example: 0
 *     Round:
 *       type: object
 *       properties:
 *         roundNumber:
 *           type: integer
 *           example: 1
 *         heroActions:
 *           type: array
 *           items:
 *             type: object
 *             properties:
 *               id:
 *                 type: string
 *               damage:
 *                 type: integer
 *           example:
 *             - id: "h1"
 *               damage: 25
 *             - id: "h2"
 *               damage: 30
 *         villainActions:
 *           type: array
 *           items:
 *             type: object
 *             properties:
 *               id:
 *                 type: string
 *               damage:
 *                 type: integer
 *           example:
 *             - id: "v1"
 *               damage: 20
 *         result:
 *           type: string
 *           example: "heroes"
 */
import express from 'express';
import { authMiddleware } from '../../middleware/auth.middleware.js';
import { teamBattleValidation } from '../../middleware/validation.middleware.js';

export default (controller, ownershipMiddleware) => {
  const router = express.Router();
  router.use(authMiddleware);
  /**
   * @swagger
   * /api/team-battles:
   *   post:
   *     summary: Registrar una nueva batalla por equipos (el usuario autenticado será el propietario)
   *     tags: [TeamBattles]
   *     security:
   *       - bearerAuth: []
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             required:
   *               - heroIds
   *               - villainIds
   *             properties:
   *               heroIds:
   *                 type: array
   *                 items:
   *                   type: string
   *               villainIds:
   *                 type: array
   *                 items:
   *                   type: string
   *               mode:
   *                 type: string
   *                 enum: [manual, auto]
   *                 default: manual
   *                 description: Modo de batalla - manual (ataques individuales) o auto (simulación completa)
   *     responses:
   *       201:
   *         description: Batalla por equipos registrada
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/TeamBattle'
   *       400:
   *         description: Datos inválidos
   */
  router.post('/', teamBattleValidation.create, controller.create.bind(controller));
  /**
   * @swagger
   * /api/team-battles:
   *   get:
   *     summary: Listar todas las batallas por equipos del usuario autenticado
   *     tags: [TeamBattles]
   *     security:
   *       - bearerAuth: []
   *     responses:
   *       200:
   *         description: Lista de batallas por equipos
   *         content:
   *           application/json:
   *             schema:
   *               type: array
   *               items:
   *                 $ref: '#/components/schemas/TeamBattle'
   */
  router.get('/', controller.list.bind(controller));
  /**
   * @swagger
   * /api/team-battles/{id}:
   *   get:
   *     summary: Obtener una batalla por equipos por ID (requiere ser propietario)
   *     tags: [TeamBattles]
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
   *         description: Detalle de la batalla por equipos
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/TeamBattle'
   *       404:
   *         description: Batalla por equipos no encontrada
   */
  router.get('/:id', ownershipMiddleware.validateTeamBattleOwnership, controller.get.bind(controller));
  /**
   * @swagger
   * /api/team-battles/hero/{heroId}:
   *   get:
   *     summary: Listar batallas por equipos por héroe
   *     tags: [TeamBattles]
   *     parameters:
   *       - in: path
   *         name: heroId
   *         required: true
   *         schema:
   *           type: string
   *     responses:
   *       200:
   *         description: Lista de batallas por equipos con el héroe
   *         content:
   *           application/json:
   *             schema:
   *               type: array
   *               items:
   *                 $ref: '#/components/schemas/TeamBattle'
   */
  router.get('/hero/:heroId', controller.listByHero.bind(controller));
  /**
   * @swagger
   * /api/team-battles/villain/{villainId}:
   *   get:
   *     summary: Listar batallas por equipos por villano
   *     tags: [TeamBattles]
   *     parameters:
   *       - in: path
   *         name: villainId
   *         required: true
   *         schema:
   *           type: string
   *     responses:
   *       200:
   *         description: Lista de batallas por equipos con el villano
   *         content:
   *           application/json:
   *             schema:
   *               type: array
   *               items:
   *                 $ref: '#/components/schemas/TeamBattle'
   */
  router.get('/villain/:villainId', controller.listByVillain.bind(controller));
  /**
   * @swagger
   * /api/team-battles/{id}:
   *   put:
   *     summary: Actualizar una batalla por equipos (requiere ser propietario)
   *     tags: [TeamBattles]
   *     security:
   *       - bearerAuth: []
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema:
   *           type: string
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             properties:
   *               heroIds:
   *                 type: array
   *                 items:
   *                   type: string
   *               villainIds:
   *                 type: array
   *                 items:
   *                   type: string
   *     responses:
   *       200:
   *         description: Batalla por equipos actualizada
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/TeamBattle'
   *       400:
   *         description: Datos inválidos
   *       404:
   *         description: Batalla por equipos no encontrada
   */
  router.put('/:id', ownershipMiddleware.validateTeamBattleOwnership, teamBattleValidation.update, controller.update.bind(controller));
  /**
   * @swagger
   * /api/team-battles/{id}:
   *   delete:
   *     summary: Eliminar una batalla por equipos por ID (requiere ser propietario)
   *     tags: [TeamBattles]
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
   *         description: Batalla por equipos eliminada
   *       404:
   *         description: Batalla por equipos no encontrada
   */
  router.delete('/:id', ownershipMiddleware.validateTeamBattleOwnership, teamBattleValidation.idParam, controller.delete.bind(controller));
  /**
   * @swagger
   * /api/team-battles/{id}/state:
   *   get:
   *     summary: Obtener el estado de una batalla por equipos por ID
   *     tags: [TeamBattles]
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema:
   *           type: string
   *     responses:
   *       200:
   *         description: Estado de la batalla por equipos
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 id:
   *                   type: string
   *                 state:
   *                   type: string
   *       404:
   *         description: Batalla por equipos no encontrada
   */
  router.get('/:id/state', ownershipMiddleware.validateTeamBattleOwnership, teamBattleValidation.idParam, controller.state.bind(controller));
  /**
   * @swagger
   * /api/team-battles/{id}/restart:
   *   post:
   *     summary: Reiniciar una batalla por equipos por ID
   *     tags: [TeamBattles]
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema:
   *           type: string
   *     responses:
   *       200:
   *         description: Batalla por equipos reiniciada
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/TeamBattle'
   *       404:
   *         description: Batalla por equipos no encontrada
   */
  /**
   * @swagger
   * /api/team-battles/{id}/rounds:
   *   post:
   *     summary: Ejecutar una acción en la ronda actual
   *     tags: [TeamBattles]
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema:
   *           type: string
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             properties:
   *               heroActions:
   *                 type: array
   *                 items:
   *                   type: object
   *                   properties:
   *                     id:
   *                       type: string
   *                     action:
   *                       type: string
   *                     target:
   *                       type: string
   *               villainActions:
   *                 type: array
   *                 items:
   *                   type: object
   *                   properties:
   *                     id:
   *                       type: string
   *                     action:
   *                       type: string
   *                     target:
   *                       type: string
   *     responses:
   *       200:
   *         description: Estado actualizado de la batalla
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/TeamBattle'
   *       400:
   *         description: Petición inválida o batalla ya finalizada
   *       404:
   *         description: Batalla no encontrada
   */
  router.post('/:id/rounds', ownershipMiddleware.validateTeamBattleOwnership, controller.performRoundAction.bind(controller));
  /**
   * @swagger
   * /api/team-battles/{id}/finish:
   *   post:
   *     summary: Finalizar la batalla y devolver resultados
   *     tags: [TeamBattles]
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema:
   *           type: string
   *     responses:
   *       200:
   *         description: Resultados de la batalla
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 result:
   *                   type: string
   *                 statistics:
   *                   type: array
   *                   items:
   *                     type: string
   */
  router.post('/:id/finish', ownershipMiddleware.validateTeamBattleOwnership, controller.finishBattle.bind(controller));
  /**
   * @swagger
   * /api/team-battles/{id}/attack:
   *   post:
   *     summary: Ejecutar un ataque en el juego de peleas con habilidades especiales
   *     tags: [TeamBattles]
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema:
   *           type: string
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             required:
   *               - attackerType
   *               - attackerId
   *               - targetId
   *             properties:
   *               attackerType:
   *                 type: string
   *                 enum: [hero, villain]
   *                 example: "hero"
   *               attackerId:
   *                 type: string
   *                 example: "h1"
   *               targetId:
   *                 type: string
   *                 example: "v1"
   *               attackType:
   *                 type: string
   *                 enum: [normal, special]
   *                 default: normal
   *                 example: "special"
   *     responses:
   *       200:
   *         description: Resultado del ataque y estado actualizado
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 battle:
   *                   $ref: '#/components/schemas/TeamBattle'
   *                 attackResult:
   *                   type: object
   *                   properties:
   *                     damage:
   *                       type: number
   *                     critical:
   *                       type: boolean
   *                     message:
   *                       type: string
   *       400:
   *         description: Ataque inválido o batalla finalizada
   *       404:
   *         description: Batalla no encontrada
   */
  router.post('/:id/attack', ownershipMiddleware.validateTeamBattleOwnership, teamBattleValidation.idParam, controller.performAttack.bind(controller));
  
  router.post('/:id/restart', ownershipMiddleware.validateTeamBattleOwnership, teamBattleValidation.idParam, controller.restart.bind(controller));

  /**
   * @swagger
   * /api/team-battles/{id}/start:
   *   post:
   *     summary: Iniciar o reiniciar una batalla por equipos (si está finished la reinicia, si está in_progress solo devuelve el estado)
   *     tags: [TeamBattles]
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema:
   *           type: string
   *     responses:
   *       200:
   *         description: Estado actualizado de la batalla
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/TeamBattle'
   *       404:
   *         description: Batalla por equipos no encontrada
   */
  router.post('/:id/start', ownershipMiddleware.validateTeamBattleOwnership, teamBattleValidation.idParam, controller.start.bind(controller));

  /**
   * @swagger
   * /api/team-battles/{id}/select-side:
   *   post:
   *     summary: Seleccionar bando en una batalla por equipos específica
   *     tags: [TeamBattles]
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema:
   *           type: string
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             required:
   *               - side
   *             properties:
   *               side:
   *                 type: string
   *                 enum: [hero, villain]
   *                 example: "hero"
   *     responses:
   *       200:
   *         description: Bando seleccionado correctamente
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 message:
   *                   type: string
   *                 selectedSides:
   *                   type: object
   *       400:
   *         description: Petición inválida
   *       404:
   *         description: Batalla por equipos no encontrada
   */
  // Debug log para saber si la petición llega a la ruta antes de los middlewares
  router.post('/:id/select-side', (req, res, next) => {
    console.log('LLEGA A RUTA SELECT-SIDE', req.params, req.body);
    next();
  }, ownershipMiddleware.validateTeamBattleOwnership, teamBattleValidation.selectSide, controller.selectSideForBattle.bind(controller));
  
  /**
   * @swagger
   * /api/team-battles/select-side:
   *   post:
   *     summary: Seleccionar bando en la batalla por equipos
   *     tags: [TeamBattles]
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             required:
   *               - side
   *             properties:
   *               side:
   *                 type: string
   *                 enum: [hero, villain]
   *                 example: "hero"
   *     responses:
   *       200:
   *         description: Bando seleccionado correctamente
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 message:
   *                   type: string
   *       400:
   *         description: Petición inválida
   */
  router.post('/select-side', controller.selectSide.bind(controller));
  
  return router;
};

function calculateBattleResult(battle) {
  try {
    console.log('Datos de entrada para calcular el resultado:', battle);

    const heroesAlive = battle.characters.filter(c => c.type === 'hero' && c.isAlive).length;
    const villainsAlive = battle.characters.filter(c => c.type === 'villain' && c.isAlive).length;

    let result;
    if (heroesAlive > villainsAlive) {
      result = 'Heroes ganaron';
    } else if (villainsAlive > heroesAlive) {
      result = 'Villains ganaron';
    } else {
      result = 'Empate';
    }

    console.log('Resultado calculado:', result);
    return result;
  } catch (error) {
    console.error('Error calculando el resultado:', error);
    return null;
  }
}

function generateBattleStatistics(battle) {
  try {
    console.log('Datos de entrada para generar estadísticas:', battle);

    const statistics = battle.characters.map(c => ({
      name: c.alias || c.name,
      type: c.type,
      health: c.health,
      isAlive: c.isAlive,
    }));

    console.log('Estadísticas generadas:', statistics);
    return statistics;
  } catch (error) {
    console.error('Error generando estadísticas:', error);
    return null;
  }
}
