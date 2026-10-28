import { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { Zap, LogOut, LayoutDashboard, Cpu } from 'lucide-react';

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="bg-cardBg border-b border-slate-700 px-6 py-4 flex justify-between items-center shadow-lg">
      <Link to="/" className="flex items-center gap-2 text-xl font-bold text-electricBlue">
        <Zap className="text-solarAmber fill-solarAmber" />
        <span>SmartSurge</span>
      </Link>

      {user ? (
        <div className="flex items-center gap-6">
          <Link to="/" className="flex items-center gap-1 hover:text-electricBlue transition">
            <LayoutDashboard size={18} /> Dashboard
          </Link>
          <Link to="/appliances" className="flex items-center gap-1 hover:text-electricBlue transition">
            <Cpu size={18} /> Appliances
          </Link>
          
          <div className="flex items-center gap-4 pl-4 border-l border-slate-600">
            <span className="text-sm font-medium text-slate-300">
              {user.name}
            </span>
            <button
              onClick={handleLogout}
              className="flex items-center gap-1 text-sm bg-red-500/10 text-red-400 hover:bg-red-500/20 px-3 py-1.5 rounded-lg border border-red-500/30 transition"
            >
              <LogOut size={16} /> Logout
            </button>
          </div>
        </div>
      ) : (
        <div className="flex items-center gap-4">
          <Link to="/login" className="text-sm hover:text-electricBlue transition">
            Login
          </Link>
          <Link
            to="/register"
            className="text-sm bg-electricBlue hover:bg-blue-600 px-4 py-2 rounded-lg font-semibold text-white transition"
          >
            Register
          </Link>
        </div>
      )}
    </nav>
  );
};

export default Navbar;