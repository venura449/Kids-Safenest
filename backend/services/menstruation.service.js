import db from '../config/db.js'

class MenstruationService {
  // Profile
  async getProfile(userId) {
    return db('menstruation_profiles').where({ user_id: userId }).first();
  }

  async saveProfile(userId, { cycleLength, lastPeriod }) {
    const existing = await this.getProfile(userId);

    if (existing) {
      await db('menstruation_profiles')
        .where({ user_id: userId })
        .update({
          cycle_length: cycleLength,
          last_period: lastPeriod,
          updated_at: db.fn.now()
        });
      return this.getProfile(userId);
    } else {
      const [id] = await db('menstruation_profiles').insert({
        user_id: userId,
        cycle_length: cycleLength,
        last_period: lastPeriod
      });
      return db('menstruation_profiles').where({ id }).first();
    }
  }

  async deleteProfile(id, userId) {
    return db('menstruation_profiles').where({ id, user_id: userId }).del();
  }

  // Symptoms
  async addSymptom(userId, { symptom, severity, notes, date, phase }) {
    const [id] = await db('menstruation_symptoms').insert({
      user_id: userId,
      symptom,
      severity,
      notes,
      date,
      phase
    });
    return db('menstruation_symptoms').where({ id }).first();
  }

  async getSymptoms(userId) {
    return db('menstruation_symptoms').where({ user_id: userId }).orderBy('date', 'desc');
  }

  // Moods
  async addMood(userId, { mood, energy, notes, date }) {
    const [id] = await db('menstruation_moods').insert({
      user_id: userId,
      mood,
      energy,
      notes,
      date
    });
    return db('menstruation_moods').where({ id }).first();
  }

  async getMoods(userId) {
    return db('menstruation_moods').where({ user_id: userId }).orderBy('date', 'desc');
  }
}

export default new MenstruationService();
