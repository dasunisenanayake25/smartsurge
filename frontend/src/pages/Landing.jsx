import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Bell, 
  Sparkles, 
  BarChart3, 
  Calendar, 
  Target, 
  Leaf, 
  Receipt,
  Download,
  ChevronDown, 
  ChevronUp, 
  ArrowRight,
  CheckCircle2,
  Zap
} from 'lucide-react';

export default function Landing() {
  const [openFaq, setOpenFaq] = useState(null);
  const [activeTab, setActiveTab] = useState('Dashboard');
  const [activeFeatureIndex, setActiveFeatureIndex] = useState(0);
  const [isWavePaused, setIsWavePaused] = useState(false);

  // Interactive demo appliances for Landing preview tab
  const [previewApps, setPreviewApps] = useState([
    { id: 'ac', name: 'Master Bedroom AC', watts: 1200, status: true },
    { id: 'fridge', name: 'Smart Refrigerator', watts: 180, status: true },
    { id: 'tv', name: '55" 4K Smart TV', watts: 110, status: false },
    { id: 'wm', name: 'Washing Machine', watts: 500, status: false },
  ]);

  const togglePreviewApp = (index) => {
    setPreviewApps((prev) =>
      prev.map((app, idx) => (idx === index ? { ...app, status: !app.status } : app))
    );
  };

  const previewTotalWatt = previewApps
    .filter((a) => a.status)
    .reduce((acc, a) => acc + a.watts, 0);

  // Sequential wave popup animation across the 8 feature cards
  useEffect(() => {
    if (isWavePaused) return;
    const interval = setInterval(() => {
      setActiveFeatureIndex((prev) => (prev + 1) % 8);
    }, 850);
    return () => clearInterval(interval);
  }, [isWavePaused]);

  const features = [
    { 
      icon: <Bell className="w-7 h-7 sm:w-8 sm:h-8" strokeWidth={2.2} />, 
      title: 'Smart Alerts', 
      desc: 'Instant spike & limit alerts.' 
    },
    { 
      icon: <Sparkles className="w-7 h-7 sm:w-8 sm:h-8" strokeWidth={2.2} />, 
      title: 'AI Saving Tips', 
      desc: 'Smart tips to cut peak waste.' 
    },
    { 
      icon: <BarChart3 className="w-7 h-7 sm:w-8 sm:h-8" strokeWidth={2.2} />, 
      title: 'Usage Analytics', 
      desc: 'Live breakdown of home power.' 
    },
    { 
      icon: <Calendar className="w-7 h-7 sm:w-8 sm:h-8" strokeWidth={2.2} />, 
      title: 'Smart Scheduling', 
      desc: 'Automate switches by routine.' 
    },
    { 
      icon: <Target className="w-7 h-7 sm:w-8 sm:h-8" strokeWidth={2.2} />, 
      title: 'Budget Goals', 
      desc: 'Track monthly targets in real time.' 
    },
    { 
      icon: <Leaf className="w-7 h-7 sm:w-8 sm:h-8" strokeWidth={2.2} />, 
      title: 'Carbon Footprint', 
      desc: 'Measure household CO₂ reduction.' 
    },
    { 
      icon: <Receipt className="w-7 h-7 sm:w-8 sm:h-8" strokeWidth={2.2} />, 
      title: 'CEB Tariff Slabs', 
      desc: 'Official domestic slab estimation.' 
    },
    { 
      icon: <Download className="w-7 h-7 sm:w-8 sm:h-8" strokeWidth={2.2} />, 
      title: 'Data & CSV Export', 
      desc: 'One-click report downloads.' 
    },
  ];

  const steps = [
    {
      num: '1. Connect',
      desc: 'Link your meter and home devices to SmartSurge in minutes.'
    },
    {
      num: '2. Monitor',
      desc: 'Watch live power and your estimated bill update in real time.'
    },
    {
      num: '3. Control & save',
      desc: 'Switch or schedule appliances and follow tips to cut waste.'
    }
  ];

  const faqs = [
    {
      q: 'What devices does SmartSurge work with?',
      a: 'SmartSurge works seamlessly with smart meters (like PZEM-004T, NodeMCU/ESP32) and popular IoT smart plugs. You can monitor whole-home consumption as well as individual heavy appliances.'
    },
    {
      q: 'Is my data private?',
      a: 'Yes, completely. Your telemetry and consumption data are securely stored and encrypted. You have full ownership of your data, and it is never shared with third parties.'
    },
    {
      q: 'Is SmartSurge free?',
      a: 'SmartSurge is 100% free to use for residential households during our open beta. You can monitor live wattage, track historical usage, and estimate bills without any hidden fees.'
    },
    {
      q: 'How accurate is the bill estimate?',
      a: 'Our billing engine uses the official Sri Lankan domestic slab tariffs (CEB/LECO), taking into account progressive block rates, peak/off-peak windows, and fixed monthly service charges for 98%+ accuracy.'
    }
  ];

  return (
    <div className="min-h-screen bg-[#F8FAF6] text-[#1E2922] font-sans antialiased selection:bg-[#9CD49E] selection:text-white">

      <header className="w-full flex items-stretch h-14 sm:h-16 bg-[#236144] shadow-sm z-50">
        <div className="bg-white px-4 sm:px-6 md:px-8 flex items-center justify-center border-r border-gray-100 flex-shrink-0">
          <Link to="/" className="flex items-center gap-2.5">
            <img 
              src="/brand-icon.png" 
              alt="SmartSurge Logo" 
              className="h-8 sm:h-9 w-auto object-contain" 
            />
            <span className="font-serif text-xl sm:text-2xl font-bold tracking-tight text-black">
              Smart<span className="text-amber-400">Surge</span>
            </span>
          </Link>
        </div>

        <div className="flex-1 flex items-center justify-between px-3 sm:px-6 lg:px-10 overflow-x-auto no-scrollbar gap-2 sm:gap-4">
          <nav className="flex items-center gap-2 sm:gap-3">
            <a 
              href="#home" 
              className="border border-white/80 bg-white/20 text-white rounded-full px-3.5 sm:px-5 py-1 text-xs sm:text-sm font-medium tracking-wide transition shadow-xs"
            >
              Home
            </a>
            <a 
              href="#features" 
              className="border border-white/80 hover:bg-white/10 text-white rounded-full px-3.5 sm:px-5 py-1 text-xs sm:text-sm font-medium tracking-wide transition"
            >
              Features
            </a>
            <a 
              href="#about" 
              className="border border-white/80 hover:bg-white/10 text-white rounded-full px-3.5 sm:px-5 py-1 text-xs sm:text-sm font-medium tracking-wide transition"
            >
              About us
            </a>
          </nav>

          <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0">
            <Link 
              to="/register" 
              className="border border-white/80 hover:bg-white hover:text-[#236144] text-white rounded-full px-4 sm:px-5 py-1 text-xs sm:text-sm font-semibold tracking-wide transition duration-150"
            >
              Register
            </Link>
            <Link 
              to="/login" 
              className="border border-white/80 hover:bg-white hover:text-[#236144] text-white rounded-full px-4 sm:px-5 py-1 text-xs sm:text-sm font-semibold tracking-wide transition duration-150"
            >
              Login
            </Link>
          </div>
        </div>
      </header>

      <section id="home" className="w-full relative overflow-hidden bg-white">
        <img 
          src="/hero-banner.jpg" 
          alt="Take control of every watt in your home" 
          className="w-full h-auto block object-cover"
        />

        <div className="flex flex-col items-center text-center absolute left-[4%] sm:left-[6%] lg:left-[8%] top-[63%] sm:top-[65%] lg:top-[66%] w-[46%] sm:w-[42%] lg:w-[38%] z-10">
          <p className="text-gray-600 text-[9px] sm:text-xs md:text-sm leading-snug sm:leading-relaxed mb-1.5 sm:mb-3.5 max-w-[260px] sm:max-w-sm">
            Monitor live power, predict your bill and control appliances<br className="hidden sm:inline" /> from one calm, simple dashboard.
          </p>
          <div className="flex items-center justify-center gap-1.5 sm:gap-3">
            <Link
              to="/register"
              className="bg-[#236144] hover:bg-[#1a4a34] text-white px-3 sm:px-6 lg:px-7 py-1 sm:py-2 rounded-full text-[9px] sm:text-xs md:text-sm font-semibold shadow-md flex items-center justify-center transition duration-150"
            >
              <span>Get Started</span>
            </Link>
            <a
              href="#how"
              className="bg-white hover:bg-gray-50 border border-gray-400 text-gray-800 px-2.5 sm:px-4 lg:px-5 py-1 sm:py-2 rounded-full text-[9px] sm:text-xs md:text-sm font-medium shadow-sm flex items-center gap-1.5 transition duration-150"
            >
              <span>See how it works</span>
              <ArrowRight className="w-3 h-3 text-gray-700" />
            </a>
          </div>
        </div>
      </section>

      <section id="features" className="bg-[#9CD49E] py-16 sm:py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <h2 className="font-serif text-3xl sm:text-4xl text-[#113621] font-bold tracking-tight mb-2">
            Everything you need to save energy
          </h2>
          <p className="text-[#19432B] text-sm sm:text-base font-normal mb-12 max-w-xl mx-auto">
            Simple tools that make your home use less and cost less.
          </p>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-6 max-w-5xl mx-auto">
            {features.map((f, i) => {
              const isActive = activeFeatureIndex === i;
              return (
                <div 
                  key={i} 
                  onMouseEnter={() => { setIsWavePaused(true); setActiveFeatureIndex(i); }}
                  onMouseLeave={() => setIsWavePaused(false)}
                  className={`bg-white rounded-2xl p-5 sm:p-6 text-center flex flex-col items-center justify-start transition-all duration-500 ease-out cursor-pointer ${
                    isActive
                      ? 'scale-108 -translate-y-2.5 border-2 border-emerald-500 ring-4 ring-emerald-400/45 shadow-[0_0_24px_rgba(16,185,129,0.5),0_16px_32px_-4px_rgba(18,54,33,0.2)] z-20 bg-gradient-to-b from-white to-[#F2FAF4]'
                      : 'scale-100 translate-y-0 border-2 border-transparent shadow-sm hover:shadow-md hover:-translate-y-1'
                  }`}
                >
                  <div className={`mb-3 flex items-center justify-center transition-all duration-300 ${
                    isActive ? 'scale-115 text-emerald-600' : 'scale-100 text-[#18482F]'
                  }`}>
                    {f.icon}
                  </div>
                  <h3 className={`font-serif font-bold text-sm sm:text-base leading-snug transition-colors duration-300 ${
                    isActive ? 'text-[#0D2D1B]' : 'text-[#113621]'
                  }`}>
                    {f.title}
                  </h3>
                  <p className="font-gatilca text-gray-500 text-xs sm:text-[13px] leading-relaxed mt-2">
                    {f.desc}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <section id="how" className="py-20 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto text-center">
        <h2 className="font-serif text-3xl sm:text-4xl text-[#113621] font-bold tracking-tight mb-2">
          How it works
        </h2>
        <p className="text-gray-600 text-sm sm:text-base mb-12">
          Three simple steps from setup to savings.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
          {steps.map((s, idx) => (
            <div 
              key={idx} 
              className="bg-white rounded-2xl p-6 sm:p-7 border border-[#D5E4D8] shadow-sm hover:border-emerald-500 hover:ring-4 hover:ring-emerald-400/35 hover:shadow-[0_0_22px_rgba(16,185,129,0.35),0_12px_24px_-4px_rgba(18,54,33,0.12)] hover:-translate-y-1.5 transition-all duration-300 cursor-pointer"
            >
              <h3 className="font-serif text-lg font-bold text-[#113621] mb-2.5">
                {s.num}
              </h3>
              <p className="text-gray-600 text-xs sm:text-sm leading-relaxed">
                {s.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-[#9CD49E] py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto text-center">
          <h2 className="font-serif text-3xl sm:text-4xl text-[#113621] font-bold tracking-tight mb-2">
            Your home, at a glance
          </h2>
          <p className="text-[#19432B] text-sm sm:text-base mb-10">
            A clean dashboard with the numbers that matter.
          </p>

          <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-xl border border-white/80 text-left max-w-4xl mx-auto">
            <div className="flex items-center gap-6 border-b border-gray-100 pb-4 mb-6 text-xs sm:text-sm">
              {['Dashboard', 'Live Power', 'Appliances', 'Billing'].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`font-medium transition pb-1 ${
                    activeTab === tab 
                      ? 'text-[#123924] font-bold border-b-2 border-[#123924]' 
                      : 'text-gray-400 hover:text-gray-700'
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>

            {/* Tab 1: Dashboard Overview */}
            {activeTab === 'Dashboard' && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6 animate-in fade-in duration-300">
                <div className="bg-[#F8FAF7] rounded-2xl p-5 border border-[#E3EDE5]">
                  <span className="block text-[11px] font-medium text-gray-500 mb-1">Live Power Draw</span>
                  <span className="block text-2xl sm:text-3xl font-serif font-bold text-[#113621] mb-3">1.84 kW</span>
                  <div className="border-t border-gray-200/60 pt-3">
                    <span className="block text-xs font-semibold text-gray-700">Real-time monitoring</span>
                    <span className="block text-[11px] text-gray-500">Continuous telemetry stream.</span>
                  </div>
                </div>

                <div className="bg-[#F8FAF7] rounded-2xl p-5 border border-[#E3EDE5]">
                  <span className="block text-[11px] font-medium text-gray-500 mb-1">Estimated Month Bill</span>
                  <span className="block text-2xl sm:text-3xl font-serif font-bold text-[#113621] mb-3">Rs. 8,420</span>
                  <div className="border-t border-gray-200/60 pt-3">
                    <span className="block text-xs font-semibold text-gray-700">CEB Tariff Prediction</span>
                    <span className="block text-[11px] text-gray-500">Know your bill before it arrives.</span>
                  </div>
                </div>

                <div className="bg-[#F8FAF7] rounded-2xl p-5 border border-[#E3EDE5]">
                  <span className="block text-[11px] font-medium text-gray-500 mb-1">Active Smart Relays</span>
                  <span className="block text-2xl sm:text-3xl font-serif font-bold text-[#113621] mb-3">4 Connected</span>
                  <div className="border-t border-gray-200/60 pt-3">
                    <span className="block text-xs font-semibold text-gray-700">NodeMCU Gateway</span>
                    <span className="block text-[11px] text-gray-500">Instant remote power cut-offs.</span>
                  </div>
                </div>
              </div>
            )}

            {/* Tab 2: Live Power Telemetry */}
            {activeTab === 'Live Power' && (
              <div className="grid grid-cols-1 sm:grid-cols-4 gap-3.5 mb-6 animate-in fade-in duration-300">
                <div className="bg-[#F8FAF7] rounded-2xl p-4 border border-[#E3EDE5]">
                  <span className="block text-[11px] text-gray-500 mb-0.5">AC Line Voltage</span>
                  <span className="block text-xl sm:text-2xl font-serif font-bold text-[#113621]">230.4 V</span>
                  <span className="text-[10px] text-emerald-600 font-semibold mt-1 block">CEB Grid Nominal</span>
                </div>
                <div className="bg-[#F8FAF7] rounded-2xl p-4 border border-[#E3EDE5]">
                  <span className="block text-[11px] text-gray-500 mb-0.5">RMS Current</span>
                  <span className="block text-xl sm:text-2xl font-serif font-bold text-[#113621]">2.15 A</span>
                  <span className="text-[10px] text-gray-500 mt-1 block">Active CT Sensor Draw</span>
                </div>
                <div className="bg-[#F8FAF7] rounded-2xl p-4 border border-[#E3EDE5]">
                  <span className="block text-[11px] text-gray-500 mb-0.5">Active Wattage</span>
                  <span className="block text-xl sm:text-2xl font-serif font-bold text-emerald-700">495 W</span>
                  <span className="text-[10px] text-emerald-600 font-semibold mt-1 block">Safe Household Load</span>
                </div>
                <div className="bg-[#F8FAF7] rounded-2xl p-4 border border-[#E3EDE5]">
                  <span className="block text-[11px] text-gray-500 mb-0.5">Grid Frequency</span>
                  <span className="block text-xl sm:text-2xl font-serif font-bold text-[#113621]">50.0 Hz</span>
                  <span className="text-[10px] text-gray-500 mt-1 block">Power Factor: 0.98</span>
                </div>
              </div>
            )}

            {/* Tab 3: Interactive Appliances with Live Clickable Switches */}
            {activeTab === 'Appliances' && (
              <div className="mb-6 animate-in fade-in duration-300">
                <div className="flex items-center justify-between mb-3 text-xs">
                  <span className="text-gray-500 font-medium">Click switches to test live remote control:</span>
                  <span className="font-serif font-bold text-[#113621]">Total Live Draw: <span className="text-emerald-700">{previewTotalWatt} W</span></span>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {previewApps.map((app, idx) => (
                    <div 
                      key={app.id} 
                      onClick={() => togglePreviewApp(idx)}
                      className={`p-3.5 rounded-xl border cursor-pointer transition-all duration-200 select-none ${
                        app.status 
                          ? 'bg-emerald-50/80 border-emerald-300 shadow-xs' 
                          : 'bg-[#F8FAF7] border-gray-200 opacity-60 hover:opacity-100'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-[10px] font-bold uppercase text-gray-400">{app.watts}W</span>
                        <div className={`w-8 h-4 rounded-full transition-colors relative flex items-center p-0.5 ${
                          app.status ? 'bg-[#236144]' : 'bg-gray-300'
                        }`}>
                          <div className={`w-3 h-3 rounded-full bg-white shadow-xs transition-transform ${
                            app.status ? 'translate-x-4' : 'translate-x-0'
                          }`}></div>
                        </div>
                      </div>
                      <span className="block font-bold text-xs text-[#113621] truncate">{app.name}</span>
                      <span className={`text-[10px] font-semibold mt-0.5 block ${app.status ? 'text-emerald-700' : 'text-gray-400'}`}>
                        {app.status ? 'Running' : 'Turned Off'}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Tab 4: CEB Tariff Billing Breakdown */}
            {activeTab === 'Billing' && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6 animate-in fade-in duration-300">
                <div className="bg-[#F8FAF7] rounded-2xl p-4 border border-[#E3EDE5]">
                  <span className="block text-[11px] text-gray-500 mb-1">Active CEB Tier</span>
                  <span className="block text-xl sm:text-2xl font-serif font-bold text-[#113621]">Tier 3 (61–90)</span>
                  <span className="text-[11px] text-gray-500 mt-2 block border-t border-gray-200 pt-2">Rate: Rs. 30.00 / kWh</span>
                </div>

                <div className="bg-[#F8FAF7] rounded-2xl p-4 border border-[#E3EDE5]">
                  <span className="block text-[11px] text-gray-500 mb-1">Month-to-Date Cost</span>
                  <span className="block text-xl sm:text-2xl font-serif font-bold text-emerald-700">Rs. 2,150.00</span>
                  <span className="text-[11px] text-gray-500 mt-2 block border-t border-gray-200 pt-2">Includes Rs. 400 Fixed Fee</span>
                </div>

                <div className="bg-[#F8FAF7] rounded-2xl p-4 border border-[#E3EDE5]">
                  <span className="block text-[11px] text-gray-500 mb-1">Target Monthly Budget</span>
                  <span className="block text-xl sm:text-2xl font-serif font-bold text-[#113621]">Rs. 5,000.00</span>
                  <span className="text-[11px] text-emerald-600 font-semibold mt-2 block border-t border-gray-200 pt-2">43% Used • In Safe Zone</span>
                </div>
              </div>
            )}

            <div className="bg-[#EEF7F1] border border-[#D7EBDC] rounded-xl px-4 py-2.5 flex items-center gap-2 text-xs text-[#133C24]">
              <CheckCircle2 className="w-4 h-4 text-[#1E5735]" />
              <span>Private by design — Your usage data stays yours.</span>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto">
        <h2 className="font-serif text-3xl sm:text-4xl text-[#113621] font-bold tracking-tight text-center mb-12">
          Frequently Asked Questions
        </h2>

        <div className="flex flex-col gap-3.5">
          {faqs.map((f, i) => (
            <div 
              key={i} 
              className={`bg-white rounded-2xl border transition-all duration-300 shadow-sm hover:border-emerald-500 hover:ring-4 hover:ring-emerald-400/35 hover:shadow-[0_0_22px_rgba(16,185,129,0.35),0_10px_20px_-4px_rgba(18,54,33,0.1)] hover:-translate-y-0.5 overflow-hidden ${
                openFaq === i ? 'border-emerald-500 ring-2 ring-emerald-400/25 shadow-md' : 'border-[#D5E4D8]'
              }`}
            >
              <button
                onClick={() => setOpenFaq(openFaq === i ? null : i)}
                className="w-full text-left px-6 py-5 flex items-center justify-between gap-4 font-serif font-bold text-sm sm:text-base text-[#113621] hover:text-[#18482F] transition cursor-pointer"
              >
                <span>{f.q}</span>
                {openFaq === i ? (
                  <ChevronUp className="w-4 h-4 text-emerald-600 flex-shrink-0 transition-transform" />
                ) : (
                  <ChevronDown className="w-4 h-4 text-gray-400 flex-shrink-0 transition-transform" />
                )}
              </button>
              {openFaq === i && (
                <div className="px-6 pb-5 pt-1 text-xs sm:text-sm text-gray-600 leading-relaxed border-t border-gray-100">
                  {f.a}
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      <section className="bg-[#9CD49E] py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto bg-white rounded-3xl p-8 sm:p-12 text-center shadow-md border border-white/80">
          <h2 className="font-serif text-2xl sm:text-3xl lg:text-4xl text-[#113621] font-bold tracking-tight mb-3">
            Start managing your energy today
          </h2>
          <p className="text-gray-600 text-xs sm:text-sm mb-7 max-w-md mx-auto">
            Create your free account and see your home's power in minutes.
          </p>
          <Link
            to="/register"
            className="inline-flex items-center justify-center bg-[#153B27] hover:bg-[#0E291B] text-white px-8 py-3 rounded-full text-sm font-semibold shadow-md transition duration-200"
          >
            <span>Get Started</span>
          </Link>
        </div>
      </section>

      <footer className="bg-[#123120] text-gray-300 py-14 px-4 sm:px-6 lg:px-12">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-start md:items-center gap-8 border-b border-[#214A33] pb-10">
          <div className="max-w-sm">
            <div className="flex items-center gap-2.5 mb-3">
              <img 
                src="/brand-icon.png" 
                alt="SmartSurge Logo" 
                className="h-9 w-auto object-contain brightness-110" 
              />
              <span className="font-serif text-xl font-bold tracking-tight text-white flex items-center">
                Smart<span className="text-amber-400">Surge</span>
              </span>
            </div>
            <p className="text-xs text-gray-400 leading-relaxed">
              Monitor live power, predict your bill and control appliances from one calm, simple dashboard.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-10 text-xs">
            <div className="flex flex-col gap-2.5">
              <a href="#home" className="hover:text-white transition">Home</a>
              <a href="#features" className="hover:text-white transition">Features</a>
              <a href="#how" className="hover:text-white transition">How it works</a>
            </div>
            <div className="flex flex-col gap-2.5">
              <a href="#" className="hover:text-white transition">FAQ</a>
              <a href="#" className="hover:text-white transition">Contact</a>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto pt-6 flex flex-col sm:flex-row justify-between items-center text-[11px] text-gray-500 gap-3">
          <span>© 2026 SmartSurge. All rights reserved.</span>
          <div className="flex gap-4">
            <a href="#" className="hover:text-gray-300 transition">Privacy Policy</a>
            <a href="#" className="hover:text-gray-300 transition">Terms of Service</a>
          </div>
        </div>
      </footer>

    </div>
  );
}
