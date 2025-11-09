import db from '../config/db.js';

export async function upsertProfile({ userId, cycleLength, lastPeriod }) {
  const existing = await db('menstruation_profiles').where({ user_id: userId }).first();
  if (existing) {
    const [row] = await db('menstruation_profiles')
      .where({ user_id: userId })
      .update({ cycle_length: cycleLength, last_period: lastPeriod, updated_at: db.fn.now() })
      .returning(['id', db.raw('user_id as "userId"'), db.raw('cycle_length as "cycleLength"'), db.raw('last_period as "lastPeriod"')]);
    return row;
  }
  const [row] = await db('menstruation_profiles')
    .insert({ user_id: userId, cycle_length: cycleLength, last_period: lastPeriod })
    .returning(['id', db.raw('user_id as "userId"'), db.raw('cycle_length as "cycleLength"'), db.raw('last_period as "lastPeriod"')]);
  return row;
}

export function getProfile(userId) {
  return db('menstruation_profiles')
    .where({ user_id: userId })
    .first()
    .select([db.raw('id'), db.raw('user_id as "userId"'), db.raw('cycle_length as "cycleLength"'), db.raw('last_period as "lastPeriod"')]);
}

export function listSymptoms(userId) {
  return db('menstruation_symptoms')
    .where({ user_id: userId })
    .select(['id', db.raw('symptom'), db.raw('severity'), db.raw('notes'), db.raw('date'), db.raw('phase')])
    .orderBy('date', 'desc');
}

export async function addSymptom({ userId, symptom, severity, notes, date, phase }) {
  const [row] = await db('menstruation_symptoms')
    .insert({ user_id: userId, symptom, severity, notes, date, phase })
    .returning(['id', db.raw('symptom'), db.raw('severity'), db.raw('notes'), db.raw('date'), db.raw('phase')]);
  return row;
}

export function listMoods(userId) {
  return db('menstruation_moods')
    .where({ user_id: userId })
    .select(['id', db.raw('mood'), db.raw('energy'), db.raw('notes'), db.raw('date')])
    .orderBy('date', 'desc');
}

export async function addMood({ userId, mood, energy, notes, date }) {
  const [row] = await db('menstruation_moods')
    .insert({ user_id: userId, mood, energy, notes, date })
    .returning(['id', db.raw('mood'), db.raw('energy'), db.raw('notes'), db.raw('date')]);
  return row;
}


