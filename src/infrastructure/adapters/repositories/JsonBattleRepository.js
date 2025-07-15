// Repositorio de infraestructura para Battle usando archivos JSON
import fs from 'fs-extra';
import path from 'path';
import { BattleRepository } from '../../../application/interfaces/repositories/BattleRepository.js';

const DATA_PATH = path.resolve('data/battles.json');

export class JsonBattleRepository {
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
    return data.find(b => b.id === id) || null;
  }

  async findAll() {
    return await this._read();
  }

  async findByHeroId(heroId) {
    const data = await this._read();
    return data.filter(b => b.heroId === heroId);
  }

  async findByVillainId(villainId) {
    const data = await this._read();
    return data.filter(b => b.villainId === villainId);
  }

  async create(battle) {
    const data = await this._read();
    const id = Date.now().toString();
    const newBattle = { ...battle, id };
    data.push(newBattle);
    await this._write(data);
    return newBattle;
  }

  async update(id, battle) {
    const data = await this._read();
    const idx = data.findIndex(b => b.id === id);
    if (idx === -1) return null;
    data[idx] = { ...battle, id };
    await this._write(data);
    return data[idx];
  }

  async delete(id) {
    const data = await this._read();
    const idx = data.findIndex(b => b.id === id);
    if (idx === -1) return false;
    data.splice(idx, 1);
    await this._write(data);
    return true;
  }
}

export default JsonBattleRepository;
