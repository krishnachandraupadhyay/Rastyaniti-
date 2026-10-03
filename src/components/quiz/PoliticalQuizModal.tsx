import React, { useState } from 'react';
import { BookOpen, CheckCircle, XCircle, ArrowRight, Sparkles } from 'lucide-react';
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
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/20 border border-amber-500/40 text-amber-400 text-xs font-black uppercase mb-1">
            <BookOpen size={15} />
            <span>संविधान व नागरिक शास्त्र ज्ञान परीक्षा</span>
          </div>
          <h2 className="text-2xl font-black font-display text-white">
            {t.quiz.title}
          </h2>
          <p className="text-xs sm:text-sm text-slate-300">
            {t.quiz.subtitle}
          </p>
        </div>

        {/* Score Badge */}
        <div className="p-3 rounded-2xl bg-navy-900 border border-slate-700 text-right shadow-md">
          <span className="text-xs text-slate-400 block font-semibold">{t.quiz.score}</span>
          <span className="text-lg font-black text-amber-400">+{score}</span>
        </div>
      </div>

      {/* Quiz Card */}
      <div className="bg-navy-900/90 border border-slate-800 rounded-3xl p-5 sm:p-6 shadow-2xl space-y-4 my-auto">
        <div className="flex items-center justify-between text-xs sm:text-sm">
          <span className="font-extrabold text-slate-300">
            {t.quiz.questionCount} {currentIndex + 1} / {quizQuestions.length}
          </span>
          <span className="px-2.5 py-1 rounded-full bg-navy-950 font-black text-xs text-saffron border border-slate-800">
            {currentQ.difficulty}
          </span>
        </div>

        {/* Question Text */}
        <h3 className="text-base sm:text-lg font-black text-white leading-relaxed">
          {language === 'hi' ? currentQ.questionHi : currentQ.questionEn}
        </h3>

        {/* Options */}
        <div className="space-y-2.5 pt-1">
          {(language === 'hi' ? currentQ.optionsHi : currentQ.optionsEn).map((opt, idx) => {
            const isSelected = selectedOption === idx;
            const isCorrect = idx === currentQ.correctIndex;

            let btnStyle = 'bg-navy-950/90 border-slate-800 text-slate-100 hover:border-saffron/70 hover:bg-navy-900';
            if (isAnswered) {
              if (isCorrect) {
                btnStyle = 'bg-emerald-950/90 border-emerald-500 text-emerald-100 ring-2 ring-emerald-500 font-black';
              } else if (isSelected) {
                btnStyle = 'bg-rose-950/90 border-rose-500 text-rose-100 ring-2 ring-rose-500 font-black';
              }
            }

            return (
              <button
                key={idx}
                onClick={() => handleOptionClick(idx)}
                disabled={isAnswered}
                className={`w-full p-3.5 rounded-2xl border text-sm sm:text-base font-bold text-left transition-all flex items-center justify-between shadow-sm ${btnStyle}`}
              >
                <span className="pr-2">{opt}</span>
                {isAnswered && (
                  isCorrect ? (
                    <CheckCircle size={20} className="text-emerald-400 flex-shrink-0" />
                  ) : isSelected ? (
                    <XCircle size={20} className="text-rose-400 flex-shrink-0" />
                  ) : null
                )}
              </button>
            );
          })}
        </div>

        {/* Explanation & Stat Reward */}
        {isAnswered && (
          <div className="pt-3.5 border-t border-slate-800 space-y-3 animate-fadeIn">
            <div className={`p-3 rounded-2xl text-xs sm:text-sm font-bold flex items-center gap-2.5 ${
              selectedOption === currentQ.correctIndex
                ? 'bg-emerald-950/90 text-emerald-200 border border-emerald-800'
                : 'bg-rose-950/90 text-rose-200 border border-rose-800'
            }`}>
              <Sparkles size={18} className="flex-shrink-0" />
              <span>
                {selectedOption === currentQ.correctIndex
                  ? `${t.quiz.correct} | +${currentQ.rewardAmount} ${t.stats[currentQ.rewardStat]}`
                  : t.quiz.wrong}
              </span>
            </div>

            <div className="text-xs sm:text-sm text-slate-300 bg-navy-950 p-3 rounded-2xl border border-slate-800/90 leading-relaxed">
              <strong className="text-amber-400 block mb-1 text-xs uppercase tracking-wider">{t.quiz.explanation}</strong>
              {language === 'hi' ? currentQ.explanationHi : currentQ.explanationEn}
            </div>

            <button
              onClick={handleNext}
              className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-saffron to-amber-500 text-navy-950 font-black text-sm uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg hover:brightness-105 active:scale-95 transition-all mt-2"
            >
              <span>{t.quiz.nextQuestion}</span>
              <ArrowRight size={18} className="stroke-[2.5]" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
