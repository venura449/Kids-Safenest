import express from 'express';
import { getTodaySensorController } from '../controllers/sensor.controller.js';

const router = express.Router();

router.get('/:watchId/today', getTodaySensorController);

export default router;
