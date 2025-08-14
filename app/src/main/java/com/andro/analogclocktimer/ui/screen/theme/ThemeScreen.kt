package com.andro.analogclocktimer.ui.screen.theme

import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.runtime.Composable
import androidx.compose.ui.Modifier
import androidx.navigation.NavController
import com.andro.analogclocktimer.ui.composable.TopRowBack

@Composable
fun ThemeScreen(nc: NavController) {
    Column(
        modifier = Modifier.fillMaxSize(),
    ) {
        TopRowBack(
            modifier = Modifier.weight(0.1f)
        ) {
            nc.popBackStack()
        }

        ThemeScreenMid(
            modifier = Modifier.weight(0.7f)
        )
        ThemeScreenBtm(
            nc,
            modifier = Modifier.weight(0.2f)
        )
    }
}