package com.rashtraniti.game.ui.screens

import androidx.compose.animation.AnimatedVisibility
import androidx.compose.foundation.Canvas
import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.*
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.geometry.Offset
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.graphics.Path
import androidx.compose.ui.graphics.drawscope.Stroke
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.rashtraniti.game.data.model.Constituency
import com.rashtraniti.game.ui.theme.*
import com.rashtraniti.game.viewmodel.GameUiState

enum class MapZoomLevel(val labelHindi: String, val labelEnglish: String) {
    INDIA("संपूर्ण भारत", "All India"),
    STATE("राज्य स्तर", "State Level"),
    DISTRICT("जिला स्तर", "District Level"),
    CONSTITUENCY("निर्वाचन क्षेत्र", "Constituency")
}

@Composable
fun MapScreen(
    state: GameUiState
) {
    var selectedZoom by remember { mutableStateOf(MapZoomLevel.INDIA) }
    var selectedConstituency by remember { mutableStateOf<Constituency?>(state.constituencies.firstOrNull()) }

    LazyColumn(
        modifier = Modifier
            .fillMaxSize()
            .background(DeepNavyBg)
            .padding(14.dp)
    ) {
        item {
            Text(
                text = "राजनीतिक प्रभाव मानचित्र (Political Map)",
                color = TextPrimary,
                fontSize = 18.sp,
                fontWeight = FontWeight.Bold
            )
            Text(
                text = "स्तर बढ़ने के साथ नया क्षेत्र और सीटें अनलॉक होती हैं",
                color = TextSecondary,
                fontSize = 12.sp
            )
            Spacer(modifier = Modifier.height(10.dp))
        }

        // Zoom Level Tab Buttons
        item {
            Row(
                modifier = Modifier
                    .fillMaxWidth()
                    .clip(RoundedCornerShape(10.dp))
                    .background(CardNavy)
                    .padding(4.dp),
                horizontalArrangement = Arrangement.spacedBy(4.dp)
            ) {
                MapZoomLevel.entries.forEach { zoom ->
                    val isSel = selectedZoom == zoom
                    Box(
                        modifier = Modifier
                            .weight(1f)
                            .clip(RoundedCornerShape(8.dp))
                            .background(if (isSel) SaffronPrimary else Color.Transparent)
                            .clickable { selectedZoom = zoom }
                            .padding(vertical = 8.dp),
                        contentAlignment = Alignment.Center
                    ) {
                        Text(
                            text = if (state.isHindiLanguage) zoom.labelHindi else zoom.labelEnglish,
                            color = if (isSel) Color.White else TextSecondary,
                            fontSize = 11.sp,
                            fontWeight = if (isSel) FontWeight.Bold else FontWeight.Normal
                        )
                    }
                }
            }
            Spacer(modifier = Modifier.height(14.dp))
        }

        // 2D Interactive Map Canvas Representation
        item {
            Card(
                colors = CardDefaults.cardColors(containerColor = CardNavy),
                shape = RoundedCornerShape(14.dp),
                border = androidx.compose.foundation.BorderStroke(1.dp, CardNavyBorder),
                modifier = Modifier
                    .fillMaxWidth()
                    .height(240.dp)
            ) {
                Box(modifier = Modifier.fillMaxSize(), contentAlignment = Alignment.Center) {
                    Canvas(modifier = Modifier.fillMaxSize().padding(16.dp)) {
                        val w = size.width
                        val h = size.height

                        // India outline contour
                        val indiaPath = Path().apply {
                            moveTo(w * 0.48f, h * 0.08f) // Kashmir
                            lineTo(w * 0.62f, h * 0.22f) // Uttarakhand
                            lineTo(w * 0.88f, h * 0.28f) // Northeast
                            lineTo(w * 0.72f, h * 0.45f) // Bengal
                            lineTo(w * 0.64f, h * 0.72f) // Andhra / TN
                            lineTo(w * 0.50f, h * 0.94f) // Kanyakumari
                            lineTo(w * 0.38f, h * 0.72f) // Kerala / Karnataka
                            lineTo(w * 0.22f, h * 0.52f) // Gujarat
                            lineTo(w * 0.30f, h * 0.25f) // Rajasthan
                            close()
                        }

                        drawPath(indiaPath, color = DeepNavyBg)
                        drawPath(indiaPath, color = SaffronPrimary.copy(alpha = 0.6f), style = Stroke(width = 2.dp.toPx()))

                        // Constituency / State nodes on the map
                        val nodes = listOf(
                            Triple("वाराणसी", Offset(w * 0.55f, h * 0.38f), true),
                            Triple("गोरखपुर", Offset(w * 0.58f, h * 0.34f), true),
                            Triple("पटना", Offset(w * 0.65f, h * 0.40f), state.currentLevel.levelNumber >= 4),
                            Triple("इंदौर", Offset(w * 0.40f, h * 0.50f), state.currentLevel.levelNumber >= 6),
                            Triple("जयपुर", Offset(w * 0.35f, h * 0.32f), state.currentLevel.levelNumber >= 7)
                        )

                        nodes.forEach { (cityName, pos, isUnlocked) ->
                            val dotColor = if (isUnlocked) EmeraldSuccess else TextMuted
                            drawCircle(
                                color = dotColor,
                                radius = if (isUnlocked) 7.dp.toPx() else 4.dp.toPx(),
                                center = pos
                            )
                            if (isUnlocked) {
                                drawCircle(
                                    color = dotColor.copy(alpha = 0.3f),
                                    radius = 12.dp.toPx(),
                                    center = pos,
                                    style = Stroke(width = 1.5.dp.toPx())
                                )
                            }
                        }
                    }

                    // Map overlay indicator
                    Box(
                        modifier = Modifier
                            .align(Alignment.BottomStart)
                            .padding(12.dp)
                            .clip(RoundedCornerShape(6.dp))
                            .background(DeepNavyBg.copy(alpha = 0.85f))
                            .padding(horizontal = 8.dp, vertical = 4.dp)
                    ) {
                        Text(
                            text = "🟢 सक्रिय / अनलॉक क्षेत्र: ${state.constituencies.count { it.isUnlocked }} • 🔒 आगामी: 2",
                            color = TextPrimary,
                            fontSize = 10.sp
                        )
                    }
                }
            }
        }

        // Constituency List & Regional Details
        item {
            Spacer(modifier = Modifier.height(16.dp))
            Text(
                text = "निर्वाचन क्षेत्र विवरण (Constituencies)",
                color = GoldAccent,
                fontSize = 14.sp,
                fontWeight = FontWeight.Bold
            )
            Spacer(modifier = Modifier.height(8.dp))

            state.constituencies.forEach { c ->
                val isSelected = selectedConstituency?.id == c.id
                Card(
                    modifier = Modifier
                        .fillMaxWidth()
                        .padding(vertical = 4.dp)
                        .clickable { selectedConstituency = c },
                    colors = CardDefaults.cardColors(
                        containerColor = if (isSelected) CardNavyBorder else CardNavy
                    ),
                    shape = RoundedCornerShape(10.dp),
                    border = androidx.compose.foundation.BorderStroke(
                        width = if (isSelected) 1.5.dp else 1.dp,
                        color = if (isSelected) SaffronPrimary else CardNavyBorder
                    )
                ) {
                    Column(modifier = Modifier.padding(12.dp)) {
                        Row(
                            modifier = Modifier.fillMaxWidth(),
                            horizontalArrangement = Arrangement.SpaceBetween,
                            verticalAlignment = Alignment.CenterVertically
                        ) {
                            Column {
                                Text(c.name, color = TextPrimary, fontSize = 14.sp, fontWeight = FontWeight.Bold)
                                Text("${c.district} • ${c.state}", color = TextSecondary, fontSize = 11.sp)
                            }
                            if (c.isPlayerHomeConstituency) {
                                Box(
                                    modifier = Modifier
                                        .clip(RoundedCornerShape(6.dp))
                                        .background(IndianGreen)
                                        .padding(horizontal = 6.dp, vertical = 2.dp)
                                ) {
                                    Text("गृह क्षेत्र", color = Color.White, fontSize = 10.sp, fontWeight = FontWeight.Bold)
                                }
                            }
                        }

                        Spacer(modifier = Modifier.height(8.dp))

                        Row(modifier = Modifier.fillMaxWidth(), horizontalArrangement = Arrangement.SpaceBetween) {
                            Text("आपकी पार्टी समर्थन: ${c.playerPartySupportPct}%", color = SaffronLight, fontSize = 11.sp)
                            Text("मुख्य प्रतिद्वंद्वी: ${c.mainOpponentSupportPct}%", color = CrimsonDanger, fontSize = 11.sp)
                        }

                        Spacer(modifier = Modifier.height(4.dp))
                        LinearProgressIndicator(
                            progress = { (c.playerPartySupportPct / 100f).coerceIn(0f, 1f) },
                            modifier = Modifier
                                .fillMaxWidth()
                                .height(5.dp)
                                .clip(RoundedCornerShape(3.dp)),
                            color = SaffronPrimary,
                            trackColor = DeepNavyBg
                        )

                        Spacer(modifier = Modifier.height(6.dp))
                        Text("प्रमुख स्थानीय मुद्दा: ${c.topIssue}", color = GoldAccent, fontSize = 11.sp)
                    }
                }
            }
            Spacer(modifier = Modifier.height(20.dp))
        }
    }
}
