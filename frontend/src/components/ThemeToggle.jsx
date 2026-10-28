import React from 'react';
import { Sun, Moon } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

export default function ThemeToggle({ className = '', size = 'md' }) {
  const { isDark, toggleTheme } = useTheme();

  const isSmall = size === 'sm';

  return (
    <button
      onClick={toggleTheme}
      type="button"
      title={isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
      aria-label="Toggle theme"
      className={`relative inline-flex items-center justify-between rounded-full transition-all duration-300 focus:outline-none cursor-pointer ${
        isSmall ? 'w-13 h-7 p-0.5' : 'w-16 h-8 p-1'
      } ${
        isDark 
          ? 'bg-[#152e20] border border-emerald-500/50 shadow-[0_0_12px_rgba(16,185,129,0.35)]' 
          : 'bg-white/20 hover:bg-white/30 border border-white/60 shadow-xs'
      } ${className}`}
    >
      {/* Sun Icon (Light indicator) */}
      <span className={`flex items-center justify-center transition-opacity duration-200 ${
        isSmall ? 'w-5 h-5 ml-0.5' : 'w-6 h-6 ml-1'
      } ${isDark ? 'opacity-40 text-gray-400' : 'opacity-100 text-amber-300'}`}>
        <Sun size={isSmall ? 13 : 15} strokeWidth={2.5} />
      </span>

      {/* Moon Icon (Dark indicator) */}
      <span className={`flex items-center justify-center transition-opacity duration-200 ${
        isSmall ? 'w-5 h-5 mr-0.5' : 'w-6 h-6 mr-1'
      } ${isDark ? 'opacity-100 text-emerald-300' : 'opacity-40 text-white/70'}`}>
        <Moon size={isSmall ? 13 : 15} strokeWidth={2.5} />
      </span>

      {/* Moving Thumb Knob */}
      <div
        className={`absolute top-0.5 bottom-0.5 rounded-full bg-white shadow-md transition-transform duration-300 flex items-center justify-center ${
          isSmall ? 'w-6 h-6' : 'w-7 h-7'
        } ${
          isDark 
            ? isSmall ? 'translate-x-6 bg-gradient-to-tr from-emerald-400 to-emerald-200' : 'translate-x-8 bg-gradient-to-tr from-emerald-400 to-emerald-200 text-[#0f2e1e]'
            : 'translate-x-0 bg-white text-amber-500'
        }`}
      >
        {isDark ? (
          <Moon size={isSmall ? 12 : 14} className="text-[#0c2417]" strokeWidth={2.5} />
        ) : (
          <Sun size={isSmall ? 12 : 14} className="text-amber-500" strokeWidth={2.5} />
        )}
      </div>
    </button>
  );
}
