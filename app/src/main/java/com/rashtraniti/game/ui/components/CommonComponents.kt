package com.rashtraniti.game.ui.components

import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.*
import androidx.compose.material3.*
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.graphics.vector.ImageVector
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.text.style.TextOverflow
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.rashtraniti.game.data.model.CrisisChoice
import com.rashtraniti.game.data.model.CrisisEvent
import com.rashtraniti.game.data.model.PoliticalLevel
import com.rashtraniti.game.ui.theme.*
import com.rashtraniti.game.viewmodel.GameUiState
import com.rashtraniti.game.viewmodel.Screen

@Composable
fun GameTopBar(
    state: GameUiState,
    onLanguageToggle: () -> Unit,
    onNextDay: () -> Unit
) {
    Surface(
        modifier = Modifier.fillMaxWidth(),
        color = CardNavy,
        shadowElevation = 4.dp
    ) {
        Column(
            modifier = Modifier
                .fillMaxWidth()
                .padding(horizontal = 12.dp, vertical = 8.dp)
        ) {
            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.SpaceBetween,
                verticalAlignment = Alignment.CenterVertically
            ) {
                Row(verticalAlignment = Alignment.CenterVertically) {
                    Box(
                        modifier = Modifier
                            .size(32.dp)
                            .clip(CircleShape)
                            .background(SaffronPrimary),
                        contentAlignment = Alignment.Center
                    ) {
                        Text(
                            text = "${state.currentLevel.levelNumber}",
                            color = Color.White,
                            fontWeight = FontWeight.Bold,
                            fontSize = 14.sp
                        )
                    }
                    Spacer(modifier = Modifier.width(8.dp))
                    Column {
                        Text(
                            text = if (state.isHindiLanguage) state.currentLevel.titleHindi else state.currentLevel.titleEnglish,
                            color = SaffronLight,
                            fontSize = 13.sp,
                            fontWeight = FontWeight.Bold
                        )
                        Text(
                            text = if (state.isHindiLanguage) "दिन ${state.gameDay} • चुनाव में ${state.electionCountdownDays} दिन शेष"
                            else "Day ${state.gameDay} • ${state.electionCountdownDays} Days to Election",
                            color = TextSecondary,
                            fontSize = 11.sp
                        )
                    }
                }

                Row(verticalAlignment = Alignment.CenterVertically) {
                    // Next day button
                    Button(
                        onClick = onNextDay,
                        colors = ButtonDefaults.buttonColors(containerColor = IndianGreen),
                        shape = RoundedCornerShape(8.dp),
                        contentPadding = PaddingValues(horizontal = 8.dp, vertical = 4.dp),
                        modifier = Modifier.height(32.dp)
                    ) {
                        Icon(Icons.Default.FastForward, contentDescription = "Next Day", modifier = Modifier.size(16.dp))
                        Spacer(modifier = Modifier.width(4.dp))
                        Text(if (state.isHindiLanguage) "अगला दिन" else "Next Day", fontSize = 11.sp)
                    }

                    Spacer(modifier = Modifier.width(6.dp))

                    // Language switch
                    OutlinedButton(
                        onClick = onLanguageToggle,
                        shape = RoundedCornerShape(8.dp),
                        contentPadding = PaddingValues(horizontal = 6.dp, vertical = 2.dp),
                        modifier = Modifier.height(32.dp)
                    ) {
                        Text(
                            text = if (state.isHindiLanguage) "EN" else "हिन्दी",
                            color = GoldAccent,
                            fontSize = 11.sp,
                            fontWeight = FontWeight.Bold
                        )
                    }
                }
            }

            Spacer(modifier = Modifier.height(6.dp))

            // Resource strip
            Row(
                modifier = Modifier
                    .fillMaxWidth()
                    .background(DeepNavyBg, RoundedCornerShape(6.dp))
                    .padding(horizontal = 8.dp, vertical = 4.dp),
                horizontalArrangement = Arrangement.SpaceBetween
            ) {
                Text(
                    text = "💰 पार्टी कोष: ₹${formatCurrency(state.party.funds)}",
                    color = GoldAccent,
                    fontSize = 11.sp,
                    fontWeight = FontWeight.Medium
                )
                Text(
                    text = "🤝 जनविश्वास: ${state.player.stats.publicTrust}%",
                    color = EmeraldSuccess,
                    fontSize = 11.sp,
                    fontWeight = FontWeight.Medium
                )
                Text(
                    text = "⚡ ऊर्जा: ${state.player.energy}%",
                    color = SaffronLight,
                    fontSize = 11.sp,
                    fontWeight = FontWeight.Medium
                )
            }
        }
    }
}

@Composable
fun GameBottomNavBar(
    currentScreen: Screen,
    onNavigate: (Screen) -> Unit,
    isHindi: Boolean
) {
    NavigationBar(
        containerColor = CardNavy,
        tonalElevation = 8.dp,
        modifier = Modifier.height(64.dp)
    ) {
        val items = listOf(
            Triple(Screen.HOME, Icons.Default.Home, if (isHindi) "गृह" else "Home"),
            Triple(Screen.MAP, Icons.Default.Map, if (isHindi) "मानचित्र" else "Map"),
            Triple(Screen.CAMPAIGN, Icons.Default.Campaign, if (isHindi) "अभियान" else "Campaign"),
            Triple(Screen.ELECTION, Icons.Default.HowToVote, if (isHindi) "चुनाव" else "Election"),
            Triple(Screen.CABINET, Icons.Default.AccountBalance, if (isHindi) "मंत्रिमंडल" else "Cabinet"),
            Triple(Screen.QUIZ, Icons.Default.Quiz, if (isHindi) "क्विज" else "Quiz"),
            Triple(Screen.PROFILE_ACHIEVEMENTS, Icons.Default.Person, if (isHindi) "प्रोफाइल" else "Profile")
        )

        items.forEach { (screen, icon, label) ->
            NavigationBarItem(
                selected = currentScreen == screen,
                onClick = { onNavigate(screen) },
                icon = {
                    Icon(
                        imageVector = icon,
                        contentDescription = label,
                        modifier = Modifier.size(20.dp),
                        tint = if (currentScreen == screen) SaffronPrimary else TextSecondary
                    )
                },
                label = {
                    Text(
                        text = label,
                        fontSize = 10.sp,
                        color = if (currentScreen == screen) SaffronPrimary else TextSecondary,
                        maxLines = 1,
                        overflow = TextOverflow.Ellipsis
                    )
                },
                colors = NavigationBarItemDefaults.colors(
                    indicatorColor = CardNavyBorder
                )
            )
        }
    }
}

@Composable
fun CrisisDialog(
    crisis: CrisisEvent,
    isHindi: Boolean,
    onChoiceSelected: (CrisisChoice) -> Unit
) {
    AlertDialog(
        onDismissRequest = { /* Force explicit decision */ },
        containerColor = CardNavy,
        shape = RoundedCornerShape(16.dp),
        title = {
            Row(verticalAlignment = Alignment.CenterVertically) {
                Icon(
                    imageVector = if (crisis.isNaturalDisaster) Icons.Default.Warning else Icons.Default.CrisisAlert,
                    contentDescription = "Alert",
                    tint = CrimsonDanger,
                    modifier = Modifier.size(28.dp)
                )
                Spacer(modifier = Modifier.width(8.dp))
                Text(
                    text = if (isHindi) crisis.titleHindi else crisis.titleEnglish,
                    color = TextPrimary,
                    fontSize = 16.sp,
                    fontWeight = FontWeight.Bold
                )
            }
        },
        text = {
            Column(modifier = Modifier.fillMaxWidth()) {
                Text(
                    text = "प्रभावित क्षेत्र: ${crisis.affectedRegion} • गंभीरता: ${crisis.severity}",
                    color = GoldAccent,
                    fontSize = 12.sp,
                    fontWeight = FontWeight.SemiBold
                )
                Spacer(modifier = Modifier.height(6.dp))
                Text(
                    text = crisis.description,
                    color = TextSecondary,
                    fontSize = 13.sp,
                    lineHeight = 18.sp
                )
                Spacer(modifier = Modifier.height(12.dp))
                Text(
                    text = if (isHindi) "आपकी नीतिगत कार्यवाही का चयन करें:" else "Select Your Executive Action:",
                    color = TextPrimary,
                    fontSize = 13.sp,
                    fontWeight = FontWeight.Bold
                )
                Spacer(modifier = Modifier.height(8.dp))

                crisis.choices.forEach { choice ->
                    Card(
                        modifier = Modifier
                            .fillMaxWidth()
                            .padding(vertical = 4.dp)
                            .clickable { onChoiceSelected(choice) },
                        colors = CardDefaults.cardColors(containerColor = DeepNavyBg),
                        shape = RoundedCornerShape(8.dp),
                        border = androidx.compose.foundation.BorderStroke(1.dp, CardNavyBorder)
                    ) {
                        Column(modifier = Modifier.padding(10.dp)) {
                            Text(
                                text = if (isHindi) choice.titleHindi else choice.titleEnglish,
                                color = SaffronLight,
                                fontSize = 12.sp,
                                fontWeight = FontWeight.Bold
                            )
                            Spacer(modifier = Modifier.height(3.dp))
                            Text(
                                text = choice.expectedEffect,
                                color = TextSecondary,
                                fontSize = 11.sp
                            )
                            Spacer(modifier = Modifier.height(4.dp))
                            Row(
                                modifier = Modifier.fillMaxWidth(),
                                horizontalArrangement = Arrangement.SpaceBetween
                            ) {
                                if (choice.costMoney > 0) {
                                    Text("व्यय: ₹${choice.costMoney}", color = CrimsonDanger, fontSize = 10.sp)
                                }
                                if (choice.costBudgetCrore > 0) {
                                    Text("बजट व्यय: ₹${choice.costBudgetCrore} Cr", color = CrimsonDanger, fontSize = 10.sp)
                                }
                                Text("जनविश्वास: +${choice.publicTrustImpact}%", color = EmeraldSuccess, fontSize = 10.sp)
                            }
                        }
                    }
                }
            }
        },
        confirmButton = {}
    )
}

@Composable
fun InfoBanner(
    message: String,
    onDismiss: () -> Unit
) {
    Surface(
        modifier = Modifier
            .fillMaxWidth()
            .clickable { onDismiss() },
        color = AshokaNavy,
        shape = RoundedCornerShape(0.dp)
    ) {
        Row(
            modifier = Modifier.padding(horizontal = 14.dp, vertical = 8.dp),
            verticalAlignment = Alignment.CenterVertically,
            horizontalArrangement = Arrangement.SpaceBetween
        ) {
            Row(modifier = Modifier.weight(1f), verticalAlignment = Alignment.CenterVertically) {
                Icon(Icons.Default.Info, contentDescription = "Notice", tint = GoldAccent, modifier = Modifier.size(16.dp))
                Spacer(modifier = Modifier.width(8.dp))
                Text(
                    text = message,
                    color = TextPrimary,
                    fontSize = 12.sp,
                    lineHeight = 16.sp
                )
            }
            Icon(Icons.Default.Close, contentDescription = "Close", tint = TextSecondary, modifier = Modifier.size(14.dp))
        }
    }
}

fun formatCurrency(amount: Long): String {
    return when {
        amount >= 10000000 -> String.format("%.2f Cr", amount / 10000000.0)
        amount >= 100000 -> String.format("%.2f L", amount / 100000.0)
        amount >= 1000 -> String.format("%.1f K", amount / 1000.0)
        else -> amount.toString()
    }
}
