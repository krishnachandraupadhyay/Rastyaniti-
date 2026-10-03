import React, { useState, useEffect } from 'react';
import { AlertTriangle, Clock, ShieldCheck, IndianRupee, ArrowRight, CheckCircle2 } from 'lucide-react';
import { GameEvent, EventChoice } from '../../types/events';
import { useI18n } from '../../locales/i18n';
import { sound } from '../../audio/soundEffects';

interface ModalDecisionProps {
  event: GameEvent;
  onSelectChoice: (choice: EventChoice) => void;
  onDismiss: () => void;
}

export const ModalDecision: React.FC<ModalDecisionProps> = ({ event, onSelectChoice, onDismiss }) => {
  const { language } = useI18n();
  const [timeLeft, setTimeLeft] = useState<number>(event.timeLimitSeconds || 30);
  const [selectedChoice, setSelectedChoice] = useState<EventChoice | null>(null);
  const [showResult, setShowResult] = useState(false);

  useEffect(() => {
    sound.playCrisis();
  }, []);

  // Urgent Countdown timer
  useEffect(() => {
    if (!event.isUrgent || showResult) return;
    if (timeLeft <= 0) {
      // Auto pick conservative fallback choice if time expires
      handleChoiceSelect(event.choices[event.choices.length - 1]);
      return;
    }
    const timer = setInterval(() => {
      setTimeLeft(prev => prev - 1);
    }, 1000);
    return () => clearInterval(timer);
  }, [timeLeft, event.isUrgent, showResult]);

  const handleChoiceSelect = (choice: EventChoice) => {
    sound.playSelect();
    setSelectedChoice(choice);
    setShowResult(true);
  };

  const handleConfirmResult = () => {
    sound.playClick();
    if (selectedChoice) {
      onSelectChoice(selectedChoice);
    }
    onDismiss();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-3 animate-fadeIn">
      <div className="w-full max-w-lg bg-gradient-to-b from-navy-900 to-navy-950 border border-amber-500/40 rounded-3xl p-5 shadow-2xl relative overflow-hidden">
        {/* Glowing top alert bar */}
        <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-amber-500 via-rose-500 to-amber-500 animate-pulse"></div>

        {!showResult ? (
          <>
            {/* Header & Urgent Timer */}
            <div className="flex items-center justify-between gap-2 mb-3">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-xl bg-amber-500/20 text-amber-400 border border-amber-500/30">
                  <AlertTriangle size={20} className="animate-bounce" />
                </div>
                <div>
                  <span className="text-[10px] font-black tracking-widest text-amber-400 uppercase">
                    {event.category === 'DISASTER' ? 'प्राकृतिक आपदा / EMERGENCY' : 'तात्कालिक राजनीतिक संकट / CRISIS'}
                  </span>
                  <h3 className="text-sm font-bold text-white leading-tight">
                    {language === 'hi' ? event.headlineHi : event.headlineEn}
                  </h3>
                </div>
              </div>

              {event.isUrgent && (
                <div className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-rose-950/80 border border-rose-500/50 text-rose-400 text-xs font-black">
                  <Clock size={12} className="animate-spin" />
                  <span>{timeLeft}s</span>
                </div>
              )}
            </div>

            {/* Description */}
            <p className="text-xs text-slate-300 bg-navy-950/80 p-3 rounded-xl border border-slate-800 mb-4 leading-relaxed">
              {language === 'hi' ? event.descriptionHi : event.descriptionEn}
            </p>

            {/* Action Choices */}
            <div className="space-y-2.5 mb-2">
              {event.choices.map((choice, idx) => (
                <div
                  key={choice.id}
                  onClick={() => handleChoiceSelect(choice)}
                  className="group p-3 rounded-2xl bg-navy-800/60 hover:bg-navy-800 border border-slate-700/70 hover:border-saffron/60 transition-all cursor-pointer shadow-md"
                >
                  <div className="flex items-start justify-between gap-2 mb-1">
                    <span className="text-xs font-bold text-slate-100 group-hover:text-saffron transition-colors">
                      {idx + 1}. {language === 'hi' ? choice.titleHi : choice.titleEn}
                    </span>
                    <span className={`text-[10px] px-1.5 py-0.2 rounded font-black ${
                      choice.risk === 'LOW' ? 'bg-emerald-950 text-emerald-300 border border-emerald-800' :
                      choice.risk === 'MEDIUM' ? 'bg-amber-950 text-amber-300 border border-amber-800' :
                      'bg-rose-950 text-rose-300 border border-rose-800'
                    }`}>
                      {choice.risk} RISK
                    </span>
                  </div>

                  <p className="text-[11px] text-slate-400 mb-2 leading-tight">
                    {language === 'hi' ? choice.descHi : choice.descEn}
                  </p>

                  <div className="flex items-center justify-between text-[10px] text-slate-400 pt-1.5 border-t border-slate-800/60">
                    <div className="flex items-center gap-2">
                      <span className="flex items-center gap-0.5 text-emerald-400 font-semibold">
                        <IndianRupee size={11} />
                        ₹{choice.cost.toLocaleString('en-IN')}
                      </span>
                      <span>• {choice.timeDays} {language === 'hi' ? 'दिन' : 'Days'}</span>
                    </div>

                    <span className="text-amber-400 font-semibold truncate max-w-[170px]">
                      {language === 'hi' ? choice.expectedEffectHi : choice.expectedEffectEn}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </>
        ) : (
          /* Consequence Outcome Display */
          <div className="py-3 text-center animate-fadeIn">
            <div className="w-12 h-12 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 flex items-center justify-center mx-auto mb-3">
              <CheckCircle2 size={28} />
            </div>

            <h4 className="text-base font-black text-white mb-1">
              {language === 'hi' ? 'निर्णय प्रभावी हुआ!' : 'Decision Implemented!'}
            </h4>
            <span className="text-xs font-semibold text-saffron block mb-3">
              {selectedChoice && (language === 'hi' ? selectedChoice.titleHi : selectedChoice.titleEn)}
            </span>

            <div className="p-3 bg-navy-950 rounded-2xl border border-slate-800 text-xs text-slate-300 leading-relaxed mb-4 text-left">
              <span className="font-bold text-slate-200 block mb-1">
                {language === 'hi' ? 'तात्कालिक परिणाम (Immediate Consequence):' : 'Immediate Consequence:'}
              </span>
              {selectedChoice && (language === 'hi' ? selectedChoice.consequenceHi : selectedChoice.consequenceEn)}
            </div>

            <button
              onClick={handleConfirmResult}
              className="w-full py-2.5 px-4 bg-gradient-to-r from-saffron to-amber-500 text-navy-950 font-black rounded-xl text-xs hover:opacity-90 transition-all flex items-center justify-center gap-1.5 shadow-lg"
            >
              <span>{language === 'hi' ? 'प्रशासन जारी रखें' : 'Resume Governance'}</span>
              <ArrowRight size={14} />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
