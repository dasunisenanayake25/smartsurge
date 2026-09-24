import React, { useState } from 'react';
import { Power, Zap, DollarSign, Fan, Refrigerator, Tv } from 'lucide-react';

const Dashboard = () => {
  // Simple state for toggles (just for demo purposes)
  const [appliances, setAppliances] = useState({
    ac: true,
    fridge: true,
    tv: false,
  });

  const toggleAppliance = (key) => {
    setAppliances({ ...appliances, [key]: !appliances[key] });
  };

  return (
    <div className="h-full overflow-hidden flex flex-col p-4 relative z-10 w-full max-w-7xl mx-auto gap-4">
        
        {/* Header Area */}
        <header className="flex justify-between items-end text-white border-b border-white/10 pb-2 flex-shrink-0">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold tracking-wide drop-shadow-lg">Smart Dashboard</h1>
            <p className="text-gray-200 mt-1 font-medium text-sm">Welcome back, Dasun</p>
          </div>
          <div className="text-right hidden md:block">
            <p className="text-lg font-semibold drop-shadow-md">{new Date().toLocaleDateString()}</p>
            <p className="text-xs text-green-400 font-medium">Live Status: Connected</p>
          </div>
        </header>

        {/* Top Cards Row (Glassmorphism) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 flex-shrink-0">
          {/* Card 1 */}
          <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-4 text-white shadow-[0_4px_16px_0_rgba(0,0,0,0.3)]">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-blue-500/30 rounded-xl border border-blue-400/30">
                <Zap className="text-blue-300" size={20} />
              </div>
              <h3 className="text-base font-medium text-gray-200 drop-shadow-sm">Live Power</h3>
            </div>
            <p className="text-3xl md:text-4xl font-bold drop-shadow-md">450 <span className="text-lg text-gray-300 font-normal">W</span></p>
          </div>

          {/* Card 2 */}
          <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-4 text-white shadow-[0_4px_16px_0_rgba(0,0,0,0.3)]">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-emerald-500/30 rounded-xl border border-emerald-400/30">
                <Power className="text-emerald-300" size={20} />
              </div>
              <h3 className="text-base font-medium text-gray-200 drop-shadow-sm">Today's Usage</h3>
            </div>
            <p className="text-3xl md:text-4xl font-bold drop-shadow-md">2.5 <span className="text-lg text-gray-300 font-normal">kWh</span></p>
          </div>

          {/* Card 3 */}
          <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-4 text-white shadow-[0_4px_16px_0_rgba(0,0,0,0.3)]">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-amber-500/30 rounded-xl border border-amber-400/30">
                <DollarSign className="text-amber-300" size={20} />
              </div>
              <h3 className="text-base font-medium text-gray-200 drop-shadow-sm">Est. Bill</h3>
            </div>
            <p className="text-3xl md:text-4xl font-bold drop-shadow-md"><span className="text-xl">Rs.</span> 1,250</p>
          </div>
        </div>

        {/* Middle Row - Analytics Chart (Dynamically takes remaining height) */}
        <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-4 text-white shadow-[0_4px_16px_0_rgba(0,0,0,0.3)] flex-1 flex flex-col min-h-0">
          <h3 className="text-lg font-medium mb-2 drop-shadow-sm flex-shrink-0">Energy History</h3>
          <div className="flex-1 border-2 border-dashed border-white/20 rounded-xl flex items-center justify-center bg-black/10 min-h-0">
             <p className="text-gray-300 text-sm">(Recharts Line Chart will be placed here)</p>
          </div>
        </div>

        {/* Bottom Row - Appliance Toggles */}
        <div className="flex-shrink-0">
          <h2 className="text-lg font-semibold text-white mb-3 drop-shadow-md">Appliance Control</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            
            {/* Appliance 1 */}
            <div className="bg-black/20 backdrop-blur-md border border-white/10 hover:border-white/30 transition-all rounded-2xl p-4 text-white shadow-lg flex justify-between items-center">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-white/10 rounded-full">
                  <Fan className={appliances.ac ? "text-cyan-400" : "text-gray-400"} size={22} />
                </div>
                <div>
                  <h4 className="font-semibold text-base">Master AC</h4>
                  <p className="text-xs text-gray-300">1200 W</p>
                </div>
              </div>
              
              <div 
                onClick={() => toggleAppliance('ac')}
                className={`w-12 h-7 rounded-full relative cursor-pointer transition-colors duration-300 border border-white/20 ${appliances.ac ? 'bg-emerald-500/80' : 'bg-gray-600/50'}`}
              >
                <div className={`w-5 h-5 bg-white rounded-full absolute top-[3px] transition-all duration-300 shadow-md ${appliances.ac ? 'left-[23px]' : 'left-[3px]'}`}></div>
              </div>
            </div>

            {/* Appliance 2 */}
            <div className="bg-black/20 backdrop-blur-md border border-white/10 hover:border-white/30 transition-all rounded-2xl p-4 text-white shadow-lg flex justify-between items-center">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-white/10 rounded-full">
                  <Refrigerator className={appliances.fridge ? "text-blue-300" : "text-gray-400"} size={22} />
                </div>
                <div>
                  <h4 className="font-semibold text-base">Smart Fridge</h4>
                  <p className="text-xs text-gray-300">150 W</p>
                </div>
              </div>
              
              <div 
                onClick={() => toggleAppliance('fridge')}
                className={`w-12 h-7 rounded-full relative cursor-pointer transition-colors duration-300 border border-white/20 ${appliances.fridge ? 'bg-emerald-500/80' : 'bg-gray-600/50'}`}
              >
                <div className={`w-5 h-5 bg-white rounded-full absolute top-[3px] transition-all duration-300 shadow-md ${appliances.fridge ? 'left-[23px]' : 'left-[3px]'}`}></div>
              </div>
            </div>

            {/* Appliance 3 */}
            <div className="bg-black/20 backdrop-blur-md border border-white/10 hover:border-white/30 transition-all rounded-2xl p-4 text-white shadow-lg flex justify-between items-center">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-white/10 rounded-full">
                  <Tv className={appliances.tv ? "text-purple-400" : "text-gray-400"} size={22} />
                </div>
                <div>
                  <h4 className="font-semibold text-base">Living Room TV</h4>
                  <p className="text-xs text-gray-300">80 W</p>
                </div>
              </div>
              
              <div 
                onClick={() => toggleAppliance('tv')}
                className={`w-12 h-7 rounded-full relative cursor-pointer transition-colors duration-300 border border-white/20 ${appliances.tv ? 'bg-emerald-500/80' : 'bg-gray-600/50'}`}
              >
                <div className={`w-5 h-5 bg-white rounded-full absolute top-[3px] transition-all duration-300 shadow-md ${appliances.tv ? 'left-[23px]' : 'left-[3px]'}`}></div>
              </div>
            </div>

          </div>
        </div>

    </div>
  );
};

export default Dashboard;
