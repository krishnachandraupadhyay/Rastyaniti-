import React, { useState } from 'react';
import { Tv, Newspaper, Radio, MessageSquare, ArrowLeft, Send, Sparkles, AlertCircle } from 'lucide-react';
import { useI18n } from '../../locales/i18n';
import { sound } from '../../audio/soundEffects';

import { INITIAL_PARTY_MEMBERS, PartyMember } from '../../engine/partyMemberEngine';

interface MediaCenterProps {
  onBack: () => void;
  onHoldPressConference: () => void;
  onGiveInterview: () => void;
  onIssueRelease: () => void;
}

export const MediaCenter: React.FC<MediaCenterProps> = ({
  onBack,
  onHoldPressConference,
  onGiveInterview,
  onIssueRelease,
}) => {
  const { language, t } = useI18n();
  const [activeChannel, setActiveChannel] = useState<'TV' | 'PRINT' | 'DIGITAL'>('TV');
  const [members] = useState<PartyMember[]>(() => {
    const saved = localStorage.getItem('rn_party_members');
    return saved ? JSON.parse(saved) : INITIAL_PARTY_MEMBERS;
  });
  const [selectedSpokesperson, setSelectedSpokesperson] = useState<PartyMember | null>(null);

  return (
    <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-navy-950 text-slate-100 flex flex-col">
      {/* Top Header */}
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
            {t.media.title}
          </h2>
          <span className="text-[10px] text-slate-400">राष्ट्रीय मीडिया व जनसंवाद मंच</span>
        </div>
      </div>

      {/* Breaking News Ticker Crawler */}
      <div className="bg-rose-950/80 border border-rose-700/60 p-2.5 rounded-2xl flex items-center gap-2 overflow-hidden shadow-md">
        <span className="px-2 py-0.5 rounded bg-rose-600 text-white font-black text-[9px] uppercase tracking-wider flex-shrink-0 animate-pulse">
          BREAKING NEWS
        </span>
        <div className="text-xs text-rose-200 font-semibold truncate">
          {language === 'hi' 
            ? 'भारत 24 विशेष: विपक्षी दलों ने नए विकास मॉडल पर उठाए सवाल, जनता की नजरें आपके जवाब पर...'
            : 'Bharat 24 Exclusive: Opposition questions developmental model, public awaits your response...'}
        </div>
      </div>

      {/* Media Channels Tab */}
      <div className="grid grid-cols-3 gap-1.5 bg-navy-900 p-1 rounded-2xl border border-slate-800">
        <button
          onClick={() => {
            sound.playClick();
            setActiveChannel('TV');
          }}
          className={`py-2 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all ${
            activeChannel === 'TV' ? 'bg-saffron text-navy-950 shadow' : 'text-slate-400 hover:text-white'
          }`}
        >
          <Tv size={14} />
          <span>लाइव टीवी</span>
        </button>

        <button
          onClick={() => {
            sound.playClick();
            setActiveChannel('PRINT');
          }}
          className={`py-2 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all ${
            activeChannel === 'PRINT' ? 'bg-saffron text-navy-950 shadow' : 'text-slate-400 hover:text-white'
          }`}
        >
          <Newspaper size={14} />
          <span>अखबार</span>
        </button>

        <button
          onClick={() => {
            sound.playClick();
            setActiveChannel('DIGITAL');
          }}
          className={`py-2 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all ${
            activeChannel === 'DIGITAL' ? 'bg-saffron text-navy-950 shadow' : 'text-slate-400 hover:text-white'
          }`}
        >
          <Radio size={14} />
          <span>डिजिटल न्यूज़</span>
        </button>
      </div>

      {/* Designated Media Spokesperson Selector */}
      <div className="p-3 bg-navy-900/80 rounded-2xl border border-slate-800 space-y-1.5">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-slate-300">
            मुख्य राष्ट्रीय प्रवक्ता / वक्ता (Spokesperson):
          </span>
          <span className="text-[10px] text-amber-400 font-bold">
            {selectedSpokesperson ? selectedSpokesperson.name : 'स्वयं (Party Leader)'}
          </span>
        </div>
        <div className="flex space-x-1.5 overflow-x-auto no-scrollbar py-0.5">
          <button
            type="button"
            onClick={() => setSelectedSpokesperson(null)}
            className={`px-2.5 py-1 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
              selectedSpokesperson === null
                ? 'bg-saffron text-navy-950 font-black'
                : 'bg-navy-950 text-slate-400 border border-slate-800'
            }`}
          >
            स्वयं (National President)
          </button>
          {members.map((m) => (
            <button
              key={m.id}
              type="button"
              onClick={() => setSelectedSpokesperson(m)}
              className={`px-2.5 py-1 rounded-xl text-xs font-bold whitespace-nowrap transition-all flex items-center space-x-1 ${
                selectedSpokesperson?.id === m.id
                  ? 'bg-gradient-to-r from-amber-500 to-saffron text-navy-950 font-black'
                  : 'bg-navy-950 text-slate-300 border border-slate-800'
              }`}
            >
              <span>{m.avatar}</span>
              <span>{m.name.split(' ')[0]}</span>
              <span className="text-sky-300 text-[9px]">(मीडिया: {m.stats.mediaHandling}%)</span>
            </button>
          ))}
        </div>
      </div>

      {/* Media Interaction Actions */}
      <div className="space-y-3">
        {/* Press Conference */}
        <div className="p-3.5 rounded-2xl bg-navy-900/80 border border-slate-800 shadow-lg flex items-center justify-between gap-3">
          <div>
            <h4 className="text-xs font-black text-white mb-0.5">
              {t.media.pressConf}
            </h4>
            <p className="text-[11px] text-slate-400 leading-tight">
              राष्ट्रीय संवाददाताओं के सामने नीतिगत घोषणाएं करें (खर्च: ₹25,000)
            </p>
          </div>
          <button
            onClick={() => {
              sound.playRally();
              onHoldPressConference();
            }}
            className="px-3 py-2 rounded-xl bg-saffron text-navy-950 text-xs font-black hover:brightness-105 active:scale-95 transition-all flex-shrink-0"
          >
            आयोजित करें
          </button>
        </div>

        {/* TV Exclusive Interview */}
        <div className="p-3.5 rounded-2xl bg-navy-900/80 border border-slate-800 shadow-lg flex items-center justify-between gap-3">
          <div>
            <h4 className="text-xs font-black text-white mb-0.5">
              {t.media.tvInterview}
            </h4>
            <p className="text-[11px] text-slate-400 leading-tight">
              प्रमुख एंकर के साथ एक-पर-एक साक्षात्कार देकर जनता का मन जीतें
            </p>
          </div>
          <button
            onClick={() => {
              sound.playSelect();
              onGiveInterview();
            }}
            className="px-3 py-2 rounded-xl bg-sky-500 text-navy-950 text-xs font-black hover:brightness-105 active:scale-95 transition-all flex-shrink-0"
          >
            साक्षात्कार दें
          </button>
        </div>

        {/* Press Release */}
        <div className="p-3.5 rounded-2xl bg-navy-900/80 border border-slate-800 shadow-lg flex items-center justify-between gap-3">
          <div>
            <h4 className="text-xs font-black text-white mb-0.5">
              {t.media.pressRelease}
            </h4>
            <p className="text-[11px] text-slate-400 leading-tight">
              विपक्षी आरोपों का खंडन करने हेतु आधिकारिक बयान जारी करें (खर्च: ₹5,000)
            </p>
          </div>
          <button
            onClick={() => {
              sound.playClick();
              onIssueRelease();
            }}
            className="px-3 py-2 rounded-xl bg-emerald-500 text-navy-950 text-xs font-black hover:brightness-105 active:scale-95 transition-all flex-shrink-0"
          >
            जारी करें
          </button>
        </div>
      </div>
    </div>
  );
};
