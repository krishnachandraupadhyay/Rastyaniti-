import type { QuizQuestion } from '../types/quiz';

export const quizQuestions: QuizQuestion[] = [
  {
    id: 'q1',
    category: 'CONSTITUTION',
    difficulty: 'EASY',
    questionHi: 'भारतीय संविधान का मूल दर्शन और उद्देश्य किसमें समाहित है?',
    questionEn: 'The core philosophy and objectives of the Indian Constitution are enshrined in which part?',
    optionsHi: ['प्रस्तावना (Preamble)', 'मूल कर्तव्य', 'आपातकालीन प्रावधान', 'सातवीं अनुसूची'],
    optionsEn: ['The Preamble', 'Fundamental Duties', 'Emergency Provisions', 'Seventh Schedule'],
    correctIndex: 0,
    explanationHi: 'प्रस्तावना संविधान की आत्मा और मार्गदर्शक सिद्धांत है जो न्याय, स्वतंत्रता, समता और बंधुत्व की घोषणा करती है।',
    explanationEn: 'The Preamble serves as the soul and guiding spirit of the Constitution, declaring Justice, Liberty, Equality, and Fraternity.',
    rewardStat: 'politicalKnowledge',
    rewardAmount: 6
  },
  {
    id: 'q2',
    category: 'PARLIAMENT',
    difficulty: 'EASY',
    questionHi: 'लोकसभा में सरकार बनाने के लिए आवश्यक जादुई आंकड़ा (बहुमत) कितना है?',
    questionEn: 'What is the required majority mark to form a government in the 543-member Lok Sabha?',
    optionsHi: ['250', '272', '300', '315'],
    optionsEn: ['250', '272', '300', '315'],
    correctIndex: 1,
    explanationHi: 'कुल 543 निर्वाचित लोकसभा सीटों में से स्पष्ट बहुमत के लिए 272 या उससे अधिक सीटों का समर्थन आवश्यक होता है।',
    explanationEn: 'Out of 543 elected Lok Sabha seats, 272 or more seats constitute a simple majority to form the central government.',
    rewardStat: 'strategy',
    rewardAmount: 6
  },
  {
    id: 'q3',
    category: 'ELECTIONS',
    difficulty: 'EASY',
    questionHi: 'भारत में नागरिकों को मतदान करने का संवैधानिक अधिकार किस आयु पर प्राप्त होता है?',
    questionEn: 'At what age do Indian citizens attain the constitutional right to vote?',
    optionsHi: ['16 वर्ष', '18 वर्ष', '21 वर्ष', '25 वर्ष'],
    optionsEn: ['16 Years', '18 Years', '21 Years', '25 Years'],
    correctIndex: 1,
    explanationHi: '61वें संविधान संशोधन अधिनियम 1988 के तहत मतदान की आयु 21 वर्ष से घटाकर 18 वर्ष कर दी गई थी।',
    explanationEn: 'The 61st Constitutional Amendment Act, 1988 lowered the voting age from 21 to 18 years.',
    rewardStat: 'politicalKnowledge',
    rewardAmount: 5
  },
  {
    id: 'q4',
    category: 'GOVERNANCE',
    difficulty: 'MEDIUM',
    questionHi: 'भारत के संविधान के अनुसार वास्तविक कार्यपालिका शक्तियां किसके पास होती हैं?',
    questionEn: 'According to the Indian Constitution, real executive power is exercised by whom?',
    optionsHi: ['राष्ट्रपति', 'प्रधानमंत्री की अध्यक्षता में मंत्रिपरिषद', 'सर्वोच्च न्यायालय के मुख्य न्यायाधीश', 'संसद के सभापति'],
    optionsEn: ['The President', 'Council of Ministers headed by Prime Minister', 'Chief Justice of India', 'Speaker of Lok Sabha'],
    correctIndex: 1,
    explanationHi: 'राष्ट्रपति संवैधानिक प्रमुख होते हैं, परंतु वास्तविक कार्यपालिका शक्ति प्रधानमंत्री की अध्यक्षता वाली मंत्रिपरिषद के पास होती है।',
    explanationEn: 'The President is the de jure head, but de facto executive power rests with the Council of Ministers headed by the Prime Minister.',
    rewardStat: 'administration',
    rewardAmount: 7
  },
  {
    id: 'q5',
    category: 'ECONOMY',
    difficulty: 'MEDIUM',
    questionHi: 'केंद्रीय बजट (वार्षिक वित्तीय विवरण) संविधान के किस अनुच्छेद के तहत प्रस्तुत किया जाता है?',
    questionEn: 'Under which Article of the Constitution is the Annual Financial Statement (Union Budget) presented?',
    optionsHi: ['अनुच्छेद 110', 'अनुच्छेद 112', 'अनुच्छेद 123', 'अनुच्छेद 360'],
    optionsEn: ['Article 110', 'Article 112', 'Article 123', 'Article 360'],
    correctIndex: 1,
    explanationHi: 'अनुच्छेद 112 के तहत राष्ट्रपति प्रत्येक वित्तीय वर्ष में संसद के दोनों सदनों के समक्ष वार्षिक वित्तीय विवरण रखवाते हैं।',
    explanationEn: 'Article 112 mandates the President to lay the Annual Financial Statement before both houses of Parliament.',
    rewardStat: 'finance',
    rewardAmount: 8
  },
  {
    id: 'q6',
    category: 'DEMOCRACY',
    difficulty: 'MEDIUM',
    questionHi: 'पंचायती राज व्यवस्था को संवैधानिक दर्जा किस संशोधन अधिनियम द्वारा दिया गया?',
    questionEn: 'Through which Constitutional Amendment Act was Panchayati Raj given constitutional status?',
    optionsHi: ['42वां संशोधन', '44वां संशोधन', '73वां संशोधन', '86वां संशोधन'],
    optionsEn: ['42nd Amendment', '44th Amendment', '73rd Amendment', '86th Amendment'],
    correctIndex: 2,
    explanationHi: '73वें संविधान संशोधन (1992) द्वारा त्रि-स्तरीय पंचायती राज को संवैधानिक मान्यता मिली।',
    explanationEn: 'The 73rd Constitutional Amendment Act (1992) institutionalized the three-tier Panchayati Raj system.',
    rewardStat: 'leadership',
    rewardAmount: 7
  },
  {
    id: 'q7',
    category: 'ELECTIONS',
    difficulty: 'HARD',
    questionHi: 'चुनाव की घोषणा के बाद लागू होने वाली "आदर्श आचार संहिता" (MCC) का मुख्य उद्देश्य क्या है?',
    questionEn: 'What is the primary objective of the Model Code of Conduct (MCC) enforced during elections?',
    optionsHi: [
      'केवल सत्तारूढ़ दल को लाभ पहुंचाना',
      'सभी दलों और प्रत्याशियों के लिए समान अवसर (Level Playing Field) और शांतिपूर्ण चुनाव सुनिश्चित करना',
      'विपक्ष के प्रचार पर रोक लगाना',
      'मतदाताओं पर कर लगाना'
    ],
    optionsEn: [
      'To favor the incumbent ruling party',
      'To guarantee a level playing field and free, fair elections for all parties and candidates',
      'To prohibit opposition campaigning',
      'To impose voter taxes'
    ],
    correctIndex: 1,
    explanationHi: 'आदर्श आचार संहिता सभी उम्मीदवारों और दलों को समान अवसर देती है तथा सरकारी मशीनरी के दुरुपयोग को रोकती है।',
    explanationEn: 'The Model Code of Conduct ensures ethical campaigning and prevents misuse of governmental machinery.',
    rewardStat: 'publicTrust',
    rewardAmount: 8
  },
  {
    id: 'q8',
    category: 'PARLIAMENT',
    difficulty: 'HARD',
    questionHi: 'धन विधेयक (Money Bill) केवल किस सदन में पहले पेश किया जा सकता है?',
    questionEn: 'A Money Bill can only be introduced first in which house of Parliament?',
    optionsHi: ['राज्यसभा', 'लोकसभा', 'विधान परिषद', 'किसी भी सदन में'],
    optionsEn: ['Rajya Sabha', 'Lok Sabha', 'Legislative Council', 'Either House'],
    correctIndex: 1,
    explanationHi: 'अनुच्छेद 109 के अनुसार धन विधेयक केवल लोकसभा में राष्ट्रपति की पूर्व सिफारिश पर ही पेश किया जा सकता है।',
    explanationEn: 'Under Article 109, a Money Bill can only originate in the Lok Sabha with prior presidential recommendation.',
    rewardStat: 'politicalKnowledge',
    rewardAmount: 8
  },
  {
    id: 'q9',
    category: 'GOVERNANCE',
    difficulty: 'EXPERT',
    questionHi: 'संसद में "विश्वास मत" (Vote of Confidence) सिद्ध करने की आवश्यकता किसे होती है?',
    questionEn: 'Who is required to prove a Vote of Confidence on the floor of the Lok Sabha?',
    optionsHi: ['विपक्ष के नेता को', 'वर्तमान सरकार / प्रधानमंत्री को बहुमत सिद्ध करने हेतु', 'सर्वोच्च न्यायालय को', 'स्पीकर को'],
    optionsEn: ['The Leader of Opposition', 'The Prime Minister / Council of Ministers to prove their floor majority', 'The Supreme Court', 'The Speaker'],
    correctIndex: 1,
    explanationHi: 'प्रधानमंत्री और उनकी मंत्रिपरिषद को लोकसभा के प्रति सामूहिक रूप से उत्तरदायी होने के कारण सदन में बहुमत सिद्ध करना होता है।',
    explanationEn: 'The Prime Minister and Cabinet are collectively responsible to the Lok Sabha and must command the confidence of the house.',
    rewardStat: 'crisisManagement',
    rewardAmount: 10
  },
  {
    id: 'q10',
    category: 'ECONOMY',
    difficulty: 'EXPERT',
    questionHi: 'राजकोषीय घाटा (Fiscal Deficit) क्या दर्शाता है?',
    questionEn: 'What does the Fiscal Deficit of a nation indicate?',
    optionsHi: [
      'सरकार की कुल उधारी आवश्यकता (कुल व्यय - गैर-ऋण प्राप्तियां)',
      'केवल विदेशी कर्ज',
      'देश की कुल बचत',
      'बैंकों का मुनाफा'
    ],
    optionsEn: [
      'Total government borrowing requirement (Total expenditure minus non-debt receipts)',
      'Only foreign external debt',
      'Total gross national savings',
      'Banking sector profits'
    ],
    correctIndex: 0,
    explanationHi: 'राजकोषीय घाटा वह कुल धनराशि है जो सरकार को अपने खर्चों को पूरा करने के लिए उस वर्ष उधार लेनी पड़ती है।',
    explanationEn: 'Fiscal deficit represents the net borrowings required by the government to bridge the gap between revenue and expenditure.',
    rewardStat: 'finance',
    rewardAmount: 10
  }
];
