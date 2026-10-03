import React, { useState } from 'react';
import { Landmark, ArrowLeft, Check, X, Users, Sparkles, MessageSquare, Award } from 'lucide-react';
import { ParliamentBill } from '../../types/parliament';
import { useI18n } from '../../locales/i18n';
import { sound } from '../../audio/soundEffects';

interface ParliamentScreenProps {
  onBack: () => void;
  govSeats: number;
}

const SAMPLE_BILLS: ParliamentBill[] = [
  {
    id: 'bill_1',
    titleHi: 'राष्ट्रीय डिजिटल शिक्षा व छात्रवृत्ति विधेयक 2026',
    titleEn: 'National Digital Education & Scholarship Bill',
    descHi: 'प्रत्येक ग्रामीण विद्यालय को हाई-स्पीड इंटरनेट, स्मार्ट क्लासरूम और 10 लाख मेधावी निर्धन छात्रों को मासिक ₹2,000 की छात्रवृत्ति।',
    descEn: 'Connect every rural school with high-speed fiber, smart labs, and monthly stipends for underprivileged scholars.',
    proposer: 'GOVERNMENT',
    ministry: 'EDUCATION',
    publicImpactHi: 'युवा वर्ग में भारी उत्साह (+15%), ग्रामीण साक्षरता में उछाल',
    publicImpactEn: 'Massive surge in youth support (+15%), rural literacy spike',
    economicCost: 150000,
    requiredMajority: 272,
    govVoteSupport: 285,
    oppVoteSupport: 220,
    status: 'PENDING',
  },
  {
    id: 'bill_2',
    titleHi: 'समेकित कृषि बुनियादी ढांचा व न्यूनतम समर्थन संरक्षण विधेयक',
    titleEn: 'Integrated Agricultural Infrastructure & Market Security Bill',
    descHi: 'प्रत्येक ब्लॉक में कोल्ड स्टोरेज चेन, आधुनिक अनाज साइलो और उपज की त्वरित खरीद की कानूनी गारंटी।',
    descEn: 'Mandates cold-chain logistics in every sub-district and fast-track crop procurement centers.',
    proposer: 'GOVERNMENT',
    ministry: 'AGRICULTURE',
    publicImpactHi: 'किसान वर्ग का प्रचंड विश्वास (+20%), बिचौलियों पर अंकुश',
    publicImpactEn: 'Massive farmer support (+20%), curbs middleman exploitation',
    economicCost: 220000,
    requiredMajority: 272,
    govVoteSupport: 278,
    oppVoteSupport: 245,
    status: 'PENDING',
  }
];

export const ParliamentScreen: React.FC<ParliamentScreenProps> = ({ onBack, govSeats }) => {
  const { language, t } = useI18n();
  const [bills, setBills] = useState<ParliamentBill[]>(SAMPLE_BILLS);
  const [votingBill, setVotingBill] = useState<ParliamentBill | null>(null);
  const [voteStage, setVoteStage] = useState<'IDLE' | 'VOTING' | 'RESULT'>('IDLE');
  const [ayes, setAyes] = useState<number>(0);
  const [noes, setNoes] = useState<number>(0);
  const [whipActive, setWhipActive] = useState<boolean>(false);
  const [lobbyingDone, setLobbyingDone] = useState<boolean>(false);

  const handleToggleWhip = () => {
    sound.playSelect();
    setWhipActive(!whipActive);
  };

  const handleLobbyIndependents = () => {
    sound.playSuccess();
    setLobbyingDone(true);
  };

  const handleStartDivision = (bill: ParliamentBill) => {
    sound.playGavel();
    setVotingBill(bill);
    setVoteStage('VOTING');

    // Electronic division simulation
    setTimeout(() => {
      let whipBonus = whipActive ? 14 : 0;
      let lobbyBonus = lobbyingDone ? 8 : 0;
      const finalAyes = bill.govVoteSupport + whipBonus + lobbyBonus + Math.floor(Math.random() * 6 - 2);
      const finalNoes = bill.oppVoteSupport + Math.floor(Math.random() * 6 - 3);
      setAyes(finalAyes);
      setNoes(finalNoes);
      setVoteStage('RESULT');

      if (finalAyes >= bill.requiredMajority) {
        sound.playVictory();
        setBills(prev => prev.map(b => b.id === bill.id ? { ...b, status: 'PASSED' } : b));
      } else {
        sound.playCrisis();
        setBills(prev => prev.map(b => b.id === bill.id ? { ...b, status: 'REJECTED' } : b));
      }
    }, 2000);
  };

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
              {t.parliament.lokSabha}
            </h2>
            <span className="text-[10px] text-slate-400">संसद भवन • संसद सत्र जारी</span>
          </div>
        </div>

        {/* Majority Indicator */}
        <div className="px-3 py-1 rounded-xl bg-navy-900 border border-slate-700 text-right">
          <span className="text-[9px] text-slate-400 block">सत्तारूढ़ शक्ति</span>
          <span className="text-xs font-black text-emerald-400">{govSeats} / 543 सीटें</span>
        </div>
      </div>

      {/* Lok Sabha Chamber Overview Card */}
      <div className="bg-gradient-to-br from-navy-900 via-navy-900 to-[#07172e] p-4 rounded-3xl border border-slate-800 shadow-xl text-center relative overflow-hidden">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/15 border border-amber-500/30 text-amber-400 text-xs font-bold mb-2">
          <Landmark size={14} />
          <span>{t.parliament.totalSeats}</span>
        </div>
        <p className="text-xs text-slate-300 max-w-xs mx-auto leading-relaxed">
          {language === 'hi' 
            ? 'लोकतंत्र का सर्वोच्च मंदिर। यहाँ प्रस्तुत विधेयक कानून बनकर देश के 140 करोड़ नागरिकों का भविष्य तय करते हैं।'
            : 'The supreme temple of democracy. Bills enacted here shape the destiny of 1.4 billion citizens.'}
        </p>
      </div>

      {/* Parliamentary Strategy & Whip Controls */}
      <div className="grid grid-cols-2 gap-2">
        <button
          onClick={handleToggleWhip}
          className={`p-2.5 rounded-2xl border text-xs font-bold transition-all flex items-center justify-center space-x-1.5 ${
            whipActive
              ? 'bg-amber-500/20 border-amber-400 text-amber-300 shadow-md'
              : 'bg-navy-900 border-slate-800 text-slate-400 hover:text-slate-200'
          }`}
        >
          <span>📜 {whipActive ? 'तीन-लाइन व्हिप सक्रिय' : 'तीन-लाइन व्हिप जारी करें'}</span>
        </button>

        <button
          onClick={handleLobbyIndependents}
          disabled={lobbyingDone}
          className={`p-2.5 rounded-2xl border text-xs font-bold transition-all flex items-center justify-center space-x-1.5 ${
            lobbyingDone
              ? 'bg-emerald-500/20 border-emerald-500/40 text-emerald-400'
              : 'bg-navy-900 border-slate-800 text-slate-400 hover:text-slate-200'
          }`}
        >
          <span>🤝 {lobbyingDone ? 'निर्दलीय समर्थन प्राप्त (+8)' : 'निर्दलीय सांसदों से संपर्क'}</span>
        </button>
      </div>

      {/* Legislative Bills List */}
      <div className="space-y-3 flex-1">
        <div className="flex items-center justify-between">
          <span className="text-xs font-black uppercase tracking-wider text-slate-300">
            विचाराधीन विधेयक (PROPOSED BILLS)
          </span>
          <span className="text-[10px] text-amber-400 font-bold">कार्यवाही क्रम</span>
        </div>

        {bills.map((bill) => (
          <div
            key={bill.id}
            className="p-3.5 rounded-2xl bg-navy-900/80 border border-slate-800 shadow-lg space-y-2.5"
          >
            <div className="flex items-start justify-between gap-2">
              <div>
                <span className="text-[10px] font-black text-sky-400 uppercase tracking-wide block">
                  {bill.ministry}
                </span>
                <h4 className="text-xs font-black text-white">
                  {language === 'hi' ? bill.titleHi : bill.titleEn}
                </h4>
              </div>

              {bill.status === 'PASSED' ? (
                <span className="px-2.5 py-0.5 rounded-full bg-emerald-950 text-emerald-300 font-black text-[10px] border border-emerald-700 flex items-center gap-1">
                  <Check size={12} />
                  <span>पारित (ENACTED)</span>
                </span>
              ) : bill.status === 'REJECTED' ? (
                <span className="px-2.5 py-0.5 rounded-full bg-rose-950 text-rose-300 font-black text-[10px] border border-rose-700 flex items-center gap-1">
                  <X size={12} />
                  <span>निरस्त (DEFEATED)</span>
                </span>
              ) : (
                <button
                  onClick={() => handleStartDivision(bill)}
                  className="px-3 py-1.5 rounded-xl bg-saffron text-navy-950 text-xs font-black hover:brightness-105 active:scale-95 transition-all shadow"
                >
                  मतदान कराएं
                </button>
              )}
            </div>

            <p className="text-[11px] text-slate-300 leading-snug">
              {language === 'hi' ? bill.descHi : bill.descEn}
            </p>

            <div className="p-2 rounded-xl bg-navy-950 text-[10px] text-emerald-400 font-medium">
              ★ प्रभाव: {language === 'hi' ? bill.publicImpactHi : bill.publicImpactEn}
            </div>
          </div>
        ))}
      </div>

      {/* Electronic Division Voting Modal / Drawer */}
      {voteStage !== 'IDLE' && votingBill && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-3 animate-fadeIn">
          <div className="w-full max-w-sm bg-navy-900 border border-amber-500/50 rounded-3xl p-5 shadow-2xl text-center space-y-4">
            <div className="w-12 h-12 rounded-full bg-amber-500/20 text-amber-400 flex items-center justify-center mx-auto border border-amber-500/30">
              <Landmark size={24} />
            </div>

            <div>
              <span className="text-[10px] font-black uppercase text-amber-400 tracking-wider">
                इलेक्ट्रॉनिक विभाजन मतदान • DIVISION
              </span>
              <h3 className="text-sm font-bold text-white mt-1">
                {language === 'hi' ? votingBill.titleHi : votingBill.titleEn}
              </h3>
            </div>

            {voteStage === 'VOTING' ? (
              <div className="py-6 space-y-2">
                <div className="text-xs font-black text-slate-300 animate-pulse">
                  संसद सदस्य इलेक्ट्रॉनिक बटन दबा रहे हैं...
                </div>
                <div className="w-48 h-2 bg-slate-800 rounded-full mx-auto overflow-hidden">
                  <div className="h-full bg-saffron animate-shimmer rounded-full"></div>
                </div>
              </div>
            ) : (
              <div className="space-y-3 py-2 animate-fadeIn">
                <div className="grid grid-cols-2 gap-3 text-center">
                  <div className="p-3 rounded-2xl bg-emerald-950/80 border border-emerald-700">
                    <span className="text-[10px] text-emerald-300 block font-bold">AYES (पक्ष में)</span>
                    <span className="text-2xl font-black text-white">{ayes}</span>
                  </div>
                  <div className="p-3 rounded-2xl bg-rose-950/80 border border-rose-700">
                    <span className="text-[10px] text-rose-300 block font-bold">NOES (विपक्ष में)</span>
                    <span className="text-2xl font-black text-white">{noes}</span>
                  </div>
                </div>

                <div className="text-xs font-black pt-1">
                  {ayes >= votingBill.requiredMajority ? (
                    <span className="text-emerald-400">{t.parliament.passed}</span>
                  ) : (
                    <span className="text-rose-400">{t.parliament.rejected}</span>
                  )}
                </div>

                <button
                  onClick={() => setVoteStage('IDLE')}
                  className="w-full py-2.5 bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs rounded-xl transition-all"
                >
                  सदन की कार्यवाही जारी रखें
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
