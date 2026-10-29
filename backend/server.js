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

// Security: HTTP Headers protection with Helmet
app.use(helmet());

// Security: Data sanitization against NoSQL query injection
app.use(mongoSanitize());

// Security: Rate limiting to prevent brute-force & DDoS attacks
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 300,
  standardHeaders: true,
  legacyHeaders: false,
  message: { message: 'Too many requests from this IP, please try again after 15 minutes.' },
});
app.use('/api/', apiLimiter);

// Specific stricter rate limiter for Auth endpoints
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 50,
  message: { message: 'Too many login attempts, please try again in 15 minutes.' },
});
app.use('/api/v1/auth', authLimiter);

// Database middleware for serverless invocations
app.use(async (req, res, next) => {
  try {
    await connectDB();
    next();
  } catch (err) {
    res.status(500).json({ message: 'Database connection failed' });
  }
});

app.use(express.json());
app.use(cors());

// HTTP routes
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/appliances', applianceRoutes);
app.use('/api/v1/energy', energyRoutes);

app.get('/api/v1/health', (req, res) => {
  res.status(200).json({
    status: 'success',
    message: 'SmartSurge Backend Server is running successfully!',
    timestamp: new Date(),
  });
});

// Socket.io for local server mode
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST'],
  },
});

app.use((req, res, next) => {
  req.io = io;
  next();
});

io.on('connection', (socket) => {
  socket.on('disconnect', () => {});
});

startIoTSimulator(io);

// Standalone local execution
if (process.env.NODE_ENV !== 'production' && !process.env.VERCEL) {
  const PORT = process.env.PORT || 5000;
  server.listen(PORT, () => {
    console.log(`[Server] SmartSurge Express Server running on Port: ${PORT}`);
  });
}

// Export app for Vercel Serverless Function handler
export default app;
