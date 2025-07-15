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
 */
export class Battle {
  constructor({ id, heroId, villainId, date, result }) {
    if (!heroId || !villainId) {
      throw new CustomError(
        'Both heroId and villainId are required for a Battle',
        400
      );
    }
    this.id = id;
    this.heroId = heroId;
    this.villainId = villainId;
    this.date = date || new Date().toISOString();
    this.result = result || null; // 'hero' | 'villain' | 'draw' | null
  }
}

export default Battle;
