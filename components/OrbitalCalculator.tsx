import React, { useState, useMemo, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Rocket, 
  Gauge, 
  Play, 
  Pause, 
  RotateCcw, 
  AlertTriangle, 
  CheckCircle2, 
  Flame, 
  Globe, 
  Activity, 
  Info, 
  Sliders,
  Radio,
  Zap,
  FastForward,
  Layers,
  Compass
} from 'lucide-react';
import { sciFiAudio } from './SoundEffects';

// Interface for simulation particle
interface SimParticle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  maxLife: number;
  color: string;
  size: number;
  type: 'flame' | 'smoke' | 'spark' | 'shockwave' | 'reentry';
}

// Interface for trajectory trail point
interface TrailPoint {
  x: number;
  y: number;
  altitudeKm: number;
  isFail?: boolean;
}

export const OrbitalCalculator: React.FC = () => {
  // --- Simulator Inputs ---
  const [payloadMass, setPayloadMass] = useState<number>(5000); // kg
  const [thrust, setThrust] = useState<number>(7600); // kN
  const [targetAltitude, setTargetAltitude] = useState<number>(400); // km

  // --- Simulation Execution State ---
  const [simRunning, setSimRunning] = useState<boolean>(false);
  const [simPaused, setSimPaused] = useState<boolean>(false);
  const [simSpeed, setSimSpeed] = useState<number>(1); // 1x, 2x, 4x
  const [flightPhase, setFlightPhase] = useState<
    'standby' | 'ignition' | 'liftoff' | 'max_q' | 'staging' | 'insertion' | 'in_orbit' | 'failed'
  >('standby');
  const [missionElapsedSeconds, setMissionElapsedSeconds] = useState<number>(0);
  const [simOutcome, setSimOutcome] = useState<{
    status: 'success' | 'pad_abort' | 'gravity_crash' | 'insufficient_deltav' | 'atmosphere_decay';
    title: string;
    description: string;
    remedy: string;
  } | null>(null);

  // Live Telemetry during simulation
  const [telemetry, setTelemetry] = useState({
    altitudeKm: 0,
    velocityKmS: 0,
    accelerationG: 1.0,
    downrangeKm: 0,
    propellantPercent: 100,
    dynamicPressureKPa: 0,
    stage: 'Stage 1'
  });

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const animFrameRef = useRef<number | null>(null);
  const particlesRef = useRef<SimParticle[]>([]);
  const trailRef = useRef<TrailPoint[]>([]);
  const lastTimeRef = useRef<number>(0);
  const simProgressRef = useRef<number>(0); // 0 to 120 internal ticks

  // --- Constants ---
  const MU = 398600.4418; // Earth gravitational parameter km^3/s^2
  const EARTH_RADIUS_KM = 6371; // km
  const G0 = 9.80665; // m/s^2

  // Rocket Stage Architecture
  // Stage 1: Booster (e.g. 9 Merlin-class engines, 390t fuel, 26t dry)
  const STAGE1_DRY_KG = 26000;
  const STAGE1_FUEL_KG = 390000;
  const STAGE1_ISP_S = 308; // average sea-level to vacuum

  // Stage 2: Upper Stage (1 vacuum engine, 92t fuel, 4.8t dry)
  const STAGE2_DRY_KG = 4800;
  const STAGE2_FUEL_KG = 92000;
  const STAGE2_ISP_S = 348; // high vacuum Isp

  // Total rocket dry and fuel mass
  const TOTAL_DRY_MASS_KG = STAGE1_DRY_KG + STAGE2_DRY_KG + payloadMass;
  const TOTAL_PROP_MASS_KG = STAGE1_FUEL_KG + STAGE2_FUEL_KG;

  // --- Core Astrodynamics & Propulsion Physics ---
  const physics = useMemo(() => {
    const totalMassKg = TOTAL_DRY_MASS_KG + TOTAL_PROP_MASS_KG;
    const totalWeightN = totalMassKg * G0;
    const thrustN = thrust * 1000;

    // Liftoff Thrust to Weight Ratio
    const twr = thrustN / totalWeightN;

    // Orbital radius
    const r = EARTH_RADIUS_KM + targetAltitude;

    // Circular orbital speed: v = sqrt(mu / r) in km/s
    const orbitalSpeed = Math.sqrt(MU / r);

    // Orbital Period T = 2 * pi * sqrt(r^3 / mu) in seconds
    const periodSeconds = 2 * Math.PI * Math.sqrt(Math.pow(r, 3) / MU);
    const periodMinutes = (periodSeconds / 60).toFixed(1);

    // Multi-Stage Tsiolkovsky Delta-V Calculation
    // Stage 1 Delta-V
    const m01 = totalMassKg;
    const mf1 = totalMassKg - STAGE1_FUEL_KG;
    const deltaV1 = (STAGE1_ISP_S * G0 * Math.log(m01 / mf1)) / 1000; // km/s

    // Stage 2 Delta-V (Stage 1 dropped)
    const m02 = STAGE2_DRY_KG + STAGE2_FUEL_KG + payloadMass;
    const mf2 = STAGE2_DRY_KG + payloadMass;
    const deltaV2 = (STAGE2_ISP_S * G0 * Math.log(m02 / mf2)) / 1000; // km/s

    const deltaVAvailable = deltaV1 + deltaV2; // total available delta-V

    // Required Delta-V Calculation
    // Losses: Atmospheric drag (~0.35 km/s) + steering (~0.18 km/s) + gravity losses
    let gravityLoss = 1.35;
    if (twr < 1.0) {
      gravityLoss = 99.9; // Infinite - rocket cannot clear pad
    } else if (twr < 1.15) {
      gravityLoss = 1.35 + 2.8 / Math.pow(twr - 0.98, 1.6); // severe gravity loss
    } else if (twr < 1.3) {
      gravityLoss = 1.35 + 0.5 * (1.3 - twr);
    }

    const altitudeLossFactor = Math.log10(targetAltitude / 200) * 0.45;
    const deltaVRequired = orbitalSpeed + 0.35 + 0.18 + gravityLoss + Math.max(0, altitudeLossFactor);

    // Determine Expected Outcome
    let expectedOutcome: 'success' | 'pad_abort' | 'gravity_crash' | 'insufficient_deltav' | 'atmosphere_decay';
    let summaryTitle = '';
    let summaryDesc = '';
    let summaryRemedy = '';
    let badgeColor = '';

    if (twr < 1.0) {
      expectedOutcome = 'pad_abort';
      summaryTitle = 'CRITICAL FAILURE: LAUNCH PAD ABORT / ENGINE STALL';
      summaryDesc = `Liftoff Thrust (${thrust.toLocaleString()} kN) is lower than Total Weight (${(totalWeightN / 1000).toFixed(0)} kN). With TWR = ${twr.toFixed(2)} (< 1.00), the vehicle experiences negative net acceleration and cannot leave the launch pad.`;
      summaryRemedy = 'Increase Liftoff Thrust to at least ' + Math.ceil((totalWeightN / 1000) * 1.25).toLocaleString() + ' kN or reduce Payload Mass.';
      badgeColor = 'text-rose-400 bg-rose-500/10 border-rose-500/40';
    } else if (twr < 1.18) {
      expectedOutcome = 'gravity_crash';
      summaryTitle = 'FLIGHT FAILURE: SUB-ORBITAL IMPACT (GRAVITY LOSSES)';
      summaryDesc = `Marginal Liftoff TWR (${twr.toFixed(2)}). The vehicle ascends too sluggishly, burning excessive propellant fighting Earth gravity (gravity loss > ${(gravityLoss).toFixed(1)} km/s) without building sufficient horizontal velocity.`;
      summaryRemedy = 'Increase Liftoff Thrust to achieve a nominal liftoff TWR of 1.25 to 1.50.';
      badgeColor = 'text-amber-400 bg-amber-500/10 border-amber-500/40';
    } else if (targetAltitude < 150) {
      expectedOutcome = 'atmosphere_decay';
      summaryTitle = 'FLIGHT FAILURE: THERMAL ATMOSPHERIC DECAY';
      summaryDesc = `Target Altitude (${targetAltitude} km) is within the dense thermosphere/mesosphere. Intense aerodynamic friction decelerates the vehicle within orbits, causing orbital decay and re-entry incineration.`;
      summaryRemedy = 'Select a stable Low Earth Orbit (LEO) target altitude of at least 180–400 km.';
      badgeColor = 'text-amber-400 bg-amber-500/10 border-amber-500/40';
    } else if (deltaVAvailable < deltaVRequired) {
      expectedOutcome = 'insufficient_deltav';
      summaryTitle = 'INSERTION FAILURE: INSUFFICIENT DELTA-V';
      summaryDesc = `Available Delta-V (${deltaVAvailable.toFixed(2)} km/s) falls short of the required ${deltaVRequired.toFixed(2)} km/s needed to reach ${targetAltitude.toLocaleString()} km with a ${payloadMass.toLocaleString()} kg payload. Stage 2 will burn out at sub-orbital velocity, leading to ballistic re-entry.`;
      summaryRemedy = 'Decrease Payload Mass or lower the Target Altitude to bring required ΔV below ' + deltaVAvailable.toFixed(2) + ' km/s.';
      badgeColor = 'text-rose-400 bg-rose-500/10 border-rose-500/40';
    } else {
      expectedOutcome = 'success';
      summaryTitle = 'MISSION SUCCESS: STABLE ORBITAL INSERTION CONFIRMED';
      summaryDesc = `Nominal flight parameters verified. Liftoff TWR (${twr.toFixed(2)}) is optimal, and available Delta-V (${deltaVAvailable.toFixed(2)} km/s) comfortably satisfies the required ${deltaVRequired.toFixed(2)} km/s.`;
      summaryRemedy = 'System configured nominally for Keplerian orbit circularization.';
      badgeColor = 'text-emerald-400 bg-emerald-500/10 border-emerald-500/40';
    }

    return {
      totalMassKg,
      totalWeightKn: Math.round(totalWeightN / 1000),
      twr: Number(twr.toFixed(2)),
      orbitalSpeed: Number(orbitalSpeed.toFixed(2)),
      periodMinutes,
      deltaVAvailable: Number(deltaVAvailable.toFixed(2)),
      deltaVRequired: Number(deltaVRequired.toFixed(2)),
      expectedOutcome,
      summaryTitle,
      summaryDesc,
      summaryRemedy,
      badgeColor,
      isStable: expectedOutcome === 'success'
    };
  }, [payloadMass, thrust, targetAltitude]);

  // --- Preset Loaders for Quick Testing ---
  const handleLoadPreset = (name: string) => {
    sciFiAudio.playClick();
    if (simRunning) handleReset();

    if (name === 'starlink') {
      setPayloadMass(16500);
      setThrust(7600);
      setTargetAltitude(550);
    } else if (name === 'geo_heavy') {
      setPayloadMass(6000);
      setThrust(12500);
      setTargetAltitude(35786);
    } else if (name === 'smallsat') {
      setPayloadMass(800);
      setThrust(2400);
      setTargetAltitude(400);
    } else if (name === 'fail_twr') {
      // Under-thrust pad abort
      setPayloadMass(40000);
      setThrust(3800);
      setTargetAltitude(400);
    } else if (name === 'fail_deltav') {
      // Overweight GEO failure
      setPayloadMass(48000);
      setThrust(8500);
      setTargetAltitude(35786);
    } else if (name === 'fail_drag') {
      // Low atmospheric decay
      setPayloadMass(5000);
      setThrust(7600);
      setTargetAltitude(110);
    }
  };

  // --- Launch Simulator Controller ---
  const handleStartLaunch = () => {
    sciFiAudio.playLaunchRumble();
    setSimRunning(true);
    setSimPaused(false);
    setFlightPhase('ignition');
    setMissionElapsedSeconds(0);
    setSimOutcome(null);
    simProgressRef.current = 0;
    particlesRef.current = [];
    trailRef.current = [];
  };

  const handlePauseResume = () => {
    sciFiAudio.playClick();
    setSimPaused((prev) => !prev);
  };

  const handleReset = () => {
    sciFiAudio.playClick();
    setSimRunning(false);
    setSimPaused(false);
    setFlightPhase('standby');
    setMissionElapsedSeconds(0);
    setSimOutcome(null);
    simProgressRef.current = 0;
    particlesRef.current = [];
    trailRef.current = [];
    setTelemetry({
      altitudeKm: 0,
      velocityKmS: 0,
      accelerationG: 1.0,
      downrangeKm: 0,
      propellantPercent: 100,
      dynamicPressureKPa: 0,
      stage: 'Stage 1'
    });
  };

  // --- Particle Spawner ---
  const addExhaustParticles = (x: number, y: number, angleRad: number, intensity: number, isVacuum: boolean) => {
    const count = Math.min(8, Math.max(2, Math.floor(intensity * 4)));
    const spread = isVacuum ? 0.6 : 0.25;
    const baseSpeed = isVacuum ? 3.5 : 2.8;

    for (let i = 0; i < count; i++) {
      const particleAngle = angleRad + Math.PI + (Math.random() - 0.5) * spread;
      const speed = baseSpeed + Math.random() * 2.5;
      const vx = Math.cos(particleAngle) * speed;
      const vy = Math.sin(particleAngle) * speed;

      // Color transition: flame core -> smoke
      let color = 'rgba(255, 200, 50, 0.9)';
      if (isVacuum) {
        color = Math.random() > 0.4 ? 'rgba(0, 240, 255, 0.9)' : 'rgba(147, 51, 234, 0.8)';
      } else if (Math.random() > 0.6) {
        color = 'rgba(249, 115, 22, 0.9)'; // orange
      } else if (Math.random() > 0.8) {
        color = 'rgba(255, 255, 255, 0.8)'; // hot white
      }

      particlesRef.current.push({
        x: x + (Math.random() - 0.5) * 4,
        y: y + (Math.random() - 0.5) * 4,
        vx,
        vy,
        life: 0,
        maxLife: 15 + Math.random() * 15,
        color,
        size: 2.5 + Math.random() * 3,
        type: 'flame'
      });
    }
  };

  const addExplosionParticles = (x: number, y: number) => {
    for (let i = 0; i < 45; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = 1 + Math.random() * 5.5;
      particlesRef.current.push({
        x,
        y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        life: 0,
        maxLife: 30 + Math.random() * 25,
        color: Math.random() > 0.5 ? '#f43f5e' : '#fb923c',
        size: 3 + Math.random() * 4,
        type: 'shockwave'
      });
    }
  };

  // --- Main Simulation Loop & Canvas Render ---
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;

    const render = (time: number) => {
      if (!lastTimeRef.current) lastTimeRef.current = time;
      const dt = (time - lastTimeRef.current) / 1000;
      lastTimeRef.current = time;

      // Handle Resize dynamically
      const width = (canvas.width = canvas.parentElement?.clientWidth || 600);
      const height = (canvas.height = 360);

      const centerX = width / 2;
      const centerY = height / 2 + 15;
      const earthRadiusPx = 70;

      // Target Orbit Radius on Canvas (Scaled appropriately)
      // Compress GEO (35786km) so it stays visible on canvas
      let targetOrbitPx = earthRadiusPx + 40;
      if (targetAltitude <= 2000) {
        targetOrbitPx = earthRadiusPx + 30 + (targetAltitude / 2000) * 45;
      } else {
        targetOrbitPx = earthRadiusPx + 75 + Math.min(65, Math.log10(targetAltitude / 2000) * 45);
      }

      // Launch Pad Coordinates (Located at top of Earth circle)
      const padAngle = -Math.PI / 2; // North Pole / Equator top orientation
      const padX = centerX + Math.cos(padAngle) * earthRadiusPx;
      const padY = centerY + Math.sin(padAngle) * earthRadiusPx;

      // --- SIMULATION TICK ADVANCEMENT ---
      if (simRunning && !simPaused) {
        // Advance simulation clock with speed multiplier
        const advanceRate = dt * simSpeed * 1.4;
        simProgressRef.current += advanceRate;

        // Current progress variable normalized
        const p = simProgressRef.current;
        setMissionElapsedSeconds(Math.floor(p * 8));

        // State Machine Evaluation based on calculated physics outcome
        const outcome = physics.expectedOutcome;

        // 1. PAD ABORT FAILURE (TWR < 1.0)
        if (outcome === 'pad_abort') {
          if (p < 1.5) {
            setFlightPhase('ignition');
            setTelemetry({
              altitudeKm: 0,
              velocityKmS: 0,
              accelerationG: physics.twr,
              downrangeKm: 0,
              propellantPercent: Math.max(90, 100 - p * 3),
              dynamicPressureKPa: 0,
              stage: 'Stage 1 (Stalled)'
            });
            addExhaustParticles(padX, padY, padAngle, 1.2, false);
          } else {
            // Abort explosion / engine stall on pad
            if (flightPhase !== 'failed') {
              setFlightPhase('failed');
              addExplosionParticles(padX, padY);
              sciFiAudio.playFailure();
              setSimOutcome({
                status: 'pad_abort',
                title: physics.summaryTitle,
                description: physics.summaryDesc,
                remedy: physics.summaryRemedy
              });
            }
          }
        }

        // 2. GRAVITY DRAG CRASH (1.0 <= TWR < 1.18)
        else if (outcome === 'gravity_crash') {
          if (p < 2) {
            setFlightPhase('liftoff');
          } else if (p < 5) {
            setFlightPhase('max_q');
          } else {
            setFlightPhase('failed');
          }

          // Slow ascent then plunge down
          const maxAscentP = 4.5;
          let currentAltKm = 0;
          let currentSpeed = 0;

          if (p <= maxAscentP) {
            const frac = p / maxAscentP;
            currentAltKm = frac * 48; // peaks at 48 km
            currentSpeed = frac * 0.9;
            setTelemetry({
              altitudeKm: Math.round(currentAltKm),
              velocityKmS: Number(currentSpeed.toFixed(2)),
              accelerationG: Number((physics.twr * 0.95).toFixed(2)),
              downrangeKm: Math.round(p * 15),
              propellantPercent: Math.max(10, Math.round(100 - p * 18)),
              dynamicPressureKPa: Math.round(Math.sin((p / maxAscentP) * Math.PI) * 35),
              stage: 'Stage 1 (Fuel Depleted)'
            });
          } else {
            // Ballistic crash
            const fallFrac = (p - maxAscentP) / 2.5;
            currentAltKm = Math.max(0, 48 * (1 - fallFrac));
            currentSpeed = 1.4;
            setTelemetry({
              altitudeKm: Math.round(currentAltKm),
              velocityKmS: Number(currentSpeed.toFixed(2)),
              accelerationG: 0.1,
              downrangeKm: Math.round(maxAscentP * 15 + (p - maxAscentP) * 12),
              propellantPercent: 0,
              dynamicPressureKPa: 20,
              stage: 'Ballistic Descent'
            });

            if (p >= maxAscentP + 2.5 && !simOutcome) {
              sciFiAudio.playFailure();
              setSimOutcome({
                status: 'gravity_crash',
                title: physics.summaryTitle,
                description: physics.summaryDesc,
                remedy: physics.summaryRemedy
              });
            }
          }
        }

        // 3. INSUFFICIENT DELTA-V (Runs out of fuel in Stage 2, falls back)
        else if (outcome === 'insufficient_deltav') {
          if (p < 2.5) {
            setFlightPhase('liftoff');
          } else if (p < 5.0) {
            setFlightPhase('max_q');
          } else if (p < 8.0) {
            setFlightPhase('staging');
          } else {
            setFlightPhase('failed');
          }

          const peakP = 9.0;
          if (p < peakP) {
            const frac = p / peakP;
            const currentAltKm = frac * (targetAltitude * 0.65);
            const currentSpeed = frac * (physics.orbitalSpeed * 0.72);
            setTelemetry({
              altitudeKm: Math.round(currentAltKm),
              velocityKmS: Number(currentSpeed.toFixed(2)),
              accelerationG: Number((1.2 + frac * 1.8).toFixed(2)),
              downrangeKm: Math.round(p * 95),
              propellantPercent: Math.max(5, Math.round(100 - p * 10)),
              dynamicPressureKPa: p < 4 ? Math.round(p * 12) : Math.max(0, Math.round(48 - (p - 4) * 15)),
              stage: p < 5 ? 'Stage 1' : 'Stage 2 (Burnout)'
            });
          } else {
            // Re-entry plunge
            const fallFrac = (p - peakP) / 3.0;
            const currentAltKm = Math.max(0, targetAltitude * 0.65 * (1 - fallFrac));
            setTelemetry({
              altitudeKm: Math.round(currentAltKm),
              velocityKmS: Number((physics.orbitalSpeed * 0.65 * (1 - fallFrac * 0.3)).toFixed(2)),
              accelerationG: 0.9,
              downrangeKm: Math.round(peakP * 95 + (p - peakP) * 120),
              propellantPercent: 0,
              dynamicPressureKPa: Math.round(fallFrac * 70),
              stage: 'Sub-Orbital Re-Entry'
            });

            if (p >= peakP + 3.0 && !simOutcome) {
              sciFiAudio.playFailure();
              setSimOutcome({
                status: 'insufficient_deltav',
                title: physics.summaryTitle,
                description: physics.summaryDesc,
                remedy: physics.summaryRemedy
              });
            }
          }
        }

        // 4. LOW ATMOSPHERE DECAY
        else if (outcome === 'atmosphere_decay') {
          if (p < 2.5) setFlightPhase('liftoff');
          else if (p < 5.0) setFlightPhase('max_q');
          else if (p < 7.0) setFlightPhase('staging');
          else setFlightPhase('failed');

          const alt = Math.max(0, Math.min(targetAltitude, p * 18));
          setTelemetry({
            altitudeKm: Math.round(alt),
            velocityKmS: Number(Math.min(physics.orbitalSpeed, p * 0.95).toFixed(2)),
            accelerationG: 1.5,
            downrangeKm: Math.round(p * 70),
            propellantPercent: Math.max(0, Math.round(100 - p * 12)),
            dynamicPressureKPa: 85,
            stage: 'Atmospheric Drag Stall'
          });

          if (p >= 8.5 && !simOutcome) {
            sciFiAudio.playFailure();
            setSimOutcome({
              status: 'atmosphere_decay',
              title: physics.summaryTitle,
              description: physics.summaryDesc,
              remedy: physics.summaryRemedy
            });
          }
        }

        // 5. NOMINAL SUCCESSFUL LAUNCH & ORBITAL INSERTION
        else {
          if (p < 2.0) {
            setFlightPhase('liftoff');
          } else if (p < 4.5) {
            setFlightPhase('max_q');
          } else if (p < 7.0) {
            setFlightPhase('staging');
          } else if (p < 10.0) {
            setFlightPhase('insertion');
          } else {
            if (flightPhase !== 'in_orbit') {
              setFlightPhase('in_orbit');
              sciFiAudio.playSuccess();
              setSimOutcome({
                status: 'success',
                title: physics.summaryTitle,
                description: physics.summaryDesc,
                remedy: physics.summaryRemedy
              });
            }
          }

          const insertionProgress = Math.min(1, p / 10.0);
          const liveAlt = insertionProgress * targetAltitude;
          const liveSpeed = insertionProgress * physics.orbitalSpeed;

          setTelemetry({
            altitudeKm: Math.round(liveAlt),
            velocityKmS: Number(liveSpeed.toFixed(2)),
            accelerationG: p > 10 ? 0 : Number((1.2 + Math.sin(p * 0.5) * 1.8).toFixed(2)),
            downrangeKm: Math.round(p * 140),
            propellantPercent: Math.max(12, Math.round(100 - insertionProgress * 85)),
            dynamicPressureKPa: p < 4 ? Math.round(p * 14) : Math.max(0, Math.round(56 - (p - 4) * 18)),
            stage: p < 6 ? 'Stage 1' : p < 10 ? 'Stage 2 Insertion' : 'Orbital Payload'
          });
        }
      }

      // --- CLEAR CANVAS & DRAW BACKGROUND ---
      ctx.clearRect(0, 0, width, height);

      // Deep space starfield background
      ctx.fillStyle = '#060a12';
      ctx.fillRect(0, 0, width, height);

      // Draw faint background grid
      ctx.strokeStyle = 'rgba(30, 41, 59, 0.4)';
      ctx.lineWidth = 1;
      const gridSize = 40;
      for (let x = 0; x < width; x += gridSize) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, height);
        ctx.stroke();
      }
      for (let y = 0; y < height; y += gridSize) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
        ctx.stroke();
      }

      // --- DRAW EARTH BODY ---
      // Earth Atmosphere Glow Outer Ring
      const atmoRadius = earthRadiusPx + 12;
      const atmoGrad = ctx.createRadialGradient(centerX, centerY, earthRadiusPx, centerX, centerY, atmoRadius + 18);
      atmoGrad.addColorStop(0, 'rgba(0, 240, 255, 0.35)');
      atmoGrad.addColorStop(0.6, 'rgba(0, 180, 255, 0.12)');
      atmoGrad.addColorStop(1, 'rgba(0, 180, 255, 0)');
      ctx.fillStyle = atmoGrad;
      ctx.beginPath();
      ctx.arc(centerX, centerY, atmoRadius + 18, 0, Math.PI * 2);
      ctx.fill();

      // Earth Globe
      const earthGrad = ctx.createRadialGradient(centerX - 25, centerY - 25, 10, centerX, centerY, earthRadiusPx);
      earthGrad.addColorStop(0, '#134e4a'); // deep cyan-teal land
      earthGrad.addColorStop(0.5, '#0c2638'); // deep ocean
      earthGrad.addColorStop(1, '#081a28'); // shadow rim
      ctx.fillStyle = earthGrad;
      ctx.beginPath();
      ctx.arc(centerX, centerY, earthRadiusPx, 0, Math.PI * 2);
      ctx.fill();

      // Earth Rim highlight
      ctx.strokeStyle = '#38bdf8';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.arc(centerX, centerY, earthRadiusPx, 0, Math.PI * 2);
      ctx.stroke();

      // Karman Line (100km Atmosphere threshold)
      ctx.setLineDash([3, 4]);
      ctx.strokeStyle = 'rgba(56, 189, 248, 0.4)';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.arc(centerX, centerY, earthRadiusPx + 8, 0, Math.PI * 2);
      ctx.stroke();
      ctx.setLineDash([]);

      // Label Earth & Atmosphere
      ctx.fillStyle = '#94a3b8';
      ctx.font = '9px monospace';
      ctx.textAlign = 'center';
      ctx.fillText('EARTH', centerX, centerY + 3);
      ctx.fillStyle = 'rgba(56, 189, 248, 0.6)';
      ctx.fillText('100 km KARMAN LINE', centerX, centerY - earthRadiusPx - 10);

      // --- DRAW TARGET ORBIT RING ---
      const isOrbited = flightPhase === 'in_orbit';
      ctx.beginPath();
      ctx.setLineDash(isOrbited ? [] : [4, 5]);
      ctx.arc(centerX, centerY, targetOrbitPx, 0, Math.PI * 2);
      ctx.strokeStyle = isOrbited 
        ? '#34d399' 
        : physics.isStable 
          ? 'rgba(52, 211, 153, 0.45)' 
          : 'rgba(244, 63, 94, 0.45)';
      ctx.lineWidth = isOrbited ? 2 : 1.2;
      ctx.stroke();
      ctx.setLineDash([]);

      // Target Orbit Label
      ctx.fillStyle = isOrbited ? '#34d399' : physics.isStable ? '#6ee7b7' : '#f87171';
      ctx.font = '10px monospace';
      ctx.textAlign = 'center';
      ctx.fillText(
        `TARGET ALTITUDE: ${targetAltitude.toLocaleString()} km ${isOrbited ? '(STABLE ORBIT)' : ''}`, 
        centerX, 
        centerY - targetOrbitPx - 6
      );

      // --- CALCULATE ROCKET POSITION & TRAJECTORY ---
      let rocketX = padX;
      let rocketY = padY;
      let rocketAngleRad = padAngle; // Points up away from Earth center
      let showRocket = true;

      const p = simProgressRef.current;

      if (!simRunning && flightPhase === 'standby') {
        // Rocket sitting on launch pad
        rocketX = padX;
        rocketY = padY;
        rocketAngleRad = padAngle;
      } else if (flightPhase === 'failed' && physics.expectedOutcome === 'pad_abort') {
        // Rocket stayed on launch pad
        rocketX = padX;
        rocketY = padY;
        rocketAngleRad = padAngle;
      } else if (simRunning || flightPhase === 'in_orbit' || flightPhase === 'failed') {
        const outcome = physics.expectedOutcome;

        // Dynamic Position Calculation
        if (outcome === 'pad_abort') {
          rocketX = padX;
          rocketY = padY;
          rocketAngleRad = padAngle;
        } else if (outcome === 'gravity_crash') {
          // Ascends to 45km then crashes into ocean at angle
          const maxP = 4.5;
          if (p <= maxP) {
            const frac = p / maxP;
            const r = earthRadiusPx + frac * 25;
            const theta = padAngle + frac * 0.35;
            rocketX = centerX + Math.cos(theta) * r;
            rocketY = centerY + Math.sin(theta) * r;
            rocketAngleRad = theta + 0.3;
          } else {
            // Plunge down
            const fallFrac = Math.min(1, (p - maxP) / 2.5);
            const r = earthRadiusPx + 25 * (1 - fallFrac);
            const theta = padAngle + 0.35 + fallFrac * 0.4;
            rocketX = centerX + Math.cos(theta) * r;
            rocketY = centerY + Math.sin(theta) * r;
            rocketAngleRad = theta + Math.PI - 0.2; // nose pointed down
          }
        } else if (outcome === 'insufficient_deltav') {
          // Reaches 65% altitude then falls back
          const peakP = 9.0;
          if (p <= peakP) {
            const frac = p / peakP;
            const r = earthRadiusPx + (targetOrbitPx - earthRadiusPx) * 0.65 * frac;
            const theta = padAngle + frac * 1.8;
            rocketX = centerX + Math.cos(theta) * r;
            rocketY = centerY + Math.sin(theta) * r;
            rocketAngleRad = theta + Math.PI / 2 * 0.7;
          } else {
            // Re-entry curve
            const fallFrac = Math.min(1, (p - peakP) / 3.0);
            const r = earthRadiusPx + (targetOrbitPx - earthRadiusPx) * 0.65 * (1 - fallFrac);
            const theta = padAngle + 1.8 + fallFrac * 0.8;
            rocketX = centerX + Math.cos(theta) * r;
            rocketY = centerY + Math.sin(theta) * r;
            rocketAngleRad = theta + Math.PI / 2 * 1.2;
          }
        } else if (outcome === 'atmosphere_decay') {
          const frac = Math.min(1, p / 8.5);
          const r = earthRadiusPx + 8 * (1 - Math.pow(frac - 0.5, 2) * 4);
          const theta = padAngle + frac * 1.5;
          rocketX = centerX + Math.cos(theta) * Math.max(earthRadiusPx, r);
          rocketY = centerY + Math.sin(theta) * Math.max(earthRadiusPx, r);
          rocketAngleRad = theta + Math.PI / 2;
        } else {
          // Nominal Success trajectory
          if (p <= 10.0) {
            // Ascent & Transfer arc
            const frac = p / 10.0;
            const easeFrac = Math.sin((frac * Math.PI) / 2);
            const currentR = earthRadiusPx + (targetOrbitPx - earthRadiusPx) * easeFrac;
            const theta = padAngle + frac * 2.2;
            rocketX = centerX + Math.cos(theta) * currentR;
            rocketY = centerY + Math.sin(theta) * currentR;
            // Angle pitches from vertical (padAngle) to tangential (+PI/2)
            rocketAngleRad = theta + (Math.PI / 2) * frac;
          } else {
            // Orbital coasting (perpetual circular orbit)
            const orbitTime = p - 10.0;
            const theta = padAngle + 2.2 + orbitTime * 0.55;
            rocketX = centerX + Math.cos(theta) * targetOrbitPx;
            rocketY = centerY + Math.sin(theta) * targetOrbitPx;
            rocketAngleRad = theta + Math.PI / 2; // perfectly tangential
          }
        }

        // Record Trajectory Trail
        if (simRunning && !simPaused) {
          trailRef.current.push({
            x: rocketX,
            y: rocketY,
            altitudeKm: telemetry.altitudeKm,
            isFail: flightPhase === 'failed'
          });
          if (trailRef.current.length > 300) trailRef.current.shift();
        }

        // Emit exhaust particles during powered ascent
        if (simRunning && !simPaused) {
          if (flightPhase === 'liftoff' || flightPhase === 'max_q') {
            addExhaustParticles(rocketX, rocketY, rocketAngleRad, 1.0, false);
          } else if (flightPhase === 'staging' || flightPhase === 'insertion') {
            addExhaustParticles(rocketX, rocketY, rocketAngleRad, 0.8, true);
          } else if (flightPhase === 'failed') {
            // Re-entry fire or crash smoke
            particlesRef.current.push({
              x: rocketX + (Math.random() - 0.5) * 6,
              y: rocketY + (Math.random() - 0.5) * 6,
              vx: (Math.random() - 0.5) * 1.5,
              vy: (Math.random() - 0.5) * 1.5,
              life: 0,
              maxLife: 20,
              color: Math.random() > 0.4 ? 'rgba(239, 68, 68, 0.8)' : 'rgba(249, 115, 22, 0.8)',
              size: 3 + Math.random() * 2,
              type: 'reentry'
            });
          }
        }
      }

      // --- DRAW FLIGHT TRAIL ---
      if (trailRef.current.length > 1) {
        ctx.beginPath();
        ctx.moveTo(trailRef.current[0].x, trailRef.current[0].y);
        for (let i = 1; i < trailRef.current.length; i++) {
          ctx.lineTo(trailRef.current[i].x, trailRef.current[i].y);
        }
        ctx.strokeStyle = flightPhase === 'failed' ? '#f43f5e' : '#34d399';
        ctx.lineWidth = 2;
        ctx.stroke();
      }

      // --- UPDATE & RENDER PARTICLES ---
      for (let i = particlesRef.current.length - 1; i >= 0; i--) {
        const pt = particlesRef.current[i];
        pt.x += pt.vx;
        pt.y += pt.vy;
        pt.life++;

        const alpha = 1 - pt.life / pt.maxLife;
        if (alpha <= 0) {
          particlesRef.current.splice(i, 1);
          continue;
        }

        ctx.fillStyle = pt.color;
        ctx.globalAlpha = alpha;
        ctx.beginPath();
        ctx.arc(pt.x, pt.y, pt.size * alpha, 0, Math.PI * 2);
        ctx.fill();
        ctx.globalAlpha = 1.0;
      }

      // --- DRAW LAUNCH PAD MARKER ---
      ctx.fillStyle = '#64748b';
      ctx.fillRect(padX - 4, padY - 2, 8, 4);
      ctx.strokeStyle = '#38bdf8';
      ctx.lineWidth = 1;
      ctx.strokeRect(padX - 4, padY - 2, 8, 4);

      // --- DRAW ROCKET VEHICLE ---
      if (showRocket) {
        ctx.save();
        ctx.translate(rocketX, rocketY);
        ctx.rotate(rocketAngleRad);

        if (flightPhase === 'in_orbit') {
          // SATELLITE WITH SOLAR PANELS IN ORBIT
          // Center bus
          ctx.fillStyle = '#e2e8f0';
          ctx.fillRect(-4, -4, 8, 8);
          ctx.strokeStyle = '#34d399';
          ctx.lineWidth = 1;
          ctx.strokeRect(-4, -4, 8, 8);

          // Solar wings (left & right)
          ctx.fillStyle = '#0284c7';
          ctx.fillRect(-12, -2, 7, 4);
          ctx.fillRect(5, -2, 7, 4);
          ctx.strokeStyle = '#38bdf8';
          ctx.strokeRect(-12, -2, 7, 4);
          ctx.strokeRect(5, -2, 7, 4);

          // Beaming pulse
          ctx.beginPath();
          ctx.arc(0, 0, 8 + Math.sin(time * 0.006) * 3, 0, Math.PI * 2);
          ctx.strokeStyle = 'rgba(52, 211, 153, 0.5)';
          ctx.stroke();
        } else {
          // ASCENDING ROCKET
          // Rocket Body
          ctx.fillStyle = '#ffffff';
          ctx.beginPath();
          ctx.moveTo(0, -9); // Nose cone tip
          ctx.lineTo(3.5, -2);
          ctx.lineTo(3.5, 6); // Base right
          ctx.lineTo(-3.5, 6); // Base left
          ctx.lineTo(-3.5, -2);
          ctx.closePath();
          ctx.fill();
          ctx.strokeStyle = '#0f172a';
          ctx.lineWidth = 0.8;
          ctx.stroke();

          // Stage separation line
          if (flightPhase === 'staging' || flightPhase === 'insertion') {
            ctx.fillStyle = '#00f0ff';
            ctx.fillRect(-2.5, 0, 5, 2);
          } else {
            ctx.strokeStyle = '#0284c7';
            ctx.beginPath();
            ctx.moveTo(-3.5, 1);
            ctx.lineTo(3.5, 1);
            ctx.stroke();
          }

          // Engine bells
          ctx.fillStyle = '#64748b';
          ctx.fillRect(-2.5, 6, 5, 2);

          // Transonic Max-Q condensation vapor cone
          if (flightPhase === 'max_q') {
            ctx.strokeStyle = 'rgba(255, 255, 255, 0.7)';
            ctx.lineWidth = 1.5;
            ctx.beginPath();
            ctx.arc(0, 0, 9, Math.PI * 0.2, Math.PI * 0.8);
            ctx.stroke();
          }
        }

        ctx.restore();
      }

      // --- ON SCREEN TELEMETRY HUD OVERLAY ---
      ctx.fillStyle = 'rgba(15, 23, 42, 0.85)';
      ctx.strokeStyle = 'rgba(51, 65, 85, 0.6)';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.roundRect(12, 12, 175, 75, 8);
      ctx.fill();
      ctx.stroke();

      ctx.font = 'bold 9px monospace';
      ctx.fillStyle = '#38bdf8';
      ctx.textAlign = 'left';
      ctx.fillText(`MISSION T+${missionElapsedSeconds.toString().padStart(4, '0')}s`, 20, 26);

      ctx.fillStyle = '#94a3b8';
      ctx.font = '9px monospace';
      ctx.fillText(`ALTITUDE : ${telemetry.altitudeKm.toLocaleString()} km`, 20, 40);
      ctx.fillText(`VELOCITY : ${telemetry.velocityKmS} km/s`, 20, 54);
      ctx.fillText(`G-FORCE  : ${telemetry.accelerationG} G`, 20, 68);

      // Status pill at top right of canvas
      const statusText = 
        flightPhase === 'standby' ? 'READY ON LAUNCH PAD' :
        flightPhase === 'ignition' ? 'IGNITION & LIFTOFF' :
        flightPhase === 'liftoff' ? 'ASCENT PHASE' :
        flightPhase === 'max_q' ? 'MAX-Q TRANSONIC' :
        flightPhase === 'staging' ? 'MECO & STAGING' :
        flightPhase === 'insertion' ? 'ORBITAL INJECTION' :
        flightPhase === 'in_orbit' ? 'ORBIT INSERTION CONFIRMED' : 'MISSION ABORT / FAILED';

      const statusColor = 
        flightPhase === 'in_orbit' ? '#34d399' :
        flightPhase === 'failed' ? '#f43f5e' :
        flightPhase === 'standby' ? '#94a3b8' : '#38bdf8';

      ctx.fillStyle = 'rgba(15, 23, 42, 0.85)';
      ctx.strokeStyle = statusColor;
      ctx.beginPath();
      ctx.roundRect(width - 185, 12, 173, 24, 6);
      ctx.fill();
      ctx.stroke();

      ctx.font = 'bold 8.5px monospace';
      ctx.fillStyle = statusColor;
      ctx.textAlign = 'center';
      ctx.fillText(statusText, width - 98, 27);

      animId = requestAnimationFrame(render);
    };

    animId = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(animId);
    };
  }, [
    simRunning, 
    simPaused, 
    simSpeed, 
    flightPhase, 
    physics, 
    targetAltitude, 
    missionElapsedSeconds, 
    telemetry
  ]);

  return (
    <div className="bg-[#0b0f17] border border-slate-800 rounded-3xl p-5 sm:p-7 space-y-6 shadow-2xl relative overflow-hidden">
      
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-5">
        <div className="flex items-center gap-3.5">
          <div className="p-3 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 shadow-lg shadow-emerald-500/10">
            <Rocket className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-xl font-black text-white font-mono uppercase tracking-tight flex items-center gap-2">
              <span>Orbital Launch & Trajectory Calculator</span>
              <span className="text-[10px] font-mono bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 px-2 py-0.5 rounded-full">
                Real-Time Physics
              </span>
            </h3>
            <p className="text-xs text-slate-400 font-mono mt-0.5">
              Multi-Stage Rocketry • Keplerian Mechanics • Tsiolkovsky $\Delta V$ Engine
            </p>
          </div>
        </div>

        {/* Primary Simulation Action Bar */}
        <div className="flex items-center gap-2 flex-wrap">
          {!simRunning ? (
            <button
              onClick={handleStartLaunch}
              className="px-5 py-2.5 rounded-xl bg-emerald-400 hover:bg-emerald-300 text-slate-950 font-mono font-black text-xs uppercase tracking-wider transition-all flex items-center gap-2 cursor-pointer shadow-lg shadow-emerald-400/25 active:scale-95"
            >
              <Play className="w-4 h-4 fill-current" />
              <span>Simulate Launch</span>
            </button>
          ) : (
            <>
              <button
                onClick={handlePauseResume}
                className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-mono text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer"
              >
                {simPaused ? <Play className="w-3.5 h-3.5 fill-current" /> : <Pause className="w-3.5 h-3.5 fill-current" />}
                <span>{simPaused ? 'Resume' : 'Pause'}</span>
              </button>

              <button
                onClick={() => setSimSpeed((s) => (s === 1 ? 2 : s === 2 ? 4 : 1))}
                className="px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-cyan-400 font-mono text-xs font-bold transition-all flex items-center gap-1 cursor-pointer"
                title="Simulation Speed"
              >
                <FastForward className="w-3.5 h-3.5" />
                <span>{simSpeed}x</span>
              </button>

              <button
                onClick={handleReset}
                className="px-3.5 py-2 rounded-xl bg-rose-500/20 hover:bg-rose-500/30 border border-rose-500/40 text-rose-300 font-mono text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Reset</span>
              </button>
            </>
          )}
        </div>
      </div>

      {/* Quick Mission Preset Buttons */}
      <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1 text-xs font-mono">
        <span className="text-slate-500 uppercase text-[10px] font-bold shrink-0 flex items-center gap-1">
          <Layers className="w-3.5 h-3.5" />
          <span>Presets:</span>
        </span>
        <button
          onClick={() => handleLoadPreset('starlink')}
          className="px-2.5 py-1 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 hover:text-emerald-400 transition-colors shrink-0 cursor-pointer"
        >
          🛰️ Starlink LEO (550 km)
        </button>
        <button
          onClick={() => handleLoadPreset('geo_heavy')}
          className="px-2.5 py-1 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 hover:text-cyan-400 transition-colors shrink-0 cursor-pointer"
        >
          🚀 Heavy GEO (35,786 km)
        </button>
        <button
          onClick={() => handleLoadPreset('smallsat')}
          className="px-2.5 py-1 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 hover:text-purple-400 transition-colors shrink-0 cursor-pointer"
        >
          🔬 SmallSat LEO (400 km)
        </button>
        <button
          onClick={() => handleLoadPreset('fail_twr')}
          className="px-2.5 py-1 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/30 text-rose-400 transition-colors shrink-0 cursor-pointer"
        >
          💥 Test Pad Abort (TWR &lt; 1.0)
        </button>
        <button
          onClick={() => handleLoadPreset('fail_deltav')}
          className="px-2.5 py-1 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/30 text-rose-400 transition-colors shrink-0 cursor-pointer"
        >
          ⚠️ Test Insufficient ΔV (Burnout)
        </button>
        <button
          onClick={() => handleLoadPreset('fail_drag')}
          className="px-2.5 py-1 rounded-lg bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 text-amber-400 transition-colors shrink-0 cursor-pointer"
        >
          ☄️ Test Drag Decay (&lt; 150 km)
        </button>
      </div>

      {/* Main Grid: Input Sliders vs Interactive Visual Canvas */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Left Column: 3 Sliders + Pre-flight Analysis */}
        <div className="lg:col-span-5 space-y-5 bg-slate-950/90 p-5 rounded-2xl border border-slate-800/90 shadow-inner">
          
          <div className="flex items-center justify-between border-b border-slate-800/80 pb-3">
            <span className="text-xs font-mono font-bold uppercase text-slate-300 flex items-center gap-1.5">
              <Sliders className="w-4 h-4 text-emerald-400" />
              <span>Rocket Propulsion Parameters</span>
            </span>
            <span className="text-[11px] font-mono text-slate-500">
              Total Wet Mass: {(physics.totalMassKg / 1000).toFixed(1)}t
            </span>
          </div>

          {/* Slider 1: Payload Mass */}
          <div className="space-y-2">
            <div className="flex justify-between items-center text-xs font-mono">
              <label className="text-slate-300 font-bold uppercase flex items-center gap-1">
                <span>Payload Mass ($m_{'{payload}'}$)</span>
              </label>
              <span className="text-emerald-400 font-black text-sm">{payloadMass.toLocaleString()} kg</span>
            </div>
            <input
              type="range"
              min="500"
              max="50000"
              step="500"
              value={payloadMass}
              onChange={(e) => {
                setPayloadMass(Number(e.target.value));
                if (simRunning) handleReset();
              }}
              className="w-full accent-emerald-400 bg-slate-900 h-2 rounded-lg cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-slate-500 font-mono">
              <span>500 kg (SmallSat)</span>
              <span>16,500 kg (Commercial)</span>
              <span>50,000 kg (Heavy)</span>
            </div>
          </div>

          {/* Slider 2: Liftoff Thrust */}
          <div className="space-y-2">
            <div className="flex justify-between items-center text-xs font-mono">
              <label className="text-slate-300 font-bold uppercase flex items-center gap-1">
                <span>Liftoff Thrust ($T$)</span>
              </label>
              <span className="text-cyan-400 font-black text-sm">{thrust.toLocaleString()} kN</span>
            </div>
            <input
              type="range"
              min="1000"
              max="25000"
              step="200"
              value={thrust}
              onChange={(e) => {
                setThrust(Number(e.target.value));
                if (simRunning) handleReset();
              }}
              className="w-full accent-cyan-400 bg-slate-900 h-2 rounded-lg cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-slate-500 font-mono">
              <span>1,000 kN (Light)</span>
              <span>7,600 kN (Falcon 9)</span>
              <span>25,000 kN (Super-Heavy)</span>
            </div>
          </div>

          {/* Slider 3: Target Orbit Altitude */}
          <div className="space-y-2">
            <div className="flex justify-between items-center text-xs font-mono">
              <label className="text-slate-300 font-bold uppercase flex items-center gap-1">
                <span>Target Altitude ($h$)</span>
              </label>
              <span className="text-purple-400 font-black text-sm">{targetAltitude.toLocaleString()} km</span>
            </div>
            <input
              type="range"
              min="100"
              max="35786"
              step="50"
              value={targetAltitude}
              onChange={(e) => {
                setTargetAltitude(Number(e.target.value));
                if (simRunning) handleReset();
              }}
              className="w-full accent-purple-400 bg-slate-900 h-2 rounded-lg cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-slate-500 font-mono">
              <span>100 km (Atmosphere)</span>
              <span>400 km (LEO/ISS)</span>
              <span>35,786 km (GEO)</span>
            </div>
          </div>

          {/* Realtime Calculated Pre-flight Status Card */}
          <div className={`p-4 rounded-xl border text-xs font-mono leading-relaxed space-y-2 transition-all ${physics.badgeColor}`}>
            <div className="flex items-center gap-2 font-bold">
              {physics.isStable ? (
                <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-400" />
              ) : (
                <AlertTriangle className="w-4 h-4 shrink-0 text-rose-400" />
              )}
              <span className="uppercase">{physics.summaryTitle}</span>
            </div>
            <p className="text-[11px] opacity-90 leading-normal">
              {physics.summaryDesc}
            </p>
          </div>

          {/* Four Core Physics Metrics */}
          <div className="grid grid-cols-2 gap-2 text-xs font-mono">
            <div className="bg-slate-900/80 p-2.5 rounded-xl border border-slate-800">
              <span className="text-[10px] text-slate-500 uppercase block font-bold">LIFTOFF TWR</span>
              <div className="flex items-baseline gap-1 mt-0.5">
                <span className={`text-base font-black ${physics.twr >= 1.2 ? 'text-emerald-400' : 'text-rose-400'}`}>
                  {physics.twr}
                </span>
                <span className="text-[10px] text-slate-500">
                  {physics.twr >= 1.2 ? 'Nominal' : physics.twr < 1.0 ? 'No liftoff' : 'High loss'}
                </span>
              </div>
            </div>

            <div className="bg-slate-900/80 p-2.5 rounded-xl border border-slate-800">
              <span className="text-[10px] text-slate-500 uppercase block font-bold">ORBIT SPEED ($v$)</span>
              <div className="flex items-baseline gap-1 mt-0.5">
                <span className="text-base font-black text-cyan-400">
                  {physics.orbitalSpeed}
                </span>
                <span className="text-[10px] text-slate-500">km/s</span>
              </div>
            </div>

            <div className="bg-slate-900/80 p-2.5 rounded-xl border border-slate-800">
              <span className="text-[10px] text-slate-500 uppercase block font-bold">AVAILABLE $\Delta V$</span>
              <div className="flex items-baseline gap-1 mt-0.5">
                <span className={`text-base font-black ${physics.deltaVAvailable >= physics.deltaVRequired ? 'text-emerald-400' : 'text-rose-400'}`}>
                  {physics.deltaVAvailable}
                </span>
                <span className="text-[10px] text-slate-500">km/s</span>
              </div>
            </div>

            <div className="bg-slate-900/80 p-2.5 rounded-xl border border-slate-800">
              <span className="text-[10px] text-slate-500 uppercase block font-bold">REQUIRED $\Delta V$</span>
              <div className="flex items-baseline gap-1 mt-0.5">
                <span className="text-base font-black text-amber-400">
                  {physics.deltaVRequired}
                </span>
                <span className="text-[10px] text-slate-500">km/s</span>
              </div>
            </div>
          </div>

        </div>

        {/* Right Column: Visual Simulation Stage & Flight HUD */}
        <div className="lg:col-span-7 flex flex-col space-y-4">
          
          {/* Main Visual Canvas Container */}
          <div className="bg-slate-950 rounded-2xl border border-slate-800 relative overflow-hidden shadow-2xl">
            <canvas ref={canvasRef} className="w-full h-[360px] block" />

            {/* Bottom In-flight Telemetry Bar */}
            <div className="bg-slate-950/95 border-t border-slate-800/80 p-3 grid grid-cols-3 sm:grid-cols-6 gap-2 text-center font-mono text-xs">
              <div>
                <span className="text-[9px] text-slate-500 uppercase block">FLIGHT PHASE</span>
                <span className={`font-bold text-xs uppercase truncate block ${
                  flightPhase === 'in_orbit' ? 'text-emerald-400' : 
                  flightPhase === 'failed' ? 'text-rose-400' : 'text-cyan-400'
                }`}>
                  {flightPhase.replace('_', ' ')}
                </span>
              </div>

              <div>
                <span className="text-[9px] text-slate-500 uppercase block">ALTITUDE</span>
                <span className="font-bold text-white text-xs block">
                  {telemetry.altitudeKm} km
                </span>
              </div>

              <div>
                <span className="text-[9px] text-slate-500 uppercase block">SPEED</span>
                <span className="font-bold text-cyan-400 text-xs block">
                  {telemetry.velocityKmS} km/s
                </span>
              </div>

              <div>
                <span className="text-[9px] text-slate-500 uppercase block">ACCEL</span>
                <span className="font-bold text-purple-400 text-xs block">
                  {telemetry.accelerationG} G
                </span>
              </div>

              <div>
                <span className="text-[9px] text-slate-500 uppercase block">DOWNRANGE</span>
                <span className="font-bold text-amber-400 text-xs block">
                  {telemetry.downrangeKm} km
                </span>
              </div>

              <div>
                <span className="text-[9px] text-slate-500 uppercase block">PROPELLANT</span>
                <span className={`font-bold text-xs block ${telemetry.propellantPercent > 20 ? 'text-emerald-400' : 'text-rose-400'}`}>
                  {telemetry.propellantPercent}%
                </span>
              </div>
            </div>
          </div>

          {/* Outcome Notification Card (Displays on launch complete/failure) */}
          <AnimatePresence>
            {simOutcome && (
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className={`p-4 rounded-2xl border font-mono text-xs space-y-2 shadow-xl ${
                  simOutcome.status === 'success'
                    ? 'bg-emerald-500/10 border-emerald-500/40 text-emerald-300'
                    : 'bg-rose-500/10 border-rose-500/40 text-rose-300'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 font-black text-sm uppercase">
                    {simOutcome.status === 'success' ? (
                      <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                    ) : (
                      <AlertTriangle className="w-5 h-5 text-rose-400" />
                    )}
                    <span>{simOutcome.title}</span>
                  </div>
                  <span className="text-[10px] bg-slate-900/80 px-2 py-0.5 rounded border border-slate-700">
                    MET: T+{missionElapsedSeconds}s
                  </span>
                </div>

                <p className="text-slate-300 text-xs leading-relaxed">
                  {simOutcome.description}
                </p>

                <div className="bg-slate-950/80 p-2.5 rounded-xl border border-slate-800 text-[11px] flex items-start gap-2">
                  <span className="text-emerald-400 font-bold uppercase shrink-0">Diagnosis & Remedy:</span>
                  <span className="text-slate-300">{simOutcome.remedy}</span>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Science & Pedagogy Explainer Accordion */}
          <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 text-xs font-mono text-slate-300 space-y-3">
            <div className="flex items-center gap-2 text-white font-bold uppercase text-[11px]">
              <Compass className="w-4 h-4 text-brand-green" />
              <span>Astrodynamics Physics Principles Applied</span>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-[11px] text-slate-400">
              <div className="bg-slate-900/60 p-2.5 rounded-lg border border-slate-800">
                <span className="text-emerald-400 font-bold block mb-1">1. Liftoff TWR</span>
                <span>$TWR = \frac{'{T}'}{'{m \\cdot g_0}'}$. Must exceed 1.0 to clear pad; 1.2–1.5 avoids excessive gravity drag losses.</span>
              </div>
              <div className="bg-slate-900/60 p-2.5 rounded-lg border border-slate-800">
                <span className="text-cyan-400 font-bold block mb-1">2. Orbital Speed</span>
                <span>$v_{'{circ}'} = \sqrt{'{'}\frac{'{\\mu}'}{'{R_E + h}'}{'}'}$. Speed where Earth's curvature falls at the same rate as gravity.</span>
              </div>
              <div className="bg-slate-900/60 p-2.5 rounded-lg border border-slate-800">
                <span className="text-purple-400 font-bold block mb-1">3. Tsiolkovsky $\Delta V$</span>
                <span>$\Delta v = I_{'{sp}'} g_0 \ln\left(\frac{'{m_0}'}{'{m_f}'}\right)$. Determines total velocity capacity across both rocket stages.</span>
              </div>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};
