import React, { useState, useEffect } from 'react';
import { Sparkles, ArrowRight, Shield } from 'lucide-react';
import { sound } from '../../audio/soundEffects';
import { useI18n } from '../../locales/i18n';

interface CinematicOpeningProps {
  onStartGame: () => void;
}

export const CinematicOpening: React.FC<CinematicOpeningProps> = ({ onStartGame }) => {
  const { language, t } = useI18n();
  const [zoomStage, setZoomStage] = useState<number>(0); // 0: India, 1: State, 2: District, 3: Constituency, 4: Ready

  useEffect(() => {
    // Play intro sound
    sound.playSelect();

    // Cinematic zoom sequence
    const t1 = setTimeout(() => setZoomStage(1), 1800);
    const t2 = setTimeout(() => setZoomStage(2), 3600);
    const t3 = setTimeout(() => setZoomStage(3), 5200);
    const t4 = setTimeout(() => setZoomStage(4), 6800);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
      clearTimeout(t4);
    };
  }, []);

  const handleSkipOrStart = () => {
    sound.playRally();
    onStartGame();
  };

  return (
    <div className="relative w-full h-full min-h-[580px] flex flex-col items-center justify-between p-6 bg-gradient-to-b from-navy-950 via-[#07152b] to-navy-950 overflow-hidden text-center select-none">
      {/* Background Animated India Map SVG Silhouette */}
      <div
        className="absolute inset-0 flex items-center justify-center pointer-events-none transition-all duration-1000 ease-out"
        style={{
          transform:
            zoomStage === 0
              ? 'scale(1) translateY(0)'
              : zoomStage === 1
              ? 'scale(1.4) translateY(-20px)'
              : zoomStage === 2
              ? 'scale(2.0) translateY(-60px)'
              : 'scale(2.6) translateY(-90px)',
          opacity: 0.28,
        }}
      >
        <svg
          viewBox="0 0 500 580"
          className="w-[420px] h-[500px] stroke-amber-500/40 fill-saffron/10 drop-shadow-[0_0_25px_rgba(255,103,31,0.25)]"
        >
          {/* Stylized recognizable silhouette of India */}
          <path
            d="M 230 40 
               C 240 25, 270 30, 280 45
               C 290 60, 315 75, 305 95
               C 320 105, 335 125, 330 145
               C 340 160, 375 165, 380 185
               C 395 195, 410 215, 375 225
               C 350 230, 330 220, 320 235
               C 310 250, 320 270, 310 290
               C 300 310, 290 330, 280 350
               C 270 380, 255 420, 245 460
               C 240 480, 235 500, 230 520
               C 225 500, 220 480, 215 460
               C 205 420, 190 380, 180 350
               C 170 330, 160 310, 150 290
               C 140 270, 145 250, 140 235
               C 130 220, 110 230, 90 225
               C 70 215, 95 195, 110 185
               C 115 165, 140 160, 150 145
               C 145 125, 160 105, 175 95
               C 165 75, 190 60, 200 45 Z"
            strokeWidth="2.5"
          />
          {/* Ashoka Chakra Center Glow */}
          <circle cx="235" cy="270" r="14" fill="none" stroke="#FF671F" strokeWidth="1.5" className="animate-spin-slow" />
          <circle cx="235" cy="270" r="3" fill="#D4AF37" />

          {/* Focal Pins during zoom */}
          {zoomStage >= 1 && (
            <g className="animate-bounce">
              <circle cx="240" cy="220" r="6" fill="#FF671F" />
              <circle cx="240" cy="220" r="14" fill="none" stroke="#FF671F" strokeWidth="1.5" className="animate-ping" />
            </g>
          )}
        </svg>
      </div>

      {/* Top Header & Stage Indicator */}
      <div className="z-10 pt-4 animate-fadeIn">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-saffron/15 border border-saffron/30 text-saffron text-xs font-black tracking-widest uppercase mb-2">
          <Shield size={14} />
          <span>भारत • BHARAT</span>
        </div>

        {/* Dynamic Zoom Tag */}
        <div className="text-[11px] text-slate-400 font-semibold tracking-wider">
          {zoomStage === 0 && 'सम्पूर्ण राष्ट्र (NATION)'}
          {zoomStage === 1 && 'राज्य स्तर (STATE)'}
          {zoomStage === 2 && 'जिला मंडल (DISTRICT)'}
          {zoomStage >= 3 && 'आपका निर्वाचन क्षेत्र (CONSTITUENCY)'}
        </div>
      </div>

      {/* Center Cinematic Monologue & Logo */}
      <div className="z-10 max-w-sm my-auto">
        {/* App Icon Logo */}
        <div className="flex justify-center mb-4">
          <img 
            src="/rajniti-logo.png" 
            alt="RASHTRA तंत्र Logo" 
            className="w-28 h-28 rounded-3xl bg-white p-2 shadow-[0_0_30px_rgba(245,158,11,0.45)] border-2 border-amber-400 object-contain" 
          />
        </div>

        <h1 className="text-4xl sm:text-5xl font-black font-display tracking-wider mb-2 flex items-center justify-center">
          <span className="text-amber-300 font-serif text-5xl sm:text-6xl font-black drop-shadow-[0_0_15px_rgba(245,158,11,0.6)]">R</span>
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-white to-emerald-400 drop-shadow-md">ाजनीति</span>
        </h1>
        <p className="text-xs font-semibold text-amber-300/90 mb-6 tracking-wide">
          {t.cinematic.subtitle}
        </p>

        {/* Narrative text with smooth transitions */}
        <div className="p-4 rounded-3xl bg-navy-900/80 backdrop-blur-md border border-slate-700/60 shadow-xl space-y-3">
          <p className="text-base font-bold text-white leading-snug">
            {t.cinematic.line1}
            <br />
            <span className="text-saffron text-glow-saffron">{t.cinematic.line2}</span>
          </p>

          <div className="w-12 h-0.5 bg-gradient-to-r from-saffron to-tiranga-green mx-auto my-2"></div>

          <p className="text-sm text-slate-200 font-medium leading-relaxed">
            "{t.cinematic.question}"
          </p>

          <p className="text-[11px] text-slate-400 italic">
            {t.cinematic.quote}
          </p>
        </div>
      </div>

      {/* Bottom Action Buttons */}
      <div className="z-10 w-full max-w-xs space-y-2 pb-4">
        <button
          onClick={handleSkipOrStart}
          className="w-full py-3.5 px-6 rounded-2xl bg-gradient-to-r from-saffron via-amber-500 to-saffron text-navy-950 font-black text-sm uppercase tracking-wider flex items-center justify-center gap-2 shadow-[0_10px_25px_rgba(255,103,31,0.4)] hover:brightness-110 active:scale-95 transition-all"
        >
          <Sparkles size={16} />
          <span>{t.startJourney}</span>
          <ArrowRight size={16} />
        </button>

        {zoomStage < 4 && (
          <button
            onClick={handleSkipOrStart}
            className="text-xs text-slate-400 hover:text-slate-200 py-1 transition-colors"
          >
            {t.skipCinematic} →
          </button>
        )}
      </div>
    </div>
  );
};
