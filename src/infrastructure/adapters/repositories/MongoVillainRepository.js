import { VillainModel } from './schemas/VillainSchema.js';
import { Villain } from '../../../domain/entities/Villain.js';
import { VillainRepository } from '../../../application/interfaces/repositories/VillainRepository.js';

export class MongoVillainRepository extends VillainRepository {
  async findById(id) {
    const doc = await VillainModel.findById(id).lean();
    if (!doc) return null;
    
    return new Villain({
      id: doc._id.toString(),
      name: doc.name,
      alias: doc.alias,
      city: doc.city,
      health: doc.health,
      attack: doc.attack,
      defense: doc.defense,
      specialAbility: doc.specialAbility,
      isAlive: doc.isAlive,
      roundsWon: doc.roundsWon,
      damage: doc.damage,
      status: doc.status,
      stamina: doc.stamina,
      speed: doc.speed,
      critChance: doc.critChance,
      teamAffinity: doc.teamAffinity,
      energyCost: doc.energyCost,
      damageReduction: doc.damageReduction,
      owner: doc.owner.toString()
    });
  }

  async findByAlias(alias) {
    const doc = await VillainModel.findOne({ alias }).lean();
    if (!doc) return null;
    
    return new Villain({
      id: doc._id.toString(),
      name: doc.name,
      alias: doc.alias,
      city: doc.city,
      health: doc.health,
      attack: doc.attack,
      defense: doc.defense,
      specialAbility: doc.specialAbility,
      isAlive: doc.isAlive,
      roundsWon: doc.roundsWon,
      damage: doc.damage,
      status: doc.status,
      stamina: doc.stamina,
      speed: doc.speed,
      critChance: doc.critChance,
      teamAffinity: doc.teamAffinity,
      energyCost: doc.energyCost,
      damageReduction: doc.damageReduction,
      owner: doc.owner.toString()
    });
  }

  async findAll() {
    const docs = await VillainModel.find().lean();
    return docs.map(doc => new Villain({
      id: doc._id.toString(),
      name: doc.name,
      alias: doc.alias,
      city: doc.city,
      health: doc.health,
      attack: doc.attack,
      defense: doc.defense,
      specialAbility: doc.specialAbility,
      isAlive: doc.isAlive,
      roundsWon: doc.roundsWon,
      damage: doc.damage,
      status: doc.status,
      stamina: doc.stamina,
      speed: doc.speed,
      critChance: doc.critChance,
      teamAffinity: doc.teamAffinity,
      energyCost: doc.energyCost,
      damageReduction: doc.damageReduction,
      owner: doc.owner.toString()
    }));
  }

  async findByCity(city) {
    const docs = await VillainModel.find({ city }).lean();
    return docs.map(doc => new Villain({
      id: doc._id.toString(),
      name: doc.name,
      alias: doc.alias,
      city: doc.city,
      health: doc.health,
      attack: doc.attack,
      defense: doc.defense,
      specialAbility: doc.specialAbility,
      isAlive: doc.isAlive,
      roundsWon: doc.roundsWon,
      damage: doc.damage,
      status: doc.status,
      stamina: doc.stamina,
      speed: doc.speed,
      critChance: doc.critChance,
      teamAffinity: doc.teamAffinity,
      energyCost: doc.energyCost,
      damageReduction: doc.damageReduction,
      owner: doc.owner.toString()
    }));
  }

  async findByOwner(ownerId) {
    const docs = await VillainModel.find({ owner: ownerId }).lean();
    return docs.map(doc => new Villain({
      id: doc._id.toString(),
      name: doc.name,
      alias: doc.alias,
      city: doc.city,
      health: doc.health,
      attack: doc.attack,
      defense: doc.defense,
      specialAbility: doc.specialAbility,
      isAlive: doc.isAlive,
      roundsWon: doc.roundsWon,
      damage: doc.damage,
      status: doc.status,
      stamina: doc.stamina,
      speed: doc.speed,
      critChance: doc.critChance,
      teamAffinity: doc.teamAffinity,
      energyCost: doc.energyCost,
      damageReduction: doc.damageReduction,
      owner: doc.owner.toString()
    }));
  }

  async findByCityAndOwner(city, ownerId) {
    const docs = await VillainModel.find({ city, owner: ownerId }).lean();
    return docs.map(doc => new Villain({
      id: doc._id.toString(),
      name: doc.name,
      alias: doc.alias,
      city: doc.city,
      health: doc.health,
      attack: doc.attack,
      defense: doc.defense,
      specialAbility: doc.specialAbility,
      isAlive: doc.isAlive,
      roundsWon: doc.roundsWon,
      damage: doc.damage,
      status: doc.status,
      stamina: doc.stamina,
      speed: doc.speed,
      critChance: doc.critChance,
      teamAffinity: doc.teamAffinity,
      energyCost: doc.energyCost,
      damageReduction: doc.damageReduction,
      owner: doc.owner.toString()
    }));
  }

  async create(villain) {
    const villainData = {
      name: villain.name,
      alias: villain.alias,
      city: villain.city,
      health: villain.health,
      attack: villain.attack,
      defense: villain.defense,
      specialAbility: villain.specialAbility,
      isAlive: villain.isAlive,
      roundsWon: villain.roundsWon,
      damage: villain.damage,
      status: villain.status,
      stamina: villain.stamina,
      speed: villain.speed,
      critChance: villain.critChance,
      teamAffinity: villain.teamAffinity,
      energyCost: villain.energyCost,
      damageReduction: villain.damageReduction,
      owner: villain.owner
    };

    const doc = await VillainModel.create(villainData);
    return new Villain({
      id: doc._id.toString(),
      name: doc.name,
      alias: doc.alias,
      city: doc.city,
      health: doc.health,
      attack: doc.attack,
      defense: doc.defense,
      specialAbility: doc.specialAbility,
      isAlive: doc.isAlive,
      roundsWon: doc.roundsWon,
      damage: doc.damage,
      status: doc.status,
      stamina: doc.stamina,
      speed: doc.speed,
      critChance: doc.critChance,
      teamAffinity: doc.teamAffinity,
      energyCost: doc.energyCost,
      damageReduction: doc.damageReduction,
      owner: doc.owner.toString()
    });
  }

  async update(id, villain) {
    const villainData = {
      name: villain.name,
      alias: villain.alias,
      city: villain.city,
      health: villain.health,
      attack: villain.attack,
      defense: villain.defense,
      specialAbility: villain.specialAbility,
      isAlive: villain.isAlive,
      roundsWon: villain.roundsWon,
      damage: villain.damage,
      status: villain.status,
      stamina: villain.stamina,
      speed: villain.speed,
      critChance: villain.critChance,
      teamAffinity: villain.teamAffinity,
      energyCost: villain.energyCost,
      damageReduction: villain.damageReduction,
      owner: villain.owner
    };

    const doc = await VillainModel.findByIdAndUpdate(id, villainData, { new: true }).lean();
    if (!doc) return null;

    return new Villain({
      id: doc._id.toString(),
      name: doc.name,
      alias: doc.alias,
      city: doc.city,
      health: doc.health,
      attack: doc.attack,
      defense: doc.defense,
      specialAbility: doc.specialAbility,
      isAlive: doc.isAlive,
      roundsWon: doc.roundsWon,
      damage: doc.damage,
      status: doc.status,
      stamina: doc.stamina,
      speed: doc.speed,
      critChance: doc.critChance,
      teamAffinity: doc.teamAffinity,
      energyCost: doc.energyCost,
      damageReduction: doc.damageReduction,
      owner: doc.owner.toString()
    });
  }

  async delete(id) {
    const result = await VillainModel.findByIdAndDelete(id);
    return !!result;
  }
}

export default MongoVillainRepository;
