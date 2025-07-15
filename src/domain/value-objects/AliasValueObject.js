// Value Object para Alias único (Hero/Villain)
import { CustomError } from '../../shared/exceptions/CustomError.js';

export class AliasValueObject {
  constructor(alias) {
    if (!alias || typeof alias !== 'string' || alias.trim().length < 2) {
      throw new CustomError(
        'Alias must be a non-empty string with at least 2 characters',
        400
      );
    }
    this.value = alias.trim();
  }
}

export default AliasValueObject;
