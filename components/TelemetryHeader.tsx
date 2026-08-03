import React, { useState, useEffect } from 'react';
import { Radio, Activity, Globe, Cpu, Zap, Shield, Sparkles } from 'lucide-react';
import { sciFiAudio } from './SoundEffects';

export const TelemetryHeader: React.FC = () => {
  const [solarIndex, setSolarIndex] = useState<string>('Normal (SFU 112)');
  const [orbitAltitude, setOrbitAltitude] = useState<number>(408.2);
  const [velocity, setVelocity] = useState<number>(7.66);
  const [dataFrame, setDataFrame] = useState<number>(88402);

  useEffect(() => {
    const interval = setInterval(() => {
      setOrbitAltitude(prev => Number((408.1 + Math.sin(Date.now() / 2000) * 0.4).toFixed(2)));
      setVelocity(prev => Number((7.66 + Math.cos(Date.now() / 3000) * 0.02).toFixed(2)));
      setDataFrame(prev => prev + 1);
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="w-full bg-[#070b12] border-b border-slate-800/80 px-4 py-2 font-mono text-[11px] text-slate-300 flex items-center justify-between overflow-x-auto whitespace-nowrap gap-4 select-none">
      {/* Telemetry Status Lights */}
      <div className="flex items-center gap-4 shrink-0">
        <div className="flex items-center gap-1.5 bg-emerald-500/10 border border-emerald-500/30 px-2.5 py-1 rounded-md text-emerald-400 font-bold">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
          <Radio className="w-3.5 h-3.5" />
          <span>TELEMETRY LINK: ACTIVE</span>
        </div>

        <div className="flex items-center gap-2 text-slate-400">
          <Activity className="w-3.5 h-3.5 text-cyan-400" />
          <span>ISS ORBIT: <strong className="text-white">{orbitAltitude} km</strong></span>
        </div>

        <div className="flex items-center gap-2 text-slate-400">
          <Zap className="w-3.5 h-3.5 text-amber-400" />
          <span>VELOCITY: <strong className="text-white">{velocity} km/s</strong></span>
        </div>

        <div className="hidden md:flex items-center gap-2 text-slate-400">
          <Globe className="w-3.5 h-3.5 text-indigo-400" />
          <span>SOLAR FLARE INDEX: <strong className="text-emerald-400">{solarIndex}</strong></span>
        </div>

        <div className="hidden lg:flex items-center gap-2 text-slate-400">
          <Cpu className="w-3.5 h-3.5 text-rose-400" />
          <span>GEMINI NANO PHYSICS ENGINE: <strong className="text-emerald-400">ONLINE</strong></span>
        </div>
      </div>

      {/* Frame Counter & System Protocol */}
      <div className="flex items-center gap-3 text-[10px] text-slate-500 shrink-0">
        <span className="bg-slate-900 border border-slate-800 px-2 py-0.5 rounded text-slate-400">
          FRAME: #{dataFrame}
        </span>
        <span className="hidden xl:inline">ZPERIOD_PROTOCOL_v4.2</span>
      </div>
    </div>
  );
};
