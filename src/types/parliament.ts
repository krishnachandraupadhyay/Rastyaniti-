export type MinistryId = 
  | 'FINANCE'
  | 'HOME_AFFAIRS'
  | 'EDUCATION'
  | 'HEALTHCARE'
  | 'AGRICULTURE'
  | 'INFRASTRUCTURE'
  | 'TECHNOLOGY'
  | 'DEFENCE'
  | 'ENVIRONMENT'
  | 'SOCIAL_WELFARE';

export interface Minister {
  id: string;
  name: string;
  ministryId: MinistryId;
  ministryTitleHi: string;
  ministryTitleEn: string;
  loyalty: number;     // 0-100
  competence: number;  // 0-100
  integrity: number;   // 0-100
  image: string;
}

export interface NationalMetrics {
  gdpGrowthRate: number;      // e.g. 7.2%
  inflationRate: number;      // e.g. 4.8%
  unemploymentRate: number;   // e.g. 5.6%
  nationalDebtPercent: number;// e.g. 54% of GDP
  publicApproval: number;     // 0-100%
  fiscalDeficit: number;      // e.g. 5.1%
  foreignReserves: number;    // In fictional billions ₹
}

export interface BudgetAllocation {
  education: number;     // Percentage of total budget
  healthcare: number;
  infrastructure: number;
  agriculture: number;
  technology: number;
  defence: number;
  environment: number;
  socialWelfare: number;
  homeAffairs: number;
}

export interface ParliamentBill {
  id: string;
  titleHi: string;
  titleEn: string;
  descHi: string;
  descEn: string;
  proposer: 'GOVERNMENT' | 'OPPOSITION' | 'PRIVATE_MEMBER';
  ministry: MinistryId;
  publicImpactHi: string;
  publicImpactEn: string;
  economicCost: number;
  requiredMajority: number; // e.g. 272 for simple majority in 543
  govVoteSupport: number;   // Initial estimated votes
  oppVoteSupport: number;
  status: 'PENDING' | 'PASSED' | 'REJECTED';
}
