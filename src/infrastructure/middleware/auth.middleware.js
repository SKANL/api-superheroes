import { JWTService } from '../../domain/services/JWTService.js';

/**
 * Middleware para proteger rutas usando JWT.
 * Extrae el token de Authorization header y valida.
 * Si es válido, fija req.user = { id: userId }.
 */
export async function authMiddleware(req, res, next) {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'Token no proporcionado' });
    }
    const token = authHeader.split(' ')[1];
    const payload = JWTService.verify(token);
    if (!payload || !payload.userId) {
      return res.status(401).json({ error: 'Token inválido' });
    }
    req.user = { id: payload.userId };
    next();
  } catch (err) {
    return res.status(401).json({ error: 'Token inválido o expirado' });
  }
}
