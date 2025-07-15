import express from 'express';
import { HealthController } from '../../adapters/controllers/health.controller.js';
const router = express.Router();
router.get('/', HealthController.check);
export default router;
