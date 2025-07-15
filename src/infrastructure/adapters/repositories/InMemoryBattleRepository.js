// Repositorio en memoria para Battle (tests)
export class InMemoryBattleRepository {
  constructor() { this.data = []; }
  async findById(id) { return this.data.find(b => b.id === id) || null; }
  async findAll() { return [...this.data]; }
  async findByHeroId(heroId) { return this.data.filter(b => b.heroId === heroId); }
  async findByVillainId(villainId) { return this.data.filter(b => b.villainId === villainId); }
  async create(battle) {
    const id = Date.now().toString();
    const newB = { ...battle, id }; this.data.push(newB); return newB;
  }
}
