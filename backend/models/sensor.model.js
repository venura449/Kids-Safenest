import db from '../config/db.js';

export function insertSensorReading(payload) {
  const row = {
    watch_id: payload.watchID || payload.watch_id,
    temp: payload.temp,
    humidity: payload.humidity,
    pressure: payload.pressure,
    latitude: payload.latitude,
    longitude: payload.longitude,
    battery: payload.battery,
    spo2: payload.spo2,
    bpm: payload.bpm,
    received_at: new Date()
  };

  return db('sensor_readings').insert(row);
}

export function listTodayReadings({ watchId }) {
  const startOfDay = new Date();
  startOfDay.setHours(0, 0, 0, 0);

  const endOfDay = new Date();
  endOfDay.setHours(23, 59, 59, 999);

  return db('sensor_readings')
    .select('temp', 'humidity', 'pressure', 'latitude', 'longitude', 'battery', 'spo2', 'bpm', 'received_at')
    .where('watch_id', watchId)
    .andWhereBetween('received_at', [startOfDay, endOfDay])
    .orderBy('received_at', 'asc');
}

export function listAllReadings({ watchId }) {
  return db('sensor_readings')
    .select('temp', 'humidity', 'pressure', 'latitude', 'longitude', 'battery', 'spo2', 'bpm', 'received_at')
    .where('watch_id', watchId)
    .orderBy('received_at', 'desc');
}



