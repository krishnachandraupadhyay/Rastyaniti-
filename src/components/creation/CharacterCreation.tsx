import React, { useState } from 'react';
import { User, Plus, Minus, ArrowRight, Award, Compass, Sparkles } from 'lucide-react';
import { PlayerProfile, PlayerStats } from '../../types/game';
import { INDIA_STATES } from '../../engine/initialData';
import { useI18n } from '../../locales/i18n';
import { sound } from '../../audio/soundEffects';

interface CharacterCreationProps {
  onComplete: (profile: PlayerProfile) => void;
}

export const CharacterCreation: React.FC<CharacterCreationProps> = ({ onComplete }) => {
  const { language, t } = useI18n();

  const [name, setName] = useState('देवराज चौहान');
  const [age, setAge] = useState<number>(32);
  const [gender, setGender] = useState<'MALE' | 'FEMALE' | 'OTHER'>('MALE');
  const [state, setState] = useState('Uttar Pradesh');
  const [district, setDistrict] = useState('वाराणसी (Varanasi)');
  const [constituency, setConstituency] = useState('काशीपुर (Kashipur)');
  const [education, setEducation] = useState('विधि स्नातक (LL.B.) व जनसंचार');
  const [occupation, setOccupation] = useState('सामाजिक कार्यकर्ता व युवा प्रेरक');
  const [experience, setExperience] = useState('छात्र राजनीति व नागरिक अधिकार मंच');

  // Skill points allocation pool
  const [poolPoints, setPoolPoints] = useState<number>(20);
  const [stats, setStats] = useState<PlayerStats>({
    leadership: 50,
    communication: 55,
    politicalKnowledge: 52,
    publicTrust: 60,
    strategy: 48,
    administration: 45,
    finance: 42,
    crisisManagement: 48,
  });

  const handleStatChange = (key: keyof PlayerStats, delta: number) => {
    sound.playClick();
    if (delta > 0 && poolPoints <= 0) return;
    if (delta < 0 && stats[key] <= 30) return;

    setStats(prev => ({
      ...prev,
      [key]: prev[key] + delta,
    }));
    setPoolPoints(prev => prev - delta);
  };

  const handleProceed = () => {
    sound.playSelect();
    const profile: PlayerProfile = {
      name: name.trim() || 'देवराज चौहान',
      age,
      gender,
      state,
      district,
      constituency,
      education,
      occupation,
      background: experience,
      stats,
      resources: {
        money: 150000,
        partyFunds: 0,
        workers: 50,
        volunteers: 250,
        influence: 25,
        energy: 100,
      },
      level: 1,
      positionTitle: 'आम नागरिक',
      positionTitleEn: 'Common Citizen',
    };
    onComplete(profile);
  };

  return (
    <div className="flex-1 overflow-y-auto p-4 bg-navy-950 text-slate-100 flex flex-col">
      {/* Header */}
      <div className="text-center mb-4">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-saffron/15 border border-saffron/30 text-saffron text-xs font-bold mb-1">
          <User size={14} />
          <span>चरण 1: {t.charCreation.title}</span>
        </div>
        <h2 className="text-xl font-black font-display text-white">
          {language === 'hi' ? 'अपनी राजनीतिक यात्रा की नींव रखें' : 'Build Your Political Foundation'}
        </h2>
        <p className="text-xs text-slate-400">
          {t.charCreation.subtitle}
        </p>
      </div>

      {/* Basic Profile Form */}
      <div className="bg-navy-900/70 p-4 rounded-3xl border border-slate-800 space-y-3 mb-4 shadow-lg">
        {/* Name */}
        <div>
          <label className="text-xs font-bold text-slate-300 block mb-1">
            {t.charCreation.nameLabel}
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full px-3 py-2 rounded-xl bg-navy-950 border border-slate-700 text-sm text-white focus:outline-none focus:border-saffron"
            placeholder="नाम लिखें..."
          />
        </div>

        {/* Age & Gender */}
        <div className="grid grid-cols-2 gap-2">
          <div>
            <label className="text-xs font-bold text-slate-300 block mb-1">
              {t.charCreation.ageLabel}
            </label>
            <input
              type="number"
              value={age}
              min={25}
              max={75}
              onChange={(e) => setAge(parseInt(e.target.value) || 25)}
              className="w-full px-3 py-2 rounded-xl bg-navy-950 border border-slate-700 text-sm text-white focus:outline-none focus:border-saffron"
            />
          </div>

          <div>
            <label className="text-xs font-bold text-slate-300 block mb-1">
              {t.charCreation.genderLabel}
            </label>
            <div className="grid grid-cols-3 gap-1">
              {(['MALE', 'FEMALE', 'OTHER'] as const).map((g) => (
                <button
                  key={g}
                  type="button"
                  onClick={() => {
                    sound.playClick();
                    setGender(g);
                  }}
                  className={`py-2 rounded-lg text-xs font-bold transition-all border ${
                    gender === g
                      ? 'bg-saffron text-navy-950 border-saffron'
                      : 'bg-navy-950 text-slate-400 border-slate-700 hover:text-white'
                  }`}
                >
                  {g === 'MALE' ? t.charCreation.male : g === 'FEMALE' ? t.charCreation.female : t.charCreation.other}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* State & Constituency */}
        <div className="grid grid-cols-2 gap-2">
          <div>
            <label className="text-xs font-bold text-slate-300 block mb-1">
              {t.charCreation.stateLabel}
            </label>
            <select
              value={state}
              onChange={(e) => setState(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-navy-950 border border-slate-700 text-xs text-white focus:outline-none focus:border-saffron"
            >
              {INDIA_STATES.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-xs font-bold text-slate-300 block mb-1">
              {t.charCreation.constituencyLabel}
            </label>
            <input
              type="text"
              value={constituency}
              onChange={(e) => setConstituency(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-navy-950 border border-slate-700 text-xs text-white focus:outline-none focus:border-saffron"
            />
          </div>
        </div>

        {/* Education & Occupation */}
        <div className="grid grid-cols-2 gap-2">
          <div>
            <label className="text-xs font-bold text-slate-300 block mb-1">
              {t.charCreation.educationLabel}
            </label>
            <input
              type="text"
              value={education}
              onChange={(e) => setEducation(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-navy-950 border border-slate-700 text-xs text-white focus:outline-none focus:border-saffron"
            />
          </div>

          <div>
            <label className="text-xs font-bold text-slate-300 block mb-1">
              {t.charCreation.occupationLabel}
            </label>
            <input
              type="text"
              value={occupation}
              onChange={(e) => setOccupation(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-navy-950 border border-slate-700 text-xs text-white focus:outline-none focus:border-saffron"
            />
          </div>
        </div>
      </div>

      {/* Skill Points Distribution */}
      <div className="bg-navy-900/70 p-4 rounded-3xl border border-slate-800 space-y-2 mb-4 shadow-lg">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-1.5">
            <Award size={16} className="text-amber-400" />
            <h3 className="text-xs font-black uppercase tracking-wider text-slate-200">
              {language === 'hi' ? 'राजनीतिक दक्षता व क्षमताएं' : 'Leadership Capabilities'}
            </h3>
          </div>
          <div className="px-2.5 py-0.5 rounded-full bg-saffron/20 border border-saffron/40 text-saffron text-xs font-black">
            {t.charCreation.distributePoints} <span className="underline">{poolPoints}</span>)
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {(Object.keys(stats) as Array<keyof PlayerStats>).map((key) => (
            <div
              key={key}
              className="flex items-center justify-between p-2 rounded-xl bg-navy-950/70 border border-slate-800"
            >
              <div className="min-w-0 pr-2">
                <span className="text-xs font-semibold text-slate-300 block truncate">
                  {t.stats[key]}
                </span>
                <span className="text-[10px] text-slate-500 capitalize">{key}</span>
              </div>

              <div className="flex items-center gap-2 flex-shrink-0">
                <button
                  type="button"
                  onClick={() => handleStatChange(key, -1)}
                  disabled={stats[key] <= 30}
                  className="w-6 h-6 rounded-md bg-navy-800 text-slate-300 hover:text-white flex items-center justify-center disabled:opacity-30 border border-slate-700"
                >
                  <Minus size={12} />
                </button>
                <span className="w-7 text-center font-bold text-xs text-amber-300">
                  {stats[key]}
                </span>
                <button
                  type="button"
                  onClick={() => handleStatChange(key, 1)}
                  disabled={poolPoints <= 0}
                  className="w-6 h-6 rounded-md bg-navy-800 text-saffron hover:bg-saffron hover:text-navy-950 flex items-center justify-center disabled:opacity-30 border border-slate-700 transition-colors"
                >
                  <Plus size={12} />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom Proceed Button */}
      <button
        onClick={handleProceed}
        className="w-full py-3.5 px-6 rounded-2xl bg-gradient-to-r from-saffron to-amber-500 text-navy-950 font-black text-sm uppercase tracking-wider flex items-center justify-center gap-2 shadow-xl hover:brightness-110 active:scale-95 transition-all mt-auto"
      >
        <Sparkles size={16} />
        <span>{t.charCreation.createButton}</span>
        <ArrowRight size={16} />
      </button>
    </div>
  );
};
