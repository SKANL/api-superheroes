import { TeamBattleModel } from './schemas/TeamBattleSchema.js';
import { TeamBattle } from '../../../domain/entities/TeamBattle.js';
import { TeamBattleRepository } from '../../../application/interfaces/repositories/TeamBattleRepository.js';

export class MongoTeamBattleRepository extends TeamBattleRepository {
  async findById(id) {
    const doc = await TeamBattleModel.findById(id).lean();
    if (!doc) return null;
    return new TeamBattle({
      id: doc._id.toString(),
      heroIds: doc.heroIds.map(h => h.toString()),
      villainIds: doc.villainIds.map(v => v.toString()),
      date: doc.date,
      result: doc.result,
      rounds: doc.rounds,
      currentRoundIndex: doc.currentRoundIndex,
      status: doc.status,
      characters: doc.characters,
      mode: doc.mode,
      owner: doc.owner.toString()
    });
  }

  async findAll() {
    const docs = await TeamBattleModel.find().lean();
    return docs.map(doc => new TeamBattle({
      id: doc._id.toString(),
      heroIds: doc.heroIds.map(h => h.toString()),
      villainIds: doc.villainIds.map(v => v.toString()),
      date: doc.date,
      result: doc.result,
      rounds: doc.rounds,
      currentRoundIndex: doc.currentRoundIndex,
      status: doc.status,
      characters: doc.characters,
      mode: doc.mode,
      owner: doc.owner.toString()
    }));
  }

  async findByHeroId(heroId) {
    const docs = await TeamBattleModel.find({ heroIds: heroId }).lean();
    return docs.map(doc => new TeamBattle({
      id: doc._id.toString(),
      heroIds: doc.heroIds.map(h => h.toString()),
      villainIds: doc.villainIds.map(v => v.toString()),
      date: doc.date,
      result: doc.result,
      rounds: doc.rounds,
      currentRoundIndex: doc.currentRoundIndex,
      status: doc.status,
      characters: doc.characters,
      mode: doc.mode,
      owner: doc.owner.toString()
    }));
  }

  async findByVillainId(villainId) {
    const docs = await TeamBattleModel.find({ villainIds: villainId }).lean();
    return docs.map(doc => new TeamBattle({
      id: doc._id.toString(),
      heroIds: doc.heroIds.map(h => h.toString()),
      villainIds: doc.villainIds.map(v => v.toString()),
      date: doc.date,
      result: doc.result,
      rounds: doc.rounds,
      currentRoundIndex: doc.currentRoundIndex,
      status: doc.status,
      characters: doc.characters,
      mode: doc.mode,
      owner: doc.owner.toString()
    }));
  }

  async create(teamBattle) {
    const toCreate = {
      heroIds: teamBattle.heroIds,
      villainIds: teamBattle.villainIds,
      date: teamBattle.date,
      result: teamBattle.result,
      rounds: teamBattle.rounds,
      currentRoundIndex: teamBattle.currentRoundIndex,
      status: teamBattle.status,
      characters: teamBattle.characters,
      mode: teamBattle.mode,
      owner: teamBattle.owner
    };
    const doc = await TeamBattleModel.create(toCreate);
    return new TeamBattle({
      id: doc._id.toString(),
      heroIds: doc.heroIds.map(h => h.toString()),
      villainIds: doc.villainIds.map(v => v.toString()),
      date: doc.date,
      result: doc.result,
      rounds: doc.rounds,
      currentRoundIndex: doc.currentRoundIndex,
      status: doc.status,
      characters: doc.characters,
      mode: doc.mode,
      owner: doc.owner.toString()
    });
  }

  async update(id, teamBattle) {
    const updated = await TeamBattleModel.findByIdAndUpdate(
      id,
      { $set: { ...teamBattle } },
      { new: true }
    ).lean();
    if (!updated) return null;
    return new TeamBattle({
      id: updated._id.toString(),
      heroIds: updated.heroIds.map(h => h.toString()),
      villainIds: updated.villainIds.map(v => v.toString()),
      date: updated.date,
      result: updated.result,
      rounds: updated.rounds,
      currentRoundIndex: updated.currentRoundIndex,
      status: updated.status,
      characters: updated.characters,
      mode: updated.mode,
      owner: updated.owner.toString()
    });
  }

  async delete(id) {
    const res = await TeamBattleModel.deleteOne({ _id: id });
    return res.deletedCount > 0;
  }
}
