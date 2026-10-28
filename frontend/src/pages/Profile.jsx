import React, { useState, useEffect, useContext } from 'react';
import { 
  User as UserIcon, 
  Mail, 
  ShieldCheck, 
  Home, 
  Users, 
  MapPin, 
  Sun, 
  Lock, 
  Save, 
  CheckCircle2, 
  RefreshCw, 
  Award, 
  Zap, 
  Leaf, 
  FileCheck,
  Calendar,
  AlertCircle
} from 'lucide-react';
import { AuthContext } from '../context/AuthContext';
import API from '../services/api';

export default function Profile() {
  const { user, setUser } = useContext(AuthContext);

  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    cebAccountNo: '074-819-2015-V',
    houseType: 'Two-Storey Residential',
    residentsCount: 4,
    solarSetup: 'None',
    district: 'Colombo',
    newPassword: '',
    confirmPassword: '',
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  // Fetch full profile from backend
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const { data } = await API.get('/auth/profile');
        if (data) {
          setFormData((prev) => ({
            ...prev,
            name: data.name || prev.name,
            email: data.email || prev.email,
            cebAccountNo: data.cebAccountNo || prev.cebAccountNo,
            houseType: data.houseType || prev.houseType,
            residentsCount: data.residentsCount || prev.residentsCount,
            solarSetup: data.solarSetup || prev.solarSetup,
            district: data.district || prev.district,
          }));
        }
      } catch (err) {
        console.warn('Failed to fetch profile details:', err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  const handleSave = async (e) => {
    if (e) e.preventDefault();
    setErrorMessage('');
    setSaving(true);
    setSaveSuccess(false);

    // Password validation if entered
    if (formData.newPassword) {
      if (formData.newPassword.length < 6) {
        setErrorMessage('New password must be at least 6 characters long.');
        setSaving(false);
        return;
      }
      if (formData.newPassword !== formData.confirmPassword) {
        setErrorMessage('New password and confirmation do not match.');
        setSaving(false);
        return;
      }
    }

    try {
      const payload = {
        name: formData.name,
        cebAccountNo: formData.cebAccountNo,
        houseType: formData.houseType,
        residentsCount: Number(formData.residentsCount),
        solarSetup: formData.solarSetup,
        district: formData.district,
      };

      if (formData.newPassword) {
        payload.password = formData.newPassword;
      }

      const { data } = await API.put('/auth/profile', payload);

      if (data) {
        // Update user context and localStorage
        const updatedUser = { ...user, ...data };
        setUser(updatedUser);
        localStorage.setItem('userInfo', JSON.stringify(updatedUser));
        if (data.token) {
          localStorage.setItem('token', data.token);
        }

        setSaveSuccess(true);
        setFormData((prev) => ({ ...prev, newPassword: '', confirmPassword: '' }));
        setTimeout(() => setSaveSuccess(false), 3500);
      }
    } catch (err) {
      console.error('Failed to update profile:', err);
      setErrorMessage(err.response?.data?.message || 'Failed to update profile.');
    } finally {
      setSaving(false);
    }
  };

  const getInitials = (name) => {
    if (!name) return 'SS';
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <div className="h-full overflow-y-auto p-4 sm:p-6 relative z-10 w-full max-w-7xl mx-auto flex flex-col gap-6">
      
      {/* Header */}
      <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 flex-shrink-0">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-[#113621] dark:text-emerald-100">
            Household Profile & Account
          </h1>
          <p className="text-gray-500 mt-0.5 text-xs md:text-sm">
            Manage your personal credentials, CEB/LECO customer identifier, and household energy metadata
          </p>
        </div>

        <div className="flex items-center gap-3">
          {saveSuccess && (
            <div className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-full text-xs font-semibold animate-in fade-in">
              <CheckCircle2 size={16} />
              <span>Profile Updated!</span>
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
                <span>Save Profile</span>
              </>
            )}
          </button>
        </div>
      </header>

      {errorMessage && (
        <div className="p-3.5 bg-rose-50 border border-rose-200 text-rose-700 text-xs font-semibold rounded-xl flex items-center gap-2">
          <AlertCircle size={16} />
          <span>{errorMessage}</span>
        </div>
      )}

      {/* Profile Overview Banner */}
      <div className="bg-white border border-gray-200/90 rounded-2xl p-5 shadow-sm flex flex-col sm:flex-row items-center sm:items-start justify-between gap-5">
        <div className="flex flex-col sm:flex-row items-center gap-4 text-center sm:text-left">
          <div className="w-16 h-16 rounded-2xl bg-[#123120] text-amber-400 font-bold text-xl flex items-center justify-center shadow-md flex-shrink-0 border-2 border-amber-400/30">
            {getInitials(formData.name)}
          </div>
          <div>
            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
              <h2 className="text-lg sm:text-xl font-bold text-[#113621] dark:text-emerald-100">{formData.name || 'User'}</h2>
              <span className="text-[10px] font-bold px-2 py-0.5 bg-[#123120] text-amber-400 rounded-full tracking-wide">
                Household Admin
              </span>
            </div>
            <p className="text-xs text-gray-500 mt-1 flex items-center justify-center sm:justify-start gap-1.5">
              <Mail size={13} />
              <span>{formData.email}</span>
            </p>
            <p className="text-[11px] text-gray-400 mt-0.5 flex items-center justify-center sm:justify-start gap-1.5">
              <Calendar size={13} />
              <span>SmartSurge Customer ID: {formData.cebAccountNo}</span>
            </p>
          </div>
        </div>

        {/* Eco Badge Overview */}
        <div className="flex items-center gap-3 bg-[#F8FAF6] border border-[#E3EDE5] p-3 rounded-xl flex-shrink-0">
          <div className="p-2.5 bg-emerald-100 text-emerald-700 rounded-xl">
            <Award size={24} />
          </div>
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-gray-500 block">Eco-Efficiency Score</span>
            <div className="flex items-baseline gap-1">
              <span className="text-xl font-bold font-mono text-[#113621] dark:text-emerald-100">88</span>
              <span className="text-xs text-gray-500 font-medium">/ 100</span>
              <span className="ml-1 text-[11px] font-bold text-emerald-700 bg-emerald-50 px-1.5 py-0.2 rounded border border-emerald-200">Grade A</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Grid: Form Left, Badges Right */}
      <form onSubmit={handleSave} className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column: Editable Details (8 Cols) */}
        <div className="lg:col-span-8 flex flex-col gap-6">
          
          {/* Card 1: Personal & Account Identity */}
          <div className="bg-white border border-gray-200/90 rounded-2xl p-5 shadow-sm flex flex-col gap-4">
            <div className="flex items-center gap-2 border-b border-gray-100 pb-3">
              <UserIcon size={18} className="text-[#236144]" />
              <h3 className="text-base font-bold text-[#113621] dark:text-emerald-100">Account Credentials</h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-semibold text-gray-700 block mb-1">Full Name</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3.5 py-2 text-xs font-semibold text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#236144]"
                  required
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-gray-700 block mb-1">Email Address</label>
                <input
                  type="email"
                  value={formData.email}
                  disabled
                  className="w-full bg-gray-100 border border-gray-200 rounded-xl px-3.5 py-2 text-xs font-semibold text-gray-500 cursor-not-allowed"
                />
                <span className="text-[10px] text-gray-400 mt-1 block">Primary login identifier (read-only)</span>
              </div>
            </div>
          </div>

          {/* Card 2: Household & CEB Electricity Profile */}
          <div className="bg-white border border-gray-200/90 rounded-2xl p-5 shadow-sm flex flex-col gap-4">
            <div className="flex items-center gap-2 border-b border-gray-100 pb-3">
              <Home size={18} className="text-[#236144]" />
              <h3 className="text-base font-bold text-[#113621] dark:text-emerald-100">CEB / LECO Domestic Premises Profile</h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-semibold text-gray-700 block mb-1">CEB / LECO Account Number</label>
                <div className="relative">
                  <FileCheck size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    value={formData.cebAccountNo}
                    onChange={(e) => setFormData({ ...formData, cebAccountNo: e.target.value })}
                    className="w-full pl-9 pr-3.5 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs font-mono font-bold text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#236144]"
                    placeholder="074-819-2015-V"
                  />
                </div>
                <span className="text-[10px] text-gray-400 mt-1 block">Found on top right of paper utility bill</span>
              </div>

              <div>
                <label className="text-xs font-semibold text-gray-700 block mb-1">Premises Type</label>
                <select
                  value={formData.houseType}
                  onChange={(e) => setFormData({ ...formData, houseType: e.target.value })}
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3.5 py-2 text-xs font-semibold text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#236144]"
                >
                  <option value="Single-Storey House">Single-Storey House</option>
                  <option value="Two-Storey Residential">Two-Storey Residential</option>
                  <option value="Apartment / Condominium">Apartment / Condominium</option>
                  <option value="Residential + Home Office">Residential + Home Office</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-semibold text-gray-700 block mb-1">Household Members (Residents)</label>
                <div className="relative">
                  <Users size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    type="number"
                    min="1"
                    max="15"
                    value={formData.residentsCount}
                    onChange={(e) => setFormData({ ...formData, residentsCount: Number(e.target.value) })}
                    className="w-full pl-9 pr-3.5 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs font-bold text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#236144]"
                  />
                </div>
                <span className="text-[10px] text-gray-400 mt-1 block">Used by AI to benchmark per-capita kWh</span>
              </div>

              <div>
                <label className="text-xs font-semibold text-gray-700 block mb-1">District / Province</label>
                <div className="relative">
                  <MapPin size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <select
                    value={formData.district}
                    onChange={(e) => setFormData({ ...formData, district: e.target.value })}
                    className="w-full pl-9 pr-3.5 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs font-semibold text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#236144]"
                  >
                    <option value="Colombo">Colombo (Western)</option>
                    <option value="Gampaha">Gampaha (Western)</option>
                    <option value="Kalutara">Kalutara (Western)</option>
                    <option value="Kandy">Kandy (Central)</option>
                    <option value="Galle">Galle (Southern)</option>
                    <option value="Matara">Matara (Southern)</option>
                    <option value="Kurunegala">Kurunegala (North Western)</option>
                  </select>
                </div>
              </div>

              <div className="sm:col-span-2">
                <label className="text-xs font-semibold text-gray-700 block mb-1">Rooftop Solar PV Configuration</label>
                <div className="relative">
                  <Sun size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-amber-500" />
                  <select
                    value={formData.solarSetup}
                    onChange={(e) => setFormData({ ...formData, solarSetup: e.target.value })}
                    className="w-full pl-9 pr-3.5 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs font-semibold text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#236144]"
                  >
                    <option value="None">None (Standard Grid Import Only)</option>
                    <option value="Net-Metering">Net-Metering (Export units offset import units)</option>
                    <option value="Net-Accounting">Net-Accounting (CEB pays for net excess units)</option>
                    <option value="Net-Plus">Net-Plus (All solar generation sold directly to CEB)</option>
                  </select>
                </div>
              </div>

            </div>
          </div>

          {/* Card 3: Security & Password Update */}
          <div className="bg-white border border-gray-200/90 rounded-2xl p-5 shadow-sm flex flex-col gap-4">
            <div className="flex items-center gap-2 border-b border-gray-100 pb-3">
              <Lock size={18} className="text-[#236144]" />
              <h3 className="text-base font-bold text-[#113621] dark:text-emerald-100">Update Password</h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-semibold text-gray-700 block mb-1">New Password</label>
                <input
                  type="password"
                  value={formData.newPassword}
                  onChange={(e) => setFormData({ ...formData, newPassword: e.target.value })}
                  placeholder="Leave blank to keep current"
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3.5 py-2 text-xs font-semibold text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#236144]"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-gray-700 block mb-1">Confirm New Password</label>
                <input
                  type="password"
                  value={formData.confirmPassword}
                  onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                  placeholder="Repeat new password"
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3.5 py-2 text-xs font-semibold text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#236144]"
                />
              </div>
            </div>
          </div>

        </div>

        {/* Right Column: Energy Badges & Household Stats (4 Cols) */}
        <div className="lg:col-span-4 flex flex-col gap-5">
          
          {/* Energy Achievements & Gamification */}
          <div className="bg-white border border-gray-200/90 rounded-2xl p-5 shadow-sm flex flex-col gap-4">
            <h4 className="text-sm font-bold text-[#113621] dark:text-emerald-100 flex items-center gap-2">
              <Award size={18} className="text-amber-500" />
              <span>SmartSurge Eco Achievements</span>
            </h4>

            <div className="flex flex-col gap-3">
              <div className="p-3 bg-transparent border border-emerald-300 dark:border-emerald-500/40 rounded-xl flex items-center gap-3">
                <div className="p-2 bg-emerald-100/80 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 rounded-lg flex-shrink-0">
                  <ShieldCheck size={18} />
                </div>
                <div>
                  <h5 className="text-xs font-bold text-gray-900 dark:text-white">Slab 2 Guardian</h5>
                  <p className="text-[11px] text-gray-500 dark:text-gray-400">Maintained household under 60 kWh for 2 consecutive billing cycles.</p>
                </div>
              </div>

              <div className="p-3 bg-transparent border border-amber-300 dark:border-amber-500/40 rounded-xl flex items-center gap-3">
                <div className="p-2 bg-amber-100/80 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 rounded-lg flex-shrink-0">
                  <Zap size={18} />
                </div>
                <div>
                  <h5 className="text-xs font-bold text-gray-900 dark:text-white">Peak Load Shifter</h5>
                  <p className="text-[11px] text-gray-500 dark:text-gray-400">Successfully shifted over 35 kWh of heavy loads away from 6:30–10:30 PM.</p>
                </div>
              </div>

              <div className="p-3 bg-transparent border border-blue-300 dark:border-blue-500/40 rounded-xl flex items-center gap-3">
                <div className="p-2 bg-blue-100/80 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 rounded-lg flex-shrink-0">
                  <Leaf size={18} />
                </div>
                <div>
                  <h5 className="text-xs font-bold text-gray-900 dark:text-white">Phantom Hunter</h5>
                  <p className="text-[11px] text-gray-500 dark:text-gray-400">Eliminated midnight idle standby drains, saving ~12 kg CO₂ emissions.</p>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Support / FYP Context Card */}
          <div className="bg-[#123120] text-white rounded-2xl p-5 shadow-sm flex flex-col gap-3">
            <span className="text-[11px] font-bold text-amber-400 uppercase tracking-wider">System Specifications</span>
            <h4 className="text-sm font-bold">SmartSurge HEMS v2.4</h4>
            <p className="text-xs text-gray-300 leading-relaxed">
              Household energy parameters directly influence our machine learning load-forecasting and automated demand response algorithms.
            </p>
            <div className="mt-1 pt-3 border-t border-white/10 flex items-center justify-between text-xs font-medium text-gray-300">
              <span>Account Status:</span>
              <span className="text-emerald-400 font-bold">Active & Verified</span>
            </div>
          </div>

        </div>

      </form>

    </div>
  );
}