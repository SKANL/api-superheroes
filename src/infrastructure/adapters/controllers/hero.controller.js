// Controlador para Hero
export class HeroController {
  constructor({
    createHeroUseCase,
    getHeroUseCase,
    listHeroesUseCase,
    findHeroesByCityUseCase,
    updateHeroUseCase,
    deleteHeroUseCase,
  }) {
    this.createHeroUseCase = createHeroUseCase;
    this.getHeroUseCase = getHeroUseCase;
    this.listHeroesUseCase = listHeroesUseCase;
    this.findHeroesByCityUseCase = findHeroesByCityUseCase;
    this.updateHeroUseCase = updateHeroUseCase;
    this.deleteHeroUseCase = deleteHeroUseCase;
  }

  async create(req, res, next) {
    try {
      const userId = req.user.id; // Del authMiddleware
      const hero = await this.createHeroUseCase.execute(req.body, userId);
      res.status(201).json(hero);
    } catch (err) {
      next(err);
    }
  }

  async get(req, res, next) {
    try {
      const hero = await this.getHeroUseCase.execute(req.params.id);
      res.json(hero);
    } catch (err) {
      next(err);
    }
  }

  async list(req, res, next) {
    try {
      const userId = req.user.id; // Del authMiddleware
      const heroes = await this.listHeroesUseCase.execute(userId);
      res.json(heroes);
    } catch (err) {
      next(err);
    }
  }

  async findByCity(req, res, next) {
    try {
      const userId = req.user.id; // Del authMiddleware
      const heroes = await this.findHeroesByCityUseCase.execute(
        req.params.city,
        userId
      );
      res.json(heroes);
    } catch (err) {
      next(err);
    }
  }

  async update(req, res, next) {
    try {
      const hero = await this.updateHeroUseCase.execute(
        req.params.id,
        req.body
      );
      res.json(hero);
    } catch (err) {
      next(err);
    }
  }

  async delete(req, res, next) {
    try {
      await this.deleteHeroUseCase.execute(req.params.id);
      res.status(204).send();
    } catch (err) {
      next(err);
    }
  }
}

export default HeroController;
