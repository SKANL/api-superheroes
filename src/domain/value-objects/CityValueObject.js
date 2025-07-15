// Value Object para City (ciudad válida)
import { CustomError } from '../../shared/exceptions/CustomError.js';

const VALID_CITIES = [
  'Ciudad Gótica',
  'Metrópolis',
  'Chapultepec',
  'Nueva York',
  'Tokio',
  'París',
  'Ciudad de México',
  'Los Ángeles',
  'Londres',
  'Central City',
  'Star City',
  // ...agrega más según el dominio
];

export class CityValueObject {
  constructor(city) {
    if (!city || typeof city !== 'string') {
      throw new CustomError('City must be a non-empty string', 400);
    }
    // Se omite la validación estricta de ciudad para permitir cualquier cadena no vacía
    this.value = city.trim();
  }

  static isValid(city) {
    return VALID_CITIES.includes(city);
  }

  static getValidCities() {
    return [...VALID_CITIES];
  }
}

export default CityValueObject;
