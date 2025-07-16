import { TeamBattleService } from '../../../domain/services/TeamBattleService.js';

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
      // Obtener toda la entidad de TeamBattle
      const battle = await this.getTeamBattleUseCase.execute(req.params.id);
      
      let result;
      
      // Manejar según modo de batalla
      if (battle.mode === 'auto') {
        // Modo automático: simular batalla completa con daño progresivo
        let heroes = battle.characters.filter(c => c.type === 'hero' && c.isAlive);
        let villains = battle.characters.filter(c => c.type === 'villain' && c.isAlive);
        
        const rounds = [];
        let roundNumber = 1;
        
        // Simular rondas hasta que un equipo quede sin personajes vivos
        while (heroes.some(h => h.isAlive) && villains.some(v => v.isAlive) && roundNumber <= 10) {
          const heroActions = [];
          const villainActions = [];
          
          // Calcular ataques de héroes vivos
          heroes.filter(h => h.isAlive).forEach(hero => {
            const damage = TeamBattleService.calculateDamage(hero, villains.filter(v => v.isAlive));
            heroActions.push({
              id: hero.id,
              name: hero.alias || hero.name,
              damage: damage
            });
          });
          
          // Calcular ataques de villanos vivos
          villains.filter(v => v.isAlive).forEach(villain => {
            const damage = TeamBattleService.calculateDamage(villain, heroes.filter(h => h.isAlive));
            villainActions.push({
              id: villain.id,
              name: villain.alias || villain.name,
              damage: damage
            });
          });
          
          // Aplicar daño de héroes a villanos
          const heroTotalDamage = heroActions.reduce((sum, action) => sum + action.damage, 0);
          if (heroTotalDamage > 0) {
            const aliveVillains = villains.filter(v => v.isAlive);
            const damagePerVillain = Math.floor(heroTotalDamage / aliveVillains.length);
            aliveVillains.forEach(villain => {
              villain.hpCurrent = Math.max(0, (villain.hpCurrent || villain.hpMax || villain.health) - damagePerVillain);
              villain.isAlive = villain.hpCurrent > 0;
            });
          }
          
          // Aplicar daño de villanos a héroes
          const villainTotalDamage = villainActions.reduce((sum, action) => sum + action.damage, 0);
          if (villainTotalDamage > 0) {
            const aliveHeroes = heroes.filter(h => h.isAlive);
            const damagePerHero = Math.floor(villainTotalDamage / aliveHeroes.length);
            aliveHeroes.forEach(hero => {
              hero.hpCurrent = Math.max(0, (hero.hpCurrent || hero.hpMax || hero.health) - damagePerHero);
              hero.isAlive = hero.hpCurrent > 0;
            });
          }
          
          // Determinar ganador de la ronda
          let roundResult = 'draw';
          if (heroTotalDamage > villainTotalDamage) roundResult = 'heroes';
          else if (villainTotalDamage > heroTotalDamage) roundResult = 'villains';
          
          rounds.push({
            roundNumber: roundNumber,
            heroActions,
            villainActions,
            heroTotal: heroTotalDamage,
            villainTotal: villainTotalDamage,
            result: roundResult
          });
          
          roundNumber++;
        }
        
        // Determinar resultado final basado en personajes vivos
        const heroesAlive = heroes.filter(h => h.isAlive).length;
        const villainsAlive = villains.filter(v => v.isAlive).length;
        
        if (heroesAlive > villainsAlive) {
          result = 'heroes';
        } else if (villainsAlive > heroesAlive) {
          result = 'villains';
        } else {
          result = 'draw';
        }
        
        // Actualizar batalla con los resultados
        battle.rounds = rounds;
        battle.currentRoundIndex = rounds.length;
        battle.result = result;
        battle.status = 'finished';
        
        // Guardar batalla actualizada
        await this.updateTeamBattleUseCase.execute(req.params.id, battle);
      } else {
        // Modo manual: usar resultado ya establecido o calcular basado en personajes vivos
        if (battle.result && typeof battle.result === 'string' && battle.result !== 'ongoing') {
          result = battle.result;
        } else {
          // Calcular resultado basado en personajes vivos
          const heroesAlive = battle.characters.filter(c => c.type === 'hero' && c.isAlive).length;
          const villainsAlive = battle.characters.filter(c => c.type === 'villain' && c.isAlive).length;
          
          if (heroesAlive > villainsAlive) {
            result = 'heroes';
          } else if (villainsAlive > heroesAlive) {
            result = 'villains';
          } else {
            result = 'draw';
          }
        }
      }
      
      // Generar estadísticas finales de personajes
      const statistics = battle.characters.map(c => ({
        id: c.id,
        name: c.alias || c.name,
        type: c.type,
        health: c.hpCurrent != null ? c.hpCurrent : c.health,
        isAlive: c.isAlive
      }));
      
      // Incluir historial de batalla (rondas + ataques individuales si existen)
      const battleHistory = {
        rounds: battle.rounds || [],
        attackHistory: battle.attackHistory || []
      };
      
      // Enviar respuesta
      return res.status(200).json({ result, statistics, battleHistory });
    } catch (err) {
      next(err);
    }
  }
}

export default TeamBattleController;
