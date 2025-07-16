import express from 'express';
import { CityController } from '../../adapters/controllers/city.controller.js';

const router = express.Router();

export default (cityController) => {
  router.get('/', (req, res) => cityController.list(req, res));
  return router;
};
