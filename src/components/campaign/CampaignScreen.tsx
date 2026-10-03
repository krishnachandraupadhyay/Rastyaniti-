import React, { useState } from 'react';
import { Megaphone, Users, Zap, IndianRupee, Clock, ArrowRight, CheckCircle2, TrendingUp, ShieldAlert, Sparkles } from 'lucide-react';
import { CampaignAction, CampaignActionType, DemographicSupport, PlayerProfile, PoliticalParty } from '../../types/game';
import { useI18n } from '../../locales/i18n';
import { sound } from '../../audio/soundEffects';

interface CampaignScreenProps {
  player: PlayerProfile;
  party: PoliticalParty | null;
  onExecuteAction: (action: CampaignAction) => void;
  onOpenMediaCenter: () => void;
  onOpenTraining: () => void;
  onStart7DayCampaign?: () => void;
}

const CAMPAIGN_ACTIONS: CampaignAction[] = [
  {
    id: 'RALLY',
    titleHi: 'विशाल जनसभा (महा रैली)',
    titleEn: 'Mega Public Rally',
    descHi: 'हजारों नागरिकों के समक्ष मुख्य मंच से जोशीला संबोधन व विजन प्रस्तुति।',
    descEn: 'Electrify crowds from the main podium with fiery rhetoric and vision.',
    cost: 40000,
    energyCost: 35,
    workersCost: 30,
    daysCost: 2,
    trustGain: 6,
    popularityGain: 12,
    mediaGain: 15,
    targetGroup: 'youth',
    icon: 'megaphone',
  },
  {
    id: 'DOOR_TO_DOOR',
    titleHi: 'घर-घर संपर्क अभियान',
    titleEn: 'Door-to-Door Outreach',
    descHi: 'हर घर में दस्तक देकर बुजुर्गों का आशीर्वाद और परिवार की समस्याएं सुनना।',
    descEn: 'Visit households directly, listen to family grievances, and earn trust.',
    cost: 8000,
    energyCost: 25,
    workersCost: 15,
    daysCost: 1,
    trustGain: 10,
    popularityGain: 5,
    mediaGain: 2,
    targetGroup: 'rural',
    icon: 'home',
  },
  {
    id: 'TOWNHALL',
    titleHi: 'नागरिक टाउनहॉल संवाद',
    titleEn: 'Citizen Town Hall',
    descHi: 'छात्रों, व्यापारियों और बुद्धिजीवियों के सीधे सवालों के तार्किक उत्तर देना।',
    descEn: 'Answer tough policy questions from students, traders, and civic leaders.',
    cost: 15000,
    energyCost: 20,
    workersCost: 10,
    daysCost: 1,
    trustGain: 8,
    popularityGain: 7,
    mediaGain: 8,
    targetGroup: 'urban',
    icon: 'users',
  },
  {
    id: 'DEBATE',
    titleHi: 'लाइव टीवी डिबेट',
    titleEn: 'Prime-Time TV Debate',
    descHi: 'मुख्य विपक्षी दलों के प्रवक्ताओं को राष्ट्रीय चैनल पर खुली चुनौती।',
    descEn: 'Debate opposition spokespersons on live national broadcast.',
    cost: 12000,
    energyCost: 30,
    workersCost: 5,
    daysCost: 1,
    trustGain: 5,
    popularityGain: 14,
    mediaGain: 25,
    targetGroup: 'youth',
    icon: 'tv',
  },
  {
    id: 'MANIFESTO',
    titleHi: 'घोषणापत्र (संकल्प पत्र) विमोचन',
    titleEn: 'Manifesto Unveiling',
    descHi: '100 दिनों के स्पष्ट विकास एजेंडा और जनकल्याणकारी योजनाओं का ऐलान।',
    descEn: 'Unveil 100-day development blueprint and economic commitments.',
    cost: 25000,
    energyCost: 20,
    workersCost: 20,
    daysCost: 2,
    trustGain: 12,
    popularityGain: 8,
    mediaGain: 18,
    targetGroup: 'farmers',
    icon: 'file-text',
  },
  {
    id: 'DIGITAL_CAMPAIGN',
    titleHi: 'सोशल मीडिया व AI प्रचार',
    titleEn: 'Digital & Social Media Blitz',
    descHi: 'इंटरनेट, रील्स और व्हाट्सएप पर सकारात्मक संदेशों का वायरल प्रसार।',
    descEn: 'Broadcast short videos, reels, and digital graphics across social channels.',
    cost: 20000,
    energyCost: 15,
    workersCost: 5,
    daysCost: 1,
    trustGain: 4,
    popularityGain: 15,
    mediaGain: 20,
    targetGroup: 'youth',
    icon: 'share-2',
  },
  {
    id: 'COMMUNITY_OUTREACH',
    titleHi: 'सामुदायिक सेवा व निःशुल्क शिविर',
    titleEn: 'Community Health & Seva Camp',
    descHi: 'निःशुल्क चिकित्सा, नेत्र जांच व दवा वितरण से जनता का हृदय जीतें।',
    descEn: 'Provide free health checkups, eye testing, and basic medicine distribution.',
    cost: 30000,
    energyCost: 25,
    workersCost: 25,
    daysCost: 2,
    trustGain: 14,
    popularityGain: 7,
    mediaGain: 6,
    targetGroup: 'workers',
    icon: 'heart',
  },
  {
    id: 'VOLUNTEER_DRIVE',
    titleHi: 'कार्यकर्ता भर्ती शिविर',
    titleEn: 'Cadre Recruitment Drive',
    descHi: 'प्रत्येक मतदान केंद्र (बूथ) पर 10 समर्पित युवाओं की तैनाती।',
    descEn: 'Recruit and train active young workers for every polling booth.',
    cost: 18000,
    energyCost: 20,
    workersCost: 10,
    daysCost: 2,
    trustGain: 6,
    popularityGain: 9,
    mediaGain: 4,
    targetGroup: 'youth',
    icon: 'user-plus',
  }
];

import { INITIAL_PARTY_MEMBERS, PartyMember } from '../../engine/partyMemberEngine';

export const CampaignScreen: React.FC<CampaignScreenProps> = ({
  player,
  party,
  onExecuteAction,
  onOpenMediaCenter,
  onOpenTraining,
  onStart7DayCampaign,
}) => {
  const { language, t } = useI18n();
  const [selectedAction, setSelectedAction] = useState<CampaignAction | null>(null);
  const [members] = useState<PartyMember[]>(() => {
    const saved = localStorage.getItem('rn_party_members');
    return saved ? JSON.parse(saved) : INITIAL_PARTY_MEMBERS;
  });
  const [assignedLeader, setAssignedLeader] = useState<PartyMember | null>(null);

  const handleSelect = (action: CampaignAction) => {
    sound.playClick();
    setSelectedAction(action);
  };

  const handleLaunch = () => {
    if (!selectedAction) return;
    sound.playRally();
    // If a leader is assigned, boost the gains based on leader's stats
    const boostedAction: CampaignAction = assignedLeader ? {
      ...selectedAction,
      trustGain: Math.round(selectedAction.trustGain * (1 + (assignedLeader.stats.communication / 200))),
      popularityGain: Math.round(selectedAction.popularityGain * (1 + (assignedLeader.stats.publicSupport / 200))),
    } : selectedAction;

    onExecuteAction(boostedAction);
    setSelectedAction(null);
  };

  const canAfford = (action: CampaignAction) => {
    const availableFunds = party ? player.resources.partyFunds : player.resources.money;
    return availableFunds >= action.cost && player.resources.energy >= action.energyCost;
  };

  return (
    <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-navy-950 text-slate-100 flex flex-col">
      {/* Header Bar */}
      <div className="flex items-center justify-between">
        <div>
          <div className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-saffron/15 border border-saffron/30 text-saffron text-[10px] font-black uppercase mb-1">
            <Megaphone size={12} />
            <span>चुनावी रणनीति कक्ष • WAR ROOM</span>
          </div>
          <h2 className="text-xl font-black font-display text-white">
            {t.campaign.title}
          </h2>
          <p className="text-xs text-slate-400">
            {t.campaign.subtitle}
          </p>
        </div>

        {/* Action Center Sub-tabs (Media / Training) */}
        <div className="flex items-center gap-1.5">
          <button
            onClick={() => {
              sound.playClick();
              onOpenMediaCenter();
            }}
            className="px-2.5 py-1.5 rounded-xl bg-navy-900 border border-slate-700 hover:border-saffron text-slate-200 text-xs font-bold transition-all"
          >
            मीडिया
          </button>
          <button
            onClick={() => {
              sound.playClick();
              onOpenTraining();
            }}
            className="px-2.5 py-1.5 rounded-xl bg-navy-900 border border-slate-700 hover:border-saffron text-slate-200 text-xs font-bold transition-all"
          >
            प्रशिक्षण
          </button>
        </div>
      </div>

      {/* 7-DAY ELECTION CAMPAIGN WAR ROOM BANNER */}
      {onStart7DayCampaign && (
        <div className="p-3.5 bg-gradient-to-r from-saffron/20 via-navy-900 to-amber-500/20 border border-saffron/40 rounded-3xl shadow-xl flex items-center justify-between gap-3">
          <div>
            <span className="text-[10px] font-black uppercase tracking-wider text-saffron block mb-0.5">
              🔥 विशेष चुनावी मोड (SPECIAL 7-DAY ELECTION SYSTEM)
            </span>
            <h3 className="text-sm font-black text-white">7-दिवसीय सघन चुनाव अभियान व जनमत युद्ध</h3>
            <p className="text-xs text-slate-300">
              रणनीति, जमीनी संपर्क, मीडिया, विपक्ष का पलटवार, स्थानीय आपदा, लाइव डिबेट और EVM मतगणना!
            </p>
          </div>
          <button
            onClick={() => {
              sound.playRally();
              onStart7DayCampaign();
            }}
            className="px-4 py-2.5 rounded-2xl bg-gradient-to-r from-saffron to-amber-500 text-navy-950 font-black text-xs uppercase tracking-wider shadow-lg active:scale-95 transition-all flex-shrink-0"
          >
            युद्ध शुरू करें
          </button>
        </div>
      )}

      {/* Campaign Actions Grid */}
      <div className="space-y-2.5 flex-1">
        {CAMPAIGN_ACTIONS.map((act) => {
          const affordable = canAfford(act);
          const isSelected = selectedAction?.id === act.id;

          return (
            <div
              key={act.id}
              onClick={() => handleSelect(act)}
              className={`p-3 rounded-2xl border transition-all cursor-pointer shadow-md ${
                isSelected
                  ? 'bg-navy-900 border-saffron shadow-saffron/10 ring-1 ring-saffron'
                  : affordable
                  ? 'bg-navy-900/70 border-slate-800 hover:border-slate-700 hover:bg-navy-900'
                  : 'bg-navy-950/60 border-slate-900 opacity-60'
              }`}
            >
              <div className="flex items-start justify-between gap-2 mb-1.5">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-xl bg-saffron/20 text-saffron flex items-center justify-center flex-shrink-0">
                    <Megaphone size={16} />
                  </div>
                  <div>
                    <h4 className="text-xs font-black text-white">
                      {language === 'hi' ? act.titleHi : act.titleEn}
                    </h4>
                    <span className="text-[10px] text-slate-400">
                      लक्षित वर्ग: <strong className="text-amber-400">{t.demographics[act.targetGroup]}</strong>
                    </span>
                  </div>
                </div>

                <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-950 text-emerald-300 font-bold border border-emerald-800">
                  +{act.trustGain}% विश्वास
                </span>
              </div>

              <p className="text-[11px] text-slate-300 leading-snug mb-2 pl-10">
                {language === 'hi' ? act.descHi : act.descEn}
              </p>

              {/* Resource Cost Footer */}
              <div className="flex items-center justify-between text-[11px] pt-2 border-t border-slate-800/80 text-slate-400 pl-10">
                <div className="flex items-center gap-3">
                  <span className="flex items-center gap-0.5 font-bold text-emerald-400">
                    <IndianRupee size={12} />
                    ₹{act.cost.toLocaleString('en-IN')}
                  </span>
                  <span className="flex items-center gap-0.5 font-bold text-amber-400">
                    <Zap size={12} />
                    {act.energyCost}%
                  </span>
                  <span className="flex items-center gap-0.5 font-bold text-slate-300">
                    <Clock size={12} />
                    {act.daysCost} {language === 'hi' ? 'दिन' : 'Day'}
                  </span>
                </div>

                <span className="text-sky-400 font-bold">+{act.popularityGain}% लोकप्रिय</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Bottom Execute Drawer */}
      {selectedAction && (
        <div className="sticky bottom-0 bg-navy-900/95 backdrop-blur-md p-3.5 rounded-2xl border border-saffron/40 shadow-2xl animate-fadeIn">
          <div className="flex items-center justify-between mb-2">
            <div>
              <span className="text-[10px] font-black text-slate-400 uppercase block">चुनी गई गतिविधि</span>
              <h4 className="text-xs font-black text-white">
                {language === 'hi' ? selectedAction.titleHi : selectedAction.titleEn}
              </h4>
            </div>

            <div className="text-right">
              <span className="text-[10px] text-slate-400 block">कुल खर्च</span>
              <span className="text-xs font-black text-emerald-400">
                ₹{selectedAction.cost.toLocaleString('en-IN')}
              </span>
            </div>
          </div>

          {/* Party Leader Assignment Selector */}
          <div className="my-2.5 p-2 bg-navy-950/80 rounded-xl border border-slate-800">
            <span className="text-[10px] text-amber-400 font-bold block mb-1">
              अभियान नेतृत्व / मुख्य वक्ता चुनें (Assign Leader - Optional Bonus):
            </span>
            <div className="flex space-x-1.5 overflow-x-auto no-scrollbar py-0.5">
              <button
                type="button"
                onClick={() => setAssignedLeader(null)}
                className={`px-2.5 py-1 rounded-lg text-[10px] font-bold whitespace-nowrap transition-all ${
                  assignedLeader === null
                    ? 'bg-saffron text-navy-950 font-black'
                    : 'bg-navy-900 text-slate-400 border border-slate-800'
                }`}
              >
                स्वयं (Player)
              </button>
              {members.map((m) => (
                <button
                  key={m.id}
                  type="button"
                  onClick={() => setAssignedLeader(m)}
                  className={`px-2.5 py-1 rounded-lg text-[10px] font-bold whitespace-nowrap transition-all flex items-center space-x-1 ${
                    assignedLeader?.id === m.id
                      ? 'bg-gradient-to-r from-amber-500 to-saffron text-navy-950 font-black'
                      : 'bg-navy-900 text-slate-300 border border-slate-800'
                  }`}
                >
                  <span>{m.avatar}</span>
                  <span>{m.name.split(' ')[0]}</span>
                  <span className="text-emerald-300 text-[9px]">(+{Math.round(m.stats.communication / 2)}%)</span>
                </button>
              ))}
            </div>
          </div>

          <button
            onClick={handleLaunch}
            disabled={!canAfford(selectedAction)}
            className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-saffron to-amber-500 text-navy-950 font-black text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg disabled:opacity-40 disabled:cursor-not-allowed hover:brightness-105 active:scale-95 transition-all"
          >
            <Sparkles size={14} />
            <span>{t.campaign.takeAction}</span>
            <ArrowRight size={14} />
          </button>
        </div>
      )}
    </div>
  );
};
