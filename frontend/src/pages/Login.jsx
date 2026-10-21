import React, { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { Fingerprint, Eye, EyeOff } from 'lucide-react';

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
      setError('Invalid email or password');
    }
  };

  return (
    <div 
      className="h-screen overflow-hidden bg-cover bg-center flex items-center justify-center lg:justify-end px-4 lg:px-24"
      style={{ backgroundImage: "url('/bg-login.jpg')" }}
    >
      {/* Glassmorphism Login Panel */}
      <div className="w-full max-w-md lg:max-w-lg bg-white/10 backdrop-blur-xl p-6 md:p-8 lg:p-10 rounded-[30px] border border-white/20 shadow-2xl text-center max-h-screen overflow-y-auto custom-scrollbar">
        
        {/* Logo */}
        <div className="flex justify-center mb-4">
          <img src="/brand-icon.png" alt="SmartSurge Logo" className="w-16 h-16 object-contain rounded-full" />
        </div>

        {/* Headings */}
        <h2 className="text-2xl md:text-3xl text-white mb-2 leading-tight" style={{ fontFamily: 'Georgia, serif' }}>
          Welcome back to <br/> SmartSurge
        </h2>
        <p className="text-gray-200 text-xs md:text-sm mb-6 font-light">
          Sign in to empower a smarter, greener tomorrow.
        </p>

        {error && <div className="bg-red-500/20 text-red-300 p-2 rounded-lg mb-4 text-xs border border-red-500/20">{error}</div>}

        <form onSubmit={handleSubmit} className="flex flex-col gap-4 text-left">
          {/* Email Input */}
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

          {/* Password Input */}
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
            
            {/* Forget Password */}
            <div className="flex justify-end mt-1.5">
              <a href="#" className="text-[11px] text-gray-300 hover:text-amber-200 transition">Forget Password?</a>
            </div>
          </div>

          {/* Login Button */}
          <button type="submit" className="w-full bg-[#1a1a1a] hover:bg-black text-gray-200 font-medium py-3 rounded-lg transition shadow-lg mt-1 border border-white/5 text-sm">
            Login
          </button>
        </form>

        {/* Social Login Buttons */}
        <div className="flex flex-col sm:flex-row gap-3 mt-5">
          <button className="flex-1 flex items-center justify-center gap-2 bg-white/90 hover:bg-white text-gray-800 py-2.5 rounded-lg transition text-xs font-medium">
            <svg className="w-3.5 h-3.5" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
            </svg>
            Continue with Google
          </button>
          <button className="flex-1 flex items-center justify-center gap-2 bg-white/90 hover:bg-white text-gray-800 py-2.5 rounded-lg transition text-xs font-medium">
            <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M17.05 20.28c-.98.95-2.05.8-3.08.35-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.35C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.04 2.26-.74 3.58-.74 1.48.06 2.65.62 3.48 1.6-3.04 1.74-2.58 5.92.51 7.15-.71 1.73-1.57 3.33-2.65 4.16zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.02 4.46-3.74 4.25z"/>
            </svg>
            Continue with Apple
          </button>
        </div>

        {/* Register Link */}
        <p className="mt-5 text-xs text-gray-300 font-light">
          Don't have an account? <Link to="/register" className="text-gray-100 font-medium hover:text-amber-200 transition">Register</Link>
        </p>

      </div>
    </div>
  );
};

export default Login;
