import React, { useState } from 'react';
import { 
  Users, Crown, Shield, MapPin, Award, ChevronRight, UserPlus, 
  Send, AlertTriangle, TrendingUp, Sparkles, X, Check, ArrowUpRight
} from 'lucide-react';
import { 
  PartyMember, MemberRole, MissionType, ROLE_LABELS, 
  INITIAL_PARTY_MEMBERS, RECRUITMENT_CANDIDATE_POOL, resolveMemberMission,
  PartyDynamicsState
} from '../../engine/partyMemberEngine';
import { PlayerProfile, PoliticalParty } from '../../types/game';
import { INDIA_STATES } from '../../engine/initialData';
import { useI18n } from '../../locales/i18n';
import { sound } from '../../audio/soundEffects';

interface PartyOrganizationScreenProps {
  player: PlayerProfile;
  party: PoliticalParty | null;
  onUpdatePartyFunds: (amount: number) => void;
  onBoostPartyPopularity: (amount: number) => void;
}

export const PartyOrganizationScreen: React.FC<PartyOrganizationScreenProps> = ({
  player,
  party,
  onUpdatePartyFunds,
  onBoostPartyPopularity,
}) => {
  const { language } = useI18n();
  const [members, setMembers] = useState<PartyMember[]>(() => {
    const saved = localStorage.getItem('rn_party_members');
    return saved ? JSON.parse(saved) : INITIAL_PARTY_MEMBERS;
  });

  const [dynamics, setDynamics] = useState<PartyDynamicsState>(() => {
    const saved = localStorage.getItem('rn_party_dynamics');
    return saved ? JSON.parse(saved) : {
      partyUnity: 88,
      factionTension: 15,
      disciplineLevel: 92,
      activeDisputes: ['युवा मोर्चा बनाम वरिष्ठ नेताओं में टिकट वितरण पर मतभेद']
    };
  });

  const [activeTab, setActiveTab] = useState<'HIERARCHY' | 'ROSTER' | 'DISPATCH' | 'RECRUIT' | 'DYNAMICS'>('HIERARCHY');
  const [selectedMember, setSelectedMember] = useState<PartyMember | null>(null);
  const [recruitPool, setRecruitPool] = useState(RECRUITMENT_CANDIDATE_POOL);
  const [missionNotice, setMissionNotice] = useState<string | null>(null);

  // Save to localStorage
  const saveMembers = (newMembers: PartyMember[]) => {
    setMembers(newMembers);
    localStorage.setItem('rn_party_members', JSON.stringify(newMembers));
  };

  // Promote / Reassign Role
  const handleAssignRole = (memberId: string, newRole: MemberRole, newState?: string) => {
    const updated = members.map(m => {
      if (m.id === memberId) {
        return {
          ...m,
          role: newRole,
          assignedState: newState || m.assignedState,
          stats: {
            ...m.stats,
            loyalty: Math.min(100, m.stats.loyalty + 5),
          }
        };
      }
      return m;
    });
    saveMembers(updated);
    sound.playSuccess();
    setSelectedMember(null);
  };

  // Recruit Member
  const handleRecruitMember = (candidateIdx: number) => {
    const candidate = recruitPool[candidateIdx];
    const hiringCost = candidate.salaryMonthly * 2;

    if (player.resources.partyFunds < hiringCost) {
      alert(language === 'hi' ? 'पर्याप्त पार्टी फंड नहीं है!' : 'Insufficient Party Funds!');
      return;
    }

    onUpdatePartyFunds(-hiringCost);

    const newMember: PartyMember = {
      ...candidate,
      id: `mem-${Date.now()}`,
    };

    const nextMembers = [...members, newMember];
    saveMembers(nextMembers);
    setRecruitPool(prev => prev.filter((_, idx) => idx !== candidateIdx));
    sound.playSuccess();
    setMissionNotice(language === 'hi' 
      ? `${newMember.name} को पार्टी में सफलतापूर्वक शामिल कर लिया गया!` 
      : `${newMember.nameEn} recruited to the party successfully!`);
  };

  // Dispatch Member on Mission
  const handleDispatchMission = (member: PartyMember, missionType: MissionType) => {
    const cost = 15000;
    if (player.resources.partyFunds < cost) {
      alert(language === 'hi' ? 'पर्याप्त पार्टी फंड नहीं है!' : 'Insufficient Party Funds!');
      return;
    }

    onUpdatePartyFunds(-cost);
    const result = resolveMemberMission(member, missionType);

    // Update member stats
    const updated = members.map(m => {
      if (m.id === member.id) {
        return {
          ...m,
          stats: {
            ...m.stats,
            experience: m.stats.experience + result.xpGained,
            level: Math.floor((m.stats.experience + result.xpGained) / 300) + 1,
            publicSupport: Math.min(100, m.stats.publicSupport + result.popularityBoost),
          }
        };
      }
      return m;
    });

    saveMembers(updated);
    onBoostPartyPopularity(result.popularityBoost);
    sound.playSuccess();
    setMissionNotice(language === 'hi' ? result.reportHi : result.reportEn);
  };

  return (
    <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-navy-950 text-slate-100 flex flex-col pb-20">
      {/* Header Banner */}
      <div className="p-4 rounded-3xl bg-gradient-to-r from-navy-900 via-slate-900 to-navy-900 border border-slate-800 shadow-xl flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-saffron/20 border border-saffron/40 flex items-center justify-center text-saffron font-black text-xl">
            <Users size={24} />
          </div>
          <div>
            <h2 className="text-base font-black text-white">
              {language === 'hi' ? 'संगठन व कार्यकर्ता मंच' : 'Party Organization & Cadres'}
            </h2>
            <p className="text-[10px] text-slate-400">
              {party?.name} • {language === 'hi' ? 'केंद्रीय नेतृत्व संरचना' : 'National Command Hierarchy'}
            </p>
          </div>
        </div>

        {/* Party Unity Badge */}
        <div className="text-right">
          <span className="text-[10px] text-slate-400 block">{language === 'hi' ? 'संगठन एकता' : 'Party Unity'}</span>
          <span className="text-sm font-black text-emerald-400">{dynamics.partyUnity}%</span>
        </div>
      </div>

      {/* Navigation Sub-Tabs */}
      <div className="grid grid-cols-5 gap-1 bg-navy-900/90 p-1 rounded-2xl border border-slate-800 text-[11px] font-bold">
        <button
          onClick={() => { sound.playClick(); setActiveTab('HIERARCHY'); }}
          className={`py-2 rounded-xl text-center transition-all ${
            activeTab === 'HIERARCHY' ? 'bg-saffron text-navy-950 shadow-md font-black' : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          {language === 'hi' ? 'पदक्रम' : 'Hierarchy'}
        </button>
        <button
          onClick={() => { sound.playClick(); setActiveTab('ROSTER'); }}
          className={`py-2 rounded-xl text-center transition-all ${
            activeTab === 'ROSTER' ? 'bg-saffron text-navy-950 shadow-md font-black' : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          {language === 'hi' ? 'सदस्य' : 'Members'} ({members.length})
        </button>
        <button
          onClick={() => { sound.playClick(); setActiveTab('DISPATCH'); }}
          className={`py-2 rounded-xl text-center transition-all ${
            activeTab === 'DISPATCH' ? 'bg-saffron text-navy-950 shadow-md font-black' : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          {language === 'hi' ? 'मिशन' : 'Dispatch'}
        </button>
        <button
          onClick={() => { sound.playClick(); setActiveTab('RECRUIT'); }}
          className={`py-2 rounded-xl text-center transition-all ${
            activeTab === 'RECRUIT' ? 'bg-saffron text-navy-950 shadow-md font-black' : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          {language === 'hi' ? 'भर्ती' : 'Recruit'}
        </button>
        <button
          onClick={() => { sound.playClick(); setActiveTab('DYNAMICS'); }}
          className={`py-2 rounded-xl text-center transition-all ${
            activeTab === 'DYNAMICS' ? 'bg-saffron text-navy-950 shadow-md font-black' : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          {language === 'hi' ? 'अनुशासन' : 'Discipline'}
        </button>
      </div>

      {/* Alert Notification if any */}
      {missionNotice && (
        <div className="p-3 bg-emerald-950/80 border border-emerald-600/50 rounded-2xl flex items-center justify-between text-xs text-emerald-200">
          <span>{missionNotice}</span>
          <button onClick={() => setMissionNotice(null)} className="p-1 text-emerald-400 hover:text-white">
            <X size={14} />
          </button>
        </div>
      )}

      {/* 1. HIERARCHY TREE VIEW */}
      {activeTab === 'HIERARCHY' && (
        <div className="space-y-3">
          {/* Top Tier: Player as National President */}
          <div className="p-3 rounded-2xl bg-gradient-to-r from-amber-600/30 to-saffron/20 border border-saffron/50 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-saffron text-navy-950 flex items-center justify-center font-black text-lg shadow-md">
                👑
              </div>
              <div>
                <span className="text-[10px] uppercase tracking-wider font-bold text-saffron block">
                  {language === 'hi' ? 'राष्ट्रीय अध्यक्ष (सर्वोच्च नेतृत्व)' : 'National President (Supreme Command)'}
                </span>
                <h3 className="font-black text-sm text-white">{player.name}</h3>
                <span className="text-[10px] text-slate-400">{player.positionTitle}</span>
              </div>
            </div>
            <span className="px-2.5 py-1 rounded-full bg-saffron/20 text-saffron text-[10px] font-bold border border-saffron/40">
              Level {player.level}
            </span>
          </div>

          <div className="flex justify-center my-1">
            <div className="w-0.5 h-4 bg-slate-700"></div>
          </div>

          {/* Tier 2: Senior Leaders */}
          <div className="p-3 rounded-2xl bg-navy-900 border border-purple-800/40 space-y-2">
            <div className="flex items-center justify-between text-xs text-purple-300 font-bold">
              <span className="flex items-center gap-1.5">
                <Shield size={14} />
                {language === 'hi' ? 'वरिष्ठ नेता / केंद्रीय संसदीय बोर्ड' : 'Senior Leaders / Parliamentary Board'}
              </span>
              <span className="text-[10px] text-slate-400">
                {members.filter(m => m.role === 'SENIOR_LEADER').length} {language === 'hi' ? 'नेता' : 'Leaders'}
              </span>
            </div>
            <div className="grid grid-cols-2 gap-2">
              {members.filter(m => m.role === 'SENIOR_LEADER').map(member => (
                <div 
                  key={member.id}
                  onClick={() => { sound.playClick(); setSelectedMember(member); }}
                  className="p-2.5 rounded-xl bg-navy-950/80 border border-purple-900/40 hover:border-purple-500 cursor-pointer flex items-center justify-between"
                >
                  <div className="flex items-center gap-2 truncate">
                    <span className="text-lg">{member.avatar}</span>
                    <div className="truncate">
                      <h4 className="text-xs font-bold text-white truncate">{member.name}</h4>
                      <span className="text-[9px] text-slate-400 block truncate">{member.specialty}</span>
                    </div>
                  </div>
                  <ChevronRight size={12} className="text-slate-500 flex-shrink-0" />
                </div>
              ))}
            </div>
          </div>

          <div className="flex justify-center my-1">
            <div className="w-0.5 h-4 bg-slate-700"></div>
          </div>

          {/* Tier 3: State Leaders */}
          <div className="p-3 rounded-2xl bg-navy-900 border border-blue-800/40 space-y-2">
            <div className="flex items-center justify-between text-xs text-blue-300 font-bold">
              <span className="flex items-center gap-1.5">
                <MapPin size={14} />
                {language === 'hi' ? 'प्रदेश अध्यक्ष (राज्य कमान)' : 'State Presidents (State Command)'}
              </span>
              <span className="text-[10px] text-slate-400">
                {members.filter(m => m.role === 'STATE_LEADER').length} {language === 'hi' ? 'राज्य' : 'States'}
              </span>
            </div>
            <div className="grid grid-cols-2 gap-2">
              {members.filter(m => m.role === 'STATE_LEADER').map(member => (
                <div 
                  key={member.id}
                  onClick={() => { sound.playClick(); setSelectedMember(member); }}
                  className="p-2.5 rounded-xl bg-navy-950/80 border border-blue-900/40 hover:border-blue-500 cursor-pointer flex items-center justify-between"
                >
                  <div className="flex items-center gap-2 truncate">
                    <span className="text-lg">{member.avatar}</span>
                    <div className="truncate">
                      <h4 className="text-xs font-bold text-white truncate">{member.name}</h4>
                      <span className="text-[9px] text-blue-400 block truncate font-medium">{member.assignedState}</span>
                    </div>
                  </div>
                  <ChevronRight size={12} className="text-slate-500 flex-shrink-0" />
                </div>
              ))}
            </div>
          </div>

          <div className="flex justify-center my-1">
            <div className="w-0.5 h-4 bg-slate-700"></div>
          </div>

          {/* Tier 4: Wings (Youth, Farmers, Women, Students) */}
          <div className="p-3 rounded-2xl bg-navy-900 border border-rose-800/40 space-y-2">
            <div className="flex items-center justify-between text-xs text-rose-300 font-bold">
              <span className="flex items-center gap-1.5">
                <Award size={14} />
                {language === 'hi' ? 'विशेष मोर्चे व प्रकोष्ठ' : 'Specialized Wings & Cells'}
              </span>
            </div>
            <div className="grid grid-cols-2 gap-2">
              {members.filter(m => m.role === 'WING_LEADER').map(member => (
                <div 
                  key={member.id}
                  onClick={() => { sound.playClick(); setSelectedMember(member); }}
                  className="p-2.5 rounded-xl bg-navy-950/80 border border-rose-900/40 hover:border-rose-500 cursor-pointer flex items-center justify-between"
                >
                  <div className="flex items-center gap-2 truncate">
                    <span className="text-lg">{member.avatar}</span>
                    <div className="truncate">
                      <h4 className="text-xs font-bold text-white truncate">{member.name}</h4>
                      <span className="text-[9px] text-rose-400 block truncate">
                        {member.wing === 'YOUTH' ? 'युवा मोर्चा' : member.wing === 'FARMERS' ? 'किसान मोर्चा' : 'मोर्चा अध्यक्ष'}
                      </span>
                    </div>
                  </div>
                  <ChevronRight size={12} className="text-slate-500 flex-shrink-0" />
                </div>
              ))}
            </div>
          </div>

          {/* Ground Footprint Summary */}
          <div className="p-3 bg-slate-900/80 rounded-2xl border border-slate-800 flex items-center justify-between text-xs">
            <div>
              <span className="text-slate-400 text-[10px] block">{language === 'hi' ? 'जमीनी संगठन क्षमता' : 'Ground Cadre Mobilization'}</span>
              <span className="text-white font-black">{player.resources.workers} सक्रिय कैडर • {player.resources.volunteers} बूथ स्वयंसेवक</span>
            </div>
            <button 
              onClick={() => { sound.playClick(); setActiveTab('RECRUIT'); }}
              className="px-3 py-1.5 rounded-xl bg-saffron/20 border border-saffron/50 text-saffron font-bold text-[10px] hover:bg-saffron hover:text-navy-950 transition-all flex items-center gap-1"
            >
              <UserPlus size={12} />
              {language === 'hi' ? 'नया भर्ती' : 'Recruit'}
            </button>
          </div>
        </div>
      )}

      {/* 2. MEMBER ROSTER VIEW */}
      {activeTab === 'ROSTER' && (
        <div className="space-y-2">
          {members.map(member => {
            const roleInfo = ROLE_LABELS[member.role];
            return (
              <div
                key={member.id}
                onClick={() => { sound.playClick(); setSelectedMember(member); }}
                className="p-3 bg-navy-900 rounded-2xl border border-slate-800 hover:border-saffron/50 cursor-pointer flex items-center justify-between transition-all"
              >
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{member.avatar}</span>
                  <div>
                    <div className="flex items-center gap-1.5">
                      <h4 className="text-xs font-black text-white">{member.name}</h4>
                      <span className={`px-2 py-0.5 rounded-full text-[8px] font-black text-white bg-gradient-to-r ${roleInfo.badgeColor}`}>
                        {language === 'hi' ? roleInfo.hi : roleInfo.en}
                      </span>
                    </div>
                    <span className="text-[10px] text-slate-400 block">{member.specialty}</span>
                    <span className="text-[9px] text-sky-400">
                      {language === 'hi' ? 'प्रभारी राज्य' : 'State'}: {member.assignedState} • Lvl {member.stats.level}
                    </span>
                  </div>
                </div>

                <div className="text-right">
                  <div className="text-[10px] text-emerald-400 font-bold">
                    {language === 'hi' ? 'निष्ठा' : 'Loyalty'}: {member.stats.loyalty}%
                  </div>
                  <span className="text-[9px] text-slate-500">XP {member.stats.experience}</span>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* 3. MISSION DISPATCH VIEW */}
      {activeTab === 'DISPATCH' && (
        <div className="space-y-3">
          <p className="text-xs text-slate-400">
            {language === 'hi' 
              ? 'वरिष्ठ व प्रांतीय नेताओं को अभियानों पर भेजें ताकि पार्टी का जनाधार और फंड बढ़े:'
              : 'Dispatch leaders on political missions to grow public support and party strength:'}
          </p>

          <div className="space-y-2">
            {members.map(member => (
              <div key={member.id} className="p-3 bg-navy-900 rounded-2xl border border-slate-800 space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-xl">{member.avatar}</span>
                    <div>
                      <h4 className="text-xs font-bold text-white">{member.name}</h4>
                      <span className="text-[10px] text-slate-400">{member.assignedState}</span>
                    </div>
                  </div>
                  <span className="text-[10px] font-bold text-saffron">Lvl {member.stats.level}</span>
                </div>

                {/* Quick Mission Buttons */}
                <div className="grid grid-cols-3 gap-1.5 pt-1">
                  <button
                    onClick={() => handleDispatchMission(member, 'RALLY')}
                    className="p-1.5 rounded-xl bg-navy-950 border border-slate-800 hover:border-saffron text-[10px] font-semibold text-slate-200 hover:text-white flex flex-col items-center gap-0.5"
                  >
                    <span>📢 {language === 'hi' ? 'रैली' : 'Rally'}</span>
                    <span className="text-[8px] text-amber-400 font-bold">-₹15k</span>
                  </button>

                  <button
                    onClick={() => handleDispatchMission(member, 'DEBATE')}
                    className="p-1.5 rounded-xl bg-navy-950 border border-slate-800 hover:border-saffron text-[10px] font-semibold text-slate-200 hover:text-white flex flex-col items-center gap-0.5"
                  >
                    <span>🎙️ {language === 'hi' ? 'डिबेट' : 'Debate'}</span>
                    <span className="text-[8px] text-amber-400 font-bold">-₹15k</span>
                  </button>

                  <button
                    onClick={() => handleDispatchMission(member, 'DOOR_TO_DOOR')}
                    className="p-1.5 rounded-xl bg-navy-950 border border-slate-800 hover:border-saffron text-[10px] font-semibold text-slate-200 hover:text-white flex flex-col items-center gap-0.5"
                  >
                    <span>🚪 {language === 'hi' ? 'जनसंपर्क' : 'Door-to-door'}</span>
                    <span className="text-[8px] text-amber-400 font-bold">-₹15k</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 4. RECRUITMENT DESK */}
      {activeTab === 'RECRUIT' && (
        <div className="space-y-3">
          <p className="text-xs text-slate-400">
            {language === 'hi' 
              ? 'नए योग्य राजनीतिक कार्यकर्ताओं व रणनीतिकारों को अपनी पार्टी में शामिल करें:'
              : 'Scout and recruit rising political leaders to strengthen your national party:'}
          </p>

          <div className="space-y-2">
            {recruitPool.map((cand, idx) => (
              <div key={idx} className="p-3 bg-navy-900 rounded-2xl border border-slate-800 space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-2xl">{cand.avatar}</span>
                    <div>
                      <h4 className="text-xs font-black text-white">{cand.name}</h4>
                      <span className="text-[10px] text-slate-400">{cand.homeState} • {cand.specialty}</span>
                    </div>
                  </div>
                  <span className="text-xs font-black text-emerald-400">₹{cand.salaryMonthly.toLocaleString('en-IN')}/माह</span>
                </div>

                <div className="grid grid-cols-3 gap-1 text-[10px] bg-navy-950 p-2 rounded-xl text-slate-300">
                  <span>नेतृत्व: {cand.stats.leadership}</span>
                  <span>रणनीति: {cand.stats.strategy}</span>
                  <span>जनसमर्थन: {cand.stats.publicSupport}</span>
                </div>

                <button
                  onClick={() => handleRecruitMember(idx)}
                  className="w-full py-2 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-bold text-xs hover:brightness-110 flex items-center justify-center gap-1.5 shadow-md"
                >
                  <UserPlus size={14} />
                  {language === 'hi' ? `पार्टी में शामिल करें (लागत ₹${(cand.salaryMonthly * 2).toLocaleString('en-IN')})` : `Recruit (Cost ₹${(cand.salaryMonthly * 2).toLocaleString('en-IN')})`}
                </button>
              </div>
            ))}
            {recruitPool.length === 0 && (
              <div className="p-6 text-center text-xs text-slate-500 bg-navy-900/50 rounded-2xl border border-slate-800">
                {language === 'hi' ? 'वर्तमान में कोई नए उम्मीदवार उपलब्ध नहीं हैं।' : 'No candidates available right now.'}
              </div>
            )}
          </div>
        </div>
      )}

      {/* 5. PARTY DYNAMICS & DISCIPLINE */}
      {activeTab === 'DYNAMICS' && (
        <div className="space-y-3">
          <div className="p-4 bg-navy-900 rounded-2xl border border-slate-800 space-y-3">
            <h3 className="text-xs font-black text-white flex items-center gap-1.5">
              <Shield size={14} className="text-amber-400" />
              {language === 'hi' ? 'आंतरिक पार्टी अनुशासन व संतुलन' : 'Internal Party Discipline & Unity'}
            </h3>

            <div className="space-y-2">
              <div>
                <div className="flex justify-between text-[11px] text-slate-300 mb-1">
                  <span>{language === 'hi' ? 'पार्टी एकजुटता (Unity)' : 'Party Unity'}</span>
                  <span className="font-black text-emerald-400">{dynamics.partyUnity}%</span>
                </div>
                <div className="w-full bg-navy-950 rounded-full h-2 overflow-hidden">
                  <div className="bg-emerald-500 h-2 rounded-full" style={{ width: `${dynamics.partyUnity}%` }}></div>
                </div>
              </div>

              <div>
                <div className="flex justify-between text-[11px] text-slate-300 mb-1">
                  <span>{language === 'hi' ? 'गुटबाजी व तनाव (Faction Tension)' : 'Factional Tension'}</span>
                  <span className="font-black text-amber-400">{dynamics.factionTension}%</span>
                </div>
                <div className="w-full bg-navy-950 rounded-full h-2 overflow-hidden">
                  <div className="bg-amber-500 h-2 rounded-full" style={{ width: `${dynamics.factionTension}%` }}></div>
                </div>
              </div>

              <div>
                <div className="flex justify-between text-[11px] text-slate-300 mb-1">
                  <span>{language === 'hi' ? 'कैडर अनुशासन (Discipline)' : 'Cadre Discipline'}</span>
                  <span className="font-black text-sky-400">{dynamics.disciplineLevel}%</span>
                </div>
                <div className="w-full bg-navy-950 rounded-full h-2 overflow-hidden">
                  <div className="bg-sky-500 h-2 rounded-full" style={{ width: `${dynamics.disciplineLevel}%` }}></div>
                </div>
              </div>
            </div>
          </div>

          {/* Active Internal Disputes */}
          <div className="p-3 bg-navy-900 rounded-2xl border border-slate-800 space-y-2">
            <span className="text-[11px] font-bold text-amber-400 flex items-center gap-1">
              <AlertTriangle size={12} />
              {language === 'hi' ? 'सक्रिय आंतरिक मुद्दे व सुलह' : 'Active Disputes & Reconciliation'}
            </span>
            {dynamics.activeDisputes.map((disp, i) => (
              <div key={i} className="p-2.5 bg-navy-950 rounded-xl border border-slate-800 text-xs text-slate-300 flex items-center justify-between">
                <span>{disp}</span>
                <button
                  onClick={() => {
                    sound.playSuccess();
                    setDynamics(prev => ({
                      ...prev,
                      partyUnity: Math.min(100, prev.partyUnity + 5),
                      factionTension: Math.max(5, prev.factionTension - 8),
                      activeDisputes: prev.activeDisputes.filter((_, idx) => idx !== i)
                    }));
                  }}
                  className="px-2 py-1 rounded bg-emerald-600/30 text-emerald-300 hover:bg-emerald-600 hover:text-white text-[10px] font-bold"
                >
                  {language === 'hi' ? 'सुलह कराएं' : 'Resolve'}
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* MEMBER DETAIL / PROMOTION MODAL */}
      {selectedMember && (
        <div className="fixed inset-0 z-50 bg-navy-950/90 backdrop-blur-md flex items-end sm:items-center justify-center p-4">
          <div className="w-full max-w-sm bg-navy-900 border border-slate-700 rounded-3xl p-4 space-y-3 shadow-2xl animate-fade-in max-h-[85vh] overflow-y-auto">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-3xl">{selectedMember.avatar}</span>
                <div>
                  <h3 className="text-sm font-black text-white">{selectedMember.name}</h3>
                  <span className="text-[10px] text-slate-400">{selectedMember.specialty}</span>
                </div>
              </div>
              <button onClick={() => setSelectedMember(null)} className="p-1 rounded-full bg-slate-800 text-slate-400 hover:text-white">
                <X size={16} />
              </button>
            </div>

            {/* Stats Breakdown */}
            <div className="p-3 bg-navy-950 rounded-2xl border border-slate-800 space-y-1.5 text-xs">
              <span className="text-[10px] font-bold text-slate-400 block">{language === 'hi' ? 'राजनीतिक योग्यता' : 'Political Skills'}</span>
              <div className="grid grid-cols-2 gap-2 text-[11px]">
                <div className="flex justify-between"><span>नेतृत्व:</span> <span className="font-bold text-saffron">{selectedMember.stats.leadership}</span></div>
                <div className="flex justify-between"><span>संवाद:</span> <span className="font-bold text-sky-400">{selectedMember.stats.communication}</span></div>
                <div className="flex justify-between"><span>रणनीति:</span> <span className="font-bold text-purple-400">{selectedMember.stats.strategy}</span></div>
                <div className="flex justify-between"><span>प्रशासन:</span> <span className="font-bold text-emerald-400">{selectedMember.stats.administration}</span></div>
                <div className="flex justify-between"><span>मीडिया:</span> <span className="font-bold text-pink-400">{selectedMember.stats.mediaHandling}</span></div>
                <div className="flex justify-between"><span>निष्ठा:</span> <span className="font-bold text-amber-400">{selectedMember.stats.loyalty}%</span></div>
              </div>
            </div>

            {/* Role Promotion Selector */}
            <div className="space-y-1.5">
              <span className="text-[10px] font-bold text-slate-400 block">{language === 'hi' ? 'पद पदोन्नति / बदलाव' : 'Assign / Promote Role'}</span>
              <div className="grid grid-cols-2 gap-1.5 text-[10px]">
                {(['SENIOR_LEADER', 'STATE_LEADER', 'DISTRICT_LEADER', 'WING_LEADER'] as MemberRole[]).map((r) => (
                  <button
                    key={r}
                    onClick={() => handleAssignRole(selectedMember.id, r)}
                    className={`p-2 rounded-xl border text-center font-bold transition-all ${
                      selectedMember.role === r 
                        ? 'bg-saffron text-navy-950 border-saffron shadow-sm' 
                        : 'bg-navy-950 border-slate-800 text-slate-300 hover:border-slate-600'
                    }`}
                  >
                    {language === 'hi' ? ROLE_LABELS[r].hi : ROLE_LABELS[r].en}
                  </button>
                ))}
              </div>
            </div>

            {/* State Incharge Assignment */}
            <div className="space-y-1.5">
              <span className="text-[10px] font-bold text-slate-400 block">{language === 'hi' ? 'प्रभारी राज्य नियुक्त करें' : 'Assign Target State'}</span>
              <select
                value={selectedMember.assignedState}
                onChange={(e) => handleAssignRole(selectedMember.id, selectedMember.role, e.target.value)}
                className="w-full p-2 rounded-xl bg-navy-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-saffron"
              >
                {INDIA_STATES.map(st => (
                  <option key={st} value={st}>{st}</option>
                ))}
              </select>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
