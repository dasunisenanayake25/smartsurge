import React from 'react';
import { Link } from 'react-router-dom';
import { Activity, Leaf, Smartphone } from 'lucide-react';

const Landing = () => {
  return (
    <div className="min-h-screen bg-[#0F172A] text-white font-sans">
      {/* Navbar */}
      <nav className="flex justify-between items-center px-6 md:px-12 py-6 max-w-7xl mx-auto">
        <div className="flex items-center gap-3">
          <img src="/logo_transparent.png" alt="Logo" className="w-10 h-10 object-contain rounded-full shadow-[0_0_10px_rgba(251,191,36,0.5)]" />
          <span className="text-2xl font-bold tracking-tight">SmartSurge</span>
        </div>
        <div className="flex gap-4">
          <Link to="/login" className="px-5 py-2 text-gray-300 hover:text-white transition font-medium">Login</Link>
          <Link to="/register" className="px-5 py-2 bg-cyan-500 hover:bg-cyan-400 text-slate-900 font-semibold rounded-xl transition shadow-[0_0_15px_rgba(6,182,212,0.4)]">Get Started</Link>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="max-w-7xl mx-auto px-6 md:px-12 py-20 flex flex-col lg:flex-row items-center gap-16">
        <div className="flex-1 text-center lg:text-left">
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-extrabold leading-tight tracking-tighter mb-6">
            Take Control of Your <br/>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500">Energy Future.</span>
          </h1>
          <p className="text-gray-400 text-lg lg:text-xl mb-10 max-w-2xl mx-auto lg:mx-0">
            Monitor, optimize, and control your household electricity consumption in real-time. Reduce your carbon footprint and save on bills with our intelligent dashboard.
          </p>
          <Link to="/register" className="inline-block px-8 py-4 bg-white text-slate-900 font-bold rounded-xl hover:scale-105 transition-transform shadow-lg text-lg">
            Join SmartSurge Today
          </Link>
        </div>
        <div className="flex-1 w-full relative">
           <div className="absolute inset-0 bg-gradient-to-tr from-cyan-500/30 to-blue-500/30 blur-3xl rounded-full"></div>
           <img src="/bg-smarthome.jpg" alt="Smart Home" className="rounded-3xl shadow-2xl border border-white/10 relative z-10 object-cover h-[350px] md:h-[450px] w-full" />
        </div>
      </main>
      
      {/* Features */}
      <section className="bg-slate-900/50 py-20">
        <div className="max-w-7xl mx-auto px-6 md:px-12 grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-slate-800/50 p-8 rounded-3xl border border-white/5">
            <Activity className="text-cyan-400 mb-4" size={40} />
            <h3 className="text-xl font-bold mb-2">Real-time Monitoring</h3>
            <p className="text-gray-400">Track your power consumption live. Know exactly where your energy is going down to the exact watt.</p>
          </div>
          <div className="bg-slate-800/50 p-8 rounded-3xl border border-white/5">
            <Smartphone className="text-blue-400 mb-4" size={40} />
            <h3 className="text-xl font-bold mb-2">Remote Appliance Control</h3>
            <p className="text-gray-400">Turn your AC, Fridge, and TV on or off directly from your web dashboard, no matter where you are.</p>
          </div>
          <div className="bg-slate-800/50 p-8 rounded-3xl border border-white/5">
            <Leaf className="text-emerald-400 mb-4" size={40} />
            <h3 className="text-xl font-bold mb-2">Save Money & Earth</h3>
            <p className="text-gray-400">Estimate your monthly bill before it arrives and optimize usage to lower your carbon footprint.</p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Landing;
