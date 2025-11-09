import MenstruationService from '../services/menstruation.service.js';

export const getMenstruationController = async (req, res) => {
  try {
    const userId = req.user.id;
    const profile = await MenstruationService.getProfile(userId);
    const symptoms = await MenstruationService.getSymptoms(userId);
    const moods = await MenstruationService.getMoods(userId);

    res.json({ profile, symptoms, moods });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch menstruation data' });
  }
};

export const saveProfileController = async (req, res) => {
  try {
    const userId = req.user.id;
    const { cycleLength, lastPeriod } = req.body;

    const profile = await MenstruationService.saveProfile(userId, { cycleLength, lastPeriod });
    res.json(profile);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to save profile' });
  }
};

export const deleteProfileController = async (req, res) => {
  try {
    const userId = req.user.id;
    const { id } = req.params;

    await MenstruationService.deleteProfile(id, userId);
    res.json({ message: 'Profile deleted' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to delete profile' });
  }
};

export const addMenstruationSymptomController = async (req, res) => {
  try {
    const userId = req.user.id;
    const { symptom, severity, notes, date, phase } = req.body;

    const newSymptom = await MenstruationService.addSymptom(userId, { symptom, severity, notes, date, phase });
    res.json(newSymptom);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to add symptom' });
  }
};

export const addMoodController = async (req, res) => {
  try {
    const userId = req.user.id;
    const { mood, energy, notes, date } = req.body;

    const newMood = await MenstruationService.addMood(userId, { mood, energy, notes, date });
    res.json(newMood);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to add mood' });
  }
};
