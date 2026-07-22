import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import connectDB from './config/db.js';

dotenv.config();

const app = express();import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import connectDB from './config/db.js';
import authRoutes from './routes/authRoutes.js';

dotenv.config();

const app = express();

// Connect to MongoDB
connectDB();

// Essential Middlewares
app.use(express.json());
app.use(cors());

// Mount Routes
app.use('/api/v1/auth', authRoutes);

// Base Health Check Route
app.get('/api/v1/health', (req, res) => {
  res.status(200).json({
    status: 'success',
    message: 'SmartSurge Backend Server is running successfully!',
    timestamp: new Date(),
  });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`[Server] SmartSurge Express Server running on Port: ${PORT}`);
});

connectDB();

app.use(express.json()); 
app.use(cors()); 

app.get('/api/v1/health', (req, res) => {
  res.status(200).json({
    status: 'success',
    message: 'SmartSurge Backend Server is running successfully!',
    timestamp: new Date()
  });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`[Server] SmartSurge Express Server running on Port: ${PORT}`);
});