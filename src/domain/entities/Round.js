// Entidad Round para TeamBattle
/**
 * @class Round
 * @description Representa una ronda dentro de una batalla por equipos.
 * @property {number} roundNumber
 * @property {Array<{id:string,damage:number}>} heroActions
 * @property {Array<{id:string,damage:number}>} villainActions
 * @property {'heroes'|'villains'|'draw'} result
 */
export class Round {
  constructor({ roundNumber, heroActions, villainActions, result }) {
    this.roundNumber = roundNumber;
    this.heroActions = heroActions;
    this.villainActions = villainActions;
    this.result = result;
  }
}

export default Round;
