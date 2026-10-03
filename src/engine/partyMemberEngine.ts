export type MemberRole = 
  | 'PARTY_LEADER'        // पार्टी राष्ट्रीय अध्यक्ष
  | 'SENIOR_LEADER'       // वरिष्ठ नेता / संसदीय बोर्ड
  | 'STATE_LEADER'        // प्रदेश अध्यक्ष
  | 'DISTRICT_LEADER'     // जिला अध्यक्ष
  | 'CONSTITUENCY_LEADER' // विधानसभा/लोकसभा प्रभारी
  | 'WING_LEADER'         // मोर्चा प्रमुख (युवा/महिला/छात्र)
  | 'GENERAL_MEMBER'      // सक्रिय सदस्य
  | 'VOLUNTEER';          // स्वयंसेवक

export type WingType = 'YOUTH' | 'WOMEN' | 'STUDENTS' | 'FARMERS' | 'WORKERS' | 'NONE';

export interface MemberStats {
  leadership: number;         // 0-100
  communication: number;      // 0-100
  politicalKnowledge: number; // 0-100
  strategy: number;           // 0-100
  administration: number;     // 0-100
  finance: number;            // 0-100
  mediaHandling: number;      // 0-100
  publicSupport: number;      // 0-100
  loyalty: number;            // 0-100
  experience: number;         // XP
  level: number;              // 1-10
}

export type MissionType = 
  | 'RALLY'             // जनसभा संबोधन
  | 'DOOR_TO_DOOR'      // घर-घर जनसंपर्क
  | 'DEBATE'            // टीवी डिबेट
  | 'PRESS_CONFERENCE'  // प्रेस वार्ता
  | 'CADRE_TRAINING'    // कार्यकर्ता प्रशिक्षण
  | 'CRISIS_RELIEF';    // आपदा राहत सेवा

export interface MemberMission {
  id: string;
  type: MissionType;
  titleHi: string;
  titleEn: string;
  targetState: string;
  durationDays: number;
  energyCost: number;
  fundsCost: number;
  assignedMemberId: string;
  status: 'PENDING' | 'IN_PROGRESS' | 'COMPLETED';
}

export interface PartyMember {
  id: string;
  name: string;
  nameEn: string;
  avatar: string;
  gender: 'MALE' | 'FEMALE';
  age: number;
  homeState: string;
  assignedState: string;
  assignedDistrict?: string;
  role: MemberRole;
  wing: WingType;
  specialty: string;
  specialtyEn: string;
  stats: MemberStats;
  salaryMonthly: number; // ₹ per month
  currentMission?: MemberMission;
  isCustomFriend?: boolean;
}

export interface PartyDynamicsState {
  partyUnity: number;         // 0-100%
  factionTension: number;     // 0-100%
  disciplineLevel: number;    // 0-100%
  activeDisputes: string[];
}

export const ROLE_LABELS: Record<MemberRole, { hi: string; en: string; badgeColor: string }> = {
  PARTY_LEADER: { hi: 'राष्ट्रीय अध्यक्ष', en: 'National President', badgeColor: 'from-amber-500 to-saffron' },
  SENIOR_LEADER: { hi: 'वरिष्ठ नेता / संसदीय बोर्ड', en: 'Senior Leader / Board', badgeColor: 'from-purple-600 to-indigo-600' },
  STATE_LEADER: { hi: 'प्रदेश अध्यक्ष', en: 'State President', badgeColor: 'from-blue-600 to-cyan-600' },
  DISTRICT_LEADER: { hi: 'जिला अध्यक्ष', en: 'District President', badgeColor: 'from-emerald-600 to-teal-600' },
  CONSTITUENCY_LEADER: { hi: 'क्षेत्रीय प्रभारी', en: 'Constituency Incharge', badgeColor: 'from-amber-600 to-yellow-600' },
  WING_LEADER: { hi: 'मोर्चा प्रमुख', en: 'Wing President', badgeColor: 'from-rose-600 to-pink-600' },
  GENERAL_MEMBER: { hi: 'सक्रिय कार्यकर्ता', en: 'Active Cadre', badgeColor: 'from-slate-600 to-slate-700' },
  VOLUNTEER: { hi: 'जमीनी स्वयंसेवक', en: 'Field Volunteer', badgeColor: 'from-stone-600 to-neutral-700' },
};

export const INITIAL_PARTY_MEMBERS: PartyMember[] = [
  {
    id: 'mem-1',
    name: 'आलोक रंजन त्रिपाठी',
    nameEn: 'Alok Ranjan Tripathi',
    avatar: '👨‍💼',
    gender: 'MALE',
    age: 48,
    homeState: 'Uttar Pradesh',
    assignedState: 'Uttar Pradesh',
    role: 'SENIOR_LEADER',
    wing: 'NONE',
    specialty: 'ओजस्वी वक्ता व रणनीतिकार',
    specialtyEn: 'Fiery Orator & Strategist',
    stats: {
      leadership: 82,
      communication: 88,
      politicalKnowledge: 85,
      strategy: 80,
      administration: 74,
      finance: 65,
      mediaHandling: 84,
      publicSupport: 78,
      loyalty: 90,
      experience: 1200,
      level: 5,
    },
    salaryMonthly: 40000,
  },
  {
    id: 'mem-2',
    name: 'सुनीता वर्मा',
    nameEn: 'Sunita Verma',
    avatar: '👩‍💼',
    gender: 'FEMALE',
    age: 42,
    homeState: 'Bihar',
    assignedState: 'Bihar',
    role: 'STATE_LEADER',
    wing: 'NONE',
    specialty: 'जमीनी संगठन व महिला सशक्तिकरण',
    specialtyEn: 'Grassroots Mobilizer & Women Leader',
    stats: {
      leadership: 78,
      communication: 80,
      politicalKnowledge: 75,
      strategy: 72,
      administration: 80,
      finance: 70,
      mediaHandling: 72,
      publicSupport: 82,
      loyalty: 92,
      experience: 950,
      level: 4,
    },
    salaryMonthly: 30000,
  },
  {
    id: 'mem-3',
    name: 'विक्रम राठौड़',
    nameEn: 'Vikram Rathore',
    avatar: '🧑‍💼',
    gender: 'MALE',
    age: 29,
    homeState: 'Rajasthan',
    assignedState: 'Rajasthan',
    role: 'WING_LEADER',
    wing: 'YOUTH',
    specialty: 'युवा आक्रोश व सोशल मीडिया अभियान',
    specialtyEn: 'Youth Mobilization & Viral Campaigns',
    stats: {
      leadership: 75,
      communication: 84,
      politicalKnowledge: 65,
      strategy: 70,
      administration: 60,
      finance: 55,
      mediaHandling: 88,
      publicSupport: 76,
      loyalty: 88,
      experience: 700,
      level: 3,
    },
    salaryMonthly: 20000,
  },
  {
    id: 'mem-4',
    name: 'डॉ. मीनाक्षी सेनगुप्ता',
    nameEn: 'Dr. Meenakshi Sengupta',
    avatar: '👩‍🔬',
    gender: 'FEMALE',
    age: 45,
    homeState: 'West Bengal',
    assignedState: 'West Bengal',
    role: 'SENIOR_LEADER',
    wing: 'NONE',
    specialty: 'आर्थिक नीति व मेनिफेस्टो ड्राफ्टिंग',
    specialtyEn: 'Economic Policy & Manifesto Architect',
    stats: {
      leadership: 70,
      communication: 74,
      politicalKnowledge: 92,
      strategy: 85,
      administration: 86,
      finance: 90,
      mediaHandling: 76,
      publicSupport: 68,
      loyalty: 94,
      experience: 1100,
      level: 5,
    },
    salaryMonthly: 35000,
  },
  {
    id: 'mem-5',
    name: 'बलविंदर सिंह सिद्धू',
    nameEn: 'Balwinder Singh Sidhu',
    avatar: '🧔',
    gender: 'MALE',
    age: 51,
    homeState: 'Punjab',
    assignedState: 'Punjab',
    role: 'WING_LEADER',
    wing: 'FARMERS',
    specialty: 'किसान आंदोलन व ग्रामीण समन्वय',
    specialtyEn: 'Agrarian Rights & Rural Coordination',
    stats: {
      leadership: 80,
      communication: 76,
      politicalKnowledge: 72,
      strategy: 68,
      administration: 70,
      finance: 60,
      mediaHandling: 70,
      publicSupport: 86,
      loyalty: 89,
      experience: 850,
      level: 4,
    },
    salaryMonthly: 25000,
  },
  {
    id: 'mem-6',
    name: 'आनंद कुमार रेड्डी',
    nameEn: 'Anand Kumar Reddy',
    avatar: '👨‍💼',
    gender: 'MALE',
    age: 38,
    homeState: 'Andhra Pradesh',
    assignedState: 'Andhra Pradesh',
    role: 'DISTRICT_LEADER',
    wing: 'NONE',
    specialty: 'बूथ प्रबंधन व कैडर अनुशासन',
    specialtyEn: 'Booth Management & Cadre Discipline',
    stats: {
      leadership: 68,
      communication: 65,
      politicalKnowledge: 70,
      strategy: 74,
      administration: 82,
      finance: 68,
      mediaHandling: 60,
      publicSupport: 72,
      loyalty: 95,
      experience: 600,
      level: 3,
    },
    salaryMonthly: 18000,
  }
];

export const RECRUITMENT_CANDIDATE_POOL: Omit<PartyMember, 'id'>[] = [
  {
    name: 'रोहित भारद्वाज',
    nameEn: 'Rohit Bhardwaj',
    avatar: '👨‍🎓',
    gender: 'MALE',
    age: 26,
    homeState: 'Delhi',
    assignedState: 'Delhi',
    role: 'GENERAL_MEMBER',
    wing: 'STUDENTS',
    specialty: 'विश्वविद्यालय छात्र संघ प्रमुख',
    specialtyEn: 'University Student Union Leader',
    stats: {
      leadership: 65,
      communication: 78,
      politicalKnowledge: 60,
      strategy: 62,
      administration: 55,
      finance: 50,
      mediaHandling: 75,
      publicSupport: 68,
      loyalty: 85,
      experience: 250,
      level: 2,
    },
    salaryMonthly: 12000,
  },
  {
    name: 'एडवोकेट कावेरी पिल्लई',
    nameEn: 'Advocate Kaveri Pillai',
    avatar: '👩‍⚖️',
    gender: 'FEMALE',
    age: 39,
    homeState: 'Tamil Nadu',
    assignedState: 'Tamil Nadu',
    role: 'GENERAL_MEMBER',
    wing: 'NONE',
    specialty: 'संवैधानिक कानून व चुनाव आयोग विशेषज्ञ',
    specialtyEn: 'Constitutional Law & EC Compliance',
    stats: {
      leadership: 72,
      communication: 82,
      politicalKnowledge: 88,
      strategy: 78,
      administration: 80,
      finance: 70,
      mediaHandling: 80,
      publicSupport: 70,
      loyalty: 90,
      experience: 500,
      level: 3,
    },
    salaryMonthly: 25000,
  },
  {
    name: 'दिलीप पाटिल',
    nameEn: 'Dilip Patil',
    avatar: '👨‍🌾',
    gender: 'MALE',
    age: 46,
    homeState: 'Maharashtra',
    assignedState: 'Maharashtra',
    role: 'GENERAL_MEMBER',
    wing: 'FARMERS',
    specialty: 'सहकारी बैंक व ग्रामीण नेटवर्क',
    specialtyEn: 'Cooperative Society & Rural Network',
    stats: {
      leadership: 70,
      communication: 68,
      politicalKnowledge: 66,
      strategy: 72,
      administration: 76,
      finance: 75,
      mediaHandling: 62,
      publicSupport: 76,
      loyalty: 88,
      experience: 400,
      level: 2,
    },
    salaryMonthly: 15000,
  },
];

// Helper: Calculate Mission Success & Member Growth
export function resolveMemberMission(
  member: PartyMember,
  missionType: MissionType
): {
  success: boolean;
  xpGained: number;
  popularityBoost: number;
  trustBoost: number;
  reportHi: string;
  reportEn: string;
} {
  const roll = Math.random() * 100;
  let relevantSkill = 60;

  switch (missionType) {
    case 'RALLY':
      relevantSkill = (member.stats.leadership + member.stats.communication) / 2;
      break;
    case 'DOOR_TO_DOOR':
      relevantSkill = (member.stats.publicSupport + member.stats.administration) / 2;
      break;
    case 'DEBATE':
      relevantSkill = (member.stats.communication + member.stats.mediaHandling) / 2;
      break;
    case 'PRESS_CONFERENCE':
      relevantSkill = (member.stats.mediaHandling + member.stats.politicalKnowledge) / 2;
      break;
    case 'CADRE_TRAINING':
      relevantSkill = (member.stats.leadership + member.stats.strategy) / 2;
      break;
    case 'CRISIS_RELIEF':
      relevantSkill = (member.stats.publicSupport + member.stats.administration) / 2;
      break;
  }

  const success = roll < relevantSkill + 15;
  const xpGained = success ? 150 : 60;
  const popularityBoost = success ? Math.round(relevantSkill / 12) : 2;
  const trustBoost = success ? Math.round(relevantSkill / 15) : 1;

  const reportHi = success
    ? `${member.name} ने ${member.assignedState} में शानदार प्रदर्शन किया। जनसमर्थन में +${popularityBoost}% वृद्धि हुई!`
    : `${member.name} का अभियान चुनौतियों का सामना कर रहा है, फिर भी कार्यकर्ताओं में उत्साह भरा।`;

  const reportEn = success
    ? `${member.nameEn} achieved great traction in ${member.assignedState}. Party support grew by +${popularityBoost}%!`
    : `${member.nameEn} faced tough opposition but maintained core worker morale.`;

  return { success, xpGained, popularityBoost, trustBoost, reportHi, reportEn };
}
