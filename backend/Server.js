import express from 'express';
import dotenv from 'dotenv';
import authRoutes from './routes/auth.routes.js';
import todoRoutes from './routes/todo.routes.js';
import menstruationRoutes from './routes/menstruation.routes.js';
import sensorRoutes from './routes/sensor.routes.js';
import profileRoutes from './routes/profile.routes.js';
import childrenRoutes from './routes/children.routes.js';
import cors from 'cors';
import swaggerUi from 'swagger-ui-express';
import { specs } from './config/swagger.js';
import { startMqttListener } from './services/mqtt.service.js';





dotenv.config();

const app = express();

const PORT = process.env.PORT || 14192;

app.use(express.json());

app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true 
}));

app.use('/api/auth', authRoutes);
app.use('/api/todos', todoRoutes);
app.use('/api/menstruation', menstruationRoutes);
app.use('/api/sensor', sensorRoutes);
app.use('/api/profile', profileRoutes);
app.use('/api/children', childrenRoutes);

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs, {
  customCss: '.swagger-ui .topbar { display: none }',
  customSiteTitle: 'Kids Safe Nest API Documentation'
}));

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`API Documentation available at: http://localhost:${PORT}/api-docs`);
});

// Start background MQTT listener
startMqttListener();

