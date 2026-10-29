import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Cpu, 
  History, 
  FileText, 
  Settings, 
  User, 
  LogOut,
  Menu,
  X
} from 'lucide-react';
import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import ThemeToggle from './ThemeToggle';

const Sidebar = () => {
  const { logout, user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const navItems = [
    { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { name: 'Appliances', path: '/appliances', icon: Cpu },
    { name: 'History', path: '/history', icon: History },
    { name: 'Reports', path: '/reports', icon: FileText },
    { name: 'Settings', path: '/settings', icon: Settings },
    { name: 'Profile', path: '/profile', icon: User },
  ];

  return (
    <>
      {/* ---------------- Mobile Top Navigation Bar ---------------- */}
      <div className="md:hidden w-full bg-[#123120] text-white px-4 py-3 flex items-center justify-between border-b border-[#1b432d] z-50 fixed top-0 left-0 right-0 h-14">
        <NavLink to="/dashboard" className="flex items-center gap-2.5">
          <img src="/brand-icon.png" alt="SmartSurge" className="w-8 h-8 rounded-full" />
          <span className="font-serif font-bold text-base tracking-tight text-white">
            Smart<span className="text-amber-400">Surge</span>
          </span>
        </NavLink>

        <div className="flex items-center gap-2">
          <ThemeToggle size="sm" />
          <button 
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-1.5 rounded-lg text-gray-200 hover:text-white hover:bg-white/10 transition"
            aria-label="Toggle Navigation Menu"
          >
            {mobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {/* ---------------- Mobile Drawer / Overlay ---------------- */}
      {mobileMenuOpen && (
        <div 
          className="md:hidden fixed inset-0 z-40 bg-black/60 backdrop-blur-xs animate-in fade-in"
          onClick={() => setMobileMenuOpen(false)}
        >
          <div 
            className="w-64 h-full bg-[#123120] text-white flex flex-col justify-between p-4 pt-16 shadow-2xl border-r border-[#1b432d]"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex flex-col gap-1.5">
              <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider px-3 mb-2">
                Navigation
              </span>
              {navItems.map((item) => (
                <NavLink
                  key={item.name}
                  to={item.path}
                  onClick={() => setMobileMenuOpen(false)}
                  className={({ isActive }) =>
                    `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition ${
                      isActive
                        ? 'bg-white/20 text-white font-bold'
                        : 'text-gray-300 hover:bg-white/10 hover:text-white'
                    }`
                  }
                >
                  <item.icon size={20} className="text-emerald-300" />
                  <span>{item.name}</span>
                </NavLink>
              ))}
            </div>

            <div className="pt-4 border-t border-white/10 flex flex-col gap-2">
              <div className="px-3 py-1 text-xs text-gray-300 truncate font-medium">
                {user?.name || 'Home Owner'}
              </div>
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  handleLogout();
                }}
                className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-red-300 hover:bg-red-500/20 hover:text-white transition w-full"
              >
                <LogOut size={20} />
                <span>Logout</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ---------------- Desktop / Tablet Compact Sidebar ---------------- */}
      <aside className="hidden md:flex w-24 md:w-28 h-screen bg-[#123120] border-r border-[#1b432d] flex-col items-center py-4 px-1 flex-shrink-0 z-50 shadow-md overflow-y-auto no-scrollbar justify-between">
        {/* Top Logo */}
        <div className="mb-2 flex flex-col items-center justify-center flex-shrink-0">
          <NavLink to="/" title="Back to Home" className="transition-transform hover:scale-105 active:scale-95">
            <img src="/brand-icon.png" alt="Logo" className="w-11 h-11 object-contain rounded-full shadow-[0_0_15px_rgba(251,191,36,0.3)] cursor-pointer" />
          </NavLink>
        </div>

        {/* Nav items list */}
        <nav className="flex flex-col gap-2 w-full px-1 flex-shrink-0">
          {navItems.map((item) => (
            <NavLink
              key={item.name}
              to={item.path}
              className={({ isActive }) =>
                `flex flex-col items-center justify-center w-full py-2 mx-auto rounded-xl transition-all duration-200 relative group ${
                  isActive 
                    ? 'text-white bg-white/20 border border-white/10 shadow-sm' 
                    : 'text-gray-400 hover:text-white hover:bg-white/5'
                }`
              }
            >
              {({ isActive }) => (
                <>
                  {isActive && (
                    <div className="absolute left-[-4px] top-1/2 -translate-y-1/2 w-1.5 h-6 bg-white rounded-r-full shadow-[0_0_8px_rgba(255,255,255,0.8)]"></div>
                  )}
                  <item.icon size={22} className="mb-0.5 drop-shadow-sm" />
                  <span className="text-xs sm:text-[12.5px] font-medium tracking-wide">{item.name}</span>
                </>
              )}
            </NavLink>
          ))}
        </nav>

        {/* Bottom Actions: Theme Toggle & Logout Button */}
        <div className="w-full px-2 pt-2 border-t border-white/10 flex flex-col items-center gap-2 flex-shrink-0">
          <ThemeToggle size="sm" />
          <button 
            onClick={handleLogout}
            title="Logout of SmartSurge"
            className="w-full flex flex-col items-center justify-center py-2 rounded-xl text-red-300 hover:text-white hover:bg-red-500/20 active:scale-95 transition-all duration-200 cursor-pointer"
          >
            <LogOut size={22} className="mb-0.5 text-red-400 group-hover:text-red-300" />
            <span className="text-xs sm:text-[12.5px] font-medium text-red-300">Logout</span>
          </button>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
