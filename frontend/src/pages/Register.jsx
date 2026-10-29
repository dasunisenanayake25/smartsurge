import React, { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { Eye, EyeOff } from 'lucide-react';

const Register = () => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState('');
  
  const { register } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    try {
      const fullName = `${firstName} ${lastName}`.trim();
      await register(fullName, email, password);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed');
    }
  };

  return (
    <div 
      className="h-screen overflow-hidden bg-cover bg-center flex items-center justify-center lg:justify-end px-4 lg:px-24"
      style={{ backgroundImage: "url('/bg-register.jpg')" }}
    >
      <div className="w-full max-w-md lg:max-w-lg bg-white/10 backdrop-blur-xl p-6 md:p-8 lg:p-10 rounded-[30px] border border-white/20 shadow-2xl text-center max-h-screen overflow-y-auto custom-scrollbar">
        <div className="flex justify-center mb-3">
          <Link to="/" title="Back to Home" className="transition-transform hover:scale-105 active:scale-95 inline-block">
            <img src="/brand-icon.png" alt="SmartSurge Logo" className="w-16 h-16 object-contain rounded-full shadow-[0_0_15px_rgba(251,191,36,0.25)]" />
          </Link>
        </div>

        <h2 className="text-2xl md:text-3xl text-white mb-2 leading-tight" style={{ fontFamily: 'Georgia, serif' }}>
          Welcome to <br/> Smart<span className="text-amber-300">Surge</span>
        </h2>
        <p className="text-gray-200 text-xs md:text-sm mb-4 font-light">
          Create an account to manage your smart network.
        </p>

        <h3 className="text-lg text-white mb-4" style={{ fontFamily: 'Georgia, serif' }}>Create an Account</h3>

        {error && <div className="bg-red-500/20 text-red-300 p-2 rounded-lg mb-3 text-xs border border-red-500/20">{error}</div>}

        <form onSubmit={handleSubmit} className="flex flex-col gap-3.5 text-left">
          <div className="flex flex-col sm:flex-row gap-3.5">
            <div className="flex-1">
              <label className="block text-[11px] text-gray-200 mb-1 ml-1">First Name</label>
              <input 
                type="text" 
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                required
                className="w-full bg-black/20 border border-white/30 text-white placeholder-gray-400 rounded-lg px-3 py-2 focus:outline-none focus:border-amber-300 transition text-[13px]"
                placeholder="Enter your first name"
              />
            </div>
            <div className="flex-1">
              <label className="block text-[11px] text-gray-200 mb-1 ml-1">Last Name</label>
              <input 
                type="text" 
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                required
                className="w-full bg-black/20 border border-white/30 text-white placeholder-gray-400 rounded-lg px-3 py-2 focus:outline-none focus:border-amber-300 transition text-[13px]"
                placeholder="Enter your last name"
              />
            </div>
          </div>

          <div>
            <label className="block text-[11px] text-gray-200 mb-1 ml-1">Your Email</label>
            <input 
              type="email" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full bg-black/20 border border-white/30 text-white placeholder-gray-400 rounded-lg px-3 py-2 focus:outline-none focus:border-amber-300 transition text-[13px]"
              placeholder="Enter your email here"
            />
          </div>

          <div className="flex flex-col sm:flex-row gap-3.5">
            <div className="flex-1">
              <label className="block text-[11px] text-gray-200 mb-1 ml-1">Password</label>
              <div className="relative">
                <input 
                  type={showPassword ? "text" : "password"} 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="w-full bg-black/20 border border-white/30 text-white placeholder-gray-400 rounded-lg px-3 py-2 pr-10 focus:outline-none focus:border-amber-300 transition text-[13px]"
                  placeholder="Enter your secure password here"
                />
                <button 
                  type="button" 
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition"
                >
                  {showPassword ? <EyeOff size={14} /> : <Eye size={14} />}
                </button>
              </div>
            </div>
            
            <div className="flex-1">
              <label className="block text-[11px] text-gray-200 mb-1 ml-1">Confirm Password</label>
              <div className="relative">
                <input 
                  type={showConfirmPassword ? "text" : "password"} 
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  className="w-full bg-black/20 border border-white/30 text-white placeholder-gray-400 rounded-lg px-3 py-2 pr-10 focus:outline-none focus:border-amber-300 transition text-[13px]"
                  placeholder="Re-enter your password here"
                />
                <button 
                  type="button" 
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition"
                >
                  {showConfirmPassword ? <EyeOff size={14} /> : <Eye size={14} />}
                </button>
              </div>
            </div>
          </div>

          <button type="submit" className="w-full bg-[#1a1a1a] hover:bg-black text-gray-200 font-medium py-2.5 rounded-lg transition shadow-lg mt-1 border border-white/5 text-[13px]">
            Register
          </button>
        </form>

        <p className="mt-5 text-xs text-gray-300 font-light">
          Already have an account? <Link to="/login" className="text-gray-100 font-medium hover:text-amber-200 transition">Login</Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
