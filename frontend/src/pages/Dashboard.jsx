import React, { useState, useEffect, useContext } from 'react';
import { io } from 'socket.io-client';
import { 
  Power, 
  Zap, 
  DollarSign, 
  Fan, 
  Refrigerator, 
  Tv, 
  Activity, 
  Radio,
  Flame,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { 
  ResponsiveContainer, 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  Tooltip, 
  CartesianGrid 
} from 'recharts';
import { AuthContext } from '../context/AuthContext';
import API from '../services/api';

const Dashboard = () => {
  const { user } = useContext(AuthContext);

  // Real-time telemetry state
  const [livePower, setLivePower] = useState(480);
  const [voltage, setVoltage] = useState(230);
  const [current, setCurrent] = useState(2.1);
  const [todayKwh, setTodayKwh] = useState(3.4);
  const [estBill, setEstBill] = useState(1450);
  const [isConnected, setIsConnected] = useState(false);
  const [historyData, setHistoryData] = useState([]);

  // Smart Appliances state
  const [appliances, setAppliances] = useState([
    { _id: 'ac', name: 'Master AC', category: 'HVAC', ratedWattage: 1200, status: 'ON' },
    { _id: 'fridge', name: 'Smart Fridge', category: 'Kitchen', ratedWattage: 180, status: 'ON' },
    { _id: 'tv', name: 'Living Room TV', category: 'Entertainment', ratedWattage: 95, status: 'OFF' },
  ]);

  // 1. Initial Data Fetch (APIs)
  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        // Fetch Live baseline
        const liveRes = await API.get('/energy/live');
        if (liveRes.data && liveRes.data.powerWatt > 0) {
          setLivePower(Math.round(liveRes.data.powerWatt));
          setVoltage(liveRes.data.voltage);
          setCurrent(liveRes.data.current);
        }

        // Fetch Bill & Consumption Estimate
        const billRes = await API.get('/energy/bill-estimate');
        if (billRes.data) {
          setTodayKwh(billRes.data.consumedKwh || 3.4);
          setEstBill(billRes.data.estimatedCostLkr || 1450);
        }

        // Fetch Historical Chart Logs
        const historyRes = await API.get('/energy/history');
        if (historyRes.data && historyRes.data.length > 0) {
          const formatted = historyRes.data.slice(-20).map((log) => ({
            time: new Date(log.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
            watt: Math.round(log.powerWatt),
            voltage: log.voltage,
          }));
          setHistoryData(formatted);
        } else {
          // Initialize mock curve if DB is fresh
          const initialMock = Array.from({ length: 12 }, (_, i) => ({
            time: `${10 + i}:00`,
            watt: 350 + Math.floor(Math.random() * 250),
            voltage: 230,
          }));
          setHistoryData(initialMock);
        }

        // Fetch User Appliances from DB
        const appRes = await API.get('/appliances');
        if (appRes.data && appRes.data.length > 0) {
          setAppliances(appRes.data);
        }
      } catch (err) {
        console.warn('[Dashboard API Warning]:', err.message);
      }
    };

    fetchInitialData();
  }, []);

  // 2. Socket.io Live Stream Connection
  useEffect(() => {
    const socket = io('http://localhost:5000', {
      transports: ['websocket', 'polling'],
      reconnectionAttempts: 5,
    });

    socket.on('connect', () => {
      console.log('[Socket.io] Connected to SmartSurge Live Stream!');
      setIsConnected(true);
    });

    socket.on('disconnect', () => {
      console.log('[Socket.io] Disconnected from stream');
      setIsConnected(false);
    });

    // Listen to real-time IoT Telemetry Broadcasts
    socket.on('energyUpdate', (data) => {
      if (data && data.powerWatt !== undefined) {
        const roundedWatt = Math.round(data.powerWatt);
        setLivePower(roundedWatt);
        setVoltage(data.voltage);
        setCurrent(data.current);

        // Update Today's kWh accumulator
        if (data.energyKwh) {
          setTodayKwh((prev) => +(prev + data.energyKwh * 0.05).toFixed(2));
        }

        // Stream into Recharts Real-Time Flow
        setHistoryData((prev) => {
          const timeLabel = new Date(data.timestamp || Date.now()).toLocaleTimeString([], { 
            hour: '2-digit', 
            minute: '2-digit', 
            second: '2-digit' 
          });
          const newPoint = {
            time: timeLabel,
            watt: roundedWatt,
            voltage: data.voltage,
          };
          const updated = [...prev, newPoint];
          return updated.slice(-20); // Keep last 20 real-time snapshots
        });
      }
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  // 3. Appliance Toggle Handler
  const toggleAppliance = async (appId) => {
    const target = appliances.find((a) => a._id === appId);
    if (!target) return;

    const newStatus = target.status === 'ON' ? 'OFF' : 'ON';

    // Optimistic UI Update
    setAppliances((prev) =>
      prev.map((a) => (a._id === appId ? { ...a, status: newStatus } : a))
    );

    // Persist to Backend API if it's a real MongoDB ID
    if (appId.length === 24) {
      try {
        await API.put(`/appliances/${appId}`, { status: newStatus });
      } catch (err) {
        console.error('Failed to sync appliance toggle:', err);
      }
    }
  };

  // Helper Icon Resolver
  const getApplianceIcon = (name, category, isOn) => {
    const lower = (name + category).toLowerCase();
    const colorClass = isOn ? 'text-amber-300' : 'text-gray-400';
    if (lower.includes('ac') || lower.includes('condition') || lower.includes('fan')) {
      return <Fan className={isOn ? 'text-cyan-400' : 'text-gray-400'} size={22} />;
    }
    if (lower.includes('fridge') || lower.includes('refriger')) {
      return <Refrigerator className={isOn ? 'text-blue-300' : 'text-gray-400'} size={22} />;
    }
    return <Tv className={isOn ? 'text-purple-400' : 'text-gray-400'} size={22} />;
  };

  return (
    <div className="h-full overflow-hidden flex flex-col p-4 relative z-10 w-full max-w-7xl mx-auto gap-3.5">
        
      {/* Header Area */}
      <header className="flex justify-between items-end text-white border-b border-white/10 pb-2.5 flex-shrink-0">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold tracking-wide drop-shadow-lg flex items-center gap-2">
            Smart Dashboard
          </h1>
          <p className="text-gray-200 mt-0.5 font-medium text-xs md:text-sm">
            Welcome back, <span className="text-amber-200 font-semibold">{user?.name || 'Home Owner'}</span>
          </p>
        </div>

        {/* Live Socket.io Indicator */}
        <div className="text-right hidden sm:flex flex-col items-end">
          <p className="text-sm font-semibold drop-shadow-md text-gray-200">
            {new Date().toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric' })}
          </p>
          <div className="flex items-center gap-1.5 mt-0.5">
            <span className={`w-2 h-2 rounded-full ${isConnected ? 'bg-emerald-400 animate-pulse shadow-[0_0_8px_#34d399]' : 'bg-red-400'}`}></span>
            <p className={`text-xs font-medium ${isConnected ? 'text-emerald-300' : 'text-gray-400'}`}>
              {isConnected ? 'IoT Stream: Live' : 'Connecting Stream...'}
            </p>
          </div>
        </div>
      </header>

      {/* Top Cards Row (Glassmorphism Metric Cards) */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5 flex-shrink-0">
        
        {/* Card 1: Live Power */}
        <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-4 text-white shadow-[0_4px_16px_0_rgba(0,0,0,0.3)] transition hover:border-white/30">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2.5">
              <div className="p-2 bg-blue-500/30 rounded-xl border border-blue-400/30">
                <Zap className="text-blue-300" size={18} />
              </div>
              <h3 className="text-sm font-medium text-gray-200 drop-shadow-sm">Live Power</h3>
            </div>
            <span className="text-[11px] px-2 py-0.5 rounded-full bg-blue-500/20 text-blue-200 border border-blue-400/20 font-mono">
              {voltage}V · {current}A
            </span>
          </div>
          <p className="text-3xl md:text-4xl font-bold drop-shadow-md tracking-tight font-mono">
            {livePower} <span className="text-base text-gray-300 font-normal">W</span>
          </p>
        </div>

        {/* Card 2: Today's Usage */}
        <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-4 text-white shadow-[0_4px_16px_0_rgba(0,0,0,0.3)] transition hover:border-white/30">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2.5">
              <div className="p-2 bg-emerald-500/30 rounded-xl border border-emerald-400/30">
                <Power className="text-emerald-300" size={18} />
              </div>
              <h3 className="text-sm font-medium text-gray-200 drop-shadow-sm">Today's Usage</h3>
            </div>
            <span className="text-[11px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-200 border border-emerald-400/20">
              Units
            </span>
          </div>
          <p className="text-3xl md:text-4xl font-bold drop-shadow-md tracking-tight font-mono">
            {todayKwh} <span className="text-base text-gray-300 font-normal">kWh</span>
          </p>
        </div>

        {/* Card 3: Est. Bill (Sri Lankan Slab calculation) */}
        <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-4 text-white shadow-[0_4px_16px_0_rgba(0,0,0,0.3)] transition hover:border-white/30">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2.5">
              <div className="p-2 bg-amber-500/30 rounded-xl border border-amber-400/30">
                <DollarSign className="text-amber-300" size={18} />
              </div>
              <h3 className="text-sm font-medium text-gray-200 drop-shadow-sm">Est. Bill</h3>
            </div>
            <span className="text-[11px] px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-200 border border-amber-400/20">
              Monthly
            </span>
          </div>
          <p className="text-3xl md:text-4xl font-bold drop-shadow-md tracking-tight font-mono">
            <span className="text-lg font-sans text-amber-200 mr-1">Rs.</span>
            {estBill.toLocaleString()}
          </p>
        </div>

      </div>

      {/* Middle Row - Recharts Live Stream Analytics (Dynamically fills available height) */}
      <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-4 text-white shadow-[0_4px_16px_0_rgba(0,0,0,0.3)] flex-1 flex flex-col min-h-0">
        
        {/* Chart Header */}
        <div className="flex items-center justify-between mb-2 flex-shrink-0">
          <div className="flex items-center gap-2">
            <Activity className="text-amber-300" size={18} />
            <h3 className="text-base font-semibold drop-shadow-sm">Live Energy Stream</h3>
          </div>
          <div className="flex items-center gap-2 text-xs text-gray-300">
            <span className="flex items-center gap-1">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-400"></span>
              Wattage (W)
            </span>
          </div>
        </div>

        {/* Responsive Area Chart Container */}
        <div className="w-full flex-1 min-h-[140px]">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={historyData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="wattGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.6} />
                  <stop offset="95%" stopColor="#f59e0b" stopOpacity={0.0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" vertical={false} />
              <XAxis 
                dataKey="time" 
                stroke="rgba(255,255,255,0.5)" 
                tick={{ fill: 'rgba(255,255,255,0.6)', fontSize: 10 }}
                tickLine={false}
              />
              <YAxis 
                stroke="rgba(255,255,255,0.5)" 
                tick={{ fill: 'rgba(255,255,255,0.6)', fontSize: 10 }}
                tickLine={false}
                domain={['auto', 'auto']}
              />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'rgba(15, 23, 42, 0.9)', 
                  border: '1px solid rgba(255,255,255,0.2)',
                  borderRadius: '12px',
                  backdropFilter: 'blur(8px)',
                  color: '#fff',
                  fontSize: '12px'
                }}
                formatter={(val) => [`${val} W`, 'Power Usage']}
              />
              <Area 
                type="monotone" 
                dataKey="watt" 
                stroke="#fbbf24" 
                strokeWidth={2.5}
                fillOpacity={1} 
                fill="url(#wattGradient)" 
                isAnimationActive={false}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>

      </div>

      {/* Bottom Row - Smart Appliance Toggles */}
      <div className="flex-shrink-0">
        <h2 className="text-base font-semibold text-white mb-2.5 drop-shadow-md flex items-center justify-between">
          <span>Smart Appliances</span>
          <span className="text-xs text-gray-300 font-normal">Real-Time Control</span>
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {appliances.map((app) => {
            const isOn = app.status === 'ON';
            return (
              <div 
                key={app._id}
                className="bg-black/20 backdrop-blur-md border border-white/10 hover:border-white/30 transition-all rounded-2xl p-3.5 text-white shadow-lg flex justify-between items-center"
              >
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-white/10 rounded-xl">
                    {getApplianceIcon(app.name, app.category, isOn)}
                  </div>
                  <div>
                    <h4 className="font-semibold text-sm leading-tight">{app.name}</h4>
                    <p className="text-[11px] text-gray-300 mt-0.5">{app.ratedWattage} W</p>
                  </div>
                </div>
                
                {/* Switch Toggle */}
                <button 
                  type="button"
                  onClick={() => toggleAppliance(app._id)}
                  aria-label={`Toggle ${app.name}`}
                  className={`w-12 h-6 rounded-full relative cursor-pointer transition-colors duration-300 border border-white/20 ${isOn ? 'bg-emerald-500/90' : 'bg-gray-600/50'}`}
                >
                  <span className={`w-4 h-4 bg-white rounded-full absolute top-[3px] transition-all duration-300 shadow-md ${isOn ? 'left-[25px]' : 'left-[3px]'}`}></span>
                </button>
              </div>
            );
          })}
        </div>
      </div>

    </div>
  );
};

export default Dashboard;
