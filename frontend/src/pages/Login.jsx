import React, { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { Eye, EyeOff } from 'lucide-react';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await login(email, password);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Invalid credentials');
    }
  };

  return (
    <div 
      className="h-screen overflow-hidden bg-cover bg-center flex items-center justify-center lg:justify-end px-4 lg:px-24"
      style={{ backgroundImage: "url('/bg-login.jpg')" }}
    >
      <div className="w-full max-w-md lg:max-w-lg bg-white/10 backdrop-blur-xl p-6 md:p-8 lg:p-10 rounded-[30px] border border-white/20 shadow-2xl text-center max-h-screen overflow-y-auto custom-scrollbar">
        <div className="flex justify-center mb-4">
          <img src="/brand-icon.png" alt="SmartSurge Logo" className="w-16 h-16 object-contain rounded-full" />
        </div>

        <h2 className="text-2xl md:text-3xl text-white mb-2 leading-tight" style={{ fontFamily: 'Georgia, serif' }}>
          Welcome back to <br/> Smart<span className="text-amber-300">Surge</span>
        </h2>
        <p className="text-gray-200 text-xs md:text-sm mb-6 font-light">
          Sign in to empower a smarter, greener tomorrow.
        </p>

        {error && <div className="bg-red-500/20 text-red-300 p-2 rounded-lg mb-4 text-xs border border-red-500/20">{error}</div>}

        <form onSubmit={handleSubmit} className="flex flex-col gap-4 text-left">
          <div>
            <label className="block text-xs text-gray-200 mb-1.5 ml-1">Your Email</label>
            <input 
              type="email" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full bg-black/20 border border-white/30 text-white placeholder-gray-400 rounded-lg px-4 py-2.5 focus:outline-none focus:border-amber-300 transition text-sm"
              placeholder="Enter your registered email here"
            />
          </div>

          <div>
            <label className="block text-xs text-gray-200 mb-1.5 ml-1">Password</label>
            <div className="relative">
              <input 
                type={showPassword ? "text" : "password"} 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full bg-black/20 border border-white/30 text-white placeholder-gray-400 rounded-lg px-4 py-2.5 pr-12 focus:outline-none focus:border-amber-300 transition text-sm"
                placeholder="Enter your secure password here"
              />
              <button 
                type="button" 
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition"
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
            
            <div className="flex justify-end mt-1.5">
              <a href="#" className="text-[11px] text-gray-300 hover:text-amber-200 transition">Forget Password?</a>
            </div>
          </div>

          <button type="submit" className="w-full bg-[#1a1a1a] hover:bg-black text-gray-200 font-medium py-3 rounded-lg transition shadow-lg mt-1 border border-white/5 text-sm">
            Login
          </button>

          <button 
            type="button" 
            onClick={async () => {
              setEmail('demo@smartsurge.com');
              setPassword('123456');
              setError('');
              try {
                await login('demo@smartsurge.com', '123456');
                navigate('/dashboard');
              } catch (err) {
                setError(err.response?.data?.message || 'Demo login failed');
              }
            }}
            className="w-full bg-amber-400/90 hover:bg-amber-400 text-black font-bold py-2.5 rounded-lg transition shadow-md border border-amber-300 text-xs flex items-center justify-center gap-1.5"
          >
            <span>⚡ One-Click Demo Login (Instant Access)</span>
          </button>
        </form>

        <p className="mt-5 text-xs text-gray-300 font-light">
          Don't have an account? <Link to="/register" className="text-gray-100 font-medium hover:text-amber-200 transition">Register</Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
