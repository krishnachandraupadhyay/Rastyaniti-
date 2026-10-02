package com.rashtraniti.game.ui.screens

import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.CheckCircle
import androidx.compose.material.icons.filled.Lock
import androidx.compose.material.icons.filled.Save
import androidx.compose.material.icons.filled.Translate
import androidx.compose.material3.*
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.rashtraniti.game.ui.theme.*
import com.rashtraniti.game.viewmodel.GameUiState

@Composable
fun ProfileAchievementsScreen(
    state: GameUiState,
    onSaveGame: () -> Unit,
    onToggleLanguage: () -> Unit
) {
    LazyColumn(
        modifier = Modifier
            .fillMaxSize()
            .background(DeepNavyBg)
            .padding(14.dp)
    ) {
        item {
            Text(
                text = "प्रोफ़ाइल एवं उपलब्धियां (Profile & Achievements)",
                color = TextPrimary,
                fontSize = 18.sp,
                fontWeight = FontWeight.Bold
            )
            Text(
                text = "खिलाड़ी आंकड़े, प्रगति सहेजें एवं भाषा चयन",
                color = TextSecondary,
                fontSize = 12.sp
            )
            Spacer(modifier = Modifier.height(10.dp))
        }

        // Leader Detailed Stats Card
        item {
            Card(
                colors = CardDefaults.cardColors(containerColor = CardNavy),
                shape = RoundedCornerShape(12.dp),
                border = androidx.compose.foundation.BorderStroke(1.dp, CardNavyBorder),
                modifier = Modifier
                    .fillMaxWidth()
                    .padding(bottom = 12.dp)
            ) {
                Column(modifier = Modifier.padding(14.dp)) {
                    Text(state.player.name, color = TextPrimary, fontSize = 16.sp, fontWeight = FontWeight.Bold)
                    Text("${state.player.education} • ${state.player.occupation}", color = SaffronLight, fontSize = 12.sp)
                    Spacer(modifier = Modifier.height(10.dp))

                    Row(modifier = Modifier.fillMaxWidth(), horizontalArrangement = Arrangement.SpaceBetween) {
                        Text("नेतृत्व (Leadership): ${state.player.stats.leadership}", color = TextSecondary, fontSize = 11.sp)
                        Text("संवाद (Communication): ${state.player.stats.communication}", color = TextSecondary, fontSize = 11.sp)
                    }
                    Spacer(modifier = Modifier.height(4.dp))
                    Row(modifier = Modifier.fillMaxWidth(), horizontalArrangement = Arrangement.SpaceBetween) {
                        Text("प्रशासन (Administration): ${state.player.stats.administration}", color = TextSecondary, fontSize = 11.sp)
                        Text("संकट प्रबंधन (Crisis): ${state.player.stats.crisisManagement}", color = TextSecondary, fontSize = 11.sp)
                    }
                    Spacer(modifier = Modifier.height(4.dp))
                    Row(modifier = Modifier.fillMaxWidth(), horizontalArrangement = Arrangement.SpaceBetween) {
                        Text("रणनीति (Strategy): ${state.player.stats.strategy}", color = TextSecondary, fontSize = 11.sp)
                        Text("वित्तीय समझ (Finance): ${state.player.stats.finance}", color = TextSecondary, fontSize = 11.sp)
                    }
                }
            }
        }

        // Save & Language Settings
        item {
            Row(modifier = Modifier.fillMaxWidth(), horizontalArrangement = Arrangement.spacedBy(8.dp)) {
                Button(
                    onClick = onSaveGame,
                    modifier = Modifier.weight(1f).height(44.dp),
                    colors = ButtonDefaults.buttonColors(containerColor = IndianGreen),
                    shape = RoundedCornerShape(10.dp)
                ) {
                    Icon(Icons.Default.Save, contentDescription = "Save", tint = Color.White, modifier = Modifier.size(16.dp))
                    Spacer(modifier = Modifier.width(6.dp))
                    Text("प्रगति सहेजें (Save)", fontSize = 12.sp)
                }

                Button(
                    onClick = onToggleLanguage,
                    modifier = Modifier.weight(1f).height(44.dp),
                    colors = ButtonDefaults.buttonColors(containerColor = AshokaNavy),
                    shape = RoundedCornerShape(10.dp)
                ) {
                    Icon(Icons.Default.Translate, contentDescription = "Language", tint = Color.White, modifier = Modifier.size(16.dp))
                    Spacer(modifier = Modifier.width(6.dp))
                    Text(if (state.isHindiLanguage) "Switch to English" else "हिन्दी में बदलें", fontSize = 11.sp)
                }
            }
            Spacer(modifier = Modifier.height(16.dp))
        }

        // Achievements List
        item {
            Text("राजनीतिक कीर्तिमान (Achievements)", color = GoldAccent, fontSize = 13.sp, fontWeight = FontWeight.Bold)
            Spacer(modifier = Modifier.height(8.dp))
        }

        items(state.achievements.size) { idx ->
            val ach = state.achievements[idx]
            Card(
                colors = CardDefaults.cardColors(
                    containerColor = if (ach.isUnlocked) CardNavy else DeepNavyBg
                ),
                shape = RoundedCornerShape(10.dp),
                border = androidx.compose.foundation.BorderStroke(
                    1.dp,
                    if (ach.isUnlocked) EmeraldSuccess else CardNavyBorder
                ),
                modifier = Modifier
                    .fillMaxWidth()
                    .padding(vertical = 4.dp)
            ) {
                Row(
                    modifier = Modifier
                        .fillMaxWidth()
                        .padding(12.dp),
                    verticalAlignment = Alignment.CenterVertically
                ) {
                    Icon(
                        imageVector = if (ach.isUnlocked) Icons.Default.CheckCircle else Icons.Default.Lock,
                        contentDescription = "Status",
                        tint = if (ach.isUnlocked) EmeraldSuccess else TextMuted,
                        modifier = Modifier.size(24.dp)
                    )
                    Spacer(modifier = Modifier.width(12.dp))
                    Column {
                        Text(
                            text = if (state.isHindiLanguage) ach.titleHindi else ach.titleEnglish,
                            color = if (ach.isUnlocked) TextPrimary else TextMuted,
                            fontSize = 13.sp,
                            fontWeight = FontWeight.Bold
                        )
                        Spacer(modifier = Modifier.height(2.dp))
                        Text(
                            text = ach.descriptionHindi,
                            color = if (ach.isUnlocked) TextSecondary else TextMuted,
                            fontSize = 11.sp
                        )
                    }
                }
            }
        }

        item {
            Spacer(modifier = Modifier.height(24.dp))
        }
    }
}
