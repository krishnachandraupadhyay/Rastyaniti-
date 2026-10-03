package com.rashtraniti.game.ui.screens

import androidx.compose.animation.core.*
import androidx.compose.foundation.Canvas
import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.ArrowForward
import androidx.compose.material.icons.filled.Public
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.scale
import androidx.compose.ui.geometry.Offset
import androidx.compose.ui.graphics.Brush
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.graphics.Path
import androidx.compose.ui.graphics.drawscope.Stroke
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.rashtraniti.game.ui.theme.*

@Composable
fun OpeningScreen(
    onStartJourney: () -> Unit
) {
    val infiniteTransition = rememberInfiniteTransition(label = "pulse")
    val scale by infiniteTransition.animateFloat(
        initialValue = 0.98f,
        targetValue = 1.02f,
        animationSpec = infiniteRepeatable(
            animation = tween(2000, easing = EaseInOutSine),
            repeatMode = RepeatMode.Reverse
        ),
        label = "scale"
    )

    Box(
        modifier = Modifier
            .fillMaxSize()
            .background(
                Brush.verticalGradient(
                    colors = listOf(
                        DeepNavyBg,
                        CardNavy,
                        DeepNavyBg
                    )
                )
            )
            .padding(24.dp),
        contentAlignment = Alignment.Center
    ) {
        Column(
            horizontalAlignment = Alignment.CenterHorizontally,
            verticalArrangement = Arrangement.Center,
            modifier = Modifier.fillMaxWidth()
        ) {
            // Elegant Tricolor Top Glow Line
            Row(
                modifier = Modifier
                    .width(180.dp)
                    .height(4.dp)
            ) {
                Box(modifier = Modifier.weight(1f).fillMaxHeight().background(SaffronPrimary))
                Box(modifier = Modifier.weight(1f).fillMaxHeight().background(Color.White))
                Box(modifier = Modifier.weight(1f).fillMaxHeight().background(IndianGreen))
            }

            Spacer(modifier = Modifier.height(28.dp))

            // 2D Stylized Vector Bharat Map Symbol
            Box(
                modifier = Modifier
                    .size(160.dp)
                    .scale(scale)
                    .background(DeepNavyBg, RoundedCornerShape(24.dp))
                    .border(2.dp, SaffronPrimary.copy(alpha = 0.6f), RoundedCornerShape(24.dp)),
                contentAlignment = Alignment.Center
            ) {
                Canvas(modifier = Modifier.size(120.dp)) {
                    // Stylized geometry representing the peninsular outline of Bharat
                    val path = Path().apply {
                        moveTo(size.width * 0.45f, size.height * 0.05f) // Kashmir apex
                        lineTo(size.width * 0.70f, size.height * 0.25f) // Northeast
                        lineTo(size.width * 0.90f, size.height * 0.32f) // Assam / NE
                        lineTo(size.width * 0.75f, size.height * 0.45f) // Bengal
                        lineTo(size.width * 0.65f, size.height * 0.70f) // Coromandel
                        lineTo(size.width * 0.50f, size.height * 0.95f) // Kanyakumari
                        lineTo(size.width * 0.35f, size.height * 0.70f) // Malabar
                        lineTo(size.width * 0.15f, size.height * 0.45f) // Gujarat Rann
                        lineTo(size.width * 0.25f, size.height * 0.25f) // Punjab / Rajasthan
                        close()
                    }
                    drawPath(
                        path = path,
                        color = SaffronPrimary.copy(alpha = 0.25f)
                    )
                    drawPath(
                        path = path,
                        color = SaffronPrimary,
                        style = Stroke(width = 3.dp.toPx())
                    )

                    // Capital / Center Node (Delhi)
                    drawCircle(
                        color = GoldAccent,
                        radius = 6.dp.toPx(),
                        center = Offset(size.width * 0.42f, size.height * 0.32f)
                    )
                    // Radiating ripple
                    drawCircle(
                        color = GoldAccent.copy(alpha = 0.4f),
                        radius = 12.dp.toPx(),
                        center = Offset(size.width * 0.42f, size.height * 0.32f),
                        style = Stroke(width = 2.dp.toPx())
                    )
                }
            }

            Spacer(modifier = Modifier.height(24.dp))

            Text(
                text = "भारत (BHARAT)",
                color = GoldAccent,
                fontSize = 16.sp,
                letterSpacing = 4.sp,
                fontWeight = FontWeight.SemiBold
            )

            Spacer(modifier = Modifier.height(8.dp))

            Text(
                text = "राष्ट्रनीति",
                color = TextPrimary,
                fontSize = 38.sp,
                fontWeight = FontWeight.ExtraBold,
                letterSpacing = 1.5.sp
            )

            Text(
                text = "“एक आम आदमी से प्रधानमंत्री तक”",
                color = SaffronLight,
                fontSize = 15.sp,
                fontWeight = FontWeight.Medium
            )

            Spacer(modifier = Modifier.height(32.dp))

            Card(
                colors = CardDefaults.cardColors(containerColor = CardNavy.copy(alpha = 0.8f)),
                shape = RoundedCornerShape(12.dp),
                border = androidx.compose.foundation.BorderStroke(1.dp, CardNavyBorder),
                modifier = Modifier.fillMaxWidth()
            ) {
                Column(
                    modifier = Modifier.padding(16.dp),
                    horizontalAlignment = Alignment.CenterHorizontally
                ) {
                    Text(
                        text = "यह देश आपका है।\nअब फैसला आपका है।",
                        color = TextPrimary,
                        fontSize = 16.sp,
                        fontWeight = FontWeight.Bold,
                        textAlign = TextAlign.Center,
                        lineHeight = 24.sp
                    )
                    Spacer(modifier = Modifier.height(10.dp))
                    Text(
                        text = "क्या एक आम नागरिक देश का प्रधानमंत्री बन सकता है?",
                        color = TextSecondary,
                        fontSize = 13.sp,
                        textAlign = TextAlign.Center
                    )
                }
            }

            Spacer(modifier = Modifier.height(36.dp))

            Button(
                onClick = onStartJourney,
                modifier = Modifier
                    .fillMaxWidth()
                    .height(54.dp),
                colors = ButtonDefaults.buttonColors(
                    containerColor = SaffronPrimary
                ),
                shape = RoundedCornerShape(14.dp),
                elevation = ButtonDefaults.buttonElevation(defaultElevation = 6.dp)
            ) {
                Text(
                    text = "यात्रा शुरू करें",
                    color = Color.White,
                    fontSize = 18.sp,
                    fontWeight = FontWeight.Bold
                )
                Spacer(modifier = Modifier.width(8.dp))
                Icon(Icons.Default.ArrowForward, contentDescription = "Start", tint = Color.White)
            }
        }
    }
}
