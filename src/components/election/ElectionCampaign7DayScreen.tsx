import React, { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import { 
  Calendar, Megaphone, Users, Award, ShieldAlert, Zap, IndianRupee, 
  Tv, Radio, MessageSquare, ChevronRight, CheckCircle2, XCircle, 
  RotateCcw, Sparkles, TrendingUp, AlertTriangle, HelpCircle, Trophy, 
  ArrowRight, Heart, Share2, Compass, Shield, UserCheck, BarChart3, Layers
} from 'lucide-react';
import { 
  Election7DayState, CampaignDay, CampaignPhase, CampaignDifficulty, 
  CAMPAIGN_STRATEGIES, GROUND_ACTIVITIES, MEDIA_OPTIONS, CAMPAIGN_CRISES, 
  DEBATE_QUESTIONS, calculate7DayElectionResult, CampaignStrategyOption, 
  GroundActivity, MediaOption, CrisisEvent, PostElectionScorecard
} from '../../engine/electionRiskEngine';
import { PlayerProfile, PoliticalParty, Constituency, DemographicSupport } from '../../types/game';
import { PartyMember } from '../../engine/partyMemberEngine';
import { MultiplayerFriend } from '../../engine/multiplayerPartyEngine';
import { sound } from '../../audio/soundEffects';
import { useI18n } from '../../locales/i18n';

interface ElectionCampaign7DayScreenProps {
  player: PlayerProfile;
  party: PoliticalParty | null;
  constituency: Constituency;
  support: DemographicSupport;
  partyMembers: PartyMember[];
  multiplayerFriends: MultiplayerFriend[];
  onVictoryProceed: () => void;
  onDefeatRebuild: () => void;
  onOpenPartyManagement?: () => void;
  onBackToHome?: () => void;
}

export const ElectionCampaign7DayScreen: React.FC<ElectionCampaign7DayScreenProps> = ({
  player,
  party,
  constituency,
  support,
  partyMembers,
  multiplayerFriends,
  onVictoryProceed,
  onDefeatRebuild,
  onOpenPartyManagement,
  onBackToHome,
}) => {
  const { language } = useI18n();

  // State initialization
  const [state, setState] = useState<Election7DayState>(() => {
    return {
      difficulty: 'NORMAL',
      currentDay: 1,
      phase: 'DAY_1_STRATEGY',
      constituency,
      population: constituency.voterCount || 240000,
      localIssues: [
        'युवा रोजगार व औद्योगिक अवसर',
        'किसानों हेतु सिंचाई व मंडी सुविधा',
        'पेयजल व जर्जर ग्रामीण सड़कें',
        'प्राथमिक स्वास्थ्य केंद्रों में डॉक्टरों की कमी'
      ],
      localIssuesEn: [
        'Youth employment & industrial jobs',
        'Irrigation & crop market access',
        'Drinking water & rural roads',
        'Doctor shortages in health centers'
      ],
      budget: party ? player.resources.partyFunds : player.resources.money,
      volunteers: player.resources.volunteers || 350,
      partyMembersCount: partyMembers.length || 6,
      energy: player.resources.energy || 100,
      publicTrust: player.stats.publicTrust || 60,
      candidatePopularity: 52,
      partyPopularity: party?.popularity || 50,
      mediaReputation: 55,
      groundInfluence: 48,
      opponentCandidateName: 'ठाकुर वीरेंद्र सिंह',
      opponentPartyName: 'राष्ट्रीय प्रगति मोर्चा',
      opponentStrength: 68,
      opponentStrategyHi: 'पारंपरिक जातिगत समीकरण व धनबल आधारित रैलियां',
      groundActivitiesChosen: [],
      mediaOptionsChosen: [],
      debateScore: 0,
      assignedRoles: {
        seniorLeader: partyMembers[0]?.name || 'वरिष्ठ सलाहकार',
        stateLeader: partyMembers[1]?.name || 'प्रदेश प्रभारी',
        districtLeader: partyMembers[2]?.name || 'जिला अध्यक्ष',
        campaignManager: multiplayerFriends[0]?.username || 'रणनीतिकार',
        mediaManager: multiplayerFriends[1]?.username || 'मुख्य मीडिया प्रभारी',
        volunteersLead: 'बूथ प्रमुख',
      },
      multiplayerContributionBonus: multiplayerFriends.reduce((acc, f) => acc + (f.contributedPopularity || 2), 0),
    };
  });

  // Counting round tracker for live voting sequence
  const [countingRound, setCountingRound] = useState(1);
  const [countingComplete, setCountingComplete] = useState(false);

  // Selected debate answers
  const [currentDebateQIndex, setCurrentDebateQIndex] = useState(0);
  const [debateAnswers, setDebateAnswers] = useState<Record<string, string>>({});

  // Active crisis selection
  const [activeCrisis] = useState<CrisisEvent>(() => {
    return CAMPAIGN_CRISES[Math.floor(Math.random() * CAMPAIGN_CRISES.length)];
  });

  // Sound triggers on phase transition
  const handleTransitionPhase = (nextDay: CampaignDay, nextPhase: CampaignPhase) => {
    sound.playSelect();
    setState(prev => ({
      ...prev,
      currentDay: nextDay,
      phase: nextPhase,
      energy: Math.min(100, prev.energy + 30), // Daily recharge
    }));
  };

  // Day 1: Choose strategy
  const handleSelectStrategy = (strat: CampaignStrategyOption) => {
    sound.playSuccess();
    setState(prev => ({
      ...prev,
      chosenStrategy: strat,
      budget: Math.max(0, prev.budget - strat.cost),
      publicTrust: Math.min(100, prev.publicTrust + strat.trustImpact),
      candidatePopularity: Math.min(100, prev.candidatePopularity + strat.popularityImpact),
      currentDay: 2,
      phase: 'DAY_2_GROUND',
      energy: Math.min(100, prev.energy + 20),
    }));
  };

  // Day 2: Execute ground activity
  const handleGroundActivity = (act: GroundActivity) => {
    if (state.budget < act.cost || state.energy < act.energyCost) {
      sound.playClick();
      return;
    }
    sound.playRally();
    setState(prev => ({
      ...prev,
      budget: prev.budget - act.cost,
      energy: Math.max(0, prev.energy - act.energyCost),
      volunteers: Math.max(10, prev.volunteers - 5),
      publicTrust: Math.min(100, prev.publicTrust + act.trustGain),
      groundInfluence: Math.min(100, prev.groundInfluence + act.localSupportGain),
      mediaReputation: Math.min(100, prev.mediaReputation + act.mediaGain),
      groundActivitiesChosen: [...prev.groundActivitiesChosen, act.id],
    }));
  };

  // Day 3: Execute media campaign
  const handleMediaOption = (med: MediaOption) => {
    if (state.budget < med.cost) {
      sound.playClick();
      return;
    }
    sound.playSelect();
    const isSlip = Math.random() * 100 < med.riskPercent;
    setState(prev => ({
      ...prev,
      budget: prev.budget - med.cost,
      mediaReputation: isSlip ? Math.max(20, prev.mediaReputation - 5) : Math.min(100, prev.mediaReputation + med.reputationGain),
      candidatePopularity: Math.min(100, prev.candidatePopularity + 6),
      mediaOptionsChosen: [...prev.mediaOptionsChosen, med.id],
      mediaEventHandled: isSlip ? 'MISUNDERSTOOD' : 'CLEAN',
    }));
  };

  // Day 4: React to opposition counter
  const handleOppositionReaction = (choiceType: 'FACT_CHECK' | 'BOOTH_DEFENCE' | 'POSITIVE_VISION') => {
    sound.playClick();
    if (choiceType === 'FACT_CHECK') {
      setState(prev => ({
        ...prev,
        budget: Math.max(0, prev.budget - 8000),
        mediaReputation: Math.min(100, prev.mediaReputation + 8),
        publicTrust: Math.min(100, prev.publicTrust + 5),
      }));
    } else if (choiceType === 'BOOTH_DEFENCE') {
      setState(prev => ({
        ...prev,
        volunteers: Math.max(20, prev.volunteers - 20),
        groundInfluence: Math.min(100, prev.groundInfluence + 10),
      }));
    } else {
      setState(prev => ({
        ...prev,
        candidatePopularity: Math.min(100, prev.candidatePopularity + 8),
        publicTrust: Math.min(100, prev.publicTrust + 8),
      }));
    }
    handleTransitionPhase(5, 'DAY_5_CRISIS');
  };

  // Day 5: Resolve crisis event
  const handleResolveCrisis = (choiceId: string) => {
    const choice = activeCrisis.choices.find(c => c.id === choiceId);
    if (!choice) return;
    sound.playSuccess();

    setState(prev => ({
      ...prev,
      budget: Math.max(0, prev.budget - choice.fundsCost),
      volunteers: Math.max(10, prev.volunteers - choice.volunteersCost),
      publicTrust: Math.min(100, Math.max(10, prev.publicTrust + choice.trustChange)),
      candidatePopularity: Math.min(100, Math.max(10, prev.candidatePopularity + choice.supportChange)),
      mediaReputation: Math.min(100, Math.max(10, prev.mediaReputation + choice.reputationChange)),
      crisisEventHandled: choiceId,
    }));

    handleTransitionPhase(6, 'DAY_6_DEBATE');
  };

  // Day 6: Answer debate question
  const handleDebateAnswer = (optionId: string) => {
    sound.playSelect();
    const currQ = DEBATE_QUESTIONS[currentDebateQIndex];
    const opt = currQ.options.find(o => o.id === optionId);
    if (!opt) return;

    const skillBoost = (player.stats[opt.requiredSkill] || 50) / 100;
    const scoredTrust = Math.round(opt.trustGain * (0.8 + skillBoost * 0.4));
    const scoredRep = Math.round(opt.reputationGain * (0.8 + skillBoost * 0.4));

    setDebateAnswers(prev => ({ ...prev, [currQ.id]: optionId }));
    setState(prev => ({
      ...prev,
      debateScore: prev.debateScore + scoredTrust,
      publicTrust: Math.min(100, Math.max(10, prev.publicTrust + scoredTrust)),
      mediaReputation: Math.min(100, Math.max(10, prev.mediaReputation + scoredRep)),
    }));

    if (currentDebateQIndex < DEBATE_QUESTIONS.length - 1) {
      setCurrentDebateQIndex(prev => prev + 1);
    } else {
      // Debate completed -> go to Day 7 Voting Day
      handleTransitionPhase(7, 'DAY_7_VOTING');
    }
  };

  // Day 7: Start vote counting sequence
  const handleStartVoteCounting = () => {
    sound.playClick();
    const result = calculate7DayElectionResult(
      state,
      player,
      party,
      partyMembers,
      multiplayerFriends
    );

    setState(prev => ({
      ...prev,
      phase: 'COUNTING',
      isWon: result.isWon,
      totalVotesPolled: result.totalVotesPolled,
      playerVotes: result.playerVotes,
      playerVoteShare: result.playerVoteShare,
      opponentVotes: result.opponentVotes,
      opponentVoteShare: result.opponentVoteShare,
      margin: result.margin,
      turnoutPercent: result.turnoutPercent,
      scorecard: result.scorecard,
    }));

    setCountingRound(1);
    setCountingComplete(false);
  };

  // 5-Round Counting Sequence
  useEffect(() => {
    if (state.phase !== 'COUNTING') return;

    const timer = setInterval(() => {
      setCountingRound(prev => {
        if (prev >= 5) {
          clearInterval(timer);
          setCountingComplete(true);
          if (state.isWon) {
            sound.playVictory();
            try {
              confetti({
                particleCount: 150,
                spread: 80,
                origin: { y: 0.6 },
                colors: ['#FF671F', '#FFFFFF', '#046A38', '#D4AF37']
              });
            } catch {}
          }
          return 5;
        }
        sound.playClick();
        return prev + 1;
      });
    }, 1100);

    return () => clearInterval(timer);
  }, [state.phase, state.isWon]);

  const countingFraction = countingRound / 5;
  const currentDisplayedPlayerVotes = Math.round((state.playerVotes || 0) * countingFraction);
  const currentDisplayedOpponentVotes = Math.round((state.opponentVotes || 0) * countingFraction);

  return (
    <div className="flex-1 flex flex-col h-full bg-navy-950 text-slate-100 overflow-y-auto no-scrollbar relative z-10 p-3 pb-8">
      {/* ------------------------------------------------------------- */}
      {/* TOP CAMPAIGN WAR ROOM HEADER */}
      {/* ------------------------------------------------------------- */}
      <div className="bg-navy-900/90 border border-slate-800 rounded-3xl p-3.5 mb-3 shadow-xl backdrop-blur-md">
        <div className="flex items-center justify-between gap-2 mb-2">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-1 rounded-full bg-saffron/20 border border-saffron/40 text-saffron text-[10px] font-black uppercase tracking-wider flex items-center gap-1">
              <Calendar size={12} />
              <span>DAY {state.currentDay}/7 • चुनावी समर</span>
            </span>
            <span className="text-[10px] px-2 py-0.5 rounded-md bg-slate-800 text-slate-300 font-bold border border-slate-700">
              {state.difficulty}
            </span>
          </div>

          {/* Difficulty Quick Toggle */}
          <div className="flex items-center gap-1 text-[9px] font-bold">
            {(['EASY', 'NORMAL', 'HARD', 'EXPERT'] as CampaignDifficulty[]).map((d) => (
              <button
                key={d}
                onClick={() => {
                  sound.playClick();
                  setState(prev => ({ ...prev, difficulty: d }));
                }}
                className={`px-1.5 py-0.5 rounded transition-all ${
                  state.difficulty === d
                    ? 'bg-amber-400 text-navy-950 font-black'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {d[0]}
              </button>
            ))}
          </div>
        </div>

        {/* Constituency & Candidate Information */}
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-base font-black text-white flex items-center gap-1.5">
              <span>{state.constituency.name}</span>
              <span className="text-xs font-medium text-slate-400">({state.constituency.state})</span>
            </h1>
            <p className="text-[11px] text-slate-400">
              मतदाता: <strong className="text-amber-300">{state.population.toLocaleString('en-IN')}</strong> | विरोधी: <strong className="text-rose-400">{state.opponentCandidateName}</strong> ({state.opponentPartyName})
            </p>
          </div>
          <div className="text-right">
            <span className="text-[10px] text-slate-400 font-bold block">पार्टी कोषागार</span>
            <span className="text-xs font-black text-emerald-400 flex items-center justify-end gap-0.5">
              <IndianRupee size={12} />
              <span>{state.budget.toLocaleString('en-IN')}</span>
            </span>
          </div>
        </div>

        {/* Real-time Campaign Health Meters */}
        <div className="grid grid-cols-4 gap-2 pt-2.5 mt-2.5 border-t border-slate-800 text-center">
          <div className="bg-navy-950/80 p-1.5 rounded-xl border border-slate-800/80">
            <span className="text-[9px] text-slate-400 block font-bold">जनविश्वास</span>
            <span className="text-xs font-black text-amber-400">{Math.round(state.publicTrust)}%</span>
          </div>
          <div className="bg-navy-950/80 p-1.5 rounded-xl border border-slate-800/80">
            <span className="text-[9px] text-slate-400 block font-bold">जमीनी पकड़</span>
            <span className="text-xs font-black text-emerald-400">{Math.round(state.groundInfluence)}%</span>
          </div>
          <div className="bg-navy-950/80 p-1.5 rounded-xl border border-slate-800/80">
            <span className="text-[9px] text-slate-400 block font-bold">मीडिया छवि</span>
            <span className="text-xs font-black text-sky-400">{Math.round(state.mediaReputation)}%</span>
          </div>
          <div className="bg-navy-950/80 p-1.5 rounded-xl border border-slate-800/80">
            <span className="text-[9px] text-slate-400 block font-bold">कार्यकर्ता दल</span>
            <span className="text-xs font-black text-saffron">{state.volunteers}</span>
          </div>
        </div>
      </div>

      {/* ------------------------------------------------------------- */}
      {/* PHASE 1: DAY 1 — CAMPAIGN START & STRATEGY SELECTION */}
      {/* ------------------------------------------------------------- */}
      {state.phase === 'DAY_1_STRATEGY' && (
        <div className="space-y-3 animate-fadeIn">
          <div className="p-3.5 bg-gradient-to-r from-saffron/20 via-navy-900 to-navy-900 border border-saffron/30 rounded-3xl">
            <div className="flex items-center gap-2 mb-1 text-saffron text-xs font-black">
              <Compass size={16} />
              <span>दिन 1/7: चुनावी रणनीति व विजन का चयन करें</span>
            </div>
            <p className="text-xs text-slate-300">
              इस निर्वाचन क्षेत्र के प्रमुख मुद्दे हैं: <strong className="text-white">{state.localIssues.slice(0, 2).join(', ')}</strong>। आपके द्वारा चुना गया एजेंडा विभिन्न मतदाता वर्गों (युवा, किसान, मजदूर, व्यापारी) के रुझान को सीधे प्रभावित करेगा।
            </p>
          </div>

          <div className="space-y-2">
            {CAMPAIGN_STRATEGIES.map((strat) => (
              <div
                key={strat.id}
                onClick={() => handleSelectStrategy(strat)}
                className="p-3.5 rounded-2xl bg-navy-900/80 border border-slate-800 hover:border-saffron hover:bg-navy-900 transition-all cursor-pointer shadow-md group active:scale-[0.99]"
              >
                <div className="flex items-center justify-between mb-1">
                  <h3 className="text-sm font-black text-white group-hover:text-saffron transition-colors">
                    {strat.titleHi}
                  </h3>
                  <span className="text-xs font-bold text-amber-400 flex items-center gap-0.5">
                    <IndianRupee size={12} />
                    <span>{strat.cost.toLocaleString('en-IN')}</span>
                  </span>
                </div>
                <p className="text-xs text-slate-400 mb-2">{strat.descHi}</p>
                <div className="flex items-center justify-between text-[10px]">
                  <span className="text-emerald-400 font-bold">
                    + {strat.trustImpact}% जनविश्वास • + {strat.popularityImpact}% लोकप्रियता
                  </span>
                  <span className="text-saffron font-black flex items-center gap-1">
                    <span>चुनें</span>
                    <ChevronRight size={12} />
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ------------------------------------------------------------- */}
      {/* PHASE 2: DAY 2 — GROUND CAMPAIGN */}
      {/* ------------------------------------------------------------- */}
      {state.phase === 'DAY_2_GROUND' && (
        <div className="space-y-3 animate-fadeIn">
          <div className="p-3.5 bg-navy-900/90 border border-slate-800 rounded-3xl">
            <div className="flex items-center justify-between mb-1">
              <div className="flex items-center gap-2 text-emerald-400 text-xs font-black">
                <Users size={16} />
                <span>दिन 2/7: जमीनी जनसंपर्क व बूथ प्रबंधन</span>
              </div>
              <span className="text-[10px] text-slate-400 font-bold">
                ऊर्जा: <strong className="text-amber-400">{state.energy}%</strong>
              </span>
            </div>
            <p className="text-xs text-slate-300">
              घर-घर संपर्क से गहरा विश्वास मिलता है, जबकि बड़ी रैली से दृश्यता और मीडिया मिलता है लेकिन भारी बजट खर्च होता है।
            </p>
          </div>

          <div className="space-y-2">
            {GROUND_ACTIVITIES.map((act) => {
              const affordable = state.budget >= act.cost && state.energy >= act.energyCost;
              const alreadyChosen = state.groundActivitiesChosen.includes(act.id);

              return (
                <div
                  key={act.id}
                  onClick={() => !alreadyChosen && affordable && handleGroundActivity(act)}
                  className={`p-3.5 rounded-2xl border transition-all ${
                    alreadyChosen
                      ? 'bg-emerald-950/40 border-emerald-500/40 opacity-80'
                      : affordable
                      ? 'bg-navy-900/80 border-slate-800 hover:border-emerald-500 cursor-pointer active:scale-[0.99]'
                      : 'bg-navy-950/60 border-slate-900 opacity-50 cursor-not-allowed'
                  }`}
                >
                  <div className="flex items-start justify-between mb-1">
                    <h3 className="text-sm font-black text-white flex items-center gap-1.5">
                      {alreadyChosen && <CheckCircle2 size={14} className="text-emerald-400" />}
                      <span>{act.titleHi}</span>
                    </h3>
                    <span className="text-xs font-bold text-amber-400 flex items-center gap-0.5">
                      <IndianRupee size={12} />
                      <span>{act.cost.toLocaleString('en-IN')}</span>
                    </span>
                  </div>
                  <p className="text-xs text-slate-400 mb-2">{act.descHi}</p>
                  <div className="flex items-center justify-between text-[10px]">
                    <span className="text-slate-400">
                      कार्यकर्ता: <strong>{act.volunteersCost}</strong> | ऊर्जा: <strong>-{act.energyCost}</strong>
                    </span>
                    <span className="text-emerald-400 font-bold">
                      +{act.localSupportGain}% जमीनी प्रभाव • +{act.trustGain}% विश्वास
                    </span>
                  </div>
                </div>
              );
            })}
          </div>

          <button
            onClick={() => handleTransitionPhase(3, 'DAY_3_MEDIA')}
            className="w-full py-3 px-4 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-600 text-white font-black text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg active:scale-95 transition-all mt-4"
          >
            <span>दिन 3 (मीडिया अभियान) की ओर बढ़ें</span>
            <ArrowRight size={16} />
          </button>
        </div>
      )}

      {/* ------------------------------------------------------------- */}
      {/* PHASE 3: DAY 3 — MEDIA DAY */}
      {/* ------------------------------------------------------------- */}
      {state.phase === 'DAY_3_MEDIA' && (
        <div className="space-y-3 animate-fadeIn">
          <div className="p-3.5 bg-navy-900/90 border border-slate-800 rounded-3xl">
            <div className="flex items-center gap-2 text-sky-400 text-xs font-black mb-1">
              <Tv size={16} />
              <span>दिन 3/7: मीडिया व डिजिटल जनप्रचार</span>
            </div>
            <p className="text-xs text-slate-300">
              टीवी साक्षात्कारों और डिजिटल अभियानों से लाखों मतदाताओं तक बात पहुंचेगी, परंतु तीखे सवालों में फिसलने का जोखिम भी रहता है।
            </p>
          </div>

          <div className="grid grid-cols-1 gap-2.5">
            {MEDIA_OPTIONS.map((med) => {
              const affordable = state.budget >= med.cost;
              const alreadyChosen = state.mediaOptionsChosen.includes(med.id);

              return (
                <div
                  key={med.id}
                  onClick={() => !alreadyChosen && affordable && handleMediaOption(med)}
                  className={`p-3.5 rounded-2xl border transition-all ${
                    alreadyChosen
                      ? 'bg-sky-950/40 border-sky-500/40 opacity-80'
                      : affordable
                      ? 'bg-navy-900/80 border-slate-800 hover:border-sky-500 cursor-pointer active:scale-[0.99]'
                      : 'bg-navy-950/60 border-slate-900 opacity-50 cursor-not-allowed'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <h3 className="text-sm font-black text-white flex items-center gap-1.5">
                      {alreadyChosen && <CheckCircle2 size={14} className="text-sky-400" />}
                      <span>{med.titleHi}</span>
                    </h3>
                    <span className="text-xs font-bold text-amber-400 flex items-center gap-0.5">
                      <IndianRupee size={12} />
                      <span>{med.cost.toLocaleString('en-IN')}</span>
                    </span>
                  </div>
                  <p className="text-xs text-slate-400 mb-2">{med.descHi}</p>
                  <div className="flex items-center justify-between text-[10px]">
                    <span className="text-sky-300 font-medium">पहुंच: {med.reach}</span>
                    <span className="text-emerald-400 font-bold">
                      +{med.reputationGain}% मीडिया छवि (जोखिम: {med.riskPercent}%)
                    </span>
                  </div>
                </div>
              );
            })}
          </div>

          <button
            onClick={() => handleTransitionPhase(4, 'DAY_4_OPPOSITION')}
            className="w-full py-3 px-4 rounded-2xl bg-gradient-to-r from-sky-500 to-blue-600 text-white font-black text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg active:scale-95 transition-all mt-4"
          >
            <span>दिन 4 (विपक्ष का पलटवार) की ओर बढ़ें</span>
            <ArrowRight size={16} />
          </button>
        </div>
      )}

      {/* ------------------------------------------------------------- */}
      {/* PHASE 4: DAY 4 — OPPOSITION COUNTER-CAMPAIGN */}
      {/* ------------------------------------------------------------- */}
      {state.phase === 'DAY_4_OPPOSITION' && (
        <div className="space-y-3 animate-fadeIn">
          <div className="p-3.5 bg-rose-950/50 border border-rose-500/40 rounded-3xl">
            <div className="flex items-center gap-2 text-rose-400 text-xs font-black mb-1">
              <ShieldAlert size={16} />
              <span>दिन 4/7: विपक्षी दल का रणनीतिक पलटवार</span>
            </div>
            <p className="text-xs text-slate-200">
              विरोधी उम्मीदवार <strong>{state.opponentCandidateName}</strong> ने आपकी रणनीति को भांपते हुए आक्रामक काउंटर-कैंपेन शुरू कर दिया है।
            </p>
          </div>

          {/* Opponent Intel Card */}
          <div className="p-3.5 bg-navy-900 border border-slate-800 rounded-2xl space-y-2">
            <span className="text-[10px] uppercase font-black tracking-wider text-rose-400 block">
              ⚠️ विपक्षी चक्रव्यूह रिपोर्ट
            </span>
            <p className="text-xs text-slate-300">
              {state.groundActivitiesChosen.includes('MEGA_RALLY')
                ? 'विपक्ष ने आरोप लगाया है कि आप केवल रैलियों में धन खर्च कर रहे हैं और उन्होंने ग्रामीण इलाकों में चुपचाप सघन डोर-टू-डोर अभियान तेज कर दिया है।'
                : 'विपक्ष ने आपकी विकास नीति पर सवाल उठाते हुए सोशल मीडिया पर आक्रामक विज्ञापन और पर्चे बांटने शुरू कर दिए हैं।'}
            </p>
          </div>

          {/* Player Response Choices */}
          <div className="space-y-2 pt-1">
            <span className="text-xs font-bold text-white block">आपकी जवाबी रणनीति क्या होगी?</span>
            
            <button
              onClick={() => handleOppositionReaction('FACT_CHECK')}
              className="w-full p-3 rounded-2xl bg-navy-900/90 border border-slate-800 hover:border-amber-400 text-left transition-all active:scale-[0.99]"
            >
              <div className="text-xs font-black text-amber-300 mb-0.5">
                A. त्वरित फैक्ट-चेक बुलेटिन व डिजिटल स्पष्टीकरण जारी करें
              </div>
              <div className="text-[10px] text-slate-400">लागत: ₹8,000 | +8% मीडिया छवि, +5% जनविश्वास</div>
            </button>

            <button
              onClick={() => handleOppositionReaction('BOOTH_DEFENCE')}
              className="w-full p-3 rounded-2xl bg-navy-900/90 border border-slate-800 hover:border-emerald-400 text-left transition-all active:scale-[0.99]"
            >
              <div className="text-xs font-black text-emerald-300 mb-0.5">
                B. सभी बूथ कार्यकर्ताओं को फील्ड में उतारकर हर आरोप का आमने-सामने जवाब दें
              </div>
              <div className="text-[10px] text-slate-400">कार्यकर्ता खर्च: 20 | +10% जमीनी पकड़</div>
            </button>

            <button
              onClick={() => handleOppositionReaction('POSITIVE_VISION')}
              className="w-full p-3 rounded-2xl bg-navy-900/90 border border-slate-800 hover:border-saffron text-left transition-all active:scale-[0.99]"
            >
              <div className="text-xs font-black text-saffron mb-0.5">
                C. विपक्ष के कीचड़ उछालने से बेपरवाह रहकर केवल अपने सकारात्मक विजन पर भाषण दें
              </div>
              <div className="text-[10px] text-slate-400">शून्य लागत | +8% जनविश्वास, गरिमामय नेतृत्व</div>
            </button>
          </div>
        </div>
      )}

      {/* ------------------------------------------------------------- */}
      {/* PHASE 5: DAY 5 — RANDOM CRISIS / SURPRISE EVENT */}
      {/* ------------------------------------------------------------- */}
      {state.phase === 'DAY_5_CRISIS' && (
        <div className="space-y-3 animate-fadeIn">
          <div className="p-3.5 bg-amber-950/40 border border-amber-500/40 rounded-3xl">
            <div className="flex items-center gap-2 text-amber-400 text-xs font-black mb-1">
              <AlertTriangle size={16} />
              <span>दिन 5/7: अचानक उत्पन्न स्थानीय संकट</span>
            </div>
            <h2 className="text-sm font-black text-white">{activeCrisis.titleHi}</h2>
            <p className="text-xs text-slate-300 mt-1">{activeCrisis.descHi}</p>
          </div>

          <div className="space-y-2 pt-1">
            <span className="text-xs font-bold text-slate-300 block">
              सीमित संसाधनों में आपका निर्णय क्या होगा?
            </span>

            {activeCrisis.choices.map((ch) => (
              <button
                key={ch.id}
                onClick={() => handleResolveCrisis(ch.id)}
                className="w-full p-3 rounded-2xl bg-navy-900 border border-slate-800 hover:border-amber-400 text-left transition-all active:scale-[0.99] group shadow-md"
              >
                <div className="text-xs font-black text-white group-hover:text-amber-300 mb-1">
                  विकल्प {ch.id}: {ch.titleHi}
                </div>
                <div className="text-[10px] text-slate-400 mb-1.5">{ch.descHi}</div>
                <div className="flex items-center justify-between text-[10px]">
                  <span className="text-slate-400">
                    लागत: ₹{ch.fundsCost.toLocaleString('en-IN')} | कार्यकर्ता: {ch.volunteersCost}
                  </span>
                  <span className={ch.trustChange >= 0 ? 'text-emerald-400 font-bold' : 'text-rose-400 font-bold'}>
                    {ch.trustChange >= 0 ? `+${ch.trustChange}%` : `${ch.trustChange}%`} विश्वास
                  </span>
                </div>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* ------------------------------------------------------------- */}
      {/* PHASE 6: DAY 6 — FINAL CANDIDATE DEBATE */}
      {/* ------------------------------------------------------------- */}
      {state.phase === 'DAY_6_DEBATE' && (
        <div className="space-y-3 animate-fadeIn">
          <div className="p-3.5 bg-gradient-to-r from-purple-950/60 to-navy-900 border border-purple-500/40 rounded-3xl">
            <div className="flex items-center justify-between mb-1">
              <span className="text-purple-300 text-xs font-black flex items-center gap-1.5">
                <Sparkles size={14} />
                <span>दिन 6/7: महा-डिबेट (Live Debate Q{currentDebateQIndex + 1}/3)</span>
              </span>
              <span className="text-[10px] text-amber-300 font-bold">
                डिबेट स्कोर: {state.debateScore > 0 ? `+${state.debateScore}` : state.debateScore}
              </span>
            </div>
            <div className="text-[11px] text-slate-300 font-bold">
              विषय: {DEBATE_QUESTIONS[currentDebateQIndex].topicHi}
            </div>
            <p className="text-xs text-white font-black mt-1">
              "{DEBATE_QUESTIONS[currentDebateQIndex].questionHi}"
            </p>
          </div>

          {/* Opponent's Statement */}
          <div className="p-2.5 rounded-xl bg-navy-900/90 border border-slate-800 text-[11px] text-slate-300 italic">
            {DEBATE_QUESTIONS[currentDebateQIndex].opponentArgHi}
          </div>

          {/* Multi-choice Answers */}
          <div className="space-y-2 pt-1">
            <span className="text-xs font-bold text-slate-300 block">आपका उत्तर:</span>
            {DEBATE_QUESTIONS[currentDebateQIndex].options.map((opt) => (
              <button
                key={opt.id}
                onClick={() => handleDebateAnswer(opt.id)}
                className="w-full p-3 rounded-2xl bg-navy-900/90 border border-slate-800 hover:border-purple-400 text-left transition-all active:scale-[0.99] text-xs text-white"
              >
                <div className="flex items-center gap-1.5 mb-1 font-bold text-purple-300 text-[11px]">
                  <span>विकल्प {opt.id}</span>
                  <span className="text-[9px] text-slate-400 font-normal">
                    (कौशल: {opt.requiredSkill})
                  </span>
                </div>
                <p className="text-xs text-slate-200">{opt.textHi}</p>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* ------------------------------------------------------------- */}
      {/* PHASE 7: DAY 7 — VOTING DAY */}
      {/* ------------------------------------------------------------- */}
      {state.phase === 'DAY_7_VOTING' && (
        <div className="space-y-4 animate-fadeIn my-auto text-center">
          <div className="p-5 bg-navy-900/90 border border-slate-800 rounded-3xl space-y-3 shadow-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-saffron/20 border border-saffron/40 text-saffron text-xs font-black uppercase tracking-wider">
              <Calendar size={14} />
              <span>दिन 7/7: मतदान दिवस (VOTING DAY)</span>
            </div>

            <h2 className="text-xl font-black text-white">
              {state.constituency.name} में मतदान प्रक्रिया संपन्न
            </h2>

            <p className="text-xs text-slate-300 max-w-sm mx-auto">
              सभी 240+ मतदान केंद्रों पर EVM मशीनें सील कर दी गई हैं। जनमत पेटी में बंद हो चुका है। अब मतगणना कक्ष में जनमत की गणना की जाएगी।
            </p>

            <div className="p-3 bg-navy-950 rounded-2xl border border-slate-800/80 max-w-xs mx-auto text-xs space-y-1">
              <div className="flex justify-between text-slate-400">
                <span>अनुमानित मतदान प्रतिशत:</span>
                <strong className="text-amber-400">72.4%</strong>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>कुल पड़े मत:</span>
                <strong className="text-white">~1,73,800</strong>
              </div>
            </div>

            <button
              onClick={handleStartVoteCounting}
              className="w-full py-4 px-6 rounded-2xl bg-gradient-to-r from-saffron to-amber-500 text-navy-950 font-black text-sm uppercase tracking-wider flex items-center justify-center gap-2 shadow-xl hover:brightness-110 active:scale-95 transition-all mt-4"
            >
              <span>EVM मतगणना शुरू करें (COUNT VOTES)</span>
              <ArrowRight size={18} />
            </button>
          </div>
        </div>
      )}

      {/* ------------------------------------------------------------- */}
      {/* COUNTING PHASE: LIVE SUSPENSEFUL 5-ROUND VOTE COUNT */}
      {/* ------------------------------------------------------------- */}
      {state.phase === 'COUNTING' && (
        <div className="space-y-4 animate-fadeIn my-auto">
          {/* TV Live Banner */}
          <div className="text-center">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-600 text-white text-xs font-black uppercase tracking-widest animate-pulse shadow-lg mb-2">
              <span>🔴 LIVE BROADCAST</span>
              <span>• मतगणना कक्ष (ROUND {countingRound}/5)</span>
            </div>
            <h2 className="text-lg font-black text-white">{state.constituency.name}</h2>
            <p className="text-xs text-slate-400">
              मतदान प्रतिशत: <strong className="text-amber-400">{state.turnoutPercent}%</strong> ({state.totalVotesPolled?.toLocaleString('en-IN')} कुल मत)
            </p>
          </div>

          {/* Live EVM Bars */}
          <div className="p-4 bg-navy-900/90 border border-slate-800 rounded-3xl space-y-3.5 shadow-2xl">
            {/* Player's Party */}
            <div className="space-y-1">
              <div className="flex justify-between text-xs font-black">
                <span className="text-saffron flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-saffron inline-block"></span>
                  <span>{party?.name || 'आपकी पार्टी (Your Party)'}</span>
                </span>
                <span className="text-white font-mono">
                  {currentDisplayedPlayerVotes.toLocaleString('en-IN')} ({state.playerVoteShare}%)
                </span>
              </div>
              <div className="w-full bg-slate-950 h-3 rounded-full overflow-hidden border border-slate-800">
                <div
                  className="bg-gradient-to-r from-saffron to-amber-400 h-full rounded-full transition-all duration-700"
                  style={{ width: `${(state.playerVoteShare || 40) * countingFraction}%` }}
                />
              </div>
            </div>

            {/* Opponent Party */}
            <div className="space-y-1">
              <div className="flex justify-between text-xs font-black">
                <span className="text-slate-300 flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-rose-500 inline-block"></span>
                  <span>{state.opponentPartyName} ({state.opponentCandidateName})</span>
                </span>
                <span className="text-white font-mono">
                  {currentDisplayedOpponentVotes.toLocaleString('en-IN')} ({state.opponentVoteShare}%)
                </span>
              </div>
              <div className="w-full bg-slate-950 h-3 rounded-full overflow-hidden border border-slate-800">
                <div
                  className="bg-gradient-to-r from-rose-500 to-rose-400 h-full rounded-full transition-all duration-700"
                  style={{ width: `${(state.opponentVoteShare || 40) * countingFraction}%` }}
                />
              </div>
            </div>

            {/* Certified Final Outcome Reveal */}
            {countingComplete && (
              <div className="pt-3 border-t border-slate-800 animate-fadeIn text-center space-y-2">
                {state.isWon ? (
                  <div className="p-3.5 bg-emerald-950/80 border border-emerald-500/50 rounded-2xl text-emerald-200">
                    <div className="flex items-center justify-center gap-2 text-base font-black text-white mb-1">
                      <Trophy size={20} className="text-amber-400" />
                      <span>ऐतिहासिक विजय (ELECTION VICTORY)!</span>
                    </div>
                    <p className="text-xs text-emerald-300">
                      जीत का अंतर: +{state.margin?.toLocaleString('en-IN')} मतों से शानदार जीत!
                    </p>
                  </div>
                ) : (
                  <div className="p-3.5 bg-rose-950/80 border border-rose-500/50 rounded-2xl text-rose-200">
                    <div className="flex items-center justify-center gap-2 text-base font-black text-white mb-1">
                      <XCircle size={20} className="text-rose-400" />
                      <span>हार — राजनीतिक यात्रा जारी है</span>
                    </div>
                    <p className="text-xs text-rose-300">
                      विजेता: {state.opponentCandidateName} ({state.opponentPartyName}) | अंतर: {state.margin?.toLocaleString('en-IN')} मत
                    </p>
                  </div>
                )}

                <button
                  onClick={() => setState(p => ({ ...p, phase: 'RESULT_ANALYSIS' }))}
                  className="w-full py-3 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-all mt-2"
                >
                  <BarChart3 size={14} />
                  <span>विस्तृत चुनाव विश्लेषण देखें (VIEW ELECTION ANALYSIS)</span>
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ------------------------------------------------------------- */}
      {/* POST-ELECTION IN-DEPTH ANALYSIS & REBUILD FLOW */}
      {/* ------------------------------------------------------------- */}
      {state.phase === 'RESULT_ANALYSIS' && state.scorecard && (
        <div className="space-y-3.5 animate-fadeIn">
          {/* Analysis Header */}
          <div className="p-4 bg-navy-900/90 border border-slate-800 rounded-3xl">
            <span className="text-[10px] font-black text-amber-400 uppercase tracking-widest block mb-1">
              📊 चुनाव उपरांत विश्लेषण (ELECTION ANALYSIS)
            </span>
            <h2 className="text-base font-black text-white">
              {state.isWon ? 'शानदार जीत के प्रमुख कारण' : 'हार का वस्तुनिष्ठ मूल्यांकन'}
            </h2>
            <p className="text-xs text-slate-300 mt-1">
              {state.scorecard.mainReasonHi}
            </p>
            {state.scorecard.keyMistakeHi && (
              <div className="mt-2 p-2 rounded-xl bg-rose-950/40 border border-rose-500/30 text-[11px] text-rose-300">
                <strong>सुधार का क्षेत्र:</strong> {state.scorecard.keyMistakeHi}
              </div>
            )}
          </div>

          {/* Performance Radar Cards */}
          <div className="grid grid-cols-2 gap-2 text-xs">
            <div className="p-3 bg-navy-900 border border-slate-800 rounded-2xl">
              <span className="text-[10px] text-slate-400 block">रणनीति दक्षता</span>
              <span className="text-base font-black text-white">{state.scorecard.strategyScore}/100</span>
            </div>
            <div className="p-3 bg-navy-900 border border-slate-800 rounded-2xl">
              <span className="text-[10px] text-slate-400 block">जनविश्वास अर्जन</span>
              <span className="text-base font-black text-white">{state.scorecard.trustScore}/100</span>
            </div>
            <div className="p-3 bg-navy-900 border border-slate-800 rounded-2xl">
              <span className="text-[10px] text-slate-400 block">जमीनी कैडर पकड़</span>
              <span className="text-base font-black text-white">{state.scorecard.groundScore}/100</span>
            </div>
            <div className="p-3 bg-navy-900 border border-slate-800 rounded-2xl">
              <span className="text-[10px] text-slate-400 block">मीडिया प्रभाव</span>
              <span className="text-base font-black text-white">{state.scorecard.mediaScore}/100</span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="space-y-2 pt-2">
            {state.isWon ? (
              <button
                onClick={() => {
                  sound.playRally();
                  onVictoryProceed();
                }}
                className="w-full py-4 px-6 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-600 text-white font-black text-sm uppercase tracking-wider flex items-center justify-center gap-2 shadow-xl hover:brightness-110 active:scale-95 transition-all"
              >
                <Trophy size={18} />
                <span>विजय उत्सव मनाएं व अगले स्तर पर जाएं</span>
                <ArrowRight size={18} />
              </button>
            ) : (
              <div className="space-y-2">
                <button
                  onClick={() => {
                    sound.playClick();
                    onDefeatRebuild();
                  }}
                  className="w-full py-3.5 px-6 rounded-2xl bg-gradient-to-r from-saffron to-amber-500 text-navy-950 font-black text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg active:scale-95 transition-all"
                >
                  <RotateCcw size={16} />
                  <span>विपक्ष के नेता के रूप में संगठन पुनः खड़ा करें (REBUILD PARTY)</span>
                </button>

                {onOpenPartyManagement && (
                  <button
                    onClick={() => {
                      sound.playClick();
                      onOpenPartyManagement();
                    }}
                    className="w-full py-2.5 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold transition-all"
                  >
                    पार्टी संगठन व कार्यकर्ताओं का प्रबंधन करें
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
