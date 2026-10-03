import React from 'react';
import { Home, MapPin, Flag, Megaphone, Landmark, BookOpen, User, Crown } from 'lucide-react';
import { useI18n } from '../../locales/i18n';
import { sound } from '../../audio/soundEffects';

export type NavTab = 'HOME' | 'MAP' | 'PARTY' | 'CAMPAIGN' | 'GOVERNMENT' | 'PARLIAMENT' | 'QUIZ' | 'PROFILE';

interface BottomNavProps {
  currentTab: NavTab;
  onSelectTab: (tab: NavTab) => void;
  isPM: boolean;
}

export const BottomNav: React.FC<BottomNavProps> = ({ currentTab, onSelectTab, isPM }) => {
  const { t } = useI18n();

  const handleTabClick = (tab: NavTab) => {
    sound.playClick();
    onSelectTab(tab);
  };

  return (
    <nav className="sticky bottom-0 z-30 bg-navy-950/95 backdrop-blur-lg border-t border-slate-800/90 px-1 py-1 flex items-center justify-around shadow-2xl">
      {/* 1. HQ / Home */}
      <button
        onClick={() => handleTabClick('HOME')}
        className={`flex flex-col items-center justify-center flex-1 py-1 rounded-xl transition-all ${
          currentTab === 'HOME'
            ? 'text-saffron font-bold scale-105'
            : 'text-slate-400 hover:text-slate-200'
        }`}
      >
        <Home size={18} className={currentTab === 'HOME' ? 'stroke-[2.5]' : 'stroke-2'} />
        <span className="text-[10px] mt-0.5">{t.nav.home}</span>
      </button>

      {/* 2. India Map */}
      <button
        onClick={() => handleTabClick('MAP')}
        className={`flex flex-col items-center justify-center flex-1 py-1 rounded-xl transition-all ${
          currentTab === 'MAP'
            ? 'text-saffron font-bold scale-105'
            : 'text-slate-400 hover:text-slate-200'
        }`}
      >
        <MapPin size={18} className={currentTab === 'MAP' ? 'stroke-[2.5]' : 'stroke-2'} />
        <span className="text-[10px] mt-0.5">{t.nav.map}</span>
      </button>

      {/* 3. Campaign (or Parliament if PM) */}
      {!isPM ? (
        <button
          onClick={() => handleTabClick('CAMPAIGN')}
          className={`flex flex-col items-center justify-center flex-1 py-1 rounded-xl transition-all ${
            currentTab === 'CAMPAIGN'
              ? 'text-saffron font-bold scale-105'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <Megaphone size={18} className={currentTab === 'CAMPAIGN' ? 'stroke-[2.5]' : 'stroke-2'} />
          <span className="text-[10px] mt-0.5">{t.nav.campaign}</span>
        </button>
      ) : (
        <button
          onClick={() => handleTabClick('PARLIAMENT')}
          className={`flex flex-col items-center justify-center flex-1 py-1 rounded-xl transition-all ${
            currentTab === 'PARLIAMENT'
              ? 'text-saffron font-bold scale-105'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <Landmark size={18} className={currentTab === 'PARLIAMENT' ? 'stroke-[2.5]' : 'stroke-2'} />
          <span className="text-[10px] mt-0.5">{t.nav.parliament}</span>
        </button>
      )}

      {/* 4. Party (or Government/PM if PM) */}
      {!isPM ? (
        <button
          onClick={() => handleTabClick('PARTY')}
          className={`flex flex-col items-center justify-center flex-1 py-1 rounded-xl transition-all ${
            currentTab === 'PARTY'
              ? 'text-saffron font-bold scale-105'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <Flag size={18} className={currentTab === 'PARTY' ? 'stroke-[2.5]' : 'stroke-2'} />
          <span className="text-[10px] mt-0.5">{t.nav.party}</span>
        </button>
      ) : (
        <button
          onClick={() => handleTabClick('GOVERNMENT')}
          className={`flex flex-col items-center justify-center flex-1 py-1 rounded-xl transition-all ${
            currentTab === 'GOVERNMENT'
              ? 'text-saffron font-bold scale-105'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <Crown size={18} className={currentTab === 'GOVERNMENT' ? 'stroke-[2.5]' : 'stroke-2'} />
          <span className="text-[10px] mt-0.5">{t.nav.government}</span>
        </button>
      )}

      {/* 5. Civics Quiz */}
      <button
        onClick={() => handleTabClick('QUIZ')}
        className={`flex flex-col items-center justify-center flex-1 py-1 rounded-xl transition-all ${
          currentTab === 'QUIZ'
            ? 'text-saffron font-bold scale-105'
            : 'text-slate-400 hover:text-slate-200'
        }`}
      >
        <BookOpen size={18} className={currentTab === 'QUIZ' ? 'stroke-[2.5]' : 'stroke-2'} />
        <span className="text-[10px] mt-0.5">{t.nav.quiz}</span>
      </button>

      {/* 6. Profile / Ladder */}
      <button
        onClick={() => handleTabClick('PROFILE')}
        className={`flex flex-col items-center justify-center flex-1 py-1 rounded-xl transition-all ${
          currentTab === 'PROFILE'
            ? 'text-saffron font-bold scale-105'
            : 'text-slate-400 hover:text-slate-200'
        }`}
      >
        <User size={18} className={currentTab === 'PROFILE' ? 'stroke-[2.5]' : 'stroke-2'} />
        <span className="text-[10px] mt-0.5">{t.nav.profile}</span>
      </button>
    </nav>
  );
};
