import React from 'react';
import { ArrowLeft, Award, IndianRupee, Clock, Zap, Sparkles } from 'lucide-react';
import { TRAINING_PROGRAMS } from '../../engine/initialData';
import { TrainingProgram } from '../../types/quiz';
import { PlayerProfile } from '../../types/game';
import { useI18n } from '../../locales/i18n';
import { sound } from '../../audio/soundEffects';

interface TrainingScreenProps {
  player: PlayerProfile;
  onBack: () => void;
  onEnrollTraining: (prog: TrainingProgram) => void;
}

export const TrainingScreen: React.FC<TrainingScreenProps> = ({
  player,
  onBack,
  onEnrollTraining,
}) => {
  const { language, t } = useI18n();

  return (
    <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-navy-950 text-slate-100 flex flex-col">
      {/* Header */}
      <div className="flex items-center gap-2">
        <button
          onClick={() => {
            sound.playClick();
            onBack();
          }}
          className="p-1.5 rounded-xl bg-navy-900 border border-slate-700 text-slate-300 hover:text-white"
        >
          <ArrowLeft size={16} />
        </button>
        <div>
          <h2 className="text-lg font-black font-display text-white">
            {language === 'hi' ? 'राजनीतिक प्रशिक्षण अकादमी' : 'Leadership & Training Academy'}
          </h2>
          <span className="text-[10px] text-slate-400">दक्षता संवर्धन व व्यक्तित्व विकास</span>
        </div>
      </div>

      {/* Programs List */}
      <div className="space-y-2.5">
        {TRAINING_PROGRAMS.map((prog) => {
          const canAfford = player.resources.money >= prog.cost && player.resources.energy >= prog.energyCost;

          return (
            <div
              key={prog.id}
              className="p-3.5 rounded-2xl bg-navy-900/80 border border-slate-800 shadow-lg space-y-2"
            >
              <div className="flex items-start justify-between gap-2">
                <div>
                  <h4 className="text-xs font-black text-white">
                    {language === 'hi' ? prog.titleHi : prog.titleEn}
                  </h4>
                  <span className="text-[10px] text-amber-400 font-bold">
                    लक्ष्य: +{prog.statBoost} {t.stats[prog.targetStat]}
                  </span>
                </div>

                <button
                  onClick={() => {
                    sound.playSelect();
                    onEnrollTraining(prog);
                  }}
                  disabled={!canAfford}
                  className="px-3 py-1.5 rounded-xl bg-gradient-to-r from-saffron to-amber-500 text-navy-950 text-xs font-black hover:brightness-105 active:scale-95 disabled:opacity-40 transition-all flex items-center gap-1"
                >
                  <Sparkles size={12} />
                  <span>प्रशिक्षण लें</span>
                </button>
              </div>

              <p className="text-[11px] text-slate-300 leading-snug">
                {language === 'hi' ? prog.descHi : prog.descEn}
              </p>

              <div className="flex items-center justify-between text-[10px] text-slate-400 pt-2 border-t border-slate-800">
                <div className="flex items-center gap-3">
                  <span className="flex items-center gap-0.5 text-emerald-400 font-bold">
                    <IndianRupee size={11} />
                    ₹{prog.cost.toLocaleString('en-IN')}
                  </span>
                  <span className="flex items-center gap-0.5 text-amber-400 font-bold">
                    <Zap size={11} />
                    {prog.energyCost}% ऊर्जा
                  </span>
                </div>
                <span className="flex items-center gap-0.5 text-slate-300">
                  <Clock size={11} />
                  {prog.timeDays} {language === 'hi' ? 'दिन' : 'Days'}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
