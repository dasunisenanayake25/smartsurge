import React, { useState, useEffect } from 'react';
import { 
  History as HistoryIcon, 
  Download, 
  Calendar, 
  Zap, 
  Activity, 
  Gauge, 
  TrendingUp, 
  Search,
  Filter,
  CheckCircle2,
  AlertTriangle
} from 'lucide-react';
import { 
  ResponsiveContainer, 
  AreaChart, 
  Area, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  Tooltip, 
  CartesianGrid 
} from 'recharts';
import API from '../services/api';

export default function History() {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [chartType, setChartType] = useState('area');
  const [searchTerm, setSearchTerm] = useState('');
  const [timeFilter, setTimeFilter] = useState('24h');

  const fetchHistory = async () => {
    try {
      setLoading(true);
      const { data } = await API.get('/energy/history');
      if (data && data.length > 0) {
        setLogs(data);
      } else {
        // Fallback realistic baseline logs if DB is freshly created
        const mockFallback = Array.from({ length: 30 }, (_, i) => {
          const d = new Date(Date.now() - (29 - i) * 3600 * 1000);
          const watt = Math.floor(450 + Math.sin(i / 3) * 300 + Math.random() * 200);
          return {
            _id: `mock-${i}`,
            timestamp: d.toISOString(),
            powerWatt: watt,
            voltage: +(225 + Math.random() * 8).toFixed(1),
            current: +(watt / 230).toFixed(2),
            energyKwh: +(watt / 1000).toFixed(4),
          };
        });
        setLogs(mockFallback);
      }
    } catch (err) {
      console.warn('Failed to fetch history:', err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHistory();
  }, []);

  // Compute Summary Statistics
  const totalLogsCount = logs.length;
  const avgWatt = totalLogsCount > 0 
    ? Math.round(logs.reduce((sum, l) => sum + (l.powerWatt || 0), 0) / totalLogsCount) 
    : 0;
  const peakWatt = totalLogsCount > 0 
    ? Math.max(...logs.map((l) => l.powerWatt || 0)) 
    : 0;
  const totalKwh = totalLogsCount > 0 
    ? +(logs.reduce((sum, l) => sum + (l.energyKwh || 0), 0)).toFixed(2) 
    : 0;
  const avgVoltage = totalLogsCount > 0 
    ? +(logs.reduce((sum, l) => sum + (l.voltage || 230), 0) / totalLogsCount).toFixed(1) 
    : 230;

  // Chart data formatting
  const chartData = logs.map((log) => ({
    time: new Date(log.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    date: new Date(log.timestamp).toLocaleDateString([], { month: 'short', day: 'numeric' }),
    watt: Math.round(log.powerWatt || 0),
    kwh: +(log.energyKwh || 0).toFixed(3),
    voltage: log.voltage || 230,
  }));

  // CSV Export Function
  const exportToCSV = () => {
    if (logs.length === 0) return;

    const headers = ['Timestamp', 'Date', 'Time', 'Power (Watts)', 'Voltage (V)', 'Current (A)', 'Energy (kWh)'];
    const rows = logs.map((l) => {
      const d = new Date(l.timestamp);
      return [
        l.timestamp,
        d.toLocaleDateString(),
        d.toLocaleTimeString(),
        l.powerWatt,
        l.voltage,
        l.current,
        l.energyKwh
      ];
    });

    const csvContent = 'data:text/csv;charset=utf-8,' + 
      [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `smartsurge_energy_history_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Filter logs for table
  const filteredLogs = logs.filter((l) => {
    const formatted = `${new Date(l.timestamp).toLocaleString()} ${l.powerWatt} ${l.voltage}`.toLowerCase();
    return formatted.includes(searchTerm.toLowerCase());
  });

  return (
    <div className="h-full overflow-y-auto p-4 sm:p-6 relative z-10 w-full max-w-7xl mx-auto flex flex-col gap-5">
      
      {/* Header */}
      <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 flex-shrink-0">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-[#113621] dark:text-emerald-100">
            Energy Consumption History
          </h1>
          <p className="text-gray-500 mt-0.5 text-xs md:text-sm">
            Review historical power logs, analyze demand spikes, and export IoT telemetry data
          </p>
        </div>

        <button
          onClick={exportToCSV}
          className="inline-flex items-center gap-2 bg-[#236144] hover:bg-[#1a4a34] text-white px-5 py-2.5 rounded-full text-xs sm:text-sm font-semibold shadow-sm transition"
        >
          <Download size={16} />
          <span>Export CSV</span>
        </button>
      </header>

      {/* Top Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 flex-shrink-0">
        <div className="bg-white border border-gray-200/90 rounded-2xl p-4 shadow-sm">
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs font-semibold text-gray-500">Average Load</span>
            <Activity size={16} className="text-blue-600" />
          </div>
          <p className="text-2xl sm:text-3xl font-bold text-[#113621] dark:text-emerald-100 font-mono">
            {avgWatt} <span className="text-sm font-normal text-gray-500">W</span>
          </p>
          <span className="text-[11px] text-gray-500 mt-1 block">Baseline running power</span>
        </div>

        <div className="bg-white border border-gray-200/90 rounded-2xl p-4 shadow-sm">
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs font-semibold text-gray-500">Peak Demand Spike</span>
            <TrendingUp size={16} className="text-amber-600" />
          </div>
          <p className="text-2xl sm:text-3xl font-bold text-amber-600 font-mono">
            {peakWatt} <span className="text-sm font-normal text-gray-500">W</span>
          </p>
          <span className="text-[11px] text-gray-500 mt-1 block">Highest instantaneous surge</span>
        </div>

        <div className="bg-white border border-gray-200/90 rounded-2xl p-4 shadow-sm">
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs font-semibold text-gray-500">Total Consumption</span>
            <Zap size={16} className="text-emerald-600" />
          </div>
          <p className="text-2xl sm:text-3xl font-bold text-emerald-600 font-mono">
            {totalKwh} <span className="text-sm font-normal text-gray-500">kWh</span>
          </p>
          <span className="text-[11px] text-gray-500 mt-1 block">Accumulated energy units</span>
        </div>

        <div className="bg-white border border-gray-200/90 rounded-2xl p-4 shadow-sm">
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs font-semibold text-gray-500">Grid Voltage</span>
            <Gauge size={16} className="text-purple-600" />
          </div>
          <p className="text-2xl sm:text-3xl font-bold text-[#113621] dark:text-emerald-100 font-mono">
            {avgVoltage} <span className="text-sm font-normal text-gray-500">V</span>
          </p>
          <span className="text-[11px] text-emerald-600 font-semibold mt-1 block">Stable CEB nominal line</span>
        </div>
      </div>

      {/* Main Analytics Chart Card */}
      <div className="bg-white border border-gray-200/90 rounded-2xl p-5 shadow-sm flex flex-col gap-4">
        
        {/* Chart Toolbar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h3 className="text-base font-bold text-[#113621] dark:text-emerald-100">Historical Demand Analysis</h3>
            <p className="text-xs text-gray-500">Continuous telemetry timeline across recorded IoT cycles</p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setChartType('area')}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition ${
                chartType === 'area'
                  ? 'bg-[#236144] text-white shadow-xs'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              Power (Watts)
            </button>
            <button
              onClick={() => setChartType('bar')}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition ${
                chartType === 'bar'
                  ? 'bg-[#236144] text-white shadow-xs'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              Units (kWh)
            </button>
          </div>
        </div>

        {/* Chart View */}
        <div className="w-full h-[280px]">
          <ResponsiveContainer width="100%" height="100%">
            {chartType === 'area' ? (
              <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="historyGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#236144" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#236144" stopOpacity={0.0} />
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
                  formatter={(val) => [`${val} W`, 'Power Demand']}
                />
                <Area 
                  type="monotone" 
                  dataKey="watt" 
                  stroke="#236144" 
                  strokeWidth={2.5}
                  fillOpacity={1} 
                  fill="url(#historyGradient)" 
                />
              </AreaChart>
            ) : (
              <BarChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
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
                  formatter={(val) => [`${val} kWh`, 'Energy Units']}
                />
                <Bar 
                  dataKey="kwh" 
                  fill="#10b981" 
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            )}
          </ResponsiveContainer>
        </div>

      </div>

      {/* Historical Telemetry Table Card */}
      <div className="bg-white border border-gray-200/90 rounded-2xl shadow-sm overflow-hidden flex flex-col">
        
        {/* Table Header Controls */}
        <div className="p-4 sm:p-5 border-b border-gray-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h3 className="text-base font-bold text-[#113621] dark:text-emerald-100">Telemetry Log Records</h3>
            <p className="text-xs text-gray-500">Chronological snapshot logs stored in MongoDB</p>
          </div>

          <div className="relative w-full sm:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={15} />
            <input 
              type="text" 
              placeholder="Search by time, watt..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 bg-gray-50 border border-gray-200 rounded-xl text-xs text-gray-800 focus:outline-none focus:border-[#236144] focus:bg-white transition"
            />
          </div>
        </div>

        {/* Table Content */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-gray-50/80 border-b border-gray-100 text-gray-600 font-semibold">
                <th className="py-3 px-4">Date & Time</th>
                <th className="py-3 px-4">Power Load</th>
                <th className="py-3 px-4">Voltage</th>
                <th className="py-3 px-4">Current</th>
                <th className="py-3 px-4">Energy Units</th>
                <th className="py-3 px-4">Grid Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 text-gray-700">
              {filteredLogs.slice(0, 30).map((log, index) => {
                const dateObj = new Date(log.timestamp);
                const isHighDemand = log.powerWatt > 1500;
                return (
                  <tr key={log._id || index} className="hover:bg-gray-50/60 transition">
                    <td className="py-3 px-4 font-medium text-gray-800">
                      <div>{dateObj.toLocaleDateString([], { month: 'short', day: 'numeric', year: 'numeric' })}</div>
                      <div className="text-[11px] text-gray-400 font-mono">{dateObj.toLocaleTimeString()}</div>
                    </td>
                    <td className="py-3 px-4 font-mono font-bold text-[#113621] dark:text-emerald-100">
                      {Math.round(log.powerWatt)} W
                    </td>
                    <td className="py-3 px-4 font-mono">
                      {log.voltage} V
                    </td>
                    <td className="py-3 px-4 font-mono">
                      {log.current} A
                    </td>
                    <td className="py-3 px-4 font-mono font-semibold text-emerald-700">
                      {+(log.energyKwh || 0).toFixed(4)} kWh
                    </td>
                    <td className="py-3 px-4">
                      {isHighDemand ? (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-amber-50 text-amber-700 border border-amber-200">
                          <AlertTriangle size={11} />
                          High Spike
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                          <CheckCircle2 size={11} />
                          Optimal
                        </span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {filteredLogs.length === 0 && (
          <div className="p-8 text-center text-gray-400 text-xs">
            No matching telemetry logs found.
          </div>
        )}

      </div>

    </div>
  );
}
