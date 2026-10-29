import React, { useState, useEffect, useContext } from 'react';
import { 
  Sliders, 
  DollarSign, 
  Zap, 
  Wifi, 
  Bell, 
  ShieldCheck, 
  Save, 
  RefreshCw, 
  AlertTriangle, 
  Server, 
  CheckCircle2, 
  Activity, 
  Info,
  Radio,
  Clock,
  Sparkles
} from 'lucide-react';
import { AuthContext } from '../context/AuthContext';
import API from '../services/api';

export default function Settings() {
  const { user } = useContext(AuthContext);
  const [activeTab, setActiveTab] = useState('budget');
  const [saving, setSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [pingStatus, setPingStatus] = useState(null);

  // Settings State
  const [settings, setSettings] = useState({
    // 1. Budget & Cost
    monthlyBudget: 5000,
    budgetAlertThreshold: 85,
    autoPeakShedding: true,
    phantomCutoff: true,

    // 2. CEB Tariff Slabs
    provider: 'CEB',
    tariffCategory: 'Domestic (D-1)',
    tier1Rate: 8,
    tier2Rate: 20,
    tier3Rate: 30,
    tier4Rate: 50,
    autoSyncPUCSL: true,

    // 3. IoT Hardware Gateway
    operationMode: 'simulation', // 'simulation' or 'hardware'
    hardwareIp: '192.168.8.105',
    samplingInterval: '2',
    wifiSsid: 'Dialog_Home_WiFi_2.4G',
    baudRate: '115200',

    // 4. Alerts & Notifications
    voltageAlertThreshold: 250,
    surgePowerThreshold: 2800,
    emailAlerts: true,
    browserNotifications: true,
  });

  // Fetch initial user settings from backend
  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const { data } = await API.get('/auth/profile');
        if (data) {
          setSettings((prev) => ({
            ...prev,
            monthlyBudget: data.monthlyBudget || prev.monthlyBudget,
          }));
        }
      } catch (err) {
        console.warn('Failed to fetch profile settings:', err.message);
      }
    };

    fetchSettings();
  }, []);

  // Handle Save
  const handleSave = async (e) => {
    if (e) e.preventDefault();
    setSaving(true);
    setSaveSuccess(false);

    try {
      // Save budget to backend User profile
      await API.put('/auth/profile', {
        monthlyBudget: Number(settings.monthlyBudget),
      });

      // Save other preferences to localStorage for persistence
      localStorage.setItem('smartsurge_settings', JSON.stringify(settings));

      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3500);
    } catch (err) {
      console.error('Failed to save settings:', err);
      alert('Failed to save settings. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  // Ping Hardware Gateway test
  const handlePingTest = () => {
    setPingStatus('testing');
    setTimeout(() => {
      setPingStatus('success');
      setTimeout(() => setPingStatus(null), 4000);
    }, 1200);
  };

  const tabs = [
    { id: 'budget', name: 'Budget & Cost Limits', icon: DollarSign },
    { id: 'tariff', name: 'CEB / LECO Tariff', icon: Sliders },
    { id: 'alerts', name: 'Alerts & Protection', icon: Bell },
  ];

  return (
    <div className="h-full overflow-y-auto p-4 sm:p-6 relative z-10 w-full max-w-7xl mx-auto flex flex-col gap-6">
      
      {/* Header */}
      <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 flex-shrink-0">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-[#113621] dark:text-emerald-100">
            System & Energy Settings
          </h1>
          <p className="text-gray-500 mt-0.5 text-xs md:text-sm">
            Configure monthly expenditure limits, CEB tariff slabs, and power surge alerts
          </p>
        </div>

        <div className="flex items-center gap-3">
          {saveSuccess && (
            <div className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-full text-xs font-semibold animate-in fade-in">
              <CheckCircle2 size={16} />
              <span>Saved Successfully!</span>
            </div>
          )}

          <button
            onClick={handleSave}
            disabled={saving}
            className="inline-flex items-center gap-2 bg-[#236144] hover:bg-[#1a4a34] text-white px-5 py-2.5 rounded-full text-xs sm:text-sm font-semibold shadow-sm transition disabled:opacity-50"
          >
            {saving ? (
              <>
                <RefreshCw size={16} className="animate-spin" />
                <span>Saving...</span>
              </>
            ) : (
              <>
                <Save size={16} />
                <span>Save Changes</span>
              </>
            )}
          </button>
        </div>
      </header>

      {/* Settings Navigation Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold whitespace-nowrap transition-all duration-200 ${
                isActive
                  ? 'bg-[#236144] text-white shadow-sm'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
              }`}
            >
              <Icon size={16} />
              <span>{tab.name}</span>
            </button>
          );
        })}
      </div>

      {/* Main Form Body */}
      <form onSubmit={handleSave} className="flex flex-col gap-6">

        {/* ---------------------------------------------------- */}
        {/* TAB 1: Budget & Cost Limits */}
        {/* ---------------------------------------------------- */}
        {activeTab === 'budget' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            <div className="lg:col-span-8 flex flex-col gap-5">
              
              {/* Monthly Budget Card */}
              <div className="bg-white border border-gray-200/90 rounded-2xl p-5 shadow-sm">
                <div className="flex items-start justify-between gap-4 mb-4">
                  <div>
                    <h3 className="text-base font-bold text-[#113621] dark:text-emerald-100">Monthly Electricity Budget Target</h3>
                    <p className="text-xs text-gray-500">Define maximum allowable electricity expenditure before triggering warning notifications</p>
                  </div>
                  <div className="p-2 bg-emerald-50 text-emerald-700 rounded-xl">
                    <DollarSign size={20} />
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                  <div className="relative flex-1">
                    <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-sm font-bold text-gray-400">Rs.</span>
                    <input
                      type="number"
                      value={settings.monthlyBudget}
                      onChange={(e) => setSettings({ ...settings, monthlyBudget: Number(e.target.value) })}
                      className="w-full pl-11 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-base font-bold text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#236144]"
                      placeholder="5000"
                    />
                  </div>
                  <div className="flex items-center gap-2">
                    {[3500, 5000, 7500, 10000].map((preset) => (
                      <button
                        type="button"
                        key={preset}
                        onClick={() => setSettings({ ...settings, monthlyBudget: preset })}
                        className={`px-3 py-2 text-xs font-semibold rounded-lg border transition ${
                          settings.monthlyBudget === preset
                            ? 'bg-[#113621] text-white border-[#113621]'
                            : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-50'
                        }`}
                      >
                        Rs. {preset.toLocaleString()}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Range Slider for Warning Threshold */}
                <div className="mt-6 pt-5 border-t border-gray-100">
                  <div className="flex items-center justify-between text-xs mb-2">
                    <span className="font-semibold text-gray-700">Budget Warning Threshold Trigger</span>
                    <span className="font-bold text-[#236144] font-mono">{settings.budgetAlertThreshold}% of budget (Rs. {Math.round(settings.monthlyBudget * (settings.budgetAlertThreshold / 100)).toLocaleString()})</span>
                  </div>
                  <input
                    type="range"
                    min="50"
                    max="95"
                    step="5"
                    value={settings.budgetAlertThreshold}
                    onChange={(e) => setSettings({ ...settings, budgetAlertThreshold: Number(e.target.value) })}
                    className="w-full accent-[#236144] cursor-pointer"
                  />
                  <div className="flex justify-between text-[11px] text-gray-400 mt-1">
                    <span>50% (Conservative)</span>
                    <span>75% (Balanced)</span>
                    <span>95% (Strict Limit)</span>
                  </div>
                </div>
              </div>

              {/* Automated Demand-Side Management (DSM) Toggles */}
              <div className="bg-white border border-gray-200/90 rounded-2xl p-5 shadow-sm flex flex-col gap-4">
                <h3 className="text-base font-bold text-[#113621] dark:text-emerald-100">Smart Demand-Side Automation Rules</h3>

                <div className="flex items-center justify-between p-3.5 bg-[#F8FAF6] border border-[#E3EDE5] rounded-xl">
                  <div className="flex items-start gap-3">
                    <div className="p-2 bg-amber-50 text-amber-700 rounded-lg mt-0.5">
                      <Clock size={18} />
                    </div>
                    <div>
                      <h4 className="text-xs sm:text-sm font-bold text-gray-800">Automated Peak-Hour Load Shedding</h4>
                      <p className="text-xs text-gray-500 mt-0.5">Automatically throttle secondary cooling and standby loads during CEB peak hours (6:30 PM – 10:30 PM)</p>
                    </div>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer flex-shrink-0 ml-4">
                    <input
                      type="checkbox"
                      checked={settings.autoPeakShedding}
                      onChange={(e) => setSettings({ ...settings, autoPeakShedding: e.target.checked })}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#236144]"></div>
                  </label>
                </div>

                <div className="flex items-center justify-between p-3.5 bg-[#F8FAF6] border border-[#E3EDE5] rounded-xl">
                  <div className="flex items-start gap-3">
                    <div className="p-2 bg-emerald-50 text-emerald-700 rounded-lg mt-0.5">
                      <Zap size={18} />
                    </div>
                    <div>
                      <h4 className="text-xs sm:text-sm font-bold text-gray-800">Midnight Phantom Standby Cut-Off</h4>
                      <p className="text-xs text-gray-500 mt-0.5">Cut power to connected entertainment centers and charging docks when power draws remain below 40W past midnight</p>
                    </div>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer flex-shrink-0 ml-4">
                    <input
                      type="checkbox"
                      checked={settings.phantomCutoff}
                      onChange={(e) => setSettings({ ...settings, phantomCutoff: e.target.checked })}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#236144]"></div>
                  </label>
                </div>

              </div>

            </div>

            {/* Right Information Card */}
            <div className="lg:col-span-4 flex flex-col gap-4">
              <div className="bg-[#113621] text-white rounded-2xl p-5 shadow-sm flex flex-col gap-3">
                <div className="flex items-center gap-2 text-amber-300 text-xs font-bold uppercase tracking-wider">
                  <Sparkles size={16} />
                  <span>Cost Optimization Tip</span>
                </div>
                <h4 className="text-base font-bold">Why Set a Realistic Budget?</h4>
                <p className="text-xs text-gray-200 leading-relaxed">
                  Setting a strict budget helps SmartSurge's predictive AI gauge daily consumption burn rates. If your projected monthly bill exceeds the set budget by even Rs. 100, the AI alerts you 7 days in advance.
                </p>
                <div className="mt-2 pt-3 border-t border-white/10 flex items-center justify-between text-xs font-medium">
                  <span className="text-gray-300">Average Savings:</span>
                  <span className="font-bold text-emerald-300">14% - 22% Monthly</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ---------------------------------------------------- */}
        {/* TAB 2: CEB / LECO Tariff Configuration */}
        {/* ---------------------------------------------------- */}
        {activeTab === 'tariff' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            <div className="lg:col-span-8 bg-white border border-gray-200/90 rounded-2xl p-5 shadow-sm flex flex-col gap-5">
              <div>
                <h3 className="text-base font-bold text-[#113621] dark:text-emerald-100">Utility Provider & Tariff Slab Architecture</h3>
                <p className="text-xs text-gray-500">Sri Lankan domestic block tariff rates used for calculating bills and projected expenditure</p>
              </div>

              {/* Utility Provider Selector */}
              <div className="grid grid-cols-2 gap-4">
                <div 
                  onClick={() => setSettings({ ...settings, provider: 'CEB' })}
                  className={`p-4 rounded-xl border cursor-pointer transition flex items-center justify-between ${
                    settings.provider === 'CEB'
                      ? 'border-[#236144] bg-emerald-50/50 ring-1 ring-[#236144]'
                      : 'border-gray-200 bg-white hover:bg-gray-50'
                  }`}
                >
                  <div>
                    <h4 className="text-sm font-bold text-gray-900">CEB (Ceylon Electricity Board)</h4>
                    <p className="text-xs text-gray-500">Official National Grid Tariff Schedule</p>
                  </div>
                  <Radio size={18} className={settings.provider === 'CEB' ? 'text-[#236144]' : 'text-gray-300'} />
                </div>

                <div 
                  onClick={() => setSettings({ ...settings, provider: 'LECO' })}
                  className={`p-4 rounded-xl border cursor-pointer transition flex items-center justify-between ${
                    settings.provider === 'LECO'
                      ? 'border-[#236144] bg-emerald-50/50 ring-1 ring-[#236144]'
                      : 'border-gray-200 bg-white hover:bg-gray-50'
                  }`}
                >
                  <div>
                    <h4 className="text-sm font-bold text-gray-900">LECO (Lanka Electricity Co.)</h4>
                    <p className="text-xs text-gray-500">Coastal / Urban Domestic Supply</p>
                  </div>
                  <Radio size={18} className={settings.provider === 'LECO' ? 'text-[#236144]' : 'text-gray-300'} />
                </div>
              </div>

              {/* Editable Tariff Slab Rates */}
              <div className="pt-2">
                <h4 className="text-xs font-bold uppercase tracking-wider text-gray-500 mb-3">Unit Rates per Consumption Block</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  <div className="p-3 bg-gray-50 border border-gray-200 rounded-xl">
                    <label className="text-xs font-semibold text-gray-600 block mb-1">Block 1: 0 – 30 kWh (LKR/unit)</label>
                    <input
                      type="number"
                      value={settings.tier1Rate}
                      onChange={(e) => setSettings({ ...settings, tier1Rate: Number(e.target.value) })}
                      className="w-full bg-white border border-gray-200 rounded-lg px-3 py-1.5 text-sm font-bold text-gray-900 font-mono"
                    />
                  </div>

                  <div className="p-3 bg-gray-50 border border-gray-200 rounded-xl">
                    <label className="text-xs font-semibold text-gray-600 block mb-1">Block 2: 31 – 60 kWh (LKR/unit)</label>
                    <input
                      type="number"
                      value={settings.tier2Rate}
                      onChange={(e) => setSettings({ ...settings, tier2Rate: Number(e.target.value) })}
                      className="w-full bg-white border border-gray-200 rounded-lg px-3 py-1.5 text-sm font-bold text-gray-900 font-mono"
                    />
                  </div>

                  <div className="p-3 bg-gray-50 border border-gray-200 rounded-xl">
                    <label className="text-xs font-semibold text-gray-600 block mb-1">Block 3: 61 – 90 kWh (LKR/unit)</label>
                    <input
                      type="number"
                      value={settings.tier3Rate}
                      onChange={(e) => setSettings({ ...settings, tier3Rate: Number(e.target.value) })}
                      className="w-full bg-white border border-gray-200 rounded-lg px-3 py-1.5 text-sm font-bold text-gray-900 font-mono"
                    />
                  </div>

                  <div className="p-3 bg-gray-50 border border-gray-200 rounded-xl">
                    <label className="text-xs font-semibold text-gray-600 block mb-1">Block 4: 90+ kWh (LKR/unit)</label>
                    <input
                      type="number"
                      value={settings.tier4Rate}
                      onChange={(e) => setSettings({ ...settings, tier4Rate: Number(e.target.value) })}
                      className="w-full bg-white border border-gray-200 rounded-lg px-3 py-1.5 text-sm font-bold text-gray-900 font-mono"
                    />
                  </div>
                </div>
              </div>

              {/* PUCSL Gazette Sync Toggle */}
              <div className="flex items-center justify-between p-3.5 bg-gray-50 border border-gray-200 rounded-xl mt-2">
                <div className="flex items-center gap-3">
                  <ShieldCheck size={20} className="text-[#236144]" />
                  <div>
                    <h5 className="text-xs font-bold text-gray-900">Auto-Sync with PUCSL Gazetted Tariff Changes</h5>
                    <p className="text-[11px] text-gray-500">Automatically update rates when Public Utilities Commission of Sri Lanka issues revisions</p>
                  </div>
                </div>
                <input
                  type="checkbox"
                  checked={settings.autoSyncPUCSL}
                  onChange={(e) => setSettings({ ...settings, autoSyncPUCSL: e.target.checked })}
                  className="w-4 h-4 accent-[#236144] rounded cursor-pointer"
                />
              </div>

            </div>

            <div className="lg:col-span-4 flex flex-col gap-4">
              <div className="bg-[#F8FAF6] border border-[#E3EDE5] rounded-2xl p-5 shadow-sm flex flex-col gap-3">
                <div className="flex items-center gap-2 text-[#236144]">
                  <Info size={18} />
                  <h4 className="text-sm font-bold">Progressive Block Logic</h4>
                </div>
                <p className="text-xs text-gray-600 leading-relaxed">
                  Domestic electricity tariffs in Sri Lanka use cumulative slab pricing. Exceeding a slab by a single unit affects the monthly fixed service surcharge (Rs. 150 &rarr; Rs. 300 &rarr; Rs. 400 &rarr; Rs. 1000).
                </p>
              </div>
            </div>
          </div>
        )}

        {/* ---------------------------------------------------- */}
        {/* TAB 3: Alerts & Protection */}
        {/* ---------------------------------------------------- */}
        {activeTab === 'alerts' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            <div className="lg:col-span-8 bg-white border border-gray-200/90 rounded-2xl p-5 shadow-sm flex flex-col gap-5">
              <div>
                <h3 className="text-base font-bold text-[#113621] dark:text-emerald-100">Grid Protection & Surge Trigger Thresholds</h3>
                <p className="text-xs text-gray-500">Define automated safeguards against hazardous line voltage spikes and circuit overloads</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-4 bg-gray-50 border border-gray-200 rounded-xl">
                  <div className="flex items-center justify-between mb-2">
                    <label className="text-xs font-bold text-gray-800">Line Voltage Spike Limit (VAC)</label>
                    <span className="text-xs font-mono font-bold text-[#236144]">{settings.voltageAlertThreshold} V</span>
                  </div>
                  <input
                    type="range"
                    min="240"
                    max="270"
                    step="1"
                    value={settings.voltageAlertThreshold}
                    onChange={(e) => setSettings({ ...settings, voltageAlertThreshold: Number(e.target.value) })}
                    className="w-full accent-[#236144] cursor-pointer"
                  />
                  <p className="text-[11px] text-gray-500 mt-1">Triggers emergency alerts if CEB line voltage surpasses this safety ceiling.</p>
                </div>

                <div className="p-4 bg-gray-50 border border-gray-200 rounded-xl">
                  <div className="flex items-center justify-between mb-2">
                    <label className="text-xs font-bold text-gray-800">Instant Wattage Surge Cutoff</label>
                    <span className="text-xs font-mono font-bold text-[#236144]">{settings.surgePowerThreshold} W</span>
                  </div>
                  <input
                    type="range"
                    min="1500"
                    max="4000"
                    step="100"
                    value={settings.surgePowerThreshold}
                    onChange={(e) => setSettings({ ...settings, surgePowerThreshold: Number(e.target.value) })}
                    className="w-full accent-[#236144] cursor-pointer"
                  />
                  <p className="text-[11px] text-gray-500 mt-1">Auto-sheds non-essential circuits if combined household load exceeds breaker limit.</p>
                </div>
              </div>

              {/* Notification Toggles */}
              <div className="flex flex-col gap-3 pt-2">
                <h4 className="text-xs font-bold uppercase tracking-wider text-gray-500">Dispatch Channels</h4>

                <div className="flex items-center justify-between p-3.5 bg-gray-50 border border-gray-200 rounded-xl">
                  <div>
                    <h5 className="text-xs font-bold text-gray-900">Email Monthly Billing Summary</h5>
                    <p className="text-[11px] text-gray-500">Send an automated PDF copy of the monthly report to your registered email</p>
                  </div>
                  <input
                    type="checkbox"
                    checked={settings.emailAlerts}
                    onChange={(e) => setSettings({ ...settings, emailAlerts: e.target.checked })}
                    className="w-4 h-4 accent-[#236144] rounded cursor-pointer"
                  />
                </div>

                <div className="flex items-center justify-between p-3.5 bg-gray-50 border border-gray-200 rounded-xl">
                  <div>
                    <h5 className="text-xs font-bold text-gray-900">Browser In-App Surge Notifications</h5>
                    <p className="text-[11px] text-gray-500">Show floating push toasts whenever smart relays switch on/off</p>
                  </div>
                  <input
                    type="checkbox"
                    checked={settings.browserNotifications}
                    onChange={(e) => setSettings({ ...settings, browserNotifications: e.target.checked })}
                    className="w-4 h-4 accent-[#236144] rounded cursor-pointer"
                  />
                </div>
              </div>

            </div>

            <div className="lg:col-span-4 flex flex-col gap-4">
              <div className="bg-amber-50/70 border border-amber-200 rounded-2xl p-5 shadow-sm flex flex-col gap-2">
                <div className="flex items-center gap-2 text-amber-800">
                  <AlertTriangle size={18} />
                  <h4 className="text-sm font-bold">Surge Safeguard Active</h4>
                </div>
                <p className="text-xs text-amber-900/80 leading-relaxed">
                  Surge thresholds prevent compressor burnout on refrigeration and HVAC units during brownouts or grid restoration surges.
                </p>
              </div>
            </div>
          </div>
        )}

      </form>

    </div>
  );
}