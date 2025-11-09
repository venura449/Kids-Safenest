import mqtt from 'mqtt';
import { insertSensorReading } from '../models/sensor.model.js';
import { findUserByWatchId } from '../models/user.model.js';
import { addVital } from '../models/health.model.js';

const MQTT_URL = 'wss://mqtt-dashboard.com:8884/mqtt';
const MQTT_TOPIC = 'esp32c3/sensors';

let client;

export function startMqttListener() {
  if (client) return;
  client = mqtt.connect(MQTT_URL, {
    clientId: `safenest-api-${Math.random().toString(16).slice(2)}`,
    clean: true,
    reconnectPeriod: 3000,
    keepalive: 60
  });

  client.on('connect', () => {
    try {
      client.subscribe(MQTT_TOPIC, { qos: 0 });
      // eslint-disable-next-line no-console
      console.log(`[MQTT] Connected and subscribed to ${MQTT_TOPIC}`);
    } catch (err) {
      console.error('[MQTT] Subscribe error', err);
    }
  });

  client.on('message', async (topic, message) => {
    if (topic !== MQTT_TOPIC) return;
    try {
      const payload = JSON.parse(message.toString());
      await insertSensorReading(payload);
      console.log(payload);

      if (payload.watchID || payload.watch_id) {
        const watchId = payload.watchID || payload.watch_id;
        const user = await findUserByWatchId(watchId);
        if (user) {
          const date = new Date().toISOString().split('T')[0];
          // Persist vitals derived from payload
          if (payload.temp !== undefined) {
            await addVital({ userId: user.id, type: 'Temperature', value: String(payload.temp), unit: 'C', status: 'normal', date });
          }
          if (payload.bpm !== undefined) {
            await addVital({ userId: user.id, type: 'Heart Rate', value: String(payload.bpm), unit: 'bpm', status: 'normal', date });
          }
          if (payload.spo2 !== undefined) {
            await addVital({ userId: user.id, type: 'SpO2', value: String(payload.spo2), unit: '%', status: 'normal', date });
          }
        }
      }
    } catch (err) {
      console.error('[MQTT] Message handling error', err);
    }
  });

  client.on('error', (err) => {
    console.error('[MQTT] Error', err);
  });
}


