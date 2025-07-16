import { CityValueObject } from '../../../domain/value-objects/CityValueObject.js';

export class CityController {
  // GET /api/cities
  list(req, res) {
    const cities = CityValueObject.getValidCities();
    res.json(cities);
  }
}
