import express from 'express';
import { authenticateJWT } from '../middleware/auth.js';
import {
  getMenstruationController,
  saveProfileController,
  addMenstruationSymptomController,
  addMoodController
} from '../controllers/menstruation.controller.js';

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Menstruation
 *   description: Menstruation tracking endpoints
 */

/**
 * @swagger
 * /api/menstruation:
 *   get:
 *     summary: Get menstruation data for logged in user
 *     tags: [Menstruation]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Menstruation data
 */
router.get('/', authenticateJWT, getMenstruationController);

/**
 * @swagger
 * /api/menstruation/profile:
 *   post:
 *     summary: Create or update menstruation profile (unique per user)
 *     tags: [Menstruation]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [cycleLength, lastPeriod]
 *             properties:
 *               cycleLength:
 *                 type: integer
 *                 example: 28
 *               lastPeriod:
 *                 type: string
 *                 format: date
 *     responses:
 *       200:
 *         description: Saved profile
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/MenstruationProfile'
 */
router.post('/profile', authenticateJWT, saveProfileController);

/**
 * @swagger
 * /api/menstruation/symptom:
 *   post:
 *     summary: Add a menstruation symptom
 *     tags: [Menstruation]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [symptom, date]
 *             properties:
 *               symptom:
 *                 type: string
 *                 example: cramps
 *               date:
 *                 type: string
 *                 format: date
 *     responses:
 *       200:
 *         description: Symptom added successfully
 */
router.post('/symptom', authenticateJWT, addMenstruationSymptomController);

/**
 * @swagger
 * /api/menstruation/mood:
 *   post:
 *     summary: Add a mood entry
 *     tags: [Menstruation]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [mood, date]
 *             properties:
 *               mood:
 *                 type: string
 *                 example: happy
 *               date:
 *                 type: string
 *                 format: date
 *     responses:
 *       200:
 *         description: Mood added successfully
 */
router.post('/mood', authenticateJWT, addMoodController);

/**
 * @swagger
 * /api/menstruation/{id}:
 *   put:
 *     summary: Update menstruation entry
 *     tags: [Menstruation]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               cycleLength:
 *                 type: integer
 *                 example: 30
 *               lastPeriod:
 *                 type: string
 *                 format: date
 *     responses:
 *       200:
 *         description: Entry updated
 */
router.put('/:id', authenticateJWT, saveProfileController);

/**
 * @swagger
 * /api/menstruation/{id}:
 *   delete:
 *     summary: Delete menstruation entry
 *     tags: [Menstruation]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Entry deleted
 */
router.delete('/:id', authenticateJWT, getMenstruationController);

export default router;
