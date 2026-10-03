package com.rashtraniti.game.ui.screens

import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.CheckCircle
import androidx.compose.material.icons.filled.Help
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
fun QuizScreen(
    state: GameUiState,
    onSelectOption: (Int) -> Unit,
    onSubmitAnswer: () -> Unit,
    onNextQuestion: () -> Unit
) {
    val q = state.quizQuestions.getOrNull(state.currentQuizIndex)

    LazyColumn(
        modifier = Modifier
            .fillMaxSize()
            .background(DeepNavyBg)
            .padding(14.dp)
    ) {
        item {
            Text(
                text = "राजनीतिक एवं संवैधानिक प्रश्नोत्तरी (Political Quiz)",
                color = TextPrimary,
                fontSize = 18.sp,
                fontWeight = FontWeight.Bold
            )
            Text(
                text = "संविधान, लोकतंत्र व शासन ज्ञान बढ़ाकर नेतृत्व क्षमता में वृद्धि करें",
                color = TextSecondary,
                fontSize = 12.sp
            )
            Spacer(modifier = Modifier.height(10.dp))
        }

        // Score Card
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
                    horizontalArrangement = Arrangement.SpaceBetween,
                    verticalAlignment = Alignment.CenterVertically
                ) {
                    Column {
                        Text("कुल अर्जित ज्ञान अंक (Score):", color = TextSecondary, fontSize = 11.sp)
                        Text("${state.quizScore} अंक", color = GoldAccent, fontSize = 16.sp, fontWeight = FontWeight.Bold)
                    }
                    Box(
                        modifier = Modifier
                            .clip(RoundedCornerShape(6.dp))
                            .background(DeepNavyBg)
                            .padding(horizontal = 8.dp, vertical = 4.dp)
                    ) {
                        Text(
                            text = "प्रश्न ${(state.currentQuizIndex + 1)} / ${state.quizQuestions.size}",
                            color = SaffronLight,
                            fontSize = 11.sp,
                            fontWeight = FontWeight.Bold
                        )
                    }
                }
            }
        }

        if (q != null) {
            item {
                Card(
                    colors = CardDefaults.cardColors(containerColor = CardNavy),
                    shape = RoundedCornerShape(14.dp),
                    border = androidx.compose.foundation.BorderStroke(1.dp, CardNavyBorder),
                    modifier = Modifier.fillMaxWidth()
                ) {
                    Column(modifier = Modifier.padding(16.dp)) {
                        Row(
                            modifier = Modifier.fillMaxWidth(),
                            horizontalArrangement = Arrangement.SpaceBetween
                        ) {
                            Text(q.category, color = GoldAccent, fontSize = 11.sp, fontWeight = FontWeight.SemiBold)
                            Text("कठिनाई: ${q.difficulty}", color = SaffronLight, fontSize = 10.sp)
                        }

                        Spacer(modifier = Modifier.height(10.dp))
                        Text(
                            text = if (state.isHindiLanguage) q.questionHindi else q.questionEnglish,
                            color = TextPrimary,
                            fontSize = 15.sp,
                            fontWeight = FontWeight.Bold,
                            lineHeight = 22.sp
                        )

                        Spacer(modifier = Modifier.height(16.dp))

                        // Options
                        q.options.forEachIndexed { idx, optionText ->
                            val isSelected = state.quizAnswerSelected == idx
                            val isCorrectAnswer = q.correctIndex == idx
                            val showFeedback = state.isQuizAnswerSubmitted

                            val bgColor = when {
                                showFeedback && isCorrectAnswer -> EmeraldSuccess.copy(alpha = 0.25f)
                                showFeedback && isSelected && !isCorrectAnswer -> CrimsonDanger.copy(alpha = 0.25f)
                                isSelected -> SaffronPrimary.copy(alpha = 0.2f)
                                else -> DeepNavyBg
                            }

                            val borderColor = when {
                                showFeedback && isCorrectAnswer -> EmeraldSuccess
                                showFeedback && isSelected && !isCorrectAnswer -> CrimsonDanger
                                isSelected -> SaffronPrimary
                                else -> CardNavyBorder
                            }

                            Card(
                                modifier = Modifier
                                    .fillMaxWidth()
                                    .padding(vertical = 4.dp)
                                    .clickable(enabled = !state.isQuizAnswerSubmitted) {
                                        onSelectOption(idx)
                                    },
                                colors = CardDefaults.cardColors(containerColor = bgColor),
                                shape = RoundedCornerShape(8.dp),
                                border = androidx.compose.foundation.BorderStroke(1.dp, borderColor)
                            ) {
                                Row(
                                    modifier = Modifier
                                        .fillMaxWidth()
                                        .padding(12.dp),
                                    verticalAlignment = Alignment.CenterVertically
                                ) {
                                    Box(
                                        modifier = Modifier
                                            .size(24.dp)
                                            .clip(RoundedCornerShape(4.dp))
                                            .background(if (isSelected) SaffronPrimary else CardNavyBorder),
                                        contentAlignment = Alignment.Center
                                    ) {
                                        Text(
                                            text = ('A' + idx).toString(),
                                            color = Color.White,
                                            fontSize = 11.sp,
                                            fontWeight = FontWeight.Bold
                                        )
                                    }
                                    Spacer(modifier = Modifier.width(10.dp))
                                    Text(
                                        text = optionText,
                                        color = TextPrimary,
                                        fontSize = 13.sp,
                                        modifier = Modifier.weight(1f)
                                    )
                                }
                            }
                        }

                        // Explanation after submission
                        if (state.isQuizAnswerSubmitted) {
                            Spacer(modifier = Modifier.height(12.dp))
                            Box(
                                modifier = Modifier
                                    .fillMaxWidth()
                                    .clip(RoundedCornerShape(8.dp))
                                    .background(DeepNavyBg)
                                    .padding(10.dp)
                            ) {
                                Column {
                                    Text("संवैधानिक व्याख्या (Explanation):", color = GoldAccent, fontSize = 11.sp, fontWeight = FontWeight.Bold)
                                    Spacer(modifier = Modifier.height(4.dp))
                                    Text(q.explanation, color = TextSecondary, fontSize = 12.sp, lineHeight = 16.sp)
                                }
                            }
                        }

                        Spacer(modifier = Modifier.height(16.dp))

                        if (!state.isQuizAnswerSubmitted) {
                            Button(
                                onClick = onSubmitAnswer,
                                enabled = state.quizAnswerSelected != null,
                                modifier = Modifier
                                    .fillMaxWidth()
                                    .height(44.dp),
                                colors = ButtonDefaults.buttonColors(containerColor = SaffronPrimary),
                                shape = RoundedCornerShape(10.dp)
                            ) {
                                Text("उत्तर जमा करें (+10 अंक)", color = Color.White, fontSize = 13.sp, fontWeight = FontWeight.Bold)
                            }
                        } else {
                            Button(
                                onClick = onNextQuestion,
                                modifier = Modifier
                                    .fillMaxWidth()
                                    .height(44.dp),
                                colors = ButtonDefaults.buttonColors(containerColor = IndianGreen),
                                shape = RoundedCornerShape(10.dp)
                            ) {
                                Text("अगला प्रश्न", color = Color.White, fontSize = 13.sp, fontWeight = FontWeight.Bold)
                            }
                        }
                    }
                }
            }
        }

        item {
            Spacer(modifier = Modifier.height(24.dp))
        }
    }
}
