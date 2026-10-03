package com.rashtraniti.game.ui.screens

import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.AccountBalance
import androidx.compose.material.icons.filled.Paid
import androidx.compose.material.icons.filled.Shield
import androidx.compose.material.icons.filled.Speed
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.rashtraniti.game.data.model.CabinetMinister
import com.rashtraniti.game.ui.theme.*
import com.rashtraniti.game.viewmodel.GameUiState

@Composable
fun CabinetScreen(
    state: GameUiState,
    onOpenBudget: () -> Unit
) {
    var selectedTab by remember { mutableIntStateOf(0) } // 0: Cabinet, 1: PM Metrics

    LazyColumn(
        modifier = Modifier
            .fillMaxSize()
            .background(DeepNavyBg)
            .padding(14.dp)
    ) {
        item {
            Text(
                text = "केंद्रीय मंत्रिमंडल एवं शासन (Cabinet & Governance)",
                color = TextPrimary,
                fontSize = 18.sp,
                fontWeight = FontWeight.Bold
            )
            Text(
                text = "राष्ट्रीय मंत्रालयों का आवंटन एवं नीतिगत प्रदर्शन",
                color = TextSecondary,
                fontSize = 12.sp
            )
            Spacer(modifier = Modifier.height(10.dp))
        }

        // Mode switch tabs
        item {
            Row(
                modifier = Modifier
                    .fillMaxWidth()
                    .clip(RoundedCornerShape(8.dp))
                    .background(CardNavy)
                    .padding(3.dp)
            ) {
                Box(
                    modifier = Modifier
                        .weight(1f)
                        .clip(RoundedCornerShape(6.dp))
                        .background(if (selectedTab == 0) SaffronPrimary else Color.Transparent)
                        .clickable { selectedTab = 0 }
                        .padding(vertical = 8.dp),
                    contentAlignment = Alignment.Center
                ) {
                    Text("मंत्रिमंडल (Ministers)", color = if (selectedTab == 0) Color.White else TextSecondary, fontSize = 12.sp, fontWeight = FontWeight.Bold)
                }
                Box(
                    modifier = Modifier
                        .weight(1f)
                        .clip(RoundedCornerShape(6.dp))
                        .background(if (selectedTab == 1) SaffronPrimary else Color.Transparent)
                        .clickable { selectedTab = 1 }
                        .padding(vertical = 8.dp),
                    contentAlignment = Alignment.Center
                ) {
                    Text("PM डैशबोर्ड (National Stats)", color = if (selectedTab == 1) Color.White else TextSecondary, fontSize = 12.sp, fontWeight = FontWeight.Bold)
                }
            }
            Spacer(modifier = Modifier.height(14.dp))
        }

        if (selectedTab == 0) {
            // Cabinet Ministers list
            item {
                Row(
                    modifier = Modifier.fillMaxWidth(),
                    horizontalArrangement = Arrangement.SpaceBetween,
                    verticalAlignment = Alignment.CenterVertically
                ) {
                    Text("प्रमुख केंद्रीय मंत्री (8 Portfolios)", color = GoldAccent, fontSize = 13.sp, fontWeight = FontWeight.Bold)
                    Button(
                        onClick = onOpenBudget,
                        colors = ButtonDefaults.buttonColors(containerColor = IndianGreen),
                        shape = RoundedCornerShape(8.dp),
                        contentPadding = PaddingValues(horizontal = 10.dp, vertical = 4.dp),
                        modifier = Modifier.height(32.dp)
                    ) {
                        Text("वार्षिक बजट देखें", color = Color.White, fontSize = 11.sp, fontWeight = FontWeight.Bold)
                    }
                }
                Spacer(modifier = Modifier.height(8.dp))
            }

            items(state.activeMinisters.size) { idx ->
                val minister = state.activeMinisters[idx]
                Card(
                    colors = CardDefaults.cardColors(containerColor = CardNavy),
                    shape = RoundedCornerShape(10.dp),
                    border = androidx.compose.foundation.BorderStroke(1.dp, CardNavyBorder),
                    modifier = Modifier
                        .fillMaxWidth()
                        .padding(vertical = 4.dp)
                ) {
                    Column(modifier = Modifier.padding(12.dp)) {
                        Row(
                            modifier = Modifier.fillMaxWidth(),
                            horizontalArrangement = Arrangement.SpaceBetween
                        ) {
                            Column {
                                Text(minister.name, color = TextPrimary, fontSize = 13.sp, fontWeight = FontWeight.Bold)
                                Text(minister.portfolio, color = SaffronLight, fontSize = 11.sp)
                            }
                            Box(
                                modifier = Modifier
                                    .clip(RoundedCornerShape(6.dp))
                                    .background(DeepNavyBg)
                                    .padding(horizontal = 6.dp, vertical = 2.dp)
                            ) {
                                Text("दक्षता: ${minister.competence}%", color = EmeraldSuccess, fontSize = 11.sp, fontWeight = FontWeight.Bold)
                            }
                        }

                        Spacer(modifier = Modifier.height(8.dp))
                        Row(
                            modifier = Modifier.fillMaxWidth(),
                            horizontalArrangement = Arrangement.SpaceBetween
                        ) {
                            Text("निष्ठा: ${minister.loyalty}%", color = TextSecondary, fontSize = 11.sp)
                            Text("जनप्रियता: ${minister.popularity}%", color = TextSecondary, fontSize = 11.sp)
                            Text("भ्रष्टाचार जोखिम: ${minister.corruptionRisk}%", color = if (minister.corruptionRisk > 15) CrimsonDanger else TextSecondary, fontSize = 11.sp)
                        }
                    }
                }
            }
        } else {
            // PM Dashboard Mode (National Economic & Social Metrics)
            item {
                Text("राष्ट्रीय प्रदर्शन संकेतक (National PM Dashboard)", color = GoldAccent, fontSize = 13.sp, fontWeight = FontWeight.Bold)
                Spacer(modifier = Modifier.height(8.dp))

                Row(modifier = Modifier.fillMaxWidth(), horizontalArrangement = Arrangement.spacedBy(8.dp)) {
                    NationalStatCard("GDP विकास दर", "${state.nationalMetrics.gdpGrowthRate}%", EmeraldSuccess, Modifier.weight(1f))
                    NationalStatCard("मुद्रास्फीति (Inflation)", "${state.nationalMetrics.inflationRate}%", SaffronLight, Modifier.weight(1f))
                }
                Spacer(modifier = Modifier.height(8.dp))
                Row(modifier = Modifier.fillMaxWidth(), horizontalArrangement = Arrangement.spacedBy(8.dp)) {
                    NationalStatCard("बेरोजगारी दर", "${state.nationalMetrics.unemploymentRate}%", CrimsonDanger, Modifier.weight(1f))
                    NationalStatCard("सरकार अनुमोदन (Approval)", "${state.nationalMetrics.governmentApproval}%", GoldAccent, Modifier.weight(1f))
                }
                Spacer(modifier = Modifier.height(8.dp))
                Row(modifier = Modifier.fillMaxWidth(), horizontalArrangement = Arrangement.spacedBy(8.dp)) {
                    NationalStatCard("जन संतुष्टि", "${state.nationalMetrics.publicSatisfaction}%", EmeraldSuccess, Modifier.weight(1f))
                    NationalStatCard("राष्ट्रीय ऋण (Debt)", "${state.nationalMetrics.nationalDebtPercentGdp}% GDP", TextSecondary, Modifier.weight(1f))
                }

                Spacer(modifier = Modifier.height(14.dp))
                Card(
                    colors = CardDefaults.cardColors(containerColor = CardNavy),
                    shape = RoundedCornerShape(12.dp),
                    border = androidx.compose.foundation.BorderStroke(1.dp, CardNavyBorder),
                    modifier = Modifier.fillMaxWidth()
                ) {
                    Column(modifier = Modifier.padding(14.dp)) {
                        Text("क्षेत्रवार विकास स्कोर (Sectoral Indexes)", color = TextPrimary, fontSize = 13.sp, fontWeight = FontWeight.Bold)
                        Spacer(modifier = Modifier.height(6.dp))
                        DemographicBar("बुनियादी ढांचा (Infrastructure)", state.nationalMetrics.infrastructureScore, SaffronPrimary)
                        DemographicBar("शिक्षा सूचकांक (Education)", state.nationalMetrics.educationIndex, Color(0xFF2563EB))
                        DemographicBar("स्वास्थ्य सूचकांक (Healthcare)", state.nationalMetrics.healthcareIndex, EmeraldSuccess)
                        DemographicBar("तकनीक व नवाचार (Technology)", state.nationalMetrics.technologyIndex, GoldAccent)
                        DemographicBar("कृषि उत्पादकता (Agriculture)", state.nationalMetrics.agricultureIndex, IndianGreen)
                        DemographicBar("पर्यावरण गुणवत्ता (Environment)", state.nationalMetrics.environmentScore, Color(0xFF0D9488))
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
fun NationalStatCard(label: String, value: String, valueColor: Color, modifier: Modifier = Modifier) {
    Card(
        colors = CardDefaults.cardColors(containerColor = CardNavy),
        shape = RoundedCornerShape(10.dp),
        border = androidx.compose.foundation.BorderStroke(1.dp, CardNavyBorder),
        modifier = modifier
    ) {
        Column(modifier = Modifier.padding(12.dp)) {
            Text(label, color = TextSecondary, fontSize = 11.sp)
            Spacer(modifier = Modifier.height(4.dp))
            Text(value, color = valueColor, fontSize = 16.sp, fontWeight = FontWeight.Bold)
        }
    }
}
