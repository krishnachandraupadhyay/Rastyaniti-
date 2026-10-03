import React, { useState } from 'react';
import { User, Award, Save, Download, Upload, CheckCircle2, RotateCcw, Shield, Sparkles } from 'lucide-react';
import { PlayerProfile, PoliticalParty, Achievement, PoliticalLevel } from '../../types/game';
import { useI18n } from '../../locales/i18n';
import { sound } from '../../audio/soundEffects';

interface ProfileScreenProps {
  player: PlayerProfile;
  party: PoliticalParty | null;
  achievements: Achievement[];
  onManualSave: () => void;
  onResetGame: () => void;
}

export const ProfileScreen: React.FC<ProfileScreenProps> = ({
  player,
  party,
  achievements,
  onManualSave,
  onResetGame,
}) => {
  const { language, t } = useI18n();
  const [activeTab, setActiveTab] = useState<'LADDER' | 'ACHIEVEMENTS' | 'SETTINGS'>('LADDER');
  const [saveMessage, setSaveMessage] = useState<string | null>(null);

  const handleSave = () => {
    sound.playSelect();
    onManualSave();
    setSaveMessage(language === 'hi' ? 'प्रगति सुरक्षित हो गई!' : 'Game saved successfully!');
    setTimeout(() => setSaveMessage(null), 2500);
  };

  const levelsList: { lvl: PoliticalLevel; hi: string; en: string }[] = [
    { lvl: 1, hi: 'आम नागरिक', en: 'Common Citizen' },
    { lvl: 2, hi: 'पार्टी संस्थापक', en: 'Party Founder' },
    { lvl: 3, hi: 'स्थानीय प्रत्याशी', en: 'Local Candidate' },
    { lvl: 4, hi: 'जनप्रतिनिधि (विधायक)', en: 'Elected Representative (MLA)' },
    { lvl: 5, hi: 'राज्य स्तरीय नेता', en: 'State-Level Politician' },
    { lvl: 6, hi: 'विधानसभा चुनाव', en: 'State Election Leader' },
    { lvl: 7, hi: 'राष्ट्रीय प्रचारक', en: 'National Campaigner' },
    { lvl: 8, hi: 'लोकसभा सांसद (MP)', en: 'Member of Parliament (MP)' },
    { lvl: 9, hi: 'सरकार गठन व बहुमत', en: 'Majority & Govt Formation' },
    { lvl: 10, hi: 'भारत के प्रधानमंत्री', en: 'Prime Minister of Bharat' },
    { lvl: 11, hi: 'राष्ट्रीय सुशासन व सुधार', en: 'National Governance & Reforms' },
    { lvl: 12, hi: 'पुनः जनादेश (आम चुनाव)', en: 'Next General Mandate Defense' },
  ];

  return (
    <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-navy-950 text-slate-100 flex flex-col">
      {/* Profile Banner */}
      <div className="bg-gradient-to-r from-navy-900 via-navy-900 to-[#10243e] p-4 rounded-3xl border border-slate-800 shadow-xl flex items-center gap-3.5">
        <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-saffron to-amber-500 text-navy-950 flex items-center justify-center font-black text-xl shadow-lg flex-shrink-0">
          {player.name.charAt(0)}
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-1.5 mb-0.5">
            <span className="px-2 py-0.2 rounded-full bg-saffron text-navy-950 text-[10px] font-black uppercase">
              स्तर {player.level}
            </span>
            <span className="text-xs font-bold text-amber-300 truncate">
              {language === 'hi' ? t.levels[player.level] : player.positionTitleEn}
            </span>
          </div>
          <h3 className="text-base font-black text-white truncate">{player.name}</h3>
          <p className="text-[11px] text-slate-400 truncate">
            {party ? party.name : 'निर्दलीय'} • {player.constituency}
          </p>
        </div>
      </div>

      {/* Sub Tabs */}
      <div className="grid grid-cols-3 gap-1 bg-navy-900 p-1 rounded-2xl border border-slate-800">
        <button
          onClick={() => {
            sound.playClick();
            setActiveTab('LADDER');
          }}
          className={`py-2 rounded-xl text-xs font-bold transition-all ${
            activeTab === 'LADDER' ? 'bg-saffron text-navy-950 shadow' : 'text-slate-400 hover:text-white'
          }`}
        >
          12-चरण यात्रा
        </button>

        <button
          onClick={() => {
            sound.playClick();
            setActiveTab('ACHIEVEMENTS');
          }}
          className={`py-2 rounded-xl text-xs font-bold transition-all ${
            activeTab === 'ACHIEVEMENTS' ? 'bg-saffron text-navy-950 shadow' : 'text-slate-400 hover:text-white'
          }`}
        >
          उपलब्धियां
        </button>

        <button
          onClick={() => {
            sound.playClick();
            setActiveTab('SETTINGS');
          }}
          className={`py-2 rounded-xl text-xs font-bold transition-all ${
            activeTab === 'SETTINGS' ? 'bg-saffron text-navy-950 shadow' : 'text-slate-400 hover:text-white'
          }`}
        >
          सेव व सेटिंग्स
        </button>
      </div>

      {/* Content for Tabs */}
      {activeTab === 'LADDER' && (
        <div className="space-y-2 flex-1">
          {levelsList.map((item) => {
            const isCompleted = player.level > item.lvl;
            const isCurrent = player.level === item.lvl;

            return (
              <div
                key={item.lvl}
                className={`p-3 rounded-2xl border flex items-center justify-between transition-all ${
                  isCurrent
                    ? 'bg-navy-900 border-saffron shadow-lg ring-1 ring-saffron/80'
                    : isCompleted
                    ? 'bg-navy-950/80 border-emerald-800/60 text-emerald-300'
                    : 'bg-navy-950/40 border-slate-900 opacity-50'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className={`w-7 h-7 rounded-xl flex items-center justify-center font-black text-xs ${
                    isCurrent ? 'bg-saffron text-navy-950' : isCompleted ? 'bg-emerald-500 text-navy-950' : 'bg-slate-800 text-slate-500'
                  }`}>
                    {item.lvl}
                  </div>
                  <div>
                    <h4 className="text-xs font-black text-white">
                      {language === 'hi' ? item.hi : item.en}
                    </h4>
                    <span className="text-[10px] text-slate-400">
                      {item.lvl <= 4 ? 'स्थानीय शासन' : item.lvl <= 8 ? 'संसदीय राजनीति' : 'राष्ट्रीय नेतृत्व'}
                    </span>
                  </div>
                </div>

                {isCurrent && (
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-saffron/20 text-saffron font-bold border border-saffron/40 animate-pulse">
                    वर्तमान पद
                  </span>
                )}
                {isCompleted && (
                  <CheckCircle2 size={16} className="text-emerald-400" />
                )}
              </div>
            );
          })}
        </div>
      )}

      {activeTab === 'ACHIEVEMENTS' && (
        <div className="space-y-2.5 flex-1">
          {achievements.map((ach) => (
            <div
              key={ach.id}
              className={`p-3.5 rounded-2xl border flex items-center gap-3 transition-all ${
                ach.unlocked
                  ? 'bg-navy-900/80 border-amber-500/50 shadow-md'
                  : 'bg-navy-950/50 border-slate-900 opacity-50'
              }`}
            >
              <div className={`w-10 h-10 rounded-2xl flex items-center justify-center ${
                ach.unlocked ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30' : 'bg-slate-800 text-slate-500'
              }`}>
                <Award size={20} />
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="text-xs font-black text-white">
                  {language === 'hi' ? ach.titleHi : ach.titleEn}
                </h4>
                <p className="text-[11px] text-slate-400 leading-snug">
                  {language === 'hi' ? ach.descHi : ach.descEn}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}

      {activeTab === 'SETTINGS' && (
        <div className="space-y-3 flex-1">
          <div className="p-4 rounded-2xl bg-navy-900 border border-slate-800 space-y-3">
            <h4 className="text-xs font-black text-white uppercase tracking-wider">
              गेम डेटा प्रबंधन (SAVE & RESTORE)
            </h4>

            <button
              onClick={handleSave}
              className="w-full py-3 px-4 rounded-xl bg-saffron text-navy-950 font-black text-xs uppercase flex items-center justify-center gap-2 shadow hover:brightness-105 transition-all"
            >
              <Save size={16} />
              <span>प्रगति सहेजें (Save Game Now)</span>
            </button>

            {saveMessage && (
              <div className="text-center text-xs text-emerald-400 font-bold animate-fadeIn">
                ✓ {saveMessage}
              </div>
            )}

            <button
              onClick={() => {
                if (window.confirm(language === 'hi' ? 'क्या आप शुरू से पुनः खेल शुरू करना चाहते हैं?' : 'Reset game from start?')) {
                  onResetGame();
                }
              }}
              className="w-full py-2.5 px-4 rounded-xl bg-rose-950/70 border border-rose-800 text-rose-300 font-bold text-xs flex items-center justify-center gap-1.5 hover:bg-rose-900/60 transition-all mt-4"
            >
              <RotateCcw size={14} />
              <span>खेल रीसेट करें (New Game)</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
