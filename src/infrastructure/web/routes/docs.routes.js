import express from 'express';
import { SwaggerConfig } from '../../config/swagger.config.js';
const router = express.Router();
const swagger = new SwaggerConfig();
export default app => {
  swagger.setup(app);
  return router;
};
