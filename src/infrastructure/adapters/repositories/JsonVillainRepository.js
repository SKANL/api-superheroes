// Repositorio de infraestructura para Villain usando archivos JSON
import fs from 'fs-extra';
import path from 'path';
import { VillainRepository } from '../../../application/interfaces/repositories/VillainRepository.js';

const DATA_PATH = path.resolve('data/villains.json');

export class JsonVillainRepository {
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
    return data.find(v => v.id === id) || null;
  }

  async findByAlias(alias) {
    const data = await this._read();
    return data.find(v => v.alias === alias) || null;
  }

  async findAll() {
    return await this._read();
  }

  async findByCity(city) {
    const data = await this._read();
    return data.filter(v => v.city === city);
  }

  async create(villain) {
    const data = await this._read();
    const id = Date.now().toString();
    const newVillain = { ...villain, id };
    data.push(newVillain);
    await this._write(data);
    return newVillain;
  }

  async update(id, villain) {
    const data = await this._read();
    const idx = data.findIndex(v => v.id === id);
    if (idx === -1) return null;
    data[idx] = { ...villain, id };
    await this._write(data);
    return data[idx];
  }

  async delete(id) {
    const data = await this._read();
    const idx = data.findIndex(v => v.id === id);
    if (idx === -1) return false;
    data.splice(idx, 1);
    await this._write(data);
    return true;
  }
}

export default JsonVillainRepository;
