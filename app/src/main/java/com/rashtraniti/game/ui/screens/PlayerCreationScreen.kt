package com.rashtraniti.game.ui.screens

import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.Check
import androidx.compose.material.icons.filled.Person
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.rashtraniti.game.data.model.Player
import com.rashtraniti.game.ui.theme.*

@Composable
fun PlayerCreationScreen(
    initialPlayer: Player,
    onConfirmProfile: (
        name: String,
        age: Int,
        gender: String,
        state: String,
        district: String,
        constituency: String,
        education: String,
        occupation: String
    ) -> Unit
) {
    var name by remember { mutableStateOf(initialPlayer.name) }
    var ageText by remember { mutableStateOf(initialPlayer.age.toString()) }
    var selectedGender by remember { mutableStateOf(initialPlayer.gender) }
    var selectedState by remember { mutableStateOf(initialPlayer.state) }
    var selectedDistrict by remember { mutableStateOf(initialPlayer.district) }
    var selectedConstituency by remember { mutableStateOf(initialPlayer.constituency) }
    var selectedEducation by remember { mutableStateOf(initialPlayer.education) }
    var selectedOccupation by remember { mutableStateOf(initialPlayer.occupation) }

    val stateOptions = listOf("उत्तर प्रदेश", "बिहार", "मध्य प्रदेश", "राजस्थान", "महाराष्ट्र", "गुजरात")
    val occupationOptions = listOf(
        "सामाजिक कार्यकर्ता (Social Worker)",
        "वकील (Lawyer)",
        "शिक्षक (Teacher)",
        "किसान (Farmer)",
        "युवा उद्यमी (Entrepreneur)"
    )

    LazyColumn(
        modifier = Modifier
            .fillMaxSize()
            .background(DeepNavyBg)
            .padding(16.dp)
    ) {
        item {
            Text(
                text = "चरण 1: आम नागरिक प्रोफ़ाइल",
                color = SaffronPrimary,
                fontSize = 14.sp,
                fontWeight = FontWeight.Bold
            )
            Text(
                text = "अपनी पहचान और राजनीतिक पृष्ठभूमि चुनें",
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
                    // Name
                    OutlinedTextField(
                        value = name,
                        onValueChange = { name = it },
                        label = { Text("पूरा नाम (Full Name)") },
                        modifier = Modifier.fillMaxWidth(),
                        colors = OutlinedTextFieldDefaults.colors(
                            focusedBorderColor = SaffronPrimary,
                            unfocusedBorderColor = CardNavyBorder,
                            focusedTextColor = TextPrimary,
                            unfocusedTextColor = TextPrimary
                        )
                    )

                    Spacer(modifier = Modifier.height(12.dp))

                    // Age & Gender
                    Row(modifier = Modifier.fillMaxWidth()) {
                        OutlinedTextField(
                            value = ageText,
                            onValueChange = { ageText = it.filter { char -> char.isDigit() } },
                            label = { Text("आयु (Age)") },
                            modifier = Modifier.weight(1f),
                            colors = OutlinedTextFieldDefaults.colors(
                                focusedBorderColor = SaffronPrimary,
                                unfocusedBorderColor = CardNavyBorder,
                                focusedTextColor = TextPrimary,
                                unfocusedTextColor = TextPrimary
                            )
                        )
                        Spacer(modifier = Modifier.width(12.dp))
                        Column(modifier = Modifier.weight(1.5f)) {
                            Text("लिंग (Gender)", color = TextSecondary, fontSize = 12.sp)
                            Row(modifier = Modifier.fillMaxWidth()) {
                                listOf("पुरुष", "महिला", "अन्य").forEach { g ->
                                    val isSel = selectedGender == g
                                    Box(
                                        modifier = Modifier
                                            .padding(2.dp)
                                            .clip(RoundedCornerShape(6.dp))
                                            .background(if (isSel) SaffronPrimary else CardNavyBorder)
                                            .clickable { selectedGender = g }
                                            .padding(horizontal = 8.dp, vertical = 6.dp)
                                    ) {
                                        Text(g, color = Color.White, fontSize = 11.sp, fontWeight = FontWeight.Bold)
                                    }
                                }
                            }
                        }
                    }

                    Spacer(modifier = Modifier.height(12.dp))

                    // State Selector
                    Text("गृह राज्य (Home State)", color = TextSecondary, fontSize = 12.sp)
                    Row(
                        modifier = Modifier
                            .fillMaxWidth()
                            .padding(top = 4.dp),
                        horizontalArrangement = Arrangement.spacedBy(6.dp)
                    ) {
                        stateOptions.take(3).forEach { st ->
                            val isSel = selectedState == st
                            Box(
                                modifier = Modifier
                                    .clip(RoundedCornerShape(6.dp))
                                    .background(if (isSel) SaffronPrimary else DeepNavyBg)
                                    .clickable {
                                        selectedState = st
                                        if (st == "उत्तर प्रदेश") {
                                            selectedDistrict = "वाराणसी"
                                            selectedConstituency = "वाराणसी उत्तर"
                                        } else if (st == "बिहार") {
                                            selectedDistrict = "पटना"
                                            selectedConstituency = "पटना साहिब"
                                        }
                                    }
                                    .padding(horizontal = 10.dp, vertical = 6.dp)
                            ) {
                                Text(st, color = Color.White, fontSize = 11.sp)
                            }
                        }
                    }

                    Spacer(modifier = Modifier.height(12.dp))

                    // District & Constituency
                    OutlinedTextField(
                        value = selectedConstituency,
                        onValueChange = { selectedConstituency = it },
                        label = { Text("प्रारंभिक निर्वाचन क्षेत्र (Constituency)") },
                        modifier = Modifier.fillMaxWidth(),
                        colors = OutlinedTextFieldDefaults.colors(
                            focusedBorderColor = SaffronPrimary,
                            unfocusedBorderColor = CardNavyBorder,
                            focusedTextColor = TextPrimary,
                            unfocusedTextColor = TextPrimary
                        )
                    )

                    Spacer(modifier = Modifier.height(12.dp))

                    // Occupation Selector
                    Text("व्यवसाय / कार्यक्षेत्र (Occupation)", color = TextSecondary, fontSize = 12.sp)
                    occupationOptions.forEach { occ ->
                        val isSel = selectedOccupation == occ
                        Row(
                            modifier = Modifier
                                .fillMaxWidth()
                                .padding(vertical = 3.dp)
                                .clip(RoundedCornerShape(6.dp))
                                .background(if (isSel) SaffronPrimary.copy(alpha = 0.2f) else DeepNavyBg)
                                .clickable { selectedOccupation = occ }
                                .padding(8.dp),
                            verticalAlignment = Alignment.CenterVertically
                        ) {
                            RadioButton(
                                selected = isSel,
                                onClick = { selectedOccupation = occ },
                                colors = RadioButtonDefaults.colors(selectedColor = SaffronPrimary)
                            )
                            Spacer(modifier = Modifier.width(6.dp))
                            Text(occ, color = TextPrimary, fontSize = 12.sp)
                        }
                    }
                }
            }
        }

        item {
            Spacer(modifier = Modifier.height(16.dp))
            Card(
                colors = CardDefaults.cardColors(containerColor = CardNavy),
                shape = RoundedCornerShape(12.dp),
                border = androidx.compose.foundation.BorderStroke(1.dp, CardNavyBorder),
                modifier = Modifier.fillMaxWidth()
            ) {
                Column(modifier = Modifier.padding(14.dp)) {
                    Text("प्रारंभिक आंकड़े व संसाधन (Starting Stats)", color = GoldAccent, fontSize = 13.sp, fontWeight = FontWeight.Bold)
                    Spacer(modifier = Modifier.height(8.dp))
                    Row(modifier = Modifier.fillMaxWidth(), horizontalArrangement = Arrangement.SpaceBetween) {
                        Text("जनविश्वास: 55%", color = EmeraldSuccess, fontSize = 12.sp)
                        Text("संवाद कौशल: 50", color = TextPrimary, fontSize = 12.sp)
                        Text("राजनीतिक ज्ञान: 40", color = TextPrimary, fontSize = 12.sp)
                    }
                    Spacer(modifier = Modifier.height(4.dp))
                    Row(modifier = Modifier.fillMaxWidth(), horizontalArrangement = Arrangement.SpaceBetween) {
                        Text("निजी पूंजी: ₹1,50,000", color = GoldAccent, fontSize = 12.sp)
                        Text("ऊर्जा: 100%", color = SaffronLight, fontSize = 12.sp)
                        Text("प्रतिष्ठा: 50", color = TextPrimary, fontSize = 12.sp)
                    }
                }
            }
        }

        item {
            Spacer(modifier = Modifier.height(24.dp))
            Button(
                onClick = {
                    val ageVal = ageText.toIntOrNull() ?: 32
                    onConfirmProfile(
                        name,
                        ageVal,
                        selectedGender,
                        selectedState,
                        selectedDistrict,
                        selectedConstituency,
                        selectedEducation,
                        selectedOccupation
                    )
                },
                modifier = Modifier
                    .fillMaxWidth()
                    .height(50.dp),
                colors = ButtonDefaults.buttonColors(containerColor = SaffronPrimary),
                shape = RoundedCornerShape(12.dp)
            ) {
                Text("राजनीतिक दल का गठन करें", color = Color.White, fontSize = 16.sp, fontWeight = FontWeight.Bold)
            }
            Spacer(modifier = Modifier.height(30.dp))
        }
    }
}
