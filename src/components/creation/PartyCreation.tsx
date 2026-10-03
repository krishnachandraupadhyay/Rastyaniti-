import React, { useState } from 'react';
import { Flag, Sparkles, ArrowRight, Check, Sun, Shield, Flame, Compass, Heart, TreePine, Award, Scale, Feather } from 'lucide-react';
import { PoliticalParty, PartyPriority } from '../../types/game';
import { useI18n } from '../../locales/i18n';
import { sound } from '../../audio/soundEffects';

interface PartyCreationProps {
  onComplete: (party: PoliticalParty) => void;
}

const SYMBOL_OPTIONS = [
  { id: 'Sun', labelHi: 'उगता सूर्य', labelEn: 'Rising Sun', icon: Sun },
  { id: 'Flame', labelHi: 'मशाल', labelEn: 'Torch of Truth', icon: Flame },
  { id: 'Tree', labelHi: 'एकता का वृक्ष', labelEn: 'Banyan Tree', icon: TreePine },
  { id: 'Shield', labelHi: 'सुरक्षा ढाल', labelEn: 'Guardian Shield', icon: Shield },
  { id: 'Scale', labelHi: 'न्याय तराजू', labelEn: 'Scales of Justice', icon: Scale },
  { id: 'Feather', labelHi: 'ज्ञान लेखनी', labelEn: 'Pen of Reform', icon: Feather },
  { id: 'Compass', labelHi: 'प्रगति चक्र', labelEn: 'Wheel of Progress', icon: Compass },
  { id: 'Heart', labelHi: 'जन सेवा', labelEn: 'Heart of Seva', icon: Heart },
];

const COLOR_OPTIONS = [
  { hex: '#FF671F', name: 'Saffron Orange' },
  { hex: '#046A38', name: 'Emerald Green' },
  { hex: '#0284C7', name: 'Ocean Sky' },
  { hex: '#9333EA', name: 'Royal Purple' },
  { hex: '#E11D48', name: 'Crimson Red' },
  { hex: '#D97706', name: 'Imperial Gold' },
  { hex: '#0D9488', name: 'Teal Cyan' },
  { hex: '#4F46E5', name: 'Indigo Blue' },
];

const ALL_PRIORITIES: { id: PartyPriority; hi: string; en: string }[] = [
  { id: 'EMPLOYMENT', hi: 'युवा रोजगार व उद्योग', en: 'Employment & Industry' },
  { id: 'EDUCATION', hi: 'गुणवत्तापूर्ण शिक्षा', en: 'Quality Education' },
  { id: 'HEALTHCARE', hi: 'सस्ती व सुलभ स्वास्थ्य सेवा', en: 'Accessible Healthcare' },
  { id: 'AGRICULTURE', hi: 'कृषि संवर्धन व किसान कल्याण', en: 'Agriculture & Farmers' },
  { id: 'INFRASTRUCTURE', hi: 'आधुनिक बुनियादी ढांचा', en: 'Modern Infrastructure' },
  { id: 'TECHNOLOGY', hi: 'डिजिटल क्रांति व AI', en: 'Technology & AI' },
  { id: 'ENVIRONMENT', hi: 'पर्यावरण व हरित ऊर्जा', en: 'Green Energy' },
  { id: 'ECONOMY', hi: 'मजबूत अर्थव्यवस्था व व्यापार', en: 'Economic Reforms' },
  { id: 'SOCIAL_WELFARE', hi: 'सामाजिक न्याय व अंत्योदय', en: 'Social Welfare' },
];

export const PartyCreation: React.FC<PartyCreationProps> = ({ onComplete }) => {
  const { language, t } = useI18n();

  const [partyName, setPartyName] = useState('जन स्वराज्य पार्टी');
  const [shortName, setShortName] = useState('JSP');
  const [slogan, setSlogan] = useState('जनता का राज, सबके लिए विकास');
  const [selectedSymbol, setSelectedSymbol] = useState('Flame');
  const [selectedColor, setSelectedColor] = useState('#FF671F');
  const [ideology, setIdeology] = useState('प्रगतिशील लोकतंत्र व सुशासन (Good Governance)');
  const [priorities, setPriorities] = useState<PartyPriority[]>(['EMPLOYMENT', 'EDUCATION', 'AGRICULTURE']);

  const togglePriority = (p: PartyPriority) => {
    sound.playClick();
    if (priorities.includes(p)) {
      if (priorities.length > 1) {
        setPriorities(priorities.filter(item => item !== p));
      }
    } else {
      if (priorities.length < 3) {
        setPriorities([...priorities, p]);
      }
    }
  };

  const handleRegister = () => {
    sound.playRally();
    const party: PoliticalParty = {
      name: partyName.trim() || 'जन स्वराज्य पार्टी',
      shortName: shortName.trim().toUpperCase() || 'JSP',
      slogan: slogan.trim() || 'जनता का राज, सबके लिए विकास',
      symbol: selectedSymbol,
      color: selectedColor,
      description: ideology,
      ideology,
      priorities,
      popularity: 35,
      offices: 1,
      readiness: 40,
    };
    onComplete(party);
  };

  const CurrentSymbolIcon = SYMBOL_OPTIONS.find(s => s.id === selectedSymbol)?.icon || Flame;

  return (
    <div className="flex-1 overflow-y-auto p-4 bg-navy-950 text-slate-100 flex flex-col">
      {/* Header */}
      <div className="text-center mb-4">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-tiranga-green/20 border border-tiranga-green/40 text-emerald-300 text-xs font-bold mb-1">
          <Flag size={14} />
          <span>चरण 2: {t.partyCreation.title}</span>
        </div>
        <h2 className="text-xl font-black font-display text-white">
          {language === 'hi' ? 'अपने राजनीतिक आंदोलन की शुरुआत' : 'Found Your Political Movement'}
        </h2>
        <p className="text-xs text-slate-400">
          {t.partyCreation.subtitle}
        </p>
      </div>

      {/* Flag / Symbol Live Preview Card */}
      <div className="bg-gradient-to-br from-navy-900 via-navy-900 to-navy-950 p-4 rounded-3xl border border-slate-800 shadow-xl mb-4 flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div
            className="w-14 h-14 rounded-2xl flex items-center justify-center text-white shadow-lg border-2 border-white/20 transition-all transform hover:scale-105"
            style={{ backgroundColor: selectedColor }}
          >
            <CurrentSymbolIcon size={28} />
          </div>

          <div>
            <div className="flex items-center gap-1.5">
              <h3 className="text-base font-black text-white">{partyName || 'पार्टी का नाम'}</h3>
              <span
                className="px-1.5 py-0.2 rounded text-[10px] font-black text-white"
                style={{ backgroundColor: selectedColor }}
              >
                {shortName || 'CODE'}
              </span>
            </div>
            <p className="text-xs text-amber-300 italic mt-0.5">
              "{slogan || 'पार्टी का मुख्य नारा'}"
            </p>
          </div>
        </div>

        <div className="text-right flex-shrink-0">
          <span className="text-[10px] text-slate-400 block">निर्वाचन दर्जा</span>
          <span className="text-xs font-bold text-emerald-400">पंजीकृत (दल)</span>
        </div>
      </div>

      {/* Form Details */}
      <div className="bg-navy-900/70 p-4 rounded-3xl border border-slate-800 space-y-3 mb-4 shadow-lg">
        {/* Party Name & Short Name */}
        <div className="grid grid-cols-3 gap-2">
          <div className="col-span-2">
            <label className="text-xs font-bold text-slate-300 block mb-1">
              {t.partyCreation.partyNameLabel}
            </label>
            <input
              type="text"
              value={partyName}
              onChange={(e) => setPartyName(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-navy-950 border border-slate-700 text-sm text-white focus:outline-none focus:border-saffron"
            />
          </div>

          <div>
            <label className="text-xs font-bold text-slate-300 block mb-1">
              {t.partyCreation.shortNameLabel}
            </label>
            <input
              type="text"
              maxLength={5}
              value={shortName}
              onChange={(e) => setShortName(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-navy-950 border border-slate-700 text-sm font-bold text-center text-white focus:outline-none focus:border-saffron uppercase"
            />
          </div>
        </div>

        {/* Slogan */}
        <div>
          <label className="text-xs font-bold text-slate-300 block mb-1">
            {t.partyCreation.sloganLabel}
          </label>
          <input
            type="text"
            value={slogan}
            onChange={(e) => setSlogan(e.target.value)}
            className="w-full px-3 py-2 rounded-xl bg-navy-950 border border-slate-700 text-xs text-white focus:outline-none focus:border-saffron"
          />
        </div>

        {/* Election Symbol Picker */}
        <div>
          <label className="text-xs font-bold text-slate-300 block mb-1">
            {t.partyCreation.symbolLabel}
          </label>
          <div className="grid grid-cols-4 gap-2">
            {SYMBOL_OPTIONS.map((sym) => {
              const IconComp = sym.icon;
              const isSel = selectedSymbol === sym.id;
              return (
                <button
                  key={sym.id}
                  type="button"
                  onClick={() => {
                    sound.playClick();
                    setSelectedSymbol(sym.id);
                  }}
                  className={`p-2 rounded-xl flex flex-col items-center justify-center gap-1 border transition-all ${
                    isSel
                      ? 'bg-navy-800 text-saffron border-saffron shadow-md scale-105'
                      : 'bg-navy-950/80 text-slate-400 border-slate-800 hover:text-white'
                  }`}
                >
                  <IconComp size={20} />
                  <span className="text-[10px] truncate max-w-full font-medium">
                    {language === 'hi' ? sym.labelHi : sym.labelEn}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Party Color Palette */}
        <div>
          <label className="text-xs font-bold text-slate-300 block mb-1">
            {t.partyCreation.colorLabel}
          </label>
          <div className="flex items-center gap-2 overflow-x-auto py-1">
            {COLOR_OPTIONS.map((c) => (
              <button
                key={c.hex}
                type="button"
                onClick={() => {
                  sound.playClick();
                  setSelectedColor(c.hex);
                }}
                className="w-8 h-8 rounded-full flex-shrink-0 flex items-center justify-center transition-transform hover:scale-110 shadow-md relative"
                style={{ backgroundColor: c.hex }}
              >
                {selectedColor === c.hex && (
                  <Check size={16} className="text-white drop-shadow-md stroke-[3]" />
                )}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Priorities (Select 3) */}
      <div className="bg-navy-900/70 p-4 rounded-3xl border border-slate-800 space-y-2 mb-4 shadow-lg">
        <div className="flex items-center justify-between mb-1">
          <label className="text-xs font-bold text-slate-300">
            {t.partyCreation.prioritiesLabel}
          </label>
          <span className="text-[11px] font-black text-amber-400">
            {priorities.length}/3
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
          {ALL_PRIORITIES.map((p) => {
            const isChecked = priorities.includes(p.id);
            return (
              <button
                key={p.id}
                type="button"
                onClick={() => togglePriority(p.id)}
                className={`p-2.5 rounded-xl text-left text-xs font-bold flex items-center justify-between border transition-all ${
                  isChecked
                    ? 'bg-saffron/15 text-saffron border-saffron/50'
                    : 'bg-navy-950 text-slate-400 border-slate-800 hover:text-white'
                }`}
              >
                <span>{language === 'hi' ? p.hi : p.en}</span>
                {isChecked && <Check size={14} className="text-saffron flex-shrink-0" />}
              </button>
            );
          })}
        </div>
      </div>

      {/* Register Party Button */}
      <button
        onClick={handleRegister}
        className="w-full py-3.5 px-6 rounded-2xl bg-gradient-to-r from-saffron to-amber-500 text-navy-950 font-black text-sm uppercase tracking-wider flex items-center justify-center gap-2 shadow-xl hover:brightness-110 active:scale-95 transition-all mt-auto"
      >
        <Sparkles size={16} />
        <span>{t.partyCreation.createButton}</span>
        <ArrowRight size={16} />
      </button>
    </div>
  );
};
