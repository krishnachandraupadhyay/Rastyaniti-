package com.rashtraniti.game.ui.screens

import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.Group
import androidx.compose.material.icons.filled.Leaderboard
import androidx.compose.material.icons.filled.Security
import androidx.compose.material.icons.filled.Shield
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
fun MultiplayerScreen(
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
                text = "मल्टीप्लेयर राजनीतिक रणभूमि (Multiplayer Arena)",
                color = TextPrimary,
                fontSize = 18.sp,
                fontWeight = FontWeight.Bold
            )
            Text(
                text = "काल्पनिक दलों की ऑनलाइन चुनावी प्रतिस्पर्धा व गठबंधन",
                color = TextSecondary,
                fontSize = 12.sp
            )
            Spacer(modifier = Modifier.height(10.dp))
        }

        // Fair-play & Non-Real-Money Safety Notice (Requirement #27)
        item {
            Card(
                colors = CardDefaults.cardColors(containerColor = CardNavy),
                shape = RoundedCornerShape(12.dp),
                border = androidx.compose.foundation.BorderStroke(1.dp, IndianGreen.copy(alpha = 0.6f)),
                modifier = Modifier
                    .fillMaxWidth()
                    .padding(bottom = 14.dp)
            ) {
                Row(
                    modifier = Modifier.padding(12.dp),
                    verticalAlignment = Alignment.CenterVertically
                ) {
                    Icon(Icons.Default.Security, contentDescription = "Fair play", tint = EmeraldSuccess, modifier = Modifier.size(24.dp))
                    Spacer(modifier = Modifier.width(10.dp))
                    Column {
                        Text("संवैधानिक निष्पक्षता एवं मर्यादा (Fair-Play Policy)", color = EmeraldSuccess, fontSize = 12.sp, fontWeight = FontWeight.Bold)
                        Spacer(modifier = Modifier.height(2.dp))
                        Text(
                            text = "यह पूर्णतः काल्पनिक राजनीतिक सिमुलेशन है। वास्तविक धन, दुर्भावनापूर्ण आचरण या वास्तविक राजनैतिक प्रचार वर्जित है।",
                            color = TextSecondary,
                            fontSize = 11.sp,
                            lineHeight = 15.sp
                        )
                    }
                }
            }
        }

        // 6 Multiplayer Modes
        item {
            Text("प्रतिस्पर्धी मल्टीप्लेयर मोड्स (Game Modes)", color = GoldAccent, fontSize = 13.sp, fontWeight = FontWeight.Bold)
            Spacer(modifier = Modifier.height(8.dp))

            val modes = listOf(
                Pair("1. बहुदलीय आम चुनाव (Multiplayer Election)", "4 से 8 काल्पनिक खिलाड़ी दलों के बीच लोकसभा चुनाव का सीधा मुकाबला।"),
                Pair("2. दल बनाम दल द्वंद्व (Party vs Party)", "दो प्रतिद्वंद्वी दलों के बीच चुनावी रैलियों और नीतियों की सीधी टक्कर।"),
                Pair("3. निर्वाचन क्षेत्र संग्राम (Constituency Battle)", "एक प्रमुख हाई-प्रोफाइल सीट पर वोट शेयर की रणनीतिक लड़ाई।"),
                Pair("4. गठबंधन निर्माण (Coalition Mode)", "त्रिशंकु परिणाम के बाद साझा न्यूनतम कार्यक्रम और सरकार गठन।"),
                Pair("5. सरकार संचालन चुनौती (Government Challenge)", "आर्थिक मंदी या राष्ट्रीय संकट में किस दल की नीति सबसे श्रेष्ठ साबित होगी?"),
                Pair("6. राष्ट्रीय रणनीति रैंकिंग (Ranked Political Strategy)", "अखिल भारतीय लीडरबोर्ड पर शीर्ष राजनैतिक रणनीतिकार बनें।")
            )

            modes.forEach { (title, desc) ->
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
                            horizontalArrangement = Arrangement.SpaceBetween,
                            verticalAlignment = Alignment.CenterVertically
                        ) {
                            Text(title, color = SaffronLight, fontSize = 13.sp, fontWeight = FontWeight.Bold)
                            Box(
                                modifier = Modifier
                                    .clip(RoundedCornerShape(6.dp))
                                    .background(DeepNavyBg)
                                    .padding(horizontal = 6.dp, vertical = 2.dp)
                            ) {
                                Text("ऑनलाइन लॉबी", color = GoldAccent, fontSize = 10.sp, fontWeight = FontWeight.Bold)
                            }
                        }
                        Spacer(modifier = Modifier.height(4.dp))
                        Text(desc, color = TextSecondary, fontSize = 11.sp)
                    }
                }
            }
        }

        item {
            Spacer(modifier = Modifier.height(24.dp))
        }
    }
}
