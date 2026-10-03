import React, { useEffect, useRef, useState } from 'react';

export type BackgroundMode = 
  | 'HOME'
  | 'MAP'
  | 'ELECTION'
  | 'CAMPAIGN'
  | 'MEDIA'
  | 'CRISIS'
  | 'GOVERNMENT'
  | 'SUCCESS'
  | 'DISASTER_RESPONSE';

export type CrisisAtmosphere = 'FLOOD' | 'DROUGHT' | 'CYCLONE' | 'ECONOMIC' | 'POLITICAL' | 'NONE';

interface DynamicBackgroundProps {
  mode: BackgroundMode;
  crisisType?: CrisisAtmosphere;
  reducedMotion?: boolean;
}

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  alpha: number;
  color: string;
  shape?: 'CIRCLE' | 'SQUARE' | 'SPARKLE';
}

export const DynamicBackground: React.FC<DynamicBackgroundProps> = ({
  mode,
  crisisType = 'NONE',
  reducedMotion = false,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [tickerOffset, setTickerOffset] = useState(0);

  // News ticker animation for MEDIA mode
  useEffect(() => {
    if (mode !== 'MEDIA') return;
    const interval = setInterval(() => {
      setTickerOffset((prev) => (prev + 1) % 1000);
    }, 50);
    return () => clearInterval(interval);
  }, [mode]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let isVisible = true;

    const handleVisibility = () => {
      isVisible = !document.hidden;
    };
    document.addEventListener('visibilitychange', handleVisibility);

    const prefersReducedMotion = reducedMotion || window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const resize = () => {
      if (!canvas) return;
      canvas.width = canvas.parentElement?.clientWidth || window.innerWidth;
      canvas.height = canvas.parentElement?.clientHeight || window.innerHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    // Particle pool tuned for 60fps on mid-range Android devices
    const particleCount = prefersReducedMotion ? 6 : mode === 'CAMPAIGN' || mode === 'SUCCESS' ? 24 : 16;
    const particles: Particle[] = [];

    const getParticleColor = () => {
      if (mode === 'CRISIS') {
        if (crisisType === 'FLOOD') return 'rgba(56, 189, 248, ';
        if (crisisType === 'DROUGHT') return 'rgba(245, 158, 11, ';
        if (crisisType === 'CYCLONE') return 'rgba(147, 197, 253, ';
        if (crisisType === 'ECONOMIC') return 'rgba(239, 68, 68, ';
        if (crisisType === 'POLITICAL') return 'rgba(244, 63, 94, ';
        return 'rgba(244, 63, 94, ';
      }
      if (mode === 'GOVERNMENT') return 'rgba(234, 179, 8, '; // Gold
      if (mode === 'ELECTION') return 'rgba(255, 153, 51, '; // Saffron
      if (mode === 'CAMPAIGN') return 'rgba(255, 103, 31, '; // Deep Saffron
      if (mode === 'SUCCESS') return 'rgba(52, 211, 153, '; // Tiranga Green / Emerald
      if (mode === 'MEDIA') return 'rgba(96, 165, 250, '; // Blue broadcast
      if (mode === 'DISASTER_RESPONSE') return 'rgba(251, 146, 60, '; // Emergency orange
      return 'rgba(255, 153, 51, '; // Home / Map Saffron
    };

    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: Math.random() * (canvas.width || 360),
        y: Math.random() * (canvas.height || 640),
        vx: (Math.random() - 0.5) * 0.35,
        vy: mode === 'SUCCESS' ? -0.5 - Math.random() * 0.8 : -0.15 - Math.random() * 0.35,
        size: 1 + Math.random() * 2.2,
        alpha: 0.1 + Math.random() * 0.35,
        color: getParticleColor(),
        shape: mode === 'SUCCESS' && i % 3 === 0 ? 'SPARKLE' : 'CIRCLE',
      });
    }

    let time = 0;
    let flashTimer = 0;
    let flashAlpha = 0;

    const render = () => {
      if (!isVisible) {
        animationFrameId = requestAnimationFrame(render);
        return;
      }

      ctx.clearRect(0, 0, canvas.width, canvas.height);
      time += 0.016;

      const w = canvas.width;
      const h = canvas.height;

      // =========================================================================
      // 1. MODE-SPECIFIC CANVAS GRAPHICS
      // =========================================================================

      // --- 1. HOME MODE: Very slow map parallax drift & gentle light rays ---
      if (mode === 'HOME') {
        const driftX = Math.sin(time * 0.2) * 15;
        const driftY = Math.cos(time * 0.15) * 8;

        // Subtle ambient spotlight
        const grad = ctx.createRadialGradient(w * 0.5 + driftX, h * 0.35 + driftY, 20, w * 0.5, h * 0.4, w * 0.7);
        grad.addColorStop(0, 'rgba(255, 153, 51, 0.06)');
        grad.addColorStop(0.5, 'rgba(19, 136, 8, 0.03)');
        grad.addColorStop(1, 'rgba(0, 0, 0, 0)');
        ctx.fillStyle = grad;
        ctx.fillRect(0, 0, w, h);
      }

      // --- 2. MAP MODE: India -> State -> District -> Constituency Influence Spreading ---
      if (mode === 'MAP') {
        const pulseR = (Math.sin(time * 1.5) * 0.5 + 0.5) * 45 + 50;
        const centerX = w * 0.5;
        const centerY = h * 0.45;

        // Influence pulse rings
        ctx.beginPath();
        ctx.arc(centerX, centerY, pulseR, 0, Math.PI * 2);
        ctx.strokeStyle = 'rgba(255, 153, 51, 0.18)';
        ctx.lineWidth = 1.5;
        ctx.stroke();

        ctx.beginPath();
        ctx.arc(centerX, centerY, pulseR * 1.5, 0, Math.PI * 2);
        ctx.strokeStyle = 'rgba(255, 153, 51, 0.08)';
        ctx.lineWidth = 1;
        ctx.stroke();

        // Radiating connection lines
        for (let i = 0; i < 6; i++) {
          const angle = (i * Math.PI) / 3 + time * 0.1;
          const px = centerX + Math.cos(angle) * (pulseR + 30);
          const py = centerY + Math.sin(angle) * (pulseR + 30);
          ctx.beginPath();
          ctx.moveTo(centerX, centerY);
          ctx.lineTo(px, py);
          ctx.strokeStyle = 'rgba(255, 179, 71, 0.06)';
          ctx.lineWidth = 1;
          ctx.stroke();
        }
      }

      // --- 3. ELECTION MODE: Animated boundary scan, flags & crowd silhouettes ---
      if (mode === 'ELECTION') {
        // Boundary scan telemetry
        const scanY = ((time * 30) % h);
        const grad = ctx.createLinearGradient(0, scanY - 20, 0, scanY + 20);
        grad.addColorStop(0, 'rgba(255, 153, 51, 0)');
        grad.addColorStop(0.5, 'rgba(255, 153, 51, 0.08)');
        grad.addColorStop(1, 'rgba(255, 153, 51, 0)');
        ctx.fillStyle = grad;
        ctx.fillRect(0, scanY - 20, w, 40);

        // Ground crowd silhouette at bottom
        ctx.fillStyle = 'rgba(15, 23, 42, 0.7)';
        ctx.beginPath();
        ctx.moveTo(0, h);
        for (let x = 0; x <= w; x += 18) {
          const headY = h - 25 - Math.sin((x * 0.1) + time * 2) * 5;
          ctx.lineTo(x, headY);
        }
        ctx.lineTo(w, h);
        ctx.closePath();
        ctx.fill();

        // Waving campaign flag poles
        for (let i = 0; i < 4; i++) {
          const fx = (w * 0.2) + (i * w * 0.2);
          const fy = h - 45;
          ctx.strokeStyle = 'rgba(255, 153, 51, 0.3)';
          ctx.lineWidth = 1.5;
          ctx.beginPath();
          ctx.moveTo(fx, h);
          ctx.lineTo(fx, fy);
          ctx.stroke();

          // Flag cloth waving
          const wave = Math.sin(time * 3 + i) * 6;
          ctx.fillStyle = i % 2 === 0 ? 'rgba(255, 153, 51, 0.25)' : 'rgba(52, 211, 153, 0.25)';
          ctx.beginPath();
          ctx.moveTo(fx, fy);
          ctx.quadraticCurveTo(fx + 10 + wave, fy - 6, fx + 22 + wave, fy + 4);
          ctx.lineTo(fx, fy + 14);
          ctx.closePath();
          ctx.fill();
        }
      }

      // --- 4. CAMPAIGN MODE: Cheering rally crowd & moving vehicle silhouette ---
      if (mode === 'CAMPAIGN') {
        // Dynamic crowd cheer wave
        ctx.fillStyle = 'rgba(15, 23, 42, 0.75)';
        ctx.beginPath();
        ctx.moveTo(0, h);
        for (let x = 0; x <= w; x += 14) {
          const cheer = Math.abs(Math.sin((x * 0.08) + time * 3.5)) * 12;
          ctx.lineTo(x, h - 28 - cheer);
        }
        ctx.lineTo(w, h);
        ctx.closePath();
        ctx.fill();

        // Moving campaign vehicle silhouette across the bottom
        const vehicleX = ((time * 45) % (w + 140)) - 70;
        const vY = h - 22;
        ctx.fillStyle = 'rgba(255, 153, 51, 0.18)';
        ctx.fillRect(vehicleX, vY - 14, 52, 14); // Bus/jeep body
        ctx.fillRect(vehicleX + 10, vY - 22, 28, 8); // Speaker podium
        // Wheels
        ctx.beginPath();
        ctx.arc(vehicleX + 12, vY + 2, 4, 0, Math.PI * 2);
        ctx.arc(vehicleX + 40, vY + 2, 4, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(255, 153, 51, 0.25)';
        ctx.fill();
      }

      // --- 5. MEDIA MODE: TV broadcast lines, camera flash effect ---
      if (mode === 'MEDIA') {
        // Broadcast scanlines
        ctx.strokeStyle = 'rgba(96, 165, 250, 0.04)';
        ctx.lineWidth = 1;
        for (let y = 0; y < h; y += 8) {
          ctx.beginPath();
          ctx.moveTo(0, y);
          ctx.lineTo(w, y);
          ctx.stroke();
        }

        // Camera flash trigger
        flashTimer += 0.016;
        if (flashTimer > 2.8) {
          flashTimer = 0;
          flashAlpha = 0.25;
        }
        if (flashAlpha > 0) {
          ctx.fillStyle = `rgba(255, 255, 255, ${flashAlpha})`;
          ctx.fillRect(0, 0, w, h);
          flashAlpha -= 0.015;
        }
      }

      // --- 6. CRISIS MODE: Atmosphere variations (No graphic disaster imagery) ---
      if (mode === 'CRISIS') {
        if (crisisType === 'FLOOD') {
          // Soft blue rain streaks
          ctx.strokeStyle = 'rgba(56, 189, 248, 0.22)';
          ctx.lineWidth = 1.2;
          for (let i = 0; i < 28; i++) {
            const rx = (i * 32 + time * 120) % w;
            const ry = (i * 48 + time * 320) % h;
            ctx.beginPath();
            ctx.moveTo(rx, ry);
            ctx.lineTo(rx - 5, ry + 18);
            ctx.stroke();
          }

          // Gentle water ripples at bottom
          ctx.strokeStyle = 'rgba(56, 189, 248, 0.15)';
          ctx.beginPath();
          ctx.moveTo(0, h - 15);
          for (let x = 0; x <= w; x += 25) {
            ctx.lineTo(x, h - 15 + Math.sin(x * 0.04 + time * 3) * 6);
          }
          ctx.stroke();
        } else if (crisisType === 'DROUGHT') {
          // Heat shimmer lines
          ctx.strokeStyle = 'rgba(245, 158, 11, 0.12)';
          ctx.lineWidth = 2;
          for (let y = h * 0.4; y < h; y += 45) {
            ctx.beginPath();
            ctx.moveTo(0, y);
            for (let x = 0; x <= w; x += 30) {
              ctx.lineTo(x, y + Math.sin((x * 0.05) + time * 2) * 5);
            }
            ctx.stroke();
          }
        } else if (crisisType === 'CYCLONE') {
          // Rotating atmospheric wind vortex
          const cx = w * 0.5;
          const cy = h * 0.35;
          for (let r = 25; r <= 160; r += 35) {
            ctx.beginPath();
            ctx.arc(cx, cy, r, time * 1.5 + r * 0.05, time * 1.5 + r * 0.05 + Math.PI * 1.2);
            ctx.strokeStyle = 'rgba(147, 197, 253, 0.1)';
            ctx.lineWidth = 2;
            ctx.stroke();
          }
        } else if (crisisType === 'ECONOMIC') {
          // Declining/fluctuating telemetry line
          ctx.beginPath();
          ctx.moveTo(0, h * 0.35);
          for (let x = 0; x <= w; x += 35) {
            const dy = Math.sin((x * 0.06) + time * 2) * 18 + ((x / w) * 60);
            ctx.lineTo(x, h * 0.35 + dy);
          }
          ctx.strokeStyle = 'rgba(239, 68, 68, 0.25)';
          ctx.lineWidth = 2;
          ctx.stroke();
        } else if (crisisType === 'POLITICAL') {
          // Pulsing warning beacon
          const beaconAlpha = (Math.sin(time * 3) * 0.5 + 0.5) * 0.15;
          ctx.fillStyle = `rgba(244, 63, 94, ${beaconAlpha})`;
          ctx.fillRect(0, 0, w, h);
        }
      }

      // --- 7. PRIME MINISTER / GOVERNMENT MODE: Parliament, Telemetry, GDP curve ---
      if (mode === 'GOVERNMENT') {
        // Slow telemetry beam
        const scanY = (Math.sin(time * 0.4) * 0.5 + 0.5) * h;
        const grad = ctx.createLinearGradient(0, scanY - 50, 0, scanY + 50);
        grad.addColorStop(0, 'rgba(234, 179, 8, 0)');
        grad.addColorStop(0.5, 'rgba(234, 179, 8, 0.07)');
        grad.addColorStop(1, 'rgba(234, 179, 8, 0)');
        ctx.fillStyle = grad;
        ctx.fillRect(0, scanY - 50, w, 100);

        // Calm upward economic development curve
        ctx.beginPath();
        ctx.moveTo(0, h - 70);
        for (let x = 0; x <= w; x += 25) {
          const y = h - 70 - ((x / w) * 35) + Math.sin((x * 0.015) + time) * 8;
          ctx.lineTo(x, y);
        }
        ctx.strokeStyle = 'rgba(234, 179, 8, 0.18)';
        ctx.lineWidth = 2;
        ctx.stroke();

        // Data nodes along the line
        for (let x = 40; x < w; x += 75) {
          const y = h - 70 - ((x / w) * 35) + Math.sin((x * 0.015) + time) * 8;
          ctx.beginPath();
          ctx.arc(x, y, 3, 0, Math.PI * 2);
          ctx.fillStyle = 'rgba(234, 179, 8, 0.35)';
          ctx.fill();
        }
      }

      // --- 8. SUCCESS / DEVELOPMENT: Upward growth bars & glowing radiance ---
      if (mode === 'SUCCESS') {
        // Upward growth bars
        ctx.fillStyle = 'rgba(52, 211, 153, 0.08)';
        for (let i = 0; i < 7; i++) {
          const barW = w / 8;
          const barH = 50 + (i * 25) + Math.sin(time * 2 + i) * 12;
          ctx.fillRect(i * (barW + 4) + 10, h - barH, barW, barH);
        }
      }

      // --- 9. DISASTER RESPONSE: Emergency epicenter pulsing markers & rescue flow ---
      if (mode === 'DISASTER_RESPONSE') {
        const eX = w * 0.45;
        const eY = h * 0.4;
        const pulse = (time * 50) % 90;

        ctx.beginPath();
        ctx.arc(eX, eY, pulse, 0, Math.PI * 2);
        ctx.strokeStyle = `rgba(251, 146, 60, ${Math.max(0, 0.35 - pulse / 90)})`;
        ctx.lineWidth = 2;
        ctx.stroke();

        // Center emergency cross
        ctx.fillStyle = 'rgba(239, 68, 68, 0.5)';
        ctx.fillRect(eX - 2, eY - 10, 4, 20);
        ctx.fillRect(eX - 10, eY - 2, 20, 4);
      }

      // =========================================================================
      // 2. LIGHTWEIGHT FLOATING PARTICLES (ALL MODES)
      // =========================================================================
      particles.forEach((p) => {
        p.y += p.vy;
        p.x += p.vx;

        if (p.y < 0) {
          p.y = h;
          p.x = Math.random() * w;
        }
        if (p.x < 0) p.x = w;
        if (p.x > w) p.x = 0;

        ctx.beginPath();
        if (p.shape === 'SPARKLE') {
          // Diamond sparkle
          ctx.moveTo(p.x, p.y - p.size * 1.6);
          ctx.lineTo(p.x + p.size * 1.6, p.y);
          ctx.lineTo(p.x, p.y + p.size * 1.6);
          ctx.lineTo(p.x - p.size * 1.6, p.y);
          ctx.closePath();
        } else {
          ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        }
        ctx.fillStyle = `${p.color}${p.alpha})`;
        ctx.fill();
      });

      if (!prefersReducedMotion) {
        animationFrameId = requestAnimationFrame(render);
      }
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', resize);
      document.removeEventListener('visibilitychange', handleVisibility);
    };
  }, [mode, crisisType, reducedMotion]);

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden z-0 select-none">
      {/* Dynamic Background Base Color Gradient */}
      <div 
        className={`absolute inset-0 transition-colors duration-1000 ${
          mode === 'CRISIS'
            ? crisisType === 'FLOOD'
              ? 'bg-gradient-to-b from-sky-950/60 via-navy-950 to-navy-950'
              : crisisType === 'DROUGHT'
              ? 'bg-gradient-to-b from-amber-950/60 via-navy-950 to-navy-950'
              : crisisType === 'ECONOMIC'
              ? 'bg-gradient-to-b from-rose-950/60 via-navy-950 to-navy-950'
              : 'bg-gradient-to-b from-red-950/60 via-navy-950 to-navy-950'
            : mode === 'GOVERNMENT'
            ? 'bg-gradient-to-b from-amber-950/30 via-navy-950 to-navy-950'
            : mode === 'ELECTION'
            ? 'bg-gradient-to-b from-saffron/20 via-navy-950 to-navy-950'
            : mode === 'CAMPAIGN'
            ? 'bg-gradient-to-b from-orange-950/35 via-navy-950 to-navy-950'
            : mode === 'SUCCESS'
            ? 'bg-gradient-to-b from-emerald-950/40 via-navy-950 to-navy-950'
            : mode === 'MEDIA'
            ? 'bg-gradient-to-b from-blue-950/40 via-navy-950 to-navy-950'
            : mode === 'DISASTER_RESPONSE'
            ? 'bg-gradient-to-b from-orange-950/50 via-navy-950 to-navy-950'
            : 'bg-gradient-to-b from-navy-900/70 via-navy-950 to-navy-950'
        }`}
      />

      {/* SVG Background Layer: India Map Outline & State Boundaries */}
      <div className="absolute inset-0 flex items-center justify-center opacity-[0.06] transition-opacity duration-700">
        {mode === 'GOVERNMENT' ? (
          // Parliament Silhouette
          <svg className="w-80 h-80 text-amber-300" viewBox="0 0 100 100" fill="currentColor">
            <rect x="10" y="55" width="80" height="25" rx="3" />
            <circle cx="50" cy="45" r="22" />
            <rect x="47" y="18" width="6" height="15" />
            <polygon points="50,12 45,18 55,18" />
            <line x1="20" y1="55" x2="20" y2="80" stroke="currentColor" strokeWidth="2" />
            <line x1="30" y1="55" x2="30" y2="80" stroke="currentColor" strokeWidth="2" />
            <line x1="40" y1="55" x2="40" y2="80" stroke="currentColor" strokeWidth="2" />
            <line x1="60" y1="55" x2="60" y2="80" stroke="currentColor" strokeWidth="2" />
            <line x1="70" y1="55" x2="70" y2="80" stroke="currentColor" strokeWidth="2" />
            <line x1="80" y1="55" x2="80" y2="80" stroke="currentColor" strokeWidth="2" />
          </svg>
        ) : (
          // India Map Silhouette & Subtle Ashoka Chakra Element
          <div className="relative w-full h-full flex items-center justify-center">
            {/* Ashoka Chakra with smooth slow rotation */}
            <svg 
              className="w-80 h-80 text-saffron animate-[spin_160s_linear_infinite]" 
              viewBox="0 0 100 100" 
              fill="none" 
              stroke="currentColor" 
              strokeWidth="1.2"
            >
              <circle cx="50" cy="50" r="44" />
              <circle cx="50" cy="50" r="9" fill="currentColor" opacity="0.2" />
              {Array.from({ length: 24 }).map((_, i) => (
                <line
                  key={i}
                  x1="50"
                  y1="50"
                  x2={50 + 44 * Math.cos((i * 15 * Math.PI) / 180)}
                  y2={50 + 44 * Math.sin((i * 15 * Math.PI) / 180)}
                  strokeWidth="1"
                />
              ))}
            </svg>

            {/* Stylized India Outline Vector */}
            <svg 
              className="absolute w-72 h-80 text-amber-400/40" 
              viewBox="0 0 200 240" 
              fill="none" 
              stroke="currentColor" 
              strokeWidth="1.5"
            >
              {/* Kashmir / North */}
              <path d="M 95,20 L 115,28 L 125,48 L 105,60 L 85,55 L 75,35 Z" strokeDasharray="3,2" />
              {/* Central & Western India */}
              <path d="M 75,60 L 50,85 L 45,115 L 70,135 L 90,120 L 105,60 Z" />
              {/* Eastern & North-East */}
              <path d="M 105,60 L 140,75 L 175,70 L 180,95 L 155,100 L 130,120 Z" />
              {/* Deccan & Southern Peninsula */}
              <path d="M 70,135 L 85,185 L 100,225 L 115,185 L 130,120 L 90,120 Z" />
              {/* Internal State Boundary accents */}
              <line x1="70" y1="135" x2="130" y2="120" strokeWidth="0.8" opacity="0.6" />
              <line x1="85" y1="85" x2="115" y2="85" strokeWidth="0.8" opacity="0.6" />
              <line x1="85" y1="185" x2="115" y2="185" strokeWidth="0.8" opacity="0.6" />
            </svg>
          </div>
        )}
      </div>

      {/* Media Mode Running News Ticker */}
      {mode === 'MEDIA' && (
        <div className="absolute top-0 inset-x-0 bg-rose-950/80 border-b border-rose-500/30 px-3 py-1 flex items-center gap-2 overflow-hidden text-[10px] font-bold text-rose-200">
          <span className="bg-rose-600 text-white px-1.5 py-0.5 rounded text-[9px] font-black uppercase flex-shrink-0 animate-pulse">
            BREAKING
          </span>
          <div className="whitespace-nowrap flex gap-8 animate-[marquee_20s_linear_infinite]">
            <span>🇮🇳 राष्ट्रनीति प्राइम टाइम • चुनावी हलचल और मतदाताओं की राय LIVE</span>
            <span>⚡ विपक्षी खेमे में हलचल • जमीनी जनसंपर्क तेज</span>
            <span>📊 एग्जिट पोल व सर्वेक्षण विश्लेषण जारी</span>
          </div>
        </div>
      )}

      {/* HTML5 Canvas for dynamic 60fps animations */}
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" />
    </div>
  );
};
