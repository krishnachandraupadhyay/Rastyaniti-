import React, { useState } from 'react';
import { BookOpen, CheckCircle, XCircle, Award, ArrowRight, Sparkles, HelpCircle } from 'lucide-react';
import { quizQuestions } from '../../engine/quizDatabase';
import { QuizQuestion } from '../../types/quiz';
import { PlayerStats } from '../../types/game';
import { useI18n } from '../../locales/i18n';
import { sound } from '../../audio/soundEffects';

interface PoliticalQuizModalProps {
  onRewardEarned: (stat: keyof PlayerStats, amount: number) => void;
}

export const PoliticalQuizModal: React.FC<PoliticalQuizModalProps> = ({ onRewardEarned }) => {
  const { language, t } = useI18n();
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isAnswered, setIsAnswered] = useState<boolean>(false);
  const [score, setScore] = useState<number>(0);

  const currentQ: QuizQuestion = quizQuestions[currentIndex % quizQuestions.length];

  const handleOptionClick = (idx: number) => {
    if (isAnswered) return;
    setSelectedOption(idx);
    setIsAnswered(true);

    if (idx === currentQ.correctIndex) {
      sound.playVictory();
      setScore(prev => prev + 10);
      onRewardEarned(currentQ.rewardStat, currentQ.rewardAmount);
    } else {
      sound.playClick();
    }
  };

  const handleNext = () => {
    sound.playSelect();
    setSelectedOption(null);
    setIsAnswered(false);
    setCurrentIndex(prev => prev + 1);
  };

  return (
    <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-navy-950 text-slate-100 flex flex-col">
      {/* Top Header */}
      <div className="flex items-center justify-between">
        <div>
          <div className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-amber-500/15 border border-amber-500/30 text-amber-400 text-[10px] font-black uppercase mb-1">
            <BookOpen size={12} />
            <span>संविधान व नागरिक शास्त्र ज्ञान परीक्षा</span>
          </div>
          <h2 className="text-xl font-black font-display text-white">
            {t.quiz.title}
          </h2>
          <p className="text-xs text-slate-400">
            {t.quiz.subtitle}
          </p>
        </div>

        {/* Score Badge */}
        <div className="p-2.5 rounded-2xl bg-navy-900 border border-slate-700 text-right">
          <span className="text-[10px] text-slate-400 block">{t.quiz.score}</span>
          <span className="text-base font-black text-amber-400">+{score}</span>
        </div>
      </div>

      {/* Quiz Card */}
      <div className="bg-navy-900/90 border border-slate-800 rounded-3xl p-5 shadow-2xl space-y-4 my-auto">
        <div className="flex items-center justify-between text-xs">
          <span className="font-bold text-slate-400">
            {t.quiz.questionCount} {currentIndex + 1} / {quizQuestions.length}
          </span>
          <span className="px-2 py-0.5 rounded-full bg-navy-950 font-black text-[10px] text-saffron border border-slate-800">
            {currentQ.difficulty}
          </span>
        </div>

        {/* Question Text */}
        <h3 className="text-sm sm:text-base font-bold text-white leading-relaxed">
          {language === 'hi' ? currentQ.questionHi : currentQ.questionEn}
        </h3>

        {/* Options */}
        <div className="space-y-2 pt-1">
          {(language === 'hi' ? currentQ.optionsHi : currentQ.optionsEn).map((opt, idx) => {
            const isSelected = selectedOption === idx;
            const isCorrect = idx === currentQ.correctIndex;

            let btnStyle = 'bg-navy-950/80 border-slate-800 text-slate-200 hover:border-saffron/60';
            if (isAnswered) {
              if (isCorrect) {
                btnStyle = 'bg-emerald-950/80 border-emerald-500 text-emerald-200 ring-1 ring-emerald-500';
              } else if (isSelected) {
                btnStyle = 'bg-rose-950/80 border-rose-500 text-rose-200 ring-1 ring-rose-500';
              }
            }

            return (
              <button
                key={idx}
                onClick={() => handleOptionClick(idx)}
                disabled={isAnswered}
                className={`w-full p-3 rounded-2xl border text-xs font-bold text-left transition-all flex items-center justify-between ${btnStyle}`}
              >
                <span>{opt}</span>
                {isAnswered && (
                  isCorrect ? (
                    <CheckCircle size={16} className="text-emerald-400 flex-shrink-0" />
                  ) : isSelected ? (
                    <XCircle size={16} className="text-rose-400 flex-shrink-0" />
                  ) : null
                )}
              </button>
            );
          })}
        </div>

        {/* Explanation & Stat Reward */}
        {isAnswered && (
          <div className="pt-3 border-t border-slate-800 space-y-2 animate-fadeIn">
            <div className={`p-2.5 rounded-xl text-xs flex items-center gap-2 ${
              selectedOption === currentQ.correctIndex
                ? 'bg-emerald-950/80 text-emerald-300 border border-emerald-800'
                : 'bg-rose-950/80 text-rose-300 border border-rose-800'
            }`}>
              <Sparkles size={16} className="flex-shrink-0" />
              <span>
                {selectedOption === currentQ.correctIndex
                  ? `${t.quiz.correct} | +${currentQ.rewardAmount} ${t.stats[currentQ.rewardStat]}`
                  : t.quiz.wrong}
              </span>
            </div>

            <p className="text-[11px] text-slate-400 bg-navy-950 p-2.5 rounded-xl border border-slate-800/80 leading-relaxed">
              <strong className="text-slate-300 block mb-0.5">{t.quiz.explanation}</strong>
              {language === 'hi' ? currentQ.explanationHi : currentQ.explanationEn}
            </p>

            <button
              onClick={handleNext}
              className="w-full py-2.5 rounded-xl bg-saffron text-navy-950 font-black text-xs uppercase tracking-wider flex items-center justify-center gap-1.5 shadow-md hover:brightness-105 active:scale-95 transition-all mt-2"
            >
              <span>{t.quiz.nextQuestion}</span>
              <ArrowRight size={14} />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
