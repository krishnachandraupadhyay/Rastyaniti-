import React, { useState } from 'react';
import { Smartphone, Monitor, Volume2, VolumeX, Globe } from 'lucide-react';
import { sound } from '../../audio/soundEffects';
import { useI18n } from '../../locales/i18n';

interface MobileFrameProps {
  children: React.ReactNode;
}

export const MobileFrame: React.FC<MobileFrameProps> = ({ children }) => {
  const [isMobileView, setIsMobileView] = useState(true);
  const [audioEnabled, setAudioEnabled] = useState(sound.enabled);
  const { language, toggleLanguage } = useI18n();

  const toggleSound = () => {
    sound.enabled = !sound.enabled;
    setAudioEnabled(sound.enabled);
    if (sound.enabled) sound.playSelect();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-navy-950 via-slate-950 to-navy-900 text-slate-100 flex flex-col items-center justify-center p-0 sm:p-4 selection:bg-saffron selection:text-white">
      {/* Floating Control Bar for Device Frame / Sound / Language */}
      <header className="w-full max-w-md mb-2 px-3 py-1.5 hidden sm:flex items-center justify-between text-xs text-slate-400 bg-navy-900/80 backdrop-blur-md rounded-full border border-slate-800 shadow-lg">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping"></span>
          <span className="font-semibold text-slate-200">राष्ट्रनीति • Android 14 Simulator</span>
        </div>

        <div className="flex items-center gap-2">
          {/* Audio Toggle */}
          <button
            onClick={toggleSound}
            className="p-1.5 hover:text-saffron transition-colors rounded-full hover:bg-white/5"
            title={audioEnabled ? "ध्वनि बंद करें (Mute)" : "ध्वनि चालू करें (Sound On)"}
          >
            {audioEnabled ? <Volume2 size={16} className="text-saffron" /> : <VolumeX size={16} />}
          </button>

          {/* Language Toggle */}
          <button
            onClick={() => {
              sound.playClick();
              toggleLanguage();
            }}
            className="px-2 py-1 flex items-center gap-1 font-bold text-xs bg-saffron/20 text-saffron border border-saffron/30 rounded-md hover:bg-saffron/30 transition-all"
          >
            <Globe size={14} />
            <span>{language === 'hi' ? 'EN' : 'हिन्दी'}</span>
          </button>

          {/* Device Frame View Toggle */}
          <button
            onClick={() => {
              sound.playClick();
              setIsMobileView(!isMobileView);
            }}
            className="p-1.5 hover:text-saffron transition-colors rounded-full hover:bg-white/5"
            title={isMobileView ? "पूर्ण स्क्रीन (Full View)" : "मोबाइल फ्रेम (Mobile Frame)"}
          >
            {isMobileView ? <Monitor size={16} /> : <Smartphone size={16} />}
          </button>
        </div>
      </header>

      {/* Main Container: Android Mobile Frame or Full Screen */}
      <div
        className={`w-full transition-all duration-300 relative overflow-hidden flex flex-col ${
          isMobileView
            ? 'max-w-[440px] h-[95vh] sm:h-[890px] rounded-none sm:rounded-[44px] border-0 sm:border-[8px] sm:border-slate-800/90 shadow-2xl bg-navy-950 ring-1 ring-white/10'
            : 'max-w-4xl min-h-[92vh] rounded-2xl border border-slate-800 shadow-2xl bg-navy-950'
        }`}
      >
        {/* Android Punch Hole Camera Notch (Mobile Frame Only) */}
        {isMobileView && (
          <div className="absolute top-2 left-1/2 -translate-x-1/2 z-50 pointer-events-none hidden sm:flex items-center gap-2">
            <div className="w-4 h-4 rounded-full bg-black border border-slate-800 flex items-center justify-center">
              <div className="w-1.5 h-1.5 rounded-full bg-slate-900"></div>
            </div>
            <div className="w-12 h-1 bg-slate-800 rounded-full"></div>
          </div>
        )}

        {/* Content Viewport */}
        <div className="flex-1 flex flex-col relative overflow-hidden h-full">
          {children}
        </div>
      </div>
    </div>
  );
};
