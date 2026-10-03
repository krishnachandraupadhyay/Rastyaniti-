import React, { useRef } from 'react';
import { Home, MapPin, Flag, Megaphone, Landmark, BookOpen, User, Crown, ChevronRight, ChevronLeft } from 'lucide-react';
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
  const navScrollRef = useRef<HTMLDivElement>(null);

  const handleTabClick = (tab: NavTab) => {
    sound.playClick();
    onSelectTab(tab);
  };

  const navItems: { tab: NavTab; labelHi: string; labelEn: string; icon: React.FC<{ size?: number; className?: string }>; isSpecial?: boolean }[] = [
    { tab: 'HOME', labelHi: 'मुख्य मेनू', labelEn: 'Home', icon: Home },
    { tab: 'MAP', labelHi: 'मानचित्र', labelEn: 'Map', icon: MapPin },
    { tab: 'CAMPAIGN', labelHi: 'चुनाव प्रचार', labelEn: 'Campaign', icon: Megaphone },
    { tab: 'PARTY', labelHi: 'पार्टी संगठन', labelEn: 'Party', icon: Flag },
    { tab: isPM ? 'GOVERNMENT' : 'PARLIAMENT', labelHi: isPM ? 'PM सरकार' : 'संसद', labelEn: isPM ? 'PM Govt' : 'Parliament', icon: isPM ? Crown : Landmark, isSpecial: isPM },
    { tab: 'QUIZ', labelHi: 'संविधान क्विज़', labelEn: 'Civics Quiz', icon: BookOpen },
    { tab: 'PROFILE', labelHi: 'प्रोफ़ाइल', labelEn: 'Profile', icon: User },
  ];

  return (
    <nav className="sticky bottom-0 z-30 bg-navy-950/95 backdrop-blur-xl border-t border-slate-800/90 py-1.5 px-2 shadow-2xl relative">
      {/* Scrollable Navigation Track */}
      <div 
        ref={navScrollRef}
        className="flex items-center overflow-x-auto no-scrollbar scroll-smooth gap-1.5 px-1 w-full touch-pan-x"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        {navItems.map((item) => {
          const isActive = currentTab === item.tab;
          const Icon = item.icon;
          return (
            <button
              key={item.tab}
              onClick={() => handleTabClick(item.tab)}
              className={`flex-shrink-0 min-w-[76px] py-1.5 px-2.5 rounded-2xl flex flex-col items-center justify-center transition-all duration-200 select-none ${
                isActive
                  ? 'bg-gradient-to-b from-saffron/25 to-amber-500/10 border border-saffron/60 text-saffron shadow-lg scale-105'
                  : 'text-slate-400 hover:text-slate-100 hover:bg-white/5 border border-transparent'
              }`}
            >
              <div className="relative">
                <Icon
                  size={23}
                  className={`transition-transform duration-200 ${
                    isActive ? 'stroke-[2.5] scale-110 text-saffron' : 'stroke-[1.8]'
                  }`}
                />
                {item.isSpecial && (
                  <span className="absolute -top-1 -right-1.5 w-2 h-2 rounded-full bg-amber-400 animate-pulse"></span>
                )}
              </div>
              <span
                className={`text-xs mt-1 text-center whitespace-nowrap tracking-tight transition-all ${
                  isActive ? 'font-black text-saffron' : 'font-semibold text-slate-300'
                }`}
              >
                {item.labelHi}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};
