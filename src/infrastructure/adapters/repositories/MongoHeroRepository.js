import { HeroModel } from './schemas/HeroSchema.js';
import { Hero } from '../../../domain/entities/Hero.js';
import { HeroRepository } from '../../../application/interfaces/repositories/HeroRepository.js';

export class MongoHeroRepository extends HeroRepository {
  async findById(id) {
    const doc = await HeroModel.findById(id).lean();
    if (!doc) return null;
    
    return new Hero({
      id: doc._id.toString(),
      name: doc.name,
      alias: doc.alias,
      city: doc.city,
      team: doc.team,
      health: doc.hpCurrent,
      hpMax: doc.hpMax,
      hpCurrent: doc.hpCurrent,
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
    const doc = await HeroModel.findOne({ alias }).lean();
    if (!doc) return null;
    
    return new Hero({
      id: doc._id.toString(),
      name: doc.name,
      alias: doc.alias,
      city: doc.city,
      team: doc.team,
      health: doc.hpCurrent,
      hpMax: doc.hpMax,
      hpCurrent: doc.hpCurrent,
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
    const docs = await HeroModel.find().lean();
    return docs.map(doc => new Hero({
      id: doc._id.toString(),
      name: doc.name,
      alias: doc.alias,
      city: doc.city,
      team: doc.team,
      health: doc.hpCurrent,
      hpMax: doc.hpMax,
      hpCurrent: doc.hpCurrent,
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
    const docs = await HeroModel.find({ city }).lean();
    return docs.map(doc => new Hero({
      id: doc._id.toString(),
      name: doc.name,
      alias: doc.alias,
      city: doc.city,
      team: doc.team,
      health: doc.hpCurrent,
      hpMax: doc.hpMax,
      hpCurrent: doc.hpCurrent,
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
    const docs = await HeroModel.find({ owner: ownerId }).lean();
    return docs.map(doc => new Hero({
      id: doc._id.toString(),
      name: doc.name,
      alias: doc.alias,
      city: doc.city,
      team: doc.team,
      health: doc.hpCurrent,
      hpMax: doc.hpMax,
      hpCurrent: doc.hpCurrent,
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
    const docs = await HeroModel.find({ city, owner: ownerId }).lean();
    return docs.map(doc => new Hero({
      id: doc._id.toString(),
      name: doc.name,
      alias: doc.alias,
      city: doc.city,
      team: doc.team,
      health: doc.hpCurrent,
      hpMax: doc.hpMax,
      hpCurrent: doc.hpCurrent,
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

  async create(hero) {
    const heroData = {
      name: hero.name,
      alias: hero.alias,
      city: hero.city,
      team: hero.team,
      hpMax: hero.hpMax,
      hpCurrent: hero.hpCurrent,
      attack: hero.attack,
      defense: hero.defense,
      specialAbility: hero.specialAbility,
      isAlive: hero.isAlive,
      roundsWon: hero.roundsWon,
      damage: hero.damage,
      status: hero.status,
      stamina: hero.stamina,
      speed: hero.speed,
      critChance: hero.critChance,
      teamAffinity: hero.teamAffinity,
      energyCost: hero.energyCost,
      damageReduction: hero.damageReduction,
      owner: hero.owner
    };

    const doc = await HeroModel.create(heroData);
    return new Hero({
      id: doc._id.toString(),
      name: doc.name,
      alias: doc.alias,
      city: doc.city,
      team: doc.team,
      health: doc.hpCurrent,
      hpMax: doc.hpMax,
      hpCurrent: doc.hpCurrent,
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

  async update(id, hero) {
    const heroData = {
      name: hero.name,
      alias: hero.alias,
      city: hero.city,
      team: hero.team,
      hpMax: hero.hpMax,
      hpCurrent: hero.hpCurrent,
      attack: hero.attack,
      defense: hero.defense,
      specialAbility: hero.specialAbility,
      isAlive: hero.isAlive,
      roundsWon: hero.roundsWon,
      damage: hero.damage,
      status: hero.status,
      stamina: hero.stamina,
      speed: hero.speed,
      critChance: hero.critChance,
      teamAffinity: hero.teamAffinity,
      energyCost: hero.energyCost,
      damageReduction: hero.damageReduction,
      owner: hero.owner
    };

    const doc = await HeroModel.findByIdAndUpdate(id, heroData, { new: true }).lean();
    if (!doc) return null;

    return new Hero({
      id: doc._id.toString(),
      name: doc.name,
      alias: doc.alias,
      city: doc.city,
      team: doc.team,
      health: doc.hpCurrent,
      hpMax: doc.hpMax,
      hpCurrent: doc.hpCurrent,
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
    const result = await HeroModel.findByIdAndDelete(id);
    return !!result;
  }

  /**
   * Busca héroes accesibles para un usuario
   * - Admin: puede ver todos los héroes
   * - Usuario: puede ver sus propios héroes + héroes de administradores
   */
  async findAccessibleByUser(userId, userRepository) {
    // Obtener datos del usuario actual
    const currentUser = await userRepository.findById(userId);
    if (!currentUser) {
      throw new Error('Usuario no encontrado');
    }

    let query = {};

    if (currentUser.isAdmin()) {
      // Los administradores pueden ver todos los héroes
      query = {};
    } else {
      // Los usuarios normales pueden ver:
      // 1. Sus propios héroes
      // 2. Héroes de administradores
      
      // Buscar todos los administradores
      const adminUsers = await userRepository.findByRole('admin');
      const adminIds = adminUsers.map(admin => admin.id);

      // Agregar el usuario actual a la lista de owners accesibles
      const accessibleOwners = [...adminIds, userId];
      
      query = { owner: { $in: accessibleOwners } };
    }

    const docs = await HeroModel.find(query).lean();
    return docs.map(doc => new Hero({
      id: doc._id.toString(),
      name: doc.name,
      alias: doc.alias,
      city: doc.city,
      team: doc.team,
      health: doc.hpCurrent,
      hpMax: doc.hpMax,
      hpCurrent: doc.hpCurrent,
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
}

export default MongoHeroRepository;
