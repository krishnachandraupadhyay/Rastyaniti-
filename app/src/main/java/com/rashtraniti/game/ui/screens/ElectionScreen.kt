package com.rashtraniti.game.ui.screens

import androidx.compose.animation.AnimatedVisibility
import androidx.compose.animation.fadeIn
import androidx.compose.animation.slideInVertically
import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.Celebration
import androidx.compose.material.icons.filled.HowToVote
import androidx.compose.material.icons.filled.Security
import androidx.compose.material3.*
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.rashtraniti.game.ui.theme.*
import com.rashtraniti.game.viewmodel.GameUiState

@Composable
fun ElectionScreen(
    state: GameUiState,
    onStartVoteCount: () -> Unit
) {
    LazyColumn(
        modifier = Modifier
            .fillMaxSize()
            .background(DeepNavyBg)
            .padding(14.dp)
    ) {
        item {
            Text(
                text = "भारत निर्वाचन आयोग (Election Commission)",
                color = TextPrimary,
                fontSize = 18.sp,
                fontWeight = FontWeight.Bold
            )
            Text(
                text = "पारदर्शी, निष्पक्ष एवं संवैधानिक मतदान प्रक्रिया",
                color = TextSecondary,
                fontSize = 12.sp
            )
            Spacer(modifier = Modifier.height(10.dp))
        }

        // Election Commission Rules Banner
        item {
            Card(
                colors = CardDefaults.cardColors(containerColor = CardNavy),
                shape = RoundedCornerShape(12.dp),
                border = androidx.compose.foundation.BorderStroke(1.dp, CardNavyBorder),
                modifier = Modifier
                    .fillMaxWidth()
                    .padding(bottom = 12.dp)
            ) {
                Column(modifier = Modifier.padding(12.dp)) {
                    Row(verticalAlignment = Alignment.CenterVertically) {
                        Icon(Icons.Default.Security, contentDescription = "Rules", tint = GoldAccent, modifier = Modifier.size(18.dp))
                        Spacer(modifier = Modifier.width(6.dp))
                        Text("आदर्श चुनाव आचार संहिता (Model Code of Conduct)", color = GoldAccent, fontSize = 12.sp, fontWeight = FontWeight.Bold)
                    }
                    Spacer(modifier = Modifier.height(6.dp))
                    Text(
                        text = "• निर्वाचन क्षेत्र व्यय सीमा: ₹95 लाख प्रति प्रत्याशी\n• धर्म/जाति पर आधारित प्रचार निषिद्ध\n• इलेक्ट्रॉनिक वोटिंग मशीन (EVM) व VVPAT से शत-प्रतिशत सत्यापन",
                        color = TextSecondary,
                        fontSize = 11.sp,
                        lineHeight = 16.sp
                    )
                }
            }
        }

        // Election Trigger / Polling Day Action
        item {
            Card(
                colors = CardDefaults.cardColors(containerColor = CardNavy),
                shape = RoundedCornerShape(12.dp),
                border = androidx.compose.foundation.BorderStroke(1.dp, SaffronPrimary.copy(alpha = 0.5f)),
                modifier = Modifier
                    .fillMaxWidth()
                    .padding(bottom = 14.dp)
            ) {
                Column(
                    modifier = Modifier.padding(14.dp),
                    horizontalAlignment = Alignment.CenterHorizontally
                ) {
                    Text(
                        text = if (state.electionCountdownDays == 0) "मतदान का दिन आ गया है!" else "चुनाव में ${state.electionCountdownDays} दिन शेष",
                        color = SaffronLight,
                        fontSize = 15.sp,
                        fontWeight = FontWeight.Bold
                    )
                    Spacer(modifier = Modifier.height(4.dp))
                    Text(
                        text = "जनविश्वास, पार्टी लोकप्रियता और चुनावी तैयारी के आधार पर परिणाम निर्धारित होंगे।",
                        color = TextSecondary,
                        fontSize = 11.sp,
                        textAlign = TextAlign.Center
                    )
                    Spacer(modifier = Modifier.height(12.dp))

                    Button(
                        onClick = onStartVoteCount,
                        enabled = !state.isElectionCountingInProgress,
                        modifier = Modifier
                            .fillMaxWidth()
                            .height(46.dp),
                        colors = ButtonDefaults.buttonColors(containerColor = IndianGreen),
                        shape = RoundedCornerShape(10.dp)
                    ) {
                        Icon(Icons.Default.HowToVote, contentDescription = "Count", tint = Color.White)
                        Spacer(modifier = Modifier.width(8.dp))
                        Text(
                            text = if (state.isElectionCountingInProgress) "मतगणना जारी है..." else "EVM मतगणना प्रारंभ करें",
                            color = Color.White,
                            fontSize = 14.sp,
                            fontWeight = FontWeight.Bold
                        )
                    }
                }
            }
        }

        // Animated Counting Loading
        if (state.isElectionCountingInProgress) {
            item {
                Card(
                    colors = CardDefaults.cardColors(containerColor = CardNavy),
                    shape = RoundedCornerShape(12.dp),
                    modifier = Modifier
                        .fillMaxWidth()
                        .padding(vertical = 12.dp)
                ) {
                    Column(
                        modifier = Modifier.padding(20.dp),
                        horizontalAlignment = Alignment.CenterHorizontally
                    ) {
                        CircularProgressIndicator(color = SaffronPrimary)
                        Spacer(modifier = Modifier.height(12.dp))
                        Text("EVM कंट्रोल यूनिट से वोटों की गणना जारी है...", color = TextPrimary, fontSize = 13.sp, fontWeight = FontWeight.Bold)
                        Text("राउंड 1 से राउंड 18 तक रुझान संकलित हो रहे हैं", color = TextSecondary, fontSize = 11.sp)
                    }
                }
            }
        }

        // Live Election Result Display
        state.latestElectionResult?.let { result ->
            item {
                Card(
                    colors = CardDefaults.cardColors(containerColor = CardNavy),
                    shape = RoundedCornerShape(14.dp),
                    border = androidx.compose.foundation.BorderStroke(
                        2.dp,
                        if (result.isVictory) EmeraldSuccess else CrimsonDanger
                    ),
                    modifier = Modifier
                        .fillMaxWidth()
                        .padding(vertical = 10.dp)
                ) {
                    Column(modifier = Modifier.padding(16.dp)) {
                        Row(
                            modifier = Modifier.fillMaxWidth(),
                            horizontalArrangement = Arrangement.SpaceBetween,
                            verticalAlignment = Alignment.CenterVertically
                        ) {
                            Text(
                                text = "निर्वाचन परिणाम: ${result.constituencyName}",
                                color = TextPrimary,
                                fontSize = 15.sp,
                                fontWeight = FontWeight.Bold
                            )
                            Box(
                                modifier = Modifier
                                    .clip(RoundedCornerShape(6.dp))
                                    .background(if (result.isVictory) EmeraldSuccess else CrimsonDanger)
                                    .padding(horizontal = 8.dp, vertical = 4.dp)
                            ) {
                                Text(
                                    text = if (result.isVictory) "विजयी (WIN)" else "पराजित (LOST)",
                                    color = Color.White,
                                    fontSize = 11.sp,
                                    fontWeight = FontWeight.Bold
                                )
                            }
                        }

                        Spacer(modifier = Modifier.height(10.dp))
                        Text("कुल मतदान (Turnout): ${String.format("%.1f", result.voterTurnoutPercent)}%", color = GoldAccent, fontSize = 12.sp)
                        Spacer(modifier = Modifier.height(10.dp))

                        // Player Party Vote Share
                        VoteShareBar(
                            partyName = "${state.party.name} (${state.party.shortName})",
                            votes = result.playerPartyVotes,
                            percent = result.playerPartyPct,
                            color = SaffronPrimary
                        )

                        Spacer(modifier = Modifier.height(6.dp))

                        // Opponent Vote Share
                        VoteShareBar(
                            partyName = "मुख्य विपक्षी दल",
                            votes = result.mainOpponentVotes,
                            percent = result.mainOpponentPct,
                            color = Color(0xFF2563EB)
                        )

                        Spacer(modifier = Modifier.height(6.dp))

                        // Others
                        VoteShareBar(
                            partyName = "अन्य / निर्दलीय",
                            votes = result.otherVotes,
                            percent = result.otherPct,
                            color = TextMuted
                        )

                        Spacer(modifier = Modifier.height(12.dp))
                        Text(
                            text = if (result.isVictory) "जीत का अंतर: ${result.winningMargin} मतों से ऐतिहासिक विजय!"
                            else "हार का अंतर: ${result.winningMargin} मतों से पीछे रहे।",
                            color = if (result.isVictory) EmeraldSuccess else CrimsonDanger,
                            fontSize = 12.sp,
                            fontWeight = FontWeight.Bold
                        )
                    }
                }
            }
        }

        item {
            Spacer(modifier = Modifier.height(20.dp))
        }
    }
}

@Composable
fun VoteShareBar(partyName: String, votes: Long, percent: Float, color: Color) {
    Column(modifier = Modifier.fillMaxWidth()) {
        Row(modifier = Modifier.fillMaxWidth(), horizontalArrangement = Arrangement.SpaceBetween) {
            Text(partyName, color = TextPrimary, fontSize = 11.sp, fontWeight = FontWeight.Medium)
            Text("${String.format("%.1f", percent)}% (${votes} मत)", color = TextSecondary, fontSize = 11.sp)
        }
        Spacer(modifier = Modifier.height(2.dp))
        LinearProgressIndicator(
            progress = { (percent / 100f).coerceIn(0f, 1f) },
            modifier = Modifier
                .fillMaxWidth()
                .height(6.dp)
                .clip(RoundedCornerShape(3.dp)),
            color = color,
            trackColor = DeepNavyBg
        )
    }
}
