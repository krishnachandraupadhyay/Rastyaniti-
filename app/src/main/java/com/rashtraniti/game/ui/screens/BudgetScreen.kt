package com.rashtraniti.game.ui.screens

import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.Add
import androidx.compose.material.icons.filled.Remove
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
fun BudgetScreen(
    state: GameUiState,
    onAdjustAllocation: (String, Long) -> Unit,
    onBack: () -> Unit
) {
    val budget = state.nationalBudget

    LazyColumn(
        modifier = Modifier
            .fillMaxSize()
            .background(DeepNavyBg)
            .padding(14.dp)
    ) {
        item {
            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.SpaceBetween,
                verticalAlignment = Alignment.CenterVertically
            ) {
                Column {
                    Text("केंद्रीय वार्षिक बजट (Union Budget)", color = TextPrimary, fontSize = 18.sp, fontWeight = FontWeight.Bold)
                    Text("राजकोषीय घाटा एवं मंत्रालयवार आवंटन", color = TextSecondary, fontSize = 12.sp)
                }
                Button(
                    onClick = onBack,
                    colors = ButtonDefaults.buttonColors(containerColor = CardNavyBorder),
                    shape = RoundedCornerShape(8.dp),
                    contentPadding = PaddingValues(horizontal = 10.dp, vertical = 4.dp),
                    modifier = Modifier.height(32.dp)
                ) {
                    Text("वापस", color = Color.White, fontSize = 11.sp)
                }
            }
            Spacer(modifier = Modifier.height(12.dp))
        }

        // Budget Macro Summary
        item {
            Card(
                colors = CardDefaults.cardColors(containerColor = CardNavy),
                shape = RoundedCornerShape(12.dp),
                border = androidx.compose.foundation.BorderStroke(1.dp, CardNavyBorder),
                modifier = Modifier
                    .fillMaxWidth()
                    .padding(bottom = 14.dp)
            ) {
                Column(modifier = Modifier.padding(14.dp)) {
                    Row(modifier = Modifier.fillMaxWidth(), horizontalArrangement = Arrangement.SpaceBetween) {
                        Text("कुल अनुमानित राजस्व:", color = TextSecondary, fontSize = 12.sp)
                        Text("₹${budget.totalRevenueCrores} करोड़", color = EmeraldSuccess, fontSize = 13.sp, fontWeight = FontWeight.Bold)
                    }
                    Spacer(modifier = Modifier.height(4.dp))
                    Row(modifier = Modifier.fillMaxWidth(), horizontalArrangement = Arrangement.SpaceBetween) {
                        Text("कुल प्रस्तावित व्यय:", color = TextSecondary, fontSize = 12.sp)
                        Text("₹${budget.totalExpenditureCrores} करोड़", color = CrimsonDanger, fontSize = 13.sp, fontWeight = FontWeight.Bold)
                    }
                    Spacer(modifier = Modifier.height(4.dp))
                    Row(modifier = Modifier.fillMaxWidth(), horizontalArrangement = Arrangement.SpaceBetween) {
                        Text("राजकोषीय घाटा (Deficit):", color = TextSecondary, fontSize = 12.sp)
                        Text("₹${budget.fiscalDeficitCrores} करोड़", color = GoldAccent, fontSize = 13.sp, fontWeight = FontWeight.Bold)
                    }
                }
            }
        }

        item {
            Text("मंत्रालयवार आवंटन संशोधन (Adjust Allocations)", color = GoldAccent, fontSize = 13.sp, fontWeight = FontWeight.Bold)
            Spacer(modifier = Modifier.height(8.dp))
        }

        items(budget.allocations.entries.toList().size) { idx ->
            val entry = budget.allocations.entries.toList()[idx]
            val category = entry.key
            val amount = entry.value

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
                        .padding(10.dp),
                    horizontalArrangement = Arrangement.SpaceBetween,
                    verticalAlignment = Alignment.CenterVertically
                ) {
                    Column(modifier = Modifier.weight(1f)) {
                        Text(category, color = TextPrimary, fontSize = 12.sp, fontWeight = FontWeight.Medium)
                        Text("₹$amount करोड़", color = SaffronLight, fontSize = 13.sp, fontWeight = FontWeight.Bold)
                    }

                    Row(verticalAlignment = Alignment.CenterVertically) {
                        IconButton(
                            onClick = {
                                if (amount > 10000L) {
                                    onAdjustAllocation(category, amount - 10000L)
                                }
                            },
                            modifier = Modifier
                                .size(32.dp)
                                .clip(RoundedCornerShape(6.dp))
                                .background(DeepNavyBg)
                        ) {
                            Icon(Icons.Default.Remove, contentDescription = "-10k", tint = CrimsonDanger, modifier = Modifier.size(16.dp))
                        }

                        Spacer(modifier = Modifier.width(6.dp))

                        IconButton(
                            onClick = {
                                onAdjustAllocation(category, amount + 10000L)
                            },
                            modifier = Modifier
                                .size(32.dp)
                                .clip(RoundedCornerShape(6.dp))
                                .background(DeepNavyBg)
                        ) {
                            Icon(Icons.Default.Add, contentDescription = "+10k", tint = EmeraldSuccess, modifier = Modifier.size(16.dp))
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
