import EnergyLog from '../models/EnergyLog.js';
import User from '../models/User.js';

export const startIoTSimulator = (io) => {
  console.log('[IoT Simulator] Virtual Energy Meter Streamer Started');

  setInterval(async () => {
    try {
      const sampleUser = await User.findOne();

      const voltage = +(220 + Math.random() * 15).toFixed(2);
      const current = +(1.5 + Math.random() * 8.5).toFixed(2);
      const powerWatt = +(voltage * current).toFixed(2);
      const energyKwh = +(powerWatt / 1000).toFixed(4);

      const liveDataPayload = {
        userId: sampleUser ? sampleUser._id : null,
        voltage,
        current,
        powerWatt,
        energyKwh,
        timestamp: new Date(),
      };

      io.emit('energyUpdate', liveDataPayload);

      if (sampleUser) {
        await EnergyLog.create(liveDataPayload);
      }
    } catch (error) {
      console.error(`[IoT Simulator Error]: ${error.message}`);
    }
  }, 5000);
};
