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
        { id: heroId, name: hero.name, alias: hero.alias, hpCurrent: hero.health, hpMax: hero.health, isAlive: true, type: 'hero' },
        { id: villainId, name: villain.name, alias: villain.alias, hpCurrent: villain.health, hpMax: villain.health, isAlive: true, type: 'villain' }
      ],
      owner: owner
    });
    // Guardar
    return await this.battleRepository.create(battle);
  }
}

export default CreateBattleUseCase;
