// Caso de uso: Actualizar un héroe existente
import { Hero } from '../../domain/entities/Hero.js';
import { AliasValueObject } from '../../domain/value-objects/AliasValueObject.js';
import { CityValueObject } from '../../domain/value-objects/CityValueObject.js';
import { AliasUniquenessService } from '../../domain/services/AliasUniquenessService.js';

export class UpdateHeroUseCase {
  constructor(heroRepository) {
    this.heroRepository = heroRepository;
    this.aliasUniquenessService = new AliasUniquenessService(heroRepository);
  }

  async execute(id, { 
    name, 
    alias, 
    city, 
    team,
    health,
    hpMax,
    hpCurrent,
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
    if (!id) throw new Error('Hero id is required');
    
    // Obtener el héroe existente para mantener los valores no actualizados
    const existingHero = await this.heroRepository.findById(id);
    if (!existingHero) throw new Error('Hero not found');
    
    // Validar value objects solo si se proporcionan
    const aliasVO = alias ? new AliasValueObject(alias) : null;
    const cityVO = city ? new CityValueObject(city) : null;
    
    // Validar unicidad de alias si se proporciona (excluyendo el propio id)
    if (aliasVO) {
      await this.aliasUniquenessService.ensureAliasIsUnique(aliasVO.value, id);
    }
    
    // Crear entidad actualizada, manteniendo valores existentes para campos no proporcionados
    const hero = new Hero({
      id,
      name: name !== undefined ? name : existingHero.name,
      alias: aliasVO ? aliasVO.value : existingHero.alias,
      city: cityVO ? cityVO.value : existingHero.city,
      team: team !== undefined ? team : existingHero.team,
      health: health !== undefined ? health : (existingHero.hpMax || existingHero.health),
      attack: attack !== undefined ? attack : existingHero.attack,
      defense: defense !== undefined ? defense : existingHero.defense,
      specialAbility: specialAbility !== undefined ? specialAbility : existingHero.specialAbility,
      isAlive: isAlive !== undefined ? isAlive : existingHero.isAlive,
      roundsWon: roundsWon !== undefined ? roundsWon : existingHero.roundsWon,
      damage: damage !== undefined ? damage : existingHero.damage,
      status: status !== undefined ? status : existingHero.status,
      stamina: stamina !== undefined ? stamina : existingHero.stamina,
      speed: speed !== undefined ? speed : existingHero.speed,
      critChance: critChance !== undefined ? critChance : existingHero.critChance,
      teamAffinity: teamAffinity !== undefined ? teamAffinity : existingHero.teamAffinity,
      energyCost: energyCost !== undefined ? energyCost : existingHero.energyCost,
      damageReduction: damageReduction !== undefined ? damageReduction : existingHero.damageReduction
    });
    
    // Preservar hpCurrent si existe y no se proporciona un nuevo valor
    if (hpCurrent !== undefined) {
      hero.hpCurrent = hpCurrent;
    } else if (existingHero.hpCurrent !== undefined) {
      hero.hpCurrent = existingHero.hpCurrent;
    }
    
    // Actualizar
    return await this.heroRepository.update(id, hero);
  }
}
