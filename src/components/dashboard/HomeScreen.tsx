import React from 'react';
import { Shield, TrendingUp, Users, Target, ArrowRight, Award, Compass, Sparkles, AlertCircle, ChevronRight } from 'lucide-react';
import { PlayerProfile, PoliticalParty, DemographicSupport } from '../../types/game';
import { useI18n } from '../../locales/i18n';
import { sound } from '../../audio/soundEffects';
import { NavTab } from '../common/BottomNav';

interface HomeScreenProps {
  player: PlayerProfile;
  party: PoliticalParty | null;
  support: DemographicSupport;
  daysToElection: number;
  onNavigate: (tab: NavTab) => void;
  onAdvanceDay: () => void;
  onOpenElectionCommission: () => void;
  onStartElectionDay: () => void;
}

export const HomeScreen: React.FC<HomeScreenProps> = ({
  player,
  party,
  support,
  daysToElection,
  onNavigate,
  onAdvanceDay,
  onOpenElectionCommission,
  onStartElectionDay,
}) => {
  const { language, t } = useI18n();

  // Dynamic Level Objective
  const getObjective = (lvl: number) => {
    switch (lvl) {
      case 1:
      case 2:
        return language === 'hi' ? 'अपनी राजनीतिक पार्टी का विस्तार करें और पहले चुनाव की तैयारी करें' : 'Expand party membership and prepare for the local election';
      case 3:
      case 4:
        return language === 'hi' ? 'गृह विधानसभा क्षेत्र में जनविश्वास 50% से अधिक कर चुनाव जीतें' : 'Push public trust above 50% in home seat to secure legislative victory';
      case 5:
      case 6:
        return language === 'hi' ? 'राज्य स्तर पर गठबंधन बनाएं और विधानसभा में प्रमुख दल बनें' : 'Forge state alliances and lead your party in State Assembly polls';
      case 7:
      case 8:
        return language === 'hi' ? 'लोकसभा चुनाव में सांसद बनकर देश की सर्वोच्च संसद में पहुंचें' : 'Win parliamentary seat to become Member of Parliament in Lok Sabha';
      case 9:
      case 10:
        return language === 'hi' ? '272+ सीटों का समर्थन जुटाकर भारत के प्रधानमंत्री पद की शपथ लें' : 'Marshal 272+ parliamentary seats to assume Prime Ministership of Bharat';
      default:
        return language === 'hi' ? 'राष्ट्रीय सुधार लागू करें, आर्थिक वृद्धि बढ़ाएं और पुनः जनादेश प्राप्त करें' : 'Implement economic reforms, manage crises, and win the next general election';
    }
  };

  return (
    <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-navy-950 text-slate-100">
      {/* Prime Leader Headline Card */}
      <div className="bg-gradient-to-br from-navy-900 via-navy-900 to-[#0d223f] p-4 rounded-3xl border border-slate-800 shadow-xl relative overflow-hidden">
        {/* Background glow badge */}
        <div className="absolute -right-6 -bottom-6 w-32 h-32 bg-saffron/10 rounded-full blur-2xl pointer-events-none"></div>

        <div className="flex items-start justify-between gap-3 relative z-10">
          <div>
            <div className="flex items-center gap-1.5 mb-1">
              <span className="px-2 py-0.5 rounded-full bg-saffron/20 border border-saffron/40 text-saffron text-[10px] font-black uppercase">
                {language === 'hi' ? 'पद / POSITION' : 'POSITION'}
              </span>
              <span className="text-xs font-bold text-amber-300">
                {language === 'hi' ? t.levels[player.level] : player.positionTitleEn}
              </span>
            </div>

            <h2 className="text-2xl font-black font-display text-white tracking-wide">
              {player.name}
            </h2>

            <p className="text-xs text-slate-400 mt-0.5">
              {player.constituency} • {player.state}
            </p>
          </div>

          {/* Party Flag / Badge */}
          {party && (
            <div
              onClick={() => onNavigate('PARTY')}
              className="flex flex-col items-center justify-center p-2 rounded-2xl cursor-pointer hover:scale-105 transition-transform border border-white/20 shadow-md"
              style={{ backgroundColor: party.color || '#ff671f' }}
            >
              <span className="text-xs font-black text-white">{party.shortName}</span>
              <span className="text-[9px] text-white/90 font-bold">{party.readiness}% तैयार</span>
            </div>
          )}
        </div>

        {/* Current Objective Bar */}
        <div className="mt-4 p-3 rounded-2xl bg-navy-950/80 border border-slate-800/80 flex items-start gap-2.5">
          <div className="p-1.5 rounded-lg bg-amber-500/20 text-amber-400 mt-0.5 flex-shrink-0">
            <Target size={16} />
          </div>
          <div className="min-w-0">
            <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 block">
              {language === 'hi' ? 'वर्तमान लक्ष्य (CURRENT OBJECTIVE)' : 'CURRENT OBJECTIVE'}
            </span>
            <p className="text-xs font-bold text-slate-200 leading-snug">
              {getObjective(player.level)}
            </p>
          </div>
        </div>
      </div>

      {/* Quick Action Matrix (Advance Day / Election Commission / Campaign / Quiz) */}
      <div className="grid grid-cols-2 gap-2.5">
        {/* Next Day / Next Turn */}
        <button
          onClick={() => {
            sound.playClick();
            onAdvanceDay();
          }}
          className="p-3.5 rounded-2xl bg-gradient-to-r from-saffron to-amber-500 text-navy-950 font-black text-xs uppercase tracking-wider flex items-center justify-between shadow-lg hover:brightness-105 active:scale-95 transition-all"
        >
          <div className="text-left">
            <span className="block text-[10px] text-navy-900/80">दैनिक चक्र (DAY LOOP)</span>
            <span className="text-sm font-black">अगला दिन बढ़ें</span>
          </div>
          <ArrowRight size={18} />
        </button>

        {/* Election Day Trigger (if days remain <= 1 or player ready) */}
        {daysToElection <= 5 ? (
          <button
            onClick={() => {
              sound.playRally();
              onStartElectionDay();
            }}
            className="p-3.5 rounded-2xl bg-gradient-to-r from-rose-600 to-red-500 text-white font-black text-xs uppercase tracking-wider flex items-center justify-between shadow-lg animate-pulse hover:brightness-110 active:scale-95 transition-all"
          >
            <div className="text-left">
              <span className="block text-[10px] text-rose-200">मतदान की घड़ी</span>
              <span className="text-sm font-black">मतगणना शुरू करें</span>
            </div>
            <span>🗳️</span>
          </button>
        ) : (
          /* Election Commission Guidelines */
          <button
            onClick={() => {
              sound.playClick();
              onOpenElectionCommission();
            }}
            className="p-3.5 rounded-2xl bg-navy-900/80 hover:bg-navy-800 border border-slate-700/70 text-slate-200 font-bold text-xs flex items-center justify-between shadow-md transition-all"
          >
            <div className="text-left">
              <span className="block text-[10px] text-slate-400">आदर्श आचार संहिता</span>
              <span className="text-xs font-bold text-emerald-400">निर्वाचन आयोग</span>
            </div>
            <Shield size={16} className="text-emerald-400" />
          </button>
        )}
      </div>

      {/* Strategic Hub Cards */}
      <div className="grid grid-cols-3 gap-2">
        <div
          onClick={() => onNavigate('CAMPAIGN')}
          className="p-3 rounded-2xl bg-navy-900/60 hover:bg-navy-800/80 border border-slate-800 cursor-pointer text-center group transition-all"
        >
          <div className="w-9 h-9 rounded-xl bg-saffron/15 text-saffron flex items-center justify-center mx-auto mb-1.5 group-hover:scale-110 transition-transform">
            <TrendingUp size={18} />
          </div>
          <span className="text-xs font-bold text-slate-200 block">{t.nav.campaign}</span>
          <span className="text-[10px] text-slate-400">रैली व जनसंपर्क</span>
        </div>

        <div
          onClick={() => onNavigate('MAP')}
          className="p-3 rounded-2xl bg-navy-900/60 hover:bg-navy-800/80 border border-slate-800 cursor-pointer text-center group transition-all"
        >
          <div className="w-9 h-9 rounded-xl bg-sky-500/15 text-sky-400 flex items-center justify-center mx-auto mb-1.5 group-hover:scale-110 transition-transform">
            <Compass size={18} />
          </div>
          <span className="text-xs font-bold text-slate-200 block">{t.nav.map}</span>
          <span className="text-[10px] text-slate-400">सीटें व प्रभाव</span>
        </div>

        <div
          onClick={() => onNavigate('QUIZ')}
          className="p-3 rounded-2xl bg-navy-900/60 hover:bg-navy-800/80 border border-slate-800 cursor-pointer text-center group transition-all"
        >
          <div className="w-9 h-9 rounded-xl bg-amber-500/15 text-amber-400 flex items-center justify-center mx-auto mb-1.5 group-hover:scale-110 transition-transform">
            <Award size={18} />
          </div>
          <span className="text-xs font-bold text-slate-200 block">{t.nav.quiz}</span>
          <span className="text-[10px] text-slate-400">संविधान ज्ञान</span>
        </div>
      </div>

      {/* Demographic Public Opinion Overview */}
      <div className="bg-navy-900/70 p-4 rounded-3xl border border-slate-800 shadow-lg space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <Users size={16} className="text-saffron" />
            <h3 className="text-xs font-black uppercase tracking-wider text-slate-200">
              {language === 'hi' ? 'जनमत व वर्गवार समर्थन (Public Opinion)' : 'Voter Demographic Support'}
            </h3>
          </div>
          <span className="text-[10px] text-slate-400">अद्यतन सर्वे</span>
        </div>

        <div className="grid grid-cols-2 gap-2 text-xs">
          {(Object.keys(support) as Array<keyof DemographicSupport>).map((grp) => (
            <div key={grp} className="p-2 rounded-xl bg-navy-950/70 border border-slate-800/70">
              <div className="flex justify-between items-center text-[11px] mb-1">
                <span className="text-slate-300 font-medium">{t.demographics[grp]}</span>
                <span className="font-bold text-saffron-300">{support[grp]}%</span>
              </div>
              <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                <div
                  className="bg-gradient-to-r from-saffron to-emerald-500 h-full rounded-full transition-all duration-500"
                  style={{ width: `${support[grp]}%` }}
                ></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
