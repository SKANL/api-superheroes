// Caso de uso: Registrar una nueva batalla entre un héroe y un villano
import { Battle } from '../../domain/entities/Battle.js';
import { BattleService } from '../../domain/services/BattleService.js';

export class CreateBattleUseCase {
  constructor(battleRepository, heroRepository, villainRepository) {
    this.battleRepository = battleRepository;
    this.heroRepository = heroRepository;
    this.villainRepository = villainRepository;
  }

  async execute({ heroId, villainId, mode = 'manual', location = null, owner }) {
    if (!heroId || !villainId)
      throw new Error('heroId and villainId are required');
    // Obtener entidades
    const hero = await this.heroRepository.findById(heroId);
    const villain = await this.villainRepository.findById(villainId);
    if (!hero) throw new Error('Hero not found');
    if (!villain) throw new Error('Villain not found');
    // Validar reglas de batalla
    BattleService.validateBattle(hero, villain);
    // Determinar resultado (placeholder)
    const result = BattleService.determineResult(hero, villain);
    // Crear entidad con inicialización de flujo
    const battle = new Battle({
      id: undefined, // el repositorio asignará el id
      heroId,
      villainId,
      date: new Date().toISOString(),
      result: null,
      mode,
      location,
      rounds: [],
      attackHistory: [],
      currentRoundIndex: 0,
      status: 'in_progress',
      characters: [
        { 
          id: heroId, 
          name: hero.name, 
          alias: hero.alias, 
          hpCurrent: hero.hpCurrent || hero.health || hero.hpMax || 100, 
          hpMax: hero.hpMax || hero.health || 100, 
          isAlive: true, 
          type: 'hero',
          attack: hero.attack || 50,
          defense: hero.defense || 30,
          critChance: hero.critChance || 10
        },
        { 
          id: villainId, 
          name: villain.name, 
          alias: villain.alias, 
          hpCurrent: villain.hpCurrent || villain.health || villain.hpMax || 100, 
          hpMax: villain.hpMax || villain.health || 100, 
          isAlive: true, 
          type: 'villain',
          attack: villain.attack || 50,
          defense: villain.defense || 30,
          critChance: villain.critChance || 10
        }
      ],
      owner: owner
    });
    // Guardar
    return await this.battleRepository.create(battle);
  }
}

export default CreateBattleUseCase;
