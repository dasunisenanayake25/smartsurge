import React, { useContext } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { LayoutDashboard, Cpu, History, FileText, Settings, User, LogOut } from 'lucide-react';
import { AuthContext } from '../context/AuthContext';
import ThemeToggle from './ThemeToggle';

const Sidebar = () => {
  const { logout } = useContext(AuthContext);
  const navigate = useNavigate();
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
    <aside className="w-24 md:w-28 h-screen bg-[#123120] border-r border-[#1b432d] flex flex-col items-center py-4 px-1 flex-shrink-0 z-50 shadow-md overflow-y-auto no-scrollbar justify-between">
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
                <item.icon size={20} className="mb-0.5 drop-shadow-sm" />
                <span className="text-[10px] md:text-[11px] font-medium tracking-wide">{item.name}</span>
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
          <LogOut size={20} className="mb-0.5 text-red-400 group-hover:text-red-300" />
          <span className="text-[10px] md:text-[11px] font-medium text-red-300">Logout</span>
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
