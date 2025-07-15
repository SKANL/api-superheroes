// Repositorio en memoria para TeamBattle (tests)
export class InMemoryTeamBattleRepository {
  constructor() { this.data = []; }
  async findById(id) { return this.data.find(tb => tb.id === id) || null; }
  async findAll() { return [...this.data]; }
  async findByHeroId(heroId) { return this.data.filter(tb => tb.heroIds.includes(heroId)); }
  async findByVillainId(villainId) { return this.data.filter(tb => tb.villainIds.includes(villainId)); }
  async create(teamBattle) { const id = Date.now().toString(); const newTB = { ...teamBattle, id }; this.data.push(newTB); return newTB; }
  async update(id, teamBattle) { const idx = this.data.findIndex(tb => tb.id === id); if (idx === -1) return null; this.data[idx] = { ...teamBattle, id }; return this.data[idx]; }
  async delete(id) { const idx = this.data.findIndex(tb => tb.id === id); if (idx === -1) return false; this.data.splice(idx, 1); return true; }
}

export default InMemoryTeamBattleRepository;
