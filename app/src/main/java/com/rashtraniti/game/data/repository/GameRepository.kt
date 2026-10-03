package com.rashtraniti.game.data.repository

import com.rashtraniti.game.data.local.GameDao
import com.rashtraniti.game.data.local.GameSaveEntity
import com.rashtraniti.game.data.model.*
import kotlinx.coroutines.flow.Flow

class GameRepository(private val gameDao: GameDao) {

    fun observeSavedGame(): Flow<GameSaveEntity?> = gameDao.observeSaveGame()

    suspend fun saveCurrentState(
        player: Player,
        party: Party,
        level: PoliticalLevel,
        day: Int,
        countdown: Int,
        approval: Int
    ) {
        val entity = GameSaveEntity(
            saveSlotId = 1,
            playerName = player.name,
            partyName = party.name,
            currentLevelNumber = level.levelNumber,
            gameDay = day,
            electionCountdownDays = countdown,
            playerFunds = player.personalMoney,
            partyFunds = party.funds,
            publicTrust = player.stats.publicTrust,
            partyPopularity = party.overallPopularity,
            govtApproval = approval,
            wonSeatsNational = party.wonSeatsNational
        )
        gameDao.insertOrUpdateSave(entity)
    }

    suspend fun loadSavedState(): GameSaveEntity? {
        return gameDao.getSaveGame()
    }

    suspend fun resetGameSave() {
        gameDao.deleteSave()
    }

    // Default Political Quiz Questions (Civics, Constitution, Parliament, Democracy)
    fun getInitialQuizQuestions(): List<QuizQuestion> = listOf(
        QuizQuestion(
            id = 1,
            category = "भारतीय संविधान (Constitution)",
            questionHindi = "भारत का संविधान किस तिथि को पूर्ण रूप से लागू हुआ था?",
            questionEnglish = "On which date did the Constitution of India fully come into force?",
            options = listOf("15 अगस्त 1947", "26 नवम्बर 1949", "26 जनवरी 1950", "2 अक्टूबर 1950"),
            correctIndex = 2,
            explanation = "26 जनवरी 1950 को भारतीय संविधान पूर्ण रूप से लागू हुआ और भारत एक संप्रभु लोकतांत्रिक गणराज्य बना।",
            difficulty = "Easy"
        ),
        QuizQuestion(
            id = 2,
            category = "संसद व लोकतंत्र (Parliament)",
            questionHindi = "लोकसभा में साधारण बहुमत सिद्ध करने के लिए न्यूनतम कितनी सीटों की आवश्यकता होती है?",
            questionEnglish = "How many minimum seats are required to prove a simple majority in Lok Sabha?",
            options = listOf("250 सीटें", "272 सीटें", "300 सीटें", "543 सीटें"),
            correctIndex = 1,
            explanation = "कुल 543 निर्वाचित लोकसभा सीटों में से 272 सीटें साधारण बहुमत (50% + 1) का आंकड़ा होती हैं।",
            difficulty = "Medium"
        ),
        QuizQuestion(
            id = 3,
            category = "अर्थव्यवस्था व बजट (Economy)",
            questionHindi = "वार्षिक वित्तीय विवरण (बजट) संसद में संविधान के किस अनुच्छेद के तहत प्रस्तुत किया जाता है?",
            questionEnglish = "Under which Article of the Constitution is the Annual Financial Statement (Budget) presented?",
            options = listOf("अनुच्छेद 110", "अनुच्छेद 112", "अनुच्छेद 123", "अनुच्छेद 360"),
            correctIndex = 1,
            explanation = "संविधान के अनुच्छेद 112 के अनुसार राष्ट्रपति प्रत्येक वित्तीय वर्ष के लिए वार्षिक वित्तीय विवरण संसद के दोनों सदनों के समक्ष रखवाते हैं।",
            difficulty = "Hard"
        ),
        QuizQuestion(
            id = 4,
            category = "चुनाव आयोग (Election Commission)",
            questionHindi = "भारत निर्वाचन आयोग का प्रावधान संविधान के किस भाग व अनुच्छेद में है?",
            questionEnglish = "Under which Part and Article is the Election Commission of India provided?",
            options = listOf("भाग 15, अनुच्छेद 324", "भाग 18, अनुच्छेद 352", "भाग 3, अनुच्छेद 19", "भाग 4, अनुच्छेद 40"),
            correctIndex = 0,
            explanation = "अनुच्छेद 324 में स्वतंत्र एवं निष्पक्ष चुनावों के अधीक्षण, निर्देशन और नियंत्रण हेतु निर्वाचन आयोग का प्रावधान है।",
            difficulty = "Medium"
        ),
        QuizQuestion(
            id = 5,
            category = "प्रशासन (Administration)",
            questionHindi = "अविश्वास प्रस्ताव (No Confidence Motion) केवल किस सदन में प्रस्तुत किया जा सकता है?",
            questionEnglish = "In which House can a No-Confidence Motion be introduced?",
            options = listOf("केवल राज्यसभा में", "केवल लोकसभा में", "दोनों में से किसी भी सदन में", "संयुक्त अधिवेशन में"),
            correctIndex = 1,
            explanation = "मंत्रिपरिषद सामूहिक रूप से लोकसभा के प्रति उत्तरदायी होती है (अनुच्छेद 75(3)), इसलिए अविश्वास प्रस्ताव केवल लोकसभा में लाया जा सकता है।",
            difficulty = "Hard"
        )
    )

    // Dynamic Crises and Natural Disasters
    fun getInitialCrisisEvents(): List<CrisisEvent> = listOf(
        CrisisEvent(
            id = "flood_disaster_01",
            titleHindi = "भीषण बाढ़ संकट: गंगा बेसिन में जलप्रलय",
            titleEnglish = "Severe Flood Crisis: Inundation in Ganga Basin",
            description = "लगातार मूसलाधार बारिश से 4 जिलों में 500 से अधिक गांव जलमग्न हो गए हैं। लगभग 3 लाख नागरिक प्रभावित हैं और फसलों को भारी नुकसान पहुंचा है। तत्काल निर्णय आवश्यक है।",
            isNaturalDisaster = true,
            affectedRegion = "पूर्वी उत्तर प्रदेश व बिहार",
            severity = "उच्च (High)",
            choices = listOf(
                CrisisChoice(
                    id = "c1",
                    titleHindi = "तत्काल सेना/NDRF व ₹2,000 करोड़ का राहत पैकेज",
                    titleEnglish = "Deploy Army/NDRF & ₹2,000 Cr Relief Package",
                    costMoney = 0L,
                    costBudgetCrore = 2000L,
                    expectedEffect = "तीव्र बचाव कार्य, जनता में उच्च विश्वास, बजट घाटे में हल्की वृद्धि।",
                    publicTrustImpact = 12,
                    popularityImpact = 8,
                    approvalImpact = 10,
                    shortTermResult = "NDRF ने 48 घंटे में 80,000 लोगों को सुरक्षित शिविरों तक पहुंचाया। राशन व चिकित्सा शिविर स्थापित।",
                    longTermResult = "आपदा प्रबंधन में आपकी त्वरित तत्परता से राष्ट्रीय स्तर पर आपकी छवि एक संवेदनशील व सक्षम नेता की बनी।"
                ),
                CrisisChoice(
                    id = "c2",
                    titleHindi = "स्थानीय प्रशासन द्वारा राहत और सीमित वित्तीय सहायता (₹500 करोड़)",
                    titleEnglish = "District Admin Relief & ₹500 Cr Aid",
                    costMoney = 0L,
                    costBudgetCrore = 500L,
                    expectedEffect = "बजट की बचत, परंतु राहत कार्यों में देरी और जनआक्रोश का जोखिम।",
                    publicTrustImpact = -5,
                    popularityImpact = -4,
                    approvalImpact = -6,
                    shortTermResult = "स्थानीय संसाधनों की कमी के कारण राहत सामग्री समय पर नहीं पहुंच सकी। विरोध प्रदर्शन शुरू।",
                    longTermResult = "विपक्ष ने संसद में सरकार पर संवेदनहीनता का आरोप लगाया और मीडिया में तीखी बहस छिड़ी।"
                ),
                CrisisChoice(
                    id = "c3",
                    titleHindi = "स्वयं प्रभावित क्षेत्र का हवाई दौरा व डिजिटल दान अभियान",
                    titleEnglish = "Personal Aerial Survey & Crowd Relief Fund",
                    costMoney = 50000L,
                    costBudgetCrore = 800L,
                    expectedEffect = "उच्च मीडिया कवरेज, जनभागीदारी, मध्यम राहत प्रभाव।",
                    publicTrustImpact = 6,
                    popularityImpact = 10,
                    approvalImpact = 5,
                    shortTermResult = "आपकी प्रत्यक्ष उपस्थिति से कार्यकर्ताओं में ऊर्जा आई। जनसहयोग से ₹150 करोड़ अतिरिक्त जुटाए गए।",
                    longTermResult = "युवाओं में आपकी लोकप्रियता बढ़ी, यद्यपि विपक्ष ने इसे 'फोटो-ऑप' करार दिया।"
                )
            )
        ),
        CrisisEvent(
            id = "media_trial_01",
            titleHindi = "मीडिया ट्रायल: विपक्षी दल का नीतिगत आरोप",
            titleEnglish = "Media Trial: Opposition Attacks Core Manifesto",
            description = "एक प्रमुख समाचार चैनल पर मुख्य डिबेट में विपक्षी प्रवक्ता ने दावा किया है कि आपकी पार्टी की बुनियादी ढांचा योजना अव्यवहारिक है और केवल चुनावी जुमला है।",
            isNaturalDisaster = false,
            affectedRegion = "राष्ट्रीय मीडिया (TV / Social)",
            severity = "मध्यम (Medium)",
            choices = listOf(
                CrisisChoice(
                    id = "m1",
                    titleHindi = "आंकड़ों व विस्तृत ब्लूप्रिंट के साथ तत्काल लाइव प्रेस कॉन्फ्रेंस",
                    titleEnglish = "Hold Live Press Conference with Facts & Blueprint",
                    costMoney = 35000L,
                    expectedEffect = "सत्यता सिद्ध, जनता में बौद्धिक विश्वास में वृद्धि।",
                    publicTrustImpact = 7,
                    popularityImpact = 5,
                    approvalImpact = 6,
                    shortTermResult = "पत्रकारों के सभी तकनीकी प्रश्नों का स्पष्ट उत्तर दिया गया। चैनल पर सकारात्मक रिपोर्ट आई।",
                    longTermResult = "आपकी पार्टी को आर्थिक मामलों में गंभीर और अध्ययनशील माना जाने लगा।"
                ),
                CrisisChoice(
                    id = "m2",
                    titleHindi = "आरोपों को नजरअंदाज कर जमीनी जनसंपर्क जारी रखना",
                    titleEnglish = "Ignore Allegations & Focus on Grassroots",
                    costMoney = 0L,
                    expectedEffect = "संसाधनों की बचत, परंतु शहरी मतदाताओं में संशय।",
                    publicTrustImpact = -2,
                    popularityImpact = -1,
                    approvalImpact = -3,
                    shortTermResult = "चैनल ने आपकी चुप्पी को कमजोरी के रूप में प्रस्तुत किया।",
                    longTermResult = "शहरी शिक्षित वर्ग में आपकी पार्टी की छवि पर आंशिक नकारात्मक प्रभाव पड़ा।"
                ),
                CrisisChoice(
                    id = "m3",
                    titleHindi = "युवा विंग द्वारा सोशल मीडिया पर तथ्यपरक वीडियो कैंपेन",
                    titleEnglish = "Launch Fact-Check Video Campaign via Youth Wing",
                    costMoney = 20000L,
                    expectedEffect = "डिजिटल स्पेस में विपक्ष की काट, युवा वर्ग में समर्थन।",
                    publicTrustImpact = 5,
                    popularityImpact = 8,
                    approvalImpact = 4,
                    shortTermResult = "शॉर्ट वीडियो मिलियन व्यूज के साथ ट्रेंड करने लगे और भ्रम दूर हुआ।",
                    longTermResult = "डिजिटल प्रभाव में 15% की वृद्धि दर्ज की गई।"
                )
            )
        )
    )

    // Initial Fictional Cabinet Ministers
    fun getInitialMinisters(): List<CabinetMinister> = listOf(
        CabinetMinister("min_1", "राजेश मल्होत्रा", "गृह मंत्रालय (Home Affairs)", "Home Affairs", competence = 82, loyalty = 90, popularity = 75, corruptionRisk = 12),
        CabinetMinister("min_2", "श्रीमती सुनंदा राव", "वित्त मंत्रालय (Finance)", "Finance", competence = 88, loyalty = 85, popularity = 70, corruptionRisk = 8),
        CabinetMinister("min_3", "डॉ. विक्रम साराभाई (काल्पनिक)", "विज्ञान व तकनीक (Technology)", "Technology", competence = 95, loyalty = 80, popularity = 85, corruptionRisk = 5),
        CabinetMinister("min_4", "बलबीर सिंह चीमा", "कृषि मंत्रालय (Agriculture)", "Agriculture", competence = 78, loyalty = 88, popularity = 80, corruptionRisk = 15),
        CabinetMinister("min_5", "अमित देसाई", "सड़क व बुनियादी ढांचा (Infrastructure)", "Infrastructure", competence = 84, loyalty = 75, popularity = 72, corruptionRisk = 18),
        CabinetMinister("min_6", "डॉ. वीना नायर", "स्वास्थ्य व परिवार कल्याण (Healthcare)", "Healthcare", competence = 90, loyalty = 92, popularity = 78, corruptionRisk = 6),
        CabinetMinister("min_7", "प्रो. आनंद कुमार", "शिक्षा मंत्रालय (Education)", "Education", competence = 86, loyalty = 89, popularity = 82, corruptionRisk = 7),
        CabinetMinister("min_8", "कर्नल राघवेंद्र राठौड़", "रक्षा मंत्रालय (Defence)", "Defence", competence = 91, loyalty = 94, popularity = 88, corruptionRisk = 9)
    )

    // Fictional Opposition Parties
    fun getInitialOpposition(): List<OppositionParty> = listOf(
        OppositionParty(
            name = "राष्ट्रीय प्रगतिशील मोर्चा (RPM)",
            leaderName = "देवेंद्र चक्रवर्ती",
            symbol = "मशाल (Torch)",
            colorHex = "#2563EB",
            seatsNational = 165,
            funds = 12000000L,
            popularity = 38,
            aggressiveRating = 8
        ),
        OppositionParty(
            name = "लोक समता दल (LSD)",
            leaderName = "मायावती देवी (काल्पनिक)",
            symbol = "हलधर (Plow)",
            colorHex = "#059669",
            seatsNational = 78,
            funds = 7500000L,
            popularity = 24,
            aggressiveRating = 6
        ),
        OppositionParty(
            name = "स्वतंत्र जन मंच (SJM)",
            leaderName = "के. विश्वनाथन",
            symbol = "किताब (Book)",
            colorHex = "#7C3AED",
            seatsNational = 35,
            funds = 4200000L,
            popularity = 15,
            aggressiveRating = 5
        )
    )

    fun getInitialConstituencies(): List<Constituency> = listOf(
        Constituency(
            id = "const_01",
            name = "वाराणसी उत्तर (Varanasi North)",
            district = "वाराणसी",
            state = "उत्तर प्रदेश",
            totalVoters = 340000L,
            currentLeaderParty = "जन उत्थान पार्टी (आप)",
            playerPartySupportPct = 46.2f,
            mainOpponentSupportPct = 39.8f,
            otherPartiesSupportPct = 14.0f,
            isPlayerHomeConstituency = true,
            isUnlocked = true,
            topIssue = "शहरी विकास व स्वरोजगार"
        ),
        Constituency(
            id = "const_02",
            name = "गोरखपुर ग्रामीण (Gorakhpur Rural)",
            district = "गोरखपुर",
            state = "उत्तर प्रदेश",
            totalVoters = 310000L,
            currentLeaderParty = "राष्ट्रीय प्रगतिशील मोर्चा",
            playerPartySupportPct = 34.0f,
            mainOpponentSupportPct = 48.5f,
            otherPartiesSupportPct = 17.5f,
            isPlayerHomeConstituency = false,
            isUnlocked = true,
            topIssue = "सिंचाई व किसान न्यूनतम समर्थन मूल्य"
        ),
        Constituency(
            id = "const_03",
            name = "पटना साहिब (Patna Sahib)",
            district = "पटना",
            state = "बिहार",
            totalVoters = 390000L,
            currentLeaderParty = "लोक समता दल",
            playerPartySupportPct = 28.5f,
            mainOpponentSupportPct = 44.0f,
            otherPartiesSupportPct = 27.5f,
            isPlayerHomeConstituency = false,
            isUnlocked = false,
            topIssue = "उच्च शिक्षा व IT पार्क स्थापना"
        ),
        Constituency(
            id = "const_04",
            name = "इंदौर मध्य (Indore Central)",
            district = "इंदौर",
            state = "मध्य प्रदेश",
            totalVoters = 280000L,
            currentLeaderParty = "राष्ट्रीय प्रगतिशील मोर्चा",
            playerPartySupportPct = 32.0f,
            mainOpponentSupportPct = 46.0f,
            otherPartiesSupportPct = 22.0f,
            isPlayerHomeConstituency = false,
            isUnlocked = false,
            topIssue = "स्वच्छता व औद्योगिक कॉरिडोर"
        ),
        Constituency(
            id = "const_05",
            name = "जयपुर ग्रामीण (Jaipur Rural)",
            district = "जयपुर",
            state = "राजस्थान",
            totalVoters = 320000L,
            currentLeaderParty = "स्वतंत्र जन मंच",
            playerPartySupportPct = 25.0f,
            mainOpponentSupportPct = 42.0f,
            otherPartiesSupportPct = 33.0f,
            isPlayerHomeConstituency = false,
            isUnlocked = false,
            topIssue = "पेयजल आपूर्ति व पर्यटन प्रोत्साहन"
        )
    )

    fun getInitialAchievements(): List<Achievement> = listOf(
        Achievement("first_campaign", "पहला अभियान", "First Campaign", "पहली बार घर-घर जनसंपर्क या जनसभा आयोजित की।", false),
        Achievement("party_founder", "दल संस्थापक", "Party Founder", "आधिकारिक तौर पर राजनीतिक पार्टी का गठन किया।", true),
        Achievement("first_win", "पहली चुनावी विजय", "First Victory", "स्थानीय निर्वाचन क्षेत्र में प्रथम जीत दर्ज की।", false),
        Achievement("mp_elected", "संसद में प्रवेश", "Elected as MP", "लोकसभा चुनाव जीतकर संसद पहुंचे।", false),
        Achievement("majority_govt", "पूर्ण बहुमत", "Majority Government", "272 से अधिक सीटों के साथ सरकार का गठन किया।", false),
        Achievement("prime_minister", "प्रधान सेवक / प्रधानमंत्री", "Prime Minister", "भारत के प्रधानमंत्री पद की शपथ ली।", false),
        Achievement("crisis_manager", "संकटमोचक", "Crisis Manager", "प्राकृतिक आपदा या राष्ट्रीय संकट का सफलतापूर्वक समाधान किया।", false),
        Achievement("economic_reformer", "आर्थिक सुधारक", "Economic Reformer", "GDP विकास दर को 8% के पार पहुंचाया।", false),
        Achievement("three_terms", "जननायक", "People's Leader", "लगातार जनविश्वास बनाए रखा और पुनः जनादेश प्राप्त किया।", false)
    )
}
