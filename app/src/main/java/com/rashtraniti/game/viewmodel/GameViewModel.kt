package com.rashtraniti.game.viewmodel

import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import com.rashtraniti.game.data.model.*
import com.rashtraniti.game.data.repository.GameRepository
import com.rashtraniti.game.engine.CampaignResult
import com.rashtraniti.game.engine.ElectionCalculator
import com.rashtraniti.game.engine.GameEngine
import kotlinx.coroutines.delay
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.asStateFlow
import kotlinx.coroutines.flow.update
import kotlinx.coroutines.launch
import kotlin.math.max
import kotlin.math.min
import kotlin.random.Random

enum class Screen {
    OPENING,
    PLAYER_CREATION,
    PARTY_CREATION,
    HOME,
    MAP,
    CAMPAIGN,
    MEDIA,
    ELECTION,
    QUIZ,
    CABINET,
    PM_DASHBOARD,
    BUDGET,
    PARLIAMENT,
    MULTIPLAYER,
    PROFILE_ACHIEVEMENTS
}

data class GameUiState(
    val currentScreen: Screen = Screen.OPENING,
    val isHindiLanguage: Boolean = true,
    val player: Player = Player(),
    val party: Party = Party(),
    val currentLevel: PoliticalLevel = PoliticalLevel.COMMON_CITIZEN,
    val gameDay: Int = 1,
    val electionCountdownDays: Int = 30,
    val constituencies: List<Constituency> = emptyList(),
    val activeCrisis: CrisisEvent? = null,
    val crisisOutcomeMessage: String? = null,
    val quizQuestions: List<QuizQuestion> = emptyList(),
    val currentQuizIndex: Int = 0,
    val quizScore: Int = 0,
    val quizAnswerSelected: Int? = null,
    val isQuizAnswerSubmitted: Boolean = false,
    val activeMinisters: List<CabinetMinister> = emptyList(),
    val nationalMetrics: NationalMetrics = NationalMetrics(),
    val nationalBudget: NationalBudget = NationalBudget(),
    val parliamentBills: List<ParliamentBill> = emptyList(),
    val oppositionParties: List<OppositionParty> = emptyList(),
    val achievements: List<Achievement> = emptyList(),
    val notifications: List<InGameNotification> = emptyList(),
    val latestElectionResult: ElectionResult? = null,
    val isElectionCountingInProgress: Boolean = false,
    val infoBannerMessage: String? = null
)

class GameViewModel(
    private val repository: GameRepository
) : ViewModel() {

    private val engine = GameEngine()

    private val _uiState = MutableStateFlow(GameUiState())
    val uiState: StateFlow<GameUiState> = _uiState.asStateFlow()

    init {
        loadInitialData()
    }

    private fun loadInitialData() {
        val initialQuestions = repository.getInitialQuizQuestions()
        val initialConstituencies = repository.getInitialConstituencies()
        val initialMinisters = repository.getInitialMinisters()
        val initialOpposition = repository.getInitialOpposition()
        val initialAchievements = repository.getInitialAchievements()

        val sampleBills = listOf(
            ParliamentBill(
                id = "bill_edu_01",
                titleHindi = "राष्ट्रीय शिक्षा आधुनिकीकरण एवं AI शोध विधेयक 2026",
                titleEnglish = "National Education Modernization & AI Research Bill 2026",
                description = "प्रत्येक जिले में डिजिटल उत्कृष्ट विद्यालय और विश्वविद्यालयों में AI शोध प्रयोगशालाओं के गठन का प्रावधान।",
                category = "शिक्षा (Education)",
                status = "प्रस्तावित (Pending)"
            ),
            ParliamentBill(
                id = "bill_infra_02",
                titleHindi = "भारत गति-शक्ति राष्ट्रीय राजमार्ग विस्तार विधेयक",
                titleEnglish = "Bharat Gati-Shakti Highway Expansion Bill",
                description = "ग्रामीण क्षेत्रों को सीधे राष्ट्रीय एक्सप्रेसवे से जोड़ने और रसद लागत 8% तक घटाने का लक्ष्य।",
                category = "बुनियादी ढांचा (Infra)",
                status = "प्रस्तावित (Pending)"
            )
        )

        val welcomeNotification = InGameNotification(
            id = "notif_1",
            title = "राष्ट्रनीति में आपका स्वागत है!",
            message = "एक आम नागरिक से प्रधानमंत्री बनने की ऐतिहासिक लोकतांत्रिक यात्रा प्रारंभ करें।",
            timestampFormatted = "दिन 1"
        )

        _uiState.update { current ->
            current.copy(
                quizQuestions = initialQuestions,
                constituencies = initialConstituencies,
                activeMinisters = initialMinisters,
                oppositionParties = initialOpposition,
                achievements = initialAchievements,
                parliamentBills = sampleBills,
                notifications = listOf(welcomeNotification)
            )
        }
    }

    fun navigateTo(screen: Screen) {
        _uiState.update { it.copy(currentScreen = screen, infoBannerMessage = null) }
    }

    fun toggleLanguage() {
        _uiState.update { it.copy(isHindiLanguage = !it.isHindiLanguage) }
    }

    fun dismissInfoBanner() {
        _uiState.update { it.copy(infoBannerMessage = null) }
    }

    fun updatePlayerProfile(
        name: String,
        age: Int,
        gender: String,
        state: String,
        district: String,
        constituency: String,
        education: String,
        occupation: String
    ) {
        _uiState.update { current ->
            current.copy(
                player = current.player.copy(
                    name = name.ifBlank { "अर्जुन शर्मा" },
                    age = age,
                    gender = gender,
                    state = state,
                    district = district,
                    constituency = constituency,
                    education = education,
                    occupation = occupation
                ),
                currentScreen = Screen.PARTY_CREATION
            )
        }
    }

    fun updatePartyDetails(
        name: String,
        shortName: String,
        symbol: String,
        flagColorHex: String,
        slogan: String,
        description: String,
        priorities: List<PartyPriority>
    ) {
        _uiState.update { current ->
            current.copy(
                party = current.party.copy(
                    name = name.ifBlank { "जन उत्थान पार्टी" },
                    shortName = shortName.ifBlank { "JUP" },
                    symbol = symbol,
                    flagColorHex = flagColorHex,
                    slogan = slogan.ifBlank { "जन सेवा ही राष्ट्र सेवा" },
                    description = description,
                    priorities = priorities
                ),
                currentLevel = PoliticalLevel.PARTY_FOUNDER,
                currentScreen = Screen.HOME,
                infoBannerMessage = "बधाई! पार्टी का विधिवत पंजीकरण संपन्न हुआ। अब अपना चुनावी अभियान प्रारंभ करें।"
            )
        }
    }

    fun runCampaignAction(action: CampaignActionType) {
        val current = _uiState.value
        val result = engine.executeCampaign(
            player = current.player,
            party = current.party,
            action = action,
            countdownDays = current.electionCountdownDays
        )

        if (result.isSuccess) {
            val updatedAchievements = current.achievements.map {
                if (it.id == "first_campaign") it.copy(isUnlocked = true) else it
            }
            _uiState.update {
                it.copy(
                    player = result.updatedPlayer,
                    party = result.updatedParty,
                    electionCountdownDays = result.remainingCountdownDays,
                    achievements = updatedAchievements,
                    infoBannerMessage = result.message
                )
            }
        } else {
            _uiState.update { it.copy(infoBannerMessage = result.message) }
        }
    }

    fun advanceToNextDay() {
        val current = _uiState.value
        val tick = engine.advanceDay(
            player = current.player,
            party = current.party,
            currentDay = current.gameDay,
            countdownDays = current.electionCountdownDays
        )

        // Randomly trigger crisis or media trial every 4-6 days if none active
        var triggeredCrisis: CrisisEvent? = current.activeCrisis
        if (triggeredCrisis == null && tick.day % 4 == 0) {
            val crises = repository.getInitialCrisisEvents()
            triggeredCrisis = crises.randomOrNull()
        }

        _uiState.update {
            it.copy(
                gameDay = tick.day,
                electionCountdownDays = tick.countdown,
                player = tick.player,
                party = tick.party,
                activeCrisis = triggeredCrisis,
                infoBannerMessage = "नया दिन ${tick.day} प्रारंभ! पार्टी सदस्यता शुल्क व सूक्ष्म चंदे से ₹${tick.donationsEarned} प्राप्त हुए।"
            )
        }
    }

    fun conductElection() {
        val current = _uiState.value
        val homeConstituency = current.constituencies.firstOrNull { it.isPlayerHomeConstituency }
            ?: current.constituencies.first()

        viewModelScope.launch {
            _uiState.update { it.copy(isElectionCountingInProgress = true, currentScreen = Screen.ELECTION) }
            delay(1200) // Animated counting suspense

            val result = ElectionCalculator.calculateConstituencyResult(
                player = current.player,
                party = current.party,
                constituency = homeConstituency,
                campaignBonus = current.party.electionReadiness * 0.15f
            )

            val updatedParty = if (result.isVictory) {
                current.party.copy(
                    wonSeatsNational = current.party.wonSeatsNational + 1,
                    wonSeatsState = current.party.wonSeatsState + 1,
                    overallPopularity = min(100, current.party.overallPopularity + 10)
                )
            } else current.party

            val newAchievements = current.achievements.map {
                if (result.isVictory && it.id == "first_win") it.copy(isUnlocked = true)
                else it
            }

            // Check level promotion
            val eval = engine.checkLevelProgression(current.currentLevel, current.player, updatedParty, result.isVictory)
            val nextLevel = if (eval.canPromote) eval.targetLevel else current.currentLevel

            _uiState.update {
                it.copy(
                    isElectionCountingInProgress = false,
                    latestElectionResult = result,
                    party = updatedParty,
                    currentLevel = nextLevel,
                    achievements = newAchievements,
                    electionCountdownDays = 45, // Next election cycle
                    infoBannerMessage = if (result.isVictory) "शानदार विजय! जनसमर्थन से आप विजयी घोषित किए गए।" else "कड़ा मुकाबला! कुछ ही वोटों से अंतर रह गया। संगठन मजबूत करें।"
                )
            }
        }
    }

    fun resolveCrisis(choice: CrisisChoice) {
        val current = _uiState.value
        val newFunds = max(0L, current.party.funds - choice.costMoney)
        val newTrust = (current.player.stats.publicTrust + choice.publicTrustImpact).coerceIn(0, 100)
        val newPopularity = (current.party.overallPopularity + choice.popularityImpact).coerceIn(0, 100)
        val newApproval = (current.nationalMetrics.governmentApproval + choice.approvalImpact).coerceIn(0, 100)

        val updatedPlayer = current.player.copy(
            stats = current.player.stats.copy(publicTrust = newTrust)
        )
        val updatedParty = current.party.copy(
            funds = newFunds,
            overallPopularity = newPopularity
        )
        val updatedMetrics = current.nationalMetrics.copy(
            governmentApproval = newApproval
        )

        _uiState.update {
            it.copy(
                player = updatedPlayer,
                party = updatedParty,
                nationalMetrics = updatedMetrics,
                activeCrisis = null,
                crisisOutcomeMessage = "${choice.shortTermResult}\n\nदीर्घकालिक प्रभाव: ${choice.longTermResult}",
                infoBannerMessage = "संकट का समाधान संपन्न हुआ।"
            )
        }
    }

    fun dismissCrisisOutcome() {
        _uiState.update { it.copy(crisisOutcomeMessage = null) }
    }

    // Quiz mechanics
    fun selectQuizOption(index: Int) {
        if (!_uiState.value.isQuizAnswerSubmitted) {
            _uiState.update { it.copy(quizAnswerSelected = index) }
        }
    }

    fun submitQuizAnswer() {
        val current = _uiState.value
        val q = current.quizQuestions.getOrNull(current.currentQuizIndex) ?: return
        val selected = current.quizAnswerSelected ?: return

        val isCorrect = selected == q.correctIndex
        val addedScore = if (isCorrect) 10 else 0

        val updatedPlayer = if (isCorrect) {
            current.player.copy(
                stats = current.player.stats.copy(
                    politicalKnowledge = min(100, current.player.stats.politicalKnowledge + 3),
                    leadership = min(100, current.player.stats.leadership + 2)
                )
            )
        } else current.player

        _uiState.update {
            it.copy(
                isQuizAnswerSubmitted = true,
                quizScore = it.quizScore + addedScore,
                player = updatedPlayer
            )
        }
    }

    fun nextQuizQuestion() {
        val current = _uiState.value
        val nextIdx = (current.currentQuizIndex + 1) % current.quizQuestions.size
        _uiState.update {
            it.copy(
                currentQuizIndex = nextIdx,
                quizAnswerSelected = null,
                isQuizAnswerSubmitted = false
            )
        }
    }

    // Parliament Bill Voting
    fun voteOnParliamentBill(billId: String, supportGovernment: Boolean) {
        val current = _uiState.value
        val updatedBills = current.parliamentBills.map { bill ->
            if (bill.id == billId) {
                val govtSeats = if (current.party.wonSeatsNational > 0) current.party.wonSeatsNational else 280
                val oppSeats = 543 - govtSeats
                val govtVotes = if (supportGovernment) govtSeats - 5 else 40
                val oppVotes = if (supportGovernment) 20 else oppSeats - 15
                val passed = (govtVotes + oppVotes) >= bill.requiredVotes

                bill.copy(
                    govtVotes = govtVotes,
                    oppositionVotes = oppVotes,
                    status = if (passed) "पारित (Passed)" else "अस्वीकृत (Defeated)"
                )
            } else bill
        }

        _uiState.update {
            it.copy(
                parliamentBills = updatedBills,
                infoBannerMessage = "संसद में मतदान संपन्न हुआ! विधेयक की स्थिति अद्यतित कर दी गई है।"
            )
        }
    }

    fun updateNationalBudgetAllocation(category: String, amountCrores: Long) {
        val current = _uiState.value
        val newAllocations = current.nationalBudget.allocations.toMutableMap()
        newAllocations[category] = amountCrores
        val newTotalExpenditure = newAllocations.values.sum()
        val newDeficit = max(0L, newTotalExpenditure - current.nationalBudget.totalRevenueCrores)

        val updatedBudget = current.nationalBudget.copy(
            allocations = newAllocations,
            totalExpenditureCrores = newTotalExpenditure,
            fiscalDeficitCrores = newDeficit
        )

        _uiState.update { it.copy(nationalBudget = updatedBudget, infoBannerMessage = "बजट आवंटन संशोधित किया गया।") }
    }

    fun saveGame() {
        val current = _uiState.value
        viewModelScope.launch {
            repository.saveCurrentState(
                player = current.player,
                party = current.party,
                level = current.currentLevel,
                day = current.gameDay,
                countdown = current.electionCountdownDays,
                approval = current.nationalMetrics.governmentApproval
            )
            _uiState.update { it.copy(infoBannerMessage = "खेल की प्रगति सफलतापूर्वक सहेजी गई (Auto-saved)!") }
        }
    }
}
