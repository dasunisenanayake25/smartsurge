import React, { useState, useEffect, useContext } from 'react';
import { io } from 'socket.io-client';
import { 
  FileText, 
  Printer, 
  Download, 
  PieChart as PieIcon, 
  TrendingDown, 
  Sparkles, 
  AlertCircle, 
  ShieldCheck, 
  Leaf, 
  Zap, 
  Info,
  Calendar,
  Clock,
  Activity,
  Flame,
  CheckCircle2
} from 'lucide-react';
import { 
  ResponsiveContainer, 
  PieChart, 
  Pie, 
  Cell, 
  Tooltip, 
  Legend 
} from 'recharts';
import { AuthContext } from '../context/AuthContext';
import API from '../services/api';

export default function Reports() {
  const { user } = useContext(AuthContext);
  const [billData, setBillData] = useState({
    consumedKwh: 68.5,
    estimatedCostLkr: 2150,
    monthlyBudget: 5000,
  });
  const [livePower, setLivePower] = useState(480);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [loading, setLoading] = useState(true);

  // Auto-updating real-time clock (every 5 seconds)
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  // Fetch initial bill estimation
  useEffect(() => {
    const fetchReportData = async () => {
      try {
        const { data } = await API.get('/energy/bill-estimate');
        if (data && data.consumedKwh !== undefined) {
          setBillData({
            consumedKwh: data.consumedKwh || 68.5,
            estimatedCostLkr: data.estimatedCostLkr || 2150,
            monthlyBudget: data.monthlyBudget || 5000,
          });
        }
      } catch (err) {
        console.warn('Failed to fetch bill estimate for reports:', err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchReportData();
  }, []);

  // Socket.io for live telemetry power updates
  useEffect(() => {
    const socket = io('http://localhost:5000', {
      transports: ['websocket', 'polling'],
      reconnectionAttempts: 5,
    });

    socket.on('energyUpdate', (data) => {
      if (data && data.powerWatt !== undefined) {
        setLivePower(Math.round(data.powerWatt));
      }
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  // Sri Lankan CEB/LECO Slab Calculations
  const units = Math.max(0, Math.round(billData.consumedKwh));
  
  // Tier breakdown calculation
  const tier1Units = Math.min(units, 30);
  const tier1Cost = tier1Units * 8;

  const tier2Units = units > 30 ? Math.min(units - 30, 30) : 0;
  const tier2Cost = tier2Units * 20;

  const tier3Units = units > 60 ? Math.min(units - 60, 30) : 0;
  const tier3Cost = tier3Units * 30;

  const tier4Units = units > 90 ? units - 90 : 0;
  const tier4Cost = tier4Units * 50;

  let fixedCharge = 150;
  if (units > 30 && units <= 60) fixedCharge = 300;
  else if (units > 60 && units <= 90) fixedCharge = 400;
  else if (units > 90) fixedCharge = 1000;

  const totalCalculatedBill = tier1Cost + tier2Cost + tier3Cost + tier4Cost + fixedCharge;
  const projectedMonthEndBill = Math.round(totalCalculatedBill * 1.35);
  const co2SavedKg = +(billData.consumedKwh * 0.42).toFixed(1);

  // Appliance Share Pie Chart Data
  const applianceShareData = [
    { name: 'Master Bedroom AC', value: 48, color: '#236144', kwh: (billData.consumedKwh * 0.48).toFixed(1) },
    { name: 'Smart Refrigerator', value: 24, color: '#10b981', kwh: (billData.consumedKwh * 0.24).toFixed(1) },
    { name: 'Living Room TV & Media', value: 12, color: '#f59e0b', kwh: (billData.consumedKwh * 0.12).toFixed(1) },
    { name: 'Water Heater & Lighting', value: 16, color: '#6366f1', kwh: (billData.consumedKwh * 0.16).toFixed(1) },
  ];

  // ----------------------------------------------------
  // Dynamic Real-Time AI Recommendations Engine
  // ----------------------------------------------------
  const currentHour = currentTime.getHours();
  const currentMinute = currentTime.getMinutes();
  const currentDecimal = currentHour + currentMinute / 60;

  // 1. Time-of-Use Window (Peak: 6:30 PM - 10:30 PM)
  const isPeak = currentDecimal >= 18.5 && currentDecimal < 22.5;
  const isOffPeak = currentDecimal >= 22.5 || currentDecimal < 5.5;

  let timeRec;
  if (isPeak) {
    timeRec = {
      title: 'Peak Demand Window Active (6:30 PM – 10:30 PM)',
      badge: 'High Grid Strain',
      badgeColor: 'text-amber-800 bg-amber-100 border-amber-200',
      description: 'The national grid is experiencing peak demand. Delaying high-draw appliances (washing machines, electric irons, water pumps) past 10:30 PM avoids tariff spikes.',
      metric: 'Est. Savings: ~18% Peak Shifting',
      icon: Flame,
      iconColor: 'text-amber-600',
      cardStyle: 'bg-amber-50/60 border-amber-200',
    };
  } else if (isOffPeak) {
    timeRec = {
      title: 'Off-Peak Window Active (10:30 PM – 5:30 AM)',
      badge: 'Low Grid Load',
      badgeColor: 'text-emerald-800 bg-emerald-100 border-emerald-200',
      description: 'Optimal low-stress electricity window. Perfect time for running water heaters, dishwashers, and charging batteries with minimal thermal stress.',
      metric: 'Optimal Scheduling Window',
      icon: CheckCircle2,
      iconColor: 'text-emerald-600',
      cardStyle: 'bg-emerald-50/60 border-emerald-200',
    };
  } else {
    timeRec = {
      title: 'Standard Daytime Operation',
      badge: 'Normal Tariff Window',
      badgeColor: 'text-blue-800 bg-blue-100 border-blue-200',
      description: 'Solar daylight hours. Setting inverter air conditioners to 24°C–25°C saves up to 25% compressor energy compared to sub-20°C cooling.',
      metric: 'Est. AC Efficiency: ~25%',
      icon: Clock,
      iconColor: 'text-blue-600',
      cardStyle: 'bg-[#F8FAF6] border-[#E3EDE5]',
    };
  }

  // 2. CEB Tariff Slab Boundary Guard
  let slabRec;
  if (units <= 25) {
    slabRec = {
      title: 'Block 1 Safe Zone (0 – 30 kWh)',
      badge: `Current: ${units} kWh`,
      badgeColor: 'text-emerald-800 bg-emerald-100 border-emerald-200',
      description: `You are in the lowest tariff bracket (Rs. 8.00/unit). You have ${30 - units} kWh remaining before entering Block 2 (Rs. 20.00/unit).`,
      metric: `${30 - units} kWh buffer to Block 2`,
      icon: ShieldCheck,
      iconColor: 'text-emerald-600',
      cardStyle: 'bg-[#F8FAF6] border-[#E3EDE5]',
    };
  } else if (units <= 30) {
    slabRec = {
      title: 'Slab 1 Limit (Approaching 30 kWh)',
      badge: 'Threshold Warning',
      badgeColor: 'text-amber-800 bg-amber-100 border-amber-200',
      description: `You have consumed ${units} kWh. Crossing 30 kWh jumps unit price by 150% (Rs. 8.00 to Rs. 20.00/unit) and doubles monthly fixed charges.`,
      metric: `Only ${30 - units} kWh remaining in Block 1`,
      icon: AlertCircle,
      iconColor: 'text-amber-600',
      cardStyle: 'bg-amber-50/60 border-amber-200',
    };
  } else if (units <= 55) {
    slabRec = {
      title: 'Block 2 Active (31 – 60 kWh)',
      badge: `Current: ${units} kWh`,
      badgeColor: 'text-blue-800 bg-blue-100 border-blue-200',
      description: `You are in Block 2 (Rs. 20.00/unit). Keep consumption below 60 kWh to prevent entering Block 3 (Rs. 30.00/unit) and higher fixed fees.`,
      metric: `${60 - units} kWh buffer to Block 3`,
      icon: ShieldCheck,
      iconColor: 'text-blue-600',
      cardStyle: 'bg-[#F8FAF6] border-[#E3EDE5]',
    };
  } else if (units <= 60) {
    slabRec = {
      title: 'Critical Slab 2 Limit (Approaching 60 kWh)',
      badge: 'High Danger Threshold',
      badgeColor: 'text-rose-800 bg-rose-100 border-rose-200',
      description: `You are at ${units} kWh. Crossing 60 kWh increases unit price to Rs. 30.00 and raises fixed charge from Rs. 300 to Rs. 400.`,
      metric: `Save ${60 - units} kWh to protect Block 2`,
      icon: AlertCircle,
      iconColor: 'text-rose-600',
      cardStyle: 'bg-rose-50/60 border-rose-200',
    };
  } else if (units <= 85) {
    slabRec = {
      title: 'Block 3 Active (61 – 90 kWh)',
      badge: `Current: ${units} kWh`,
      badgeColor: 'text-amber-800 bg-amber-100 border-amber-200',
      description: `High tariff tier active (Rs. 30.00/unit). Reducing daily burn keeps usage below 90 kWh and prevents entering the Rs. 50/unit tier.`,
      metric: `${90 - units} kWh buffer to Block 4`,
      icon: ShieldCheck,
      iconColor: 'text-amber-600',
      cardStyle: 'bg-[#F8FAF6] border-[#E3EDE5]',
    };
  } else if (units <= 90) {
    slabRec = {
      title: 'Max Tariff Alert (Approaching 90 kWh)',
      badge: 'Critical Red Alert',
      badgeColor: 'text-rose-800 bg-rose-100 border-rose-200',
      description: `URGENT: You are at ${units} kWh. Crossing 90 kWh triggers Block 4 (Rs. 50.00/unit) and surges the fixed charge to Rs. 1,000.00.`,
      metric: `Conserve ${90 - units} kWh to avoid Rs. 50/unit`,
      icon: AlertCircle,
      iconColor: 'text-rose-600',
      cardStyle: 'bg-rose-50/60 border-rose-200',
    };
  } else {
    slabRec = {
      title: 'Maximum Tariff Tier Active (90+ kWh)',
      badge: 'Highest Slab (Rs. 50/unit)',
      badgeColor: 'text-rose-800 bg-rose-100 border-rose-200',
      description: `You have consumed ${units} kWh in the highest domestic tariff tier. Every additional unit costs Rs. 50.00 + fuel adjustment surcharges.`,
      metric: 'Maximum Rate Active',
      icon: AlertCircle,
      iconColor: 'text-rose-600',
      cardStyle: 'bg-rose-50/60 border-rose-200',
    };
  }

  // 3. Live Active Load / Vampire Drain Guard
  let loadRec;
  if (livePower >= 1500) {
    loadRec = {
      title: 'High Active Load Surge Detected',
      badge: `${livePower} W Spike`,
      badgeColor: 'text-rose-800 bg-rose-100 border-rose-200',
      description: `Live power is currently elevated at ${livePower}W. Multiple high-wattage heating or motor loads appear to be operating concurrently.`,
      action: 'High Instantaneous Demand',
      icon: Activity,
      iconColor: 'text-rose-600',
      cardStyle: 'bg-rose-50/60 border-rose-200',
    };
  } else if ((currentHour >= 23 || currentHour <= 5) && livePower >= 100) {
    loadRec = {
      title: 'Standby Phantom Drain Detected',
      badge: `${livePower} W Idle Draw`,
      badgeColor: 'text-amber-800 bg-amber-100 border-amber-200',
      description: `During nocturnal hours, a continuous draw of ${livePower}W is detected. Idle media consoles and chargers waste up to 25 kWh/month.`,
      action: 'Automate Smart Cut-off',
      icon: Zap,
      iconColor: 'text-amber-600',
      cardStyle: 'bg-amber-50/60 border-amber-200',
    };
  } else {
    loadRec = {
      title: 'Optimal Real-Time Load Balance',
      badge: `${livePower} W Active`,
      badgeColor: 'text-emerald-800 bg-emerald-100 border-emerald-200',
      description: `Current home load of ${livePower}W is within the recommended efficiency threshold. Automated smart switches keep standby waste minimal.`,
      action: 'Smart Energy Shield Active',
      icon: ShieldCheck,
      iconColor: 'text-emerald-600',
      cardStyle: 'bg-[#F8FAF6] border-[#E3EDE5]',
    };
  }

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="h-full overflow-y-auto p-4 sm:p-6 relative z-10 w-full max-w-7xl mx-auto flex flex-col gap-5 print:p-0 print:m-0">
      
      {/* Header */}
      <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-200/80 pb-4 flex-shrink-0">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-[#113621]">
            Energy & Billing Reports
          </h1>
          <p className="text-gray-500 mt-0.5 text-xs md:text-sm">
            Official tariff slab breakdown, appliance load shares, and AI cost optimization insights
          </p>
        </div>

        <button
          onClick={handlePrint}
          className="inline-flex items-center gap-2 bg-[#236144] hover:bg-[#1a4a34] text-white px-5 py-2.5 rounded-full text-xs sm:text-sm font-semibold shadow-sm transition print:hidden"
        >
          <Printer size={16} />
          <span>Print / Save PDF</span>
        </button>
      </header>

      {/* Top Monthly Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 flex-shrink-0">
        <div className="bg-white border border-gray-200/90 rounded-2xl p-4 shadow-sm">
          <span className="text-xs font-semibold text-gray-500 block mb-1">Month-to-Date Usage</span>
          <p className="text-2xl sm:text-3xl font-bold text-[#113621] font-mono">
            {billData.consumedKwh} <span className="text-sm font-normal text-gray-500">kWh</span>
          </p>
          <span className="text-[11px] text-gray-500 mt-1 block font-medium">Accumulated household units</span>
        </div>

        <div className="bg-white border border-gray-200/90 rounded-2xl p-4 shadow-sm">
          <span className="text-xs font-semibold text-gray-500 block mb-1">Current Month Cost</span>
          <p className="text-2xl sm:text-3xl font-bold text-[#113621] font-mono">
            <span className="text-base font-sans text-[#236144] mr-1">Rs.</span>
            {totalCalculatedBill.toLocaleString()}
          </p>
          <span className="text-[11px] text-emerald-600 font-semibold mt-1 block">Accrued tariff subtotal</span>
        </div>

        <div className="bg-white border border-gray-200/90 rounded-2xl p-4 shadow-sm">
          <span className="text-xs font-semibold text-gray-500 block mb-1">Projected End Bill</span>
          <p className="text-2xl sm:text-3xl font-bold text-amber-600 font-mono">
            <span className="text-base font-sans mr-1">Rs.</span>
            {projectedMonthEndBill.toLocaleString()}
          </p>
          <span className="text-[11px] text-gray-500 mt-1 block">Forecasted 30-day billing</span>
        </div>

        <div className="bg-white border border-gray-200/90 rounded-2xl p-4 shadow-sm">
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs font-semibold text-gray-500">Carbon Impact</span>
            <Leaf size={16} className="text-emerald-600" />
          </div>
          <p className="text-2xl sm:text-3xl font-bold text-[#113621] font-mono">
            {co2SavedKg} <span className="text-sm font-normal text-gray-500">kg</span>
          </p>
          <span className="text-[11px] text-emerald-600 font-semibold mt-1 block">CO₂ equivalent emissions</span>
        </div>
      </div>

      {/* Main Grid: CEB Slab Breakdown + Appliance Share Pie Chart */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        
        {/* Left Col: Sri Lankan CEB Tariff Slab Breakdown Table (7 cols) */}
        <div className="lg:col-span-7 bg-white border border-gray-200/90 rounded-2xl p-5 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <div>
                <h3 className="text-base font-bold text-[#113621]">CEB/LECO Domestic Tariff Slab Breakdown</h3>
                <p className="text-xs text-gray-500">Progressive block calculation as mandated by Sri Lanka CEB</p>
              </div>
              <span className="text-[11px] font-semibold px-2.5 py-1 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-full">
                Domestic Category
              </span>
            </div>

            <div className="overflow-x-auto mt-2">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-gray-50/80 border-b border-gray-200 text-gray-600 font-semibold">
                    <th className="py-2.5 px-3">Consumption Slab</th>
                    <th className="py-2.5 px-3">Units Used</th>
                    <th className="py-2.5 px-3">Unit Rate</th>
                    <th className="py-2.5 px-3 text-right">Subtotal</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 text-gray-700">
                  <tr className="hover:bg-gray-50/50">
                    <td className="py-2.5 px-3 font-medium">Block 1 (0 – 30 kWh)</td>
                    <td className="py-2.5 px-3 font-mono">{tier1Units} kWh</td>
                    <td className="py-2.5 px-3 font-mono">Rs. 8.00</td>
                    <td className="py-2.5 px-3 font-mono font-semibold text-right text-gray-900">Rs. {tier1Cost.toFixed(2)}</td>
                  </tr>

                  <tr className="hover:bg-gray-50/50">
                    <td className="py-2.5 px-3 font-medium">Block 2 (31 – 60 kWh)</td>
                    <td className="py-2.5 px-3 font-mono">{tier2Units} kWh</td>
                    <td className="py-2.5 px-3 font-mono">Rs. 20.00</td>
                    <td className="py-2.5 px-3 font-mono font-semibold text-right text-gray-900">Rs. {tier2Cost.toFixed(2)}</td>
                  </tr>

                  <tr className="hover:bg-gray-50/50">
                    <td className="py-2.5 px-3 font-medium">Block 3 (61 – 90 kWh)</td>
                    <td className="py-2.5 px-3 font-mono">{tier3Units} kWh</td>
                    <td className="py-2.5 px-3 font-mono">Rs. 30.00</td>
                    <td className="py-2.5 px-3 font-mono font-semibold text-right text-gray-900">Rs. {tier3Cost.toFixed(2)}</td>
                  </tr>

                  <tr className="hover:bg-gray-50/50">
                    <td className="py-2.5 px-3 font-medium">Block 4 (90+ kWh)</td>
                    <td className="py-2.5 px-3 font-mono">{tier4Units} kWh</td>
                    <td className="py-2.5 px-3 font-mono">Rs. 50.00</td>
                    <td className="py-2.5 px-3 font-mono font-semibold text-right text-gray-900">Rs. {tier4Cost.toFixed(2)}</td>
                  </tr>

                  <tr className="hover:bg-gray-50/50 bg-gray-50/30">
                    <td className="py-2.5 px-3 font-medium text-gray-600" colSpan="3">
                      Fixed Monthly Service Charge (Tier: {units > 60 ? 'Above 60' : 'Below 60'} Units)
                    </td>
                    <td className="py-2.5 px-3 font-mono font-semibold text-right text-gray-900">Rs. {fixedCharge.toFixed(2)}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-gray-200 flex items-center justify-between">
            <span className="text-xs font-semibold text-gray-600">Total Net Estimated Payable</span>
            <span className="text-lg sm:text-xl font-bold font-mono text-[#113621]">
              Rs. {totalCalculatedBill.toLocaleString(undefined, { minimumFractionDigits: 2 })}
            </span>
          </div>
        </div>

        {/* Right Col: Appliance Consumption Shares Pie Chart (5 cols) */}
        <div className="lg:col-span-5 bg-white border border-gray-200/90 rounded-2xl p-5 shadow-sm flex flex-col justify-between">
          <div>
            <h3 className="text-base font-bold text-[#113621]">Appliance Load Distribution</h3>
            <p className="text-xs text-gray-500 mb-2">Percentage share of electricity consumed by key devices</p>

            <div className="w-full h-[220px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={applianceShareData}
                    cx="50%"
                    cy="50%"
                    innerRadius={55}
                    outerRadius={80}
                    paddingAngle={4}
                    dataKey="value"
                  >
                    {applianceShareData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: '#ffffff', 
                      border: '1px solid #e2e8f0',
                      borderRadius: '12px',
                      boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
                      fontSize: '12px',
                      fontWeight: 600
                    }}
                    formatter={(val, name, item) => [`${val}% (${item.payload.kwh} kWh)`, name]}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Legend Table */}
          <div className="grid grid-cols-2 gap-2 text-xs pt-2 border-t border-gray-100">
            {applianceShareData.map((item) => (
              <div key={item.name} className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ backgroundColor: item.color }}></span>
                <span className="truncate text-gray-600 text-[11px] font-medium">{item.name} ({item.value}%)</span>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* AI Energy-Saving Recommendations */}
      <div className="bg-white border border-gray-200/90 rounded-2xl p-5 shadow-sm flex flex-col gap-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-gray-100 pb-3">
          <div className="flex items-center gap-2">
            <div className="p-1.5 bg-amber-50 text-amber-600 rounded-lg">
              <Sparkles size={18} />
            </div>
            <div>
              <h3 className="text-base font-bold text-[#113621]">AI Energy Saving & Tariff Optimization Engine</h3>
              <p className="text-xs text-gray-500">Live dynamic recommendations tailored to your current load and CEB domestic tariff</p>
            </div>
          </div>

          <div className="flex items-center gap-2 px-3 py-1 bg-emerald-50 border border-emerald-200/70 rounded-full w-fit">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            <span className="text-[10px] sm:text-[11px] font-semibold text-emerald-800 tracking-wide">
              LIVE ENGINE ACTIVE • {currentTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5 mt-1">
          {/* Card 1: Time of Use (Peak/Off-Peak Window) */}
          <div className={`border rounded-xl p-4 flex flex-col justify-between transition-all duration-300 ${timeRec.cardStyle}`}>
            <div>
              <div className="flex items-center justify-between gap-2 mb-2">
                <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md border ${timeRec.badgeColor}`}>
                  {timeRec.badge}
                </span>
                <timeRec.icon size={16} className={timeRec.iconColor} />
              </div>
              <h4 className="text-xs font-bold text-[#113621] mb-1">
                {timeRec.title}
              </h4>
              <p className="text-xs text-gray-700 leading-relaxed">
                {timeRec.description}
              </p>
            </div>
            <div className="flex items-center gap-1.5 mt-3 pt-2.5 border-t border-black/5 text-[11px] font-semibold text-[#113621]">
              <TrendingDown size={14} className="text-emerald-600" />
              <span>{timeRec.metric}</span>
            </div>
          </div>

          {/* Card 2: Slab Boundary Guard */}
          <div className={`border rounded-xl p-4 flex flex-col justify-between transition-all duration-300 ${slabRec.cardStyle}`}>
            <div>
              <div className="flex items-center justify-between gap-2 mb-2">
                <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md border ${slabRec.badgeColor}`}>
                  {slabRec.badge}
                </span>
                <slabRec.icon size={16} className={slabRec.iconColor} />
              </div>
              <h4 className="text-xs font-bold text-[#113621] mb-1">
                {slabRec.title}
              </h4>
              <p className="text-xs text-gray-700 leading-relaxed">
                {slabRec.description}
              </p>
            </div>
            <div className="flex items-center gap-1.5 mt-3 pt-2.5 border-t border-black/5 text-[11px] font-semibold text-[#113621]">
              <AlertCircle size={14} className={slabRec.iconColor} />
              <span>{slabRec.metric}</span>
            </div>
          </div>

          {/* Card 3: Real-Time Active Load / Vampire Drain Guard */}
          <div className={`border rounded-xl p-4 flex flex-col justify-between transition-all duration-300 ${loadRec.cardStyle}`}>
            <div>
              <div className="flex items-center justify-between gap-2 mb-2">
                <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md border ${loadRec.badgeColor}`}>
                  {loadRec.badge}
                </span>
                <loadRec.icon size={16} className={loadRec.iconColor} />
              </div>
              <h4 className="text-xs font-bold text-[#113621] mb-1">
                {loadRec.title}
              </h4>
              <p className="text-xs text-gray-700 leading-relaxed">
                {loadRec.description}
              </p>
            </div>
            <div className="flex items-center gap-1.5 mt-3 pt-2.5 border-t border-black/5 text-[11px] font-semibold text-[#113621]">
              <ShieldCheck size={14} className={loadRec.iconColor} />
              <span>{loadRec.action}</span>
            </div>
          </div>
        </div>
      </div>

    </div>
  );
}
