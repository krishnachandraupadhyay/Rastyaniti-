package com.rashtraniti.game.ui.screens

import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.Mic
import androidx.compose.material.icons.filled.Newspaper
import androidx.compose.material.icons.filled.Tv
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
fun MediaScreen(
    state: GameUiState
) {
    LazyColumn(
        modifier = Modifier
            .fillMaxSize()
            .background(DeepNavyBg)
            .padding(14.dp)
    ) {
        item {
            Text(
                text = "मीडिया कक्ष एवं राष्ट्रीय परिचर्चा (Media Room)",
                color = TextPrimary,
                fontSize = 18.sp,
                fontWeight = FontWeight.Bold
            )
            Text(
                text = "प्रेस वार्ता, टीवी डिबेट्स एवं जनसंचार प्रबंधन",
                color = TextSecondary,
                fontSize = 12.sp
            )
            Spacer(modifier = Modifier.height(10.dp))
        }

        // Media Attention Gauge
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
                    Row(
                        modifier = Modifier.fillMaxWidth(),
                        horizontalArrangement = Arrangement.SpaceBetween
                    ) {
                        Text("राष्ट्रीय मीडिया का ध्यान (Media Attention)", color = GoldAccent, fontSize = 12.sp, fontWeight = FontWeight.Bold)
                        Text("${state.party.mediaAttention}%", color = SaffronLight, fontSize = 12.sp, fontWeight = FontWeight.Bold)
                    }
                    Spacer(modifier = Modifier.height(4.dp))
                    LinearProgressIndicator(
                        progress = { (state.party.mediaAttention / 100f).coerceIn(0f, 1f) },
                        modifier = Modifier
                            .fillMaxWidth()
                            .height(6.dp)
                            .clip(RoundedCornerShape(3.dp)),
                        color = SaffronPrimary,
                        trackColor = DeepNavyBg
                    )
                }
            }
        }

        // Channels Reach Breakdown
        item {
            Text("प्रमुख मीडिया माध्यम एवं पहुंच", color = TextPrimary, fontSize = 13.sp, fontWeight = FontWeight.Bold)
            Spacer(modifier = Modifier.height(8.dp))

            val channels = listOf(
                Triple("राष्ट्रीय टीवी समाचार (TV News)", "पहुंच: 4.5 करोड़ दर्शक • तीखी बहस", Icons.Default.Tv),
                Triple("दैनिक समाचार पत्र (Print Media)", "पहुंच: 2.8 करोड़ पाठक • नीतिगत विश्लेषण", Icons.Default.Newspaper),
                Triple("डिजिटल व सोशल मीडिया (Digital/Social)", "पहुंच: 7.2 करोड़ युवा • त्वरित रुझान", Icons.Default.Mic)
            )

            channels.forEach { (name, reach, icon) ->
                Card(
                    colors = CardDefaults.cardColors(containerColor = CardNavy),
                    shape = RoundedCornerShape(10.dp),
                    border = androidx.compose.foundation.BorderStroke(1.dp, CardNavyBorder),
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
                        Box(
                            modifier = Modifier
                                .size(36.dp)
                                .clip(RoundedCornerShape(8.dp))
                                .background(DeepNavyBg),
                            contentAlignment = Alignment.Center
                        ) {
                            Icon(icon, contentDescription = name, tint = SaffronPrimary, modifier = Modifier.size(20.dp))
                        }
                        Spacer(modifier = Modifier.width(12.dp))
                        Column {
                            Text(name, color = TextPrimary, fontSize = 13.sp, fontWeight = FontWeight.Bold)
                            Text(reach, color = TextSecondary, fontSize = 11.sp)
                        }
                    }
                }
            }
        }

        // Live News Feed / Recent Political Headlines
        item {
            Spacer(modifier = Modifier.height(16.dp))
            Text("हालिया मीडिया हेडलाइंस (Headlines)", color = GoldAccent, fontSize = 13.sp, fontWeight = FontWeight.Bold)
            Spacer(modifier = Modifier.height(8.dp))

            val headlines = listOf(
                "विशेष साक्षात्कार: '${state.party.name}' के अध्यक्ष ने बताया पार्टी का आर्थिक विजन।",
                "प्राइम टाइम परिचर्चा: क्या नए दल पारंपरिक राजनीतिक समीकरण बदल पाएंगे?",
                "संपादकीय: जमीनी जनसंपर्क और डिजिटल कैम्पेन का बढ़ता प्रभाव।"
            )

            headlines.forEach { hl ->
                Card(
                    colors = CardDefaults.cardColors(containerColor = CardNavy),
                    shape = RoundedCornerShape(8.dp),
                    border = androidx.compose.foundation.BorderStroke(1.dp, CardNavyBorder),
                    modifier = Modifier
                        .fillMaxWidth()
                        .padding(vertical = 4.dp)
                ) {
                    Text(
                        text = "• $hl",
                        color = TextPrimary,
                        fontSize = 12.sp,
                        lineHeight = 16.sp,
                        modifier = Modifier.padding(10.dp)
                    )
                }
            }
            Spacer(modifier = Modifier.height(24.dp))
        }
    }
}
