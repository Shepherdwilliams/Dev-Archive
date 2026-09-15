import React, { useEffect, useRef, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Activity, Radio, Cpu, Sparkles, Orbit } from 'lucide-react';

export type BackgroundMode = 'hybrid' | 'neural' | 'orbital' | 'matrix';

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  color: string;
  pulsePhase: number;
  pulseSpeed: number;
  originalRadius: number;
}

interface PulsePacket {
  fromIndex: number;
  toIndex: number;
  progress: number;
  speed: number;
  color: string;
}

interface Shockwave {
  x: number;
  y: number;
  radius: number;
  maxRadius: number;
  opacity: number;
  speed: number;
}

interface HomeBackgroundProps {
  initialMode?: BackgroundMode;
  showControls?: boolean;
}

export const HomeBackground: React.FC<HomeBackgroundProps> = ({
  initialMode = 'hybrid',
  showControls = true,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [mode, setMode] = useState<BackgroundMode>(initialMode);
  const [isInteractive, setIsInteractive] = useState<boolean>(true);
  const [statusTelemetry, setStatusTelemetry] = useState<string>('SYNAPSE_MESH::ACTIVE');
  const mousePos = useRef<{ x: number; y: number; active: boolean }>({ x: -1000, y: -1000, active: false });
  const shockwavesRef = useRef<Shockwave[]>([]);

  // Telemetry formulas floating in deep space
  const telemetryFormulas = [
    { text: 'Attention(Q,K,V) = softmax(QKᵀ / √dₖ)V', top: '15%', left: '8%', delay: 0 },
    { text: 'iħ ∂Ψ/∂t = ĤΨ [Schrödinger]', top: '28%', right: '7%', delay: 2 },
    { text: 'ΔV = I_sp · g₀ · ln(m₀ / m_f)', top: '68%', left: '6%', delay: 4 },
    { text: '∇ × B = μ₀J + μ₀ε₀(∂E/∂t)', top: '82%', right: '12%', delay: 1 },
    { text: 'ZPERIOD::SHELL[1s² 2s² 2p⁶ 3s² 3p⁶]', top: '48%', left: '4%', delay: 3 },
    { text: 'E = mc² // c = 299,792,458 m/s', top: '75%', right: '5%', delay: 5 },
  ];

  // Spawn a click ripple shockwave
  const triggerShockwave = useCallback((x: number, y: number) => {
    shockwavesRef.current.push({
      x,
      y,
      radius: 0,
      maxRadius: Math.min(window.innerWidth, window.innerHeight) * 0.45,
      opacity: 0.8,
      speed: 4.5,
    });
    setStatusTelemetry(`QUANTUM_PULSE @ [${Math.round(x)}, ${Math.round(y)}]`);
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d', { alpha: true });
    if (!ctx) return;

    let animationFrameId: number;
    let width = 0;
    let height = 0;

    // High DPI setup
    const resize = () => {
      if (!canvas) return;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    resize();
    window.addEventListener('resize', resize);

    // Color palettes
    const nodeColors = [
      'rgba(138, 201, 38, ',   // Brand Green #8AC926
      'rgba(56, 189, 248, ',   // Sky Cyan
      'rgba(52, 211, 153, ',   // Emerald
      'rgba(248, 250, 252, ',  // Bright Starlight
    ];

    // Node count scales gracefully with screen size
    const particleCount = Math.min(
      Math.floor((width * height) / (width < 768 ? 16000 : 13000)),
      width < 768 ? 45 : 85
    );

    const particles: Particle[] = Array.from({ length: particleCount }, () => {
      const radius = Math.random() * 2.2 + 1.2;
      return {
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.45,
        vy: (Math.random() - 0.5) * 0.45,
        radius,
        originalRadius: radius,
        color: nodeColors[Math.floor(Math.random() * nodeColors.length)],
        pulsePhase: Math.random() * Math.PI * 2,
        pulseSpeed: Math.random() * 0.03 + 0.01,
      };
    });

    // Synaptic transmission packets moving between connected nodes
    const pulses: PulsePacket[] = [];

    // Ambient orbital angle
    let orbitalAngle = 0;

    // Handle visibility changes to conserve CPU/battery
    let isTabVisible = !document.hidden;
    const handleVisibilityChange = () => {
      isTabVisible = !document.hidden;
    };
    document.addEventListener('visibilitychange', handleVisibilityChange);

    // Mouse movement listener
    const handleMouseMove = (e: MouseEvent) => {
      if (!isInteractive) return;
      mousePos.current.x = e.clientX;
      mousePos.current.y = e.clientY;
      mousePos.current.active = true;
    };

    const handleMouseLeave = () => {
      mousePos.current.active = false;
    };

    const handleClick = (e: MouseEvent) => {
      if (!isInteractive) return;
      triggerShockwave(e.clientX, e.clientY);
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseleave', handleMouseLeave);
    window.addEventListener('click', handleClick);

    // Main animation loop
    let lastTime = performance.now();

    const render = (time: number) => {
      animationFrameId = requestAnimationFrame(render);
      if (!isTabVisible) return;

      const dt = Math.min((time - lastTime) / 1000, 0.1);
      lastTime = time;

      ctx.clearRect(0, 0, width, height);

      // 1. Cyber Perspective Floor Grid (Matrix & Hybrid modes)
      if (mode === 'matrix' || mode === 'hybrid') {
        ctx.save();
        const horizonY = height * 0.72;
        const gridOpacity = mode === 'matrix' ? 0.22 : 0.12;

        ctx.strokeStyle = `rgba(138, 201, 38, ${gridOpacity})`;
        ctx.lineWidth = 0.75;

        // Vanishing perspective lines
        const vanishingX = width * 0.5;
        const vanishingY = horizonY - 40;
        const lineCount = width < 768 ? 12 : 24;

        for (let i = -lineCount; i <= lineCount; i++) {
          const startX = vanishingX + (i * (width / (lineCount * 0.8)));
          ctx.beginPath();
          ctx.moveTo(vanishingX, vanishingY);
          ctx.lineTo(startX, height);
          ctx.stroke();
        }

        // Horizontal ground lines with exponential spacing
        let y = horizonY;
        let step = 8;
        while (y < height) {
          ctx.beginPath();
          ctx.moveTo(0, y);
          ctx.lineTo(width, y);
          ctx.stroke();
          y += step;
          step *= 1.25;
        }

        // Fading horizon glow
        const horizonGradient = ctx.createLinearGradient(0, horizonY - 60, 0, horizonY + 80);
        horizonGradient.addColorStop(0, 'rgba(11, 13, 14, 1)');
        horizonGradient.addColorStop(0.5, 'rgba(138, 201, 38, 0.08)');
        horizonGradient.addColorStop(1, 'rgba(11, 13, 14, 0.9)');
        ctx.fillStyle = horizonGradient;
        ctx.fillRect(0, horizonY - 60, width, 140);

        ctx.restore();
      }

      // 2. Concentric Keplerian / Atomic Orbital Shells (Orbital & Hybrid modes)
      if (mode === 'orbital' || mode === 'hybrid') {
        ctx.save();
        orbitalAngle += dt * 0.2;
        const centerX = width * 0.65;
        const centerY = height * 0.35;
        const baseOrbit = Math.min(width, height) * 0.22;

        const shells = [
          { r: baseOrbit * 0.6, speed: 1.2, color: 'rgba(56, 189, 248, 0.18)', bodyColor: '#38BDF8', dash: [4, 8] },
          { r: baseOrbit * 1.0, speed: 0.8, color: 'rgba(138, 201, 38, 0.2)', bodyColor: '#8AC926', dash: [6, 10] },
          { r: baseOrbit * 1.45, speed: 0.5, color: 'rgba(52, 211, 153, 0.16)', bodyColor: '#34D399', dash: [3, 12] },
          { r: baseOrbit * 1.95, speed: 0.3, color: 'rgba(56, 189, 248, 0.12)', bodyColor: '#60A5FA', dash: [8, 14] },
        ];

        shells.forEach((shell, index) => {
          // Elliptical rotation
          ctx.save();
          ctx.translate(centerX, centerY);
          ctx.rotate(index * 0.25 - 0.3);

          ctx.beginPath();
          ctx.setLineDash(shell.dash);
          ctx.strokeStyle = shell.color;
          ctx.lineWidth = 1.2;
          ctx.ellipse(0, 0, shell.r, shell.r * 0.45, 0, 0, Math.PI * 2);
          ctx.stroke();

          // Orbiting satellite body / electron
          const bodyAngle = orbitalAngle * shell.speed + index * 1.8;
          const bodyX = Math.cos(bodyAngle) * shell.r;
          const bodyY = Math.sin(bodyAngle) * (shell.r * 0.45);

          // Glow around satellite
          ctx.fillStyle = shell.bodyColor;
          ctx.shadowColor = shell.bodyColor;
          ctx.shadowBlur = 10;
          ctx.beginPath();
          ctx.arc(bodyX, bodyY, 3, 0, Math.PI * 2);
          ctx.fill();

          // Small orbit trail
          ctx.shadowBlur = 0;
          ctx.restore();
        });

        ctx.restore();
      }

      // 3. Shockwave ripples from clicks
      for (let i = shockwavesRef.current.length - 1; i >= 0; i--) {
        const sw = shockwavesRef.current[i];
        sw.radius += sw.speed;
        sw.opacity -= 0.015;

        if (sw.opacity <= 0 || sw.radius >= sw.maxRadius) {
          shockwavesRef.current.splice(i, 1);
          continue;
        }

        ctx.save();
        ctx.beginPath();
        ctx.arc(sw.x, sw.y, sw.radius, 0, Math.PI * 2);
        ctx.strokeStyle = `rgba(138, 201, 38, ${sw.opacity * 0.6})`;
        ctx.lineWidth = 2.5;
        ctx.shadowColor = 'rgba(138, 201, 38, 0.8)';
        ctx.shadowBlur = 16;
        ctx.stroke();
        ctx.restore();
      }

      // 4. Update and render particles & neural connections
      const maxDistance = mode === 'neural' ? 150 : 125;
      const mouseDistThreshold = 170;

      particles.forEach((p, index) => {
        // Update position
        p.x += p.vx;
        p.y += p.vy;

        // Bounce off edges with soft damp
        if (p.x < 0) { p.x = 0; p.vx = Math.abs(p.vx); }
        if (p.x > width) { p.x = width; p.vx = -Math.abs(p.vx); }
        if (p.y < 0) { p.y = 0; p.vy = Math.abs(p.vy); }
        if (p.y > height) { p.y = height; p.vy = -Math.abs(p.vy); }

        // Pulse phase
        p.pulsePhase += p.pulseSpeed;
        const pulseFactor = 0.8 + Math.sin(p.pulsePhase) * 0.35;
        p.radius = p.originalRadius * pulseFactor;

        // Shockwave displacement
        shockwavesRef.current.forEach((sw) => {
          const dx = p.x - sw.x;
          const dy = p.y - sw.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          const diff = Math.abs(dist - sw.radius);
          if (diff < 30) {
            const force = ((30 - diff) / 30) * sw.opacity * 1.5;
            p.x += (dx / (dist || 1)) * force;
            p.y += (dy / (dist || 1)) * force;
          }
        });

        // Mouse interaction (gravity and connection)
        if (mousePos.current.active && isInteractive) {
          const mdx = mousePos.current.x - p.x;
          const mdy = mousePos.current.y - p.y;
          const mdist = Math.sqrt(mdx * mdx + mdy * mdy);

          if (mdist < mouseDistThreshold) {
            const proximity = 1 - mdist / mouseDistThreshold;
            // Draw glowing synaptic line to pointer
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(mousePos.current.x, mousePos.current.y);
            ctx.strokeStyle = `rgba(56, 189, 248, ${proximity * 0.45})`;
            ctx.lineWidth = 1 + proximity * 1.2;
            ctx.stroke();

            // Subtle attraction force
            p.vx += (mdx / mdist) * 0.04 * proximity;
            p.vy += (mdy / mdist) * 0.04 * proximity;
          }
        }

        // Clamp speed
        const speed = Math.sqrt(p.vx * p.vx + p.vy * p.vy);
        if (speed > 1.8) {
          p.vx = (p.vx / speed) * 1.8;
          p.vy = (p.vy / speed) * 1.8;
        }

        // Draw particle node
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = `${p.color}${0.4 + pulseFactor * 0.3})`;
        ctx.fill();

        // Connect with other nearby nodes
        for (let j = index + 1; j < particles.length; j++) {
          const p2 = particles[j];
          const dx = p.x - p2.x;
          const dy = p.y - p2.y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < maxDistance) {
            const alpha = (1 - dist / maxDistance) * (mode === 'neural' ? 0.35 : 0.22);
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.strokeStyle = `rgba(138, 201, 38, ${alpha})`;
            ctx.lineWidth = 0.8;
            ctx.stroke();

            // Randomly spawn data packet pulse along active connection
            if (pulses.length < 16 && Math.random() < 0.0008) {
              pulses.push({
                fromIndex: index,
                toIndex: j,
                progress: 0,
                speed: 0.015 + Math.random() * 0.02,
                color: Math.random() > 0.5 ? '#8AC926' : '#38BDF8',
              });
            }
          }
        }
      });

      // 5. Render traveling data packets (synapse action potentials)
      for (let i = pulses.length - 1; i >= 0; i--) {
        const pulse = pulses[i];
        const p1 = particles[pulse.fromIndex];
        const p2 = particles[pulse.toIndex];

        if (!p1 || !p2) {
          pulses.splice(i, 1);
          continue;
        }

        pulse.progress += pulse.speed;
        if (pulse.progress >= 1) {
          pulses.splice(i, 1);
          continue;
        }

        const px = p1.x + (p2.x - p1.x) * pulse.progress;
        const py = p1.y + (p2.y - p1.y) * pulse.progress;

        ctx.save();
        ctx.fillStyle = pulse.color;
        ctx.shadowColor = pulse.color;
        ctx.shadowBlur = 8;
        ctx.beginPath();
        ctx.arc(px, py, 2.2, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      }
    };

    animationFrameId = requestAnimationFrame(render);

    return () => {
      window.removeEventListener('resize', resize);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseleave', handleMouseLeave);
      window.removeEventListener('click', handleClick);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      cancelAnimationFrame(animationFrameId);
    };
  }, [mode, isInteractive, triggerShockwave]);

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 pointer-events-none z-0 overflow-hidden select-none"
      aria-hidden="true"
    >
      {/* Dynamic Ambient Volumetric Nebula Glows */}
      <div className="absolute -top-32 left-1/4 w-[600px] h-[500px] bg-brand-green/8 blur-[160px] rounded-full pointer-events-none" />
      <div className="absolute top-1/3 -right-24 w-[550px] h-[550px] bg-cyan-500/8 blur-[170px] rounded-full pointer-events-none" />
      <div className="absolute -bottom-40 left-1/3 w-[700px] h-[450px] bg-emerald-500/6 blur-[180px] rounded-full pointer-events-none" />

      {/* Deep Space Vignette Gradient to ensure 100% WCAG text contrast */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#0B0D0E]/60 via-transparent to-[#0B0D0E]/90 pointer-events-none" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_0%,#0B0D0E_85%)] pointer-events-none" />

      {/* Floating STEM & AI Mathematical Watermarks */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-20">
        {telemetryFormulas.map((item, idx) => (
          <motion.div
            key={idx}
            style={{
              position: 'absolute',
              top: item.top,
              left: item.left,
              right: item.right,
            }}
            initial={{ opacity: 0, y: 10 }}
            animate={{
              opacity: [0.15, 0.35, 0.15],
              y: [0, -8, 0],
            }}
            transition={{
              duration: 12 + idx * 2,
              repeat: Infinity,
              ease: 'easeInOut',
              delay: item.delay,
            }}
            className="font-mono text-xs text-slate-400 font-semibold tracking-wider hidden lg:block"
          >
            {item.text}
          </motion.div>
        ))}
      </div>

      {/* High-Performance Canvas for Particles, Waves & Grid */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 block w-full h-full pointer-events-none"
      />

      {/* Minimalist Floating Scientific HUD Controls (Interactive) */}
      {showControls && (
        <div className="absolute top-24 sm:top-28 right-4 sm:right-8 z-20 pointer-events-auto flex flex-col items-end gap-2">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex items-center gap-1.5 p-1 bg-brand-gray-dark/85 backdrop-blur-md border border-brand-border/90 rounded-full shadow-2xl"
          >
            <button
              onClick={() => {
                setMode('hybrid');
                setStatusTelemetry('MODE::HARMONIC_HYBRID');
              }}
              className={`px-2.5 py-1 rounded-full text-[11px] font-mono transition-all cursor-pointer flex items-center gap-1 ${
                mode === 'hybrid'
                  ? 'bg-brand-green text-brand-black font-bold shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
              title="Balanced Neural Synapse & Orbital Hybrid"
            >
              <Sparkles className="w-3 h-3" />
              <span>Hybrid</span>
            </button>

            <button
              onClick={() => {
                setMode('neural');
                setStatusTelemetry('MODE::NEURAL_SYNAPSE_MESH');
              }}
              className={`px-2.5 py-1 rounded-full text-[11px] font-mono transition-all cursor-pointer flex items-center gap-1 ${
                mode === 'neural'
                  ? 'bg-cyan-400 text-brand-black font-bold shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
              title="Dense Neural Synapse Mesh with traveling action potentials"
            >
              <Cpu className="w-3 h-3" />
              <span>Neural</span>
            </button>

            <button
              onClick={() => {
                setMode('orbital');
                setStatusTelemetry('MODE::QUANTUM_ORBITAL_SHELLS');
              }}
              className={`px-2.5 py-1 rounded-full text-[11px] font-mono transition-all cursor-pointer flex items-center gap-1 ${
                mode === 'orbital'
                  ? 'bg-emerald-400 text-brand-black font-bold shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
              title="Concentric Keplerian & Bohr Orbital Trajectories"
            >
              <Orbit className="w-3 h-3" />
              <span>Orbitals</span>
            </button>

            <button
              onClick={() => {
                setMode('matrix');
                setStatusTelemetry('MODE::CYBERNETIC_MATRIX');
              }}
              className={`px-2.5 py-1 rounded-full text-[11px] font-mono transition-all cursor-pointer flex items-center gap-1 ${
                mode === 'matrix'
                  ? 'bg-brand-green text-brand-black font-bold shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
              title="3D Horizon Cybernetic Perspective Grid"
            >
              <Activity className="w-3 h-3" />
              <span>Matrix</span>
            </button>

            <div className="w-[1px] h-3.5 bg-slate-700/80 mx-0.5" />

            <button
              onClick={() => {
                setIsInteractive(!isInteractive);
                setStatusTelemetry(isInteractive ? 'POINTER_FX::STANDBY' : 'POINTER_FX::ENGAGED');
              }}
              className={`p-1.5 rounded-full text-[10px] font-mono transition-all cursor-pointer ${
                isInteractive
                  ? 'bg-brand-green/20 text-brand-green hover:bg-brand-green/30'
                  : 'bg-slate-800 text-slate-500 hover:text-slate-300'
              }`}
              title={isInteractive ? 'Pointer & Click Ripple active (Click to pause)' : 'Pointer FX paused (Click to enable)'}
            >
              <Radio className={`w-3 h-3 ${isInteractive ? 'animate-pulse' : ''}`} />
            </button>
          </motion.div>

          {/* Micro Telemetry HUD readout */}
          <div className="text-[10px] font-mono text-slate-400/80 flex items-center gap-1.5 px-2 py-0.5 bg-black/40 rounded border border-white/5 pointer-events-none">
            <span className="w-1.5 h-1.5 rounded-full bg-brand-green animate-ping" />
            <span className="tracking-wider">{statusTelemetry}</span>
          </div>
        </div>
      )}
    </div>
  );
};
