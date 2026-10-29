import React, { useState, useEffect } from 'react';
import { getSocket } from '../services/socket';
import { AlertTriangle, X, Zap, ShieldAlert } from 'lucide-react';

export default function SurgeToast() {
  const [surgeAlert, setSurgeAlert] = useState(null);
  const [dismissedUntil, setDismissedUntil] = useState(0);

  useEffect(() => {
    const socket = getSocket();

    const handleUpdate = (data) => {
      if (data && data.powerWatt !== undefined) {
        const watt = Math.round(data.powerWatt);
        const now = Date.now();

        // Trigger threshold: Watts > 1800W
        if (watt >= 1800) {
          // If not currently in snooze/dismiss period
          if (now > dismissedUntil) {
            setSurgeAlert({
              watts: watt,
              voltage: data.voltage || 230,
              time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
            });
          }
        } else {
          // If load drops back to normal (< 1800W), clear alert automatically
          setSurgeAlert(null);
        }
      }
    };

    socket.on('energyUpdate', handleUpdate);

    return () => {
      socket.off('energyUpdate', handleUpdate);
    };
  }, [dismissedUntil]);

  const handleDismiss = () => {
    setSurgeAlert(null);
    // Snooze toast for 30 seconds so it doesn't repeatedly pop up
    setDismissedUntil(Date.now() + 30000);
  };

  if (!surgeAlert) return null;

  return (
    <div className="fixed top-5 right-5 z-[9999] max-w-sm w-full animate-in slide-in-from-top-4 fade-in duration-300">
      <div className="bg-white/95 backdrop-blur-md border-2 border-rose-500/80 rounded-2xl p-4 shadow-[0_10px_25px_-5px_rgba(225,29,72,0.3)] flex items-start gap-3.5 relative overflow-hidden">
        
        {/* Glowing side accent */}
        <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-rose-600 animate-pulse"></div>

        <div className="p-2.5 bg-rose-100 text-rose-700 rounded-xl flex-shrink-0 mt-0.5">
          <ShieldAlert size={22} className="animate-bounce" />
        </div>

        <div className="flex-1 pr-6">
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 bg-rose-100 text-rose-800 rounded-md">
              High Load Surge
            </span>
            <span className="text-[10px] text-gray-400 font-mono">{surgeAlert.time}</span>
          </div>

          <h4 className="text-sm font-bold text-gray-900 mt-1">
            Overload Risk: <span className="text-rose-600 font-mono">{surgeAlert.watts} W</span>
          </h4>

          <p className="text-xs text-gray-600 mt-0.5 leading-relaxed">
            Live household demand exceeds safety ceiling (1,800W). Risk of tripping breaker. Consider switching off secondary HVAC or heating units.
          </p>
        </div>

        <button
          onClick={handleDismiss}
          className="absolute top-3 right-3 text-gray-400 hover:text-gray-700 p-1 rounded-lg hover:bg-gray-100 transition"
          title="Dismiss for 30 seconds"
        >
          <X size={16} />
        </button>
      </div>
    </div>
  );
}
