package com.rashtraniti.game

import android.os.Bundle
import androidx.activity.ComponentActivity
import androidx.activity.compose.setContent
import androidx.compose.foundation.background
import androidx.compose.foundation.layout.*
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Modifier
import androidx.lifecycle.viewmodel.compose.viewModel
import com.rashtraniti.game.data.repository.GameRepository
import com.rashtraniti.game.ui.components.CrisisDialog
import com.rashtraniti.game.ui.components.GameBottomNavBar
import com.rashtraniti.game.ui.components.GameTopBar
import com.rashtraniti.game.ui.components.InfoBanner
import com.rashtraniti.game.ui.screens.*
import com.rashtraniti.game.ui.theme.DeepNavyBg
import com.rashtraniti.game.ui.theme.RashtraNitiTheme
import com.rashtraniti.game.viewmodel.GameViewModel
import com.rashtraniti.game.viewmodel.Screen

class MainActivity : ComponentActivity() {

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)

        val app = application as RashtraNitiApp
        val repository = app.gameRepository

        setContent {
            RashtraNitiTheme {
                val viewModel: GameViewModel = remember { GameViewModel(repository) }
                val state by viewModel.uiState.collectAsState()

                Scaffold(
                    modifier = Modifier.fillMaxSize(),
                    containerColor = DeepNavyBg,
                    topBar = {
                        if (state.currentScreen != Screen.OPENING &&
                            state.currentScreen != Screen.PLAYER_CREATION &&
                            state.currentScreen != Screen.PARTY_CREATION
                        ) {
                            GameTopBar(
                                state = state,
                                onLanguageToggle = { viewModel.toggleLanguage() },
                                onNextDay = { viewModel.advanceToNextDay() }
                            )
                        }
                    },
                    bottomBar = {
                        if (state.currentScreen != Screen.OPENING &&
                            state.currentScreen != Screen.PLAYER_CREATION &&
                            state.currentScreen != Screen.PARTY_CREATION
                        ) {
                            GameBottomNavBar(
                                currentScreen = state.currentScreen,
                                onNavigate = { viewModel.navigateTo(it) },
                                isHindi = state.isHindiLanguage
                            )
                        }
                    }
                ) { innerPadding ->
                    Box(
                        modifier = Modifier
                            .fillMaxSize()
                            .padding(innerPadding)
                    ) {
                        when (state.currentScreen) {
                            Screen.OPENING -> {
                                OpeningScreen(
                                    onStartJourney = { viewModel.navigateTo(Screen.PLAYER_CREATION) }
                                )
                            }
                            Screen.PLAYER_CREATION -> {
                                PlayerCreationScreen(
                                    initialPlayer = state.player,
                                    onConfirmProfile = { name, age, gender, st, dist, const, edu, occ ->
                                        viewModel.updatePlayerProfile(name, age, gender, st, dist, const, edu, occ)
                                    }
                                )
                            }
                            Screen.PARTY_CREATION -> {
                                PartyCreationScreen(
                                    initialParty = state.party,
                                    onConfirmParty = { name, shortName, symbol, colorHex, slogan, desc, priorities ->
                                        viewModel.updatePartyDetails(name, shortName, symbol, colorHex, slogan, desc, priorities)
                                    }
                                )
                            }
                            Screen.HOME -> {
                                HomeScreen(
                                    state = state,
                                    onNavigate = { viewModel.navigateTo(it) },
                                    onAdvanceDay = { viewModel.advanceToNextDay() },
                                    onTriggerElection = { viewModel.conductElection() }
                                )
                            }
                            Screen.MAP -> {
                                MapScreen(state = state)
                            }
                            Screen.CAMPAIGN -> {
                                CampaignScreen(
                                    state = state,
                                    onExecuteAction = { viewModel.runCampaignAction(it) }
                                )
                            }
                            Screen.ELECTION -> {
                                ElectionScreen(
                                    state = state,
                                    onStartVoteCount = { viewModel.conductElection() }
                                )
                            }
                            Screen.CABINET, Screen.PM_DASHBOARD -> {
                                CabinetScreen(
                                    state = state,
                                    onOpenBudget = { viewModel.navigateTo(Screen.BUDGET) }
                                )
                            }
                            Screen.BUDGET -> {
                                BudgetScreen(
                                    state = state,
                                    onAdjustAllocation = { cat, amt -> viewModel.updateNationalBudgetAllocation(cat, amt) },
                                    onBack = { viewModel.navigateTo(Screen.CABINET) }
                                )
                            }
                            Screen.PARLIAMENT -> {
                                ParliamentScreen(
                                    state = state,
                                    onVoteBill = { id, aye -> viewModel.voteOnParliamentBill(id, aye) }
                                )
                            }
                            Screen.QUIZ -> {
                                QuizScreen(
                                    state = state,
                                    onSelectOption = { viewModel.selectQuizOption(it) },
                                    onSubmitAnswer = { viewModel.submitQuizAnswer() },
                                    onNextQuestion = { viewModel.nextQuizQuestion() }
                                )
                            }
                            Screen.MEDIA -> {
                                MediaScreen(state = state)
                            }
                            Screen.MULTIPLAYER -> {
                                MultiplayerScreen(state = state)
                            }
                            Screen.PROFILE_ACHIEVEMENTS -> {
                                ProfileAchievementsScreen(
                                    state = state,
                                    onSaveGame = { viewModel.saveGame() },
                                    onToggleLanguage = { viewModel.toggleLanguage() }
                                )
                            }
                        }

                        // Notification / Alert Banner
                        state.infoBannerMessage?.let { banner ->
                            InfoBanner(
                                message = banner,
                                onDismiss = { viewModel.dismissInfoBanner() }
                            )
                        }

                        // Dynamic Sudden Crisis / Natural Disaster Modal
                        state.activeCrisis?.let { crisis ->
                            CrisisDialog(
                                crisis = crisis,
                                isHindi = state.isHindiLanguage,
                                onChoiceSelected = { viewModel.resolveCrisis(it) }
                            )
                        }

                        // Crisis Resolution Feedback Dialog
                        state.crisisOutcomeMessage?.let { outcome ->
                            AlertDialog(
                                onDismissRequest = { viewModel.dismissCrisisOutcome() },
                                containerColor = com.rashtraniti.game.ui.theme.CardNavy,
                                shape = androidx.compose.foundation.shape.RoundedCornerShape(14.dp),
                                title = {
                                    Text("कार्यवाही का परिणाम", color = com.rashtraniti.game.ui.theme.TextPrimary, fontWeight = androidx.compose.ui.text.font.FontWeight.Bold)
                                },
                                text = {
                                    Text(outcome, color = com.rashtraniti.game.ui.theme.TextSecondary, fontSize = 13.sp, lineHeight = 18.sp)
                                },
                                confirmButton = {
                                    Button(
                                        onClick = { viewModel.dismissCrisisOutcome() },
                                        colors = ButtonDefaults.buttonColors(containerColor = com.rashtraniti.game.ui.theme.SaffronPrimary)
                                    ) {
                                        Text("स्वीकार करें", color = androidx.compose.ui.graphics.Color.White)
                                    }
                                }
                            )
                        }
                    }
                }
            }
        }
    }
}
