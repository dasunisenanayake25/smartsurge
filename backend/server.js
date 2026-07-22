import express from 'express';
import http from 'http';
import { Server } from 'socket.io';
import dotenv from 'dotenv';
import cors from 'cors';
import connectDB from './config/db.js';
import authRoutes from './routes/authRoutes.js';
import applianceRoutes from './routes/applianceRoutes.js';
import { startIoTSimulator } from './services/iotSimulator.js';

dotenv.config();

const app = express();
const server = http.createServer(app);

// Initialize Socket.io
const io = new Server(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST'],
  },
});

// Connect Database
connectDB();

// Middlewares
app.use(express.json());
app.use(cors());

// Pass Socket.io to Requests
app.use((req, res, next) => {
  req.io = io;
  next();
});

// Start IoT Simulator
startIoTSimulator(io);

// Routes
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/appliances', applianceRoutes);

// Base Health Check Route
app.get('/api/v1/health', (req, res) => {
  res.status(200).json({
    status: 'success',
    message: 'SmartSurge Backend Running',
  });
});

// Centralized Error Handling Middleware (MUST HAVE 4 PARAMETERS)
app.use((err, req, res, next) => {
  const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  res.status(statusCode).json({
    message: err.message || 'Internal Server Error',
  });
});

const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
  console.log(`[Server] Express running on Port: ${PORT}`);
});