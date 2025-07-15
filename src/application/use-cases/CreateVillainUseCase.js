// Caso de uso: Crear un nuevo villano
import { Villain } from '../../domain/entities/Villain.js';
import { AliasValueObject } from '../../domain/value-objects/AliasValueObject.js';
import { CityValueObject } from '../../domain/value-objects/CityValueObject.js';
import { AliasUniquenessService } from '../../domain/services/AliasUniquenessService.js';

export class CreateVillainUseCase {
  constructor(villainRepository) {
    this.villainRepository = villainRepository;
    this.aliasUniquenessService = new AliasUniquenessService(villainRepository);
  }

  async execute({ 
    name, 
    alias, 
    city,
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
    // Validar value objects
    const aliasVO = new AliasValueObject(alias);
    const cityVO = new CityValueObject(city);
    // Validar unicidad de alias
    await this.aliasUniquenessService.ensureAliasIsUnique(aliasVO.value);
    // Crear entidad con todos los campos
    const villain = new Villain({
      id: undefined, // El repo debe asignar el id
      name,
      alias: aliasVO.value,
      city: cityVO.value,
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
    return await this.villainRepository.create(villain);
  }
}

export default CreateVillainUseCase;
