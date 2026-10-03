import React, { useState } from 'react';
import { ArrowLeft, CheckCircle2, TrendingUp, Shield, Cpu, Heart, Truck, SunMedium, Sparkles } from 'lucide-react';
import { NationalMetrics } from '../../types/parliament';
import { FLAGSHIP_POLICIES, NationalPolicy, PolicyCategory, PolicyEngine } from '../../engine/policyEngine';
import { sound } from '../../audio/soundEffects';

interface PolicyScreenProps {
  metrics: NationalMetrics;
  onUpdateMetrics: (newMetrics: NationalMetrics) => void;
  onBack: () => void;
}

export const PolicyScreen: React.FC<PolicyScreenProps> = ({
  metrics,
  onUpdateMetrics,
  onBack,
}) => {
  const [policies, setPolicies] = useState<NationalPolicy[]>(() => {
    const saved = localStorage.getItem('rn_policies');
    return saved ? JSON.parse(saved) : FLAGSHIP_POLICIES;
  });

  const [selectedCat, setSelectedCat] = useState<PolicyCategory | 'ALL'>('ALL');
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  const filterPolicies = policies.filter(
    (p) => selectedCat === 'ALL' || p.category === selectedCat
  );

  const handleEnact = (policy: NationalPolicy) => {
    sound.playSuccess();
    const { updatedPolicy, updatedMetrics } = PolicyEngine.enactPolicy(policy, metrics);
    const newPolicies = policies.map((p) => (p.id === policy.id ? updatedPolicy : p));
    setPolicies(newPolicies);
    localStorage.setItem('rn_policies', JSON.stringify(newPolicies));
    onUpdateMetrics(updatedMetrics);

    setToastMsg(`नीति लागू: "${policy.titleHi}" को आधिकारिक स्वीकृति मिली!`);
    setTimeout(() => setToastMsg(null), 3500);
  };

  const getCatIcon = (cat: PolicyCategory) => {
    switch (cat) {
      case 'AGRICULTURE': return '🌾';
      case 'TECHNOLOGY': return <Cpu size={16} className="text-cyan-400" />;
      case 'HEALTHCARE': return <Heart size={16} className="text-rose-400" />;
      case 'DEFENCE': return <Shield size={16} className="text-amber-400" />;
      case 'GREEN_ENERGY': return <SunMedium size={16} className="text-emerald-400" />;
      case 'INFRASTRUCTURE': return <Truck size={16} className="text-orange-400" />;
      default: return <TrendingUp size={16} className="text-sky-400" />;
    }
  };

  return (
    <div className="flex flex-col h-full bg-navy-950 text-slate-100 animate-fade-in pb-16">
      {/* Top Bar */}
      <div className="p-4 bg-navy-900/90 border-b border-slate-800 flex items-center justify-between sticky top-0 z-20 backdrop-blur-md">
        <button
          onClick={() => {
            sound.playClick();
            onBack();
          }}
          className="p-2 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-200 transition-colors flex items-center space-x-1"
        >
          <ArrowLeft size={18} />
          <span className="text-xs font-bold">वापस (Back)</span>
        </button>
        <div className="text-center">
          <h1 className="text-sm font-black text-white flex items-center justify-center space-x-1.5">
            <Sparkles size={16} className="text-amber-400" />
            <span>राष्ट्रीय प्रमुख नीतियां (National Policies)</span>
          </h1>
          <p className="text-[10px] text-slate-400">केंद्रीय मंत्रिमंडल नीतिगत सुधार मंच</p>
        </div>
        <div className="w-16 text-right">
          <span className="text-[10px] bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 px-2 py-0.5 rounded-full font-bold">
            सक्रिय: {policies.filter((p) => p.isEnacted).length}
          </span>
        </div>
      </div>

      {/* Real-time Economic Dashboard */}
      <div className="p-4 bg-navy-900/40 border-b border-slate-800">
        <div className="grid grid-cols-4 gap-2 text-center">
          <div className="p-2 rounded-xl bg-navy-900/80 border border-slate-800">
            <span className="text-[10px] text-slate-400 block">GDP वृद्धि</span>
            <span className="text-xs font-black text-emerald-400">+{metrics.gdpGrowthRate}%</span>
          </div>
          <div className="p-2 rounded-xl bg-navy-900/80 border border-slate-800">
            <span className="text-[10px] text-slate-400 block">मुद्रास्फीति</span>
            <span className="text-xs font-black text-amber-400">{metrics.inflationRate}%</span>
          </div>
          <div className="p-2 rounded-xl bg-navy-900/80 border border-slate-800">
            <span className="text-[10px] text-slate-400 block">बेरोजगारी</span>
            <span className="text-xs font-black text-sky-400">{metrics.unemploymentRate}%</span>
          </div>
          <div className="p-2 rounded-xl bg-navy-900/80 border border-slate-800">
            <span className="text-[10px] text-slate-400 block">जनसमर्थन</span>
            <span className="text-xs font-black text-saffron">{metrics.publicApproval}%</span>
          </div>
        </div>
      </div>

      {/* Category Pills */}
      <div className="p-3 flex space-x-2 overflow-x-auto no-scrollbar border-b border-slate-800/80">
        {(['ALL', 'AGRICULTURE', 'TECHNOLOGY', 'HEALTHCARE', 'DEFENCE', 'GREEN_ENERGY', 'INFRASTRUCTURE'] as const).map(
          (cat) => (
            <button
              key={cat}
              onClick={() => {
                sound.playClick();
                setSelectedCat(cat);
              }}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                selectedCat === cat
                  ? 'bg-gradient-to-r from-saffron to-amber-500 text-navy-950 shadow-md scale-105'
                  : 'bg-navy-900 text-slate-400 hover:text-white border border-slate-800'
              }`}
            >
              {cat === 'ALL'
                ? 'सभी नीतियां'
                : cat === 'AGRICULTURE'
                ? 'कृषि'
                : cat === 'TECHNOLOGY'
                ? 'तकनीक व एआई'
                : cat === 'HEALTHCARE'
                ? 'स्वास्थ्य'
                : cat === 'DEFENCE'
                ? 'रक्षा'
                : cat === 'GREEN_ENERGY'
                ? 'हरित ऊर्जा'
                : 'बुनियादी ढांचा'}
            </button>
          )
        )}
      </div>

      {/* Notification Toast */}
      {toastMsg && (
        <div className="mx-4 mt-3 p-3 bg-emerald-950/80 border border-emerald-500/60 rounded-2xl text-xs font-bold text-emerald-300 flex items-center space-x-2 animate-slide-down">
          <CheckCircle2 size={16} className="text-emerald-400 flex-shrink-0" />
          <span>{toastMsg}</span>
        </div>
      )}

      {/* Policies List */}
      <div className="p-4 space-y-3 overflow-y-auto flex-1">
        {filterPolicies.map((pol) => (
          <div
            key={pol.id}
            className={`p-4 rounded-3xl border transition-all ${
              pol.isEnacted
                ? 'bg-emerald-950/20 border-emerald-500/40 shadow-inner'
                : 'bg-navy-900/80 border-slate-800 hover:border-slate-700'
            }`}
          >
            <div className="flex items-start justify-between">
              <div className="flex items-start space-x-2.5">
                <div className="p-2 rounded-2xl bg-slate-800/80 border border-slate-700 mt-0.5">
                  {getCatIcon(pol.category)}
                </div>
                <div>
                  <h3 className="text-xs font-black text-white">{pol.titleHi}</h3>
                  <span className="text-[10px] text-slate-400 block">{pol.titleEn}</span>
                </div>
              </div>
              {pol.isEnacted ? (
                <span className="bg-emerald-500/20 text-emerald-400 text-[10px] font-bold px-2 py-0.5 rounded-full border border-emerald-500/40 flex items-center space-x-1">
                  <CheckCircle2 size={10} />
                  <span>लागू (Active)</span>
                </span>
              ) : (
                <span className="bg-amber-500/20 text-amber-300 text-[10px] font-bold px-2 py-0.5 rounded-full border border-amber-500/30">
                  प्रस्तावित
                </span>
              )}
            </div>

            <p className="text-xs text-slate-300 mt-2 leading-relaxed">
              {pol.descHi}
            </p>

            {/* Impact Badges */}
            <div className="mt-3 grid grid-cols-3 gap-1.5 text-center text-[10px]">
              <div className="bg-navy-950/80 p-1.5 rounded-xl border border-slate-800">
                <span className="text-slate-400 block">GDP प्रभाव</span>
                <span className="font-black text-emerald-400">+{pol.gdpImpact}%</span>
              </div>
              <div className="bg-navy-950/80 p-1.5 rounded-xl border border-slate-800">
                <span className="text-slate-400 block">बेरोजगारी कमी</span>
                <span className="font-black text-sky-400">{pol.unemploymentImpact}%</span>
              </div>
              <div className="bg-navy-950/80 p-1.5 rounded-xl border border-slate-800">
                <span className="text-slate-400 block">जन-विश्वास</span>
                <span className="font-black text-saffron">+{pol.publicTrustGain} अंक</span>
              </div>
            </div>

            {/* Action Bar */}
            <div className="mt-3 pt-3 border-t border-slate-800/80 flex items-center justify-between">
              <span className="text-[11px] text-slate-400">
                बजट व्यय: <strong className="text-amber-400">₹{(pol.costCrores / 1000).toFixed(0)}K Cr</strong>
              </span>

              {!pol.isEnacted ? (
                <button
                  onClick={() => handleEnact(pol)}
                  className="px-4 py-2 rounded-xl bg-gradient-to-r from-saffron to-amber-500 text-navy-950 text-xs font-black shadow-md hover:brightness-110 active:scale-95 transition-all"
                >
                  नीति लागू करें (Enact Scheme)
                </button>
              ) : (
                <span className="text-[11px] font-bold text-emerald-400 flex items-center space-x-1">
                  <span>✓ राष्ट्रव्यापी प्रभावी</span>
                </span>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
