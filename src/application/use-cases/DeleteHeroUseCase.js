// Caso de uso: Eliminar un héroe por ID
export class DeleteHeroUseCase {
  constructor(heroRepository) {
    this.heroRepository = heroRepository;
  }

  async execute(id) {
    if (!id) throw new Error('Hero id is required');
    return await this.heroRepository.delete(id);
  }
}

export default DeleteHeroUseCase;
