import React, { useState } from 'react';
import { X, Users, ShieldCheck, Award, Handshake, AlertTriangle, ChevronRight, Check } from 'lucide-react';
import { CoalitionPartner, REGIONAL_PARTNERS, CoalitionEngine } from '../../engine/coalitionEngine';
import { sound } from '../../audio/soundEffects';

interface CoalitionNegotiationModalProps {
  playerSeats: number;
  onClose: () => void;
  onAllianceFormed: (allies: CoalitionPartner[], totalSeats: number) => void;
}

export const CoalitionNegotiationModal: React.FC<CoalitionNegotiationModalProps> = ({
  playerSeats,
  onClose,
  onAllianceFormed,
}) => {
  const [partners, setPartners] = useState<CoalitionPartner[]>(REGIONAL_PARTNERS);
  const [selectedPartner, setSelectedPartner] = useState<CoalitionPartner | null>(null);

  // Negotiation toggles for current partner
  const [grantMinistries, setGrantMinistries] = useState(false);
  const [acceptCMP, setAcceptCMP] = useState(false);
  const [grantPackage, setGrantPackage] = useState(false);
  const [feedback, setFeedback] = useState<{ text: string; success: boolean } | null>(null);

  const allies = partners.filter((p) => p.joined);
  const totalSeats = CoalitionEngine.calculateTotalSeats(playerSeats, allies);
  const majorityReached = totalSeats >= 272;
  const stability = CoalitionEngine.calculateStability(allies);

  const handleSelectPartner = (p: CoalitionPartner) => {
    sound.playSelect();
    setSelectedPartner(p);
    setGrantMinistries(false);
    setAcceptCMP(false);
    setGrantPackage(false);
    setFeedback(null);
  };

  const handleNegotiate = () => {
    if (!selectedPartner) return;
    const res = CoalitionEngine.attemptNegotiation(
      selectedPartner,
      grantMinistries,
      acceptCMP,
      grantPackage
    );

    setPartners((prev) =>
      prev.map((p) => (p.id === res.updatedPartner.id ? res.updatedPartner : p))
    );
    setSelectedPartner(res.updatedPartner);

    if (res.success) {
      sound.playSuccess();
      setFeedback({ text: res.feedbackHi, success: true });
    } else {
      sound.playClick();
      setFeedback({ text: res.feedbackHi, success: false });
    }
  };

  const handleFinalizeAlliance = () => {
    sound.playVictory();
    onAllianceFormed(allies, totalSeats);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 bg-navy-950/80 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-lg bg-navy-900 border border-amber-500/40 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        {/* Modal Header */}
        <div className="p-4 bg-gradient-to-r from-amber-600/30 via-navy-900 to-navy-950 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400">
              <Handshake size={22} />
            </div>
            <div>
              <h2 className="text-base font-black text-white tracking-wide">
                गठबंधन वार्ता कक्ष (Coalition Room)
              </h2>
              <p className="text-xs text-amber-300/80">
                बहुमत लक्ष्य: 272 सीटें | वर्तमान: {totalSeats}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* 272 Gauge Bar */}
        <div className="px-4 py-3 bg-navy-950/90 border-b border-slate-800">
          <div className="flex justify-between items-center text-xs mb-1.5">
            <span className="font-bold text-slate-300">
              लोकसभा बहुमत प्रगति (Lok Sabha Tracker)
            </span>
            <span
              className={`font-black px-2 py-0.5 rounded-md ${
                majorityReached
                  ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
                  : 'bg-amber-500/20 text-amber-400 border border-amber-500/40'
              }`}
            >
              {totalSeats} / 272 {majorityReached ? '✓ बहुमत प्राप्त' : `(${272 - totalSeats} बाकी)`}
            </span>
          </div>

          <div className="w-full bg-slate-800 h-3 rounded-full overflow-hidden flex relative">
            <div
              className="bg-saffron h-full transition-all duration-500"
              style={{ width: `${Math.min(100, (playerSeats / 543) * 100)}%` }}
              title={`आपकी पार्टी: ${playerSeats}`}
            />
            {allies.map((ally) => (
              <div
                key={ally.id}
                className="h-full transition-all duration-500"
                style={{
                  width: `${(ally.seats / 543) * 100}%`,
                  backgroundColor: ally.color,
                }}
                title={`${ally.nameHi}: ${ally.seats}`}
              />
            ))}
            {/* 272 line indicator */}
            <div
              className="absolute top-0 bottom-0 w-0.5 bg-white shadow-glow"
              style={{ left: `${(272 / 543) * 100}%` }}
            />
          </div>

          <div className="flex justify-between items-center mt-2 text-[11px] text-slate-400">
            <span>आपकी सीटें: <strong className="text-saffron">{playerSeats}</strong></span>
            <span>सहयोगी सीटें: <strong className="text-emerald-400">{totalSeats - playerSeats}</strong></span>
            <span>स्थायित्व: <strong className={stability >= 70 ? 'text-emerald-400' : 'text-amber-400'}>{stability}%</strong></span>
          </div>
        </div>

        {/* Content Area */}
        <div className="p-4 overflow-y-auto space-y-4 flex-1">
          {/* Partner Selection List */}
          <div>
            <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
              क्षेत्रीय दल व संभावित सहयोगी (Potential Regional Partners)
            </h3>
            <div className="grid grid-cols-1 gap-2">
              {partners.map((p) => (
                <div
                  key={p.id}
                  onClick={() => handleSelectPartner(p)}
                  className={`p-3 rounded-2xl border transition-all cursor-pointer flex items-center justify-between ${
                    p.joined
                      ? 'bg-emerald-950/30 border-emerald-500/50'
                      : selectedPartner?.id === p.id
                      ? 'bg-slate-800/80 border-amber-400 shadow-md'
                      : 'bg-navy-950/60 border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <div
                      className="w-8 h-8 rounded-xl flex items-center justify-center font-black text-white text-xs shadow"
                      style={{ backgroundColor: p.color }}
                    >
                      {p.shortName}
                    </div>
                    <div>
                      <div className="flex items-center space-x-2">
                        <span className="font-bold text-sm text-white">{p.nameHi}</span>
                        {p.joined && (
                          <span className="bg-emerald-500/20 text-emerald-400 text-[10px] px-1.5 py-0.5 rounded font-bold border border-emerald-500/30 flex items-center">
                            <Check size={10} className="mr-0.5" /> गठबंधन में
                          </span>
                        )}
                      </div>
                      <span className="text-xs text-slate-400 block">{p.ideologyHi} • नेता: {p.leaderHi}</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="text-sm font-black text-amber-400">+{p.seats} सीटें</span>
                    <span className="text-[10px] text-slate-500 block">सहमति: {p.relationshipScore}%</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Partner Negotiation Details */}
          {selectedPartner && !selectedPartner.joined && (
            <div className="p-4 bg-navy-950/90 border border-slate-800 rounded-2xl space-y-3">
              <div className="flex justify-between items-start border-b border-slate-800 pb-2">
                <div>
                  <h4 className="font-bold text-sm text-white">{selectedPartner.nameHi} की प्रमुख शर्तें</h4>
                  <span className="text-xs text-slate-400">नेता: {selectedPartner.leaderHi}</span>
                </div>
                <span className="text-xs font-bold text-amber-400">
                  सीटें: +{selectedPartner.seats}
                </span>
              </div>

              {/* Demand 1: Ministries */}
              <label className="flex items-start space-x-2 cursor-pointer text-xs text-slate-300">
                <input
                  type="checkbox"
                  checked={grantMinistries}
                  onChange={(e) => setGrantMinistries(e.target.checked)}
                  className="mt-0.5 rounded bg-slate-800 border-slate-700 text-saffron focus:ring-0"
                />
                <div>
                  <strong className="text-white block">मंत्रिमंडल में हिस्सेदारी (Cabinet Berths)</strong>
                  <span className="text-slate-400">मांग: {selectedPartner.demands.ministriesDemanded.join(', ')}</span>
                </div>
              </label>

              {/* Demand 2: CMP */}
              <label className="flex items-start space-x-2 cursor-pointer text-xs text-slate-300">
                <input
                  type="checkbox"
                  checked={acceptCMP}
                  onChange={(e) => setAcceptCMP(e.target.checked)}
                  className="mt-0.5 rounded bg-slate-800 border-slate-700 text-saffron focus:ring-0"
                />
                <div>
                  <strong className="text-white block">न्यूनतम साझा कार्यक्रम (Common Minimum Programme)</strong>
                  <span className="text-slate-400">{selectedPartner.demands.cmpPolicyHi}</span>
                </div>
              </label>

              {/* Demand 3: Special Package */}
              <label className="flex items-start space-x-2 cursor-pointer text-xs text-slate-300">
                <input
                  type="checkbox"
                  checked={grantPackage}
                  onChange={(e) => setGrantPackage(e.target.checked)}
                  className="mt-0.5 rounded bg-slate-800 border-slate-700 text-saffron focus:ring-0"
                />
                <div>
                  <strong className="text-white block">विशेष राज्य विकास पैकेज (State Special Package)</strong>
                  <span className="text-slate-400">मांग: ₹{selectedPartner.demands.specialPackageCrores.toLocaleString()} करोड़ विशेष अनुदान</span>
                </div>
              </label>

              {feedback && (
                <div
                  className={`p-2.5 rounded-xl text-xs font-bold ${
                    feedback.success
                      ? 'bg-emerald-950/60 text-emerald-400 border border-emerald-500/40'
                      : 'bg-rose-950/60 text-rose-400 border border-rose-500/40'
                  }`}
                >
                  {feedback.text}
                </div>
              )}

              <button
                onClick={handleNegotiate}
                className="w-full py-2.5 bg-gradient-to-r from-amber-500 to-saffron text-navy-950 font-black rounded-xl text-xs shadow-lg hover:brightness-110 active:scale-95 transition-all flex items-center justify-center space-x-2"
              >
                <span>वार्ता प्रस्ताव पेश करें (Submit Offer)</span>
                <ChevronRight size={14} />
              </button>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="p-4 bg-navy-950/95 border-t border-slate-800 flex items-center space-x-3">
          <button
            onClick={onClose}
            className="flex-1 py-2.5 bg-slate-800 text-slate-300 font-bold rounded-xl text-xs hover:bg-slate-700 transition-colors"
          >
            बाद में विचार करें
          </button>
          <button
            onClick={handleFinalizeAlliance}
            disabled={!majorityReached}
            className={`flex-1 py-2.5 font-black rounded-xl text-xs shadow-xl transition-all flex items-center justify-center space-x-1.5 ${
              majorityReached
                ? 'bg-gradient-to-r from-emerald-500 to-teal-500 text-white hover:brightness-110'
                : 'bg-slate-800 text-slate-500 cursor-not-allowed'
            }`}
          >
            <ShieldCheck size={16} />
            <span>सरकार गठन का दावा पेश करें</span>
          </button>
        </div>
      </div>
    </div>
  );
};
