import { BattleModel } from './schemas/BattleSchema.js';
import { Battle } from '../../../domain/entities/Battle.js';
import { BattleRepository } from '../../../application/interfaces/repositories/BattleRepository.js';

export class MongoBattleRepository extends BattleRepository {
  async findById(id) {
    const doc = await BattleModel.findById(id)
      .populate('heroId')
      .populate('villainId')
      .lean();
    if (!doc) return null;
    return new Battle({
      id: doc._id.toString(),
      heroId: doc.heroId._id.toString(),
      villainId: doc.villainId._id.toString(),
      date: doc.date,
      result: doc.result,
      mode: doc.mode,
      location: doc.location,
      rounds: doc.rounds,
      attackHistory: doc.attackHistory,
      currentRoundIndex: doc.currentRoundIndex,
      status: doc.status,
      characters: doc.characters,
      owner: doc.owner.toString(),
      // Add populated hero and villain data
      hero: doc.heroId,
      villain: doc.villainId
    });
  }

  async findAll() {
    const docs = await BattleModel.find()
      .populate('heroId')
      .populate('villainId')
      .lean();
    return docs.map(doc => new Battle({
      id: doc._id.toString(),
      heroId: doc.heroId._id.toString(),
      villainId: doc.villainId._id.toString(),
      date: doc.date,
      result: doc.result,
      mode: doc.mode,
      location: doc.location,
      rounds: doc.rounds,
      attackHistory: doc.attackHistory,
      currentRoundIndex: doc.currentRoundIndex,
      status: doc.status,
      characters: doc.characters,
      owner: doc.owner.toString(),
      // Add populated hero and villain data
      hero: doc.heroId,
      villain: doc.villainId
    }));
  }

  async findByHeroId(heroId) {
    const docs = await BattleModel.find({ heroId })
      .populate('heroId')
      .populate('villainId')
      .lean();
    return docs.map(doc => new Battle({
      id: doc._id.toString(),
      heroId: doc.heroId._id.toString(),
      villainId: doc.villainId._id.toString(),
      date: doc.date,
      result: doc.result,
      mode: doc.mode,
      location: doc.location,
      rounds: doc.rounds,
      attackHistory: doc.attackHistory,
      currentRoundIndex: doc.currentRoundIndex,
      status: doc.status,
      characters: doc.characters,
      owner: doc.owner.toString(),
      hero: doc.heroId,
      villain: doc.villainId
    }));
  }

  async findByOwner(ownerId) {
    const docs = await BattleModel.find({ owner: ownerId })
      .populate('heroId')
      .populate('villainId')
      .lean();
    return docs.map(doc => new Battle({
      id: doc._id.toString(),
      heroId: doc.heroId._id.toString(),
      villainId: doc.villainId._id.toString(),
      date: doc.date,
      result: doc.result,
      mode: doc.mode,
      location: doc.location,
      rounds: doc.rounds,
      attackHistory: doc.attackHistory,
      currentRoundIndex: doc.currentRoundIndex,
      status: doc.status,
      characters: doc.characters,
      owner: doc.owner.toString(),
      hero: doc.heroId,
      villain: doc.villainId
    }));
  }

  async findByVillainId(villainId) {
    const docs = await BattleModel.find({ villainId })
      .populate('heroId')
      .populate('villainId')
      .lean();
    return docs.map(doc => new Battle({
      id: doc._id.toString(),
      heroId: doc.heroId._id.toString(),
      villainId: doc.villainId._id.toString(),
      date: doc.date,
      result: doc.result,
      mode: doc.mode,
      location: doc.location,
      rounds: doc.rounds,
      attackHistory: doc.attackHistory,
      currentRoundIndex: doc.currentRoundIndex,
      status: doc.status,
      characters: doc.characters,
      owner: doc.owner.toString(),
      // Add populated hero and villain data
      hero: doc.heroId,
      villain: doc.villainId
    }));
  }

  async create(battle) {
    const toCreate = {
      heroId: battle.heroId,
      villainId: battle.villainId,
      date: battle.date,
      result: battle.result,
      mode: battle.mode,
      location: battle.location,
      rounds: battle.rounds,
      attackHistory: battle.attackHistory,
      currentRoundIndex: battle.currentRoundIndex,
      status: battle.status,
      characters: battle.characters,
      owner: battle.owner
    };
    const doc = await BattleModel.create(toCreate);
    return new Battle({
      id: doc._id.toString(),
      heroId: doc.heroId.toString(),
      villainId: doc.villainId.toString(),
      date: doc.date,
      result: doc.result,
      mode: doc.mode,
      location: doc.location,
      rounds: doc.rounds,
      attackHistory: doc.attackHistory,
      currentRoundIndex: doc.currentRoundIndex,
      status: doc.status,
      characters: doc.characters,
      owner: doc.owner.toString()
    });
  }

  async update(id, battle) {
    const updated = await BattleModel.findByIdAndUpdate(
      id,
      { $set: { ...battle } },
      { new: true }
    ).lean();
    if (!updated) return null;
    return new Battle({
      id: updated._id.toString(),
      heroId: updated.heroId.toString(),
      villainId: updated.villainId.toString(),
      date: updated.date,
      result: updated.result,
      mode: updated.mode,
      location: updated.location,
      rounds: updated.rounds,
      attackHistory: updated.attackHistory,
      currentRoundIndex: updated.currentRoundIndex,
      status: updated.status,
      characters: updated.characters,
      owner: updated.owner.toString()
    });
  }

  async delete(id) {
    const res = await BattleModel.deleteOne({ _id: id });
    return res.deletedCount > 0;
  }
}
