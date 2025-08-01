package com.andro.analogclocktimer.ui.screen

import androidx.compose.material3.Button
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.navigation.NavController
import com.andro.analogclocktimer.navigateToTheme

@Composable
fun HomeScreen(nc: NavController) {
    Button(onClick = { nc.navigateToTheme() }) {
        Text("Go to Theme")

    }
}