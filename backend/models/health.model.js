import db from '../config/db.js';

export function listVitals(userId) {
  return db('health_vitals')
    .where({ user_id: userId })
    .select(['id', db.raw('type'), db.raw('value'), db.raw('unit'), db.raw('status'), db.raw('date')])
    .orderBy('date', 'desc');
}

export async function addVital({ userId, type, value, unit, status, date }) {
  const [row] = await db('health_vitals')
    .insert({ user_id: userId, type, value, unit, status: status || 'normal', date })
    .returning(['id', db.raw('type'), db.raw('value'), db.raw('unit'), db.raw('status'), db.raw('date')]);
  return row;
}

export function listSymptoms(userId) {
  return db('health_symptoms')
    .where({ user_id: userId })
    .select(['id', db.raw('symptom'), db.raw('severity'), db.raw('notes'), db.raw('date')])
    .orderBy('date', 'desc');
}

export async function addSymptom({ userId, symptom, severity, notes, date }) {
  const [row] = await db('health_symptoms')
    .insert({ user_id: userId, symptom, severity, notes, date })
    .returning(['id', db.raw('symptom'), db.raw('severity'), db.raw('notes'), db.raw('date')]);
  return row;
}

export function listMedications(userId) {
  return db('medications')
    .where({ user_id: userId })
    .select(['id', db.raw('name'), db.raw('dosage'), db.raw('frequency'), db.raw('time'), db.raw('taken'), db.raw('date')])
    .orderBy('created_at', 'desc');
}

export async function addMedication({ userId, name, dosage, frequency, time, date }) {
  const [row] = await db('medications')
    .insert({ user_id: userId, name, dosage, frequency, time, date, taken: false })
    .returning(['id', db.raw('name'), db.raw('dosage'), db.raw('frequency'), db.raw('time'), db.raw('taken'), db.raw('date')]);
  return row;
}

export async function toggleMedicationTaken({ userId, id, taken }) {
  const [row] = await db('medications')
    .where({ id, user_id: userId })
    .update({ taken, updated_at: db.fn.now() })
    .returning(['id', db.raw('name'), db.raw('dosage'), db.raw('frequency'), db.raw('time'), db.raw('taken'), db.raw('date')]);
  return row;
}

export function listGoals(userId) {
  return db('health_goals')
    .where({ user_id: userId })
    .select(['id', db.raw('goal'), db.raw('target'), db.raw('unit'), db.raw('progress'), db.raw('completed')])
    .orderBy('created_at', 'desc');
}

export async function addGoal({ userId, goal, target, unit }) {
  const [row] = await db('health_goals')
    .insert({ user_id: userId, goal, target, unit, progress: 0, completed: false })
    .returning(['id', db.raw('goal'), db.raw('target'), db.raw('unit'), db.raw('progress'), db.raw('completed')]);
  return row;
}

export async function updateGoalProgress({ userId, id, progress }) {
  const [row] = await db('health_goals')
    .where({ id, user_id: userId })
    .update({ progress, completed: db.raw('?? >= ??', ['progress', 'target']), updated_at: db.fn.now() })
    .returning(['id', db.raw('goal'), db.raw('target'), db.raw('unit'), db.raw('progress'), db.raw('completed')]);
  return row;
}


