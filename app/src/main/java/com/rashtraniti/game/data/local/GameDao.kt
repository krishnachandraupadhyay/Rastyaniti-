package com.rashtraniti.game.data.local

import androidx.room.Dao
import androidx.room.Insert
import androidx.room.OnConflictStrategy
import androidx.room.Query
import kotlinx.coroutines.flow.Flow

@Dao
interface GameDao {
    @Query("SELECT * FROM game_save WHERE saveSlotId = :slotId LIMIT 1")
    suspend fun getSaveGame(slotId: Int = 1): GameSaveEntity?

    @Query("SELECT * FROM game_save WHERE saveSlotId = :slotId LIMIT 1")
    fun observeSaveGame(slotId: Int = 1): Flow<GameSaveEntity?>

    @Insert(onConflict = OnConflictStrategy.REPLACE)
    suspend fun insertOrUpdateSave(save: GameSaveEntity)

    @Query("DELETE FROM game_save WHERE saveSlotId = :slotId")
    suspend fun deleteSave(slotId: Int = 1)
}
