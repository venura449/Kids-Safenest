import { getTodaySensorData } from '../services/sensor.service.js';

export async function getTodaySensorController(req, res) {
  try {
    const { watchId } = req.params;
    if (!watchId) {
      return res.status(400).json({ error: 'watchId is required' });
    }

    const data = await getTodaySensorData({ watchId });
    res.json(data);
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: e.message });
  }
}
