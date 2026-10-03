package com.rashtraniti.game.ui.screens

import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.*
import androidx.compose.material3.*
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.rashtraniti.game.data.model.CampaignActionType
import com.rashtraniti.game.ui.components.formatCurrency
import com.rashtraniti.game.ui.theme.*
import com.rashtraniti.game.viewmodel.GameUiState

@Composable
fun CampaignScreen(
    state: GameUiState,
    onExecuteAction: (CampaignActionType) -> Unit
) {
    LazyColumn(
        modifier = Modifier
            .fillMaxSize()
            .background(DeepNavyBg)
            .padding(14.dp)
    ) {
        item {
            Text(
                text = "चुनावी अभियान केंद्र (Campaign Center)",
                color = TextPrimary,
                fontSize = 18.sp,
                fontWeight = FontWeight.Bold
            )
            Text(
                text = "रणनीति, जनसंपर्क एवं मीडिया प्रबंधन से जनविश्वास अर्जित करें",
                color = TextSecondary,
                fontSize = 12.sp
            )
            Spacer(modifier = Modifier.height(10.dp))
        }

        // Live Resource Status Card
        item {
            Card(
                colors = CardDefaults.cardColors(containerColor = CardNavy),
                shape = RoundedCornerShape(12.dp),
                border = androidx.compose.foundation.BorderStroke(1.dp, CardNavyBorder),
                modifier = Modifier
                    .fillMaxWidth()
                    .padding(bottom = 14.dp)
            ) {
                Row(
                    modifier = Modifier
                        .fillMaxWidth()
                        .padding(12.dp),
                    horizontalArrangement = Arrangement.SpaceAround
                ) {
                    Column(horizontalAlignment = Alignment.CenterHorizontally) {
                        Text("उपलब्ध कोष", color = TextSecondary, fontSize = 11.sp)
                        Text("₹${formatCurrency(state.party.funds)}", color = GoldAccent, fontSize = 13.sp, fontWeight = FontWeight.Bold)
                    }
                    Column(horizontalAlignment = Alignment.CenterHorizontally) {
                        Text("ऊर्जा", color = TextSecondary, fontSize = 11.sp)
                        Text("${state.player.energy}%", color = SaffronLight, fontSize = 13.sp, fontWeight = FontWeight.Bold)
                    }
                    Column(horizontalAlignment = Alignment.CenterHorizontally) {
                        Text("चुनाव में शेष", color = TextSecondary, fontSize = 11.sp)
                        Text("${state.electionCountdownDays} दिन", color = EmeraldSuccess, fontSize = 13.sp, fontWeight = FontWeight.Bold)
                    }
                    Column(horizontalAlignment = Alignment.CenterHorizontally) {
                        Text("चुनावी तैयारी", color = TextSecondary, fontSize = 11.sp)
                        Text("${state.party.electionReadiness}%", color = SaffronPrimary, fontSize = 13.sp, fontWeight = FontWeight.Bold)
                    }
                }
            }
        }

        // 10 Campaign Options
        item {
            Text(
                text = "उपलब्ध अभियान रणनीतियां (10 Campaign Modes)",
                color = GoldAccent,
                fontSize = 13.sp,
                fontWeight = FontWeight.Bold
            )
            Spacer(modifier = Modifier.height(8.dp))
        }

        items(CampaignActionType.entries.size) { idx ->
            val action = CampaignActionType.entries[idx]
            val canAfford = state.party.funds >= action.baseCostMoney && state.player.energy >= action.baseCostEnergy

            Card(
                colors = CardDefaults.cardColors(containerColor = CardNavy),
                shape = RoundedCornerShape(12.dp),
                border = androidx.compose.foundation.BorderStroke(
                    1.dp,
                    if (canAfford) CardNavyBorder else CrimsonDanger.copy(alpha = 0.5f)
                ),
                modifier = Modifier
                    .fillMaxWidth()
                    .padding(vertical = 5.dp)
            ) {
                Column(modifier = Modifier.padding(12.dp)) {
                    Row(
                        modifier = Modifier.fillMaxWidth(),
                        horizontalArrangement = Arrangement.SpaceBetween,
                        verticalAlignment = Alignment.CenterVertically
                    ) {
                        Row(verticalAlignment = Alignment.CenterVertically) {
                            Box(
                                modifier = Modifier
                                    .size(32.dp)
                                    .clip(RoundedCornerShape(8.dp))
                                    .background(SaffronPrimary.copy(alpha = 0.2f)),
                                contentAlignment = Alignment.Center
                            ) {
                                Icon(
                                    imageVector = when (action) {
                                        CampaignActionType.DOOR_TO_DOOR -> Icons.Default.DirectionsWalk
                                        CampaignActionType.PUBLIC_MEETING -> Icons.Default.Groups
                                        CampaignActionType.RALLY -> Icons.Default.Campaign
                                        CampaignActionType.TOWN_HALL -> Icons.Default.RecordVoiceOver
                                        CampaignActionType.DEBATE -> Icons.Default.QuestionAnswer
                                        CampaignActionType.MANIFESTO_RELEASE -> Icons.Default.MenuBook
                                        CampaignActionType.DIGITAL_CAMPAIGN -> Icons.Default.PhonelinkRing
                                        CampaignActionType.MEDIA_CAMPAIGN -> Icons.Default.Tv
                                        CampaignActionType.VOLUNTEER_DRIVE -> Icons.Default.PersonAdd
                                        CampaignActionType.COMMUNITY_OUTREACH -> Icons.Default.Handshake
                                    },
                                    contentDescription = action.titleHindi,
                                    tint = SaffronPrimary,
                                    modifier = Modifier.size(18.dp)
                                )
                            }
                            Spacer(modifier = Modifier.width(10.dp))
                            Column {
                                Text(
                                    text = if (state.isHindiLanguage) action.titleHindi else action.titleEnglish,
                                    color = TextPrimary,
                                    fontSize = 14.sp,
                                    fontWeight = FontWeight.Bold
                                )
                                Text(
                                    text = "लागत: ₹${action.baseCostMoney} • ऊर्जा: ${action.baseCostEnergy}% • समय: ${action.baseCostTimeDays} दिन",
                                    color = GoldAccent,
                                    fontSize = 11.sp
                                )
                            }
                        }

                        Button(
                            onClick = { onExecuteAction(action) },
                            enabled = canAfford,
                            colors = ButtonDefaults.buttonColors(
                                containerColor = SaffronPrimary,
                                disabledContainerColor = CardNavyBorder
                            ),
                            shape = RoundedCornerShape(8.dp),
                            contentPadding = PaddingValues(horizontal = 12.dp, vertical = 6.dp)
                        ) {
                            Text(
                                text = if (canAfford) "आयोजित करें" else "संसाधन कम",
                                fontSize = 11.sp,
                                fontWeight = FontWeight.Bold,
                                color = if (canAfford) Color.White else TextMuted
                            )
                        }
                    }

                    Spacer(modifier = Modifier.height(8.dp))
                    Text(
                        text = action.description,
                        color = TextSecondary,
                        fontSize = 11.sp,
                        lineHeight = 16.sp
                    )
                }
            }
        }

        item {
            Spacer(modifier = Modifier.height(24.dp))
        }
    }
}
