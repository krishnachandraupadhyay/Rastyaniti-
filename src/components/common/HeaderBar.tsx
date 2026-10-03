import React from 'react';
import { Shield, Zap, IndianRupee, Globe, Bell } from 'lucide-react';
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
    <header className="sticky top-0 z-30 bg-navy-900/95 backdrop-blur-md border-b border-slate-800/80 px-3.5 py-2.5 shadow-md">
      {/* Top Row: Level Title, Days to Election, Language & Sound */}
      <div className="flex items-center justify-between gap-2 mb-2">
        <div className="flex items-center gap-2 min-w-0">
          <img 
            src="/rajniti-logo.png" 
            alt="Rाजनीति" 
            className="w-7 h-7 rounded-lg border border-amber-400/60 object-cover flex-shrink-0 shadow"
          />
          <span className="flex-shrink-0 px-2.5 py-0.5 rounded-full bg-gradient-to-r from-saffron to-amber-500 text-xs font-black tracking-wider text-navy-950 uppercase shadow-sm">
            L{player.level}
          </span>
          <span className="text-sm font-black text-slate-100 truncate">
            {language === 'hi' ? t.levels[player.level] : (t.levels[player.level] || player.positionTitleEn)}
          </span>
          {party && (
            <span
              className="text-xs font-bold px-2 py-0.5 rounded-md text-white truncate max-w-[90px] shadow-sm"
              style={{ backgroundColor: party.color || '#ff671f' }}
            >
              {party.shortName}
            </span>
          )}
        </div>

        <div className="flex items-center gap-1.5 flex-shrink-0">
          {/* Days to Election Badge */}
          <div className="px-2.5 py-1 rounded-lg bg-rose-950/80 border border-rose-600/60 text-xs font-black text-rose-200 flex items-center gap-1 animate-pulse shadow-sm">
            <span>🗳️</span>
            <span>{daysToElection} {t.daysRemaining}</span>
          </div>

          {/* Notifications bell */}
          <button
            onClick={() => {
              sound.playClick();
              onOpenNotifications();
            }}
            className="relative p-1.5 rounded-xl bg-navy-800 text-slate-200 hover:text-white border border-slate-700 hover:border-amber-400 transition-colors shadow-sm"
            title="सूचनाएं (Alerts)"
          >
            <Bell size={18} />
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 bg-saffron text-[10px] font-black text-navy-950 rounded-full flex items-center justify-center ring-2 ring-navy-900">
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
            className="p-1.5 rounded-xl bg-navy-800 text-slate-200 hover:text-saffron border border-slate-700 hover:border-saffron transition-colors text-xs font-black shadow-sm"
            title="भाषा बदलें (Language)"
          >
            <Globe size={18} />
          </button>

          {/* Chanakya Niti Advisor */}
          {onOpenTutorial && (
            <button
              onClick={() => {
                sound.playSelect();
                onOpenTutorial();
              }}
              className="px-2 py-1 rounded-xl bg-amber-500/20 text-amber-300 hover:bg-amber-500/30 border border-amber-500/50 text-xs font-black flex items-center gap-1 shadow-sm transition-all active:scale-95"
              title="चाणक्य नीति मार्गदर्शिका"
            >
              <span className="text-sm">📜</span>
              <span>नीति</span>
            </button>
          )}
        </div>
      </div>

      {/* Bottom Row: Key Resources (Funds, Public Trust, Energy) */}
      <div className="grid grid-cols-3 gap-2 pt-1.5 border-t border-slate-800/60">
        {/* Funds */}
        <div className="flex items-center gap-1.5 bg-navy-950/80 px-2.5 py-1.5 rounded-xl border border-slate-800 shadow-sm">
          <IndianRupee size={16} className="text-emerald-400 flex-shrink-0" />
          <div className="truncate">
            <span className="text-xs text-slate-400 block leading-tight font-medium">
              {party ? t.resources.partyFunds : t.resources.money}
            </span>
            <span className="font-black text-sm text-emerald-300 leading-tight">
              ₹{(party ? player.resources.partyFunds : player.resources.money).toLocaleString('en-IN')}
            </span>
          </div>
        </div>

        {/* Public Trust */}
        <div className="flex items-center gap-1.5 bg-navy-950/80 px-2.5 py-1.5 rounded-xl border border-slate-800 shadow-sm">
          <Shield size={16} className="text-saffron flex-shrink-0" />
          <div className="w-full min-w-0">
            <div className="flex justify-between items-center text-xs leading-tight">
              <span className="text-slate-400 font-medium truncate">{t.trust}</span>
              <span className="font-black text-sm text-saffron-300">{player.stats.publicTrust}%</span>
            </div>
            <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden mt-1">
              <div
                className="bg-gradient-to-r from-saffron to-amber-400 h-full rounded-full transition-all duration-500"
                style={{ width: `${Math.min(100, Math.max(0, player.stats.publicTrust))}%` }}
              ></div>
            </div>
          </div>
        </div>

        {/* Energy */}
        <div className="flex items-center gap-1.5 bg-navy-950/80 px-2.5 py-1.5 rounded-xl border border-slate-800 shadow-sm">
          <Zap size={16} className="text-amber-400 flex-shrink-0" />
          <div className="w-full min-w-0">
            <div className="flex justify-between items-center text-xs leading-tight">
              <span className="text-slate-400 font-medium truncate">{t.energy}</span>
              <span className="font-black text-sm text-amber-300">{player.resources.energy}%</span>
            </div>
            <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden mt-1">
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
