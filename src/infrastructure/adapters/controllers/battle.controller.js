// Controlador para Battle
export class BattleController {
  constructor({
    createBattleUseCase,
    getBattleUseCase,
    listBattlesUseCase,
    listBattlesByHeroUseCase,
    listBattlesByVillainUseCase,
    performBattleAttackUseCase,
    finishBattleUseCase,
  }) {
    this.createBattleUseCase = createBattleUseCase;
    this.getBattleUseCase = getBattleUseCase;
    this.listBattlesUseCase = listBattlesUseCase;
    this.listBattlesByHeroUseCase = listBattlesByHeroUseCase;
    this.listBattlesByVillainUseCase = listBattlesByVillainUseCase;
    this.performBattleAttackUseCase = performBattleAttackUseCase;
    this.finishBattleUseCase = finishBattleUseCase;
  }

  async create(req, res, next) {
    try {
      // Add the owner from the authenticated user
      const battleData = {
        ...req.body,
        owner: req.user.id
      };
      const battle = await this.createBattleUseCase.execute(battleData);
      res.status(201).json(battle);
    } catch (err) {
      next(err);
    }
  }

  async get(req, res, next) {
    try {
      const battle = await this.getBattleUseCase.execute(req.params.id);
      res.json(battle);
    } catch (err) {
      next(err);
    }
  }

  async list(req, res, next) {
    try {
      const userId = req.user.id;
      const userRole = req.user.role;
      
      // Si es admin, ve todas las batallas; si es user, solo las propias
      const battles = userRole === 'admin' 
        ? await this.listBattlesUseCase.execute()
        : await this.listBattlesUseCase.execute(userId);
        
      res.json(battles);
    } catch (err) {
      next(err);
    }
  }

  async listByHero(req, res, next) {
    try {
      const battles = await this.listBattlesByHeroUseCase.execute(
        req.params.heroId
      );
      res.json(battles);
    } catch (err) {
      next(err);
    }
  }

  async listByVillain(req, res, next) {
    try {
      const battles = await this.listBattlesByVillainUseCase.execute(
        req.params.villainId
      );
      res.json(battles);
    } catch (err) {
      next(err);
    }
  }

  // Ejecutar un ataque en batalla (flujo manual)
  async attack(req, res, next) {
    try {
      const { id } = req.params;
      const { attackType } = req.body;
      const result = await this.performBattleAttackUseCase.execute({ battleId: id, attackType });
      res.json(result);
    } catch (err) {
      next(err);
    }
  }

  // Finalizar la batalla y devolver resultados
  async finish(req, res, next) {
    try {
      const { id } = req.params;
      const result = await this.finishBattleUseCase.execute(id);
      res.json(result);
    } catch (err) {
      next(err);
    }
  }

  // Obtener estado actual de la batalla (polling)
  async state(req, res, next) {
    try {
      const { id } = req.params;
      const battle = await this.getBattleUseCase.execute(id);
      res.json(battle);
    } catch (err) {
      next(err);
    }
  }
}
