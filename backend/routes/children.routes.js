import express from 'express';
import { authenticateJWT } from '../middleware/auth.js';
import {
  addChildController,
  getChildrenController,
  getChildController,
  getChildByWatchIdController,
  updateChildController,
  deleteChildController
} from '../controllers/children.controller.js';

const router = express.Router();

// Add a new child with watch ID
router.post('/', authenticateJWT, addChildController);

// Get all children for the authenticated user
router.get('/', authenticateJWT, getChildrenController);

// Get a specific child by ID
router.get('/:id', authenticateJWT, getChildController);

// Get child by watch ID (public endpoint for device communication)
router.get('/watch/:watchId', getChildByWatchIdController);

// Update child details
router.put('/:id', authenticateJWT, updateChildController);

// Delete (soft delete) a child
router.delete('/:id', authenticateJWT, deleteChildController);

export default router;


