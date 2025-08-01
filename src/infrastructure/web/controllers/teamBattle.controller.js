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
    console.log('[TeamBattleController] start called', { params: req.params, user: req.user });
    try {
      const { id } = req.params;
      console.log('[TeamBattleController] start - id:', id);
      const getUseCase = new GetTeamBattleUseCase(this.teamBattleRepository);
      const battle = await getUseCase.execute(id);
      console.log('[TeamBattleController] start - battle fetched:', battle);
      if (!battle) return res.status(404).json({ message: 'TeamBattle not found' });
      if (battle.status === 'finished') {
        console.log('[TeamBattleController] start - status is finished, restarting battle');
        const restartUseCase = new RestartTeamBattleUseCase(
          this.teamBattleRepository,
          this.heroRepository,
          this.villainRepository
        );
        const restarted = await restartUseCase.execute(id);
        console.log('[TeamBattleController] start - battle restarted:', restarted);
        return res.status(200).json(restarted);
      }
      console.log('[TeamBattleController] start - status in progress, returning battle');
      // Si ya está in_progress, solo devolver el estado
      return res.status(200).json(battle);
    } catch (err) {
      console.error('[TeamBattleController] start - error:', err);
      next(err);
    }
  }

  // POST /api/team-battles/:id/select-side
  async selectSideForBattle(req, res, next) {
    console.log('[TeamBattleController] selectSideForBattle called', { params: req.params, body: req.body, user: req.user });
    try {
      const { id } = req.params;
      console.log('[TeamBattleController] selectSideForBattle - id:', id);
      // Aceptar también valores plurales desde el frontend
      let { side } = req.body;
      console.log('[TeamBattleController] selectSideForBattle - raw side:', side);
      // Normalizar 'heroes'/'villains' a singular
      if (side === 'heroes') side = 'hero';
      if (side === 'villains') side = 'villain';
      console.log('[TeamBattleController] selectSideForBattle - normalized side:', side);
      const userId = req.user?.id || req.user?._id;
      console.log('[TeamBattleController] selectSideForBattle - userId:', userId);
      if (!['hero', 'villain'].includes(side)) {
        console.warn('[TeamBattleController] selectSideForBattle - invalid side received:', side);
        return res.status(400).json({ message: 'Invalid side' });
      }
      const getUseCase = new GetTeamBattleUseCase(this.teamBattleRepository);
      const updateUseCase = new UpdateTeamBattleUseCase(
        this.teamBattleRepository,
        this.heroRepository,
        this.villainRepository
      );
      const battle = await getUseCase.execute(id);
      console.log('[TeamBattleController] selectSideForBattle - battle fetched:', battle);
      if (!battle) return res.status(404).json({ message: 'TeamBattle not found' });
      // Actualizar el campo selectedSides
      const selectedSides = { ...(battle.selectedSides || {}) };
      console.log('[TeamBattleController] selectSideForBattle - previous selectedSides:', selectedSides);
      selectedSides[userId] = side;
      console.log('[TeamBattleController] selectSideForBattle - new selectedSides:', selectedSides);
      const updated = await updateUseCase.execute(id, { selectedSides });
      console.log('[TeamBattleController] selectSideForBattle - updated result from use case:', updated);
      return res.status(200).json({ message: 'Bando seleccionado correctamente', selectedSides: updated.selectedSides });
    } catch (err) {
      console.error('[TeamBattleController] selectSideForBattle - error:', err);
      next(err);
    }
  }
}

export default TeamBattleController;
