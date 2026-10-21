import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  Bell, 
  Sparkles, 
  BarChart3, 
  Calendar, 
  Target, 
  Leaf, 
  ChevronDown, 
  ChevronUp, 
  ArrowRight,
  CheckCircle2,
  Zap,
  Activity,
  ShieldCheck
} from 'lucide-react';

export default function Landing() {
  const [openFaq, setOpenFaq] = useState(null);
  const [activeTab, setActiveTab] = useState('Dashboard');

  const features = [
    { 
      icon: <Bell className="w-5 h-5 text-[#18482f]" />, 
      title: 'Smart Alerts', 
      desc: "Get notified about usage spikes, overloads and when you're close to your bill limit." 
    },
    { 
      icon: <Sparkles className="w-5 h-5 text-[#18482f]" />, 
      title: 'AI Saving Tips', 
      desc: 'Personalized suggestions like shifting heavy appliances to off-peak hours.' 
    },
    { 
      icon: <BarChart3 className="w-5 h-5 text-[#18482f]" />, 
      title: 'Usage Analytics', 
      desc: 'Daily, weekly and monthly reports to see where your energy really goes.' 
    },
    { 
      icon: <Calendar className="w-5 h-5 text-[#18482f]" />, 
      title: 'Smart Scheduling', 
      desc: 'Automate appliances to turn on and off by time, routine or tariff.' 
    },
    { 
      icon: <Target className="w-5 h-5 text-[#18482f]" />, 
      title: 'Budget Goals', 
      desc: 'Set a monthly target and track your progress toward it.' 
    },
    { 
      icon: <Leaf className="w-5 h-5 text-[#18482f]" />, 
      title: 'Carbon Footprint', 
      desc: "See your CO2 impact and how much you've reduced it." 
    },
  ];

  const steps = [
    {
      num: '1 — Connect',
      desc: 'Link your meter and home devices to SmartSurge in minutes.'
    },
    {
      num: '2 — Monitor',
      desc: 'Watch live power and your estimated bill update in real time.'
    },
    {
      num: '3 — Control & save',
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

      {/* TOP NAVIGATION (MATCHING FIGMA 1:1) */}
      <header className="w-full flex items-stretch h-14 sm:h-16 bg-[#236144] shadow-sm z-50">
        
        {/* Left White Box with Brand Logo */}
        <div className="bg-white px-4 sm:px-6 md:px-8 flex items-center justify-center border-r border-gray-100 flex-shrink-0">
          <Link to="/" className="flex items-center">
            <img 
              src="/brand-logo-full.png" 
              alt="SmartSurge Logo" 
              className="h-9 sm:h-11 w-auto object-contain" 
            />
          </Link>
        </div>

        {/* Right Green Bar with Nav Links & Buttons */}
        <div className="flex-1 flex items-center justify-between px-3 sm:px-6 lg:px-10 overflow-x-auto no-scrollbar gap-2 sm:gap-4">
          
          {/* Navigation Links */}
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
            <a 
              href="#contact" 
              className="border border-white/80 hover:bg-white/10 text-white rounded-full px-3.5 sm:px-5 py-1 text-xs sm:text-sm font-medium tracking-wide transition"
            >
              Contact
            </a>
          </nav>

          {/* Action Buttons */}
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

      {/* HERO SECTION (FIGMA DESIGN - FLUSH EDGE TO EDGE) */}
      <section id="home" className="w-full relative overflow-hidden bg-white">
        
        {/* Full-width Hero Banner Artwork */}
        <img 
          src="/hero-banner.jpg" 
          alt="Take control of every watt in your home" 
          className="w-full h-auto block object-cover"
        />

        {/* Subtitle & Buttons Overlay (Always directly on the picture) */}
        <div className="flex flex-col items-center text-center absolute left-[4%] sm:left-[6%] lg:left-[8%] top-[63%] sm:top-[65%] lg:top-[66%] w-[46%] sm:w-[42%] lg:w-[38%] z-10">
          <p className="text-gray-600 text-[9px] sm:text-xs md:text-sm leading-snug sm:leading-relaxed mb-1.5 sm:mb-3.5 max-w-[260px] sm:max-w-sm">
            Monitor live power, predict your bill and control appliances<br className="hidden sm:inline" /> from one calm, simple dashboard.
          </p>
          <div className="flex items-center justify-center gap-1.5 sm:gap-3">
            <Link
              to="/register"
              className="bg-[#236144] hover:bg-[#1a4a34] text-white px-2.5 sm:px-5 lg:px-6 py-1 sm:py-2 rounded-full text-[9px] sm:text-xs md:text-sm font-semibold shadow-md flex items-center gap-1 transition duration-150"
            >
              <span>Get Started</span>
              <span className="text-amber-300 text-[10px] sm:text-xs">⚡</span>
            </Link>
            <a
              href="#how"
              className="bg-white hover:bg-gray-50 border border-gray-400 text-gray-800 px-2.5 sm:px-4 lg:px-5 py-1 sm:py-2 rounded-full text-[9px] sm:text-xs md:text-sm font-medium shadow-sm flex items-center gap-1 transition duration-150"
            >
              <span>See how it works</span>
              <span className="text-[8px] sm:text-[10px]">▶</span>
            </a>
          </div>
        </div>

      </section>

      {/* SECTION 2: EVERYTHING YOU NEED TO SAVE ENERGY */}
      <section id="features" className="bg-[#9CD49E] py-16 sm:py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          
          <h2 className="font-serif text-3xl sm:text-4xl text-[#113621] font-bold tracking-tight mb-2">
            Everything you need to save energy
          </h2>
          <p className="text-[#19432B] text-sm sm:text-base font-normal mb-12 max-w-xl mx-auto">
            Simple tools that make your home use less and cost less.
          </p>

          {/* 6 Feature Cards */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 sm:gap-5">
            {features.map((f, i) => (
              <div 
                key={i} 
                className="bg-white rounded-2xl p-5 text-center flex flex-col items-center justify-start shadow-sm border border-white/60 hover:shadow-md hover:-translate-y-1 transition duration-200"
              >
                <div className="w-12 h-12 rounded-full bg-[#EBF5ED] flex items-center justify-center mb-4">
                  {f.icon}
                </div>
                <h3 className="font-serif text-[#113621] font-bold text-sm mb-2 leading-snug">
                  {f.title}
                </h3>
                <p className="text-gray-500 text-xs leading-relaxed">
                  {f.desc}
                </p>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* SECTION 3: HOW IT WORKS */}
      <section id="how" className="py-20 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto text-center">
        <h2 className="font-serif text-3xl sm:text-4xl text-[#113621] font-bold tracking-tight mb-2">
          How it works
        </h2>
        <p className="text-gray-600 text-sm sm:text-base mb-12">
          Three simple steps from setup to savings.
        </p>

        {/* 3 Step Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
          {steps.map((s, idx) => (
            <div 
              key={idx} 
              className="bg-white rounded-2xl p-6 sm:p-7 border border-[#D5E4D8] shadow-sm hover:shadow-md transition duration-200"
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

      {/* SECTION 4: YOUR HOME, AT A GLANCE (LIVE DASHBOARD PREVIEW) */}
      <section className="bg-[#9CD49E] py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto text-center">
          
          <h2 className="font-serif text-3xl sm:text-4xl text-[#113621] font-bold tracking-tight mb-2">
            Your home, at a glance
          </h2>
          <p className="text-[#19432B] text-sm sm:text-base mb-10">
            A clean dashboard with the numbers that matter.
          </p>

          {/* Interactive Mockup Container */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-xl border border-white/80 text-left max-w-4xl mx-auto">
            
            {/* Mockup Tabs */}
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

            {/* Metrics Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              
              {/* Metric 1 */}
              <div className="bg-[#F8FAF7] rounded-2xl p-5 border border-[#E3EDE5]">
                <span className="block text-[11px] font-medium text-gray-500 mb-1">Live Power</span>
                <span className="block text-2xl sm:text-3xl font-serif font-bold text-[#113621] mb-3">1.84 kW</span>
                <div className="border-t border-gray-200/60 pt-3">
                  <span className="block text-xs font-semibold text-gray-700">Real-time monitoring</span>
                  <span className="block text-[11px] text-gray-500">See usage as it happens.</span>
                </div>
              </div>

              {/* Metric 2 */}
              <div className="bg-[#F8FAF7] rounded-2xl p-5 border border-[#E3EDE5]">
                <span className="block text-[11px] font-medium text-gray-500 mb-1">Estimated Bill</span>
                <span className="block text-2xl sm:text-3xl font-serif font-bold text-[#113621] mb-3">Rs. 8,420</span>
                <div className="border-t border-gray-200/60 pt-3">
                  <span className="block text-xs font-semibold text-gray-700">Bill prediction</span>
                  <span className="block text-[11px] text-gray-500">Know your cost before it lands.</span>
                </div>
              </div>

              {/* Metric 3 */}
              <div className="bg-[#F8FAF7] rounded-2xl p-5 border border-[#E3EDE5]">
                <span className="block text-[11px] font-medium text-gray-500 mb-1">Quick Controls</span>
                <span className="block text-sm font-semibold text-[#113621] mb-5 truncate">
                  Air Conditioner, Water Heater, Lights
                </span>
                <div className="border-t border-gray-200/60 pt-3">
                  <span className="block text-xs font-semibold text-gray-700">Remote control</span>
                  <span className="block text-[11px] text-gray-500">Manage appliances from anywhere.</span>
                </div>
              </div>

            </div>

            {/* Privacy Tag */}
            <div className="bg-[#EEF7F1] border border-[#D7EBDC] rounded-xl px-4 py-2.5 flex items-center gap-2 text-xs text-[#133C24]">
              <CheckCircle2 className="w-4 h-4 text-[#1E5735]" />
              <span>Private by design — Your usage data stays yours.</span>
            </div>

          </div>

        </div>
      </section>

      {/* SECTION 5: FREQUENTLY ASKED QUESTIONS */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto">
        <h2 className="font-serif text-3xl sm:text-4xl text-[#113621] font-bold tracking-tight text-center mb-12">
          Frequently Asked Questions
        </h2>

        <div className="flex flex-col gap-3.5">
          {faqs.map((f, i) => (
            <div 
              key={i} 
              className="bg-white rounded-2xl border border-[#D5E4D8] overflow-hidden shadow-sm transition"
            >
              <button
                onClick={() => setOpenFaq(openFaq === i ? null : i)}
                className="w-full text-left px-6 py-5 flex items-center justify-between gap-4 font-serif font-bold text-sm sm:text-base text-[#113621] hover:text-[#18482F] transition"
              >
                <span>{f.q}</span>
                {openFaq === i ? (
                  <ChevronUp className="w-4 h-4 text-gray-400 flex-shrink-0" />
                ) : (
                  <ChevronDown className="w-4 h-4 text-gray-400 flex-shrink-0" />
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

      {/* SECTION 6: CALL TO ACTION */}
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
            className="inline-flex items-center gap-2 bg-[#153B27] hover:bg-[#0E291B] text-white px-8 py-3 rounded-full text-sm font-semibold shadow-md transition duration-200"
          >
            <span>Get Started</span>
            <Zap className="w-4 h-4 fill-amber-300 text-amber-300" />
          </Link>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="bg-[#123120] text-gray-300 py-14 px-4 sm:px-6 lg:px-12">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-start md:items-center gap-8 border-b border-[#214A33] pb-10">
          
          {/* Footer Logo & Tagline */}
          <div className="max-w-sm">
            <div className="flex items-center gap-2.5 mb-3">
              <img 
                src="/brand-icon.png" 
                alt="SmartSurge Logo" 
                className="h-9 w-auto object-contain brightness-110" 
              />
              <span className="font-serif text-xl font-bold tracking-tight text-white">
                Smart<span className="text-[#D4AF37]">Surge</span>
              </span>
            </div>
            <p className="text-xs text-gray-400 leading-relaxed">
              Monitor live power, predict your bill and control appliances from one calm, simple dashboard.
            </p>
          </div>

          {/* Footer Navigation Links */}
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
