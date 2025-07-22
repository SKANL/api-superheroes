import express from 'express';
import { authMiddleware } from '../../middleware/auth.middleware.js';

const router = express.Router();

export default controller => {
  /**
   * @swagger
   * tags:
   *   name: Authentication
   *   description: Endpoints para autenticación de usuarios
   */

  /**
   * @swagger
   * /auth/signup:
   *   post:
   *     summary: Registrar un nuevo usuario
   *     tags: [Authentication]
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             required:
   *               - username
   *               - email
   *               - password
   *             properties:
   *               username:
   *                 type: string
   *                 example: "johndoe"
   *               email:
   *                 type: string
   *                 format: email
   *                 example: "john@example.com"
   *               password:
   *                 type: string
   *                 minLength: 6
   *                 example: "password123"
   *               role:
   *                 type: string
   *                 enum: [admin, user]
   *                 default: user
   *                 example: "user"
   *                 description: "Rol del usuario. Por defecto es 'user'."
   *     responses:
   *       201:
   *         description: Usuario registrado exitosamente
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 token:
   *                   type: string
   *                 user:
   *                   type: object
   *                   properties:
   *                     id:
   *                       type: string
   *                     username:
   *                       type: string
   *                     email:
   *                       type: string
   *                     role:
   *                       type: string
   *       400:
   *         description: Datos inválidos o rol no válido
   */
  router.post('/signup', controller.signup.bind(controller));

  /**
   * @swagger
   * /auth/login:
   *   post:
   *     summary: Iniciar sesión y obtener un token JWT
   *     tags: [Authentication]
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             required:
   *               - email
   *               - password
   *             properties:
   *               email:
   *                 type: string
   *               password:
   *                 type: string
   *     responses:
   *       200:
   *         description: Inicio de sesión exitoso
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 token:
   *                   type: string
   *       401:
   *         description: Credenciales inválidas
   */
  router.post('/login', controller.login.bind(controller));

  /**
   * @swagger
   * /auth/me:
   *   get:
   *     summary: Obtener información del usuario autenticado
   *     tags: [Authentication]
   *     security:
   *       - bearerAuth: []
   *     responses:
   *       200:
   *         description: Información del usuario autenticado
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 id:
   *                   type: string
   *                 email:
   *                   type: string
   *       401:
   *         description: Token inválido o no proporcionado
   */
  router.get('/me', authMiddleware, controller.me.bind(controller));

  return router;
};
