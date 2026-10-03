import React, { useState } from 'react';
import { ArrowLeft, PieChart, Check, Sparkles, AlertCircle } from 'lucide-react';
import { BudgetAllocation } from '../../types/parliament';
import { useI18n } from '../../locales/i18n';
import { sound } from '../../audio/soundEffects';

interface BudgetScreenProps {
  currentBudget: BudgetAllocation;
  onBack: () => void;
  onApplyBudget: (budget: BudgetAllocation) => void;
}

export const BudgetScreen: React.FC<BudgetScreenProps> = ({
  currentBudget,
  onBack,
  onApplyBudget,
}) => {
  const { language, t } = useI18n();
  const [budget, setBudget] = useState<BudgetAllocation>({ ...currentBudget });

  const total = Object.values(budget).reduce((a, b) => a + b, 0);

  const handleSlider = (key: keyof BudgetAllocation, val: number) => {
    setBudget(prev => ({
      ...prev,
      [key]: val,
    }));
  };

  const handleSave = () => {
    sound.playCoin();
    onApplyBudget(budget);
    onBack();
  };

  const categories: { key: keyof BudgetAllocation; hi: string; en: string; color: string }[] = [
    { key: 'education', hi: 'शिक्षा व कौशल', en: 'Education & Skills', color: '#38BDF8' },
    { key: 'healthcare', hi: 'स्वास्थ्य व चिकित्सा', en: 'Healthcare & Pharma', color: '#34D399' },
    { key: 'infrastructure', hi: 'सड़क, रेल व राजमार्ग', en: 'Infrastructure & Highways', color: '#FBBF24' },
    { key: 'agriculture', hi: 'कृषि, सिंचाई व किसान', en: 'Agriculture & Irrigation', color: '#4ADE80' },
    { key: 'technology', hi: 'डिजिटल भारत व AI', en: 'Technology & AI', color: '#A78BFA' },
    { key: 'defence', hi: 'राष्ट्रीय सुरक्षा व रक्षा', en: 'National Defence', color: '#F87171' },
    { key: 'environment', hi: 'हरित ऊर्जा व पर्यावरण', en: 'Clean Energy & Forest', color: '#2DD4BF' },
    { key: 'socialWelfare', hi: 'सामाजिक न्याय व पेंशन', en: 'Social Welfare & Pension', color: '#FB923C' },
    { key: 'homeAffairs', hi: 'आंतरिक कानून व्यवस्था', en: 'Internal Security & Police', color: '#E879F9' },
  ];

  return (
    <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-navy-950 text-slate-100 flex flex-col">
      {/* Top Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              sound.playClick();
              onBack();
            }}
            className="p-1.5 rounded-xl bg-navy-900 border border-slate-700 text-slate-300 hover:text-white"
          >
            <ArrowLeft size={16} />
          </button>
          <div>
            <h2 className="text-lg font-black font-display text-white">
              {t.pm.budget}
            </h2>
            <span className="text-[10px] text-slate-400">वार्षिक केंद्रीय बजट आवंटन</span>
          </div>
        </div>

        {/* Total percentage badge */}
        <div className={`px-3 py-1 rounded-xl text-xs font-black border ${
          total === 100
            ? 'bg-emerald-950 text-emerald-300 border-emerald-500'
            : 'bg-rose-950 text-rose-300 border-rose-500 animate-pulse'
        }`}>
          कुल: {total}% / 100%
        </div>
      </div>

      {total !== 100 && (
        <div className="p-2.5 rounded-xl bg-rose-950/70 border border-rose-800 text-xs text-rose-300 flex items-center gap-2">
          <AlertCircle size={16} className="flex-shrink-0" />
          <span>बजट आवंटन का कुल योग 100% होना अनिवार्य है (वर्तमान: {total}%)</span>
        </div>
      )}

      {/* Sliders List */}
      <div className="space-y-3 flex-1">
        {categories.map((cat) => (
          <div key={cat.key} className="p-3 rounded-2xl bg-navy-900/80 border border-slate-800 shadow-md">
            <div className="flex justify-between items-center text-xs mb-1.5">
              <span className="font-bold text-slate-200 flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full inline-block" style={{ backgroundColor: cat.color }}></span>
                <span>{language === 'hi' ? cat.hi : cat.en}</span>
              </span>
              <span className="font-black text-amber-300 text-sm">
                {budget[cat.key]}%
              </span>
            </div>
            <input
              type="range"
              min={2}
              max={35}
              value={budget[cat.key]}
              onChange={(e) => handleSlider(cat.key, parseInt(e.target.value) || 0)}
              className="w-full accent-saffron bg-navy-950 h-2 rounded-lg cursor-pointer"
            />
          </div>
        ))}
      </div>

      {/* Save Button */}
      <button
        onClick={handleSave}
        disabled={total !== 100}
        className="w-full py-3.5 px-4 rounded-xl bg-gradient-to-r from-emerald-500 via-tiranga-green to-emerald-600 text-white font-black text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-xl disabled:opacity-40 disabled:cursor-not-allowed hover:brightness-105 active:scale-95 transition-all"
      >
        <Check size={16} />
        <span>बजट संसद में पारित करें (Enact Union Budget)</span>
      </button>
    </div>
  );
};
