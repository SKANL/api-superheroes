// Middleware de validación de propiedad de recursos
import { GetBattleUseCase } from '../../application/use-cases/GetBattleUseCase.js';
import { GetTeamBattleUseCase } from '../../application/use-cases/GetTeamBattleUseCase.js';
import { ValidateHeroOwnershipUseCase } from '../../application/use-cases/ValidateHeroOwnershipUseCase.js';
import { ValidateVillainOwnershipUseCase } from '../../application/use-cases/ValidateVillainOwnershipUseCase.js';

/**
 * Factory para crear middleware de validación de propiedad
 * @param {Object} deps - Dependencias del middleware
 * @returns {Function} Middleware de Express
 */
export const ownershipMiddlewareFactory = (deps) => {
  const { battleRepository, teamBattleRepository, heroRepository, villainRepository } = deps;
  const getBattleUseCase = new GetBattleUseCase(battleRepository);
  const getTeamBattleUseCase = new GetTeamBattleUseCase(teamBattleRepository);
  const validateHeroOwnershipUseCase = new ValidateHeroOwnershipUseCase(heroRepository);
  const validateVillainOwnershipUseCase = new ValidateVillainOwnershipUseCase(villainRepository);

  /**
   * Middleware para validar la propiedad de una batalla
   * @param {Express.Request} req - Objeto de solicitud
   * @param {Express.Response} res - Objeto de respuesta
   * @param {Function} next - Función next
   */
  const validateBattleOwnership = async (req, res, next) => {
    try {
      const battleId = req.params.id;
      const userId = req.user.id;

      if (!battleId || !userId) {
        return res.status(400).json({ 
          success: false, 
          error: 'ID de batalla o usuario no proporcionado' 
        });
      }

      const battle = await getBattleUseCase.execute(battleId);
      
      if (!battle) {
        return res.status(404).json({ 
          success: false, 
          error: 'Batalla no encontrada' 
        });
      }

      if (battle.owner !== userId) {
        return res.status(403).json({ 
          success: false, 
          error: 'No tienes permiso para acceder a esta batalla' 
        });
      }

      next();
    } catch (error) {
      console.error('Error validando propiedad de batalla:', error);
      res.status(500).json({ 
        success: false, 
        error: 'Error al validar la propiedad de la batalla' 
      });
    }
  };

  /**
   * Middleware para validar la propiedad de una batalla por equipos
   * @param {Express.Request} req - Objeto de solicitud
   * @param {Express.Response} res - Objeto de respuesta
   * @param {Function} next - Función next
   */
  const validateTeamBattleOwnership = async (req, res, next) => {
    console.log('[OWNERSHIP] validateTeamBattleOwnership', {
      params: req.params,
      user: req.user
    });
    try {
      const teamBattleId = req.params.id;
      const userId = req.user.id;
      console.log('[OWNERSHIP] teamBattleId:', teamBattleId, 'userId:', userId);

      if (!teamBattleId || !userId) {
        console.warn('[OWNERSHIP] Falta teamBattleId o userId');
        return res.status(400).json({ 
          success: false, 
          error: 'ID de batalla por equipos o usuario no proporcionado' 
        });
      }

      const teamBattle = await getTeamBattleUseCase.execute(teamBattleId);
      console.log('[OWNERSHIP] teamBattle encontrado:', teamBattle);
      
      if (!teamBattle) {
        console.warn('[OWNERSHIP] Batalla por equipos no encontrada');
        return res.status(404).json({ 
          success: false, 
          error: 'Batalla por equipos no encontrada' 
        });
      }

      if (teamBattle.owner !== userId) {
        console.warn('[OWNERSHIP] El usuario no es owner de la batalla', { owner: teamBattle.owner, userId });
        return res.status(403).json({ 
          success: false, 
          error: 'No tienes permiso para acceder a esta batalla por equipos' 
        });
      }

      next();
    } catch (error) {
      console.error('Error validando propiedad de batalla por equipos:', error);
      res.status(500).json({ 
        success: false, 
        error: 'Error al validar la propiedad de la batalla por equipos' 
      });
    }
  };

  /**
   * Middleware para validar la propiedad de un héroe
   * @param {Express.Request} req - Objeto de solicitud
   * @param {Express.Response} res - Objeto de respuesta
   * @param {Function} next - Función next
   */
  const validateHeroOwnership = async (req, res, next) => {
    try {
      const heroId = req.params.id;
      const userId = req.user.id;

      if (!heroId || !userId) {
        return res.status(400).json({ 
          success: false, 
          error: 'ID de héroe o usuario no proporcionado' 
        });
      }

      const isOwner = await validateHeroOwnershipUseCase.execute(heroId, userId);
      
      if (!isOwner) {
        return res.status(403).json({ 
          success: false, 
          error: 'No tienes permiso para acceder a este héroe' 
        });
      }

      next();
    } catch (error) {
      console.error('Error validando propiedad de héroe:', error);
      res.status(500).json({ 
        success: false, 
        error: 'Error al validar la propiedad del héroe' 
      });
    }
  };

  /**
   * Middleware para validar la propiedad de un villano
   * @param {Express.Request} req - Objeto de solicitud
   * @param {Express.Response} res - Objeto de respuesta
   * @param {Function} next - Función next
   */
  const validateVillainOwnership = async (req, res, next) => {
    try {
      const villainId = req.params.id;
      const userId = req.user.id;

      if (!villainId || !userId) {
        return res.status(400).json({ 
          success: false, 
          error: 'ID de villano o usuario no proporcionado' 
        });
      }

      const isOwner = await validateVillainOwnershipUseCase.execute(villainId, userId);
      
      if (!isOwner) {
        return res.status(403).json({ 
          success: false, 
          error: 'No tienes permiso para acceder a este villano' 
        });
      }

      next();
    } catch (error) {
      console.error('Error validando propiedad de villano:', error);
      res.status(500).json({ 
        success: false, 
        error: 'Error al validar la propiedad del villano' 
      });
    }
  };

  return {
    validateBattleOwnership,
    validateTeamBattleOwnership,
    validateHeroOwnership,
    validateVillainOwnership
  };
};

export default ownershipMiddlewareFactory;
