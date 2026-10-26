import express from 'express';
import http from 'http';
import { Server } from 'socket.io';
import dotenv from 'dotenv';
import cors from 'cors';
import connectDB from './config/db.js';
import authRoutes from './routes/authRoutes.js';
import applianceRoutes from './routes/applianceRoutes.js';
import energyRoutes from './routes/energyRoutes.js';
import { startIoTSimulator } from './services/iotSimulator.js';

dotenv.config();

const app = express();
const server = http.createServer(app);

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
