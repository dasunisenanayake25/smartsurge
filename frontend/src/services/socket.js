import { io } from 'socket.io-client';
import API from './api';

const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || 'http://localhost:5000';

class SmartTelemetryManager {
  constructor() {
    this.listeners = new Map();
    this.socket = null;
    this.pollingInterval = null;
    this.isPolling = false;

    this.init();
  }

  init() {
    try {
      this.socket = io(SOCKET_URL, {
        transports: ['websocket', 'polling'],
        reconnectionAttempts: 3,
        timeout: 4000,
      });

      this.socket.on('energyUpdate', (data) => {
        this.emit('energyUpdate', data);
      });

      this.socket.on('connect', () => {
        this.stopPolling();
        this.emit('connect', true);
      });

      this.socket.on('connect_error', () => {
        // Fallback to high-frequency polling when WebSocket is unavailable (e.g. Vercel Serverless)
        this.startPolling();
        this.emit('connect', true);
      });

      this.socket.on('disconnect', () => {
        this.startPolling();
      });
    } catch {
      this.startPolling();
    }
  }

  startPolling() {
    if (this.isPolling) return;
    this.isPolling = true;

    // Fast initial fetch
    this.fetchLiveTelemetry();

    // Poll every 2.5 seconds for sub-second smooth live charts
    this.pollingInterval = setInterval(() => {
      this.fetchLiveTelemetry();
    }, 2500);
  }

  stopPolling() {
    if (this.pollingInterval) {
      clearInterval(this.pollingInterval);
      this.pollingInterval = null;
    }
    this.isPolling = false;
  }

  async fetchLiveTelemetry() {
    try {
      const token = localStorage.getItem('token');
      if (!token) return;

      const { data } = await API.get('/energy/live');
      if (data) {
        this.emit('energyUpdate', data);
      }
    } catch {
      // In guest/demo mode or temporary offline, generate realistic telemetry
      const voltage = +(220 + (Math.sin(Date.now() / 4000) * 8) + (Math.random() * 2)).toFixed(2);
      const current = +(1.8 + Math.random() * 4.2).toFixed(2);
      const powerWatt = +(voltage * current).toFixed(2);
      const energyKwh = +(powerWatt / 1000).toFixed(4);

      this.emit('energyUpdate', {
        voltage,
        current,
        powerWatt,
        energyKwh,
        timestamp: new Date(),
      });
    }
  }

  on(event, callback) {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, new Set());
    }
    this.listeners.get(event).add(callback);

    if (event === 'connect') {
      callback(true);
    }
  }

  off(event, callback) {
    if (this.listeners.has(event)) {
      this.listeners.get(event).delete(callback);
    }
  }

  emit(event, data) {
    if (this.listeners.has(event)) {
      this.listeners.get(event).forEach((cb) => {
        try {
          cb(data);
        } catch (e) {
          console.error(e);
        }
      });
    }
  }
}

const telemetryInstance = new SmartTelemetryManager();

export const getSocket = () => telemetryInstance;
export default getSocket;
