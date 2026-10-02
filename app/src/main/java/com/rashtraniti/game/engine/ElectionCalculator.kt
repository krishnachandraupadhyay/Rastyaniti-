package com.rashtraniti.game.engine

import com.rashtraniti.game.data.model.Constituency
import com.rashtraniti.game.data.model.ElectionResult
import com.rashtraniti.game.data.model.Party
import com.rashtraniti.game.data.model.Player
import kotlin.math.max
import kotlin.math.min
import kotlin.random.Random

object ElectionCalculator {

    /**
     * Calculates the election outcome in a constituency based on:
     * - Player Public Trust & Reputation
     * - Party Popularity & Readiness
     * - Campaign Reach & Local alignment
     * - Dynamic voter turnout (60% - 78%)
     * Non-random core math with slight natural voting swing (+/- 2.5%).
     */
    fun calculateConstituencyResult(
        player: Player,
        party: Party,
        constituency: Constituency,
        campaignBonus: Float = 0f
    ): ElectionResult {
        // Base score from player traits (weight: 25%)
        val playerFactor = (player.stats.publicTrust * 0.4f +
                player.stats.communication * 0.25f +
                player.stats.leadership * 0.2f +
                player.reputation * 0.15f) / 100f // 0.0 - 1.0

        // Party organization score (weight: 35%)
        val partyFactor = (party.overallPopularity * 0.5f +
                party.electionReadiness * 0.3f +
                min(100f, party.volunteersCount / 10f) * 0.2f) / 100f // 0.0 - 1.0

        // Demographic & issue alignment factor (weight: 20%)
        val demographicFactor = (party.demographicSupport.youth * 0.25f +
                party.demographicSupport.rural * 0.25f +
                party.demographicSupport.urban * 0.2f +
                party.demographicSupport.farmers * 0.15f +
                party.demographicSupport.workers * 0.15f) / 100f

        // Combined raw score (0 - 100)
        var rawPlayerScore = (playerFactor * 30f) +
                (partyFactor * 35f) +
                (demographicFactor * 25f) +
                campaignBonus +
                (if (constituency.isPlayerHomeConstituency) 6.0f else 0.0f)

        // Opponent base score: 40-50 based on current standing
        var rawOpponentScore = constituency.mainOpponentSupportPct

        // Add small realistic organic swing (-2.5% to +2.5%)
        val organicSwing = (Random.nextFloat() * 5.0f) - 2.5f
        rawPlayerScore += organicSwing

        val otherScore = max(8.0f, 100f - (rawPlayerScore + rawOpponentScore))
        val totalRaw = rawPlayerScore + rawOpponentScore + otherScore

        // Normalize percentages to 100%
        val finalPlayerPct = ((rawPlayerScore / totalRaw) * 100f).coerceIn(15.0f, 75.0f)
        val finalOpponentPct = ((rawOpponentScore / totalRaw) * 100f).coerceIn(15.0f, 70.0f)
        val finalOtherPct = max(0f, 100f - (finalPlayerPct + finalOpponentPct))

        // Turnout between 62% and 74%
        val turnoutPct = 62.0f + (Random.nextFloat() * 12.0f)
        val totalVotesCast = (constituency.totalVoters * (turnoutPct / 100f)).toLong()

        val playerVotes = (totalVotesCast * (finalPlayerPct / 100f)).toLong()
        val opponentVotes = (totalVotesCast * (finalOpponentPct / 100f)).toLong()
        val otherVotes = max(0L, totalVotesCast - (playerVotes + opponentVotes))

        val isVictory = playerVotes > opponentVotes
        val margin = if (isVictory) playerVotes - opponentVotes else opponentVotes - playerVotes

        return ElectionResult(
            constituencyName = constituency.name,
            voterTurnoutPercent = turnoutPct,
            playerPartyVotes = playerVotes,
            playerPartyPct = finalPlayerPct,
            mainOpponentVotes = opponentVotes,
            mainOpponentPct = finalOpponentPct,
            otherVotes = otherVotes,
            otherPct = finalOtherPct,
            isVictory = isVictory,
            winningMargin = margin
        )
    }
}
