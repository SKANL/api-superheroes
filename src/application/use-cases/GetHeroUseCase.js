// Caso de uso: Obtener un héroe por ID
export class GetHeroUseCase {
  constructor(heroRepository) {
    this.heroRepository = heroRepository;
  }

  async execute(id) {
    if (!id) throw new Error('Hero id is required');
    const hero = await this.heroRepository.findById(id);
    if (!hero) throw new Error('Hero not found');
    return hero;
  }
}

export default GetHeroUseCase;
