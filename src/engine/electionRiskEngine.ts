import { PlayerProfile, PoliticalParty, OppositionParty, Constituency, DemographicSupport } from '../types/game';
import { PartyMember } from './partyMemberEngine';
import { MultiplayerFriend } from './multiplayerPartyEngine';

export type CampaignDifficulty = 'EASY' | 'NORMAL' | 'HARD' | 'EXPERT';

export type CampaignDay = 1 | 2 | 3 | 4 | 5 | 6 | 7;

export type CampaignPhase = 
  | 'OVERVIEW'
  | 'DAY_1_STRATEGY'
  | 'DAY_2_GROUND'
  | 'DAY_3_MEDIA'
  | 'DAY_4_OPPOSITION'
  | 'DAY_5_CRISIS'
  | 'DAY_6_DEBATE'
  | 'DAY_7_VOTING'
  | 'COUNTING'
  | 'RESULT_ANALYSIS'
  | 'REBUILD_PATH';

export interface CampaignStrategyOption {
  id: string;
  titleHi: string;
  titleEn: string;
  descHi: string;
  descEn: string;
  demographicFocus: keyof DemographicSupport;
  trustImpact: number;
  popularityImpact: number;
  cost: number;
}

export interface GroundActivity {
  id: string;
  titleHi: string;
  titleEn: string;
  descHi: string;
  descEn: string;
  cost: number;
  energyCost: number;
  volunteersCost: number;
  trustGain: number;
  localSupportGain: number;
  mediaGain: number;
  icon: string;
}

export interface MediaOption {
  id: string;
  titleHi: string;
  titleEn: string;
  descHi: string;
  reach: string;
  cost: number;
  reputationGain: number;
  riskPercent: number;
  icon: string;
}

export interface CrisisOption {
  id: string;
  titleHi: string;
  titleEn: string;
  descHi: string;
  fundsCost: number;
  volunteersCost: number;
  trustChange: number;
  supportChange: number;
  reputationChange: number;
}

export interface CrisisEvent {
  id: string;
  titleHi: string;
  titleEn: string;
  descHi: string;
  descEn: string;
  severity: 'LOW' | 'MEDIUM' | 'HIGH';
  choices: CrisisOption[];
}

export interface DebateQuestion {
  id: string;
  topicHi: string;
  topicEn: string;
  questionHi: string;
  questionEn: string;
  opponentArgHi: string;
  options: {
    id: string;
    textHi: string;
    textEn: string;
    quality: 'EXCELLENT' | 'GOOD' | 'DIPLOMATIC' | 'POOR';
    trustGain: number;
    reputationGain: number;
    requiredSkill: 'politicalKnowledge' | 'communication' | 'strategy';
  }[];
}

export interface RoleAssignment {
  roleName: string;
  memberId?: string;
  memberName?: string;
  bonusText: string;
  isMultiplayerFriend?: boolean;
}

export interface PostElectionScorecard {
  strategyScore: number;       // 0-100
  trustScore: number;          // 0-100
  mediaScore: number;          // 0-100
  groundScore: number;         // 0-100
  candidateSkillScore: number; // 0-100
  opponentStrengthScore: number; // 0-100
  mainReasonHi: string;
  mainReasonEn: string;
  keyMistakeHi?: string;
  keyMistakeEn?: string;
}

export interface Election7DayState {
  difficulty: CampaignDifficulty;
  currentDay: CampaignDay;
  phase: CampaignPhase;
  constituency: Constituency;
  population: number;
  localIssues: string[];
  localIssuesEn: string[];
  
  // Real-time Campaign Balances
  budget: number;
  volunteers: number;
  partyMembersCount: number;
  energy: number;
  
  // Dynamic Score Trackers
  publicTrust: number;
  candidatePopularity: number;
  partyPopularity: number;
  mediaReputation: number;
  groundInfluence: number;
  
  // Opponent AI State
  opponentCandidateName: string;
  opponentPartyName: string;
  opponentStrength: number;
  opponentStrategyHi: string;
  opponentCounterMove?: {
    titleHi: string;
    descHi: string;
    impactHi: string;
  };

  // Decisions Made
  chosenStrategy?: CampaignStrategyOption;
  groundActivitiesChosen: string[];
  mediaOptionsChosen: string[];
  mediaEventHandled?: string;
  crisisEventHandled?: string;
  debateScore: number; // -30 to +30
  
  // Member & Multiplayer Assignments
  assignedRoles: {
    seniorLeader?: string;
    stateLeader?: string;
    districtLeader?: string;
    campaignManager?: string;
    mediaManager?: string;
    volunteersLead?: string;
  };
  multiplayerContributionBonus: number;

  // Final Results
  isWon?: boolean;
  totalVotesPolled?: number;
  playerVotes?: number;
  playerVoteShare?: number;
  opponentVotes?: number;
  opponentVoteShare?: number;
  margin?: number;
  turnoutPercent?: number;
  scorecard?: PostElectionScorecard;
}

// -------------------------------------------------------------
// DAY 1 STRATEGY PRESETS
// -------------------------------------------------------------
export const CAMPAIGN_STRATEGIES: CampaignStrategyOption[] = [
  {
    id: 'DEVELOPMENT',
    titleHi: 'विकास व औद्योगिक प्रगति एजेंडा',
    titleEn: 'Development & Economic Growth Focus',
    descHi: 'सड़कें, बिजली, व्यापार सुगमता और स्थानीय बुनियादी ढांचे को प्राथमिकता।',
    descEn: 'Prioritize roads, 24x7 electricity, ease of business, and local infrastructure.',
    demographicFocus: 'urban',
    trustImpact: 8,
    popularityImpact: 10,
    cost: 15000,
  },
  {
    id: 'YOUTH',
    titleHi: 'युवा शक्ति व खेल/शिक्षा क्रांति',
    titleEn: 'Youth Power & Digital Opportunity',
    descHi: 'पुस्तकालय, खेल स्टेडियम, कौशल केंद्र और युवा स्टार्ट-अप प्रोत्साहन।',
    descEn: 'Public libraries, sports centers, skill labs, and digital startup grants.',
    demographicFocus: 'youth',
    trustImpact: 6,
    popularityImpact: 14,
    cost: 12000,
  },
  {
    id: 'EMPLOYMENT',
    titleHi: 'रोजगार व स्थानीय भर्ती अभियान',
    titleEn: 'Local Employment & Industry Hubs',
    descHi: 'औद्योगिक पार्कों की स्थापना, स्थानीय भर्ती गारंटी और पारदर्शी परीक्षा।',
    descEn: 'Create industrial clusters and guarantee fair, transparent recruitment exams.',
    demographicFocus: 'workers',
    trustImpact: 10,
    popularityImpact: 12,
    cost: 18000,
  },
  {
    id: 'AGRICULTURE',
    titleHi: 'किसान कल्याण व सिंचाई सुरक्षा',
    titleEn: 'Farmer Welfare & Irrigation Security',
    descHi: 'नहरों का आधुनिकीकरण, न्यूनतम समर्थन मूल्य व खाद-बीज की सुलभ उपलब्धता।',
    descEn: 'Canal network revival, fair crop pricing support, and quality cold storage.',
    demographicFocus: 'farmers',
    trustImpact: 12,
    popularityImpact: 8,
    cost: 16000,
  },
  {
    id: 'EDUCATION',
    titleHi: 'गुणवत्तापूर्ण शिक्षा व स्वास्थ्य सुरक्षा',
    titleEn: 'Quality Education & Affordable Healthcare',
    descHi: 'उत्कृष्ट सरकारी स्कूल, निःशुल्क जांच और प्रत्येक वार्ड में आधुनिक क्लिनिक।',
    descEn: 'Modernized model schools, diagnostic clinics, and affordable generic medicine.',
    demographicFocus: 'rural',
    trustImpact: 14,
    popularityImpact: 6,
    cost: 14000,
  },
  {
    id: 'GENERAL',
    titleHi: 'सर्वजन समरसता व जनसंवाद',
    titleEn: 'Inclusive Civic Outreach & Grievance Redressal',
    descHi: 'हर वर्ग और समुदाय के बीच पहुंचकर जनसुनवाई और संतुलित घोषणापत्र।',
    descEn: 'Balanced public outreach across all communities with open public hearings.',
    demographicFocus: 'urban',
    trustImpact: 9,
    popularityImpact: 9,
    cost: 10000,
  }
];

// -------------------------------------------------------------
// DAY 2 GROUND ACTIVITIES
// -------------------------------------------------------------
export const GROUND_ACTIVITIES: GroundActivity[] = [
  {
    id: 'DOOR_TO_DOOR',
    titleHi: 'घर-घर सघन जनसंपर्क (Door-to-Door)',
    titleEn: 'Door-to-Door Outreach',
    descHi: 'प्रत्येक घर में जाकर बुजुर्गों का आशीर्वाद व समस्याओं की डायरी बनाना।',
    descEn: 'Visit households directly, listen to local problems, and build deep personal trust.',
    cost: 10000,
    energyCost: 25,
    volunteersCost: 40,
    trustGain: 14,
    localSupportGain: 10,
    mediaGain: 2,
    icon: 'home',
  },
  {
    id: 'SMALL_MEETINGS',
    titleHi: 'नुक्कड़ सभाएं व मोहल्ला चौपाल',
    titleEn: 'Neighborhood Corner Meetings',
    descHi: 'वार्डों के चौराहों पर स्थानीय मुद्दों पर सीधी और खुली चर्चा।',
    descEn: 'Corner gatherings addressing ward-specific water, sewage, and streetlight issues.',
    cost: 12000,
    energyCost: 20,
    volunteersCost: 25,
    trustGain: 10,
    localSupportGain: 8,
    mediaGain: 4,
    icon: 'users',
  },
  {
    id: 'MEGA_RALLY',
    titleHi: 'विशाल महा-रैली (Mega Rally)',
    titleEn: 'Mega Campaign Rally',
    descHi: 'हजारों समर्थकों के विशाल जनसैलाब के साथ शक्ति प्रदर्शन।',
    descEn: 'High-impact mass demonstration of party strength with sound, banners, and media.',
    cost: 45000,
    energyCost: 35,
    volunteersCost: 80,
    trustGain: 4,
    localSupportGain: 16,
    mediaGain: 20,
    icon: 'megaphone',
  },
  {
    id: 'VOLUNTEER_BOOTHS',
    titleHi: 'बूथ प्रबंधन व मतदाता पर्ची वितरण',
    titleEn: 'Booth Management & Voter Slips',
    descHi: 'प्रत्येक मतदान केंद्र पर 10 समर्पित कार्यकर्ताओं की निगरानी टीम तैनात करना।',
    descEn: 'Organize dedicated booth in-charges for polling-day turnout assurance.',
    cost: 15000,
    energyCost: 15,
    volunteersCost: 60,
    trustGain: 8,
    localSupportGain: 12,
    mediaGain: 2,
    icon: 'shield',
  },
  {
    id: 'COMMUNITY_CAMP',
    titleHi: 'निःशुल्क जनसेवा व समाधान शिविर',
    titleEn: 'Community Service Camp',
    descHi: 'नागरिकों के सरकारी कागजात, स्वास्थ्य जांच व पेंशन सहायता शिविर लगाना।',
    descEn: 'Help citizens with civic paperwork, senior citizen pensions, and free checkups.',
    cost: 22000,
    energyCost: 20,
    volunteersCost: 35,
    trustGain: 16,
    localSupportGain: 9,
    mediaGain: 6,
    icon: 'heart',
  }
];

// -------------------------------------------------------------
// DAY 3 MEDIA OPTIONS
// -------------------------------------------------------------
export const MEDIA_OPTIONS: MediaOption[] = [
  {
    id: 'TV_INTERVIEW',
    titleHi: 'प्राइम टाइम राष्ट्रीय टीवी साक्षात्कार',
    titleEn: 'Prime-Time Television Interview',
    descHi: 'कठिन सवालों का सामना कर राज्यभर में अपना विजन स्पष्ट रखना।',
    reach: '5,00,000+ दर्शक',
    cost: 15000,
    reputationGain: 14,
    riskPercent: 20,
    icon: 'tv',
  },
  {
    id: 'PRESS_CONF',
    titleHi: 'विशाल प्रेस वार्ता (Press Conference)',
    titleEn: 'Official Press Conference',
    descHi: 'स्थानीय व राष्ट्रीय पत्रकारों के समक्ष पार्टी का 10 सूत्रीय संकल्प पेश करना।',
    reach: 'स्थानीय अखबार व वेब पोर्टल',
    cost: 20000,
    reputationGain: 12,
    riskPercent: 15,
    icon: 'mic',
  },
  {
    id: 'DIGITAL_BLITZ',
    titleHi: 'सोशल मीडिया व रील्स अभियान',
    titleEn: 'Social Media & Digital Blitz',
    descHi: 'युवाओं तक व्हाट्सएप, यूट्यूब और इंस्टाग्राम पर सीधे वीडियो संदेश।',
    reach: '2,50,000+ स्मार्टफोन',
    cost: 18000,
    reputationGain: 15,
    riskPercent: 10,
    icon: 'share-2',
  },
  {
    id: 'NEWSPAPER_OPED',
    titleHi: 'प्रमुख दैनिक समाचार पत्रों में लेख',
    titleEn: 'Newspaper Front Page Editorial',
    descHi: 'बुद्धिजीवियों, व्यापारियों और शिक्षकों के बीच गंभीर नीतिगत संदेश।',
    reach: '1,80,000+ पाठक',
    cost: 12000,
    reputationGain: 10,
    riskPercent: 5,
    icon: 'file-text',
  }
];

// -------------------------------------------------------------
// DAY 5 RANDOM CRISIS POOL (No graphic/disturbing disaster imagery)
// -------------------------------------------------------------
export const CAMPAIGN_CRISES: CrisisEvent[] = [
  {
    id: 'CRISIS_FLOOD',
    titleHi: 'भारी वर्षा से निचले क्षेत्रों में जलभराव',
    titleEn: 'Heavy Rainfall & Waterlogging in Low-lying Wards',
    descHi: 'अचानक मूसलाधार बारिश से 12 मोहल्लों में पानी भर गया है। नागरिक सुरक्षित आश्रय और सहायता की गुहार लगा रहे हैं।',
    descEn: 'Severe unexpected rainfall has inundated low-lying settlements. Citizens urge immediate support and relief.',
    severity: 'HIGH',
    choices: [
      {
        id: 'A',
        titleHi: 'चुनावी प्रचार रोककर सभी कार्यकर्ताओं को राहत कार्य में लगाएं',
        titleEn: 'Pause campaign and deploy all cadres to relief work',
        descHi: 'जनता का अपार भरोसा मिलेगा, हालांकि प्रचार समय घटेगा।',
        fundsCost: 20000,
        volunteersCost: 50,
        trustChange: 18,
        supportChange: 10,
        reputationChange: 15,
      },
      {
        id: 'B',
        titleHi: 'पार्टी कोष से ₹25,000 भोजन पैकेट व दवाओं हेतु स्वीकृत करें',
        titleEn: 'Allocate party funds for dry rations and clean water',
        descHi: 'प्रचार जारी रहेगा और राहत सामग्री से सम्मान बढ़ेगा।',
        fundsCost: 25000,
        volunteersCost: 15,
        trustChange: 12,
        supportChange: 6,
        reputationChange: 8,
      },
      {
        id: 'C',
        titleHi: 'प्रशासनिक लापरवाही पर धरना देकर सरकार को कटघरे में खड़ा करें',
        titleEn: 'Stage peaceful protest demanding administrative action',
        descHi: 'मीडिया का ध्यान आकर्षित होगा, पर कुछ नागरिक इसे राजनीति मानेंगे।',
        fundsCost: 5000,
        volunteersCost: 20,
        trustChange: -4,
        supportChange: 4,
        reputationChange: 6,
      },
      {
        id: 'D',
        titleHi: 'पहले से तय चुनावी सभा जारी रखें और मंच से संवेदना व्यक्त करें',
        titleEn: 'Continue pre-scheduled rally and express sympathy',
        descHi: 'प्रचार गति बनी रहेगी लेकिन विरोधी असंवेदनशीलता का आरोप लगाएंगे।',
        fundsCost: 0,
        volunteersCost: 0,
        trustChange: -12,
        supportChange: -6,
        reputationChange: -10,
      }
    ]
  },
  {
    id: 'CRISIS_INFRA',
    titleHi: 'मुख्य पुलिया टूटने से 20 गांवों का संपर्क कटा',
    titleEn: 'Main Rural Bridge Weakened - 20 Villages Cut Off',
    descHi: 'मुख्य संपर्क मार्ग क्षतिग्रस्त होने से किसानों और छात्रों का आवागमन ठप हो गया है।',
    descEn: 'Crucial connector bridge damaged, isolating villages and halting movement.',
    severity: 'MEDIUM',
    choices: [
      {
        id: 'A',
        titleHi: 'कार्यकर्ताओं व स्थानीय सहयोग से अस्थायी वैकल्पिक मार्ग तैयार कराएं',
        titleEn: 'Build temporary bypass route with volunteer manpower',
        descHi: 'ग्रामीण क्षेत्रों में आपकी पार्टी के प्रति जबरदस्त कृतज्ञता।',
        fundsCost: 15000,
        volunteersCost: 40,
        trustChange: 16,
        supportChange: 12,
        reputationChange: 10,
      },
      {
        id: 'B',
        titleHi: 'जिलाधिकारी कार्यालय पहुंचकर त्वरित मरम्मत का आश्वासन दिलवाएं',
        titleEn: 'Meet District Magistrate and secure fast repair tender',
        descHi: 'प्रशासनिक दक्षता साबित होगी।',
        fundsCost: 3000,
        volunteersCost: 10,
        trustChange: 10,
        supportChange: 6,
        reputationChange: 8,
      },
      {
        id: 'C',
        titleHi: 'सोशल मीडिया पर वीडियो जारी कर मौजूदा विधायक पर सवाल उठाएं',
        titleEn: 'Release viral video critiquing sitting representative',
        descHi: 'आक्रामक राजनीति, लेकिन स्थानीय लोग ठोस मदद चाहते हैं।',
        fundsCost: 4000,
        volunteersCost: 5,
        trustChange: 2,
        supportChange: 4,
        reputationChange: 4,
      }
    ]
  },
  {
    id: 'CRISIS_CONTROVERSY',
    titleHi: 'विपक्षी दल द्वारा आपके पुराने बयान की भ्रामक क्लिप वायरल',
    titleEn: 'Opposition Floats Misleading Edited Video Clip',
    descHi: 'सोशल मीडिया पर आपके एक 3 साल पुराने भाषण को काट-छांट कर गलत संदर्भ में फैलाया जा रहा है।',
    descEn: 'Manipulated audio clip attacking your party is trending on WhatsApp groups.',
    severity: 'HIGH',
    choices: [
      {
        id: 'A',
        titleHi: 'पूरी मूल वीडियो के साथ तुरंत लाइव प्रेस कॉन्फ्रेंस कर खंडन करें',
        titleEn: 'Hold immediate live press conference with full context proof',
        descHi: 'तथ्यों के आधार पर विपक्ष की साजिश बेनकाब होगी।',
        fundsCost: 10000,
        volunteersCost: 15,
        trustChange: 12,
        supportChange: 8,
        reputationChange: 14,
      },
      {
        id: 'B',
        titleHi: 'चुनाव आयोग में फर्जीवाड़े की औपचारिक शिकायत दर्ज कराएं',
        titleEn: 'Lodge formal complaint with Election Commission & Cyber Cell',
        descHi: 'कानूनी कदम, हालांकि सोशल मीडिया पर कुछ नुकसान रह सकता है।',
        fundsCost: 5000,
        volunteersCost: 5,
        trustChange: 6,
        supportChange: 3,
        reputationChange: 5,
      },
      {
        id: 'C',
        titleHi: 'मुद्दे को नजरअंदाज कर केवल विकास एजेंडे पर बोलते रहें',
        titleEn: 'Ignore the smear campaign and stick to development agenda',
        descHi: 'सकारात्मक रुख, लेकिन भ्रमित वोटरों में कुछ संदेह रह सकता है।',
        fundsCost: 0,
        volunteersCost: 0,
        trustChange: -8,
        supportChange: -5,
        reputationChange: -6,
      }
    ]
  }
];

// -------------------------------------------------------------
// DAY 6 DEBATE QUESTIONS
// -------------------------------------------------------------
export const DEBATE_QUESTIONS: DebateQuestion[] = [
  {
    id: 'Q1_EMPLOYMENT',
    topicHi: 'रोजगार व आर्थिक अवसर',
    topicEn: 'Employment & Youth Opportunities',
    questionHi: 'इस क्षेत्र में शिक्षित युवाओं के लिए नौकरियों का गंभीर अभाव है। आपका ठोस रोडमैप क्या है?',
    questionEn: 'Educated youth face severe unemployment here. What is your concrete road map?',
    opponentArgHi: 'विपक्ष का दावा: "हम हर युवा को बिना किसी योजना के केवल मासिक भत्ता देंगे।"',
    options: [
      {
        id: 'A',
        textHi: 'स्थानीय उत्पादों पर आधारित 2 फूड-प्रोसेसिंग क्लस्टर और कौशल केंद्र बनाएंगे ताकि 15,000 स्थायी रोजगार सृजित हों।',
        textEn: 'Establish 2 agro-processing clusters and modern skill labs to create 15,000 sustainable local jobs.',
        quality: 'EXCELLENT',
        trustGain: 8,
        reputationGain: 10,
        requiredSkill: 'strategy',
      },
      {
        id: 'B',
        textHi: 'सरकारी विभागों में वर्षों से खाली पड़े पदों को 90 दिनों में पारदर्शी परीक्षा कराकर भरेंगे।',
        textEn: 'Fill long-pending sanctioned vacancies in civic departments within 90 days with transparent tests.',
        quality: 'GOOD',
        trustGain: 6,
        reputationGain: 7,
        requiredSkill: 'politicalKnowledge',
      },
      {
        id: 'C',
        textHi: 'विपक्ष ने 10 साल में कुछ नहीं किया, पहले वे अपने वादों का हिसाब जनता को दें।',
        textEn: 'Opposition failed for 10 years, they should first answer for their own past unkept promises.',
        quality: 'POOR',
        trustGain: -4,
        reputationGain: -3,
        requiredSkill: 'communication',
      }
    ]
  },
  {
    id: 'Q2_HEALTH_EDUCATION',
    topicHi: 'स्वास्थ्य व शिक्षा ढांचा',
    topicEn: 'Healthcare & Public Schools',
    questionHi: 'ग्रामीण स्वास्थ्य केंद्रों में डॉक्टरों की अनुपस्थिति और स्कूलों की जर्जर स्थिति पर आपका समाधान क्या है?',
    questionEn: 'Rural primary health centers lack doctors and medicines. What is your emergency plan?',
    opponentArgHi: 'विपक्ष का दावा: "हम केवल नए भवन बना देंगे।"',
    options: [
      {
        id: 'A',
        textHi: 'डिजिटल टेलीमेडिसिन कनेक्ट, अनिवार्य 24x7 इमरजेंसी स्टाफिंग और प्राथमिक स्वास्थ्य केंद्रों को आधुनिक उपकरणों से लैस करेंगे।',
        textEn: 'Deploy telemedicine links, 24x7 emergency doctor rotations, and supply vital testing machines.',
        quality: 'EXCELLENT',
        trustGain: 9,
        reputationGain: 9,
        requiredSkill: 'strategy',
      },
      {
        id: 'B',
        textHi: 'विधायक निधि का 40% हिस्सा केवल प्राथमिक विद्यालयों के डिजिटल क्लासरूम व पेयजल पर खर्च करेंगे।',
        textEn: 'Dedicate 40% of local constituency development fund directly to smart school labs and clean water.',
        quality: 'GOOD',
        trustGain: 7,
        reputationGain: 6,
        requiredSkill: 'politicalKnowledge',
      },
      {
        id: 'C',
        textHi: 'हम जनता से चंदा इकट्ठा कर नए अस्पताल शुरू करेंगे।',
        textEn: 'We will appeal to public donations to fund private emergency clinics.',
        quality: 'POOR',
        trustGain: -6,
        reputationGain: -5,
        requiredSkill: 'communication',
      }
    ]
  },
  {
    id: 'Q3_INFRA_CORRUPTION',
    topicHi: 'पारदर्शिता व जनसेवा',
    topicEn: 'Corruption-Free Administration',
    questionHi: 'सरकारी योजनाओं में दलाली और कमीशनखोरी को आप किस प्रकार पूरी तरह समाप्त करेंगे?',
    questionEn: 'How will you eliminate middleman kickbacks and delays in government welfare schemes?',
    opponentArgHi: 'विपक्ष का दावा: "हमारे आते ही सब ठीक हो जाएगा।"',
    options: [
      {
        id: 'A',
        textHi: '100% प्रत्यक्ष लाभ अंतरण (DBT), हर वार्ड में नागरिक निगरानी समिति और 15 दिन में ऑनलाइन समाधान गारंटी।',
        textEn: '100% Direct Benefit Transfer (DBT), ward social audits, and a guaranteed 15-day digital grievance redressal.',
        quality: 'EXCELLENT',
        trustGain: 10,
        reputationGain: 10,
        requiredSkill: 'politicalKnowledge',
      },
      {
        id: 'B',
        textHi: 'मैं खुद हर हफ्ते खुली जनअदालत लगाकर अधिकारियों के सामने जनता की समस्याएं हल करवाऊंगा।',
        textEn: 'I will personally hold weekly open citizen grievance courts to hold bureaucrats accountable.',
        quality: 'GOOD',
        trustGain: 7,
        reputationGain: 6,
        requiredSkill: 'communication',
      },
      {
        id: 'C',
        textHi: 'भ्रष्टाचार तो देश की पुरानी आदत है, इसे धीरे-धीरे ही बदला जा सकता है।',
        textEn: 'Corruption is deep-rooted, citizens cannot expect overnight transformations.',
        quality: 'POOR',
        trustGain: -10,
        reputationGain: -8,
        requiredSkill: 'strategy',
      }
    ]
  }
];

// -------------------------------------------------------------
// CORE ELECTION CALCULATION ENGINE
// -------------------------------------------------------------
export function calculate7DayElectionResult(
  state: Election7DayState,
  player: PlayerProfile,
  party: PoliticalParty | null,
  assignedMembers: PartyMember[],
  multiplayerFriends: MultiplayerFriend[]
): {
  isWon: boolean;
  totalVotesPolled: number;
  playerVotes: number;
  playerVoteShare: number;
  opponentVotes: number;
  opponentVoteShare: number;
  otherVotes: number;
  otherVoteShare: number;
  margin: number;
  turnoutPercent: number;
  scorecard: PostElectionScorecard;
} {
  // Difficulty multiplier for opponent
  let oppMultiplier = 1.0;
  if (state.difficulty === 'EASY') oppMultiplier = 0.85;
  if (state.difficulty === 'HARD') oppMultiplier = 1.15;
  if (state.difficulty === 'EXPERT') oppMultiplier = 1.30;

  // Turnout calculation (62% - 82%) based on campaign intensity
  const baseTurnout = 65 + (state.groundInfluence * 0.12) + (state.mediaReputation * 0.06);
  const turnoutPercent = Number(Math.min(84, Math.max(58, baseTurnout + (Math.random() * 4 - 2))).toFixed(1));
  const totalVotesPolled = Math.round((state.population * turnoutPercent) / 100);

  // 1. Candidate Skill Score (0-100)
  const candidateSkillScore = Math.round(
    (player.stats.leadership * 0.3) +
    (player.stats.communication * 0.3) +
    (player.stats.politicalKnowledge * 0.2) +
    (player.stats.strategy * 0.2)
  );

  // 2. Ground Campaign Score (0-100)
  let groundScore = Math.min(100, Math.round(state.groundInfluence * 1.2));
  // Member bonus for ground
  const groundLeader = assignedMembers.find(m => m.role === 'DISTRICT_LEADER' || m.role === 'SENIOR_LEADER');
  if (groundLeader) groundScore = Math.min(100, groundScore + Math.round(groundLeader.stats.publicSupport * 0.15));

  // 3. Media Performance Score (0-100)
  let mediaScore = Math.min(100, Math.round(state.mediaReputation * 1.1));
  const mediaLeader = assignedMembers.find(m => m.stats.mediaHandling > 70);
  if (mediaLeader) mediaScore = Math.min(100, mediaScore + 10);

  // 4. Public Trust Score (0-100)
  const trustScore = Math.min(100, Math.max(10, Math.round(state.publicTrust)));

  // 5. Strategy Score (0-100)
  let strategyScore = 60;
  if (state.chosenStrategy) strategyScore += 15;
  if (state.debateScore > 15) strategyScore += 15;
  else if (state.debateScore < 0) strategyScore -= 15;
  strategyScore = Math.min(100, Math.max(20, strategyScore));

  // 6. Multiplayer Synergy Boost (up to +12%)
  const mpBonus = Math.min(15, state.multiplayerContributionBonus);

  // 7. Opponent Strength Score (0-100)
  const opponentStrengthScore = Math.min(100, Math.round(state.opponentStrength * oppMultiplier));

  // -------------------------------------------------------------
  // COMPREHENSIVE VOTE SHARE CALCULATION
  // -------------------------------------------------------------
  // Weighted candidate power
  const playerRawPower = 
    (trustScore * 0.28) +
    (groundScore * 0.24) +
    (strategyScore * 0.18) +
    (mediaScore * 0.14) +
    (candidateSkillScore * 0.16) +
    mpBonus;

  // Opponent power with slight random swing
  const opponentRawPower = 
    (opponentStrengthScore * 0.85) +
    (Math.random() * 12 - 6);

  // Third party / independents take small share (typically 3% - 8%)
  const otherShare = Number((3 + Math.random() * 5).toFixed(1));
  const contestableShare = 100 - otherShare;

  // Split contestable share proportionally
  const totalPower = playerRawPower + opponentRawPower;
  const playerFraction = playerRawPower / totalPower;

  // Player vote share
  const rawPlayerShare = contestableShare * playerFraction;
  const playerVoteShare = Number(Math.min(68, Math.max(18, rawPlayerShare)).toFixed(1));
  const opponentVoteShare = Number((contestableShare - playerVoteShare).toFixed(1));

  const playerVotes = Math.round((totalVotesPolled * playerVoteShare) / 100);
  const opponentVotes = Math.round((totalVotesPolled * opponentVoteShare) / 100);
  const otherVotes = totalVotesPolled - playerVotes - opponentVotes;

  const isWon = playerVotes > opponentVotes;
  const margin = Math.abs(playerVotes - opponentVotes);

  // Determine major reason for outcome
  let mainReasonHi = '';
  let mainReasonEn = '';
  let keyMistakeHi = '';
  let keyMistakeEn = '';

  if (isWon) {
    if (groundScore >= 75) {
      mainReasonHi = 'घर-घर सघन जनसंपर्क और बूथ कार्यकर्ताओं के अभूतपूर्व परिश्रम ने निर्णायक बढ़त दिलाई।';
      mainReasonEn = 'Exemplary door-to-door ground outreach and booth worker dedication secured the win.';
    } else if (strategyScore >= 75) {
      mainReasonHi = 'सटीक चुनाव रणनीति और अंतिम टीवी डिबेट में विपक्षी तर्कों के शानदार जवाबों ने जीत तय की।';
      mainReasonEn = 'Superior campaign strategy and command over the final debate clinched victory.';
    } else if (trustScore >= 70) {
      mainReasonHi = 'आपकी निष्कलंक छवि और संकट के समय जनसेवा ने मतदाताओं का अटूट विश्वास जीता।';
      mainReasonEn = 'Unshakable citizen trust and timely crisis relief work formed your victory pillar.';
    } else {
      mainReasonHi = 'संतुलित प्रचार अभियान और कार्यकर्ताओं के एकजुट प्रयास से महत्वपूर्ण विजय प्राप्त हुई।';
      mainReasonEn = 'Balanced outreach and united party cadre discipline pushed you over the victory line.';
    }
  } else {
    // Loss reasons
    if (groundScore < 50) {
      mainReasonHi = 'ग्रामीण व बूथ स्तर पर जनसंपर्क कमजोर रहा; विरोधी दल ने घर-घर जाकर बढ़त बना ली।';
      mainReasonEn = 'Weak grassroots presence; opponent capitalized heavily on door-to-door outreach.';
      keyMistakeHi = 'रैली की तुलना में बूथ व चौपाल संवाद पर अधिक ध्यान देने की आवश्यकता थी।';
      keyMistakeEn = 'Needed more focus on booth management rather than large rallies.';
    } else if (trustScore < 50) {
      mainReasonHi = 'संकट या मीडिया विवाद के समय गलत निर्णय से मतदाताओं में संशय उत्पन्न हुआ।';
      mainReasonEn = 'Missteps during crisis or media controversies dented voter trust.';
      keyMistakeHi = 'आपदा प्रबंधन और मीडिया स्पष्टीकरण में त्वरित व संवेदनशील रुख अपनाना चाहिए था।';
      keyMistakeEn = 'A more transparent, empathetic crisis response was required.';
    } else if (opponentStrengthScore >= 75) {
      mainReasonHi = 'विपक्षी दल का कैडर अत्यधिक मजबूत व आक्रामक था; मुकाबला अत्यंत कड़ा रहा।';
      mainReasonEn = 'Opponent fielded an exceptionally entrenched cadre and counter-campaigned fiercely.';
      keyMistakeHi = 'विपक्ष के स्थानीय चक्रव्यूह को भेदने के लिए और अधिक सहयोगियों की सहायता चाहिए थी।';
      keyMistakeEn = 'Needed stronger coalition support to counter the opponent ground machine.';
    } else {
      mainReasonHi = 'संसाधनों की कमी व अंतिम डिबेट में कमजोर प्रदर्शन के कारण कुछ मतों से हार का सामना करना पड़ा।';
      mainReasonEn = 'Resource crunch and debate slip-ups resulted in a narrow margin defeat.';
      keyMistakeHi = 'बजट और प्रचार समय का अधिक संतुलित आवंटन आवश्यक था।';
      keyMistakeEn = 'Better allocation of campaign funds and prep time was necessary.';
    }
  }

  const scorecard: PostElectionScorecard = {
    strategyScore,
    trustScore,
    mediaScore,
    groundScore,
    candidateSkillScore,
    opponentStrengthScore,
    mainReasonHi,
    mainReasonEn,
    keyMistakeHi,
    keyMistakeEn,
  };

  return {
    isWon,
    totalVotesPolled,
    playerVotes,
    playerVoteShare,
    opponentVotes,
    opponentVoteShare,
    otherVotes,
    otherVoteShare: otherShare,
    margin,
    turnoutPercent,
    scorecard,
  };
}
