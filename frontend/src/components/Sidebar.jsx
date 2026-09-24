import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Cpu, History, FileText, Settings, User, LogOut, Zap } from 'lucide-react';

const Sidebar = () => {
  const navItems = [
    { name: 'Dashboard', path: '/', icon: LayoutDashboard },
    { name: 'Appliances', path: '/appliances', icon: Cpu },
    { name: 'History', path: '/history', icon: History },
    { name: 'Reports', path: '/reports', icon: FileText },
    { name: 'Settings', path: '/settings', icon: Settings },
    { name: 'Profile', path: '/profile', icon: User },
  ];

  return (
    <aside className="w-24 md:w-28 h-screen bg-black/40 backdrop-blur-xl border-r border-white/10 flex flex-col items-center py-6 flex-shrink-0 z-50">
      
      {/* Logo Area */}
      <div className="mb-8 flex flex-col items-center justify-center mt-2">
        <img src="/logo_transparent.png" alt="Logo" className="w-12 h-12 object-contain rounded-full shadow-[0_0_15px_rgba(251,191,36,0.3)]" />
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 flex flex-col gap-4 w-full px-2">
        {navItems.map((item) => (
          <NavLink
            key={item.name}
            to={item.path}
            className={({ isActive }) =>
              `flex flex-col items-center justify-center w-20 h-20 mx-auto rounded-2xl transition-all duration-300 relative group ${
                isActive 
                  ? 'text-white bg-white/20 border border-white/10 shadow-lg' 
                  : 'text-gray-400 hover:text-white hover:bg-white/5'
              }`
            }
          >
            {({ isActive }) => (
              <>
                {/* Active Indicator Line on the left */}
                {isActive && (
                  <div className="absolute left-[-8px] top-1/2 -translate-y-1/2 w-1.5 h-8 bg-white rounded-r-full shadow-[0_0_8px_rgba(255,255,255,0.8)]"></div>
                )}
                <item.icon size={24} className="mb-1.5 drop-shadow-sm" />
                <span className="text-[10px] md:text-xs font-medium tracking-wide">{item.name}</span>
              </>
            )}
          </NavLink>
        ))}
      </nav>

      {/* Logout Button at bottom */}
      <div className="w-full px-3 mt-4">
        <button className="w-full flex flex-col items-center justify-center py-3 rounded-xl text-slate-400 hover:text-red-400 hover:bg-red-400/10 transition-all duration-300">
          <LogOut size={24} className="mb-1.5" />
          <span className="text-[10px] md:text-xs font-medium">Logout</span>
        </button>
      </div>

    </aside>
  );
};

export default Sidebar;
