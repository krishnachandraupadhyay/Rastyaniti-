import type { DemographicSupport, PlayerResources, PlayerStats } from './game';

export type EventCategory = 
  | 'CRISIS'
  | 'MEDIA_TRIAL'
  | 'DISASTER'
  | 'OPPOSITION_ATTACK'
  | 'ECONOMIC_SHOCK'
  | 'OPPORTUNITY'
  | 'PARLIAMENT_DEBATE';

export interface EventChoice {
  id: string;
  titleHi: string;
  titleEn: string;
  descHi: string;
  descEn: string;
  cost: number;
  timeDays: number;
  risk: 'LOW' | 'MEDIUM' | 'HIGH';
  expectedEffectHi: string;
  expectedEffectEn: string;
  consequenceHi: string;
  consequenceEn: string;
  statChanges?: Partial<PlayerStats>;
  resourceChanges?: Partial<PlayerResources>;
  supportChanges?: Partial<DemographicSupport>;
  popularityChange?: number;
  trustChange?: number;
}

export interface GameEvent {
  id: string;
  category: EventCategory;
  headlineHi: string;
  headlineEn: string;
  descriptionHi: string;
  descriptionEn: string;
  affectedRegion?: string;
  choices: EventChoice[];
  isUrgent?: boolean; // Timer ticking countdown
  timeLimitSeconds?: number;
}

export interface NewsNotification {
  id: string;
  titleHi: string;
  titleEn: string;
  type: 'ELECTION' | 'OPPOSITION' | 'MEDIA' | 'CRISIS' | 'POLL' | 'ACHIEVEMENT';
  timestamp: string;
  isRead: boolean;
}
