// Repositorio en memoria para Villains (tests)
export class InMemoryVillainRepository {
  constructor() { this.data = []; }
  async findById(id) { return this.data.find(v => v.id === id) || null; }
  async findByAlias(alias) { return this.data.find(v => v.alias === alias) || null; }
  async findAll() { return [...this.data]; }
  async findByCity(city) { return this.data.filter(v => v.city === city); }
  async create(villain) {
    const id = Date.now().toString(); const newV = { ...villain, id }; this.data.push(newV); return newV;
  }
  async update(id, villain) { const idx = this.data.findIndex(v => v.id === id); if (idx === -1) return null; this.data[idx] = { ...villain, id }; return this.data[idx]; }
  async delete(id) { const idx = this.data.findIndex(v => v.id === id); if (idx === -1) return false; this.data.splice(idx,1); return true; }
}
