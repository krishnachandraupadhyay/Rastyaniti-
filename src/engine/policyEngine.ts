// National Policies & Flagship Schemes Engine for RashtraNiti
import { NationalMetrics } from '../types/parliament';

export type PolicyCategory = 
  | 'ECONOMY'
  | 'AGRICULTURE'
  | 'HEALTHCARE'
  | 'EDUCATION'
  | 'TECHNOLOGY'
  | 'DEFENCE'
  | 'INFRASTRUCTURE'
  | 'GREEN_ENERGY';

export interface NationalPolicy {
  id: string;
  titleHi: string;
  titleEn: string;
  descHi: string;
  descEn: string;
  category: PolicyCategory;
  costCrores: number;
  durationMonths: number;
  gdpImpact: number;           // e.g. +0.4%
  inflationImpact: number;     // e.g. -0.2%
  unemploymentImpact: number;  // e.g. -0.6%
  publicTrustGain: number;     // e.g. +8
  fiscalDeficitImpact: number; // e.g. +0.2%
  isEnacted: boolean;
  status: 'PROPOSED' | 'ACTIVE' | 'COMPLETED';
}

export const FLAGSHIP_POLICIES: NationalPolicy[] = [
  {
    id: 'pol-1',
    titleHi: 'प्रधानमंत्री किसान समृद्धि व कानूनी एमएसपी मिशन',
    titleEn: 'PM Farmer Prosperity & Legal MSP Mission',
    descHi: 'सभी प्रमुख फसलों के लिए लागत+50% मूल्य गारंटी और सौर सिंचाई पंपों पर 80% सब्सिडी।',
    descEn: 'Cost+50% statutory price guarantee on key crops with 80% solar pump subsidies.',
    category: 'AGRICULTURE',
    costCrores: 45000,
    durationMonths: 12,
    gdpImpact: 0.3,
    inflationImpact: 0.1,
    unemploymentImpact: -0.5,
    publicTrustGain: 9,
    fiscalDeficitImpact: 0.2,
    isEnacted: false,
    status: 'PROPOSED',
  },
  {
    id: 'pol-2',
    titleHi: 'डिजिटल भारत एआई व सेमीकंडक्टर राष्ट्रीय मिशन',
    titleEn: 'Digital Bharat AI & Semiconductor National Mission',
    descHi: 'घरेलू चिप निर्माण, सुपरकंप्यूटिंग क्लस्टर्स और ग्रामीण ऑप्टिकल फाइबर विस्तार।',
    descEn: 'Domestic chip fabrication fabs, sovereign AI superclusters, and rural broadband.',
    category: 'TECHNOLOGY',
    costCrores: 35000,
    durationMonths: 24,
    gdpImpact: 0.7,
    inflationImpact: -0.2,
    unemploymentImpact: -0.8,
    publicTrustGain: 7,
    fiscalDeficitImpact: 0.15,
    isEnacted: false,
    status: 'PROPOSED',
  },
  {
    id: 'pol-3',
    titleHi: 'आयुष्मान भारत सार्वभौमिक स्वास्थ्य सुरक्षा 2.0',
    titleEn: 'Ayushman Bharat Universal Health Security 2.0',
    descHi: 'प्रत्येक परिवार को ₹10 लाख का निःशुल्क कैशलैस स्वास्थ्य बीमा और जिला-स्तरीय सुपरस्पेशलिटी अस्पताल।',
    descEn: 'Universal ₹10 Lakh cashless health cover per family and district-tier super-specialty units.',
    category: 'HEALTHCARE',
    costCrores: 28000,
    durationMonths: 18,
    gdpImpact: 0.2,
    inflationImpact: 0.0,
    unemploymentImpact: -0.3,
    publicTrustGain: 12,
    fiscalDeficitImpact: 0.12,
    isEnacted: false,
    status: 'PROPOSED',
  },
  {
    id: 'pol-4',
    titleHi: 'आत्मनिर्भर रक्षा विनिर्माण व स्वदेशी जेट कार्यक्रम',
    titleEn: 'Atmanirbhar Defense & 5th-Gen Indigenous Fighter Initiative',
    descHi: 'स्वदेशी 5वीं पीढ़ी के लड़ाकू विमान, नौसैनिक युद्धपोत और ड्रोन रक्षा शील्ड का त्वरित उत्पादन।',
    descEn: 'Rapid manufacturing of indigenous 5th-gen fighters, naval destroyers, and sovereign drone domes.',
    category: 'DEFENCE',
    costCrores: 55000,
    durationMonths: 36,
    gdpImpact: 0.5,
    inflationImpact: 0.2,
    unemploymentImpact: -0.4,
    publicTrustGain: 10,
    fiscalDeficitImpact: 0.25,
    isEnacted: false,
    status: 'PROPOSED',
  },
  {
    id: 'pol-5',
    titleHi: 'हरित ऊर्जा गलियारा व राष्ट्रीय सौर ग्रिड 2030',
    titleEn: 'Green Energy Corridor & National Solar Grid 2030',
    descHi: '500 GW गैर-जीवाश्म ऊर्जा क्षमता, इलेक्ट्रिक वाहन चार्जिंग नेटवर्क और ग्रीन हाइड्रोजन प्रोत्साहन।',
    descEn: '500 GW clean energy capacity, expressway EV charging grid, and Green Hydrogen production.',
    category: 'GREEN_ENERGY',
    costCrores: 40000,
    durationMonths: 30,
    gdpImpact: 0.4,
    inflationImpact: -0.3,
    unemploymentImpact: -0.6,
    publicTrustGain: 8,
    fiscalDeficitImpact: 0.18,
    isEnacted: false,
    status: 'PROPOSED',
  },
  {
    id: 'pol-6',
    titleHi: 'राष्ट्रीय गति-शक्ति माल ढुलाई एक्सप्रेसवे मिशन',
    titleEn: 'National Gati-Shakti Freight & High-Speed Logistics',
    descHi: 'माल ढुलाई लागत को 14% से घटाकर 8% करना, 10 समर्पित फ्रेट कॉरिडोर व मल्टी-मॉडल लॉजिस्टिक्स पार्क।',
    descEn: 'Cut national logistics cost to 8% of GDP via 10 Dedicated Freight Corridors and multimodal parks.',
    category: 'INFRASTRUCTURE',
    costCrores: 60000,
    durationMonths: 24,
    gdpImpact: 0.8,
    inflationImpact: -0.4,
    unemploymentImpact: -1.0,
    publicTrustGain: 7,
    fiscalDeficitImpact: 0.3,
    isEnacted: false,
    status: 'PROPOSED',
  }
];

export class PolicyEngine {
  public static enactPolicy(
    policy: NationalPolicy,
    currentMetrics: NationalMetrics
  ): { updatedPolicy: NationalPolicy; updatedMetrics: NationalMetrics } {
    const updatedPolicy: NationalPolicy = {
      ...policy,
      isEnacted: true,
      status: 'ACTIVE',
    };

    const updatedMetrics: NationalMetrics = {
      ...currentMetrics,
      gdpGrowthRate: Math.round((currentMetrics.gdpGrowthRate + policy.gdpImpact) * 10) / 10,
      inflationRate: Math.max(1.0, Math.round((currentMetrics.inflationRate + policy.inflationImpact) * 10) / 10),
      unemploymentRate: Math.max(1.5, Math.round((currentMetrics.unemploymentRate + policy.unemploymentImpact) * 10) / 10),
      publicApproval: Math.min(100, currentMetrics.publicApproval + policy.publicTrustGain),
      fiscalDeficit: Math.round((currentMetrics.fiscalDeficit + policy.fiscalDeficitImpact) * 10) / 10,
    };

    return { updatedPolicy, updatedMetrics };
  }
}
