// Repositorio de infraestructura para Hero usando archivos JSON
import fs from 'fs-extra';
import path from 'path';
import { HeroRepository } from '../../../application/interfaces/repositories/HeroRepository.js';

const DATA_PATH = path.resolve('data/superheroes.json');

export class JsonHeroRepository {
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
    return data.find(h => h.id === id) || null;
  }

  async findByAlias(alias) {
    const data = await this._read();
    return data.find(h => h.alias === alias) || null;
  }

  async findAll() {
    return await this._read();
  }

  async findByCity(city) {
    const data = await this._read();
    return data.filter(h => h.city === city);
  }

  async findByOwner(ownerId) {
    const data = await this._read();
    return data.filter(h => h.owner === ownerId);
  }

  async findByCityAndOwner(city, ownerId) {
    const data = await this._read();
    return data.filter(h => h.city === city && h.owner === ownerId);
  }

  async create(hero) {
    const data = await this._read();
    const id = Date.now().toString();
    // Mapear entity a objeto plano: usar hpCurrent como health y conservar hpMax
    const newHero = {
      ...hero,
      id,
      health: hero.hpCurrent,
      hpMax: hero.hpMax
    };
    data.push(newHero);
    await this._write(data);
    return newHero;
  }

  async update(id, hero) {
    const data = await this._read();
    const idx = data.findIndex(h => h.id === id);
    if (idx === -1) return null;
    // Mapear entity a objeto plano: usar hpCurrent como health y conservar hpMax
    const updatedHero = {
      ...hero,
      id,
      health: hero.hpCurrent,
      hpMax: hero.hpMax
    };
    data[idx] = updatedHero;
    await this._write(data);
    return data[idx];
  }

  async delete(id) {
    const data = await this._read();
    const idx = data.findIndex(h => h.id === id);
    if (idx === -1) return false;
    data.splice(idx, 1);
    await this._write(data);
    return true;
  }
}

export default JsonHeroRepository;
