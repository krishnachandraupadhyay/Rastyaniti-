// Coalition & Lok Sabha Majority Engine for RashtraNiti
export interface CoalitionPartner {
  id: string;
  nameHi: string;
  nameEn: string;
  shortName: string;
  seats: number;
  ideologyHi: string;
  ideologyEn: string;
  leaderHi: string;
  leaderEn: string;
  color: string;
  demands: {
    ministriesDemanded: string[];
    specialPackageCrores: number;
    cmpPolicyHi: string;
    cmpPolicyEn: string;
  };
  joined: boolean;
  relationshipScore: number; // 0-100
  stabilityContribution: number;
}

export interface CoalitionState {
  playerPartySeats: number;
  totalMajorityThreshold: number; // 272
  allies: CoalitionPartner[];
  potentialPartners: CoalitionPartner[];
  coalitionStability: number; // 0-100%
  agreedCMP: string[];
  concededMinistries: string[];
}

export const REGIONAL_PARTNERS: CoalitionPartner[] = [
  {
    id: 'pt-1',
    nameHi: 'संयुक्त जनक्रांति मोर्चा',
    nameEn: 'United People Revolution Front',
    shortName: 'SJM',
    seats: 38,
    ideologyHi: 'समाजवादी एवं किसान हितैषी',
    ideologyEn: 'Socialist & Agrarian Focus',
    leaderHi: 'महेंद्र प्रसाद यादव',
    leaderEn: 'Mahendra Prasad Yadav',
    color: '#16a34a',
    demands: {
      ministriesDemanded: ['कृषि मंत्रालय (Agriculture)', 'ग्रामीण विकास'],
      specialPackageCrores: 15000,
      cmpPolicyHi: 'न्यूनतम समर्थन मूल्य (MSP) की कानूनी गारंटी व कृषि ऋण माफी',
      cmpPolicyEn: 'Statutory MSP Guarantee and farm loan waiver',
    },
    joined: false,
    relationshipScore: 65,
    stabilityContribution: 80,
  },
  {
    id: 'pt-2',
    nameHi: 'दक्षिण द्रविड़ संगम',
    nameEn: 'Southern Dravid Alliance',
    shortName: 'DDS',
    seats: 34,
    ideologyHi: 'संघीय स्वायत्तता एवं सामाजिक न्याय',
    ideologyEn: 'Federal Autonomy & Social Justice',
    leaderHi: 'के. सेलवम',
    leaderEn: 'K. Selvam',
    color: '#dc2626',
    demands: {
      ministriesDemanded: ['रेल मंत्रालय (Railways)', 'सड़क परिवहन व राजमार्ग'],
      specialPackageCrores: 25000,
      cmpPolicyHi: 'तटीय आर्थिक गलियारा और राज्य करों में 50% हिस्सेदारी',
      cmpPolicyEn: 'Coastal Economic Corridor and 50% devolution of state taxes',
    },
    joined: false,
    relationshipScore: 55,
    stabilityContribution: 75,
  },
  {
    id: 'pt-3',
    nameHi: 'पश्चिम विकास मंच',
    nameEn: 'Western Development Forum',
    shortName: 'WDF',
    seats: 26,
    ideologyHi: 'व्यापार हितैषी एवं औद्योगिक विस्तार',
    ideologyEn: 'Pro-Business & Industrial Growth',
    leaderHi: 'दिलीप शाह',
    leaderEn: 'Dilip Shah',
    color: '#ea580c',
    demands: {
      ministriesDemanded: ['वाणिज्य व उद्योग मंत्रालय', 'वित्त राज्यमंत्री'],
      specialPackageCrores: 10000,
      cmpPolicyHi: 'एमएसएमई कर छूट एवं बंदरगाह आधुनिकरण',
      cmpPolicyEn: 'MSME Tax Relief and Port Modernization Scheme',
    },
    joined: false,
    relationshipScore: 70,
    stabilityContribution: 85,
  },
  {
    id: 'pt-4',
    nameHi: 'पूर्वोत्तर प्रगति परिषद',
    nameEn: 'North-East Progressive Council',
    shortName: 'NEPC',
    seats: 16,
    ideologyHi: 'जनजातीय स्वाभिमान व सीमा सुरक्षा',
    ideologyEn: 'Tribal Identity & Border Security',
    leaderHi: 'ताशी दोरजी',
    leaderEn: 'Tashi Dorjee',
    color: '#0284c7',
    demands: {
      ministriesDemanded: ['पूर्वोत्तर विकास मंत्रालय (DoNER)', 'पर्यावरण व वन'],
      specialPackageCrores: 12000,
      cmpPolicyHi: 'पर्वतीय संपर्क राजमार्ग एवं जनजाति कल्याण बजट दोगुना',
      cmpPolicyEn: 'Highland Connectivity Highway & Doubling Tribal Welfare',
    },
    joined: false,
    relationshipScore: 80,
    stabilityContribution: 90,
  },
  {
    id: 'pt-5',
    nameHi: 'स्वतंत्र सांसद महासंघ',
    nameEn: 'Independent MPs Caucus',
    shortName: 'IND',
    seats: 12,
    ideologyHi: 'स्थानीय क्षेत्रीय विकास',
    ideologyEn: 'Local Constituency Development',
    leaderHi: 'प्रो. आनंद शास्त्री',
    leaderEn: 'Prof. Anand Shastri',
    color: '#9333ea',
    demands: {
      ministriesDemanded: ['मानव संसाधन राज्यमंत्री'],
      specialPackageCrores: 5000,
      cmpPolicyHi: 'क्षेत्रीय विकास निधि (MPLADS) में ₹10 करोड़ की वृद्धि',
      cmpPolicyEn: '₹10 Crore hike in MPLADS local development fund',
    },
    joined: false,
    relationshipScore: 60,
    stabilityContribution: 70,
  },
];

export class CoalitionEngine {
  public static calculateTotalSeats(playerSeats: number, allies: CoalitionPartner[]): number {
    return playerSeats + allies.reduce((sum, ally) => sum + ally.seats, 0);
  }

  public static isMajorityReached(playerSeats: number, allies: CoalitionPartner[]): boolean {
    return this.calculateTotalSeats(playerSeats, allies) >= 272;
  }

  public static calculateStability(allies: CoalitionPartner[]): number {
    if (allies.length === 0) return 95;
    const avgScore = allies.reduce((sum, a) => sum + a.stabilityContribution * (a.relationshipScore / 100), 0) / allies.length;
    // Penalty for too many disparate partners
    const frictionPenalty = Math.max(0, (allies.length - 2) * 5);
    return Math.min(100, Math.max(10, Math.round(avgScore - frictionPenalty)));
  }

  public static attemptNegotiation(
    partner: CoalitionPartner,
    grantMinistries: boolean,
    acceptCMP: boolean,
    specialPackageGranted: boolean
  ): { success: boolean; updatedPartner: CoalitionPartner; feedbackHi: string; feedbackEn: string } {
    let scoreGain = 0;
    if (grantMinistries) scoreGain += 35;
    if (acceptCMP) scoreGain += 35;
    if (specialPackageGranted) scoreGain += 25;

    const finalScore = Math.min(100, partner.relationshipScore + scoreGain);
    const success = finalScore >= 75;

    const updatedPartner: CoalitionPartner = {
      ...partner,
      relationshipScore: finalScore,
      joined: success,
    };

    if (success) {
      return {
        success: true,
        updatedPartner,
        feedbackHi: `${partner.nameHi} ने न्यूनतम साझा कार्यक्रम (CMP) पर सहमति जताकर गठबंधन स्वीकार किया!`,
        feedbackEn: `${partner.nameEn} officially joined the coalition on agreed Common Minimum Programme!`,
      };
    } else {
      return {
        success: false,
        updatedPartner,
        feedbackHi: `${partner.nameHi} ने मांगों पर असंतोष जताया। और अधिक रियायतों की आवश्यकता है।`,
        feedbackEn: `${partner.nameEn} declined. Demands were insufficient to seal the alliance.`,
      };
    }
  }
}
