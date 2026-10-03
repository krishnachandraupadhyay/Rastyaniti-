package com.rashtraniti.game.ui.theme

import androidx.compose.foundation.isSystemInDarkTheme
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.darkColorScheme
import androidx.compose.runtime.Composable
import androidx.compose.ui.graphics.Color

private val DarkColorScheme = darkColorScheme(
    primary = SaffronPrimary,
    onPrimary = Color.White,
    secondary = IndianGreen,
    onSecondary = Color.White,
    tertiary = GoldAccent,
    background = DeepNavyBg,
    onBackground = TextPrimary,
    surface = CardNavy,
    onSurface = TextPrimary,
    outline = CardNavyBorder
)

@Composable
fun RashtraNitiTheme(
    content: @Composable () -> Unit
) {
    MaterialTheme(
        colorScheme = DarkColorScheme,
        typography = Typography,
        content = content
    )
}
