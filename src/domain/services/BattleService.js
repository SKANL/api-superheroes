// Servicio de dominio para lógica de batallas
// Valida que un héroe solo pueda enfrentar a un villano y registra el resultado
import { CustomError } from '../../shared/exceptions/CustomError.js';

export class BattleService {
  static validateBattle(hero, villain) {
    if (!hero || !villain) {
      throw new CustomError(
        'Both hero and villain are required for a battle',
        400
      );
    }
    
    // Verificar que tengan las propiedades necesarias en lugar del constructor
    if (!hero.name || !hero.alias || typeof hero.city !== 'string') {
      throw new CustomError(
        'Hero must have valid name, alias, and city properties',
        400
      );
    }
    
    if (!villain.name || !villain.alias || typeof villain.city !== 'string') {
      throw new CustomError(
        'Villain must have valid name, alias, and city properties',
        400
      );
    }
    
    // Verificar que ambos personajes estén vivos
    if (hero.isAlive === false || (hero.hpCurrent != null ? hero.hpCurrent : hero.health) <= 0) {
      throw new CustomError(
        'Hero must be alive to participate in battle',
        400
      );
    }
    
    if (villain.isAlive === false || (villain.hpCurrent != null ? villain.hpCurrent : villain.health) <= 0) {
      throw new CustomError(
        'Villain must be alive to participate in battle',
        400
      );
    }
    
    if (hero.city !== villain.city) {
      throw new CustomError(
        'Hero and Villain must be in the same city to battle',
        400
      );
    }
    return true;
  }

  static determineResult(hero, villain) {
    // Lógica basada en las nuevas estadísticas
    const heroScore = this.calculateBattleScore(hero);
    const villainScore = this.calculateBattleScore(villain);
    
    // Agregar algo de aleatoriedad
    const heroFinalScore = heroScore * (0.8 + Math.random() * 0.4);
    const villainFinalScore = villainScore * (0.8 + Math.random() * 0.4);
    
    if (heroFinalScore > villainFinalScore) {
      return 'hero';
    } else if (villainFinalScore > heroFinalScore) {
      return 'villain';
    } else {
      return 'draw';
    }
  }

  /**
   * Calcula un puntaje de batalla basado en las estadísticas del personaje
   * @param {Object} character - Personaje (hero o villain)
   * @returns {number} Puntaje de batalla
   */
  static calculateBattleScore(character) {
    const attack = character.attack || 50;
    const defense = character.defense || 30;
    // Usar hpCurrent si está disponible, sino fallback a health
    const health = (typeof character.hpCurrent === 'number')
      ? character.hpCurrent
      : (character.health || 100);
    const speed = character.speed || 50;
    const critChance = character.critChance || 10;
    const teamAffinity = character.teamAffinity || 0;
    
    // Calcular puntaje base
    let score = attack * 1.2 + defense * 0.8 + health * 0.5 + speed * 0.3;
    
    // Aplicar modificadores
    score += critChance * 0.5; // El crit chance añade puntos
    score += teamAffinity * 0.2; // La afinidad puede ser positiva o negativa
    
    // Aplicar modificadores de estado
    switch (character.status) {
      case 'fortalecido':
        score *= 1.2;
        break;
      case 'debilitado':
        score *= 0.8;
        break;
      case 'envenenado':
        score *= 0.9;
        break;
      case 'paralizado':
        score *= 0.6;
        break;
      case 'congelado':
        score *= 0.7;
        break;
      default:
        // normal, no change
        break;
    }
    
    return Math.max(1, Math.floor(score));
  }
}

export default BattleService;
