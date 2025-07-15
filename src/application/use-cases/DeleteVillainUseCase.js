// Caso de uso: Eliminar un villano por ID
export class DeleteVillainUseCase {
  constructor(villainRepository) {
    this.villainRepository = villainRepository;
  }

  async execute(id) {
    if (!id) throw new Error('Villain id is required');
    return await this.villainRepository.delete(id);
  }
}

export default DeleteVillainUseCase;
