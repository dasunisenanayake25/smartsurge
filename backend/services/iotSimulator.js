import EnergyLog from '../models/EnergyLog.js';
import User from '../models/User.js';

/**
 * Simulates Real-time IoT Smart Meter Reading
 * Generates realistic Voltage, Current, Power Wattage, and kWh
 */
export const startIoTSimulator = (io) => {
  console.log('[IoT Simulator] Virtual Energy Meter Streamer Started...');

  // Emit dynamic telemetry every 5 seconds
  setInterval(async () => {
    try {
      // Fetch a sample registered user from Database
      const sampleUser = await User.findOne();

      // Generate realistic dynamic metrics
      const voltage = +(220 + Math.random() * 15).toFixed(2); // 220V - 235V
      const current = +(1.5 + Math.random() * 8.5).toFixed(2); // 1.5A - 10.0A
      const powerWatt = +(voltage * current).toFixed(2); // Power (Watts) = V x I
      const energyKwh = +(powerWatt / 1000).toFixed(4); // Energy in Units (kWh)

      const liveDataPayload = {
        userId: sampleUser ? sampleUser._id : null,
        voltage,
        current,
        powerWatt,
        energyKwh,
        timestamp: new Date(),
      };

      // 1. Broadcast live telemetry to connected Socket.io Web Clients
      io.emit('energyUpdate', liveDataPayload);

      // 2. Persist time-series log to MongoDB if user exists
      if (sampleUser) {
        await EnergyLog.create(liveDataPayload);
      }

    } catch (error) {
      console.error(`[IoT Simulator Error]: ${error.message}`);
    }
  }, 5000); // Executed every 5 seconds
};
