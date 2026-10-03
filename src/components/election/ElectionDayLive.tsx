import React, { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import { Trophy, Award, CheckCircle, XCircle, ArrowRight, RotateCcw, BarChart3, Users, Sparkles } from 'lucide-react';
import { ElectionResult } from '../../engine/electionEngine';
import { useI18n } from '../../locales/i18n';
import { sound } from '../../audio/soundEffects';

interface ElectionDayLiveProps {
  result: ElectionResult;
  onVictoryProceed: () => void;
  onRetry: () => void;
}

export const ElectionDayLive: React.FC<ElectionDayLiveProps> = ({
  result,
  onVictoryProceed,
  onRetry,
}) => {
  const { language, t } = useI18n();
  const [round, setRound] = useState<number>(1);
  const [isFinished, setIsFinished] = useState<boolean>(false);

  // Progressive counting rounds
  useEffect(() => {
    sound.playSelect();

    const interval = setInterval(() => {
      setRound((prev) => {
        if (prev >= 5) {
          clearInterval(interval);
          setIsFinished(true);
          if (result.isPlayerWon) {
            sound.playVictory();
            try {
              confetti({
                particleCount: 120,
                spread: 70,
                origin: { y: 0.6 },
                colors: ['#FF671F', '#FFFFFF', '#046A38', '#D4AF37']
              });
            } catch {}
          }
          return 5;
        }
        sound.playClick();
        return prev + 1;
      });
    }, 1200);

    return () => clearInterval(interval);
  }, [result.isPlayerWon]);

  // Round multiplier (20%, 40%, 60%, 80%, 100%)
  const countingFactor = round / 5;
  const displayedPlayerVotes = Math.round(result.playerVotes * countingFactor);

  return (
    <div className="fixed inset-0 z-50 bg-navy-950 flex flex-col items-center justify-between p-4 text-slate-100 overflow-y-auto animate-fadeIn">
      {/* Top TV Broadcast Banner */}
      <div className="w-full max-w-md text-center pt-2">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-600 text-white text-xs font-black uppercase tracking-widest animate-pulse shadow-lg mb-2">
          <span>🔴 LIVE</span>
          <span>• जनमत गणना कक्ष (COUNTING ROOM)</span>
        </div>
        <h2 className="text-xl font-black font-display text-white">
          {result.constituencyName}
        </h2>
        <span className="text-xs text-slate-400">
          {t.electionDay.liveTurnout}: <strong className="text-amber-400">{result.turnoutPercent}%</strong> ({result.totalVotesPolled.toLocaleString('en-IN')} मत)
        </span>
      </div>

      {/* Center Live Counting Board */}
      <div className="w-full max-w-md bg-navy-900/90 border border-slate-800 rounded-3xl p-5 shadow-2xl space-y-4 my-auto">
        <div className="flex items-center justify-between pb-2 border-b border-slate-800">
          <span className="text-xs font-black text-slate-300">
            {language === 'hi' ? `मतगणना चक्र: राउंड ${round}/5` : `Counting Round: ${round}/5`}
          </span>
          <span className="text-[10px] px-2 py-0.5 rounded-full bg-navy-950 font-bold text-slate-400 border border-slate-800">
            {round < 5 ? t.electionDay.countingInProgress : (language === 'hi' ? 'अंतिम परिणाम' : 'Final Certified Result')}
          </span>
        </div>

        {/* Player Result Bar */}
        <div className="space-y-1.5">
          <div className="flex justify-between items-center text-xs">
            <span className="font-black text-white flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-saffron inline-block"></span>
              <span>आपकी पार्टी (Your Party)</span>
            </span>
            <span className="font-black text-saffron text-sm">
              {displayedPlayerVotes.toLocaleString('en-IN')} ({result.playerVoteShare}%)
            </span>
          </div>
          <div className="w-full bg-slate-950 h-3 rounded-full overflow-hidden border border-slate-800">
            <div
              className="bg-gradient-to-r from-saffron to-amber-400 h-full rounded-full transition-all duration-700"
              style={{ width: `${result.playerVoteShare * countingFactor}%` }}
            ></div>
          </div>
        </div>

        {/* Opposition Candidates Bars */}
        <div className="space-y-3 pt-2">
          {result.opponentResults.map((opp) => {
            const oppVotes = Math.round(opp.votes * countingFactor);
            return (
              <div key={opp.partyId} className="space-y-1">
                <div className="flex justify-between items-center text-xs">
                  <span className="text-slate-300 font-semibold flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full inline-block" style={{ backgroundColor: opp.color }}></span>
                    <span>{opp.partyName}</span>
                  </span>
                  <span className="font-bold text-slate-300 text-xs">
                    {oppVotes.toLocaleString('en-IN')} ({opp.voteShare}%)
                  </span>
                </div>
                <div className="w-full bg-slate-950 h-2 rounded-full overflow-hidden border border-slate-800/80">
                  <div
                    className="h-full rounded-full transition-all duration-700 opacity-80"
                    style={{
                      width: `${opp.voteShare * countingFactor}%`,
                      backgroundColor: opp.color,
                    }}
                  ></div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Victory / Defeat Final Card Reveal */}
        {isFinished && (
          <div className="pt-3 border-t border-slate-800 animate-fadeIn text-center">
            {result.isPlayerWon ? (
              <div className="p-3 bg-emerald-950/80 border border-emerald-500/50 rounded-2xl text-emerald-300 space-y-1">
                <div className="flex items-center justify-center gap-2 text-base font-black text-white">
                  <Trophy size={20} className="text-amber-400" />
                  <span>{t.electionDay.victoryTitle}</span>
                </div>
                <p className="text-xs text-emerald-200">
                  {t.electionDay.victoryDesc}
                </p>
                <div className="text-[11px] font-black text-amber-300 pt-1">
                  जीत का अंतर (Margin): +{result.margin.toLocaleString('en-IN')} मत
                </div>
              </div>
            ) : (
              <div className="p-3 bg-rose-950/80 border border-rose-500/50 rounded-2xl text-rose-300 space-y-1">
                <div className="flex items-center justify-center gap-2 text-base font-black text-white">
                  <XCircle size={20} className="text-rose-400" />
                  <span>{t.electionDay.defeatTitle}</span>
                </div>
                <p className="text-xs text-rose-200">
                  {t.electionDay.defeatDesc}
                </p>
                <div className="text-[11px] font-black text-slate-300 pt-1">
                  विजेता: {result.winnerParty}
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Bottom Action Buttons */}
      <div className="w-full max-w-md pb-4">
        {isFinished ? (
          result.isPlayerWon ? (
            <button
              onClick={() => {
                sound.playRally();
                onVictoryProceed();
              }}
              className="w-full py-3.5 px-6 rounded-2xl bg-gradient-to-r from-emerald-500 via-tiranga-green to-emerald-600 text-white font-black text-sm uppercase tracking-wider flex items-center justify-center gap-2 shadow-xl hover:brightness-110 active:scale-95 transition-all"
            >
              <Sparkles size={16} />
              <span>{t.electionDay.celebrateBtn}</span>
              <ArrowRight size={16} />
            </button>
          ) : (
            <button
              onClick={() => {
                sound.playClick();
                onRetry();
              }}
              className="w-full py-3.5 px-6 rounded-2xl bg-slate-800 hover:bg-slate-700 text-white font-black text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-md transition-all"
            >
              <RotateCcw size={14} />
              <span>{t.electionDay.retryBtn}</span>
            </button>
          )
        ) : (
          <div className="text-center text-xs text-slate-500 font-semibold animate-pulse">
            EVM मतों की गणना चल रही है...
          </div>
        )}
      </div>
    </div>
  );
};
