import express from 'express';
import http from 'http';
import { Server } from 'socket.io';
import dotenv from 'dotenv';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import mongoSanitize from 'express-mongo-sanitize';
import connectDB from './config/db.js';
import authRoutes from './routes/authRoutes.js';
import applianceRoutes from './routes/applianceRoutes.js';
import energyRoutes from './routes/energyRoutes.js';
import { startIoTSimulator } from './services/iotSimulator.js';

dotenv.config();

const app = express();
const server = http.createServer(app);

// Security: HTTP Headers protection with Helmet
app.use(helmet());

// Security: Data sanitization against NoSQL query injection
app.use(mongoSanitize());

// Security: Rate limiting to prevent brute-force & DDoS attacks
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 300, // limit each IP to 300 requests per window
  standardHeaders: true,
  legacyHeaders: false,
  message: { message: 'Too many requests from this IP, please try again after 15 minutes.' },
});
app.use('/api/', apiLimiter);

// Specific stricter rate limiter for Auth endpoints
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 30, // 30 attempts per 15 min for login/register
  message: { message: 'Too many login attempts, please try again in 15 minutes.' },
});
app.use('/api/v1/auth', authLimiter);

const io = new Server(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST'],
  },
});

connectDB();

app.use(express.json());
app.use(cors());

app.use((req, res, next) => {
  req.io = io;
  next();
});

io.on('connection', (socket) => {
  console.log(`[Socket.io] Client Connected: ${socket.id}`);
  socket.on('disconnect', () => {
    console.log(`[Socket.io] Client Disconnected: ${socket.id}`);
  });
});

startIoTSimulator(io);

app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/appliances', applianceRoutes);
app.use('/api/v1/energy', energyRoutes);

app.get('/api/v1/health', (req, res) => {
  res.status(200).json({
    status: 'success',
    message: 'SmartSurge Backend Server is running successfully with Socket.io!',
    timestamp: new Date(),
  });
});

const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
  console.log(`[Server] SmartSurge Express Server running on Port: ${PORT}`);
});
