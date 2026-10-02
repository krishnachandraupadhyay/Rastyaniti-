package com.rashtraniti.game.ui.screens

import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
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
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextOverflow
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.rashtraniti.game.data.model.PoliticalLevel
import com.rashtraniti.game.ui.components.formatCurrency
import com.rashtraniti.game.ui.theme.*
import com.rashtraniti.game.viewmodel.GameUiState
import com.rashtraniti.game.viewmodel.Screen

@Composable
fun HomeScreen(
    state: GameUiState,
    onNavigate: (Screen) -> Unit,
    onAdvanceDay: () -> Unit,
    onTriggerElection: () -> Unit
) {
    LazyColumn(
        modifier = Modifier
            .fillMaxSize()
            .background(DeepNavyBg)
            .padding(14.dp)
    ) {
        // Breaking News Flash Ticker
        item {
            Card(
                colors = CardDefaults.cardColors(containerColor = AshokaNavy),
                shape = RoundedCornerShape(8.dp),
                modifier = Modifier
                    .fillMaxWidth()
                    .padding(bottom = 12.dp)
            ) {
                Row(
                    modifier = Modifier.padding(horizontal = 10.dp, vertical = 6.dp),
                    verticalAlignment = Alignment.CenterVertically
                ) {
                    Box(
                        modifier = Modifier
                            .clip(RoundedCornerShape(4.dp))
                            .background(CrimsonDanger)
                            .padding(horizontal = 6.dp, vertical = 2.dp)
                    ) {
                        Text("ताज़ा समाचार", color = Color.White, fontSize = 10.sp, fontWeight = FontWeight.Bold)
                    }
                    Spacer(modifier = Modifier.width(8.dp))
                    Text(
                        text = "चुनाव आयोग ने आचार संहिता और चुनावी पर्यवेक्षकों की सूची जारी की। राजनैतिक दलों में हलचल!",
                        color = TextPrimary,
                        fontSize = 11.sp,
                        maxLines = 1,
                        overflow = TextOverflow.Ellipsis
                    )
                }
            }
        }

        // Leader & Party Profile Banner
        item {
            Card(
                colors = CardDefaults.cardColors(containerColor = CardNavy),
                shape = RoundedCornerShape(14.dp),
                border = androidx.compose.foundation.BorderStroke(1.dp, CardNavyBorder),
                modifier = Modifier.fillMaxWidth()
            ) {
                Column(modifier = Modifier.padding(14.dp)) {
                    Row(
                        modifier = Modifier.fillMaxWidth(),
                        horizontalArrangement = Arrangement.SpaceBetween,
                        verticalAlignment = Alignment.CenterVertically
                    ) {
                        Column {
                            Text(
                                text = state.player.name,
                                color = TextPrimary,
                                fontSize = 18.sp,
                                fontWeight = FontWeight.Bold
                            )
                            Text(
                                text = "${state.party.name} (${state.party.shortName}) • चिह्न: ${state.party.symbol}",
                                color = SaffronLight,
                                fontSize = 12.sp,
                                fontWeight = FontWeight.Medium
                            )
                        }

                        Box(
                            modifier = Modifier
                                .clip(RoundedCornerShape(8.dp))
                                .background(SaffronPrimary.copy(alpha = 0.2f))
                                .border(1.dp, SaffronPrimary, RoundedCornerShape(8.dp))
                                .padding(horizontal = 10.dp, vertical = 4.dp)
                        ) {
                            Text(
                                text = "स्तर ${state.currentLevel.levelNumber}: ${if (state.isHindiLanguage) state.currentLevel.titleHindi else state.currentLevel.titleEnglish}",
                                color = SaffronPrimary,
                                fontSize = 11.sp,
                                fontWeight = FontWeight.Bold
                            )
                        }
                    }

                    Spacer(modifier = Modifier.height(10.dp))

                    // Current Objective
                    Box(
                        modifier = Modifier
                            .fillMaxWidth()
                            .clip(RoundedCornerShape(8.dp))
                            .background(DeepNavyBg)
                            .padding(10.dp)
                    ) {
                        Column {
                            Text("वर्तमान राजनीतिक लक्ष्य (Objective):", color = GoldAccent, fontSize = 11.sp, fontWeight = FontWeight.SemiBold)
                            Spacer(modifier = Modifier.height(2.dp))
                            val objectiveText = when (state.currentLevel) {
                                PoliticalLevel.COMMON_CITIZEN -> "अपनी पार्टी का गठन करें और 2,000 सदस्यों को जोड़ें।"
                                PoliticalLevel.PARTY_FOUNDER -> "घर-घर संपर्क और जनसभाएं आयोजित कर चुनावी तैयारी 40%+ करें।"
                                PoliticalLevel.LOCAL_CANDIDATE -> "स्थानीय निर्वाचन क्षेत्र में प्रचार कर प्रथम चुनावी विजय हासिल करें।"
                                PoliticalLevel.ELECTED_REPRESENTATIVE -> "विकास कार्य कराएं और राज्य स्तर पर अपनी पार्टी का प्रभाव फैलाएं।"
                                PoliticalLevel.STATE_POLITICIAN, PoliticalLevel.STATE_ELECTION -> "विधानसभा चुनाव में पार्टी के लिए अधिकतम सीटें जीतें।"
                                PoliticalLevel.NATIONAL_POLITICIAN -> "संसद सदस्य (MP) बनने के लिए लोकसभा चुनाव लड़ें।"
                                PoliticalLevel.MEMBER_OF_PARLIAMENT -> "राष्ट्रीय स्तर पर 272+ सीटों का गठबंधन बनाएं और बहुमत सिद्ध करें।"
                                PoliticalLevel.GOVERNMENT_FORMATION -> "मंत्रिमंडल का गठन करें और सहयोगी दलों को संतुष्ट करें।"
                                PoliticalLevel.PRIME_MINISTER, PoliticalLevel.NATIONAL_GOVERNANCE -> "राष्ट्रीय अर्थव्यवस्था, जीडीपी, बजट और संकटों का सफल प्रबंधन करें।"
                                PoliticalLevel.NEXT_GENERAL_ELECTION -> "अगले आम चुनाव में पुनः जनता का विश्वास और पूर्ण बहुमत प्राप्त करें।"
                            }
                            Text(objectiveText, color = TextPrimary, fontSize = 12.sp, lineHeight = 16.sp)
                        }
                    }
                }
            }
        }

        // Key Metrics Grid
        item {
            Spacer(modifier = Modifier.height(14.dp))
            Row(modifier = Modifier.fillMaxWidth(), horizontalArrangement = Arrangement.spacedBy(8.dp)) {
                MetricMiniCard("पार्टी कोष", "₹${formatCurrency(state.party.funds)}", GoldAccent, Modifier.weight(1f))
                MetricMiniCard("जनविश्वास", "${state.player.stats.publicTrust}%", EmeraldSuccess, Modifier.weight(1f))
                MetricMiniCard("लोकप्रियता", "${state.party.overallPopularity}%", SaffronLight, Modifier.weight(1f))
            }
            Spacer(modifier = Modifier.height(8.dp))
            Row(modifier = Modifier.fillMaxWidth(), horizontalArrangement = Arrangement.spacedBy(8.dp)) {
                MetricMiniCard("कार्यकर्ता/दल", "${state.party.volunteersCount}", TextPrimary, Modifier.weight(1f))
                MetricMiniCard("चुनावी तैयारी", "${state.party.electionReadiness}%", SaffronPrimary, Modifier.weight(1f))
                MetricMiniCard("राष्ट्रीय सीटें", "${state.party.wonSeatsNational} / 543", GoldAccent, Modifier.weight(1f))
            }
        }

        // Quick Actions Section
        item {
            Spacer(modifier = Modifier.height(16.dp))
            Text("त्वरित राजनीतिक कार्यवाहियां (Quick Actions)", color = TextPrimary, fontSize = 14.sp, fontWeight = FontWeight.Bold)
            Spacer(modifier = Modifier.height(10.dp))

            Row(modifier = Modifier.fillMaxWidth(), horizontalArrangement = Arrangement.spacedBy(8.dp)) {
                ActionButton("अभियान चलाएं", Icons.Default.Campaign, SaffronPrimary, Modifier.weight(1f)) {
                    onNavigate(Screen.CAMPAIGN)
                }
                ActionButton("मानचित्र देखें", Icons.Default.Map, AshokaNavy, Modifier.weight(1f)) {
                    onNavigate(Screen.MAP)
                }
            }

            Spacer(modifier = Modifier.height(8.dp))

            Row(modifier = Modifier.fillMaxWidth(), horizontalArrangement = Arrangement.spacedBy(8.dp)) {
                ActionButton("मतदान / चुनाव", Icons.Default.HowToVote, IndianGreen, Modifier.weight(1f)) {
                    onTriggerElection()
                }
                ActionButton("संसद व सरकार", Icons.Default.AccountBalance, CardNavyBorder, Modifier.weight(1f)) {
                    if (state.currentLevel.levelNumber >= 8) {
                        onNavigate(Screen.CABINET)
                    } else {
                        onNavigate(Screen.PARLIAMENT)
                    }
                }
            }
        }

        // Demographic Support Breakdown
        item {
            Spacer(modifier = Modifier.height(18.dp))
            Card(
                colors = CardDefaults.cardColors(containerColor = CardNavy),
                shape = RoundedCornerShape(12.dp),
                border = androidx.compose.foundation.BorderStroke(1.dp, CardNavyBorder),
                modifier = Modifier.fillMaxWidth()
            ) {
                Column(modifier = Modifier.padding(14.dp)) {
                    Text("सामाजिक वर्गों में समर्थन (Demographic Support)", color = GoldAccent, fontSize = 13.sp, fontWeight = FontWeight.Bold)
                    Spacer(modifier = Modifier.height(8.dp))

                    DemographicBar("युवा वर्ग (Youth)", state.party.demographicSupport.youth, SaffronPrimary)
                    DemographicBar("ग्रामीण मतदाता (Rural)", state.party.demographicSupport.rural, IndianGreen)
                    DemographicBar("शहरी नागरिक (Urban)", state.party.demographicSupport.urban, Color(0xFF2563EB))
                    DemographicBar("किसान व कृषि (Farmers)", state.party.demographicSupport.farmers, EmeraldSuccess)
                    DemographicBar("श्रमिक व कर्मचारी (Workers)", state.party.demographicSupport.workers, GoldAccent)
                }
            }
            Spacer(modifier = Modifier.height(20.dp))
        }
    }
}

@Composable
fun MetricMiniCard(label: String, value: String, valueColor: Color, modifier: Modifier = Modifier) {
    Card(
        colors = CardDefaults.cardColors(containerColor = CardNavy),
        shape = RoundedCornerShape(10.dp),
        border = androidx.compose.foundation.BorderStroke(1.dp, CardNavyBorder),
        modifier = modifier
    ) {
        Column(
            modifier = Modifier.padding(8.dp),
            horizontalAlignment = Alignment.CenterHorizontally
        ) {
            Text(label, color = TextSecondary, fontSize = 10.sp, maxLines = 1)
            Spacer(modifier = Modifier.height(2.dp))
            Text(value, color = valueColor, fontSize = 14.sp, fontWeight = FontWeight.Bold)
        }
    }
}

@Composable
fun ActionButton(
    title: String,
    icon: androidx.compose.ui.graphics.vector.ImageVector,
    bgColor: Color,
    modifier: Modifier = Modifier,
    onClick: () -> Unit
) {
    Button(
        onClick = onClick,
        modifier = modifier.height(44.dp),
        colors = ButtonDefaults.buttonColors(containerColor = bgColor),
        shape = RoundedCornerShape(10.dp),
        contentPadding = PaddingValues(horizontal = 8.dp)
    ) {
        Icon(icon, contentDescription = title, modifier = Modifier.size(16.dp), tint = Color.White)
        Spacer(modifier = Modifier.width(6.dp))
        Text(title, color = Color.White, fontSize = 12.sp, fontWeight = FontWeight.Bold)
    }
}

@Composable
fun DemographicBar(label: String, percent: Int, barColor: Color) {
    Column(modifier = Modifier.padding(vertical = 3.dp)) {
        Row(modifier = Modifier.fillMaxWidth(), horizontalArrangement = Arrangement.SpaceBetween) {
            Text(label, color = TextSecondary, fontSize = 11.sp)
            Text("$percent%", color = TextPrimary, fontSize = 11.sp, fontWeight = FontWeight.Bold)
        }
        Spacer(modifier = Modifier.height(2.dp))
        LinearProgressIndicator(
            progress = { (percent / 100f).coerceIn(0f, 1f) },
            modifier = Modifier
                .fillMaxWidth()
                .height(6.dp)
                .clip(RoundedCornerShape(3.dp)),
            color = barColor,
            trackColor = DeepNavyBg
        )
    }
}
