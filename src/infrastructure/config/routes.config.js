// Configuración de rutas para server.config.js
import healthRoutes from '../web/routes/health.routes.js';
import docsRoutes from '../web/routes/docs.routes.js';
import heroRoutes from '../web/routes/hero.routes.js';
import villainRoutes from '../web/routes/villain.routes.js';
import battleRoutes from '../web/routes/battle.routes.js';
import teamBattleRoutes from '../web/routes/teamBattle.routes.js';
import cityRoutes from '../web/routes/city.routes.js';
import authRoutes from '../web/routes/auth.routes.js';
import { ownershipMiddlewareFactory } from '../middleware/ownership.middleware.js';

export default (controllers, app, ownershipMiddleware, roleAuthMiddleware) => {
  return {
    health: healthRoutes,
    docs: docsRoutes(app),
    api: {
      heroes: heroRoutes(controllers.hero, ownershipMiddleware, roleAuthMiddleware),
      villains: villainRoutes(controllers.villain, ownershipMiddleware, roleAuthMiddleware),
      battles: battleRoutes(controllers.battle, ownershipMiddleware),
      teamBattles: teamBattleRoutes(controllers.teamBattle, ownershipMiddleware),
      cities: cityRoutes(controllers.city),
      auth: authRoutes(controllers.auth),
    },
  };
};
