package com.rashtraniti.game.ui.screens

import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.rashtraniti.game.data.model.Party
import com.rashtraniti.game.data.model.PartyPriority
import com.rashtraniti.game.ui.theme.*

@Composable
fun PartyCreationScreen(
    initialParty: Party,
    onConfirmParty: (
        name: String,
        shortName: String,
        symbol: String,
        flagColorHex: String,
        slogan: String,
        description: String,
        priorities: List<PartyPriority>
    ) -> Unit
) {
    var partyName by remember { mutableStateOf(initialParty.name) }
    var shortName by remember { mutableStateOf(initialParty.shortName) }
    var slogan by remember { mutableStateOf(initialParty.slogan) }
    var selectedSymbol by remember { mutableStateOf("दीपक (Lamp)") }
    var selectedColorHex by remember { mutableStateOf("#FF671F") }
    var selectedPriorities by remember {
        mutableStateOf(listOf(PartyPriority.EDUCATION, PartyPriority.EMPLOYMENT, PartyPriority.HEALTHCARE))
    }

    val symbolOptions = listOf("दीपक (Lamp)", "मशाल (Torch)", "हलधर (Plow)", "चक्र (Wheel)", "किताब (Book)", "तराजू (Scale)")
    val colorOptions = listOf(
        Pair("#FF671F", Color(0xFFFF671F)),
        Pair("#2563EB", Color(0xFF2563EB)),
        Pair("#059669", Color(0xFF059669)),
        Pair("#7C3AED", Color(0xFF7C3AED)),
        Pair("#DC2626", Color(0xFFDC2626)),
        Pair("#0D9488", Color(0xFF0D9488))
    )

    LazyColumn(
        modifier = Modifier
            .fillMaxSize()
            .background(DeepNavyBg)
            .padding(16.dp)
    ) {
        item {
            Text(
                text = "चरण 2: राजनीतिक दल का गठन",
                color = SaffronPrimary,
                fontSize = 14.sp,
                fontWeight = FontWeight.Bold
            )
            Text(
                text = "पार्टी का नाम, चुनाव चिह्न व प्राथमिकताओं का चयन",
                color = TextPrimary,
                fontSize = 20.sp,
                fontWeight = FontWeight.ExtraBold
            )
            Spacer(modifier = Modifier.height(16.dp))
        }

        item {
            Card(
                colors = CardDefaults.cardColors(containerColor = CardNavy),
                shape = RoundedCornerShape(12.dp),
                border = androidx.compose.foundation.BorderStroke(1.dp, CardNavyBorder),
                modifier = Modifier.fillMaxWidth()
            ) {
                Column(modifier = Modifier.padding(16.dp)) {
                    // Party Name
                    OutlinedTextField(
                        value = partyName,
                        onValueChange = { partyName = it },
                        label = { Text("पार्टी का नाम (Party Name)") },
                        modifier = Modifier.fillMaxWidth(),
                        colors = OutlinedTextFieldDefaults.colors(
                            focusedBorderColor = SaffronPrimary,
                            unfocusedBorderColor = CardNavyBorder,
                            focusedTextColor = TextPrimary,
                            unfocusedTextColor = TextPrimary
                        )
                    )

                    Spacer(modifier = Modifier.height(12.dp))

                    // Short Name & Slogan
                    Row(modifier = Modifier.fillMaxWidth()) {
                        OutlinedTextField(
                            value = shortName,
                            onValueChange = { shortName = it.take(6) },
                            label = { Text("संक्षिप्त नाम (Acronym)") },
                            modifier = Modifier.weight(1f),
                            colors = OutlinedTextFieldDefaults.colors(
                                focusedBorderColor = SaffronPrimary,
                                unfocusedBorderColor = CardNavyBorder,
                                focusedTextColor = TextPrimary,
                                unfocusedTextColor = TextPrimary
                            )
                        )
                        Spacer(modifier = Modifier.width(12.dp))
                        OutlinedTextField(
                            value = slogan,
                            onValueChange = { slogan = it },
                            label = { Text("पार्टी का मुख्य नारा (Slogan)") },
                            modifier = Modifier.weight(2f),
                            colors = OutlinedTextFieldDefaults.colors(
                                focusedBorderColor = SaffronPrimary,
                                unfocusedBorderColor = CardNavyBorder,
                                focusedTextColor = TextPrimary,
                                unfocusedTextColor = TextPrimary
                            )
                        )
                    }

                    Spacer(modifier = Modifier.height(16.dp))

                    // Symbol Picker
                    Text("पार्टी चुनाव चिह्न (Party Symbol)", color = TextSecondary, fontSize = 12.sp)
                    Row(
                        modifier = Modifier
                            .fillMaxWidth()
                            .padding(top = 4.dp),
                        horizontalArrangement = Arrangement.spacedBy(6.dp)
                    ) {
                        symbolOptions.take(3).forEach { sym ->
                            val isSel = selectedSymbol == sym
                            Box(
                                modifier = Modifier
                                    .clip(RoundedCornerShape(6.dp))
                                    .background(if (isSel) SaffronPrimary else DeepNavyBg)
                                    .clickable { selectedSymbol = sym }
                                    .padding(horizontal = 8.dp, vertical = 6.dp)
                            ) {
                                Text(sym, color = Color.White, fontSize = 11.sp, fontWeight = FontWeight.Medium)
                            }
                        }
                    }

                    Spacer(modifier = Modifier.height(16.dp))

                    // Color Picker
                    Text("पार्टी ध्वज रंग (Party Flag Color)", color = TextSecondary, fontSize = 12.sp)
                    Row(
                        modifier = Modifier
                            .fillMaxWidth()
                            .padding(top = 6.dp),
                        horizontalArrangement = Arrangement.spacedBy(10.dp)
                    ) {
                        colorOptions.forEach { (hex, col) ->
                            val isSel = selectedColorHex == hex
                            Box(
                                modifier = Modifier
                                    .size(36.dp)
                                    .clip(CircleShape)
                                    .background(col)
                                    .border(
                                        width = if (isSel) 3.dp else 1.dp,
                                        color = if (isSel) Color.White else Color.Transparent,
                                        shape = CircleShape
                                    )
                                    .clickable { selectedColorHex = hex }
                            )
                        }
                    }

                    Spacer(modifier = Modifier.height(16.dp))

                    // Manifesto Priorities (Multi-select)
                    Text("पार्टी की 3 मुख्य प्राथमिकताएं (Core Priorities)", color = TextSecondary, fontSize = 12.sp)
                    Spacer(modifier = Modifier.height(6.dp))
                    PartyPriority.entries.chunked(3).forEach { rowPriorities ->
                        Row(
                            modifier = Modifier
                                .fillMaxWidth()
                                .padding(vertical = 2.dp),
                            horizontalArrangement = Arrangement.spacedBy(6.dp)
                        ) {
                            rowPriorities.forEach { prio ->
                                val isSel = selectedPriorities.contains(prio)
                                Box(
                                    modifier = Modifier
                                        .weight(1f)
                                        .clip(RoundedCornerShape(6.dp))
                                        .background(if (isSel) IndianGreen else DeepNavyBg)
                                        .clickable {
                                            if (isSel) {
                                                if (selectedPriorities.size > 1) {
                                                    selectedPriorities = selectedPriorities - prio
                                                }
                                            } else {
                                                if (selectedPriorities.size < 3) {
                                                    selectedPriorities = selectedPriorities + prio
                                                }
                                            }
                                        }
                                        .padding(vertical = 8.dp),
                                    contentAlignment = Alignment.Center
                                ) {
                                    Text(
                                        prio.titleHindi,
                                        color = Color.White,
                                        fontSize = 11.sp,
                                        fontWeight = if (isSel) FontWeight.Bold else FontWeight.Normal
                                    )
                                }
                            }
                        }
                    }
                }
            }
        }

        item {
            Spacer(modifier = Modifier.height(24.dp))
            Button(
                onClick = {
                    onConfirmParty(
                        partyName,
                        shortName,
                        selectedSymbol,
                        selectedColorHex,
                        slogan,
                        "जनता के विकास और सुशासन के लिए समर्पित एक स्वतंत्र लोकतांत्रिक दल।",
                        selectedPriorities
                    )
                },
                modifier = Modifier
                    .fillMaxWidth()
                    .height(50.dp),
                colors = ButtonDefaults.buttonColors(containerColor = SaffronPrimary),
                shape = RoundedCornerShape(12.dp)
            ) {
                Text("पार्टी स्थापित करें एवं मुख्य स्क्रीन पर जाएं", color = Color.White, fontSize = 16.sp, fontWeight = FontWeight.Bold)
            }
            Spacer(modifier = Modifier.height(30.dp))
        }
    }
}
