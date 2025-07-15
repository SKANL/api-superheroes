/**
 * @function CreateHeroUseCase
 * @description Caso de uso para crear un héroe
 * @param {Object} heroData
 * @returns {Promise<Hero>}
 */

// Caso de uso: Crear un nuevo héroe
import { Hero } from '../../domain/entities/Hero.js';
import { AliasValueObject } from '../../domain/value-objects/AliasValueObject.js';
import { CityValueObject } from '../../domain/value-objects/CityValueObject.js';
import { AliasUniquenessService } from '../../domain/services/AliasUniquenessService.js';

export class CreateHeroUseCase {
  constructor(heroRepository) {
    this.heroRepository = heroRepository;
    this.aliasUniquenessService = new AliasUniquenessService(heroRepository);
  }

  async execute({ 
    name, 
    alias, 
    city, 
    team,
    health,
    attack,
    defense,
    specialAbility,
    isAlive,
    roundsWon,
    damage,
    status,
    stamina,
    speed,
    critChance,
    teamAffinity,
    energyCost,
    damageReduction
  }) {
    // Debug: log the received values
    console.log('CreateHeroUseCase received:', {
      name, alias, city, team, health, attack, defense, specialAbility,
      isAlive, roundsWon, damage, status, stamina, speed, critChance,
      teamAffinity, energyCost, damageReduction
    });
    
    // Validar value objects
    const aliasVO = new AliasValueObject(alias);
    const cityVO = new CityValueObject(city);
    // Validar unicidad de alias
    await this.aliasUniquenessService.ensureAliasIsUnique(aliasVO.value);
    // Crear entidad con todos los campos
    const hero = new Hero({
      id: undefined, // El repo debe asignar el id
      name,
      alias: aliasVO.value,
      city: cityVO.value,
      team: team || null,
      health,
      attack,
      defense,
      specialAbility,
      isAlive,
      roundsWon,
      damage,
      status,
      stamina,
      speed,
      critChance,
      teamAffinity,
      energyCost,
      damageReduction
    });
    // Guardar
    return await this.heroRepository.create(hero);
  }
}
