// Middleware para proteger rutas web que requieren autenticación
import authService from '../web/public/shared/auth.service.js';

export const webAuthMiddleware = (req, res, next) => {
  // Verificar si hay token en localStorage (del navegador del cliente)
  const token = req.cookies?.token || req.headers?.authorization?.split(' ')[1];
  
  if (!token) {
    // Redireccionar a la página de login
    return res.redirect('/auth');
  }
  
  try {
    // Verificar el token (podría hacerse con JWT si se implementa verificación en el servidor)
    // Para esta versión simplemente verificamos que existe un token
    next();
  } catch (error) {
    console.error('Error al verificar autenticación web:', error);
    res.redirect('/auth');
  }
};

export default webAuthMiddleware;
