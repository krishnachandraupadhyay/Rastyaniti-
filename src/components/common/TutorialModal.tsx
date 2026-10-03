import React, { useState } from 'react';
import { X, Sparkles, Scroll, ChevronRight, Shield, Award, Users, Megaphone, Landmark, Crown } from 'lucide-react';
import { sound } from '../../audio/soundEffects';

interface TutorialModalProps {
  onClose: () => void;
}

interface ChanakyaLesson {
  id: string;
  categoryHi: string;
  categoryEn: string;
  icon: React.ReactNode;
  sloka: string;
  meaningHi: string;
  practicalAdviceHi: string;
  practicalAdviceEn: string;
}

const CHANAKYA_LESSONS: ChanakyaLesson[] = [
  {
    id: 'cadre',
    categoryHi: 'संगठन व कार्यकर्ता',
    categoryEn: 'Cadres & Hierarchy',
    icon: <Users size={18} className="text-amber-400" />,
    sloka: '‘सहायता बिना राजा एक चक्र के समान नहीं चल सकता। अत: योग्य सहायकों की नियुक्ति करे।’',
    meaningHi: 'अकेला नेता कभी चुनाव नहीं जीत सकता। एक चक्र से रथ नहीं चलता, योग्य सहायकों की नियुक्ति अनिवार्य है।',
    practicalAdviceHi: 'संगठन कक्ष में जाकर ओजस्वी वक्ताओं और जमीनी कार्यकर्ताओं की भर्ती करें। उन्हें उत्तर प्रदेश, बिहार, बंगाल जैसे बड़े राज्यों में तैनात करें।',
    practicalAdviceEn: 'Recruit orators and field mobilizers from Recruitment Desk. Deploy them to high-stake states to maximize ground influence.',
  },
  {
    id: 'campaign',
    categoryHi: 'प्रचार व जनसंपर्क',
    categoryEn: 'Campaign & Outreach',
    icon: <Megaphone size={18} className="text-rose-400" />,
    sloka: '‘जो समय का सदुपयोग करता है और जनमानस की नब्ज पहचानता है, विजय उसी की होती है।’',
    meaningHi: 'चुनावी दिनों में समय और ऊर्जा सबसे मूल्यवान पूंजी हैं। व्यर्थ विवादों से बचें।',
    practicalAdviceHi: 'घर-घर जनसंपर्क (Door-to-Door) से स्थानीय विश्वास बढ़ता है, जबकि महारैलियों से राज्यव्यापी लहर पैदा होती है। प्रतिदिन ऊर्जा का उचित संतुलन रखें।',
    practicalAdviceEn: 'Door-to-door drives build deep grassroots trust, while Mega Rallies trigger state-wide electoral waves. Balance daily energy.',
  },
  {
    id: 'coalition',
    categoryHi: 'गठबंधन व बहुमत',
    categoryEn: 'Coalition & Majority',
    icon: <Shield size={18} className="text-sky-400" />,
    sloka: '‘बलवान शत्रु को नम्रता से, दुर्बल को पराक्रम से और समान को मित्रता से वश में करें।’',
    meaningHi: 'त्रिशंकु संसद (Hung Parliament) में 272 का जादुई आंकड़ा पाने के लिए लचीलापन और चतुराई आवश्यक है।',
    practicalAdviceHi: 'यदि बहुमत कम पड़े, तो क्षेत्रीय दलों से वार्ता करें। उन्हें मंत्रिमंडल पद व न्यूनतम साझा कार्यक्रम (CMP) देकर 272 सीटें सुनिश्चित करें।',
    practicalAdviceEn: 'If short of 272 Lok Sabha seats, open Coalition Room negotiations. Concede ministries and Common Minimum Programme to secure power.',
  },
  {
    id: 'governance',
    categoryHi: 'सुशासन व नीतियां',
    categoryEn: 'Governance & National Schemes',
    icon: <Crown size={18} className="text-emerald-400" />,
    sloka: '‘प्रजा के सुख में ही राजा का सुख है, प्रजा के हित में ही उसका हित।’',
    meaningHi: 'सरकार बनने के बाद राष्ट्रीय नीतियों और आर्थिक संतुलन से ही पुनः जनादेश प्राप्त होता है।',
    practicalAdviceHi: 'डिजिटल भारत, किसान समृद्धि और स्वास्थ्य योजनाओं को लागू करें। मुद्रास्फीति को नियंत्रित रखें और संसद में व्हिप जारी कर बिल पारित कराएं।',
    practicalAdviceEn: 'Enact flagship national policies like Digital Bharat, Farmer MSP, and Universal Health. Keep inflation check and whip party MPs.',
  }
];

export const TutorialModal: React.FC<TutorialModalProps> = ({ onClose }) => {
  const [activeIdx, setActiveIdx] = useState(0);
  const lesson = CHANAKYA_LESSONS[activeIdx];

  const handleSelectLesson = (idx: number) => {
    sound.playSelect();
    setActiveIdx(idx);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 bg-navy-950/85 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-lg bg-gradient-to-b from-navy-900 to-navy-950 border border-amber-500/50 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="p-4 bg-gradient-to-r from-amber-600/30 via-navy-900 to-navy-950 border-b border-amber-500/20 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400 text-lg font-black shadow-inner">
              📜
            </div>
            <div>
              <h2 className="text-base font-black text-white flex items-center space-x-1.5">
                <span>चाणक्य नीति मार्गदर्शिका</span>
                <Sparkles size={14} className="text-amber-400" />
              </h2>
              <p className="text-[11px] text-amber-300/80">राजनीतिक रणनीति, कूटनीति व शासन कला</p>
            </div>
          </div>
          <button
            onClick={() => {
              sound.playClick();
              onClose();
            }}
            className="p-1.5 rounded-full text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Categories Bar */}
        <div className="px-3 py-2 bg-navy-950/90 border-b border-slate-800 flex space-x-2 overflow-x-auto no-scrollbar">
          {CHANAKYA_LESSONS.map((l, idx) => (
            <button
              key={l.id}
              onClick={() => handleSelectLesson(idx)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all flex items-center space-x-1.5 ${
                activeIdx === idx
                  ? 'bg-gradient-to-r from-saffron to-amber-500 text-navy-950 shadow-md font-black'
                  : 'bg-navy-900 text-slate-400 hover:text-white border border-slate-800'
              }`}
            >
              {l.icon}
              <span>{l.categoryHi}</span>
            </button>
          ))}
        </div>

        {/* Lesson Body */}
        <div className="p-5 overflow-y-auto space-y-4 flex-1">
          {/* Ancient Sanskrit Sloka Card */}
          <div className="p-4 rounded-2xl bg-amber-950/20 border border-amber-500/30 text-center relative overflow-hidden">
            <div className="text-amber-400 font-serif text-sm font-semibold italic leading-relaxed">
              {lesson.sloka}
            </div>
            <div className="mt-2 text-xs text-amber-200/90 leading-relaxed font-sans">
              <strong>अर्थ:</strong> {lesson.meaningHi}
            </div>
          </div>

          {/* Actionable Strategic Advice */}
          <div className="p-4 rounded-2xl bg-navy-900/90 border border-slate-800 space-y-2">
            <div className="flex items-center space-x-2 text-xs font-black text-white">
              <Scroll size={16} className="text-saffron" />
              <span>रणनीतिक निर्देश (Actionable Guidance)</span>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed font-medium">
              {lesson.practicalAdviceHi}
            </p>
            <p className="text-[11px] text-slate-400 leading-relaxed border-t border-slate-800 pt-2 italic">
              {lesson.practicalAdviceEn}
            </p>
          </div>

          {/* Key Rule Indicator */}
          <div className="grid grid-cols-2 gap-2 text-center text-xs">
            <div className="p-3 bg-navy-900/60 rounded-2xl border border-slate-800">
              <span className="text-[10px] text-slate-400 block">लक्ष्य</span>
              <span className="font-black text-amber-400">272 लोकसभा बहुमत</span>
            </div>
            <div className="p-3 bg-navy-900/60 rounded-2xl border border-slate-800">
              <span className="text-[10px] text-slate-400 block">सर्वोच्च शक्ति</span>
              <span className="font-black text-emerald-400">जमीनी कार्यकर्ता संगठन</span>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-navy-950/95 border-t border-slate-800 flex items-center justify-between">
          <div className="text-[11px] text-slate-400">
            अध्याय {activeIdx + 1} / {CHANAKYA_LESSONS.length}
          </div>
          <div className="flex space-x-2">
            {activeIdx < CHANAKYA_LESSONS.length - 1 ? (
              <button
                onClick={() => handleSelectLesson(activeIdx + 1)}
                className="px-4 py-2 bg-gradient-to-r from-saffron to-amber-500 text-navy-950 font-black rounded-xl text-xs shadow hover:brightness-110 flex items-center space-x-1"
              >
                <span>अगला सूत्र (Next)</span>
                <ChevronRight size={14} />
              </button>
            ) : (
              <button
                onClick={() => {
                  sound.playSuccess();
                  onClose();
                }}
                className="px-5 py-2 bg-gradient-to-r from-emerald-500 to-teal-500 text-white font-black rounded-xl text-xs shadow hover:brightness-110"
              >
                ज्ञान प्राप्त (Close)
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
