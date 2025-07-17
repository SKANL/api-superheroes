// Caso de uso: Registrar una nueva batalla por equipos
import { TeamBattle } from '../../domain/entities/TeamBattle.js';
import { TeamBattleService } from '../../domain/services/TeamBattleService.js';

export class CreateTeamBattleUseCase {
  constructor(teamBattleRepository, heroRepository, villainRepository) {
    this.teamBattleRepository = teamBattleRepository;
    this.heroRepository = heroRepository;
    this.villainRepository = villainRepository;
  }

  async execute({ heroIds, villainIds, mode, owner }) {
    if (!Array.isArray(heroIds) || !Array.isArray(villainIds)) {
      throw new Error('heroIds and villainIds must be arrays');
    }
    
    // Obtener entidades completas con todas las estadísticas
    const heroes = await Promise.all(heroIds.map(id => this.heroRepository.findById(id)));
    const villains = await Promise.all(villainIds.map(id => this.villainRepository.findById(id)));
    
    if (heroes.some(h => !h)) throw new Error('One or more heroes not found');
    if (villains.some(v => !v)) throw new Error('One or more villains not found');
    
    // Validar que todos los personajes estén vivos y con salud
    const aliveHeroes = heroes.filter(h => {
      const currentHp = (typeof h.hpCurrent === 'number') ? h.hpCurrent : h.health;
      return h.isAlive && currentHp > 0;
    });
    const aliveVillains = villains.filter(v => {
      const currentHp = (typeof v.hpCurrent === 'number') ? v.hpCurrent : v.health;
      return v.isAlive && currentHp > 0;
    });
    
    if (aliveHeroes.length === 0) throw new Error('At least one alive hero is required');
    if (aliveVillains.length === 0) throw new Error('At least one alive villain is required');
    
    // Validar reglas de batalla por equipos
    TeamBattleService.validateTeamBattle(aliveHeroes, aliveVillains);
    
    // Usar los IDs originales para mantener compatibilidad y flexibilidad
    const heroChars = aliveHeroes.map(c => ({
      id: String(c.id),
      hpCurrent: (typeof c.hpCurrent === 'number') ? c.hpCurrent : c.health,
      hpMax: c.hpMax || c.health,
      isAlive: c.isAlive,
      type: 'hero',
      ...c
    }));
    const villainChars = aliveVillains.map(c => ({
      id: String(c.id),
      hpCurrent: (typeof c.hpCurrent === 'number') ? c.hpCurrent : c.health,
      hpMax: c.hpMax || c.health,
      isAlive: c.isAlive,
      type: 'villain',
      ...c
    }));
    const characters = [...heroChars, ...villainChars];
    const teamBattle = new TeamBattle({
      id: undefined,
      heroIds: heroIds.map(String),
      villainIds: villainIds.map(String),
      date: new Date().toISOString(),
      rounds: [],
      currentRoundIndex: 0,
      status: 'in_progress',
      characters,
      mode: mode || 'manual', // Guardar el modo seleccionado
      owner: owner
    });
    // Guardar
    return await this.teamBattleRepository.create(teamBattle);
  }
}

export default CreateTeamBattleUseCase;
