package com.rashtraniti.game

import android.app.Application
import com.rashtraniti.game.data.local.AppDatabase
import com.rashtraniti.game.data.repository.GameRepository

class RashtraNitiApp : Application() {

    lateinit var database: AppDatabase
        private set

    lateinit var gameRepository: GameRepository
        private set

    override fun onCreate() {
        super.onCreate()
        database = AppDatabase.getDatabase(this)
        gameRepository = GameRepository(database.gameDao())
    }
}
