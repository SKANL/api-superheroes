export class VillainController {
  constructor({
    createVillainUseCase,
    getVillainUseCase,
    listVillainsUseCase,
    findVillainsByCityUseCase,
    updateVillainUseCase,
    deleteVillainUseCase,
    verifyVillainAccessUseCase,
  }) {
    this.createVillainUseCase = createVillainUseCase;
    this.getVillainUseCase = getVillainUseCase;
    this.listVillainsUseCase = listVillainsUseCase;
    this.findVillainsByCityUseCase = findVillainsByCityUseCase;
    this.updateVillainUseCase = updateVillainUseCase;
    this.deleteVillainUseCase = deleteVillainUseCase;
    this.verifyVillainAccessUseCase = verifyVillainAccessUseCase;
  }

  async create(req, res, next) {
    try {
      const userId = req.user.id; // Del authMiddleware
      const villain = await this.createVillainUseCase.execute(req.body, userId);
      res.status(201).json(villain);
    } catch (err) {
      next(err);
    }
  }

  async get(req, res, next) {
    try {
      const userId = req.user.id; // Del authMiddleware
      const villain = await this.verifyVillainAccessUseCase.execute(req.params.id, userId);
      res.json(villain);
    } catch (err) {
      next(err);
    }
  }

  async list(req, res, next) {
    try {
      const userId = req.user.id; // Del authMiddleware
      const villains = await this.listVillainsUseCase.execute(userId);
      res.json(villains);
    } catch (err) {
      next(err);
    }
  }

  async findByCity(req, res, next) {
    try {
      const userId = req.user.id; // Del authMiddleware
      const villains = await this.findVillainsByCityUseCase.execute(
        req.params.city,
        userId
      );
      res.json(villains);
    } catch (err) {
      next(err);
    }
  }

  async update(req, res, next) {
    try {
      const villain = await this.updateVillainUseCase.execute(
        req.params.id,
        req.body
      );
      res.json(villain);
    } catch (err) {
      next(err);
    }
  }

  async delete(req, res, next) {
    try {
      await this.deleteVillainUseCase.execute(req.params.id);
      res.status(204).send();
    } catch (err) {
      next(err);
    }
  }
}
