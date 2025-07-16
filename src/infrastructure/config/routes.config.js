// Configuración de rutas para server.config.js
import healthRoutes from '../web/routes/health.routes.js';
import docsRoutes from '../web/routes/docs.routes.js';
import heroRoutes from '../web/routes/hero.routes.js';
import villainRoutes from '../web/routes/villain.routes.js';
import battleRoutes from '../web/routes/battle.routes.js';
import teamBattleRoutes from '../web/routes/teamBattle.routes.js';
import cityRoutes from '../web/routes/city.routes.js';

export default (controllers, app) => {

  return {
    health: healthRoutes,
    api: {
      heroes: heroRoutes(controllers.hero),
      villains: villainRoutes(controllers.villain),
      battles: battleRoutes(controllers.battle),
      teamBattles: teamBattleRoutes(controllers.teamBattle),
      cities: cityRoutes(controllers.city),
    },
    docs: docsRoutes(app),
  };
};
