// Controlador para TeamBattle
export class TeamBattleController {
  constructor({
    createTeamBattleUseCase,
    getTeamBattleUseCase,
    listTeamBattlesUseCase,
    listTeamBattlesByHeroUseCase,
    listTeamBattlesByVillainUseCase,
    getTeamBattleStateUseCase,
    updateTeamBattleUseCase,
    deleteTeamBattleUseCase,
    restartTeamBattleUseCase,
    performRoundUseCase,
    performAttackUseCase,
  }) {
    this.createTeamBattleUseCase = createTeamBattleUseCase;
    this.getTeamBattleUseCase = getTeamBattleUseCase;
    this.listTeamBattlesUseCase = listTeamBattlesUseCase;
    this.listTeamBattlesByHeroUseCase = listTeamBattlesByHeroUseCase;
    this.listTeamBattlesByVillainUseCase = listTeamBattlesByVillainUseCase;
    this.getTeamBattleStateUseCase = getTeamBattleStateUseCase;
    this.updateTeamBattleUseCase = updateTeamBattleUseCase;
    this.deleteTeamBattleUseCase = deleteTeamBattleUseCase;
    this.restartTeamBattleUseCase = restartTeamBattleUseCase;
    // Assign performRoundUseCase for processing rounds
    this.performRoundUseCase = performRoundUseCase;
    this.performAttackUseCase = performAttackUseCase;
  }

  async create(req, res, next) {
    try {
      const tb = await this.createTeamBattleUseCase.execute(req.body);
      res.status(201).json(tb);
    } catch (err) {
      next(err);
    }
  }

  async get(req, res, next) {
    try {
      const tb = await this.getTeamBattleUseCase.execute(req.params.id);
      res.json(tb);
    } catch (err) {
      next(err);
    }
  }

  async list(req, res, next) {
    try {
      const list = await this.listTeamBattlesUseCase.execute();
      res.json(list);
    } catch (err) {
      next(err);
    }
  }

  async listByHero(req, res, next) {
    try {
      const list = await this.listTeamBattlesByHeroUseCase.execute(
        req.params.heroId
      );
      res.json(list);
    } catch (err) {
      next(err);
    }
  }

  async listByVillain(req, res, next) {
    try {
      const list = await this.listTeamBattlesByVillainUseCase.execute(
        req.params.villainId
      );
      res.json(list);
    } catch (err) {
      next(err);
    }
  }

  async update(req, res, next) {
    try {
      const updated = await this.updateTeamBattleUseCase.execute(req.params.id, req.body);
      res.json(updated);
    } catch (err) {
      next(err);
    }
  }

  async delete(req, res, next) {
    try {
      await this.deleteTeamBattleUseCase.execute(req.params.id);
      res.status(204).end();
    } catch (err) {
      next(err);
    }
  }

  async state(req, res, next) {
    try {
      const state = await this.getTeamBattleStateUseCase.execute(req.params.id);
      res.json(state);
    } catch (err) {
      next(err);
    }
  }

  async restart(req, res, next) {
    try {
      const restarted = await this.restartTeamBattleUseCase.execute(req.params.id, req.body);
      res.json(restarted);
    } catch (err) {
      next(err);
    }
  }
  async performRound(req, res, next) {
    try {
      const { heroActions, villainActions } = req.body;
      const updated = await this.performRoundUseCase.execute(
        req.params.id,
        heroActions,
        villainActions
      );
      res.json(updated);
    } catch (err) {
      next(err);
    }
  }

  async performAttack(req, res, next) {
    try {
      const { attackerType, attackerId, targetId, attackType = 'normal' } = req.body;
      
      try {
        const result = await this.performAttackUseCase.execute({
          battleId: req.params.id,
          attackerType,
          attackerId,
          targetId,
          attackType
        });
        res.json(result);
      } catch (error) {
        console.error('Error en performAttack:', error);
        res.status(400).json({ error: error.message });
      }
    } catch (err) {
      console.error('Error general en performAttack:', err);
      next(err);
    }
  }

  async selectSide(req, res, next) {
    try {
      const { side } = req.body; // 'heroes' o 'villains'
      if (!['heroes', 'villains'].includes(side)) {
        return res.status(400).json({ error: 'Invalid side selection' });
      }
      res.json({ message: `Side selected: ${side}` });
    } catch (err) {
      next(err);
    }
  }

  async performRoundAction(req, res, next) {
    try {
      const { heroActions, villainActions } = req.body;
      const updatedBattle = await this.performRoundUseCase.execute(
        req.params.id,
        heroActions,
        villainActions
      );
      res.json(updatedBattle);
    } catch (err) {
      next(err);
    }
  }

  async finishBattle(req, res, next) {
    try {
      const result = await this.getTeamBattleStateUseCase.execute(req.params.id);
      res.json({
        result: result.state,
        statistics: result.statistics,
      });
    } catch (err) {
      next(err);
    }
  }
}

export default TeamBattleController;
