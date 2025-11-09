import express from 'express';
import { authenticateJWT } from '../middleware/auth.js';
import {deviceCreateController,listDeviceController, deviceUpdateController, deleteDeviceController} from '../controllers/profile.controller.js';

const router = express.Router();


router.post('/',authenticateJWT,deviceCreateController);

router.get('/', authenticateJWT,listDeviceController);

router.put('/:id', authenticateJWT,deviceUpdateController);

router.delete('/:id', authenticateJWT,deleteDeviceController);

export default router;