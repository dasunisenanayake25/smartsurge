import mongoose from 'mongoose';
import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';
import User from '../models/User.js';
import Appliance from '../models/Appliance.js';
import EnergyLog from '../models/EnergyLog.js';

dotenv.config();

const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/smartsurge';

const seedData = async () => {
  try {
    console.log('[Seed] Connecting to MongoDB...');
    await mongoose.connect(MONGO_URI);
    console.log('[Seed] Connected successfully.');

    // 1. Create or Reset Demo User
    const demoEmail = 'demo@smartsurge.com';
    await User.deleteOne({ email: demoEmail });

    console.log('[Seed] Creating Demo User: demo@smartsurge.com...');
    const user = await User.create({
      name: 'Kasun Perera',
      email: demoEmail,
      password: '123456', // pre('save') in User.js automatically hashes this properly
      role: 'user',
      monthlyBudget: 6500,
      cebAccountNo: '074-819-2015-V',
      houseType: 'Two-Storey Residential',
      residentsCount: 4,
      solarSetup: 'None',
      district: 'Colombo',
    });
    console.log('[Seed] Demo User created with ID:', user._id);

    // 2. Clear old appliances & logs for this user to make it pristine
    await Appliance.deleteMany({ userId: user._id });
    await EnergyLog.deleteMany({ userId: user._id });

    // 3. Seed Realistic Household Appliances
    const appliances = [
      {
        userId: user._id,
        name: 'Master Bedroom Inverter AC',
        category: 'AC',
        ratedWattage: 1200,
        status: 'ON',
        isSmartPlugConnected: true,
        dailyUsageHours: 6.5,
      },
      {
        userId: user._id,
        name: 'Smart Inverter Refrigerator',
        category: 'Refrigerator',
        ratedWattage: 180,
        status: 'ON',
        isSmartPlugConnected: true,
        dailyUsageHours: 24,
      },
      {
        userId: user._id,
        name: 'Living Room 55" 4K Smart TV',
        category: 'TV',
        ratedWattage: 110,
        status: 'ON',
        isSmartPlugConnected: true,
        dailyUsageHours: 4.5,
      },
      {
        userId: user._id,
        name: 'Automatic Washing Machine',
        category: 'Washing Machine',
        ratedWattage: 500,
        status: 'OFF',
        isSmartPlugConnected: true,
        dailyUsageHours: 1.5,
      },
      {
        userId: user._id,
        name: 'Kitchen Microwave Oven',
        category: 'Other',
        ratedWattage: 1150,
        status: 'OFF',
        isSmartPlugConnected: true,
        dailyUsageHours: 0.8,
      },
      {
        userId: user._id,
        name: 'Instant Bathroom Water Heater',
        category: 'Other',
        ratedWattage: 2100,
        status: 'OFF',
        isSmartPlugConnected: true,
        dailyUsageHours: 0.5,
      },
      {
        userId: user._id,
        name: 'LED Ambient & Corridor Lighting',
        category: 'Lighting',
        ratedWattage: 75,
        status: 'ON',
        isSmartPlugConnected: true,
        dailyUsageHours: 7.0,
      },
    ];

    await Appliance.insertMany(appliances);
    console.log(`[Seed] Seeded ${appliances.length} smart appliances successfully.`);

    // 4. Seed 24 Hours of Realistic Telemetry Logs
    const now = new Date();
    const logs = [];

    // Base wattage for currently ON devices: ~1565W
    for (let i = 48; i >= 0; i--) {
      const timestamp = new Date(now.getTime() - i * 30 * 60 * 1000); // every 30 mins for 24h
      const hour = timestamp.getHours();

      // Peak hour fluctuation (6:30 PM - 10:30 PM higher draw)
      let baseWatt = 380;
      if (hour >= 18 && hour <= 22) {
        baseWatt = 1500 + Math.floor(Math.random() * 450); // Peak hours
      } else if (hour >= 23 || hour <= 5) {
        baseWatt = 180 + Math.floor(Math.random() * 80); // Sleeping/night base load
      } else {
        baseWatt = 550 + Math.floor(Math.random() * 350); // Daytime load
      }

      const voltage = +(228 + (Math.random() * 6 - 3)).toFixed(1);
      const current = +(baseWatt / voltage).toFixed(2);
      const energyKwh = +((baseWatt * 0.5) / 1000).toFixed(4); // 30 min consumption

      logs.push({
        userId: user._id,
        voltage,
        current,
        powerWatt: baseWatt,
        energyKwh,
        timestamp,
      });
    }

    await EnergyLog.insertMany(logs);
    console.log(`[Seed] Seeded ${logs.length} telemetry energy logs successfully.`);

    console.log('========================================================');
    console.log('  Demo Environment Successfully Seeded!');
    console.log('  Login Email    : demo@smartsurge.com');
    console.log('  Login Password : 123456');
    console.log('========================================================');

    process.exit(0);
  } catch (error) {
    console.error('[Seed Error]:', error.message);
    process.exit(1);
  }
};

seedData();
