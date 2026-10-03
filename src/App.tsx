import React, { useState, useEffect } from 'react';
import { I18nProvider } from './locales/i18n';
import { MobileFrame } from './components/common/MobileFrame';
import { HeaderBar } from './components/common/HeaderBar';
import { BottomNav, NavTab } from './components/common/BottomNav';
import { ModalDecision } from './components/common/ModalDecision';
import { NotificationToast } from './components/common/NotificationToast';
import { CinematicOpening } from './components/opening/CinematicOpening';
import { CharacterCreation } from './components/creation/CharacterCreation';
import { PartyCreation } from './components/creation/PartyCreation';
import { HomeScreen } from './components/dashboard/HomeScreen';
import { IndiaMap } from './components/map/IndiaMap';
import { CampaignScreen } from './components/campaign/CampaignScreen';
import { MediaCenter } from './components/campaign/MediaCenter';
import { TrainingScreen } from './components/campaign/TrainingScreen';
import { ElectionCommissionModal } from './components/election/ElectionCommissionModal';
import { ElectionDayLive } from './components/election/ElectionDayLive';
import { ElectionCampaign7DayScreen } from './components/election/ElectionCampaign7DayScreen';
import { PMDashboard } from './components/governance/PMDashboard';
import { BudgetScreen } from './components/governance/BudgetScreen';
import { ParliamentScreen } from './components/governance/ParliamentScreen';
import { CabinetScreen } from './components/governance/CabinetScreen';
import { PoliticalQuizModal } from './components/quiz/PoliticalQuizModal';
import { ProfileScreen } from './components/profile/ProfileScreen';
import { DynamicBackground, BackgroundMode, CrisisAtmosphere } from './components/common/DynamicBackground';
import { PartyOrganizationScreen } from './components/party/PartyOrganizationScreen';
import { MultiplayerPartyScreen } from './components/multiplayer/MultiplayerPartyScreen';
import { PolicyScreen } from './components/governance/PolicyScreen';
import { CoalitionNegotiationModal } from './components/governance/CoalitionNegotiationModal';
import { TutorialModal } from './components/common/TutorialModal';
import { CoalitionPartner } from './engine/coalitionEngine';
import { INITIAL_PARTY_MEMBERS, PartyMember } from './engine/partyMemberEngine';
import { INITIAL_MULTIPLAYER_MEMBERS, MultiplayerFriend } from './engine/multiplayerPartyEngine';

import {
  GameStage,
  PlayerProfile,
  PoliticalParty,
  DemographicSupport,
  Constituency,
  OppositionParty,
  Achievement,
  CampaignAction,
  PoliticalLevel,
  PlayerStats,
} from './types/game';
import { GameEvent, EventChoice, NewsNotification } from './types/events';
import { NationalMetrics, BudgetAllocation } from './types/parliament';
import { TrainingProgram } from './types/quiz';
import {
  INITIAL_CONSTITUENCIES,
  INITIAL_OPPOSITION_PARTIES,
  INITIAL_ACHIEVEMENTS,
} from './engine/initialData';
import { DYNAMIC_EVENTS } from './engine/eventEngine';
import { calculateElectionOutcome, ElectionResult } from './engine/electionEngine';
import { calculateEconomicTrends } from './engine/economyEngine';
import { sound } from './audio/soundEffects';

const INITIAL_DEMOGRAPHICS: DemographicSupport = {
  youth: 45,
  rural: 42,
  urban: 40,
  farmers: 44,
  workers: 46,
  business: 38,
};

const INITIAL_METRICS: NationalMetrics = {
  gdpGrowthRate: 7.2,
  inflationRate: 4.8,
  unemploymentRate: 5.4,
  nationalDebtPercent: 54.2,
  publicApproval: 68,
  fiscalDeficit: 5.1,
  foreignReserves: 640,
};

const INITIAL_BUDGET: BudgetAllocation = {
  education: 15,
  healthcare: 15,
  infrastructure: 20,
  agriculture: 15,
  technology: 10,
  defence: 10,
  environment: 5,
  socialWelfare: 5,
  homeAffairs: 5,
};

export const AppContent: React.FC = () => {
  // Game Stage Router
  const [stage, setStage] = useState<GameStage>(() => {
    const saved = localStorage.getItem('rn_stage');
    return (saved as GameStage) || 'CINEMATIC';
  });

  const [currentTab, setCurrentTab] = useState<NavTab>('HOME');

  // Player & Party State
  const [player, setPlayer] = useState<PlayerProfile>(() => {
    const saved = localStorage.getItem('rn_player');
    if (saved) {
      try { return JSON.parse(saved); } catch {}
    }
    return {
      name: 'देवराज चौहान',
      age: 32,
      gender: 'MALE',
      state: 'Uttar Pradesh',
      district: 'वाराणसी (Varanasi)',
      constituency: 'काशीपुर (Kashipur)',
      education: 'विधि स्नातक (LL.B.)',
      occupation: 'सामाजिक कार्यकर्ता',
      background: 'नागरिक अधिकार मंच',
      stats: {
        leadership: 55,
        communication: 60,
        politicalKnowledge: 55,
        publicTrust: 65,
        strategy: 50,
        administration: 48,
        finance: 45,
        crisisManagement: 50,
      },
      resources: {
        money: 150000,
        partyFunds: 50000,
        workers: 80,
        volunteers: 350,
        influence: 30,
        energy: 100,
      },
      level: 1,
      positionTitle: 'आम नागरिक',
      positionTitleEn: 'Common Citizen',
    };
  });

  const [party, setParty] = useState<PoliticalParty | null>(() => {
    const saved = localStorage.getItem('rn_party');
    if (saved) {
      try { return JSON.parse(saved); } catch {}
    }
    return null;
  });

  const [support, setSupport] = useState<DemographicSupport>(() => {
    const saved = localStorage.getItem('rn_support');
    if (saved) {
      try { return JSON.parse(saved); } catch {}
    }
    return INITIAL_DEMOGRAPHICS;
  });

  const [constituencies, setConstituencies] = useState<Constituency[]>(() => {
    const saved = localStorage.getItem('rn_constituencies');
    if (saved) {
      try { return JSON.parse(saved); } catch {}
    }
    return INITIAL_CONSTITUENCIES;
  });

  const [opposition, setOpposition] = useState<OppositionParty[]>(INITIAL_OPPOSITION_PARTIES);
  const [achievements, setAchievements] = useState<Achievement[]>(INITIAL_ACHIEVEMENTS);
  const [nationalMetrics, setNationalMetrics] = useState<NationalMetrics>(INITIAL_METRICS);
  const [budget, setBudget] = useState<BudgetAllocation>(INITIAL_BUDGET);

  const [daysToElection, setDaysToElection] = useState<number>(() => {
    const saved = localStorage.getItem('rn_election_days');
    return saved ? parseInt(saved) : 25;
  });

  // Overlays / Sub-screens
  const [activeEvent, setActiveEvent] = useState<GameEvent | null>(null);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showElectionCommission, setShowElectionCommission] = useState(false);
  const [electionResult, setElectionResult] = useState<ElectionResult | null>(null);
  const [subView, setSubView] = useState<'NONE' | 'MEDIA' | 'TRAINING' | 'BUDGET' | 'PARLIAMENT' | 'CABINET' | 'POLICIES'>('NONE');
  const [showTutorial, setShowTutorial] = useState(false);
  const [showCoalition, setShowCoalition] = useState(false);
  const [partySubTab, setPartySubTab] = useState<'ORGANIZATION' | 'MULTIPLAYER' | 'DETAILS'>('ORGANIZATION');
  const [coalitionAllies, setCoalitionAllies] = useState<CoalitionPartner[]>([]);

  // Party Cadres & Multiplayer Friends State
  const [partyMembers, setPartyMembers] = useState<PartyMember[]>(() => {
    const saved = localStorage.getItem('rn_party_members');
    return saved ? JSON.parse(saved) : INITIAL_PARTY_MEMBERS;
  });

  const [multiplayerFriends, setMultiplayerFriends] = useState<MultiplayerFriend[]>(() => {
    const saved = localStorage.getItem('rn_multiplayer_party');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        return parsed.members || parsed.friends || INITIAL_MULTIPLAYER_MEMBERS;
      } catch {}
    }
    return INITIAL_MULTIPLAYER_MEMBERS;
  });

  // Background Animation Preview Controls & Accessibility
  const [bgOverride, setBgOverride] = useState<BackgroundMode | null>(null);
  const [crisisOverride, setCrisisOverride] = useState<CrisisAtmosphere>('NONE');
  const [reducedMotion, setReducedMotion] = useState(false);
  const [showBgTester, setShowBgTester] = useState(false);

  // Notifications
  const [notifications, setNotifications] = useState<NewsNotification[]>([
    {
      id: 'n1',
      titleHi: 'निर्वाचन आयोग द्वारा आगामी चुनाव हेतु अधिसूचना जारी।',
      titleEn: 'Election Commission notifies upcoming assembly election schedule.',
      type: 'ELECTION',
      timestamp: '10:00 AM',
      isRead: false,
    },
    {
      id: 'n2',
      titleHi: 'विपक्षी दल ने आपकी नई नीतियों पर सवाल उठाए।',
      titleEn: 'Opposition criticizes your newly announced welfare scheme.',
      type: 'OPPOSITION',
      timestamp: 'Yesterday',
      isRead: false,
    }
  ]);

  // Persist State
  const saveGameState = () => {
    localStorage.setItem('rn_stage', stage);
    localStorage.setItem('rn_player', JSON.stringify(player));
    if (party) localStorage.setItem('rn_party', JSON.stringify(party));
    localStorage.setItem('rn_support', JSON.stringify(support));
    localStorage.setItem('rn_constituencies', JSON.stringify(constituencies));
    localStorage.setItem('rn_election_days', daysToElection.toString());
  };

  useEffect(() => {
    saveGameState();
  }, [stage, player, party, support, daysToElection]);

  // Random Crisis Event Generator (Every 4-5 turns or on certain days)
  const triggerRandomEventCheck = () => {
    if (Math.random() < 0.35 && !activeEvent) {
      const randomEvt = DYNAMIC_EVENTS[Math.floor(Math.random() * DYNAMIC_EVENTS.length)];
      setActiveEvent(randomEvt);
    }
  };

  // Day Loop Advance
  const handleAdvanceDay = () => {
    setDaysToElection((prev) => {
      const nextDays = prev - 1;
      if (nextDays <= 0) {
        handleStartElection();
        return 0;
      }
      return nextDays;
    });

    // Replenish energy daily
    setPlayer((prev) => ({
      ...prev,
      resources: {
        ...prev.resources,
        energy: Math.min(100, prev.resources.energy + 35),
      },
    }));

    triggerRandomEventCheck();
  };

  // Execute Campaign Action
  const handleExecuteCampaign = (act: CampaignAction) => {
    setPlayer((prev) => ({
      ...prev,
      stats: {
        ...prev.stats,
        publicTrust: Math.min(100, prev.stats.publicTrust + act.trustGain),
      },
      resources: {
        ...prev.resources,
        energy: Math.max(0, prev.resources.energy - act.energyCost),
        money: party ? prev.resources.money : Math.max(0, prev.resources.money - act.cost),
        partyFunds: party ? Math.max(0, prev.resources.partyFunds - act.cost) : prev.resources.partyFunds,
      },
    }));

    if (party) {
      setParty((prev) => prev ? ({
        ...prev,
        popularity: Math.min(100, prev.popularity + act.popularityGain),
        readiness: Math.min(100, prev.readiness + 5),
      }) : null);
    }

    // Boost targeted demographic support
    setSupport((prev) => ({
      ...prev,
      [act.targetGroup]: Math.min(100, prev[act.targetGroup] + 8),
    }));

    // Advance days
    setDaysToElection((prev) => Math.max(0, prev - act.daysCost));
  };

  // Trigger 7-Day Election Campaign & Risk System
  const handleStartElection = () => {
    sound.playRally();
    setStage('ELECTION_DAY');
  };

  // Election Victory Handling
  const handleElectionVictory = () => {
    // Elevate player level!
    const nextLevel = Math.min(12, player.level + 1) as PoliticalLevel;
    const isNowPM = nextLevel >= 10;

    setPlayer((prev) => ({
      ...prev,
      level: nextLevel,
      positionTitle: nextLevel === 4 ? 'विधायक (जनप्रतिनिधि)' : isNowPM ? 'भारत के प्रधानमंत्री' : 'लोकसभा सांसद (MP)',
      positionTitleEn: nextLevel === 4 ? 'Elected MLA' : isNowPM ? 'Prime Minister of Bharat' : 'Member of Parliament (MP)',
      resources: {
        ...prev.resources,
        money: prev.resources.money + 500000,
        partyFunds: prev.resources.partyFunds + 1500000,
        influence: Math.min(100, prev.resources.influence + 20),
        workers: prev.resources.workers + 150,
      },
      stats: {
        ...prev.stats,
        leadership: Math.min(100, prev.stats.leadership + 10),
        publicTrust: Math.min(100, prev.stats.publicTrust + 12),
      }
    }));

    // Reset next election cycle
    setDaysToElection(30);
    setElectionResult(null);
    setStage('MAIN_GAME');

    // If PM, default to Government tab
    if (isNowPM) {
      setCurrentTab('GOVERNMENT');
    } else {
      setCurrentTab('HOME');
    }
  };

  // Event Choice Execution
  const handleSelectEventChoice = (choice: EventChoice) => {
    if (choice.trustChange) {
      setPlayer((prev) => ({
        ...prev,
        stats: {
          ...prev.stats,
          publicTrust: Math.min(100, Math.max(10, prev.stats.publicTrust + (choice.trustChange || 0))),
        },
        resources: {
          ...prev.resources,
          money: party ? prev.resources.money : Math.max(0, prev.resources.money - choice.cost),
          partyFunds: party ? Math.max(0, prev.resources.partyFunds - choice.cost) : prev.resources.partyFunds,
        }
      }));
    }
    if (choice.supportChanges) {
      setSupport((prev) => ({
        ...prev,
        ...choice.supportChanges,
      }));
    }
    setActiveEvent(null);
  };

  const handleEnrollTraining = (prog: TrainingProgram) => {
    setPlayer((prev) => ({
      ...prev,
      stats: {
        ...prev.stats,
        [prog.targetStat]: Math.min(100, prev.stats[prog.targetStat] + prog.statBoost),
      },
      resources: {
        ...prev.resources,
        money: Math.max(0, prev.resources.money - prog.cost),
        energy: Math.max(0, prev.resources.energy - prog.energyCost),
      },
    }));
    setDaysToElection((prev) => Math.max(0, prev - prog.timeDays));
    setSubView('NONE');
  };

  const handleApplyBudget = (newBudget: BudgetAllocation) => {
    setBudget(newBudget);
    const updatedMetrics = calculateEconomicTrends(nationalMetrics, newBudget);
    setNationalMetrics(updatedMetrics);
  };

  const isPM = player.level >= 10;

  const getCrisisAtmosphere = (): CrisisAtmosphere => {
    if (crisisOverride !== 'NONE') return crisisOverride;
    if (!activeEvent) return 'NONE';
    const text = (((activeEvent as any).headlineHi || '') + ' ' + ((activeEvent as any).descriptionHi || '')).toLowerCase();
    if (text.includes('बाढ़') || text.includes('जल') || text.includes('बारिश')) return 'FLOOD';
    if (text.includes('सूखा') || text.includes('गर्मी')) return 'DROUGHT';
    if (text.includes('तूफान') || text.includes('चक्रवात')) return 'CYCLONE';
    if (text.includes('अर्थव्यवस्था') || text.includes('महंगाई') || text.includes('बजट') || text.includes('आर्थिक')) return 'ECONOMIC';
    return 'POLITICAL';
  };

  const getBackgroundMode = (): BackgroundMode => {
    if (bgOverride) return bgOverride;
    if (stage === 'ELECTION_DAY') return 'ELECTION';
    if (activeEvent) return 'CRISIS';
    if (subView === 'MEDIA') return 'MEDIA';
    if (subView === 'PARLIAMENT' || subView === 'CABINET' || subView === 'POLICIES') return 'GOVERNMENT';
    if (currentTab === 'MAP') return 'MAP';
    if (currentTab === 'CAMPAIGN') return 'CAMPAIGN';
    if (currentTab === 'GOVERNMENT' || currentTab === 'PARLIAMENT') return 'GOVERNMENT';
    return 'HOME';
  };

  return (
    <MobileFrame>
      {/* Ambient Dynamic Background System (10 Modes & Situations) */}
      <DynamicBackground 
        mode={getBackgroundMode()} 
        crisisType={getCrisisAtmosphere()}
        reducedMotion={reducedMotion}
      />

      {/* 1. CINEMATIC OPENING */}
      {stage === 'CINEMATIC' && (
        <CinematicOpening onStartGame={() => setStage('CHARACTER_CREATION')} />
      )}

      {/* 2. CHARACTER CREATION */}
      {stage === 'CHARACTER_CREATION' && (
        <CharacterCreation
          onComplete={(profile) => {
            setPlayer(profile);
            setStage('PARTY_CREATION');
          }}
        />
      )}

      {/* 3. PARTY CREATION */}
      {stage === 'PARTY_CREATION' && (
        <PartyCreation
          onComplete={(newParty) => {
            setParty(newParty);
            setStage('MAIN_GAME');
          }}
        />
      )}

      {/* 4. MAIN GAME ENGINE */}
      {stage === 'MAIN_GAME' && (
        <div className="flex-1 flex flex-col h-full overflow-hidden relative z-10">
          {/* Top Status Header */}
          <HeaderBar
            player={player}
            party={party}
            daysToElection={daysToElection}
            onOpenNotifications={() => setShowNotifications(true)}
            unreadCount={notifications.filter(n => !n.isRead).length}
            onOpenTutorial={() => setShowTutorial(true)}
          />

          {/* Viewport Sub-Views or Navigation Tabs */}
          <div className="flex-1 flex flex-col overflow-hidden relative">
            {subView === 'MEDIA' ? (
              <MediaCenter
                onBack={() => setSubView('NONE')}
                onHoldPressConference={() => {
                  handleExecuteCampaign({
                    id: 'MEDIA_CAMPAIGN',
                    titleHi: 'प्रेस कॉन्फ्रेंस',
                    titleEn: 'Press Conference',
                    descHi: 'नीतियों का खुलासा',
                    descEn: 'Policy announcement',
                    cost: 25000,
                    energyCost: 20,
                    workersCost: 5,
                    daysCost: 1,
                    trustGain: 8,
                    popularityGain: 12,
                    mediaGain: 20,
                    targetGroup: 'urban',
                    icon: 'tv',
                  });
                  setSubView('NONE');
                }}
                onGiveInterview={() => {
                  handleExecuteCampaign({
                    id: 'DEBATE',
                    titleHi: 'विशेष टीवी साक्षात्कार',
                    titleEn: 'Exclusive TV Interview',
                    descHi: 'एक-पर-एक संवाद',
                    descEn: 'One-on-one interview',
                    cost: 10000,
                    energyCost: 15,
                    workersCost: 2,
                    daysCost: 1,
                    trustGain: 7,
                    popularityGain: 10,
                    mediaGain: 18,
                    targetGroup: 'youth',
                    icon: 'tv',
                  });
                  setSubView('NONE');
                }}
                onIssueRelease={() => {
                  setPlayer((prev) => ({
                    ...prev,
                    resources: {
                      ...prev.resources,
                      money: Math.max(0, prev.resources.money - 5000),
                    },
                  }));
                  setSubView('NONE');
                }}
              />
            ) : subView === 'TRAINING' ? (
              <TrainingScreen
                player={player}
                onBack={() => setSubView('NONE')}
                onEnrollTraining={handleEnrollTraining}
              />
            ) : subView === 'BUDGET' ? (
              <BudgetScreen
                currentBudget={budget}
                onBack={() => setSubView('NONE')}
                onApplyBudget={handleApplyBudget}
              />
            ) : subView === 'PARLIAMENT' ? (
              <ParliamentScreen
                onBack={() => setSubView('NONE')}
                govSeats={isPM ? 285 : 180}
              />
            ) : subView === 'CABINET' ? (
              <CabinetScreen
                onBack={() => setSubView('NONE')}
              />
            ) : subView === 'POLICIES' ? (
              <PolicyScreen
                metrics={nationalMetrics}
                onUpdateMetrics={(newM) => setNationalMetrics(newM)}
                onBack={() => setSubView('NONE')}
              />
            ) : (
              /* Regular Main Navigation Tabs */
              <>
                {currentTab === 'HOME' && (
                  <HomeScreen
                    player={player}
                    party={party}
                    support={support}
                    daysToElection={daysToElection}
                    onNavigate={(tab) => setCurrentTab(tab)}
                    onAdvanceDay={handleAdvanceDay}
                    onOpenElectionCommission={() => setShowElectionCommission(true)}
                    onStartElectionDay={handleStartElection}
                  />
                )}

                {currentTab === 'MAP' && (
                  <IndiaMap
                    constituencies={constituencies}
                    player={player}
                    party={party}
                    onSelectConstituency={(seat) => {
                      setPlayer(p => ({ ...p, constituency: seat.name }));
                    }}
                    onStartCampaignAction={() => setCurrentTab('CAMPAIGN')}
                  />
                )}

                {currentTab === 'CAMPAIGN' && (
                  <CampaignScreen
                    player={player}
                    party={party}
                    onExecuteAction={handleExecuteCampaign}
                    onOpenMediaCenter={() => setSubView('MEDIA')}
                    onOpenTraining={() => setSubView('TRAINING')}
                    onStart7DayCampaign={handleStartElection}
                  />
                )}

                {currentTab === 'PARTY' && (
                  <div className="flex-1 flex flex-col overflow-hidden bg-navy-950 text-slate-100">
                    {/* Party Module Sub-Tabs */}
                    <div className="p-2 bg-navy-900/90 border-b border-slate-800 flex space-x-1.5 overflow-x-auto no-scrollbar">
                      <button
                        onClick={() => { sound.playClick(); setPartySubTab('ORGANIZATION'); }}
                        className={`flex-1 py-1.5 px-3 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                          partySubTab === 'ORGANIZATION'
                            ? 'bg-gradient-to-r from-saffron to-amber-500 text-navy-950 font-black shadow'
                            : 'bg-navy-950 text-slate-400 hover:text-white border border-slate-800'
                        }`}
                      >
                        🏛️ संगठन व कार्यकर्ता
                      </button>
                      <button
                        onClick={() => { sound.playClick(); setPartySubTab('MULTIPLAYER'); }}
                        className={`flex-1 py-1.5 px-3 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                          partySubTab === 'MULTIPLAYER'
                            ? 'bg-gradient-to-r from-saffron to-amber-500 text-navy-950 font-black shadow'
                            : 'bg-navy-950 text-slate-400 hover:text-white border border-slate-800'
                        }`}
                      >
                        🤝 सह-प्रबंधन (Friends)
                      </button>
                      <button
                        onClick={() => { sound.playClick(); setPartySubTab('DETAILS'); }}
                        className={`py-1.5 px-3 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                          partySubTab === 'DETAILS'
                            ? 'bg-gradient-to-r from-saffron to-amber-500 text-navy-950 font-black shadow'
                            : 'bg-navy-950 text-slate-400 hover:text-white border border-slate-800'
                        }`}
                      >
                        📊 विवरण
                      </button>
                    </div>

                    {/* Party Sub-View Render */}
                    <div className="flex-1 flex flex-col overflow-hidden">
                      {partySubTab === 'ORGANIZATION' && (
                        <PartyOrganizationScreen
                          player={player}
                          party={party}
                          onUpdatePartyFunds={(amt) => {
                            setPlayer(p => ({
                              ...p,
                              resources: { ...p.resources, partyFunds: Math.max(0, p.resources.partyFunds + amt) }
                            }));
                          }}
                          onBoostPartyPopularity={(amt) => {
                            setParty(p => p ? { ...p, popularity: Math.min(100, p.popularity + amt) } : null);
                          }}
                        />
                      )}

                      {partySubTab === 'MULTIPLAYER' && (
                        <MultiplayerPartyScreen
                          player={player}
                          party={party}
                          onBack={() => setPartySubTab('ORGANIZATION')}
                          onBoostFunds={(amt) => {
                            setPlayer(p => ({
                              ...p,
                              resources: { ...p.resources, partyFunds: p.resources.partyFunds + amt }
                            }));
                          }}
                          onBoostPopularity={(amt) => {
                            setParty(p => p ? { ...p, popularity: Math.min(100, p.popularity + amt) } : null);
                          }}
                        />
                      )}

                      {partySubTab === 'DETAILS' && (
                        <div className="flex-1 overflow-y-auto p-4 space-y-3">
                          <div className="p-4 rounded-3xl bg-navy-900 border border-slate-800 shadow-xl flex items-center justify-between">
                            <div>
                              <h2 className="text-xl font-black text-white">{party?.name}</h2>
                              <span className="text-xs text-amber-400 italic">"{party?.slogan}"</span>
                            </div>
                            <div className="w-10 h-10 rounded-2xl flex items-center justify-center font-black text-white" style={{ backgroundColor: party?.color }}>
                              {party?.shortName}
                            </div>
                          </div>

                          <div className="grid grid-cols-2 gap-2 text-xs">
                            <div className="p-3 bg-navy-900/80 rounded-2xl border border-slate-800">
                              <span className="text-slate-400 block text-[10px]">पार्टी फंड</span>
                              <span className="text-sm font-black text-emerald-400">₹{player.resources.partyFunds.toLocaleString('en-IN')}</span>
                            </div>
                            <div className="p-3 bg-navy-900/80 rounded-2xl border border-slate-800">
                              <span className="text-slate-400 block text-[10px]">सक्रिय कार्यकर्ता</span>
                              <span className="text-sm font-black text-amber-400">{player.resources.workers}</span>
                            </div>
                            <div className="p-3 bg-navy-900/80 rounded-2xl border border-slate-800">
                              <span className="text-slate-400 block text-[10px]">लोकप्रियता</span>
                              <span className="text-sm font-black text-saffron">{party?.popularity}%</span>
                            </div>
                            <div className="p-3 bg-navy-900/80 rounded-2xl border border-slate-800">
                              <span className="text-slate-400 block text-[10px]">चुनावी तैयारी</span>
                              <span className="text-sm font-black text-sky-400">{party?.readiness}%</span>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {currentTab === 'GOVERNMENT' && (
                  <PMDashboard
                    metrics={nationalMetrics}
                    player={player}
                    party={party}
                    onOpenBudget={() => setSubView('BUDGET')}
                    onOpenParliament={() => setSubView('PARLIAMENT')}
                    onOpenCabinet={() => setSubView('CABINET')}
                    onOpenPolicies={() => setSubView('POLICIES')}
                    onOpenCoalition={() => setShowCoalition(true)}
                  />
                )}

                {currentTab === 'PARLIAMENT' && (
                  <ParliamentScreen
                    onBack={() => setCurrentTab('HOME')}
                    govSeats={isPM ? 285 : 180}
                  />
                )}

                {currentTab === 'QUIZ' && (
                  <PoliticalQuizModal
                    onRewardEarned={(stat, amount) => {
                      setPlayer((prev) => ({
                        ...prev,
                        stats: {
                          ...prev.stats,
                          [stat]: Math.min(100, prev.stats[stat] + amount),
                        },
                      }));
                    }}
                  />
                )}

                {currentTab === 'PROFILE' && (
                  <ProfileScreen
                    player={player}
                    party={party}
                    achievements={achievements}
                    onManualSave={saveGameState}
                    onResetGame={() => {
                      localStorage.clear();
                      window.location.reload();
                    }}
                  />
                )}
              </>
            )}
          </div>

          {/* Bottom Navigation */}
          <BottomNav
            currentTab={currentTab}
            onSelectTab={(tab) => {
              setSubView('NONE');
              setCurrentTab(tab);
            }}
            isPM={isPM}
          />
        </div>
      )}

      {/* 5. 7-DAY ELECTION CAMPAIGN WAR ROOM & VOTING ENGINE */}
      {stage === 'ELECTION_DAY' && (
        <ElectionCampaign7DayScreen
          player={player}
          party={party}
          constituency={constituencies.find((c) => c.isPlayerHome) || constituencies[0]}
          support={support}
          partyMembers={partyMembers}
          multiplayerFriends={multiplayerFriends}
          onVictoryProceed={handleElectionVictory}
          onDefeatRebuild={() => {
            setDaysToElection(20);
            setStage('MAIN_GAME');
            setCurrentTab('PARTY');
            setNotifications(prev => [
              {
                id: 'rebuild-' + Date.now(),
                titleHi: 'विपक्ष के नेता के रूप में संगठन पुनः खड़ा करें! नए कार्यकर्ताओं को जोड़ें व आगामी चुनाव की तैयारी करें।',
                titleEn: 'Leader of Opposition path: Rebuild party organization and prepare for upcoming election.',
                type: 'ELECTION',
                timestamp: 'Just now',
                isRead: false,
              },
              ...prev,
            ]);
          }}
          onOpenPartyManagement={() => {
            setStage('MAIN_GAME');
            setCurrentTab('PARTY');
          }}
          onBackToHome={() => {
            setStage('MAIN_GAME');
            setCurrentTab('HOME');
          }}
        />
      )}

      {/* Background Modes & Atmospheric Conditions Preview Tester */}
      <div className="absolute top-2 right-2 z-40">
        <button
          onClick={() => setShowBgTester(prev => !prev)}
          className="px-2 py-1 rounded-full bg-navy-900/90 hover:bg-navy-800 border border-slate-700/80 text-saffron text-[10px] font-black uppercase tracking-wider flex items-center gap-1 shadow-lg backdrop-blur-md active:scale-95 transition-all"
        >
          <span>🎨 एनीमेशन</span>
          {bgOverride && <span className="w-1.5 h-1.5 rounded-full bg-amber-400"></span>}
        </button>
      </div>

      {showBgTester && (
        <div className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center p-4 backdrop-blur-sm animate-fadeIn">
          <div className="bg-navy-900 border border-slate-700 rounded-3xl p-4 w-full max-w-sm space-y-3 shadow-2xl max-h-[85vh] overflow-y-auto no-scrollbar">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2">
              <div>
                <h3 className="text-xs font-black text-white">🎨 बैकग्राउंड एनीमेशन सिस्टम</h3>
                <span className="text-[10px] text-slate-400">सभी 10 मोड व परिस्थितियां टेस्ट करें</span>
              </div>
              <button
                onClick={() => setShowBgTester(false)}
                className="text-slate-400 hover:text-white"
              >
                ✕
              </button>
            </div>

            {/* Reduced Motion Toggle */}
            <div className="flex items-center justify-between p-2 rounded-xl bg-navy-950 border border-slate-800 text-xs">
              <span className="text-slate-300 font-bold">कम गति मोड (Reduced Motion)</span>
              <button
                onClick={() => setReducedMotion(p => !p)}
                className={`px-2 py-0.5 rounded text-[10px] font-black transition-all ${
                  reducedMotion ? 'bg-amber-400 text-navy-950' : 'bg-slate-800 text-slate-400'
                }`}
              >
                {reducedMotion ? 'चालू (ON)' : 'बंद (OFF)'}
              </button>
            </div>

            {/* Auto Mode Button */}
            <button
              onClick={() => {
                setBgOverride(null);
                setCrisisOverride('NONE');
              }}
              className={`w-full py-2 px-3 rounded-xl border text-xs font-black text-left flex items-center justify-between transition-all ${
                !bgOverride ? 'bg-saffron text-navy-950 border-saffron' : 'bg-navy-950 text-slate-300 border-slate-800'
              }`}
            >
              <span>⚙️ स्वचालित मोड (Auto / Follows Game Mode)</span>
              {!bgOverride && <span>✓ सक्रिय</span>}
            </button>

            {/* 10 Modes List */}
            <div className="space-y-1.5 pt-1">
              <span className="text-[10px] font-black uppercase text-slate-400 tracking-wider block">
                मोड पूर्वावलोकन (Preview Modes)
              </span>

              {[
                { mode: 'HOME', label: '1. मुख्य मेनू (Home / India Map & Chakra)', crisis: 'NONE' },
                { mode: 'MAP', label: '2. मानचित्र मोड (Map / Influence Pulse)', crisis: 'NONE' },
                { mode: 'ELECTION', label: '3. चुनाव मोड (Election / Flags & Crowd)', crisis: 'NONE' },
                { mode: 'CAMPAIGN', label: '4. प्रचार मोड (Campaign / Rally & Vehicles)', crisis: 'NONE' },
                { mode: 'MEDIA', label: '5. मीडिया मोड (Media / Ticker & Flashes)', crisis: 'NONE' },
                { mode: 'CRISIS', label: '6a. संकट: बाढ़ (Flood / Rain & Ripples)', crisis: 'FLOOD' },
                { mode: 'CRISIS', label: '6b. संकट: सूखा (Drought / Arid Shimmer)', crisis: 'DROUGHT' },
                { mode: 'CRISIS', label: '6c. संकट: चक्रवात (Cyclone / Wind Vortex)', crisis: 'CYCLONE' },
                { mode: 'CRISIS', label: '6d. संकट: आर्थिक (Economic / Graph Drop)', crisis: 'ECONOMIC' },
                { mode: 'CRISIS', label: '6e. संकट: राजनीतिक (Political / Alerts)', crisis: 'POLITICAL' },
                { mode: 'GOVERNMENT', label: '7. प्रधानमंत्री/संसद मोड (Sansad & GDP Wave)', crisis: 'NONE' },
                { mode: 'SUCCESS', label: '8. विकास उत्सव (Success / Uplift & Sparkles)', crisis: 'NONE' },
                { mode: 'DISASTER_RESPONSE', label: '9. आपदा राहत सेवा (Disaster Response Radar)', crisis: 'NONE' },
              ].map((item, idx) => {
                const isActive = bgOverride === item.mode && crisisOverride === item.crisis;
                return (
                  <button
                    key={idx}
                    onClick={() => {
                      setBgOverride(item.mode as BackgroundMode);
                      setCrisisOverride(item.crisis as CrisisAtmosphere);
                    }}
                    className={`w-full py-1.5 px-2.5 rounded-xl border text-[11px] font-bold text-left flex items-center justify-between transition-all ${
                      isActive ? 'bg-amber-400 text-navy-950 border-amber-400 font-black' : 'bg-navy-950 text-slate-300 border-slate-800/80 hover:border-slate-700'
                    }`}
                  >
                    <span>{item.label}</span>
                    {isActive && <span>✓</span>}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Urgent Crisis & Decision Popup */}
      {activeEvent && (
        <ModalDecision
          event={activeEvent}
          onSelectChoice={handleSelectEventChoice}
          onDismiss={() => setActiveEvent(null)}
        />
      )}

      {/* Notifications Drawer */}
      {showNotifications && (
        <NotificationToast
          notifications={notifications}
          onDismiss={(id) => setNotifications(prev => prev.filter(n => n.id !== id))}
          onClearAll={() => setNotifications([])}
          onClose={() => setShowNotifications(false)}
        />
      )}

      {/* Election Commission Guidelines Modal */}
      {showElectionCommission && (
        <ElectionCommissionModal
          onClose={() => setShowElectionCommission(false)}
        />
      )}

      {/* Chanakya Niti Tutorial & Strategy Mentor Modal */}
      {showTutorial && (
        <TutorialModal onClose={() => setShowTutorial(false)} />
      )}

      {/* Lok Sabha 272 Majority Coalition Negotiation Modal */}
      {showCoalition && (
        <CoalitionNegotiationModal
          playerSeats={isPM ? 240 : (party?.readiness ? Math.round(party.readiness * 2.2) : 185)}
          onClose={() => setShowCoalition(false)}
          onAllianceFormed={(allies, totalSeats) => {
            setCoalitionAllies(allies);
            setNotifications(prev => [
              {
                id: 'coalition-' + Date.now(),
                titleHi: `ऐतिहासिक गठबंधन: ${allies.length} दलों के समर्थन से संसद में कुल ${totalSeats} सीटों का प्रचंड बहुमत स्थापित!`,
                titleEn: `Historic Coalition: Majority secured with ${totalSeats} seats supported by ${allies.length} regional allies!`,
                type: 'ELECTION',
                timestamp: 'Just now',
                isRead: false,
              },
              ...prev,
            ]);
          }}
        />
      )}
    </MobileFrame>
  );
};

export default function App() {
  return (
    <I18nProvider>
      <AppContent />
    </I18nProvider>
  );
}
