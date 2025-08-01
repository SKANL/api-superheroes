// Entidad TeamBattle (Batalla por equipos) - Clean Architecture
import { CustomError } from '../../shared/exceptions/CustomError.js';

/**
 * @class TeamBattle
 * @description Entidad de dominio para batallas por equipos
 * @property {string} id
 * @property {string[]} heroIds
 * @property {string[]} villainIds
 * @property {string} date
 * @property {string|null} result
 * @property {Array} rounds
 * @property {number} currentRoundIndex
 * @property {string} owner - ID del usuario propietario
 */
export class TeamBattle {
  constructor({ id, heroIds, villainIds, date, result, rounds, currentRoundIndex, status, characters, mode, owner, selectedSides }) {
    if (!Array.isArray(heroIds) || heroIds.length < 1) {
      throw new CustomError('heroIds must be a non-empty array', 400);
    }
    if (!Array.isArray(villainIds) || villainIds.length < 1) {
      throw new CustomError('villainIds must be a non-empty array', 400);
    }
    if (!owner) {
      throw new CustomError('Owner is required for a TeamBattle', 400);
    }
    this.id = id;
    this.heroIds = heroIds;
    this.villainIds = villainIds;
    this.date = date || new Date().toISOString();
    this.result = result || null; // 'heroes' | 'villains' | 'draw' | null
    this.rounds = Array.isArray(rounds) ? rounds : [];
    this.currentRoundIndex = typeof currentRoundIndex === 'number' ? currentRoundIndex : 0;
    this.status = status || 'in_progress'; // 'in_progress' | 'finished'
    this.characters = Array.isArray(characters) ? characters : []; // Estado de salud e isAlive
    this.mode = mode || 'manual'; // 'manual' | 'auto'
    this.owner = owner;
    this.selectedSides = selectedSides || {}; // { [userId]: 'hero' | 'villain' }
  }
}
