import React, { useState, useEffect, useRef } from 'react';
import { Radio, Compass, Orbit, Globe2, ShieldCheck, Sparkles } from 'lucide-react';
import { sciFiAudio } from './SoundEffects';

interface SatelliteData {
  id: string;
  name: string;
  noradId: number;
  altitude: number; // km
  velocity: number; // km/s
  inclination: string;
  category: 'Space Station' | 'Deep Space' | 'Observatory' | 'Constellation';
  color: string;
  baseAzimuth: number; // deg
  baseElevation: number; // deg
}

const satellitesList: SatelliteData[] = [
  {
    id: 'iss',
    name: 'ISS (International Space Station)',
    noradId: 25544,
    altitude: 418.5,
    velocity: 7.66,
    inclination: '51.64°',
    category: 'Space Station',
    color: '#34d399', // Emerald
    baseAzimuth: 142,
    baseElevation: 68
  },
  {
    id: 'jwst',
    name: 'James Webb Space Telescope (L2)',
    noradId: 50463,
    altitude: 1500000,
    velocity: 0.20,
    inclination: '28.50°',
    category: 'Deep Space',
    color: '#a855f7', // Purple
    baseAzimuth: 215,
    baseElevation: 42
  },
  {
    id: 'hubble',
    name: 'Hubble Space Telescope',
    noradId: 20580,
    altitude: 535.2,
    velocity: 7.59,
    inclination: '28.47°',
    category: 'Observatory',
    color: '#06b6d4', // Cyan
    baseAzimuth: 48,
    baseElevation: 35
  },
  {
    id: 'landsat9',
    name: 'Landsat 9 Earth Observation',
    noradId: 49260,
    altitude: 705.0,
    velocity: 7.50,
    inclination: '98.20°',
    category: 'Observatory',
    color: '#f59e0b', // Amber
    baseAzimuth: 310,
    baseElevation: 54
  },
  {
    id: 'starlink',
    name: 'Starlink Constellation (G6-42)',
    noradId: 58210,
    altitude: 550.0,
    velocity: 7.61,
    inclination: '53.05°',
    category: 'Constellation',
    color: '#ec4899', // Pink
    baseAzimuth: 88,
    baseElevation: 78
  }
];

const groundStations = [
  { name: 'Kennedy Space Center, FL', coords: '28.57° N, 80.64° W' },
  { name: 'Vandenberg SFB, CA', coords: '34.74° N, 120.57° W' },
  { name: 'Esrange Space Center, Sweden', coords: '67.89° N, 21.10° E' },
  { name: 'Mauna Kea Observatory, HI', coords: '19.82° N, 155.46° W' }
];

export const SatelliteTracker: React.FC = () => {
  const [selectedSatId, setSelectedSatId] = useState<string>('iss');
  const [groundStationIdx, setGroundStationIdx] = useState<number>(0);
  const [sweepSpeed, setSweepSpeed] = useState<number>(1.2);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const selectedSat = satellitesList.find(s => s.id === selectedSatId) || satellitesList[0];

  // Dynamic Azimuth / Elevation values simulated over time
  const [telemetry, setTelemetry] = useState({
    azimuth: selectedSat.baseAzimuth,
    elevation: selectedSat.baseElevation,
    snrDb: 24.8,
    rangeKm: selectedSat.altitude + 120
  });

  useEffect(() => {
    const interval = setInterval(() => {
      const time = Date.now() / 1000;
      setTelemetry({
        azimuth: Number(((selectedSat.baseAzimuth + Math.sin(time / 4) * 25 + 360) % 360).toFixed(1)),
        elevation: Number((Math.max(10, selectedSat.baseElevation + Math.cos(time / 3) * 15)).toFixed(1)),
        snrDb: Number((22 + Math.sin(time / 2) * 5).toFixed(1)),
        rangeKm: Number((selectedSat.altitude + Math.cos(time / 5) * 40).toFixed(1))
      });
    }, 500);

    return () => clearInterval(interval);
  }, [selectedSat]);

  // Radar Canvas Loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    let sweepAngle = 0;

    const render = () => {
      const width = (canvas.width = canvas.parentElement?.clientWidth || 360);
      const height = (canvas.height = 320);

      const centerX = width / 2;
      const centerY = height / 2;
      const radius = Math.min(centerX, centerY) - 25;

      ctx.clearRect(0, 0, width, height);

      // Outer Radar Circle
      ctx.beginPath();
      ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
      ctx.fillStyle = '#060a12';
      ctx.fill();
      ctx.lineWidth = 2;
      ctx.strokeStyle = '#1e293b';
      ctx.stroke();

      // Distance Rings (100km, 300km, 500km relative scale)
      [0.33, 0.66, 1.0].forEach((scale, i) => {
        ctx.beginPath();
        ctx.arc(centerX, centerY, radius * scale, 0, Math.PI * 2);
        ctx.strokeStyle = i === 2 ? '#334155' : '#1e293b';
        ctx.setLineDash([2, 4]);
        ctx.stroke();
        ctx.setLineDash([]);
      });

      // Axis Crosshair
      ctx.beginPath();
      ctx.moveTo(centerX - radius, centerY);
      ctx.lineTo(centerX + radius, centerY);
      ctx.moveTo(centerX, centerY - radius);
      ctx.lineTo(centerX, centerY + radius);
      ctx.strokeStyle = '#1e293b';
      ctx.stroke();

      // Cardinal N, S, E, W labels
      ctx.fillStyle = '#64748b';
      ctx.font = '10px monospace';
      ctx.textAlign = 'center';
      ctx.fillText('N', centerX, centerY - radius + 12);
      ctx.fillText('S', centerX, centerY + radius - 4);
      ctx.fillText('E', centerX + radius - 10, centerY + 3);
      ctx.fillText('W', centerX - radius + 10, centerY + 3);

      // Radar Sweep Line
      sweepAngle += 0.02 * sweepSpeed;
      if (sweepAngle > Math.PI * 2) sweepAngle = 0;

      ctx.save();
      ctx.beginPath();
      ctx.moveTo(centerX, centerY);
      ctx.arc(centerX, centerY, radius, sweepAngle - 0.25, sweepAngle);
      ctx.lineTo(centerX, centerY);
      const sweepGrad = ctx.createConicGradient(sweepAngle, centerX, centerY);
      sweepGrad.addColorStop(0, 'rgba(52, 211, 153, 0.25)');
      sweepGrad.addColorStop(0.1, 'rgba(52, 211, 153, 0.05)');
      sweepGrad.addColorStop(1, 'rgba(52, 211, 153, 0)');
      ctx.fillStyle = sweepGrad;
      ctx.fill();
      ctx.restore();

      // Draw all satellite blips
      satellitesList.forEach((sat) => {
        const azRad = (sat.baseAzimuth - 90) * (Math.PI / 180);
        // Elevation maps to distance from center (higher elevation = closer to zenith/center)
        const eleNorm = 1 - (sat.baseElevation / 90);
        const satR = radius * eleNorm;

        const satX = centerX + Math.cos(azRad) * satR;
        const satY = centerY + Math.sin(azRad) * satR;

        const isSelected = sat.id === selectedSatId;

        // Pulse ring if selected
        if (isSelected) {
          ctx.beginPath();
          ctx.arc(satX, satY, 12, 0, Math.PI * 2);
          ctx.strokeStyle = sat.color;
          ctx.lineWidth = 1;
          ctx.setLineDash([2, 2]);
          ctx.stroke();
          ctx.setLineDash([]);
        }

        // Blip point
        ctx.beginPath();
        ctx.arc(satX, satY, isSelected ? 5 : 3, 0, Math.PI * 2);
        ctx.fillStyle = sat.color;
        ctx.fill();

        // Label
        if (isSelected) {
          ctx.fillStyle = '#ffffff';
          ctx.font = '9px monospace';
          ctx.textAlign = 'left';
          ctx.fillText(sat.name.split(' ')[0], satX + 8, satY + 3);
        }
      });

      animId = requestAnimationFrame(render);
    };

    render();

    return () => cancelAnimationFrame(animId);
  }, [selectedSatId, sweepSpeed]);

  return (
    <div className="bg-[#0b0f17] border border-slate-800 rounded-3xl p-6 space-y-6 shadow-2xl">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-800 pb-4 flex-wrap gap-2">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-400">
            <Radio className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-white font-mono uppercase tracking-tight">
              Spacecraft & Satellite Pass Radar Tracker
            </h3>
            <p className="text-xs text-slate-400 font-mono">
              Live Horizon Elevation & Azimuth Orbital Pass Display
            </p>
          </div>
        </div>

        {/* Ground Station Selector */}
        <select
          value={groundStationIdx}
          onChange={(e) => { sciFiAudio.playClick(); setGroundStationIdx(Number(e.target.value)); }}
          className="bg-slate-950 border border-slate-800 text-slate-200 text-xs font-mono rounded-xl px-3 py-2 focus:outline-none focus:border-cyan-400 cursor-pointer"
        >
          {groundStations.map((gs, idx) => (
            <option key={idx} value={idx}>
              📍 {gs.name}
            </option>
          ))}
        </select>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
        {/* Left Column: Radar View */}
        <div className="lg:col-span-6 bg-slate-950 rounded-2xl border border-slate-800 p-4 flex flex-col items-center relative">
          <div className="w-full flex items-center justify-between text-[10px] font-mono text-slate-400 mb-2">
            <span className="flex items-center gap-1.5 text-emerald-400 font-bold">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
              RADAR SWEEP ACTIVE
            </span>
            <span>STATION COORDS: {groundStations[groundStationIdx].coords}</span>
          </div>

          <canvas ref={canvasRef} className="w-full h-[280px]" />
        </div>

        {/* Right Column: Satellite Selector & Dynamic Telemetry */}
        <div className="lg:col-span-6 space-y-4">
          
          {/* Satellite Selection Tabs */}
          <div className="space-y-2">
            <label className="text-[10px] font-mono font-bold uppercase text-slate-400 block">
              SELECT TARGET SPACECRAFT:
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {satellitesList.map((sat) => (
                <button
                  key={sat.id}
                  onClick={() => { sciFiAudio.playClick(); setSelectedSatId(sat.id); }}
                  className={`p-2.5 rounded-xl border text-left font-mono transition-all cursor-pointer flex items-center justify-between ${
                    selectedSatId === sat.id
                      ? 'bg-slate-900 border-cyan-400 text-white shadow-lg shadow-cyan-500/10'
                      : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white'
                  }`}
                >
                  <div className="truncate pr-2">
                    <span className="text-xs font-bold block truncate">{sat.name}</span>
                    <span className="text-[10px] text-slate-500 font-mono">NORAD #{sat.noradId}</span>
                  </div>
                  <span
                    className="w-2.5 h-2.5 rounded-full shrink-0"
                    style={{ backgroundColor: sat.color }}
                  />
                </button>
              ))}
            </div>
          </div>

          {/* Dynamic Pass Telemetry Panel */}
          <div className="bg-slate-950 border border-slate-800 rounded-2xl p-4 space-y-3 font-mono">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2">
              <span className="text-xs text-white font-bold uppercase flex items-center gap-2">
                <Orbit className="w-4 h-4 text-cyan-400" />
                {selectedSat.name} Pass Telemetry
              </span>
              <span className="text-[10px] text-emerald-400 font-bold bg-emerald-500/10 border border-emerald-500/30 px-2 py-0.5 rounded">
                SIGNAL LOCKED
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-center text-xs">
              <div className="bg-slate-900 p-2.5 rounded-xl border border-slate-800">
                <span className="text-[10px] text-slate-500 uppercase block font-bold">AZIMUTH</span>
                <span className="text-sm font-black text-white mt-0.5 block">{telemetry.azimuth}°</span>
              </div>

              <div className="bg-slate-900 p-2.5 rounded-xl border border-slate-800">
                <span className="text-[10px] text-slate-500 uppercase block font-bold">ELEVATION</span>
                <span className="text-sm font-black text-emerald-400 mt-0.5 block">{telemetry.elevation}°</span>
              </div>

              <div className="bg-slate-900 p-2.5 rounded-xl border border-slate-800">
                <span className="text-[10px] text-slate-500 uppercase block font-bold">ALTITUDE</span>
                <span className="text-sm font-black text-cyan-400 mt-0.5 block">{selectedSat.altitude.toLocaleString()} km</span>
              </div>

              <div className="bg-slate-900 p-2.5 rounded-xl border border-slate-800">
                <span className="text-[10px] text-slate-500 uppercase block font-bold">VELOCITY</span>
                <span className="text-sm font-black text-amber-400 mt-0.5 block">{selectedSat.velocity} km/s</span>
              </div>
            </div>

            <div className="flex justify-between text-[11px] text-slate-400 pt-1">
              <span>Inclination: <strong className="text-white">{selectedSat.inclination}</strong></span>
              <span>Downlink SNR: <strong className="text-emerald-400">{telemetry.snrDb} dB</strong></span>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};
