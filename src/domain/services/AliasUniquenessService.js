// Servicio de dominio para validar unicidad de alias
// Recibe un repositorio y verifica si el alias ya existe (para Hero o Villain)
import { CustomError } from '../../shared/exceptions/CustomError.js';

export class AliasUniquenessService {
  constructor(repository) {
    this.repository = repository;
  }

  async ensureAliasIsUnique(alias, excludeId = null) {
    const existing = await this.repository.findByAlias(alias);
    if (existing && (!excludeId || existing.id !== excludeId)) {
      throw new CustomError(`Alias '${alias}' already exists`, 409);
    }
    return true;
  }
}

export default AliasUniquenessService;
