import { GetUserProfileUseCase } from '../../application/use-cases/auth/GetUserProfileUseCase.js';

/**
 * Factory para crear middleware de autorización por roles
 * @param {Object} deps - Dependencias del middleware
 * @returns {Object} Middleware functions
 */
export const roleAuthorizationMiddlewareFactory = (deps) => {
  const { userRepository } = deps;
  const getUserProfileUseCase = new GetUserProfileUseCase(userRepository);

  /**
   * Middleware para verificar que el usuario es administrador
   * @param {Express.Request} req - Objeto de solicitud
   * @param {Express.Response} res - Objeto de respuesta
   * @param {Function} next - Función next
   */
  const requireAdmin = async (req, res, next) => {
    try {
      const userId = req.user.id;
      
      if (!userId) {
        return res.status(401).json({ 
          success: false, 
          error: 'Usuario no autenticado' 
        });
      }

      const user = await userRepository.findById(userId);
      
      if (!user) {
        return res.status(404).json({ 
          success: false, 
          error: 'Usuario no encontrado' 
        });
      }

      if (user.role !== 'admin') {
        return res.status(403).json({ 
          success: false, 
          error: 'Acceso denegado. Se requieren permisos de administrador.' 
        });
      }

      // Agregar información del usuario al request
      req.user.role = user.role;
      next();
    } catch (error) {
      console.error('Error validando rol de administrador:', error);
      res.status(500).json({ 
        success: false, 
        error: 'Error al validar permisos de usuario' 
      });
    }
  };

  /**
   * Middleware para permitir tanto administradores como usuarios
   * (pero agrega información de rol al request)
   * @param {Express.Request} req - Objeto de solicitud
   * @param {Express.Response} res - Objeto de respuesta
   * @param {Function} next - Función next
   */
  const addUserRole = async (req, res, next) => {
    try {
      const userId = req.user.id;
      
      if (!userId) {
        return res.status(401).json({ 
          success: false, 
          error: 'Usuario no autenticado' 
        });
      }

      const user = await userRepository.findById(userId);
      
      if (!user) {
        return res.status(404).json({ 
          success: false, 
          error: 'Usuario no encontrado' 
        });
      }

      // Agregar información del usuario al request
      req.user.role = user.role;
      req.user.username = user.username;
      req.user.email = user.email;
      
      next();
    } catch (error) {
      console.error('Error obteniendo información de usuario:', error);
      res.status(500).json({ 
        success: false, 
        error: 'Error al obtener información de usuario' 
      });
    }
  };

  /**
   * Middleware para verificar que el usuario puede editar la entidad
   * Los administradores pueden editar cualquier cosa
   * Los usuarios solo pueden editar campos permitidos de entidades que no son suyas
   * @param {Express.Request} req - Objeto de solicitud
   * @param {Express.Response} res - Objeto de respuesta
   * @param {Function} next - Función next
   */
  const checkEditPermissions = async (req, res, next) => {
    try {
      const userId = req.user.id;
      const userRole = req.user.role;
      
      // Si es administrador, puede editar cualquier cosa
      if (userRole === 'admin') {
        return next();
      }

      // Si es usuario normal, validar qué campos puede editar
      if (userRole === 'user') {
        const allowedFields = [
          'team', 'status', 'stamina', 'hpCurrent'
        ];
        
        const requestedFields = Object.keys(req.body);
        const forbiddenFields = requestedFields.filter(field => !allowedFields.includes(field));
        
        if (forbiddenFields.length > 0) {
          return res.status(403).json({ 
            success: false, 
            error: `Los usuarios solo pueden editar los siguientes campos: ${allowedFields.join(', ')}. Campos no permitidos: ${forbiddenFields.join(', ')}` 
          });
        }
      }

      next();
    } catch (error) {
      console.error('Error validando permisos de edición:', error);
      res.status(500).json({ 
        success: false, 
        error: 'Error al validar permisos de edición' 
      });
    }
  };

  return {
    requireAdmin,
    addUserRole,
    checkEditPermissions
  };
};

export default roleAuthorizationMiddlewareFactory;
