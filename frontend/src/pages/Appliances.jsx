import React, { useState, useEffect } from 'react';
import { 
  Plus, 
  Trash2, 
  Power, 
  Fan, 
  Refrigerator, 
  Tv, 
  Lightbulb, 
  Cpu, 
  Zap, 
  CheckCircle2, 
  X,
  Sliders,
  DollarSign
} from 'lucide-react';
import API from '../services/api';

export default function Appliances() {
  const [appliances, setAppliances] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState('All');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    category: 'AC',
    ratedWattage: '',
    isSmartPlugConnected: true,
  });

  const categories = ['All', 'AC', 'Refrigerator', 'Washing Machine', 'TV', 'Lighting', 'Other'];

  const fetchAppliances = async () => {
    try {
      const { data } = await API.get('/appliances');
      setAppliances(data);
    } catch (err) {
      console.warn('Failed to fetch appliances:', err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAppliances();
  }, []);

  const toggleAppliance = async (id, currentStatus) => {
    const newStatus = currentStatus === 'ON' ? 'OFF' : 'ON';
    setAppliances((prev) =>
      prev.map((app) => (app._id === id ? { ...app, status: newStatus } : app))
    );

    try {
      await API.put(`/appliances/${id}`, { status: newStatus });
    } catch (err) {
      console.error('Failed to toggle appliance:', err);
      fetchAppliances();
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this appliance?')) return;
    try {
      await API.delete(`/appliances/${id}`);
      setAppliances((prev) => prev.filter((app) => app._id !== id));
    } catch (err) {
      console.error('Failed to delete appliance:', err);
    }
  };

  const handleAddSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.ratedWattage) return;

    try {
      const { data } = await API.post('/appliances', {
        name: formData.name,
        category: formData.category,
        ratedWattage: Number(formData.ratedWattage),
        isSmartPlugConnected: formData.isSmartPlugConnected,
      });
      setAppliances((prev) => [...prev, data]);
      setIsModalOpen(false);
      setFormData({
        name: '',
        category: 'AC',
        ratedWattage: '',
        isSmartPlugConnected: true,
      });
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to add appliance');
    }
  };

  const getCategoryIcon = (category, isOn) => {
    const color = isOn ? 'text-[#236144]' : 'text-gray-400';
    switch (category) {
      case 'AC':
        return <Fan size={22} className={color} />;
      case 'Refrigerator':
        return <Refrigerator size={22} className={color} />;
      case 'TV':
        return <Tv size={22} className={color} />;
      case 'Lighting':
        return <Lightbulb size={22} className={color} />;
      default:
        return <Cpu size={22} className={color} />;
    }
  };

  const activeAppliances = appliances.filter((a) => a.status === 'ON');
  const activeLoad = activeAppliances.reduce((sum, a) => sum + (a.ratedWattage || 0), 0);
  const hourlyCostEst = +((activeLoad / 1000) * 35).toFixed(2);

  const filteredAppliances = activeCategory === 'All'
    ? appliances
    : appliances.filter((a) => a.category === activeCategory);

  return (
    <div className="h-full overflow-y-auto p-4 sm:p-6 relative z-10 w-full max-w-7xl mx-auto flex flex-col gap-5">
      <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-200/80 pb-4 flex-shrink-0">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-[#113621]">
            Smart Appliances
          </h1>
          <p className="text-gray-500 mt-0.5 text-xs md:text-sm">
            Control, schedule, and track individual household device power consumption
          </p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="inline-flex items-center gap-2 bg-[#236144] hover:bg-[#1a4a34] text-white px-5 py-2.5 rounded-full text-xs sm:text-sm font-semibold shadow-sm transition"
        >
          <Plus size={16} />
          <span>Add Appliance</span>
        </button>
      </header>

      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 flex-shrink-0">
        <div className="bg-white border border-gray-200/90 rounded-2xl p-4 shadow-sm">
          <span className="text-xs font-semibold text-gray-500 block mb-1">Total Devices</span>
          <p className="text-2xl sm:text-3xl font-bold text-[#113621] font-mono">
            {appliances.length}
          </p>
        </div>

        <div className="bg-white border border-gray-200/90 rounded-2xl p-4 shadow-sm">
          <span className="text-xs font-semibold text-gray-500 block mb-1">Active Now</span>
          <p className="text-2xl sm:text-3xl font-bold text-emerald-600 font-mono">
            {activeAppliances.length}
          </p>
        </div>

        <div className="bg-white border border-gray-200/90 rounded-2xl p-4 shadow-sm">
          <span className="text-xs font-semibold text-gray-500 block mb-1">Active Load</span>
          <p className="text-2xl sm:text-3xl font-bold text-[#113621] font-mono">
            {activeLoad} <span className="text-sm font-normal text-gray-500">W</span>
          </p>
        </div>

        <div className="bg-white border border-gray-200/90 rounded-2xl p-4 shadow-sm">
          <span className="text-xs font-semibold text-gray-500 block mb-1">Est. Hourly Cost</span>
          <p className="text-2xl sm:text-3xl font-bold text-[#113621] font-mono">
            <span className="text-base font-sans text-[#236144] mr-1">Rs.</span>
            {hourlyCostEst}
          </p>
        </div>
      </div>

      <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1 flex-shrink-0">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`px-4 py-1.5 rounded-full text-xs font-medium transition flex-shrink-0 ${
              activeCategory === cat
                ? 'bg-[#236144] text-white shadow-xs'
                : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-50'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="flex-1 flex items-center justify-center p-12 text-gray-400 text-sm">
          Loading smart appliances...
        </div>
      ) : filteredAppliances.length === 0 ? (
        <div className="flex-1 bg-white border border-dashed border-gray-300 rounded-3xl p-12 flex flex-col items-center justify-center text-center">
          <div className="w-14 h-14 rounded-full bg-emerald-50 text-[#236144] flex items-center justify-center mb-3">
            <Sliders size={26} />
          </div>
          <h3 className="text-lg font-bold text-[#113621] mb-1">No appliances found</h3>
          <p className="text-xs sm:text-sm text-gray-500 max-w-sm mb-5">
            Add your air conditioner, refrigerator, TV, or smart plugs to monitor and schedule energy.
          </p>
          <button
            onClick={() => setIsModalOpen(true)}
            className="inline-flex items-center gap-2 bg-[#236144] hover:bg-[#1a4a34] text-white px-5 py-2.5 rounded-full text-xs sm:text-sm font-semibold shadow-sm transition"
          >
            <Plus size={16} />
            <span>Add First Appliance</span>
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 pb-6">
          {filteredAppliances.map((app) => {
            const isOn = app.status === 'ON';
            return (
              <div
                key={app._id}
                className="bg-white border border-gray-200/90 rounded-2xl p-5 shadow-sm hover:shadow-md transition flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2.5">
                      <div className={`p-2.5 rounded-xl border ${isOn ? 'bg-emerald-50 border-emerald-100' : 'bg-gray-50 border-gray-100'}`}>
                        {getCategoryIcon(app.category, isOn)}
                      </div>
                      <span className="text-[11px] font-semibold text-gray-500 px-2.5 py-0.5 rounded-full bg-gray-100">
                        {app.category}
                      </span>
                    </div>

                    <button
                      onClick={() => handleDelete(app._id)}
                      className="text-gray-400 hover:text-red-500 p-1.5 rounded-lg transition"
                      title="Delete appliance"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>

                  <h3 className="text-base font-bold text-[#113621] mb-1">{app.name}</h3>
                  <div className="flex items-center gap-2 text-xs text-gray-500 mb-4">
                    <span className="font-mono font-medium text-gray-700">{app.ratedWattage} W</span>
                    <span>•</span>
                    <span>{app.isSmartPlugConnected ? 'Smart Plug Linked' : 'Direct Meter'}</span>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                  <span className={`text-xs font-semibold flex items-center gap-1.5 ${isOn ? 'text-emerald-700' : 'text-gray-400'}`}>
                    <span className={`w-2 h-2 rounded-full ${isOn ? 'bg-emerald-500 animate-pulse' : 'bg-gray-300'}`}></span>
                    {isOn ? 'Active (Running)' : 'Standby (Off)'}
                  </span>

                  <button
                    type="button"
                    onClick={() => toggleAppliance(app._id, app.status)}
                    className={`w-12 h-6 rounded-full relative cursor-pointer transition-colors duration-300 ${isOn ? 'bg-[#236144]' : 'bg-gray-300'}`}
                  >
                    <span className={`w-4 h-4 bg-white rounded-full absolute top-[4px] transition-all duration-300 shadow-md ${isOn ? 'left-[26px]' : 'left-[3px]'}`}></span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {isModalOpen && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-gray-100 relative">
            <div className="flex items-center justify-between pb-3 border-b border-gray-100 mb-4">
              <h3 className="text-lg font-bold text-[#113621]">Add New Appliance</h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-gray-400 hover:text-gray-700 p-1 rounded-lg"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleAddSubmit} className="flex flex-col gap-4 text-left">
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">Appliance Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Master Bedroom AC"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-gray-800 focus:outline-none focus:border-[#236144] focus:bg-white transition"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">Category</label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-gray-800 focus:outline-none focus:border-[#236144] focus:bg-white transition"
                >
                  {categories.filter((c) => c !== 'All').map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">Rated Power (Wattage)</label>
                <div className="relative">
                  <input
                    type="number"
                    required
                    min="1"
                    placeholder="e.g. 1500"
                    value={formData.ratedWattage}
                    onChange={(e) => setFormData({ ...formData, ratedWattage: e.target.value })}
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-gray-800 focus:outline-none focus:border-[#236144] focus:bg-white transition pr-10"
                  />
                  <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs font-semibold text-gray-400">
                    W
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-2 pt-1">
                <input
                  type="checkbox"
                  id="smartplug"
                  checked={formData.isSmartPlugConnected}
                  onChange={(e) => setFormData({ ...formData, isSmartPlugConnected: e.target.checked })}
                  className="w-4 h-4 rounded border-gray-300 text-[#236144] focus:ring-[#236144]"
                />
                <label htmlFor="smartplug" className="text-xs text-gray-600 font-medium">
                  Connected to Smart Plug / IoT Relay
                </label>
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-gray-100 mt-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-full text-xs font-semibold text-gray-600 hover:bg-gray-100 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-full text-xs font-semibold bg-[#236144] hover:bg-[#1a4a34] text-white transition shadow-sm"
                >
                  Save Appliance
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
