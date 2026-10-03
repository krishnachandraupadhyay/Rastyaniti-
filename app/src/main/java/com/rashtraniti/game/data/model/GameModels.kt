package com.rashtraniti.game.data.model

import androidx.room.Entity
import androidx.room.PrimaryKey

/**
 * 12 Levels of Progression:
 * LEVEL 1: Common Citizen (आम नागरिक)
 * LEVEL 2: Party Founder (दल संस्थापक)
 * LEVEL 3: Local Candidate (स्थानीय प्रत्याशी)
 * LEVEL 4: Elected Representative (जनप्रतिनिधि)
 * LEVEL 5: State-Level Politician (राज्यस्तरीय नेता)
 * LEVEL 6: State Election (विधानसभा चुनाव)
 * LEVEL 7: National Politician (राष्ट्रीय नेता)
 * LEVEL 8: Member of Parliament - MP (सांसद)
 * LEVEL 9: Majority / Government Formation (सरकार गठन)
 * LEVEL 10: Prime Minister (प्रधानमंत्री)
 * LEVEL 11: National Governance (राष्ट्र संचालन)
 * LEVEL 12: Next General Election (अगला आम चुनाव)
 */
enum class PoliticalLevel(val levelNumber: Int, val titleHindi: String, val titleEnglish: String) {
    COMMON_CITIZEN(1, "आम नागरिक", "Common Citizen"),
    PARTY_FOUNDER(2, "दल संस्थापक", "Party Founder"),
    LOCAL_CANDIDATE(3, "स्थानीय प्रत्याशी", "Local Candidate"),
    ELECTED_REPRESENTATIVE(4, "जनप्रतिनिधि", "Elected Representative"),
    STATE_POLITICIAN(5, "राज्यस्तरीय नेता", "State-Level Politician"),
    STATE_ELECTION(6, "विधानसभा चुनाव", "State Election"),
    NATIONAL_POLITICIAN(7, "राष्ट्रीय नेता", "National Politician"),
    MEMBER_OF_PARLIAMENT(8, "सांसद (MP)", "Member of Parliament"),
    GOVERNMENT_FORMATION(9, "सरकार गठन", "Government Formation"),
    PRIME_MINISTER(10, "प्रधानमंत्री", "Prime Minister"),
    NATIONAL_GOVERNANCE(11, "राष्ट्र संचालन", "National Governance"),
    NEXT_GENERAL_ELECTION(12, "अगला आम चुनाव", "Next General Election");

    companion object {
        fun fromLevelNumber(num: Int): PoliticalLevel =
            entries.find { it.levelNumber == num } ?: COMMON_CITIZEN
    }
}

data class PlayerStats(
    val leadership: Int = 45,
    val communication: Int = 50,
    val politicalKnowledge: Int = 40,
    val publicTrust: Int = 55,
    val strategy: Int = 45,
    val administration: Int = 40,
    val finance: Int = 45,
    val crisisManagement: Int = 40
)

data class Player(
    val name: String = "अर्जुन शर्मा",
    val age: Int = 32,
    val gender: String = "पुरुष",
    val state: String = "उत्तर प्रदेश",
    val district: String = "वाराणसी",
    val constituency: String = "वाराणसी उत्तर",
    val education: String = "स्नातकोत्तर (Master's)",
    val occupation: String = "सामाजिक कार्यकर्ता (Social Worker)",
    val stats: PlayerStats = PlayerStats(),
    val personalMoney: Long = 150000L, // In INR (fictional game currency)
    val energy: Int = 100, // 0-100 daily energy
    val reputation: Int = 50
)

enum class PartyPriority(val titleHindi: String, val titleEnglish: String) {
    EDUCATION("शिक्षा", "Education"),
    HEALTHCARE("स्वास्थ्य", "Healthcare"),
    EMPLOYMENT("रोजगार", "Employment"),
    AGRICULTURE("कृषि", "Agriculture"),
    INFRASTRUCTURE("बुनियादी ढांचा", "Infrastructure"),
    TECHNOLOGY("तकनीक", "Technology"),
    ENVIRONMENT("पर्यावरण", "Environment"),
    ECONOMY("अर्थव्यवस्था", "Economy"),
    SOCIAL_WELFARE("सामाजिक कल्याण", "Social Welfare")
}

data class DemographicSupport(
    val youth: Int = 50,       // 0-100%
    val rural: Int = 50,
    val urban: Int = 50,
    val farmers: Int = 50,
    val workers: Int = 50,
    val business: Int = 50
)

data class Party(
    val name: String = "जन उत्थान पार्टी",
    val shortName: String = "JUP",
    val symbol: String = "दीपक (Lamp)",
    val flagColorHex: String = "#FF671F",
    val slogan: String = "जन सेवा ही राष्ट्र सेवा",
    val description: String = "जनता के अधिकारों और सर्वांगीण विकास के लिए समर्पित दल।",
    val priorities: List<PartyPriority> = listOf(PartyPriority.EDUCATION, PartyPriority.EMPLOYMENT, PartyPriority.HEALTHCARE),
    val funds: Long = 500000L,
    val membersCount: Long = 2500L,
    val volunteersCount: Long = 450L,
    val mediaAttention: Int = 30, // 0-100%
    val overallPopularity: Int = 42,
    val demographicSupport: DemographicSupport = DemographicSupport(),
    val electionReadiness: Int = 35, // 0-100%
    val wonSeatsState: Int = 0,
    val wonSeatsNational: Int = 0
)

data class Constituency(
    val id: String,
    val name: String,
    val district: String,
    val state: String,
    val totalVoters: Long = 250000L,
    val currentLeaderParty: String = "विपक्षी दल A",
    val playerPartySupportPct: Float = 38.5f,
    val mainOpponentSupportPct: Float = 42.0f,
    val otherPartiesSupportPct: Float = 19.5f,
    val isPlayerHomeConstituency: Boolean = false,
    val isUnlocked: Boolean = true,
    val topIssue: String = "सड़क व रोजगार"
)

enum class CampaignActionType(
    val id: String,
    val titleHindi: String,
    val titleEnglish: String,
    val baseCostMoney: Long,
    val baseCostEnergy: Int,
    val baseCostTimeDays: Int,
    val description: String
) {
    DOOR_TO_DOOR("door_to_door", "घर-घर संपर्क", "Door-to-Door Campaign", 15000L, 20, 2, "नागरिकों से सीधा संवाद और उनकी स्थानीय समस्याओं का संकलन।"),
    PUBLIC_MEETING("public_meeting", "जनसभा", "Public Meeting", 35000L, 25, 2, "नुक्कड़ सभा व कार्यकर्ताओं के साथ संवाद।"),
    RALLY("rally", "विशाल जन रैली", "Public Rally", 120000L, 35, 3, "बड़ा मंच, हजारों कार्यकर्ताओं की उपस्थिति और शक्ति प्रदर्शन।"),
    TOWN_HALL("town_hall", "टाउन हॉल बैठक", "Town Hall", 50000L, 25, 2, "छात्रों, व्यापारियों और बुद्धिजीवियों के सीधे तीखे सवालों के जवाब।"),
    DEBATE("debate", "सार्वजनिक बहस", "Public Debate", 20000L, 30, 1, "विपक्षी प्रत्याशियों के साथ नीतिगत खुली बहस।"),
    MANIFESTO_RELEASE("manifesto", "घोषणापत्र प्रस्तुति", "Manifesto Presentation", 40000L, 20, 2, "दृष्टिपत्र और आगामी 5 वर्षों की विकास योजना की घोषणा।"),
    DIGITAL_CAMPAIGN("digital", "डिजिटल अभियान", "Digital Campaign", 60000L, 10, 1, "सोशल मीडिया विज्ञापन, वीडियो और युवा मतदाताओं तक पहुंच।"),
    MEDIA_CAMPAIGN("media_ad", "मीडिया विज्ञापन", "Media Campaign", 150000L, 15, 2, "स्थानीय समाचार पत्रों और टीवी चैनलों पर अभियान।"),
    VOLUNTEER_DRIVE("volunteer_drive", "कार्यकर्ता महाभियान", "Volunteer Campaign", 30000L, 20, 3, "बूथ स्तर पर 500 नए कार्यकर्ताओं का प्रशिक्षण व तैनाती।"),
    COMMUNITY_OUTREACH("community", "सामुदायिक संवाद", "Community Outreach", 25000L, 15, 2, "विभिन्न समाज वर्गों व किसान संगठनों के साथ विचार-विमर्श।")
}

data class OppositionParty(
    val name: String,
    val leaderName: String,
    val symbol: String,
    val colorHex: String,
    val seatsNational: Int,
    val funds: Long,
    val popularity: Int,
    val aggressiveRating: Int // 1-10
)

data class CabinetMinister(
    val id: String,
    val name: String,
    val portfolio: String,
    val portfolioHindi: String,
    val competence: Int,     // 1-100
    val loyalty: Int,        // 1-100
    val popularity: Int,     // 1-100
    val corruptionRisk: Int  // 1-100
)

data class NationalMetrics(
    val gdpGrowthRate: Float = 6.8f,        // %
    val inflationRate: Float = 4.5f,        // %
    val unemploymentRate: Float = 5.8f,     // %
    val publicSatisfaction: Int = 62,       // 0-100%
    val nationalDebtPercentGdp: Float = 55.4f, // %
    val educationIndex: Int = 68,           // 0-100
    val healthcareIndex: Int = 64,          // 0-100
    val infrastructureScore: Int = 71,      // 0-100
    val agricultureIndex: Int = 60,         // 0-100
    val environmentScore: Int = 54,         // 0-100
    val technologyIndex: Int = 76,          // 0-100
    val governmentApproval: Int = 58        // 0-100%
)

data class NationalBudget(
    val totalRevenueCrores: Long = 3200000L, // In Crores (₹32 Lakh Crore)
    val totalExpenditureCrores: Long = 3650000L,
    val fiscalDeficitCrores: Long = 450000L, // (Expenditure - Revenue)
    val allocations: Map<String, Long> = mapOf(
        "शिक्षा (Education)" to 135000L,
        "स्वास्थ्य (Healthcare)" to 95000L,
        "बुनियादी ढांचा (Infra)" to 1100000L,
        "कृषि व किसान कल्याण (Agri)" to 140000L,
        "रक्षा (Defence)" to 625000L,
        "तकनीक व विज्ञान (Tech)" to 85000L,
        "पर्यावरण व ऊर्जा (Env)" to 60000L,
        "परिवहन (Transport)" to 280000L,
        "सामाजिक कल्याण (Welfare)" to 220000L
    )
)

data class ParliamentBill(
    val id: String,
    val titleHindi: String,
    val titleEnglish: String,
    val description: String,
    val category: String,
    val requiredVotes: Int = 272, // Simple majority of 543
    var govtVotes: Int = 0,
    var oppositionVotes: Int = 0,
    var status: String = "प्रस्तावित (Pending)" // Pending, Passed, Defeated
)

data class CrisisChoice(
    val id: String,
    val titleHindi: String,
    val titleEnglish: String,
    val costMoney: Long,
    val costBudgetCrore: Long = 0L,
    val expectedEffect: String,
    val publicTrustImpact: Int,
    val popularityImpact: Int,
    val approvalImpact: Int,
    val shortTermResult: String,
    val longTermResult: String
)

data class CrisisEvent(
    val id: String,
    val titleHindi: String,
    val titleEnglish: String,
    val description: String,
    val isNaturalDisaster: Boolean = false,
    val affectedRegion: String = "उत्तरी भारत",
    val severity: String = "गंभीर (High)",
    val choices: List<CrisisChoice>
)

data class QuizQuestion(
    val id: Int,
    val category: String,
    val questionHindi: String,
    val questionEnglish: String,
    val options: List<String>,
    val correctIndex: Int,
    val explanation: String,
    val difficulty: String // Easy, Medium, Hard, Expert
)

data class Achievement(
    val id: String,
    val titleHindi: String,
    val titleEnglish: String,
    val descriptionHindi: String,
    val isUnlocked: Boolean = false
)

data class InGameNotification(
    val id: String,
    val title: String,
    val message: String,
    val timestampFormatted: String,
    val isUrgent: Boolean = false
)

data class ElectionResult(
    val constituencyName: String,
    val voterTurnoutPercent: Float,
    val playerPartyVotes: Long,
    val playerPartyPct: Float,
    val mainOpponentVotes: Long,
    val mainOpponentPct: Float,
    val otherVotes: Long,
    val otherPct: Float,
    val isVictory: Boolean,
    val winningMargin: Long
)
