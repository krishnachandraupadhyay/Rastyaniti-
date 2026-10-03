import React from 'react';
import { X, ShieldCheck, AlertOctagon, Scale, CheckCircle2 } from 'lucide-react';
import { useI18n } from '../../locales/i18n';
import { sound } from '../../audio/soundEffects';

interface ElectionCommissionModalProps {
  onClose: () => void;
}

export const ElectionCommissionModal: React.FC<ElectionCommissionModalProps> = ({ onClose }) => {
  const { language, t } = useI18n();

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-3 animate-fadeIn">
      <div className="w-full max-w-md bg-navy-900 border border-emerald-500/40 rounded-3xl p-5 shadow-2xl flex flex-col max-h-[85vh] relative overflow-hidden">
        {/* Top green emblem bar */}
        <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-emerald-500 via-tiranga-green to-emerald-500"></div>

        {/* Modal Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-3">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
              <Scale size={20} />
            </div>
            <div>
              <span className="text-[10px] font-black uppercase tracking-wider text-emerald-400">
                संवैधानिक संस्था • INDEPENDENT BODY
              </span>
              <h3 className="text-sm font-black text-white">
                {t.eci.title}
              </h3>
            </div>
          </div>

          <button
            onClick={() => {
              sound.playClick();
              onClose();
            }}
            className="p-1.5 rounded-full text-slate-400 hover:text-white hover:bg-white/10"
          >
            <X size={18} />
          </button>
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto space-y-3 pr-1 text-xs">
          {/* Status banner */}
          <div className="p-3 rounded-2xl bg-emerald-950/60 border border-emerald-800/60 flex items-center gap-2.5 text-emerald-300">
            <ShieldCheck size={20} className="flex-shrink-0" />
            <div>
              <span className="font-bold block">{t.eci.codeOfConduct}</span>
              <span className="text-[10px] text-emerald-400/90">सभी दलों व प्रत्याशियों पर समान रूप से लागू</span>
            </div>
          </div>

          {/* Core Mandates */}
          <div className="bg-navy-950/80 p-3 rounded-2xl border border-slate-800 space-y-2">
            <h4 className="font-bold text-slate-200 flex items-center gap-1.5 text-xs">
              <CheckCircle2 size={14} className="text-emerald-400" />
              <span>मुख्य चुनाव दिशा-निर्देश:</span>
            </h4>
            <ul className="list-disc list-inside space-y-1 text-slate-300 text-[11px] leading-relaxed">
              <li><strong>व्यय सीमा (Spending Limit):</strong> प्रत्येक प्रत्याशी के लिए अधिकतम ₹95 लाख निर्धारित।</li>
              <li><strong>शुचिता व निष्पक्षता:</strong> किसी भी प्रकार का प्रलोभन या नकदी वितरण पाए जाने पर उम्मीदवारी रद्द हो सकती है।</li>
              <li><strong>समान अवसर:</strong> सरकारी तंत्र या वाहनों का चुनावी लाभ हेतु उपयोग प्रतिबंधित।</li>
              <li><strong>पारदर्शी मतगणना:</strong> EVM व VVPAT पर्चियों का मिलान अनिवार्य।</li>
            </ul>
          </div>

          {/* Ethics statement */}
          <p className="text-[11px] text-slate-400 italic bg-navy-950/50 p-2.5 rounded-xl border border-slate-800/80">
            {t.eci.guidelines}
          </p>
        </div>

        {/* Close button */}
        <button
          onClick={() => {
            sound.playClick();
            onClose();
          }}
          className="mt-4 w-full py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold transition-all"
        >
          {language === 'hi' ? 'नियम स्वीकारें' : 'Acknowledge Guidelines'}
        </button>
      </div>
    </div>
  );
};
