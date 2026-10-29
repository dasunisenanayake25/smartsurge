import React, { useState, useEffect, useContext } from 'react';
import { getSocket } from '../services/socket';
import { 
  Power, 
  Zap, 
  DollarSign, 
  Fan, 
  Refrigerator, 
  Tv, 
  Activity 
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

  const [livePower, setLivePower] = useState(480);
  const [voltage, setVoltage] = useState(230);
  const [current, setCurrent] = useState(2.1);
  const [todayKwh, setTodayKwh] = useState(3.4);
  const [estBill, setEstBill] = useState(1450);
  const [isConnected, setIsConnected] = useState(false);
  const [historyData, setHistoryData] = useState([]);

  const [appliances, setAppliances] = useState([
    { _id: 'ac', name: 'Master AC', category: 'HVAC', ratedWattage: 1200, status: 'ON' },
    { _id: 'fridge', name: 'Smart Fridge', category: 'Kitchen', ratedWattage: 180, status: 'ON' },
    { _id: 'tv', name: 'Living Room TV', category: 'Entertainment', ratedWattage: 95, status: 'OFF' },
  ]);

  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        const liveRes = await API.get('/energy/live');
        if (liveRes.data && liveRes.data.powerWatt > 0) {
          setLivePower(Math.round(liveRes.data.powerWatt));
          setVoltage(liveRes.data.voltage);
          setCurrent(liveRes.data.current);
        }

        const billRes = await API.get('/energy/bill-estimate');
        if (billRes.data) {
          setTodayKwh(billRes.data.consumedKwh || 3.4);
          setEstBill(billRes.data.estimatedCostLkr || 1450);
        }

        const historyRes = await API.get('/energy/history');
        if (historyRes.data && historyRes.data.length > 0) {
          const formatted = historyRes.data.slice(-20).map((log) => ({
            time: new Date(log.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
            watt: Math.round(log.powerWatt),
            voltage: log.voltage,
          }));
          setHistoryData(formatted);
        } else {
          const initialMock = Array.from({ length: 12 }, (_, i) => ({
            time: `${10 + i}:00`,
            watt: 350 + Math.floor(Math.random() * 250),
            voltage: 230,
          }));
          setHistoryData(initialMock);
        }

        const appRes = await API.get('/appliances');
        if (appRes.data && appRes.data.length > 0) {
          setAppliances(appRes.data);
        }
      } catch (err) {
        console.warn('Dashboard initial data fetch warning:', err.message);
      }
    };

    fetchInitialData();
  }, []);

  useEffect(() => {
    const socket = getSocket();

    if (socket.connected) {
      setIsConnected(true);
    }

    socket.on('connect', () => {
      setIsConnected(true);
    });

    socket.on('disconnect', () => {
      setIsConnected(false);
    });

    socket.on('energyUpdate', (data) => {
      if (data && data.powerWatt !== undefined) {
        const roundedWatt = Math.round(data.powerWatt);
        setLivePower(roundedWatt);
        setVoltage(data.voltage);
        setCurrent(data.current);

        if (data.energyKwh) {
          setTodayKwh((prev) => +(prev + data.energyKwh * 0.05).toFixed(2));
        }

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
          return updated.slice(-20);
        });
      }
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  const toggleAppliance = async (appId) => {
    const target = appliances.find((a) => a._id === appId);
    if (!target) return;

    const newStatus = target.status === 'ON' ? 'OFF' : 'ON';

    setAppliances((prev) =>
      prev.map((a) => (a._id === appId ? { ...a, status: newStatus } : a))
    );

    if (appId.length === 24) {
      try {
        await API.put(`/appliances/${appId}`, { status: newStatus });
      } catch (err) {
        console.error('Failed to sync appliance toggle:', err);
      }
    }
  };

  const getApplianceIcon = (name, category, isOn) => {
    const lower = (name + category).toLowerCase();
    if (lower.includes('ac') || lower.includes('condition') || lower.includes('fan')) {
      return <Fan className={isOn ? 'text-cyan-600' : 'text-gray-400'} size={22} />;
    }
    if (lower.includes('fridge') || lower.includes('refriger')) {
      return <Refrigerator className={isOn ? 'text-blue-600' : 'text-gray-400'} size={22} />;
    }
    return <Tv className={isOn ? 'text-purple-600' : 'text-gray-400'} size={22} />;
  };

  return (
    <div className="h-full overflow-hidden flex flex-col p-4 sm:p-6 relative z-10 w-full max-w-7xl mx-auto gap-4">
      <header className="flex justify-between items-end pb-2 flex-shrink-0">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-[#113621] dark:text-emerald-100">
            Smart Dashboard
          </h1>
          <p className="text-gray-500 mt-0.5 font-medium text-xs md:text-sm">
            Welcome back, <span className="text-[#10331e] dark:text-[#0b2415] font-bold">{user?.name || 'Home Owner'}</span>
          </p>
        </div>

        <div className="text-right hidden sm:flex flex-col items-end">
          <p className="text-xs md:text-sm font-semibold text-gray-600">
            {new Date().toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric' })}
          </p>
          <div className="flex items-center gap-1.5 mt-1 bg-white border border-gray-200 px-3 py-1 rounded-full shadow-2xs">
            <span className={`w-2 h-2 rounded-full ${isConnected ? 'bg-emerald-500 animate-pulse' : 'bg-red-400'}`}></span>
            <p className={`text-xs font-semibold ${isConnected ? 'text-emerald-700' : 'text-gray-500'}`}>
              {isConnected ? 'IoT Stream: Live' : 'Connecting Stream...'}
            </p>
          </div>
        </div>
      </header>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 flex-shrink-0">
        <div className="bg-white border border-gray-200/90 rounded-2xl p-4 shadow-sm hover:shadow-md transition">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <Zap size={20} className="text-blue-600" />
              <h3 className="text-sm font-semibold text-gray-700">Live Power</h3>
            </div>
            <span className="text-xs text-blue-700 font-mono font-medium">
              {voltage}V · {current}A
            </span>
          </div>
          <p className="text-3xl md:text-4xl font-bold tracking-tight text-[#113621] dark:text-emerald-100 font-mono">
            {livePower} <span className="text-base text-gray-500 font-normal">W</span>
          </p>
        </div>

        <div className="bg-white border border-gray-200/90 rounded-2xl p-4 shadow-sm hover:shadow-md transition">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <Power size={20} className="text-emerald-600" />
              <h3 className="text-sm font-semibold text-gray-700">Today's Usage</h3>
            </div>
            <span className="text-xs text-emerald-700 font-medium">
              Units
            </span>
          </div>
          <p className="text-3xl md:text-4xl font-bold tracking-tight text-[#113621] dark:text-emerald-100 font-mono">
            {todayKwh} <span className="text-base text-gray-500 font-normal">kWh</span>
          </p>
        </div>

        <div className="bg-white border border-gray-200/90 rounded-2xl p-4 shadow-sm hover:shadow-md transition">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <DollarSign size={20} className="text-amber-600" />
              <h3 className="text-sm font-semibold text-gray-700">Est. Bill</h3>
            </div>
            <span className="text-xs text-amber-700 font-medium">
              Monthly
            </span>
          </div>
          <p className="text-3xl md:text-4xl font-bold tracking-tight text-[#113621] dark:text-emerald-100 font-mono">
            <span className="text-lg font-sans text-[#236144] mr-1">Rs.</span>
            {estBill.toLocaleString()}
          </p>
        </div>
      </div>

      <div className="bg-white border border-gray-200/90 rounded-2xl p-4 shadow-sm flex-1 flex flex-col min-h-0">
        <div className="flex items-center justify-between mb-2 flex-shrink-0">
          <div className="flex items-center gap-2">
            <Activity className="text-[#236144]" size={18} />
            <h3 className="text-base font-semibold text-[#113621] dark:text-emerald-100">Live Energy Stream</h3>
          </div>
          <div className="flex items-center gap-2 text-xs text-gray-500 font-medium">
            <span className="flex items-center gap-1">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-500"></span>
              Wattage (W)
            </span>
          </div>
        </div>

        <div className="w-full flex-1 min-h-[140px]">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={historyData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="wattGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.35} />
                  <stop offset="95%" stopColor="#f59e0b" stopOpacity={0.0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
              <XAxis 
                dataKey="time" 
                stroke="#94a3b8" 
                tick={{ fill: '#64748b', fontSize: 10 }}
                tickLine={false}
              />
              <YAxis 
                stroke="#94a3b8" 
                tick={{ fill: '#64748b', fontSize: 10 }}
                tickLine={false}
                domain={['auto', 'auto']}
              />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: '#ffffff', 
                  border: '1px solid #e2e8f0',
                  borderRadius: '12px',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
                  color: '#0f172a',
                  fontSize: '12px',
                  fontWeight: 600
                }}
                formatter={(val) => [`${val} W`, 'Power Usage']}
              />
              <Area 
                type="monotone" 
                dataKey="watt" 
                stroke="#d97706" 
                strokeWidth={2.5}
                fillOpacity={1} 
                fill="url(#wattGradient)" 
                isAnimationActive={false}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="flex-shrink-0">
        <h2 className="text-base font-semibold text-[#113621] dark:text-emerald-100 mb-2.5 flex items-center justify-between">
          <span>Smart Appliances</span>
          <span className="text-xs text-gray-500 font-normal">Real-Time Control</span>
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {appliances.map((app) => {
            const isOn = app.status === 'ON';
            return (
              <div 
                key={app._id}
                className="bg-white border border-gray-200/90 hover:border-gray-300 transition-all rounded-2xl p-3.5 shadow-sm hover:shadow-md flex justify-between items-center"
              >
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-gray-50 border border-gray-100 rounded-xl">
                    {getApplianceIcon(app.name, app.category, isOn)}
                  </div>
                  <div>
                    <h4 className="font-semibold text-sm text-[#113621] dark:text-emerald-100 leading-tight">{app.name}</h4>
                    <p className="text-[11px] text-gray-500 mt-0.5">{app.ratedWattage} W</p>
                  </div>
                </div>
                
                <button 
                  type="button"
                  onClick={() => toggleAppliance(app._id)}
                  aria-label={`Toggle ${app.name}`}
                  className={`w-12 h-6 rounded-full relative cursor-pointer transition-colors duration-300 ${isOn ? 'bg-[#236144]' : 'bg-gray-300'}`}
                >
                  <span className={`w-4 h-4 bg-white rounded-full absolute top-[4px] transition-all duration-300 shadow-md ${isOn ? 'left-[26px]' : 'left-[3px]'}`}></span>
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
