import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import swaggerUi from 'swagger-ui-express';
// import { swaggerSpec } from './swagger.js';
import authRoutes from './src/routes/auth.routes.js';
import appointmentRoutes from './src/routes/appointment.routes.js';
import { swaggerSpec } from './src/swagger.js';


dotenv.config();


const app = express();
app.use(cors());
app.use(express.json());


// Routes
app.use('/api/auth', authRoutes);
app.use('/api/appointments', appointmentRoutes);


// Swagger
app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));


app.get('/', (req, res) => res.send({ status: 'ok', timestamp: new Date().toISOString() }));


const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT} (docs: /docs)`));