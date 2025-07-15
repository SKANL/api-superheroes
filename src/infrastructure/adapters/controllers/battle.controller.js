// Controlador para Battle
export class BattleController {
  constructor({
    createBattleUseCase,
    getBattleUseCase,
    listBattlesUseCase,
    listBattlesByHeroUseCase,
    listBattlesByVillainUseCase,
  }) {
    this.createBattleUseCase = createBattleUseCase;
    this.getBattleUseCase = getBattleUseCase;
    this.listBattlesUseCase = listBattlesUseCase;
    this.listBattlesByHeroUseCase = listBattlesByHeroUseCase;
    this.listBattlesByVillainUseCase = listBattlesByVillainUseCase;
  }

  async create(req, res, next) {
    try {
      const battle = await this.createBattleUseCase.execute(req.body);
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
      const battles = await this.listBattlesUseCase.execute();
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
}
