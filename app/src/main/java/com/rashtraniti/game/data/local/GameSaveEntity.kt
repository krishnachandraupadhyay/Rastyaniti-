package com.rashtraniti.game.data.local

import androidx.room.Entity
import androidx.room.PrimaryKey

@Entity(tableName = "game_save")
data class GameSaveEntity(
    @PrimaryKey
    val saveSlotId: Int = 1,
    val playerName: String,
    val partyName: String,
    val currentLevelNumber: Int,
    val gameDay: Int,
    val electionCountdownDays: Int,
    val playerFunds: Long,
    val partyFunds: Long,
    val publicTrust: Int,
    val partyPopularity: Int,
    val govtApproval: Int,
    val wonSeatsNational: Int,
    val lastSavedTimestamp: Long = System.currentTimeMillis()
)
