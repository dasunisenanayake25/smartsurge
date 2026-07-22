import mongoose from 'mongoose';

const energyLogSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    applianceId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Appliance',
      required: false,
    },
    voltage: {
      type: Number,
      required: true,
    },
    current: {
      type: Number,
      required: true,
    },
    powerWatt: {
      type: Number,
      required: true,
    },
    energyKwh: {
      type: Number,
      required: true,
    },
    timestamp: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

// Add index for fast querying on time-series data
energyLogSchema.index({ userId: 1, timestamp: -1 });

const EnergyLog = mongoose.model('EnergyLog', energyLogSchema);
export default EnergyLog;