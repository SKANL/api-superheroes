// Rutas para TeamBattle
/**
 * @swagger
 * tags:
 *   name: TeamBattles
 *   description: Gestión de batallas por equipos entre héroes y villanos
 *
 * components:
 *   schemas:
 *     TeamBattle:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           example: "tb12345"
 *         heroIds:
 *           type: array
 *           items:
 *             type: string
 *           example: ["h1","h2"]
 *         villainIds:
 *           type: array
 *           items:
 *             type: string
 *           example: ["v1","v2"]
 *         date:
 *           type: string
 *           example: "2025-07-10T12:00:00.000Z"
 *         result:
 *           type: string
 *           example: "heroes"
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
import { teamBattleValidation } from '../../middleware/validation.middleware.js';
export default controller => {
  const router = express.Router();
  /**
   * @swagger
   * /api/team-battles:
   *   post:
   *     summary: Registrar una nueva batalla por equipos
   *     tags: [TeamBattles]
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
   *     summary: Listar todas las batallas por equipos
   *     tags: [TeamBattles]
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
   *     summary: Obtener una batalla por equipos por ID
   *     tags: [TeamBattles]
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
  router.get('/:id', controller.get.bind(controller));
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
   *     summary: Actualizar una batalla por equipos por ID
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
  router.put('/:id', teamBattleValidation.update, controller.update.bind(controller));
  /**
   * @swagger
   * /api/team-battles/{id}:
   *   delete:
   *     summary: Eliminar una batalla por equipos por ID
   *     tags: [TeamBattles]
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
  router.delete('/:id', teamBattleValidation.idParam, controller.delete.bind(controller));
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
  router.get('/:id/state', teamBattleValidation.idParam, controller.state.bind(controller));
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
  router.post('/:id/rounds', controller.performRoundAction.bind(controller));
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
  router.post('/:id/finish', controller.finishBattle.bind(controller));
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
  router.post('/:id/attack', teamBattleValidation.idParam, controller.performAttack.bind(controller));
  
  router.post('/:id/restart', teamBattleValidation.idParam, controller.restart.bind(controller));
  
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
