// Caso de uso: Registrar una nueva batalla entre un héroe y un villano
import { Battle } from '../../domain/entities/Battle.js';
import { BattleService } from '../../domain/services/BattleService.js';

export class CreateBattleUseCase {
  constructor(battleRepository, heroRepository, villainRepository) {
    this.battleRepository = battleRepository;
    this.heroRepository = heroRepository;
    this.villainRepository = villainRepository;
  }

  async execute({ heroId, villainId }) {
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
    // Crear entidad
    const battle = new Battle({
      id: undefined, // El repo debe asignar el id
      heroId,
      villainId,
      date: new Date().toISOString(),
      result,
    });
    // Guardar
    return await this.battleRepository.create(battle);
  }
}

export default CreateBattleUseCase;
