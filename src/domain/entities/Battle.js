// Entidad Battle (Batalla) - Clean Architecture
import { CustomError } from '../../shared/exceptions/CustomError.js';

/**
 * @class Battle
 * @description Entidad de dominio para batallas
 * @property {string} id
 * @property {string} heroId
 * @property {string} villainId
 * @property {string} date
 * @property {string} [result]
 * @property {string} owner
 */
export class Battle {
  constructor({ id, heroId, villainId, date, result, mode, location, rounds, attackHistory, currentRoundIndex, status, characters, owner, hero, villain }) {
    if (!heroId || !villainId) {
      throw new CustomError(
        'Both heroId and villainId are required for a Battle',
        400
      );
    }
    if (!owner) {
      throw new CustomError('Owner is required for a Battle', 400);
    }
    this.id = id;
    this.heroId = heroId;
    this.villainId = villainId;
    this.date = date || new Date().toISOString();
    this.location = location || null;
    this.mode = mode || 'manual';
    this.rounds = Array.isArray(rounds) ? rounds : [];
    this.attackHistory = Array.isArray(attackHistory) ? attackHistory : [];
    this.currentRoundIndex = Number.isInteger(currentRoundIndex) ? currentRoundIndex : 0;
    this.status = status || 'in_progress'; // 'in_progress' | 'finished'
    this.characters = Array.isArray(characters) ? characters : [];
    this.result = result || null; // 'hero' | 'villain' | 'draw' | null
    this.owner = owner;
    // Add populated hero and villain objects
    this.hero = hero || null;
    this.villain = villain || null;
  }
}

export default Battle;
