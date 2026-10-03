export type Language = 'hi' | 'en';

export type GameStage = 
  | 'CINEMATIC'
  | 'CHARACTER_CREATION'
  | 'PARTY_CREATION'
  | 'MAIN_GAME'
  | 'ELECTION_DAY';

export type PoliticalLevel = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12;

export interface PlayerStats {
  leadership: number;       // 0-100
  communication: number;    // 0-100
  politicalKnowledge: number; // 0-100
  publicTrust: number;      // 0-100
  strategy: number;         // 0-100
  administration: number;   // 0-100
  finance: number;          // 0-100
  crisisManagement: number; // 0-100
}

export interface PlayerResources {
  money: number;            // Personal funds (₹)
  partyFunds: number;       // Party treasury (₹)
  workers: number;          // Dedicated cadres
  volunteers: number;       // Youth & local volunteers
  influence: number;        // 0-100 Political weight
  energy: number;           // 0-100 Daily energy for actions
}

export interface DemographicSupport {
  youth: number;    // 0-100%
  rural: number;    // 0-100%
  urban: number;    // 0-100%
  farmers: number;  // 0-100%
  workers: number;  // 0-100%
  business: number; // 0-100%
}

export interface PlayerProfile {
  name: string;
  age: number;
  gender: 'MALE' | 'FEMALE' | 'OTHER';
  state: string;
  district: string;
  constituency: string;
  education: string;
  occupation: string;
  background: string;
  stats: PlayerStats;
  resources: PlayerResources;
  level: PoliticalLevel;
  positionTitle: string;
  positionTitleEn: string;
}

export type PartyPriority = 
  | 'EDUCATION'
  | 'HEALTHCARE'
  | 'EMPLOYMENT'
  | 'AGRICULTURE'
  | 'INFRASTRUCTURE'
  | 'TECHNOLOGY'
  | 'ENVIRONMENT'
  | 'ECONOMY'
  | 'SOCIAL_WELFARE';

export interface PoliticalParty {
  name: string;
  shortName: string;
  slogan: string;
  symbol: string;           // icon key
  color: string;            // hex or tailwind
  description: string;
  ideology: string;
  priorities: PartyPriority[];
  popularity: number;       // 0-100
  offices: number;
  readiness: number;        // 0-100
}

export interface OppositionParty {
  id: string;
  name: string;
  shortName: string;
  leader: string;
  symbol: string;
  color: string;
  popularity: number;
  funds: number;
  seats: number;
  stance: 'AGGRESSIVE' | 'CENTRIST' | 'POPULIST' | 'CONSERVATIVE';
}

export interface Constituency {
  id: string;
  name: string;
  state: string;
  district: string;
  voterCount: number;
  urbanPercent: number;
  ruralPercent: number;
  playerSupport: number;    // 0-100%
  oppositionSupport: Record<string, number>;
  keyIssue: string;
  keyIssueEn: string;
  isPlayerHome: boolean;
  isUnlocked: boolean;
}

export type CampaignActionType = 
  | 'RALLY'
  | 'DOOR_TO_DOOR'
  | 'PUBLIC_MEETING'
  | 'TOWNHALL'
  | 'DEBATE'
  | 'MANIFESTO'
  | 'DIGITAL_CAMPAIGN'
  | 'MEDIA_CAMPAIGN'
  | 'VOLUNTEER_DRIVE'
  | 'COMMUNITY_OUTREACH';

export interface CampaignAction {
  id: CampaignActionType;
  titleHi: string;
  titleEn: string;
  descHi: string;
  descEn: string;
  cost: number;
  energyCost: number;
  workersCost: number;
  daysCost: number;
  trustGain: number;
  popularityGain: number;
  mediaGain: number;
  targetGroup: keyof DemographicSupport;
  icon: string;
}

export interface Achievement {
  id: string;
  titleHi: string;
  titleEn: string;
  descHi: string;
  descEn: string;
  icon: string;
  unlocked: boolean;
}
