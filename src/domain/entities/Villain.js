// Entidad Villain (Villano) - Clean Architecture
import { CustomError } from '../../shared/exceptions/CustomError.js';

/**
 * @class Villain
 * @description Entidad de dominio para villanos
 * @property {string} id
 * @property {string} name
 * @property {string} alias
 * @property {string} city
 * @property {number} health - Puntos de salud del villano
 * @property {number} attack - Valor de ataque del villano
 * @property {number} defense - Valor de defensa del villano
 * @property {string} specialAbility - Habilidad especial del villano
 * @property {boolean} isAlive - Indica si el villano está vivo
 * @property {number} roundsWon - Número de rondas ganadas
 * @property {number} damage - Daño infligido en la ronda actual
 * @property {string} status - Estado del villano (normal, congelado, envenenado, etc.)
 * @property {number} stamina - Energía o resistencia del villano
 * @property {number} speed - Velocidad del villano
 * @property {number} critChance - Probabilidad de golpe crítico (0-100)
 * @property {number} teamAffinity - Afinidad con el equipo (-100 a 100)
 * @property {number} energyCost - Costo de energía para habilidades especiales
 * @property {number} damageReduction - Reducción de daño (0-100)
 */
export class Villain {
  constructor({ 
    id, 
    name, 
    alias, 
    city,
    health = 100,
    attack = 50,
    defense = 30,
    specialAbility = 'Dark Attack',
    isAlive = true,
    roundsWon = 0,
    damage = 0,
    status = 'normal',
    stamina = 100,
    speed = 50,
    critChance = 10,
    teamAffinity = 0,
    energyCost = 20,
    damageReduction = 0
  }) {
    if (!name || !alias) {
      throw new CustomError('Name and alias are required for Villain', 400);
    }
    
    // Campos básicos
    this.id = id;
    this.name = name;
    this.alias = alias;
    this.city = city;
    
    // Salud máxima y actual para el villano
    this.hpMax = this._validateNumber(health, 'hpMax', 1, 1000);
    this.hpCurrent = this.hpMax;
    this.attack = this._validateNumber(attack, 'attack', 1, 200);
    this.defense = this._validateNumber(defense, 'defense', 0, 200);
    this.specialAbility = specialAbility;
    this.isAlive = Boolean(isAlive);
    this.roundsWon = this._validateNumber(roundsWon, 'roundsWon', 0, 1000);
    this.damage = this._validateNumber(damage, 'damage', 0, 1000);
    this.status = this._validateStatus(status);
    
    // Campos adicionales para estrategia
    this.stamina = this._validateNumber(stamina, 'stamina', 0, 200);
    this.speed = this._validateNumber(speed, 'speed', 1, 200);
    this.critChance = this._validateNumber(critChance, 'critChance', 0, 100);
    this.teamAffinity = this._validateNumber(teamAffinity, 'teamAffinity', -100, 100);
    this.energyCost = this._validateNumber(energyCost, 'energyCost', 0, 100);
    this.damageReduction = this._validateNumber(damageReduction, 'damageReduction', 0, 100);
  }
  
  /**
   * Valida que un número esté dentro de un rango válido
   * @param {number} value - Valor a validar
   * @param {string} fieldName - Nombre del campo
   * @param {number} min - Valor mínimo
   * @param {number} max - Valor máximo
   * @returns {number} Valor validado
   */
  _validateNumber(value, fieldName, min, max) {
    const num = Number(value);
    if (isNaN(num) || num < min || num > max) {
      throw new CustomError(`${fieldName} must be a number between ${min} and ${max}`, 400);
    }
    return num;
  }
  
  /**
   * Valida que el estado sea válido
   * @param {string} status - Estado a validar
   * @returns {string} Estado validado
   */
  _validateStatus(status) {
    const validStatuses = ['normal', 'congelado', 'envenenado', 'fortalecido', 'debilitado', 'paralizado'];
    if (!validStatuses.includes(status)) {
      throw new CustomError(`Status must be one of: ${validStatuses.join(', ')}`, 400);
    }

    return status;
  }

  /**
   * Aplica daño al villano, reduciendo la vida actual y marcando estado.
   * @param {number} amount - Cantidad de daño a aplicar.
   */
  takeDamage(amount) {
    const dmg = Number(amount) || 0;
    this.hpCurrent = Math.max(0, this.hpCurrent - dmg);
    if (this.hpCurrent === 0) {
      this.isAlive = false;
      this.status = 'derrotado';
    }
    return this.hpCurrent;
  }
}

export default Villain;
