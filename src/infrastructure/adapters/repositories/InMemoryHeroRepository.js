// Repositorio en memoria para tests o entornos sin persistencia en archivo JSON
import { HeroRepository } from '../../../application/interfaces/repositories/HeroRepository.js';
export class InMemoryHeroRepository {
  constructor() {
    this.data = [];
  }
  async findById(id) {
    return this.data.find(h => h.id === id) || null;
  }
  async findByAlias(alias) {
    return this.data.find(h => h.alias === alias) || null;
  }
  async findAll() {
    return [...this.data];
  }
  async findByCity(city) {
    return this.data.filter(h => h.city === city);
  }
  async create(hero) {
    const id = Date.now().toString();
    const newHero = { ...hero, id };
    this.data.push(newHero);
    return newHero;
  }
  async update(id, hero) {
    const idx = this.data.findIndex(h => h.id === id);
    if (idx === -1) return null;
    this.data[idx] = { ...hero, id };
    return this.data[idx];
  }
  async delete(id) {
    const idx = this.data.findIndex(h => h.id === id);
    if (idx === -1) return false;
    this.data.splice(idx, 1);
    return true;
  }
}
