// Controlador para TeamBattle: nuevos endpoints start y selectSideForBattle
import { RestartTeamBattleUseCase } from '../../../application/use-cases/RestartTeamBattleUseCase.js';
import { GetTeamBattleUseCase } from '../../../application/use-cases/GetTeamBattleUseCase.js';
import { UpdateTeamBattleUseCase } from '../../../application/use-cases/UpdateTeamBattleUseCase.js';

export class TeamBattleController {
  constructor({ teamBattleRepository, heroRepository, villainRepository }) {
    this.teamBattleRepository = teamBattleRepository;
    this.heroRepository = heroRepository;
    this.villainRepository = villainRepository;
  }

  // POST /api/team-battles/:id/start
  async start(req, res, next) {
    try {
      const { id } = req.params;
      const getUseCase = new GetTeamBattleUseCase(this.teamBattleRepository);
      const battle = await getUseCase.execute(id);
      if (!battle) return res.status(404).json({ message: 'TeamBattle not found' });
      if (battle.status === 'finished') {
        const restartUseCase = new RestartTeamBattleUseCase(
          this.teamBattleRepository,
          this.heroRepository,
          this.villainRepository
        );
        const restarted = await restartUseCase.execute(id);
        return res.status(200).json(restarted);
      }
      // Si ya está in_progress, solo devolver el estado
      return res.status(200).json(battle);
    } catch (err) {
      next(err);
    }
  }

  // POST /api/team-battles/:id/select-side
  async selectSideForBattle(req, res, next) {
    try {
      const { id } = req.params;
      // Aceptar también valores plurales desde el frontend
      let { side } = req.body;
      // Normalizar 'heroes'/'villains' a singular
      if (side === 'heroes') side = 'hero';
      if (side === 'villains') side = 'villain';
      const userId = req.user?.id || req.user?._id;
      if (!['hero', 'villain'].includes(side)) {
        return res.status(400).json({ message: 'Invalid side' });
      }
      const getUseCase = new GetTeamBattleUseCase(this.teamBattleRepository);
      const updateUseCase = new UpdateTeamBattleUseCase(
        this.teamBattleRepository,
        this.heroRepository,
        this.villainRepository
      );
      const battle = await getUseCase.execute(id);
      if (!battle) return res.status(404).json({ message: 'TeamBattle not found' });
      // Actualizar el campo selectedSides
      const selectedSides = { ...(battle.selectedSides || {}) };
      selectedSides[userId] = side;
      const updated = await updateUseCase.execute(id, { selectedSides });
      return res.status(200).json({ message: 'Bando seleccionado correctamente', selectedSides: updated.selectedSides });
    } catch (err) {
      next(err);
    }
  }
}

export default TeamBattleController;
