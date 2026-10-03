import React from 'react';
import { Crown, TrendingUp, DollarSign, Activity, Users, Landmark, PieChart, ArrowRight } from 'lucide-react';
import type { NationalMetrics } from '../../types/parliament';
import type { PlayerProfile, PoliticalParty } from '../../types/game';
import { useI18n } from '../../locales/i18n';
import { sound } from '../../audio/soundEffects';

interface PMDashboardProps {
  metrics: NationalMetrics;
  player: PlayerProfile;
  party: PoliticalParty | null;
  onOpenBudget: () => void;
  onOpenParliament: () => void;
  onOpenCabinet: () => void;
  onOpenPolicies: () => void;
  onOpenCoalition: () => void;
}

export const PMDashboard: React.FC<PMDashboardProps> = ({
  metrics,
  player,
  party,
  onOpenBudget,
  onOpenParliament,
  onOpenCabinet,
  onOpenPolicies,
  onOpenCoalition,
}) => {
  const { language, t } = useI18n();

  return (
    <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-navy-950 text-slate-100 flex flex-col">
      {/* Prime Minister Header Card */}
      <div className="bg-gradient-to-r from-amber-600/30 via-navy-900 to-navy-900 p-4 rounded-3xl border border-amber-500/40 shadow-xl relative overflow-hidden">
        <div className="flex items-start justify-between gap-3 relative z-10">
          <div>
            <div className="flex items-center gap-1.5 mb-1">
              <span className="p-1 rounded-lg bg-amber-500 text-navy-950">
                <Crown size={14} />
              </span>
              <span className="text-[10px] font-black uppercase tracking-widest text-amber-400">
                {language === 'hi' ? 'प्रधानमंत्री कार्यालय (PMO)' : "PRIME MINISTER'S OFFICE"}
              </span>
            </div>
            <h2 className="text-xl font-black font-display text-white">
              {player.name}
            </h2>
            <p className="text-xs text-slate-400">
              {language === 'hi' ? 'भारत के 15वें प्रधानमंत्री • जनादेश कार्यकाल' : 'Prime Minister of Bharat • Union Cabinet Head'}
            </p>
          </div>

          <div className="p-2.5 rounded-2xl bg-navy-950/80 border border-slate-800 text-right">
            <span className="text-[10px] text-slate-400 block">{t.pm.approval}</span>
            <span className="text-lg font-black text-amber-400">{metrics.publicApproval}%</span>
          </div>
        </div>
      </div>

      {/* Key Economic Indicators Grid */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-xs font-black uppercase tracking-wider text-slate-300">
            {t.pm.nationalMetrics}
          </span>
          <span className="text-[10px] text-emerald-400 font-bold">● स्वस्थ अर्थव्यवस्था (Stable)</span>
        </div>

        <div className="grid grid-cols-2 gap-2.5">
          {/* GDP Growth */}
          <div className="p-3 rounded-2xl bg-navy-900/80 border border-slate-800 shadow-md">
            <div className="flex justify-between items-center mb-1">
              <span className="text-[10px] text-slate-400">{t.pm.gdp}</span>
              <TrendingUp size={14} className="text-emerald-400" />
            </div>
            <div className="text-base font-black text-emerald-300">+{metrics.gdpGrowthRate}%</div>
            <span className="text-[9px] text-slate-500">वार्षिक अनुमानित वृद्धि</span>
          </div>

          {/* Inflation Rate */}
          <div className="p-3 rounded-2xl bg-navy-900/80 border border-slate-800 shadow-md">
            <div className="flex justify-between items-center mb-1">
              <span className="text-[10px] text-slate-400">{t.pm.inflation}</span>
              <Activity size={14} className="text-rose-400" />
            </div>
            <div className="text-base font-black text-rose-300">{metrics.inflationRate}%</div>
            <span className="text-[9px] text-slate-500">खुदरा मुद्रास्फीति दर</span>
          </div>

          {/* Unemployment */}
          <div className="p-3 rounded-2xl bg-navy-900/80 border border-slate-800 shadow-md">
            <div className="flex justify-between items-center mb-1">
              <span className="text-[10px] text-slate-400">{t.pm.unemployment}</span>
              <Users size={14} className="text-amber-400" />
            </div>
            <div className="text-base font-black text-amber-300">{metrics.unemploymentRate}%</div>
            <span className="text-[9px] text-slate-500">सक्रिय श्रम भागीदारी</span>
          </div>

          {/* Fiscal Deficit */}
          <div className="p-3 rounded-2xl bg-navy-900/80 border border-slate-800 shadow-md">
            <div className="flex justify-between items-center mb-1">
              <span className="text-[10px] text-slate-400">राजकोषीय घाटा</span>
              <DollarSign size={14} className="text-sky-400" />
            </div>
            <div className="text-base font-black text-sky-300">{metrics.fiscalDeficit}%</div>
            <span className="text-[9px] text-slate-500">GDP का प्रतिशत</span>
          </div>
        </div>
      </div>

      {/* Governance Portals (Budget / Parliament / Cabinet) */}
      <div className="space-y-2.5 pt-2">
        <span className="text-xs font-black uppercase tracking-wider text-slate-300 block">
          शासकीय नियंत्रण केंद्र (GOVERNANCE SUITE)
        </span>

        {/* 1. National Budget Allocation */}
        <div
          onClick={() => {
            sound.playClick();
            onOpenBudget();
          }}
          className="p-3.5 rounded-2xl bg-navy-900/80 hover:bg-navy-900 border border-slate-800 hover:border-saffron/60 cursor-pointer transition-all flex items-center justify-between group shadow-lg"
        >
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-emerald-500/20 text-emerald-400 group-hover:scale-110 transition-transform">
              <PieChart size={20} />
            </div>
            <div>
              <h4 className="text-xs font-black text-white">{t.pm.budget}</h4>
              <p className="text-[10px] text-slate-400">शिक्षा, स्वास्थ्य, कृषि व रक्षा बजट निर्धारित करें</p>
            </div>
          </div>
          <ArrowRight size={16} className="text-slate-400 group-hover:text-saffron transition-colors" />
        </div>

        {/* 2. Parliament & Legislative Bills */}
        <div
          onClick={() => {
            sound.playClick();
            onOpenParliament();
          }}
          className="p-3.5 rounded-2xl bg-navy-900/80 hover:bg-navy-900 border border-slate-800 hover:border-saffron/60 cursor-pointer transition-all flex items-center justify-between group shadow-lg"
        >
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-sky-500/20 text-sky-400 group-hover:scale-110 transition-transform">
              <Landmark size={20} />
            </div>
            <div>
              <h4 className="text-xs font-black text-white">{t.pm.parliament}</h4>
              <p className="text-[10px] text-slate-400">विधेयक पेश करें, बहस करें व इलेक्ट्रॉनिक मतदान कराएं</p>
            </div>
          </div>
          <ArrowRight size={16} className="text-slate-400 group-hover:text-saffron transition-colors" />
        </div>

        {/* 3. Council of Ministers */}
        <div
          onClick={() => {
            sound.playClick();
            onOpenCabinet();
          }}
          className="p-3.5 rounded-2xl bg-navy-900/80 hover:bg-navy-900 border border-slate-800 hover:border-saffron/60 cursor-pointer transition-all flex items-center justify-between group shadow-lg"
        >
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-purple-500/20 text-purple-400 group-hover:scale-110 transition-transform">
              <Users size={20} />
            </div>
            <div>
              <h4 className="text-xs font-black text-white">{t.pm.cabinet}</h4>
              <p className="text-[10px] text-slate-400">मंत्रालयों के प्रभार, पार्टी नेता व मंत्री आवंटन</p>
            </div>
          </div>
          <ArrowRight size={16} className="text-slate-400 group-hover:text-saffron transition-colors" />
        </div>

        {/* 4. National Policies & Flagship Schemes */}
        <div
          onClick={() => {
            sound.playClick();
            onOpenPolicies();
          }}
          className="p-3.5 rounded-2xl bg-navy-900/80 hover:bg-navy-900 border border-slate-800 hover:border-saffron/60 cursor-pointer transition-all flex items-center justify-between group shadow-lg"
        >
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-amber-500/20 text-amber-400 group-hover:scale-110 transition-transform">
              <TrendingUp size={20} />
            </div>
            <div>
              <h4 className="text-xs font-black text-white">राष्ट्रीय नीतियां व प्रमुख योजनाएं</h4>
              <p className="text-[10px] text-slate-400">किसान समृद्धि, डिजिटल भारत व स्वास्थ्य सुधार लागू करें</p>
            </div>
          </div>
          <ArrowRight size={16} className="text-slate-400 group-hover:text-saffron transition-colors" />
        </div>

        {/* 5. Coalition Negotiation & 272 Majority Room */}
        <div
          onClick={() => {
            sound.playClick();
            onOpenCoalition();
          }}
          className="p-3.5 rounded-2xl bg-navy-900/80 hover:bg-navy-900 border border-slate-800 hover:border-saffron/60 cursor-pointer transition-all flex items-center justify-between group shadow-lg"
        >
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-rose-500/20 text-rose-400 group-hover:scale-110 transition-transform">
              <Landmark size={20} />
            </div>
            <div>
              <h4 className="text-xs font-black text-white">गठबंधन वार्ता कक्ष (272 Majority Room)</h4>
              <p className="text-[10px] text-slate-400">क्षेत्रीय दलों से गठबंधन, मंत्रालय हिस्सेदारी व साझा कार्यक्रम</p>
            </div>
          </div>
          <ArrowRight size={16} className="text-slate-400 group-hover:text-saffron transition-colors" />
        </div>
      </div>
    </div>
  );
};
