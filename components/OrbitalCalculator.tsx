import React, { useState, useMemo, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Rocket, Gauge, Play, RotateCcw, AlertTriangle, CheckCircle2, ShieldAlert, Sparkles } from 'lucide-react';
import { sciFiAudio } from './SoundEffects';

export const OrbitalCalculator: React.FC = () => {
  // Simulator Inputs
  const [payloadMass, setPayloadMass] = useState<number>(5000); // kg
  const [thrust, setThrust] = useState<number>(7600); // kN
  const [targetAltitude, setTargetAltitude] = useState<number>(400); // km

  // Launch animation simulation state
  const [isLaunching, setIsLaunching] = useState<boolean>(false);
  const [launchProgress, setLaunchProgress] = useState<number>(0); // 0 to 1
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Constants
  const MU = 398600.4418; // Earth gravitational parameter km^3/s^2
  const EARTH_RADIUS = 6371; // km
  const DRY_MASS = 25000; // kg rocket dry mass
  const FUEL_MASS = 280000; // kg propellant mass

  // Calculations
  const physics = useMemo(() => {
    const totalMassKg = DRY_MASS + FUEL_MASS + payloadMass; // total wet mass at liftoff
    const totalWeightN = totalMassKg * 9.80665;
    const thrustN = thrust * 1000;

    // Thrust to Weight Ratio at liftoff
    const twr = thrustN / totalWeightN;

    // Orbital radius
    const r = EARTH_RADIUS + targetAltitude; // km

    // Circular orbital speed: v = sqrt(mu / r) in km/s
    const orbitalSpeed = Math.sqrt(MU / r); // km/s

    // Orbital Period T = 2 * pi * sqrt(r^3 / mu) in seconds
    const periodSeconds = 2 * Math.PI * Math.sqrt(Math.pow(r, 3) / MU);
    const periodMinutes = (periodSeconds / 60).toFixed(1);

    // Delta-V required (rough rocket equation estimate with ISP 310s)
    const isp = 310; // seconds
    const g0 = 9.80665; // m/s^2
    const m0 = totalMassKg;
    const mf = DRY_MASS + payloadMass; // dry final mass
    const deltaVAvailable = (isp * g0 * Math.log(m0 / mf) / 1000).toFixed(2); // km/s

    // Status evaluation
    let statusText = '';
    let statusColor = '';
    let isStable = false;

    if (twr < 1.0) {
      statusText = 'CRITICAL ERROR: TWR < 1.0 — THRUST INSUFFICIENT TO LEAVE LAUNCH PAD';
      statusColor = 'text-rose-400 bg-rose-500/10 border-rose-500/40';
    } else if (twr < 1.25) {
      statusText = 'WARNING: MARGINAL THRUST — HIGH GRAVITY & ATMOSPHERIC DRAG LOSSES';
      statusColor = 'text-amber-400 bg-amber-500/10 border-amber-500/40';
    } else if (targetAltitude < 150) {
      statusText = 'SUB-ORBITAL BALLISTIC TRAJECTORY — ALTITUDE BELOW DENSE ATMOSPHERE';
      statusColor = 'text-amber-400 bg-amber-500/10 border-amber-500/40';
    } else if (targetAltitude <= 2000) {
      statusText = 'SUCCESS: STABLE LOW EARTH ORBIT (LEO) TRAJECTORY CONFIRMED';
      statusColor = 'text-emerald-400 bg-emerald-500/10 border-emerald-500/40';
      isStable = true;
    } else if (targetAltitude <= 35786) {
      statusText = 'SUCCESS: MEDIUM / HIGH EARTH ORBIT (MEO/HEO) INSERTION CONFIRMED';
      statusColor = 'text-cyan-400 bg-cyan-500/10 border-cyan-500/40';
      isStable = true;
    } else {
      statusText = 'DEEP SPACE / HYPERBOLIC ESCAPE TRAJECTORY ACHIEVED';
      statusColor = 'text-purple-400 bg-purple-500/10 border-purple-500/40';
      isStable = true;
    }

    return {
      totalMassKg,
      twr: Number(twr.toFixed(2)),
      orbitalSpeed: Number(orbitalSpeed.toFixed(2)),
      periodMinutes,
      deltaVAvailable,
      statusText,
      statusColor,
      isStable
    };
  }, [payloadMass, thrust, targetAltitude]);

  // Handle Launch Trigger
  const handleStartLaunch = () => {
    sciFiAudio.playBeep();
    setIsLaunching(true);
    setLaunchProgress(0);
  };

  // Canvas trajectory render
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    let startTime = Date.now();

    const render = () => {
      const width = (canvas.width = canvas.parentElement?.clientWidth || 500);
      const height = (canvas.height = 320);

      ctx.clearRect(0, 0, width, height);

      const centerX = width / 2;
      const centerY = height / 2;
      const earthRadiusPx = 55;

      // Draw Earth
      ctx.beginPath();
      ctx.arc(centerX, centerY, earthRadiusPx, 0, Math.PI * 2);
      ctx.fillStyle = '#0f2b38';
      ctx.fill();
      ctx.lineWidth = 2;
      ctx.strokeStyle = '#00f0ff';
      ctx.stroke();

      // Earth atmosphere glow
      const glowGrad = ctx.createRadialGradient(centerX, centerY, earthRadiusPx, centerX, centerY, earthRadiusPx + 15);
      glowGrad.addColorStop(0, 'rgba(0, 240, 255, 0.25)');
      glowGrad.addColorStop(1, 'rgba(0, 240, 255, 0)');
      ctx.fillStyle = glowGrad;
      ctx.beginPath();
      ctx.arc(centerX, centerY, earthRadiusPx + 15, 0, Math.PI * 2);
      ctx.fill();

      // Label Earth
      ctx.fillStyle = '#ffffff';
      ctx.font = '10px monospace';
      ctx.textAlign = 'center';
      ctx.fillText('EARTH', centerX, centerY + 3);

      // Target Orbit Ring Radius (scaled)
      const targetOrbitPx = earthRadiusPx + Math.min(100, Math.max(25, (targetAltitude / 2000) * 75 + 25));

      // Draw Orbit Path
      ctx.beginPath();
      ctx.setLineDash([4, 4]);
      ctx.arc(centerX, centerY, targetOrbitPx, 0, Math.PI * 2);
      ctx.strokeStyle = physics.isStable ? 'rgba(52, 211, 153, 0.6)' : 'rgba(244, 63, 94, 0.5)';
      ctx.lineWidth = 1.5;
      ctx.stroke();
      ctx.setLineDash([]);

      // Orbit Altitude Label
      ctx.fillStyle = physics.isStable ? '#34d399' : '#f43f5e';
      ctx.font = '9px monospace';
      ctx.fillText(`TARGET ORBIT: ${targetAltitude} km`, centerX, centerY - targetOrbitPx - 8);

      // Rocket position on orbit / trajectory
      const timeElapsed = (Date.now() - startTime) / 1000;
      const speedFactor = 0.5;
      const angle = isLaunching 
        ? Math.min(Math.PI * 2, timeElapsed * speedFactor) 
        : (timeElapsed * 0.3) % (Math.PI * 2);

      // If launched, transition from surface to target orbit
      let currentR = targetOrbitPx;
      if (isLaunching) {
        const progress = Math.min(1, timeElapsed / 3);
        currentR = earthRadiusPx + (targetOrbitPx - earthRadiusPx) * progress;
        if (progress >= 1) {
          setIsLaunching(false);
          sciFiAudio.playSuccess();
        }
      }

      const rocketX = centerX + Math.cos(angle) * currentR;
      const rocketY = centerY + Math.sin(angle) * currentR;

      // Rocket Icon / Marker
      ctx.beginPath();
      ctx.arc(rocketX, rocketY, 5, 0, Math.PI * 2);
      ctx.fillStyle = '#34d399';
      ctx.fill();
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 1.5;
      ctx.stroke();

      // Velocity Vector line
      const vx = -Math.sin(angle) * 18;
      const vy = Math.cos(angle) * 18;
      ctx.beginPath();
      ctx.moveTo(rocketX, rocketY);
      ctx.lineTo(rocketX + vx, rocketY + vy);
      ctx.strokeStyle = '#00f0ff';
      ctx.lineWidth = 2;
      ctx.stroke();

      animId = requestAnimationFrame(render);
    };

    render();

    return () => cancelAnimationFrame(animId);
  }, [targetAltitude, physics.isStable, isLaunching]);

  return (
    <div className="bg-[#0b0f17] border border-slate-800 rounded-3xl p-6 space-y-6 shadow-2xl relative overflow-hidden">
      {/* Header Title */}
      <div className="flex items-center justify-between border-b border-slate-800 pb-4 flex-wrap gap-2">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400">
            <Rocket className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-white font-mono uppercase tracking-tight">
              Orbital Launch & Trajectory Calculator
            </h3>
            <p className="text-xs text-slate-400 font-mono">
              Simulated Keplerian Mechanics & Liftoff Thrust-to-Weight Engine
            </p>
          </div>
        </div>

        <button
          onClick={handleStartLaunch}
          disabled={isLaunching}
          className="px-4 py-2 rounded-xl bg-emerald-400 hover:bg-emerald-300 text-black font-mono font-bold text-xs uppercase tracking-wider transition-all flex items-center gap-2 cursor-pointer shadow-lg shadow-emerald-400/20 disabled:opacity-50"
        >
          <Play className="w-4 h-4 fill-current" />
          <span>{isLaunching ? 'SIMULATING LAUNCH...' : 'SIMULATE LAUNCH'}</span>
        </button>
      </div>

      {/* Main Grid: Controls vs Visual Orbit Canvas */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column: Input Sliders */}
        <div className="lg:col-span-6 space-y-5 bg-slate-950/80 p-5 rounded-2xl border border-slate-800">
          
          {/* Slider 1: Payload Mass */}
          <div className="space-y-2">
            <div className="flex justify-between items-center text-xs font-mono">
              <label className="text-slate-300 font-bold uppercase">{"Payload Mass ($m_{payload}$)"}</label>
              <span className="text-emerald-400 font-bold">{payloadMass.toLocaleString()} kg</span>
            </div>
            <input
              type="range"
              min="500"
              max="50000"
              step="500"
              value={payloadMass}
              onChange={(e) => setPayloadMass(Number(e.target.value))}
              className="w-full accent-emerald-400 bg-slate-900 h-2 rounded-lg cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-slate-500 font-mono">
              <span>500 kg (SmallSat)</span>
              <span>25,000 kg (Commercial)</span>
              <span>50,000 kg (Heavy)</span>
            </div>
          </div>

          {/* Slider 2: Thrust */}
          <div className="space-y-2">
            <div className="flex justify-between items-center text-xs font-mono">
              <label className="text-slate-300 font-bold uppercase">Liftoff Thrust ($T$)</label>
              <span className="text-cyan-400 font-bold">{thrust.toLocaleString()} kN</span>
            </div>
            <input
              type="range"
              min="1000"
              max="25000"
              step="200"
              value={thrust}
              onChange={(e) => setThrust(Number(e.target.value))}
              className="w-full accent-cyan-400 bg-slate-900 h-2 rounded-lg cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-slate-500 font-mono">
              <span>1,000 kN</span>
              <span>7,600 kN (Falcon 9)</span>
              <span>25,000 kN (Saturn V / SLS)</span>
            </div>
          </div>

          {/* Slider 3: Target Orbit Altitude */}
          <div className="space-y-2">
            <div className="flex justify-between items-center text-xs font-mono">
              <label className="text-slate-300 font-bold uppercase">Target Altitude ($h$)</label>
              <span className="text-purple-400 font-bold">{targetAltitude.toLocaleString()} km</span>
            </div>
            <input
              type="range"
              min="150"
              max="35786"
              step="50"
              value={targetAltitude}
              onChange={(e) => setTargetAltitude(Number(e.target.value))}
              className="w-full accent-purple-400 bg-slate-900 h-2 rounded-lg cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-slate-500 font-mono">
              <span>150 km (LEO)</span>
              <span>400 km (ISS)</span>
              <span>35,786 km (GEO)</span>
            </div>
          </div>

          {/* Status Message Box */}
          <div className={`p-3.5 rounded-xl border text-xs font-mono leading-relaxed font-bold flex items-center gap-2.5 ${physics.statusColor}`}>
            {physics.twr < 1.0 ? (
              <AlertTriangle className="w-5 h-5 shrink-0" />
            ) : (
              <CheckCircle2 className="w-5 h-5 shrink-0" />
            )}
            <span>{physics.statusText}</span>
          </div>
        </div>

        {/* Right Column: Interactive Orbital Canvas & Realtime Physics */}
        <div className="lg:col-span-6 flex flex-col justify-between space-y-4">
          {/* Canvas Display */}
          <div className="bg-slate-950 rounded-2xl border border-slate-800 p-2 relative overflow-hidden flex items-center justify-center">
            <canvas ref={canvasRef} className="w-full h-[220px]" />
            <div className="absolute top-3 left-3 bg-slate-900/90 border border-slate-800 px-2.5 py-1 rounded text-[10px] font-mono text-slate-400">
              ORBITAL TRAJECTORY VECTOR
            </div>
          </div>

          {/* Realtime Physics Metrics Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 font-mono text-xs">
            <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 text-center">
              <span className="text-[10px] text-slate-500 uppercase block font-bold">LIFTOFF TWR</span>
              <span className={`text-base font-black mt-0.5 block ${physics.twr >= 1.25 ? 'text-emerald-400' : 'text-rose-400'}`}>
                {physics.twr}
              </span>
            </div>

            <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 text-center">
              <span className="text-[10px] text-slate-500 uppercase block font-bold">ORBIT SPEED ($v$)</span>
              <span className="text-base font-black text-cyan-400 mt-0.5 block">
                {physics.orbitalSpeed} km/s
              </span>
            </div>

            <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 text-center">
              <span className="text-[10px] text-slate-500 uppercase block font-bold">PERIOD ($T$)</span>
              <span className="text-base font-black text-purple-400 mt-0.5 block">
                {physics.periodMinutes} min
              </span>
            </div>

            <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 text-center">
              <span className="text-[10px] text-slate-500 uppercase block font-bold">ESTIMATED $\Delta V$</span>
              <span className="text-base font-black text-amber-400 mt-0.5 block">
                {physics.deltaVAvailable} km/s
              </span>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};
