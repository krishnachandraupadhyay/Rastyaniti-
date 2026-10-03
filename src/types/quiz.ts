import type { PlayerStats } from './game';

export type QuizCategory = 
  | 'CONSTITUTION'
  | 'DEMOCRACY'
  | 'PARLIAMENT'
  | 'ELECTIONS'
  | 'GOVERNANCE'
  | 'ECONOMY';

export type QuizDifficulty = 'EASY' | 'MEDIUM' | 'HARD' | 'EXPERT';

export interface QuizQuestion {
  id: string;
  category: QuizCategory;
  difficulty: QuizDifficulty;
  questionHi: string;
  questionEn: string;
  optionsHi: string[];
  optionsEn: string[];
  correctIndex: number;
  explanationHi: string;
  explanationEn: string;
  rewardStat: keyof PlayerStats;
  rewardAmount: number;
}

export interface TrainingProgram {
  id: string;
  titleHi: string;
  titleEn: string;
  descHi: string;
  descEn: string;
  targetStat: keyof PlayerStats;
  statBoost: number;
  cost: number;
  timeDays: number;
  energyCost: number;
  icon: string;
}
