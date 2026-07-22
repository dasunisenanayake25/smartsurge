import mongoose from 'mongoose';

const applianceSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    name: {
      type: String,
      required: [true, 'Please provide appliance name'],
      trim: true,
    },
    category: {
      type: String,
      enum: ['AC', 'Refrigerator', 'Washing Machine', 'TV', 'Lighting', 'Other'],
      default: 'Other',
    },
    ratedWattage: {
      type: Number,
      required: [true, 'Please provide rated wattage'],
    },
    status: {
      type: String,
      enum: ['ON', 'OFF'],
      default: 'OFF',
    },
    isSmartPlugConnected: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

const Appliance = mongoose.model('Appliance', applianceSchema);
export default Appliance;