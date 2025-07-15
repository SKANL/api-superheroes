// Caso de uso: Obtener un villano por ID
export class GetVillainUseCase {
  constructor(villainRepository) {
    this.villainRepository = villainRepository;
  }

  async execute(id) {
    if (!id) throw new Error('Villain id is required');
    const villain = await this.villainRepository.findById(id);
    if (!villain) throw new Error('Villain not found');
    return villain;
  }
}

export default GetVillainUseCase;
