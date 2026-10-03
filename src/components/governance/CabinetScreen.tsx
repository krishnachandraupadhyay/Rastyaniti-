import React, { useState } from 'react';
import { ArrowLeft, UserCheck, RefreshCw, Award, Check, Sparkles } from 'lucide-react';
import type { Minister } from '../../types/parliament';
import { INITIAL_CABINET } from '../../engine/initialData';
import { INITIAL_PARTY_MEMBERS, PartyMember } from '../../engine/partyMemberEngine';
import { useI18n } from '../../locales/i18n';
import { sound } from '../../audio/soundEffects';

interface CabinetScreenProps {
  onBack: () => void;
}

export const CabinetScreen: React.FC<CabinetScreenProps> = ({ onBack }) => {
  const { language, t } = useI18n();

  const [cabinet, setCabinet] = useState<Minister[]>(() => {
    const saved = localStorage.getItem('rn_cabinet');
    return saved ? JSON.parse(saved) : INITIAL_CABINET;
  });

  const [members] = useState<PartyMember[]>(() => {
    const saved = localStorage.getItem('rn_party_members');
    return saved ? JSON.parse(saved) : INITIAL_PARTY_MEMBERS;
  });

  const [reshuffleTarget, setReshuffleTarget] = useState<Minister | null>(null);

  const handleAppointMinister = (member: PartyMember) => {
    if (!reshuffleTarget) return;
    sound.playSuccess();

    const updatedMinister: Minister = {
      ...reshuffleTarget,
      name: member.name,
      competence: Math.min(100, Math.round((member.stats.administration + member.stats.politicalKnowledge) / 2)),
      integrity: Math.min(100, Math.round(member.stats.loyalty * 0.9 + 10)),
      loyalty: member.stats.loyalty,
    };

    const newCabinet = cabinet.map((m) => (m.id === reshuffleTarget.id ? updatedMinister : m));
    setCabinet(newCabinet);
    localStorage.setItem('rn_cabinet', JSON.stringify(newCabinet));
    setReshuffleTarget(null);
  };

  return (
    <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-navy-950 text-slate-100 flex flex-col pb-16">
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
            <h2 className="text-base font-black font-display text-white flex items-center space-x-1.5">
              <span>{t.pm.cabinet}</span>
              <Sparkles size={14} className="text-amber-400" />
            </h2>
            <span className="text-[10px] text-slate-400">केंद्रीय मंत्रिपरिषद, विभाग आवंटन व फेरबदल</span>
          </div>
        </div>

        <span className="px-2.5 py-1 rounded-full bg-amber-500/20 text-amber-400 text-[10px] font-black border border-amber-500/30">
          कैबिनेट स्तर
        </span>
      </div>

      {/* Ministers List */}
      <div className="space-y-3 flex-1">
        {cabinet.map((min) => (
          <div
            key={min.id}
            className="p-4 rounded-2xl bg-navy-900/80 border border-slate-800 shadow-lg space-y-3"
          >
            <div className="flex items-start justify-between gap-2">
              <div>
                <span className="text-[10px] font-black text-amber-400 uppercase tracking-wide block">
                  {language === 'hi' ? min.ministryTitleHi : min.ministryTitleEn}
                </span>
                <h4 className="text-sm font-black text-white">{min.name}</h4>
              </div>

              <button
                onClick={() => {
                  sound.playSelect();
                  setReshuffleTarget(min);
                }}
                className="px-2.5 py-1 rounded-xl bg-navy-950 hover:bg-slate-800 text-amber-300 border border-amber-500/30 text-[10px] font-bold flex items-center space-x-1 transition-all"
              >
                <RefreshCw size={11} />
                <span>फेरबदल (Reassign)</span>
              </button>
            </div>

            {/* Minister Attributes */}
            <div className="grid grid-cols-3 gap-2 text-center text-[10px] bg-navy-950/80 p-2 rounded-xl border border-slate-800/80">
              <div>
                <span className="text-slate-400 block">कार्यकुशलता</span>
                <span className="font-bold text-sky-400">{min.competence}%</span>
              </div>
              <div>
                <span className="text-slate-400 block">सत्यनिष्ठा</span>
                <span className="font-bold text-emerald-400">{min.integrity}%</span>
              </div>
              <div>
                <span className="text-slate-400 block">पार्टी निष्ठा</span>
                <span className="font-bold text-amber-400">{min.loyalty}%</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Reassign / Appoint Modal */}
      {reshuffleTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-navy-950/85 backdrop-blur-md">
          <div className="w-full max-w-md bg-navy-900 border border-amber-500/50 rounded-3xl p-4 shadow-2xl flex flex-col max-h-[85vh]">
            <div className="flex justify-between items-center border-b border-slate-800 pb-3">
              <div>
                <h3 className="text-sm font-black text-white">मंत्री पद हेतु पार्टी नेता चुनें</h3>
                <span className="text-xs text-amber-400">
                  प्रभार: {language === 'hi' ? reshuffleTarget.ministryTitleHi : reshuffleTarget.ministryTitleEn}
                </span>
              </div>
              <button
                onClick={() => setReshuffleTarget(null)}
                className="text-slate-400 hover:text-white text-xs font-bold px-2 py-1 bg-slate-800 rounded-lg"
              >
                रद्द करें
              </button>
            </div>

            <div className="overflow-y-auto space-y-2 py-3 flex-1">
              {members.map((mem) => (
                <div
                  key={mem.id}
                  onClick={() => handleAppointMinister(mem)}
                  className="p-3 bg-navy-950/80 border border-slate-800 hover:border-amber-400 rounded-2xl cursor-pointer flex items-center justify-between transition-all"
                >
                  <div className="flex items-center space-x-2.5">
                    <span className="text-xl">{mem.avatar}</span>
                    <div>
                      <h4 className="text-xs font-bold text-white">{mem.name}</h4>
                      <span className="text-[10px] text-slate-400 block">{mem.specialty}</span>
                    </div>
                  </div>
                  <div className="text-right text-[10px]">
                    <span className="text-sky-400 block">प्रशासन: {mem.stats.administration}%</span>
                    <span className="text-amber-400 font-bold">निष्ठा: {mem.stats.loyalty}%</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
