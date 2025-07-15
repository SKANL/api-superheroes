// Repositorio de infraestructura para TeamBattle usando archivos JSON
import fs from 'fs-extra';
import path from 'path';
import { TeamBattleRepository } from '../../../application/interfaces/repositories/TeamBattleRepository.js';

const DATA_PATH = path.resolve('data/teamBattles.json');

export class JsonTeamBattleRepository {
  async _read() {
    try {
      return await fs.readJson(DATA_PATH);
    } catch {
      return [];
    }
  }

  async _write(data) {
    await fs.outputJson(DATA_PATH, data, { spaces: 2 });
  }

  async findById(id) {
    const data = await this._read();
    return data.find(tb => tb.id === id) || null;
  }

  async findAll() {
    return await this._read();
  }

  async findByHeroId(heroId) {
    const data = await this._read();
    return data.filter(tb => tb.heroIds.includes(heroId));
  }

  async findByVillainId(villainId) {
    const data = await this._read();
    return data.filter(tb => tb.villainIds.includes(villainId));
  }

  async create(teamBattle) {
    const data = await this._read();
    const id = Date.now().toString();
    const newTB = { ...teamBattle, id };
    data.push(newTB);
    await this._write(data);
    return newTB;
  }

  async update(id, teamBattle) {
    const data = await this._read();
    const idx = data.findIndex(tb => tb.id === id);
    if (idx === -1) return null;
    data[idx] = { ...teamBattle, id };
    await this._write(data);
    return data[idx];
  }

  async delete(id) {
    const data = await this._read();
    const idx = data.findIndex(tb => tb.id === id);
    if (idx === -1) return false;
    data.splice(idx, 1);
    await this._write(data);
    return true;
  }
}

export default JsonTeamBattleRepository;
