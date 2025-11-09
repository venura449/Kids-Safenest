import {
  getHealthOverview,
  createVital,
  createHealthSymptom,
  createMedication,
  setMedicationTaken,
  createGoal,
  setGoalProgress
} from '../services/health.service.js';

export async function getHealthController(req, res) {
  try {
    const data = await getHealthOverview({ userId: req.user.id });
    res.json(data);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
}

export async function addVitalController(req, res) {
  try {
    const { type, value, unit, status, date } = req.body;
    const vital = await createVital({ userId: req.user.id, type, value, unit, status, date });
    res.status(201).json(vital);
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
}

export async function addHealthSymptomController(req, res) {
  try {
    const { symptom, severity, notes, date } = req.body;
    const row = await createHealthSymptom({ userId: req.user.id, symptom, severity, notes, date });
    res.status(201).json(row);
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
}

export async function addMedicationController(req, res) {
  try {
    const { name, dosage, frequency, time, date } = req.body;
    const row = await createMedication({ userId: req.user.id, name, dosage, frequency, time, date });
    res.status(201).json(row);
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
}

export async function toggleMedicationController(req, res) {
  try {
    const { id } = req.params;
    const { taken } = req.body;
    const row = await setMedicationTaken({ userId: req.user.id, id: Number(id), taken });
    if (!row) return res.status(404).json({ error: 'Medication not found' });
    res.json(row);
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
}

export async function addGoalController(req, res) {
  try {
    const { goal, target, unit } = req.body;
    const row = await createGoal({ userId: req.user.id, goal, target, unit });
    res.status(201).json(row);
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
}

export async function updateGoalProgressController(req, res) {
  try {
    const { id } = req.params;
    const { progress } = req.body;
    const row = await setGoalProgress({ userId: req.user.id, id: Number(id), progress });
    if (!row) return res.status(404).json({ error: 'Goal not found' });
    res.json(row);
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
}


