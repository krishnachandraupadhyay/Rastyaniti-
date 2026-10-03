export type PartyRole =
  | 'PARTY_LEADER'
  | 'SENIOR_LEADER'
  | 'STATE_LEADER'
  | 'DISTRICT_LEADER'
  | 'CONSTITUENCY_LEADER'
  | 'CAMPAIGN_MANAGER'
  | 'MEDIA_MANAGER'
  | 'WING_LEADER'
  | 'GENERAL_MEMBER'
  | 'VOLUNTEER';

export interface MultiplayerMemberStats {
  leadership: number;
  communication: number;
  politicalKnowledge: number;
  strategy: number;
  administration: number;
  finance: number;
  mediaHandling: number;
  publicSupport: number;
  loyalty: number;
  experience: number;
}

export interface MultiplayerAssignment {
  id: string;
  titleHi: string;
  titleEn: string;
  region: string;
  objectiveHi: string;
  objectiveEn: string;
  status: 'PENDING' | 'ACCEPTED' | 'DECLINED' | 'COMPLETED';
  contributionGain: number;
  fundsReward: number;
  popularityBoost: number;
  assignedBy: string;
  timestamp: string;
}

export interface MultiplayerFriend {
  id: string;
  playerId: string;
  username: string;
  avatar: string;
  role: PartyRole;
  roleTitleHi: string;
  roleTitleEn: string;
  assignedRegion: string;
  xp: number;
  level: number;
  status: 'ONLINE' | 'OFFLINE' | 'CAMPAIGNING' | 'IN_RALLY';
  stats: MultiplayerMemberStats;
  contributedFunds: number;
  contributedPopularity: number;
  totalContributionScore: number;
  activeAssignment?: MultiplayerAssignment;
  recentActivities: string[];
}

export interface PartyChatMessage {
  id: string;
  senderId: string;
  senderName: string;
  senderRole: string;
  isLeaderAnnouncement?: boolean;
  message: string;
  timestamp: string;
}

export interface PartyInvite {
  inviteCode: string;
  partyName: string;
  leaderName: string;
  invitedPlayerId: string;
  status: 'PENDING' | 'ACCEPTED' | 'DECLINED';
  createdAt: string;
}

export interface MultiplayerPartyState {
  partyId: string;
  partyCode: string;
  partyName: string;
  leaderId: string;
  leaderName: string;
  nationalRank: number;
  partyLevel: number;
  partyXP: number;
  totalMembers: number;
  pooledPartyFunds: number;
  activeAccountId: string; // ID of current simulator account
  members: MultiplayerFriend[];
  incomingInvites: PartyInvite[];
  chatMessages: PartyChatMessage[];
  activityFeed: {
    id: string;
    sender: string;
    actionHi: string;
    actionEn: string;
    timestamp: string;
    boostText: string;
  }[];
}

export const INITIAL_MULTIPLAYER_MEMBERS: MultiplayerFriend[] = [
  {
    id: 'user-leader',
    playerId: 'RN_LEADER_001',
    username: 'देवराज चौहान (आप / Party Leader)',
    avatar: '👨‍💼',
    role: 'PARTY_LEADER',
    roleTitleHi: 'राष्ट्रीय अध्यक्ष (Party Leader)',
    roleTitleEn: 'National Party President',
    assignedRegion: 'अखिल भारतीय (National)',
    xp: 3200,
    level: 7,
    status: 'ONLINE',
    stats: {
      leadership: 88,
      communication: 85,
      politicalKnowledge: 82,
      strategy: 90,
      administration: 78,
      finance: 75,
      mediaHandling: 80,
      publicSupport: 86,
      loyalty: 100,
      experience: 3200,
    },
    contributedFunds: 250000,
    contributedPopularity: 25,
    totalContributionScore: 1250,
    recentActivities: ['राष्ट्रीय संसदीय बोर्ड बैठक की अध्यक्षता की', 'घोषणापत्र समिति को अंतिम रूप दिया'],
  },
  {
    id: 'user-amit',
    playerId: 'RN_USER_8821',
    username: 'अमित कुमार (Amit)',
    avatar: '🧑‍💼',
    role: 'STATE_LEADER',
    roleTitleHi: 'बिहार प्रदेश अध्यक्ष (State Leader)',
    roleTitleEn: 'Bihar State Leader',
    assignedRegion: 'Bihar',
    xp: 2100,
    level: 5,
    status: 'ONLINE',
    stats: {
      leadership: 82,
      communication: 79,
      politicalKnowledge: 75,
      strategy: 78,
      administration: 80,
      finance: 70,
      mediaHandling: 72,
      publicSupport: 84,
      loyalty: 92,
      experience: 2100,
    },
    contributedFunds: 120000,
    contributedPopularity: 18,
    totalContributionScore: 920,
    activeAssignment: {
      id: 'asg-1',
      titleHi: 'बिहार सघन जनसंपर्क अभियान',
      titleEn: 'Bihar Grassroots Outreach Drive',
      region: 'Bihar',
      objectiveHi: 'पटना व मुजफ्फरपुर में 50 चौपाल सभाएं आयोजित करना',
      objectiveEn: 'Organize 50 village townhalls across Patna & Muzaffarpur',
      status: 'ACCEPTED',
      contributionGain: 120,
      fundsReward: 40000,
      popularityBoost: 5,
      assignedBy: 'देवराज चौहान (Leader)',
      timestamp: '2 घंटे पहले',
    },
    recentActivities: ['पटना में 25,000 युवाओं की बाइक रैली निकाली', '15 नए बूथ प्रभारी नियुक्त किए'],
  },
  {
    id: 'user-priya',
    playerId: 'RN_USER_3490',
    username: 'प्रिया शर्मा (Priya)',
    avatar: '👩‍💼',
    role: 'MEDIA_MANAGER',
    roleTitleHi: 'मुख्य मीडिया प्रभारी (Media Manager)',
    roleTitleEn: 'National Media Manager',
    assignedRegion: 'Delhi / National',
    xp: 1850,
    level: 4,
    status: 'ONLINE',
    stats: {
      leadership: 75,
      communication: 92,
      politicalKnowledge: 84,
      strategy: 80,
      administration: 72,
      finance: 65,
      mediaHandling: 94,
      publicSupport: 76,
      loyalty: 90,
      experience: 1850,
    },
    contributedFunds: 85000,
    contributedPopularity: 16,
    totalContributionScore: 810,
    activeAssignment: {
      id: 'asg-2',
      titleHi: 'प्राइम टाइम राष्ट्रीय टीवी डिबेट आक्रामकता',
      titleEn: 'Prime-Time National TV Debate Defense',
      region: 'National Media',
      objectiveHi: 'पार्टी की आर्थिक नीति पर विपक्ष के भ्रामक दावों का खंडन',
      objectiveEn: 'Counter opposition misinformation on party economic manifesto',
      status: 'ACCEPTED',
      contributionGain: 95,
      fundsReward: 25000,
      popularityBoost: 4,
      assignedBy: 'देवराज चौहान (Leader)',
      timestamp: '4 घंटे पहले',
    },
    recentActivities: ['राष्ट्रीय चैनल पर पार्टी का विजन मजबूती से रखा', 'सोशल मीडिया पर ट्रेंडिंग हैशटैग लीड किया'],
  },
  {
    id: 'user-rajesh',
    playerId: 'RN_USER_6119',
    username: 'राजेश पटेल (Rajesh)',
    avatar: '👨‍💼',
    role: 'CAMPAIGN_MANAGER',
    roleTitleHi: 'चुनाव अभियान प्रबंधक (Campaign Manager)',
    roleTitleEn: 'Campaign Strategist',
    assignedRegion: 'Gujarat',
    xp: 1600,
    level: 4,
    status: 'CAMPAIGNING',
    stats: {
      leadership: 77,
      communication: 74,
      politicalKnowledge: 80,
      strategy: 88,
      administration: 85,
      finance: 78,
      mediaHandling: 70,
      publicSupport: 72,
      loyalty: 88,
      experience: 1600,
    },
    contributedFunds: 95000,
    contributedPopularity: 14,
    totalContributionScore: 740,
    recentActivities: ['अहमदाबाद में किसान टाउनहॉल संवाद सफलतापूर्वक पूरा किया', 'डिजिटल बूथ मैपिंग पूरी की'],
  },
  {
    id: 'user-vikram',
    playerId: 'RN_USER_4522',
    username: 'विक्रम सिंह (Vikram)',
    avatar: '🧑‍💼',
    role: 'WING_LEADER',
    roleTitleHi: 'युवा मोर्चा अध्यक्ष (Youth Wing Leader)',
    roleTitleEn: 'Youth Wing President',
    assignedRegion: 'Uttar Pradesh',
    xp: 1250,
    level: 3,
    status: 'OFFLINE',
    stats: {
      leadership: 80,
      communication: 76,
      politicalKnowledge: 68,
      strategy: 70,
      administration: 65,
      finance: 60,
      mediaHandling: 74,
      publicSupport: 82,
      loyalty: 94,
      experience: 1250,
    },
    contributedFunds: 50000,
    contributedPopularity: 12,
    totalContributionScore: 580,
    recentActivities: ['वाराणसी में 500 नए युवा स्वयंसेवकों को पार्टी की सदस्यता दिलाई'],
  }
];

export const INITIAL_MULTIPLAYER_PARTY: MultiplayerPartyState = {
  partyId: 'RN-PARTY-7842',
  partyCode: 'RN-7842',
  partyName: 'जन स्वराज्य मोर्चा',
  leaderId: 'user-leader',
  leaderName: 'देवराज चौहान',
  nationalRank: 12,
  partyLevel: 4,
  partyXP: 4800,
  totalMembers: 5,
  pooledPartyFunds: 600000,
  activeAccountId: 'user-leader',
  members: INITIAL_MULTIPLAYER_MEMBERS,
  incomingInvites: [
    {
      inviteCode: 'RN-SWARAJ-99',
      partyName: 'जन स्वराज्य मोर्चा',
      leaderName: 'देवराज चौहान',
      invitedPlayerId: 'RN_USER_TEST',
      status: 'PENDING',
      createdAt: 'आज',
    }
  ],
  chatMessages: [
    {
      id: 'msg-1',
      senderId: 'user-leader',
      senderName: 'देवराज चौहान (Leader)',
      senderRole: 'राष्ट्रीय अध्यक्ष',
      isLeaderAnnouncement: true,
      message: 'साथियों! आगामी चुनाव में हमें प्रत्येक बूथ पर 100% मतदाता संपर्क सुनिश्चित करना है। सभी अपनी जिम्मेदारियों पर जुट जाएं!',
      timestamp: 'सुबह 09:30',
    },
    {
      id: 'msg-2',
      senderId: 'user-amit',
      senderName: 'अमित कुमार (Bihar)',
      senderRole: 'प्रदेश अध्यक्ष',
      message: 'अध्यक्ष जी, बिहार में 12 जिलों की बूथ कमेटियां गठित हो चुकी हैं। जनसमर्थन में भारी उछाल दिख रहा है!',
      timestamp: 'सुबह 10:15',
    },
    {
      id: 'msg-3',
      senderId: 'user-priya',
      senderName: 'प्रिया शर्मा (Media)',
      senderRole: 'मीडिया प्रभारी',
      message: 'आज शाम 8 बजे नेशनल टीवी डिबेट में हम अपने 10-सूत्रीय रोजगार घोषणापत्र को प्रमुखता से रखेंगे।',
      timestamp: 'दोपहर 12:00',
    }
  ],
  activityFeed: [
    {
      id: 'act-1',
      sender: 'अमित कुमार (Bihar Leader)',
      actionHi: 'ने बिहार में सघन जनसंपर्क अभियान सफलतापूर्वक पूरा किया',
      actionEn: 'completed intensive door-to-door drive across Bihar',
      timestamp: '15 मिनट पहले',
      boostText: '+5% Popularity, +₹40,000 Funds',
    },
    {
      id: 'act-2',
      sender: 'प्रिया शर्मा (Media Manager)',
      actionHi: 'ने राष्ट्रीय टीवी डिबेट में पार्टी का विजन सफलतापूर्वक रखा',
      actionEn: 'championed party vision in prime-time TV debate',
      timestamp: '1 घंटा पहले',
      boostText: '+4% Public Trust, +₹25,000 Funds',
    },
    {
      id: 'act-3',
      sender: 'विक्रम सिंह (Youth Leader)',
      actionHi: 'ने 500 नए युवा कार्यकर्ताओं की भर्ती की',
      actionEn: 'recruited 500 dedicated young cadres',
      timestamp: '3 घंटे पहले',
      boostText: '+500 Volunteers',
    }
  ]
};

// Generates encrypted game save code
export function generateSaveCode(stateObj: any): string {
  try {
    const json = JSON.stringify(stateObj);
    return btoa(encodeURIComponent(json));
  } catch (e) {
    return 'SAVE_ERROR';
  }
}

// Restores state from code
export function restoreSaveCode(code: string): any | null {
  try {
    const decoded = decodeURIComponent(atob(code));
    return JSON.parse(decoded);
  } catch (e) {
    return null;
  }
}
