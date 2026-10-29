import EnergyLog from '../models/EnergyLog.js';

// @desc    Get live real-time energy usage summary
// @route   GET /api/v1/energy/live
// @access  Private
export const getLiveEnergyData = async (req, res) => {
  try {
    const latestLog = await EnergyLog.findOne({ userId: req.user._id }).sort({ timestamp: -1 });

    const voltage = +(220 + (Math.sin(Date.now() / 4000) * 8) + (Math.random() * 2)).toFixed(2);
    const current = +(1.8 + Math.random() * 4.2).toFixed(2);
    const powerWatt = +(voltage * current).toFixed(2);
    const energyKwh = +(powerWatt / 1000).toFixed(4);

    const liveData = {
      userId: req.user._id,
      voltage: latestLog?.voltage || voltage,
      current: latestLog?.current || current,
      powerWatt: latestLog?.powerWatt || powerWatt,
      energyKwh: latestLog?.energyKwh || energyKwh,
      timestamp: new Date(),
    };

    res.status(200).json(liveData);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get historical energy logs for charts
// @route   GET /api/v1/energy/history
// @access  Private
export const getEnergyHistory = async (req, res) => {
  try {
    // Fetch last 50 historical logs for analytics charts
    const logs = await EnergyLog.find({ userId: req.user._id })
      .sort({ timestamp: -1 })
      .limit(50);

    res.status(200).json(logs.reverse()); // Reverse to get chronological order (past to present)
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get Sri Lankan Tariff Slab-based Monthly Bill Estimate
// @route   GET /api/v1/energy/bill-estimate
// @access  Private
export const getBillEstimate = async (req, res) => {
  try {
    // Calculate total energy consumed (kWh) in the current month
    const startOfMonth = new Date();
    startOfMonth.setDate(1);
    startOfMonth.setHours(0, 0, 0, 0);

    const totalEnergy = await EnergyLog.aggregate([
      {
        $match: {
          userId: req.user._id,
          timestamp: { $gte: startOfMonth },
        },
      },
      {
        $group: {
          _id: null,
          totalKwh: { $sum: '$energyKwh' },
        },
      },
    ]);

    const consumedKwh = totalEnergy.length > 0 ? totalEnergy[0].totalKwh : 0;

    // Sri Lankan Domestic Electricity Tariff Slab Logic (Simplified Baseline Calculation)
    let estimatedCost = 0;
    const units = Math.round(consumedKwh);

    if (units <= 30) {
      estimatedCost = units * 8 + 150; // Fixed Charge LKR 150
    } else if (units <= 60) {
      estimatedCost = 30 * 8 + (units - 30) * 20 + 300;
    } else if (units <= 90) {
      estimatedCost = 60 * 20 + (units - 60) * 30 + 400;
    } else {
      estimatedCost = 90 * 30 + (units - 90) * 50 + 1000;
    }

    res.status(200).json({
      consumedKwh: +consumedKwh.toFixed(2),
      estimatedCostLkr: +estimatedCost.toFixed(2),
      monthlyBudget: req.user.monthlyBudget || 5000,
      isBudgetExceeded: estimatedCost > (req.user.monthlyBudget || 5000),
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
