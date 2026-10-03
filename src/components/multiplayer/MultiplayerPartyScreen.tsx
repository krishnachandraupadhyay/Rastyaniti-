import React, { useState } from 'react';
import { 
  Users, UserPlus, Share2, Copy, Check, Shield, MapPin, Zap, 
  TrendingUp, Radio, Award, ArrowLeft, Send, Sparkles, Cloud, Download,
  MessageSquare, UserCheck, CheckCircle2, XCircle, ChevronRight, 
  AlertCircle, ShieldCheck, Flame, Bell, RefreshCw, BarChart3, LogOut
} from 'lucide-react';
import { 
  MultiplayerPartyState, MultiplayerFriend, PartyRole, 
  INITIAL_MULTIPLAYER_PARTY, PartyChatMessage, MultiplayerAssignment,
  generateSaveCode, restoreSaveCode 
} from '../../engine/multiplayerPartyEngine';
import { PlayerProfile, PoliticalParty } from '../../types/game';
import { INDIA_STATES } from '../../engine/initialData';
import { useI18n } from '../../locales/i18n';
import { sound } from '../../audio/soundEffects';

interface MultiplayerPartyScreenProps {
  player: PlayerProfile;
  party: PoliticalParty | null;
  onBack: () => void;
  onBoostFunds: (amount: number) => void;
  onBoostPopularity: (amount: number) => void;
  onRestoreState?: (importedState: any) => void;
}

export const MultiplayerPartyScreen: React.FC<MultiplayerPartyScreenProps> = ({
  player,
  party,
  onBack,
  onBoostFunds,
  onBoostPopularity,
  onRestoreState,
}) => {
  const { language } = useI18n();

  const [partyData, setPartyData] = useState<MultiplayerPartyState>(() => {
    const saved = localStorage.getItem('rn_multiplayer_party');
    return saved ? JSON.parse(saved) : INITIAL_MULTIPLAYER_PARTY;
  });

  const [activeTab, setActiveTab] = useState<'DASHBOARD' | 'MEMBERS' | 'ASSIGNMENTS' | 'CHAT' | 'LEADERBOARD' | 'FRIENDS'>('DASHBOARD');
  const [copied, setCopied] = useState(false);
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [inviteSearch, setInviteSearch] = useState('');
  const [inviteMethod, setInviteMethod] = useState<'ID' | 'USERNAME' | 'CODE'>('ID');

  // Modals & Selection
  const [selectedMember, setSelectedMember] = useState<MultiplayerFriend | null>(null);
  const [showAssignModal, setShowAssignModal] = useState<MultiplayerFriend | null>(null);
  const [assignRole, setAssignRole] = useState<PartyRole>('STATE_LEADER');
  const [assignRegion, setAssignRegion] = useState('Bihar');
  const [assignTitle, setAssignTitle] = useState('राज्य सघन जनसंपर्क अभियान');
  const [showLeadershipTransferModal, setShowLeadershipTransferModal] = useState(false);
  const [transferTarget, setTransferTarget] = useState<MultiplayerFriend | null>(null);

  // Chat message input
  const [chatInput, setChatInput] = useState('');
  const [isLeaderAnnouncement, setIsLeaderAnnouncement] = useState(false);

  // Save multiplayer state helper
  const saveState = (updated: MultiplayerPartyState) => {
    setPartyData(updated);
    localStorage.setItem('rn_multiplayer_party', JSON.stringify(updated));
  };

  // Active current simulator user
  const currentAccount = partyData.members.find(m => m.id === partyData.activeAccountId) || partyData.members[0];
  const isCurrentLeader = currentAccount.role === 'PARTY_LEADER';

  // Handle Switch User Account Simulator
  const handleSwitchAccount = (memberId: string) => {
    sound.playSelect();
    const updated = {
      ...partyData,
      activeAccountId: memberId,
    };
    saveState(updated);
  };

  // Copy Party Invite Code
  const handleCopyInvite = () => {
    sound.playClick();
    navigator.clipboard?.writeText(partyData.partyCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Send Party Invitation
  const handleSendInvite = () => {
    if (!inviteSearch.trim()) return;
    sound.playSuccess();

    const newMember: MultiplayerFriend = {
      id: `user-${Date.now()}`,
      playerId: inviteSearch.startsWith('RN_') ? inviteSearch : `RN_USER_${Math.floor(1000 + Math.random() * 9000)}`,
      username: inviteSearch.startsWith('RN_') ? `साथी (${inviteSearch})` : inviteSearch.trim(),
      avatar: '🧑‍💼',
      role: 'GENERAL_MEMBER',
      roleTitleHi: 'सक्रिय साथी (Active Member)',
      roleTitleEn: 'Active Party Member',
      assignedRegion: player.state,
      xp: 600,
      level: 2,
      status: 'ONLINE',
      stats: {
        leadership: 70,
        communication: 72,
        politicalKnowledge: 68,
        strategy: 65,
        administration: 64,
        finance: 60,
        mediaHandling: 68,
        publicSupport: 74,
        loyalty: 95,
        experience: 600,
      },
      contributedFunds: 25000,
      contributedPopularity: 3,
      totalContributionScore: 280,
      recentActivities: ['पार्टी में नए सदस्य के रूप में शामिल हुए'],
    };

    const nextMembers = [...partyData.members, newMember];
    const nextFeed = [
      {
        id: `act-${Date.now()}`,
        sender: newMember.username,
        actionHi: 'पार्टी में नए सदस्य के रूप में ऑनलाइन जुड़े',
        actionEn: 'joined the party as a new active online member',
        timestamp: 'अभी-अभी',
        boostText: '+2% Popularity, +₹25,000 Funds',
      },
      ...partyData.activityFeed,
    ];

    const updated = {
      ...partyData,
      members: nextMembers,
      totalMembers: nextMembers.length,
      pooledPartyFunds: partyData.pooledPartyFunds + 25000,
      activityFeed: nextFeed,
    };

    saveState(updated);
    onBoostFunds(25000);
    onBoostPopularity(2);
    setInviteSearch('');
    setShowInviteModal(false);
  };

  // Assign Role & Responsibility to Member
  const handleConfirmAssignment = () => {
    if (!showAssignModal) return;
    sound.playSuccess();

    const updatedMembers = partyData.members.map(m => {
      if (m.id === showAssignModal.id) {
        const newAssignment: MultiplayerAssignment = {
          id: `asg-${Date.now()}`,
          titleHi: assignTitle,
          titleEn: 'Field Responsibility Assignment',
          region: assignRegion,
          objectiveHi: `${assignRegion} में संगठन विस्तार व जनसंपर्क अभियान लीड करना`,
          objectiveEn: `Lead public outreach and cadre coordination in ${assignRegion}`,
          status: 'PENDING',
          contributionGain: 150,
          fundsReward: 50000,
          popularityBoost: 6,
          assignedBy: currentAccount.username,
          timestamp: 'अभी',
        };

        return {
          ...m,
          role: assignRole,
          roleTitleHi: `${assignRegion} ${assignRole}`,
          assignedRegion: assignRegion,
          activeAssignment: newAssignment,
        };
      }
      return m;
    });

    const nextFeed = [
      {
        id: `act-${Date.now()}`,
        sender: currentAccount.username,
        actionHi: `ने ${showAssignModal.username} को ${assignRegion} की नई जिम्मेदारी सौंपी`,
        actionEn: `assigned new responsibility in ${assignRegion} to ${showAssignModal.username}`,
        timestamp: 'अभी',
        boostText: `${assignRegion} में +6% प्रभाव`,
      },
      ...partyData.activityFeed,
    ];

    saveState({
      ...partyData,
      members: updatedMembers,
      activityFeed: nextFeed,
    });

    setShowAssignModal(null);
  };

  // Friend responds to assignment (Accept / Decline / Complete)
  const handleAssignmentAction = (memberId: string, action: 'ACCEPT' | 'COMPLETE') => {
    sound.playSuccess();

    const updatedMembers = partyData.members.map(m => {
      if (m.id === memberId && m.activeAssignment) {
        if (action === 'ACCEPT') {
          return {
            ...m,
            activeAssignment: {
              ...m.activeAssignment,
              status: 'ACCEPTED' as const,
            }
          };
        } else {
          // Completed!
          const rewardFunds = m.activeAssignment.fundsReward;
          const rewardPop = m.activeAssignment.popularityBoost;
          const rewardScore = m.activeAssignment.contributionGain;

          return {
            ...m,
            xp: m.xp + 300,
            level: Math.floor((m.xp + 300) / 400) + 1,
            contributedFunds: m.contributedFunds + rewardFunds,
            contributedPopularity: m.contributedPopularity + rewardPop,
            totalContributionScore: m.totalContributionScore + rewardScore,
            activeAssignment: undefined,
            recentActivities: [
              `कार्यभार सफलतापूर्वक संपन्न: ${m.activeAssignment.titleHi}`,
              ...m.recentActivities.slice(0, 3)
            ]
          };
        }
      }
      return m;
    });

    const nextFeed = [
      {
        id: `act-${Date.now()}`,
        sender: currentAccount.username,
        actionHi: action === 'ACCEPT' 
          ? 'ने पार्टी कार्यभार स्वीकार किया' 
          : 'ने चुनावी कार्यभार सफलतापूर्वक पूर्ण कर पार्टी को मजबूत किया',
        actionEn: action === 'ACCEPT' ? 'accepted campaign assignment' : 'successfully concluded campaign mission',
        timestamp: 'अभी',
        boostText: action === 'COMPLETE' ? '+₹50,000 Funds, +6% Popularity' : 'अभियान प्रगति पर',
      },
      ...partyData.activityFeed,
    ];

    saveState({
      ...partyData,
      members: updatedMembers,
      pooledPartyFunds: partyData.pooledPartyFunds + (action === 'COMPLETE' ? 50000 : 0),
      partyXP: partyData.partyXP + (action === 'COMPLETE' ? 400 : 50),
      activityFeed: nextFeed,
    });

    if (action === 'COMPLETE') {
      onBoostFunds(50000);
      onBoostPopularity(6);
    }
  };

  // Send Chat Message
  const handleSendMessage = () => {
    if (!chatInput.trim()) return;
    sound.playClick();

    const newMsg: PartyChatMessage = {
      id: `msg-${Date.now()}`,
      senderId: currentAccount.id,
      senderName: currentAccount.username,
      senderRole: currentAccount.roleTitleHi,
      isLeaderAnnouncement: isLeaderAnnouncement && isCurrentLeader,
      message: chatInput.trim(),
      timestamp: 'अभी',
    };

    saveState({
      ...partyData,
      chatMessages: [...partyData.chatMessages, newMsg],
    });

    setChatInput('');
    setIsLeaderAnnouncement(false);
  };

  // Transfer Leadership
  const handleTransferLeadership = () => {
    if (!transferTarget) return;
    sound.playVictory();

    const updatedMembers = partyData.members.map(m => {
      if (m.id === transferTarget.id) {
        return {
          ...m,
          role: 'PARTY_LEADER' as const,
          roleTitleHi: 'राष्ट्रीय अध्यक्ष (Party Leader)',
          roleTitleEn: 'National Party President',
        };
      }
      if (m.id === currentAccount.id) {
        return {
          ...m,
          role: 'SENIOR_LEADER' as const,
          roleTitleHi: 'वरिष्ठ मार्गदर्शक / संसदीय बोर्ड',
          roleTitleEn: 'Senior Leader',
        };
      }
      return m;
    });

    saveState({
      ...partyData,
      leaderId: transferTarget.id,
      leaderName: transferTarget.username,
      members: updatedMembers,
    });

    setShowLeadershipTransferModal(false);
    setTransferTarget(null);
  };

  // Total campaign contribution power calculation
  const totalCampaignPower = partyData.members.reduce((acc, m) => acc + (m.totalContributionScore / 10), 0);

  return (
    <div className="flex-1 flex flex-col h-full bg-navy-950 text-slate-100 overflow-y-auto no-scrollbar relative z-10 p-3 pb-8">
      {/* ------------------------------------------------------------- */}
      {/* 1. TOP ACCOUNT SWITCHER / SIMULATOR BANNER */}
      {/* ------------------------------------------------------------- */}
      <div className="p-2.5 bg-gradient-to-r from-navy-900 to-slate-900 border border-slate-800 rounded-2xl mb-3 flex items-center justify-between gap-2 shadow-lg">
        <div className="flex items-center gap-2 text-xs">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 inline-block animate-ping"></span>
          <span className="text-[11px] text-slate-400 font-bold">सक्रिय खाता (Active Player):</span>
          <strong className="text-white font-black truncate max-w-[140px]">
            {currentAccount.username}
          </strong>
        </div>

        {/* Account Selector Dropdown */}
        <select
          value={partyData.activeAccountId}
          onChange={(e) => handleSwitchAccount(e.target.value)}
          className="bg-navy-950 border border-slate-700 text-saffron text-[10px] font-bold rounded-xl px-2 py-1 outline-none"
        >
          {partyData.members.map((m) => (
            <option key={m.id} value={m.id}>
              {m.username} ({m.roleTitleHi.split(' ')[0]})
            </option>
          ))}
        </select>
      </div>

      {/* ------------------------------------------------------------- */}
      {/* 2. PARTY OVERVIEW & WAR-CHEST HEADER */}
      {/* ------------------------------------------------------------- */}
      <div className="bg-navy-900/90 border border-slate-800 rounded-3xl p-4 mb-3 shadow-xl backdrop-blur-md">
        <div className="flex items-start justify-between mb-2">
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-saffron/15 border border-saffron/30 text-saffron text-[10px] font-black uppercase mb-1">
              <Users size={12} />
              <span>मल्टीप्लेयर पार्टी संगठन • LEVEL {partyData.partyLevel}</span>
            </div>
            <h1 className="text-lg font-black text-white">{partyData.partyName}</h1>
            <p className="text-xs text-slate-400">
              राष्ट्रीय अध्यक्ष: <strong className="text-amber-400">{partyData.leaderName}</strong> | राष्ट्रीय रैंक: #{partyData.nationalRank}
            </p>
          </div>

          <div className="text-right">
            <span className="text-[10px] text-slate-400 font-bold block">साझा चुनावी कोष</span>
            <span className="text-sm font-black text-emerald-400">
              ₹{partyData.pooledPartyFunds.toLocaleString('en-IN')}
            </span>
          </div>
        </div>

        {/* Invite Code Bar & Invite Button */}
        <div className="flex items-center justify-between gap-2 p-2 bg-navy-950 rounded-2xl border border-slate-800/80 mt-2">
          <div className="flex items-center gap-1.5 text-xs text-slate-300 font-mono">
            <span className="text-[10px] text-slate-500 font-sans">पार्टी कोड:</span>
            <strong className="text-amber-400 font-black">{partyData.partyCode}</strong>
          </div>

          <div className="flex items-center gap-1.5">
            <button
              onClick={handleCopyInvite}
              className="px-2.5 py-1 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-[10px] font-bold flex items-center gap-1 transition-all"
            >
              {copied ? <Check size={12} className="text-emerald-400" /> : <Copy size={12} />}
              <span>{copied ? 'कॉपी हुआ!' : 'कोड कॉपी'}</span>
            </button>
            <button
              onClick={() => {
                sound.playClick();
                setShowInviteModal(true);
              }}
              className="px-3 py-1 rounded-xl bg-gradient-to-r from-saffron to-amber-500 text-navy-950 text-[10px] font-black flex items-center gap-1 shadow transition-all active:scale-95"
            >
              <UserPlus size={12} />
              <span>दोस्त जोड़ें</span>
            </button>
          </div>
        </div>

        {/* Combined Campaign Strength Meter */}
        <div className="mt-3 pt-2.5 border-t border-slate-800/80 flex items-center justify-between text-xs">
          <span className="text-slate-400 font-bold flex items-center gap-1">
            <Flame size={14} className="text-saffron" />
            <span>संयुक्त चुनावी शक्ति (Party Campaign Strength):</span>
          </span>
          <span className="text-saffron font-black text-sm">
            {Math.round(totalCampaignPower)} pts
          </span>
        </div>
      </div>

      {/* ------------------------------------------------------------- */}
      {/* 3. MULTIPLAYER SUB-TABS */}
      {/* ------------------------------------------------------------- */}
      <div className="flex items-center gap-1.5 p-1 bg-navy-900 border border-slate-800 rounded-2xl mb-3 overflow-x-auto no-scrollbar">
        {[
          { id: 'DASHBOARD', label: '📊 डैशबोर्ड' },
          { id: 'MEMBERS', label: '👥 पार्टी सदस्य' },
          { id: 'ASSIGNMENTS', label: '📋 चुनावी कार्यभार' },
          { id: 'CHAT', label: '💬 वॉर रूम चैट' },
          { id: 'LEADERBOARD', label: '🏆 योगदान रैंक' },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => {
              sound.playClick();
              setActiveTab(tab.id as any);
            }}
            className={`py-1.5 px-3 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
              activeTab === tab.id
                ? 'bg-gradient-to-r from-saffron to-amber-500 text-navy-950 font-black shadow'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* ------------------------------------------------------------- */}
      {/* TAB 1: DASHBOARD & LIVE COOPERATION OVERVIEW */}
      {/* ------------------------------------------------------------- */}
      {activeTab === 'DASHBOARD' && (
        <div className="space-y-3 animate-fadeIn">
          {/* Active Player Status Card */}
          <div className="p-3.5 bg-gradient-to-r from-navy-900 via-navy-900 to-saffron/10 border border-slate-800 rounded-3xl">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-2.5">
                <span className="text-3xl">{currentAccount.avatar}</span>
                <div>
                  <h3 className="text-sm font-black text-white">{currentAccount.username}</h3>
                  <span className="text-[11px] text-amber-400 font-bold block">{currentAccount.roleTitleHi}</span>
                  <span className="text-[10px] text-slate-400">क्षेत्र: {currentAccount.assignedRegion}</span>
                </div>
              </div>
              <div className="text-right">
                <span className="px-2 py-0.5 rounded-full bg-emerald-950 border border-emerald-500/40 text-emerald-400 text-[9px] font-black uppercase">
                  {currentAccount.status}
                </span>
                <span className="text-[10px] text-slate-400 block mt-1">XP: {currentAccount.xp} (Lv.{currentAccount.level})</span>
              </div>
            </div>

            {/* Friend's Pending Assignment Banner if any */}
            {currentAccount.activeAssignment && (
              <div className="mt-3 p-3 bg-navy-950 rounded-2xl border border-amber-500/40 space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-amber-400 font-black flex items-center gap-1">
                    <Zap size={14} />
                    <span>सक्रिय कार्यभार: {currentAccount.activeAssignment.titleHi}</span>
                  </span>
                  <span className="text-[9px] px-1.5 py-0.5 rounded bg-slate-800 text-slate-300">
                    {currentAccount.activeAssignment.status}
                  </span>
                </div>
                <p className="text-xs text-slate-300">
                  {currentAccount.activeAssignment.objectiveHi}
                </p>
                <div className="flex items-center justify-between pt-1 text-[10px]">
                  <span className="text-emerald-400 font-bold">
                    इनाम: +₹{currentAccount.activeAssignment.fundsReward.toLocaleString('en-IN')} कोष | +{currentAccount.activeAssignment.popularityBoost}% जनसमर्थन
                  </span>

                  {currentAccount.activeAssignment.status === 'PENDING' ? (
                    <button
                      onClick={() => handleAssignmentAction(currentAccount.id, 'ACCEPT')}
                      className="px-3 py-1 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-black text-[10px] shadow"
                    >
                      स्वीकार करें (ACCEPT)
                    </button>
                  ) : (
                    <button
                      onClick={() => handleAssignmentAction(currentAccount.id, 'COMPLETE')}
                      className="px-3 py-1 rounded-xl bg-gradient-to-r from-saffron to-amber-500 text-navy-950 font-black text-[10px] shadow"
                    >
                      पूर्ण करें (COMPLETE MISSION)
                    </button>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Real-time Party Live Feed */}
          <div className="p-3.5 bg-navy-900 border border-slate-800 rounded-3xl space-y-2.5">
            <span className="text-[10px] font-black uppercase text-slate-400 tracking-wider flex items-center gap-1.5">
              <Radio size={12} className="text-rose-500 animate-pulse" />
              <span>पार्टी लाइव गतिविधि (Live Cooperative Feed)</span>
            </span>

            <div className="space-y-2">
              {partyData.activityFeed.map((item) => (
                <div key={item.id} className="p-2.5 rounded-2xl bg-navy-950 border border-slate-800/80 text-xs">
                  <div className="flex items-center justify-between text-[11px] mb-1">
                    <strong className="text-white font-bold">{item.sender}</strong>
                    <span className="text-[9px] text-slate-500">{item.timestamp}</span>
                  </div>
                  <p className="text-slate-300 text-xs mb-1">{item.actionHi}</p>
                  <span className="text-[10px] text-emerald-400 font-black">{item.boostText}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ------------------------------------------------------------- */}
      {/* TAB 2: PARTY MEMBERS & LEADER CONTROLS */}
      {/* ------------------------------------------------------------- */}
      {activeTab === 'MEMBERS' && (
        <div className="space-y-3 animate-fadeIn">
          <div className="flex items-center justify-between">
            <span className="text-xs font-black text-slate-300">
              कुल सदस्य: {partyData.members.length} साथी
            </span>
            {isCurrentLeader && (
              <button
                onClick={() => setShowLeadershipTransferModal(true)}
                className="text-[10px] text-amber-400 font-bold hover:underline"
              >
                अध्यक्षता हस्तांतरण (Transfer Leadership)
              </button>
            )}
          </div>

          <div className="space-y-2.5">
            {partyData.members.map((member) => (
              <div
                key={member.id}
                className="p-3.5 rounded-3xl bg-navy-900 border border-slate-800 hover:border-slate-700 transition-all shadow-md space-y-2"
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-2.5">
                    <span className="text-2xl">{member.avatar}</span>
                    <div>
                      <h4 className="text-sm font-black text-white flex items-center gap-1.5">
                        <span>{member.username}</span>
                        {member.role === 'PARTY_LEADER' && (
                          <span className="text-[9px] px-1.5 py-0.2 rounded-full bg-saffron text-navy-950 font-black">
                            LEADER
                          </span>
                        )}
                      </h4>
                      <span className="text-xs text-amber-400 font-semibold">{member.roleTitleHi}</span>
                      <span className="text-[10px] text-slate-400 block">क्षेत्र: {member.assignedRegion}</span>
                    </div>
                  </div>

                  <div className="text-right">
                    <span className="text-xs font-mono font-bold text-slate-400 block">{member.playerId}</span>
                    <span className="text-[10px] text-emerald-400 font-bold block mt-1">
                      योगदान: {member.totalContributionScore} pts
                    </span>
                  </div>
                </div>

                {/* Member Skill Badges */}
                <div className="flex items-center gap-1.5 flex-wrap text-[9px] text-slate-300 pt-1">
                  <span className="px-2 py-0.5 rounded-md bg-navy-950 border border-slate-800">
                    नेतृत्व: {member.stats.leadership}
                  </span>
                  <span className="px-2 py-0.5 rounded-md bg-navy-950 border border-slate-800">
                    संवाद: {member.stats.communication}
                  </span>
                  <span className="px-2 py-0.5 rounded-md bg-navy-950 border border-slate-800">
                    रणनीति: {member.stats.strategy}
                  </span>
                  <span className="px-2 py-0.5 rounded-md bg-navy-950 border border-slate-800">
                    जनसमर्थन: {member.stats.publicSupport}
                  </span>
                </div>

                {/* Leader Action Buttons */}
                {isCurrentLeader && member.id !== currentAccount.id && (
                  <div className="pt-2 border-t border-slate-800/80 flex items-center justify-end gap-2">
                    <button
                      onClick={() => {
                        sound.playClick();
                        setShowAssignModal(member);
                      }}
                      className="px-3 py-1 rounded-xl bg-navy-950 border border-slate-700 hover:border-saffron text-saffron text-xs font-bold transition-all"
                    >
                      पद व राज्य सौंपें (Assign Role)
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ------------------------------------------------------------- */}
      {/* TAB 3: ASSIGNMENTS & REGIONAL CAMPAIGNS */}
      {/* ------------------------------------------------------------- */}
      {activeTab === 'ASSIGNMENTS' && (
        <div className="space-y-3 animate-fadeIn">
          <div className="p-3 bg-navy-900 border border-slate-800 rounded-3xl">
            <span className="text-xs font-black text-white block mb-0.5">
              क्षेत्रीय चुनावी जिम्मेदारियां (Multiplayer Field Responsibilities)
            </span>
            <p className="text-xs text-slate-400">
              पार्टी अध्यक्ष सदस्यों को राज्य/जिला सौंपते हैं। साथी अपने खाते से अभियान संचालित कर पार्टी के वोट शेयर और कोष में वृद्धि करते हैं।
            </p>
          </div>

          <div className="space-y-2">
            {partyData.members.map((m) => (
              <div key={m.id} className="p-3.5 bg-navy-900/80 border border-slate-800 rounded-2xl">
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-xs font-black text-white">{m.username} ({m.assignedRegion})</span>
                  <span className="text-[10px] text-amber-400 font-bold">{m.roleTitleHi}</span>
                </div>

                {m.activeAssignment ? (
                  <div className="p-2.5 rounded-xl bg-navy-950 border border-slate-800 space-y-1">
                    <div className="text-xs font-bold text-amber-300">{m.activeAssignment.titleHi}</div>
                    <p className="text-[11px] text-slate-400">{m.activeAssignment.objectiveHi}</p>
                    <div className="flex justify-between items-center text-[10px] text-emerald-400 font-bold pt-1">
                      <span>इनाम: +₹{m.activeAssignment.fundsReward.toLocaleString('en-IN')}</span>
                      <span className="px-2 py-0.5 rounded bg-slate-800 text-slate-300">
                        स्थिति: {m.activeAssignment.status}
                      </span>
                    </div>
                  </div>
                ) : (
                  <div className="text-xs text-slate-500 italic p-1">
                    वर्तमान में कोई कार्यभार आवंटित नहीं है।
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ------------------------------------------------------------- */}
      {/* TAB 4: PARTY WAR-ROOM CHAT & STRATEGY ANNOUNCEMENTS */}
      {/* ------------------------------------------------------------- */}
      {activeTab === 'CHAT' && (
        <div className="flex-1 flex flex-col space-y-3 animate-fadeIn">
          {/* Chat Messages Log */}
          <div className="p-3 bg-navy-900/90 border border-slate-800 rounded-3xl space-y-2.5 max-h-80 overflow-y-auto">
            {partyData.chatMessages.map((msg) => (
              <div
                key={msg.id}
                className={`p-3 rounded-2xl text-xs space-y-1 ${
                  msg.isLeaderAnnouncement
                    ? 'bg-amber-950/70 border border-amber-500/50 shadow-md'
                    : msg.senderId === currentAccount.id
                    ? 'bg-navy-950 border border-slate-700 ml-4'
                    : 'bg-navy-950/70 border border-slate-800/80 mr-4'
                }`}
              >
                <div className="flex items-center justify-between text-[10px]">
                  <strong className={msg.isLeaderAnnouncement ? 'text-amber-400 font-black' : 'text-white font-bold'}>
                    {msg.senderName} ({msg.senderRole})
                  </strong>
                  <span className="text-slate-500">{msg.timestamp}</span>
                </div>
                <p className="text-slate-200 text-xs">{msg.message}</p>
              </div>
            ))}
          </div>

          {/* Send Input Bar */}
          <div className="p-2 bg-navy-900 border border-slate-800 rounded-2xl space-y-1.5">
            {isCurrentLeader && (
              <label className="flex items-center gap-1.5 text-[10px] text-amber-300 font-bold px-1 cursor-pointer">
                <input
                  type="checkbox"
                  checked={isLeaderAnnouncement}
                  onChange={(e) => setIsLeaderAnnouncement(e.target.checked)}
                  className="rounded text-amber-400"
                />
                <span>📢 राष्ट्रीय अध्यक्ष की विशेष घोषणा (Leader Announcement)</span>
              </label>
            )}

            <div className="flex items-center gap-1.5">
              <input
                type="text"
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                placeholder="वॉर रूम में संदेश या रणनीति लिखें..."
                className="flex-1 bg-navy-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-500 outline-none focus:border-saffron"
              />
              <button
                onClick={handleSendMessage}
                className="p-2 rounded-xl bg-gradient-to-r from-saffron to-amber-500 text-navy-950 font-black"
              >
                <Send size={16} />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ------------------------------------------------------------- */}
      {/* TAB 5: LEADERBOARD & MEMBER CONTRIBUTION */}
      {/* ------------------------------------------------------------- */}
      {activeTab === 'LEADERBOARD' && (
        <div className="space-y-3 animate-fadeIn">
          <div className="p-3 bg-navy-900 border border-slate-800 rounded-3xl">
            <span className="text-xs font-black text-amber-400 block mb-0.5">
              🏆 पार्टी योगदान लीडरबोर्ड (Party Contribution Rank)
            </span>
            <p className="text-xs text-slate-400">
              प्रत्येक साथी द्वारा रैलियों, जनसंपर्क, टीवी डिबेट्स और कोष संग्रह में दिया गया कुल योगदान।
            </p>
          </div>

          <div className="space-y-2">
            {[...partyData.members]
              .sort((a, b) => b.totalContributionScore - a.totalContributionScore)
              .map((m, idx) => (
                <div
                  key={m.id}
                  className="p-3 bg-navy-900/80 border border-slate-800 rounded-2xl flex items-center justify-between"
                >
                  <div className="flex items-center gap-2.5">
                    <span className="text-sm font-black text-amber-400 w-5">#{idx + 1}</span>
                    <span className="text-2xl">{m.avatar}</span>
                    <div>
                      <h4 className="text-xs font-black text-white">{m.username}</h4>
                      <span className="text-[10px] text-slate-400">{m.roleTitleHi}</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="text-xs font-black text-saffron block">{m.totalContributionScore} pts</span>
                    <span className="text-[9px] text-emerald-400 font-bold">₹{m.contributedFunds.toLocaleString('en-IN')}</span>
                  </div>
                </div>
              ))}
          </div>
        </div>
      )}

      {/* ------------------------------------------------------------- */}
      {/* MODAL: INVITE REAL FRIEND */}
      {/* ------------------------------------------------------------- */}
      {showInviteModal && (
        <div className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center p-4 backdrop-blur-sm animate-fadeIn">
          <div className="bg-navy-900 border border-slate-700 rounded-3xl p-5 w-full max-w-sm space-y-4 shadow-2xl">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-black text-white flex items-center gap-1.5">
                <UserPlus size={16} className="text-saffron" />
                <span>दोस्त को पार्टी में आमंत्रित करें</span>
              </h3>
              <button
                onClick={() => setShowInviteModal(false)}
                className="text-slate-400 hover:text-white"
              >
                ✕
              </button>
            </div>

            <div className="flex gap-1.5 p-1 bg-navy-950 rounded-xl text-[10px] font-bold">
              <button
                onClick={() => setInviteMethod('ID')}
                className={`flex-1 py-1 rounded-lg ${inviteMethod === 'ID' ? 'bg-saffron text-navy-950 font-black' : 'text-slate-400'}`}
              >
                Player ID
              </button>
              <button
                onClick={() => setInviteMethod('USERNAME')}
                className={`flex-1 py-1 rounded-lg ${inviteMethod === 'USERNAME' ? 'bg-saffron text-navy-950 font-black' : 'text-slate-400'}`}
              >
                Username
              </button>
              <button
                onClick={() => setInviteMethod('CODE')}
                className={`flex-1 py-1 rounded-lg ${inviteMethod === 'CODE' ? 'bg-saffron text-navy-950 font-black' : 'text-slate-400'}`}
              >
                Invite Code
              </button>
            </div>

            <div className="space-y-1.5">
              <label className="text-[11px] text-slate-300 font-bold block">
                {inviteMethod === 'ID' ? 'दोस्त की Player ID (उदा. RN_USER_8821)' : inviteMethod === 'USERNAME' ? 'दोस्त का यूजरनेम' : 'पार्टी इनवाइट कोड दर्ज करें'}
              </label>
              <input
                type="text"
                value={inviteSearch}
                onChange={(e) => setInviteSearch(e.target.value)}
                placeholder={inviteMethod === 'ID' ? 'RN_USER_...' : 'यूजरनेम लिखें...'}
                className="w-full bg-navy-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white outline-none focus:border-saffron"
              />
            </div>

            <div className="flex items-center gap-2 pt-2">
              <button
                onClick={() => setShowInviteModal(false)}
                className="flex-1 py-2 rounded-xl bg-slate-800 text-slate-300 text-xs font-bold"
              >
                रद्द करें
              </button>
              <button
                onClick={handleSendInvite}
                className="flex-1 py-2 rounded-xl bg-gradient-to-r from-saffron to-amber-500 text-navy-950 text-xs font-black shadow"
              >
                आमंत्रण भेजें (INVITE)
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ------------------------------------------------------------- */}
      {/* MODAL: ASSIGN ROLE & REGION */}
      {/* ------------------------------------------------------------- */}
      {showAssignModal && (
        <div className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center p-4 backdrop-blur-sm animate-fadeIn">
          <div className="bg-navy-900 border border-slate-700 rounded-3xl p-5 w-full max-w-sm space-y-4 shadow-2xl">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-black text-white flex items-center gap-1.5">
                <ShieldCheck size={16} className="text-saffron" />
                <span>पद व जिम्मेदारी आवंटन</span>
              </h3>
              <button
                onClick={() => setShowAssignModal(null)}
                className="text-slate-400 hover:text-white"
              >
                ✕
              </button>
            </div>

            <div className="text-xs text-slate-300">
              साथी: <strong className="text-white">{showAssignModal.username}</strong>
            </div>

            <div className="space-y-2">
              <div>
                <label className="text-[10px] text-slate-400 font-bold block mb-1">पद (Party Role)</label>
                <select
                  value={assignRole}
                  onChange={(e) => setAssignRole(e.target.value as PartyRole)}
                  className="w-full bg-navy-950 border border-slate-700 rounded-xl px-2.5 py-1.5 text-xs text-white outline-none"
                >
                  <option value="SENIOR_LEADER">वरिष्ठ नेता / संसदीय बोर्ड</option>
                  <option value="STATE_LEADER">प्रदेश अध्यक्ष (State Leader)</option>
                  <option value="DISTRICT_LEADER">जिला अध्यक्ष (District Leader)</option>
                  <option value="CAMPAIGN_MANAGER">चुनाव अभियान प्रबंधक</option>
                  <option value="MEDIA_MANAGER">मुख्य मीडिया प्रभारी</option>
                  <option value="WING_LEADER">मोर्चा प्रमुख (युवा/महिला)</option>
                  <option value="GENERAL_MEMBER">सक्रिय सदस्य</option>
                  <option value="VOLUNTEER">स्वयंसेवक</option>
                </select>
              </div>

              <div>
                <label className="text-[10px] text-slate-400 font-bold block mb-1">आवंटित राज्य / क्षेत्र (Region)</label>
                <select
                  value={assignRegion}
                  onChange={(e) => setAssignRegion(e.target.value)}
                  className="w-full bg-navy-950 border border-slate-700 rounded-xl px-2.5 py-1.5 text-xs text-white outline-none"
                >
                  {INDIA_STATES.map((st) => (
                    <option key={st} value={st}>{st}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="flex items-center gap-2 pt-2">
              <button
                onClick={() => setShowAssignModal(null)}
                className="flex-1 py-2 rounded-xl bg-slate-800 text-slate-300 text-xs font-bold"
              >
                रद्द करें
              </button>
              <button
                onClick={handleConfirmAssignment}
                className="flex-1 py-2 rounded-xl bg-gradient-to-r from-saffron to-amber-500 text-navy-950 text-xs font-black shadow"
              >
                पदभार सौंपें (CONFIRM)
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ------------------------------------------------------------- */}
      {/* MODAL: TRANSFER LEADERSHIP SAFEGUARD */}
      {/* ------------------------------------------------------------- */}
      {showLeadershipTransferModal && (
        <div className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center p-4 backdrop-blur-sm animate-fadeIn">
          <div className="bg-navy-900 border border-rose-500/50 rounded-3xl p-5 w-full max-w-sm space-y-4 shadow-2xl">
            <div className="flex items-center gap-2 text-rose-400 text-sm font-black">
              <AlertCircle size={18} />
              <span>पार्टी राष्ट्रीय अध्यक्ष पद हस्तांतरण</span>
            </div>

            <p className="text-xs text-slate-300">
              क्या आप वाकई पार्टी का राष्ट्रीय अध्यक्ष पद किसी अन्य साथी को सौंपना चाहते हैं? इसके पश्चात वे पार्टी के सर्वोच्च निर्णयकर्ता होंगे।
            </p>

            <div>
              <label className="text-[10px] text-slate-400 font-bold block mb-1">नया राष्ट्रीय अध्यक्ष चुनें:</label>
              <select
                onChange={(e) => {
                  const target = partyData.members.find(m => m.id === e.target.value);
                  setTransferTarget(target || null);
                }}
                className="w-full bg-navy-950 border border-slate-700 rounded-xl px-2.5 py-1.5 text-xs text-white outline-none"
              >
                <option value="">-- साथी का चयन करें --</option>
                {partyData.members
                  .filter(m => m.id !== currentAccount.id)
                  .map(m => (
                    <option key={m.id} value={m.id}>
                      {m.username} ({m.roleTitleHi})
                    </option>
                  ))}
              </select>
            </div>

            <div className="flex items-center gap-2 pt-2">
              <button
                onClick={() => setShowLeadershipTransferModal(false)}
                className="flex-1 py-2 rounded-xl bg-slate-800 text-slate-300 text-xs font-bold"
              >
                रद्द करें
              </button>
              <button
                disabled={!transferTarget}
                onClick={handleTransferLeadership}
                className="flex-1 py-2 rounded-xl bg-rose-600 disabled:opacity-40 text-white text-xs font-black shadow"
              >
                हस्तांतरित करें (CONFIRM)
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
