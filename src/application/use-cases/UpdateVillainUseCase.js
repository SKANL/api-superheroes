// Caso de uso: Actualizar un villano existente
import { Villain } from '../../domain/entities/Villain.js';
import { AliasValueObject } from '../../domain/value-objects/AliasValueObject.js';
import { CityValueObject } from '../../domain/value-objects/CityValueObject.js';
import { AliasUniquenessService } from '../../domain/services/AliasUniquenessService.js';

export class UpdateVillainUseCase {
  constructor(villainRepository) {
    this.villainRepository = villainRepository;
    this.aliasUniquenessService = new AliasUniquenessService(villainRepository);
  }

  async execute(id, { 
    name, 
    alias, 
    city,
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
    damageReduction,
    owner
  }) {
    if (!id) throw new Error('Villain id is required');
    
    // Obtener el villano existente para mantener los valores no actualizados
    const existingVillain = await this.villainRepository.findById(id);
    if (!existingVillain) throw new Error('Villain not found');
    
    // Validar value objects solo si se proporcionan
    const aliasVO = alias ? new AliasValueObject(alias) : null;
    const cityVO = city ? new CityValueObject(city) : null;
    
    // Validar unicidad de alias si se proporciona (excluyendo el propio id)
    if (aliasVO) {
      await this.aliasUniquenessService.ensureAliasIsUnique(aliasVO.value, id);
    }
    
    // Crear entidad actualizada, manteniendo valores existentes para campos no proporcionados
    const villain = new Villain({
      id,
      name: name !== undefined ? name : existingVillain.name,
      alias: aliasVO ? aliasVO.value : existingVillain.alias,
      city: cityVO ? cityVO.value : existingVillain.city,
      health: health !== undefined ? health : (existingVillain.hpMax || existingVillain.health),
      attack: attack !== undefined ? attack : existingVillain.attack,
      defense: defense !== undefined ? defense : existingVillain.defense,
      specialAbility: specialAbility !== undefined ? specialAbility : existingVillain.specialAbility,
      isAlive: isAlive !== undefined ? isAlive : existingVillain.isAlive,
      roundsWon: roundsWon !== undefined ? roundsWon : existingVillain.roundsWon,
      damage: damage !== undefined ? damage : existingVillain.damage,
      status: status !== undefined ? status : existingVillain.status,
      stamina: stamina !== undefined ? stamina : existingVillain.stamina,
      speed: speed !== undefined ? speed : existingVillain.speed,
      critChance: critChance !== undefined ? critChance : existingVillain.critChance,
      teamAffinity: teamAffinity !== undefined ? teamAffinity : existingVillain.teamAffinity,
      energyCost: energyCost !== undefined ? energyCost : existingVillain.energyCost,
      damageReduction: damageReduction !== undefined ? damageReduction : existingVillain.damageReduction,
      owner: owner !== undefined ? owner : existingVillain.owner // Preservar owner existente
    });
    
    // Preservar hpCurrent si existe y no se proporciona un nuevo valor
    if (hpCurrent !== undefined) {
      villain.hpCurrent = hpCurrent;
    } else if (existingVillain.hpCurrent !== undefined) {
      villain.hpCurrent = existingVillain.hpCurrent;
    }
    
    // Actualizar
    return await this.villainRepository.update(id, villain);
  }
}
