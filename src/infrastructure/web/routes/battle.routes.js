// Rutas para Battle
/**
 * @swagger
 * tags:
 *   name: Battles
 *   description: Gestión de batallas entre héroes y villanos
 *
 * components:
 *   schemas:
 *     Battle:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           example: "b12345"
 *         heroId:
 *           type: string
 *           example: "172839"
 *         villainId:
 *           type: string
 *           example: "987654"
 *         date:
 *           type: string
 *           example: "2025-07-10T12:00:00.000Z"
 *         result:
 *           type: string
 *           example: "draw"
 *         owner:
 *           type: string
 *           example: "user123"
 *           description: "ID del usuario propietario de la batalla"
 */
import express from 'express';
import { authMiddleware } from '../../middleware/auth.middleware.js';
import { battleValidation } from '../../middleware/validation.middleware.js';
export default (controller, ownershipMiddleware) => {
  const router = express.Router();
  router.use(authMiddleware);
  /**
   * @swagger
   * /api/battles:
   *   post:
   *     summary: Registrar una nueva batalla
   *     tags: [Battles]
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             required:
   *               - heroId
   *               - villainId
   *             properties:
   *               heroId:
   *                 type: string
   *                 example: "172839"
   *               villainId:
   *                 type: string
   *                 example: "987654"
   *     responses:
   *       201:
   *         description: Batalla registrada
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/Battle'
   *       400:
   *         description: Datos inválidos
   *         content:
   *           application/json:
   *             example:
   *               errors:
   *                 - msg: "heroId is required"
   *                   param: "heroId"
   *                   location: "body"
   */
  router.post('/', battleValidation.create, controller.create.bind(controller));
  /**
   * @swagger
   * /api/battles:
   *   get:
   *     summary: Listar todas las batallas
   *     tags: [Battles]
   *     responses:
   *       200:
   *         description: Lista de batallas
   *         content:
   *           application/json:
   *             schema:
   *               type: array
   *               items:
   *                 $ref: '#/components/schemas/Battle'
   */
  router.get('/', controller.list.bind(controller));
  /**
   * @swagger
   * /api/battles/{id}:
   *   get:
   *     summary: Obtener una batalla por ID
   *     tags: [Battles]
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema:
   *           type: string
   *         description: ID de la batalla
   *     responses:
   *       200:
   *         description: Detalle de la batalla
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/Battle'
   *       404:
   *         description: Batalla no encontrada
   */
  router.get('/:id', ownershipMiddleware.validateBattleOwnership, controller.get.bind(controller));
  /**
   * @swagger
   * /api/battles/hero/{heroId}:
   *   get:
   *     summary: Listar batallas por héroe
   *     tags: [Battles]
   *     parameters:
   *       - in: path
   *         name: heroId
   *         required: true
   *         schema:
   *           type: string
   *         description: ID del héroe
   *     responses:
   *       200:
   *         description: Lista de batallas del héroe
   *         content:
   *           application/json:
   *             schema:
   *               type: array
   *               items:
   *                 $ref: '#/components/schemas/Battle'
   */
  router.get('/hero/:heroId', controller.listByHero.bind(controller));
  /**
   * @swagger
   * /api/battles/villain/{villainId}:
   *   get:
   *     summary: Listar batallas por villano
   *     tags: [Battles]
   *     parameters:
   *       - in: path
   *         name: villainId
   *         required: true
   *         schema:
   *           type: string
   *         description: ID del villano
   *     responses:
   *       200:
   *         description: Lista de batallas del villano
   *         content:
   *           application/json:
   *             schema:
   *               type: array
   *               items:
   *                 $ref: '#/components/schemas/Battle'
   */
  router.get('/villain/:villainId', controller.listByVillain.bind(controller));
  /**
   * @swagger
   * /api/battles/{id}/attack:
   *   post:
   *     summary: Ejecutar un ataque en una batalla
   *     tags: [Battles]
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
   *               attackType:
   *                 type: string
   *                 enum: [normal, special]
   *                 example: normal
   *     responses:
   *       200:
   *         description: Resultado del ataque y estado actualizado
   *       400:
   *         description: Ataque inválido o batalla finalizada
   *       404:
   *         description: Batalla no encontrada
   */
  router.post('/:id/attack', battleValidation.idParam, controller.attack.bind(controller));
  /**
   * @swagger
   * /api/battles/{id}/finish:
   *   post:
   *     summary: Finalizar la batalla y devolver resultados
   *     tags: [Battles]
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema:
   *           type: string
   *     responses:
   *       200:
   *         description: Resultados de la batalla
   *       404:
   *         description: Batalla no encontrada
   */
  router.post('/:id/finish', battleValidation.idParam, controller.finish.bind(controller));
  /**
   * @swagger
   * /api/battles/{id}/state:
   *   get:
   *     summary: Obtener el estado actual de una batalla
   *     tags: [Battles]
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema:
   *           type: string
   *     responses:
   *       200:
   *         description: Estado actualizado de la batalla
   *       404:
   *         description: Batalla no encontrada
   */
  router.get('/:id/state', battleValidation.idParam, controller.state.bind(controller));
  return router;
};
