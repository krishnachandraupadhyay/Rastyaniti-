import React from 'react';
import { Shield, Zap, IndianRupee, Globe, Volume2, VolumeX, Bell } from 'lucide-react';
import { PlayerProfile, PoliticalParty } from '../../types/game';
import { useI18n } from '../../locales/i18n';
import { sound } from '../../audio/soundEffects';

interface HeaderBarProps {
  player: PlayerProfile;
  party: PoliticalParty | null;
  daysToElection: number;
  onOpenNotifications: () => void;
  unreadCount: number;
  onOpenTutorial?: () => void;
}

export const HeaderBar: React.FC<HeaderBarProps> = ({
  player,
  party,
  daysToElection,
  onOpenNotifications,
  unreadCount,
  onOpenTutorial,
}) => {
  const { language, toggleLanguage, t } = useI18n();

  return (
    <header className="sticky top-0 z-30 bg-navy-900/90 backdrop-blur-md border-b border-slate-800/80 px-3 py-2">
      {/* Top Row: Level Title, Days to Election, Language & Sound */}
      <div className="flex items-center justify-between gap-2 mb-1.5">
        <div className="flex items-center gap-1.5 min-w-0">
          <img 
            src="/rajniti-logo.png" 
            alt="Rाजनीति" 
            className="w-5 h-5 rounded-md border border-amber-400/60 object-cover flex-shrink-0"
          />
          <span className="flex-shrink-0 px-2 py-0.5 rounded-full bg-gradient-to-r from-saffron to-amber-500 text-[10px] font-black tracking-wider text-navy-950 uppercase shadow-sm">
            L{player.level}
          </span>
          <span className="text-xs font-bold text-slate-200 truncate">
            {language === 'hi' ? t.levels[player.level] : (t.levels[player.level] || player.positionTitleEn)}
          </span>
          {party && (
            <span
              className="text-[10px] font-semibold px-1.5 py-0.2 rounded text-white truncate max-w-[80px]"
              style={{ backgroundColor: party.color || '#ff671f' }}
            >
              {party.shortName}
            </span>
          )}
        </div>

        <div className="flex items-center gap-1.5 flex-shrink-0">
          {/* Days to Election Badge */}
          <div className="px-2 py-0.5 rounded-md bg-rose-950/70 border border-rose-700/50 text-[11px] font-bold text-rose-300 flex items-center gap-1 animate-pulse">
            <span>🗳️</span>
            <span>{daysToElection} {t.daysRemaining}</span>
          </div>

          {/* Notifications bell */}
          <button
            onClick={() => {
              sound.playClick();
              onOpenNotifications();
            }}
            className="relative p-1 rounded-md bg-navy-800 text-slate-300 hover:text-white border border-slate-700"
            title="सूचनाएं (Alerts)"
          >
            <Bell size={14} />
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-saffron text-[9px] font-black text-navy-950 rounded-full flex items-center justify-center">
                {unreadCount}
              </span>
            )}
          </button>

          {/* Quick Language Toggle */}
          <button
            onClick={() => {
              sound.playClick();
              toggleLanguage();
            }}
            className="p-1 rounded-md bg-navy-800 text-slate-300 hover:text-saffron border border-slate-700 text-xs font-bold"
            title="भाषा बदलें (Language)"
          >
            <Globe size={14} />
          </button>

          {/* Chanakya Niti Advisor */}
          {onOpenTutorial && (
            <button
              onClick={() => {
                sound.playSelect();
                onOpenTutorial();
              }}
              className="px-1.5 py-0.5 rounded-md bg-amber-500/20 text-amber-300 hover:bg-amber-500/30 border border-amber-500/40 text-[10px] font-black flex items-center gap-1 shadow-sm"
              title="चाणक्य नीति मार्गदर्शिका"
            >
              <span>📜</span>
              <span className="hidden sm:inline">नीति</span>
            </button>
          )}
        </div>
      </div>

      {/* Bottom Row: Key Resources (Funds, Public Trust, Energy) */}
      <div className="grid grid-cols-3 gap-1.5 pt-1 border-t border-slate-800/40 text-[11px]">
        {/* Funds */}
        <div className="flex items-center gap-1 bg-navy-950/60 px-2 py-0.8 rounded border border-slate-800">
          <IndianRupee size={12} className="text-emerald-400 flex-shrink-0" />
          <div className="truncate">
            <span className="text-[9px] text-slate-400 block leading-tight">
              {party ? t.resources.partyFunds : t.resources.money}
            </span>
            <span className="font-bold text-emerald-300">
              ₹{(party ? player.resources.partyFunds : player.resources.money).toLocaleString('en-IN')}
            </span>
          </div>
        </div>

        {/* Public Trust */}
        <div className="flex items-center gap-1 bg-navy-950/60 px-2 py-0.8 rounded border border-slate-800">
          <Shield size={12} className="text-saffron flex-shrink-0" />
          <div className="w-full min-w-0">
            <div className="flex justify-between items-center text-[9px] leading-tight">
              <span className="text-slate-400 truncate">{t.trust}</span>
              <span className="font-bold text-saffron-300">{player.stats.publicTrust}%</span>
            </div>
            <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden mt-0.5">
              <div
                className="bg-gradient-to-r from-saffron to-amber-400 h-full rounded-full transition-all duration-500"
                style={{ width: `${Math.min(100, Math.max(0, player.stats.publicTrust))}%` }}
              ></div>
            </div>
          </div>
        </div>

        {/* Energy */}
        <div className="flex items-center gap-1 bg-navy-950/60 px-2 py-0.8 rounded border border-slate-800">
          <Zap size={12} className="text-amber-400 flex-shrink-0" />
          <div className="w-full min-w-0">
            <div className="flex justify-between items-center text-[9px] leading-tight">
              <span className="text-slate-400 truncate">{t.energy}</span>
              <span className="font-bold text-amber-300">{player.resources.energy}%</span>
            </div>
            <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden mt-0.5">
              <div
                className="bg-gradient-to-r from-amber-400 to-yellow-300 h-full rounded-full transition-all duration-500"
                style={{ width: `${Math.min(100, Math.max(0, player.resources.energy))}%` }}
              ></div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};
