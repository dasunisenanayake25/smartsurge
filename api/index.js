import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import helmet from 'helmet';
import mongoSanitize from 'express-mongo-sanitize';
import connectDB from '../backend/config/db.js';
import authRoutes from '../backend/routes/authRoutes.js';
import applianceRoutes from '../backend/routes/applianceRoutes.js';
import energyRoutes from '../backend/routes/energyRoutes.js';

dotenv.config();

const app = express();

app.use(helmet());
app.use(mongoSanitize());
app.use(cors());
app.use(express.json());

// Connect database
connectDB();

// Mock socket.io property for existing controller compatibility
app.use((req, res, next) => {
  req.io = { emit: () => {} };
  next();
});

app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/appliances', applianceRoutes);
app.use('/api/v1/energy', energyRoutes);

app.get('/api/v1/health', (req, res) => {
  res.status(200).json({
    status: 'success',
    message: 'SmartSurge Serverless Backend is running on Vercel!',
    timestamp: new Date(),
  });
});

export default app;
