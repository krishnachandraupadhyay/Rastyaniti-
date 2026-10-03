package com.rashtraniti.game.engine

import com.rashtraniti.game.data.model.*
import kotlin.math.max
import kotlin.math.min
import kotlin.random.Random

class GameEngine {

    /**
     * Executes a campaign action, deducting money, energy, and time,
     * while boosting party popularity, trust, and readiness.
     */
    fun executeCampaign(
        player: Player,
        party: Party,
        action: CampaignActionType,
        countdownDays: Int
    ): CampaignResult {
        if (party.funds < action.baseCostMoney) {
            return CampaignResult(false, "पार्टी कोष में पर्याप्त धनराशि नहीं है (कम से कम ₹${action.baseCostMoney} आवश्यक)!", player, party, countdownDays)
        }
        if (player.energy < action.baseCostEnergy) {
            return CampaignResult(false, "ऊर्जा (Energy) बहुत कम है। विश्राम या अगले दिन की प्रतीक्षा करें!", player, party, countdownDays)
        }

        val newFunds = party.funds - action.baseCostMoney
        val newEnergy = player.energy - action.baseCostEnergy
        val newDaysLeft = max(0, countdownDays - action.baseCostTimeDays)

        // Calculate boosts based on action type
        val trustBoost = when (action) {
            CampaignActionType.DOOR_TO_DOOR -> 4
            CampaignActionType.TOWN_HALL -> 3
            CampaignActionType.MANIFESTO_RELEASE -> 2
            CampaignActionType.COMMUNITY_OUTREACH -> 3
            else -> 1
        }

        val popularityBoost = when (action) {
            CampaignActionType.RALLY -> 5
            CampaignActionType.DIGITAL_CAMPAIGN -> 4
            CampaignActionType.MEDIA_CAMPAIGN -> 6
            CampaignActionType.PUBLIC_MEETING -> 3
            CampaignActionType.DEBATE -> 4
            else -> 2
        }

        val readinessBoost = when (action) {
            CampaignActionType.VOLUNTEER_DRIVE -> 8
            CampaignActionType.MANIFESTO_RELEASE -> 5
            else -> 3
        }

        val updatedPlayerStats = player.stats.copy(
            publicTrust = min(100, player.stats.publicTrust + trustBoost),
            communication = min(100, player.stats.communication + 1),
            leadership = min(100, player.stats.leadership + 1)
        )

        val updatedDemographics = party.demographicSupport.copy(
            youth = min(100, party.demographicSupport.youth + if (action == CampaignActionType.DIGITAL_CAMPAIGN || action == CampaignActionType.TOWN_HALL) 3 else 1),
            rural = min(100, party.demographicSupport.rural + if (action == CampaignActionType.DOOR_TO_DOOR || action == CampaignActionType.COMMUNITY_OUTREACH) 3 else 1),
            urban = min(100, party.demographicSupport.urban + if (action == CampaignActionType.MEDIA_CAMPAIGN) 3 else 1)
        )

        val updatedParty = party.copy(
            funds = newFunds,
            overallPopularity = min(100, party.overallPopularity + popularityBoost),
            electionReadiness = min(100, party.electionReadiness + readinessBoost),
            mediaAttention = min(100, party.mediaAttention + (popularityBoost * 2)),
            demographicSupport = updatedDemographics,
            volunteersCount = party.volunteersCount + if (action == CampaignActionType.VOLUNTEER_DRIVE) 150L else 20L
        )

        val updatedPlayer = player.copy(
            energy = newEnergy,
            stats = updatedPlayerStats,
            reputation = min(100, player.reputation + 2)
        )

        val message = "अभियान सफल: ${action.titleHindi} संपन्न! जनविश्वास +$trustBoost, लोकप्रियता +$popularityBoost, चुनावी तैयारी +$readinessBoost%"
        return CampaignResult(true, message, updatedPlayer, updatedParty, newDaysLeft)
    }

    /**
     * Advance a day: restore energy, collect membership contributions, update countdown.
     */
    fun advanceDay(
        player: Player,
        party: Party,
        currentDay: Int,
        countdownDays: Int
    ): DayTickResult {
        val nextDay = currentDay + 1
        val newCountdown = max(0, countdownDays - 1)
        val restoredEnergy = min(100, player.energy + 40)

        // Organic daily party micro-donations from volunteers & members
        val dailyDonations = party.membersCount * 5L + (party.overallPopularity * 200L)
        val updatedFunds = party.funds + dailyDonations

        val updatedPlayer = player.copy(energy = restoredEnergy)
        val updatedParty = party.copy(funds = updatedFunds)

        return DayTickResult(
            day = nextDay,
            countdown = newCountdown,
            player = updatedPlayer,
            party = updatedParty,
            donationsEarned = dailyDonations
        )
    }

    /**
     * Determines whether player qualifies for promotion to next level.
     */
    fun checkLevelProgression(
        currentLevel: PoliticalLevel,
        player: Player,
        party: Party,
        hasWonElection: Boolean
    ): ProgressionEvaluation {
        return when (currentLevel) {
            PoliticalLevel.COMMON_CITIZEN -> {
                if (player.stats.publicTrust >= 50 && player.reputation >= 40) {
                    ProgressionEvaluation(true, PoliticalLevel.PARTY_FOUNDER, "बधाई! आपके सामाजिक कार्यों ने आपको जनसमर्थन दिया। अब अपनी पार्टी की स्थापना करें!")
                } else {
                    ProgressionEvaluation(false, currentLevel, "जनविश्वास कम से कम 50 और प्रतिष्ठा 40 होनी आवश्यक है।")
                }
            }
            PoliticalLevel.PARTY_FOUNDER -> {
                if (party.membersCount >= 2000 && party.electionReadiness >= 40) {
                    ProgressionEvaluation(true, PoliticalLevel.LOCAL_CANDIDATE, "पार्टी का संगठन मजबूत हुआ! अब स्थानीय निर्वाचन क्षेत्र से उम्मीदवारी घोषित करें।")
                } else {
                    ProgressionEvaluation(false, currentLevel, "पार्टी सदस्य 2000+ और चुनावी तैयारी 40%+ होनी चाहिए।")
                }
            }
            PoliticalLevel.LOCAL_CANDIDATE -> {
                if (hasWonElection) {
                    ProgressionEvaluation(true, PoliticalLevel.ELECTED_REPRESENTATIVE, "शानदार विजय! आप अपने क्षेत्र के निर्वाचित प्रतिनिधि बन गए हैं!")
                } else {
                    ProgressionEvaluation(false, currentLevel, "चुनाव जीतना आवश्यक है। अभियान को और तेज करें!")
                }
            }
            PoliticalLevel.ELECTED_REPRESENTATIVE -> {
                if (player.stats.leadership >= 60 && party.overallPopularity >= 50) {
                    ProgressionEvaluation(true, PoliticalLevel.STATE_POLITICIAN, "आपके विकास कार्यों से आपका कद बढ़ा। अब राज्य स्तरीय राजनीति में कदम रखें!")
                } else {
                    ProgressionEvaluation(false, currentLevel, "नेतृत्व क्षमता 60 और लोकप्रियता 50 की आवश्यकता है।")
                }
            }
            PoliticalLevel.STATE_POLITICIAN -> {
                if (party.wonSeatsState >= 50 || hasWonElection) {
                    ProgressionEvaluation(true, PoliticalLevel.NATIONAL_POLITICIAN, "विधानसभा में विजय के बाद अब आपका प्रभाव राष्ट्रीय स्तर पर पहुंच गया है!")
                } else {
                    ProgressionEvaluation(false, currentLevel, "राज्य चुनाव में महत्वपूर्ण सीटें जीतना आवश्यक है।")
                }
            }
            PoliticalLevel.NATIONAL_POLITICIAN -> {
                if (hasWonElection) {
                    ProgressionEvaluation(true, PoliticalLevel.MEMBER_OF_PARLIAMENT, "बधाई! आप संसद सदस्य (MP) निर्वाचित हो चुके हैं!")
                } else {
                    ProgressionEvaluation(false, currentLevel, "लोकसभा चुनाव में विजय प्राप्त करें।")
                }
            }
            PoliticalLevel.MEMBER_OF_PARLIAMENT -> {
                if (party.wonSeatsNational >= 272) {
                    ProgressionEvaluation(true, PoliticalLevel.PRIME_MINISTER, "ऐतिहासिक जनादेश! 272+ सीटों के साथ पूर्ण बहुमत! भारत के प्रधानमंत्री पद की शपथ लें!")
                } else if (party.wonSeatsNational >= 200) {
                    ProgressionEvaluation(true, PoliticalLevel.GOVERNMENT_FORMATION, "गठबंधन की संभावना! सहयोगी दलों से वार्ता कर सरकार गठन की तैयारी करें।")
                } else {
                    ProgressionEvaluation(false, currentLevel, "राष्ट्रीय स्तर पर बहुमत (272 सीटें) या मजबूत गठबंधन आवश्यक है।")
                }
            }
            PoliticalLevel.GOVERNMENT_FORMATION -> {
                ProgressionEvaluation(true, PoliticalLevel.PRIME_MINISTER, "गठबंधन की सहमति बनी! आप भारत के प्रधानमंत्री मनोनीत किए जाते हैं!")
            }
            PoliticalLevel.PRIME_MINISTER -> {
                ProgressionEvaluation(true, PoliticalLevel.NATIONAL_GOVERNANCE, "केंद्रीय मंत्रिमंडल का गठन और बजट सत्र का संचालन प्रारंभ करें।")
            }
            PoliticalLevel.NATIONAL_GOVERNANCE -> {
                ProgressionEvaluation(true, PoliticalLevel.NEXT_GENERAL_ELECTION, "5 वर्ष का कार्यकाल पूर्ण होने की ओर। अगले आम चुनाव की रणभेरी बजी!")
            }
            PoliticalLevel.NEXT_GENERAL_ELECTION -> {
                ProgressionEvaluation(false, currentLevel, "पुनः जनादेश प्राप्त कर सत्ता में बने रहने की चुनौती!")
            }
            else -> ProgressionEvaluation(false, currentLevel, "कार्य प्रगति पर है।")
        }
    }
}

data class CampaignResult(
    val isSuccess: Boolean,
    val message: String,
    val updatedPlayer: Player,
    val updatedParty: Party,
    val remainingCountdownDays: Int
)

data class DayTickResult(
    val day: Int,
    val countdown: Int,
    val player: Player,
    val party: Party,
    val donationsEarned: Long
)

data class ProgressionEvaluation(
    val canPromote: Boolean,
    val targetLevel: PoliticalLevel,
    val feedbackMessage: String
)
