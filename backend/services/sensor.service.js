import { insertSensorReading, listTodayReadings, listAllReadings } from '../models/sensor.model.js';

export function createSensorReading(payload) {
  if (!payload.watchID && !payload.watch_id) {
    throw new Error('watchId is required');
  }
  return insertSensorReading(payload);
}

export function getTodaySensorData({ watchId }) {
  if (!watchId) {
    throw new Error('watchId is required');
  }
  return listTodayReadings({ watchId });
}

export function getAllSensorData({ watchId }) {
  if (!watchId) {
    throw new Error('watchId is required');
  }
  return listAllReadings({ watchId });
}
