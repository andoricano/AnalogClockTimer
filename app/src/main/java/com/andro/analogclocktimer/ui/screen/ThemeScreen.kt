package com.andro.analogclocktimer.ui.screen

import androidx.compose.material3.Button
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.navigation.NavController
import com.andro.analogclocktimer.navigateToHomePopBack

@Composable
fun ThemeScreen(nc: NavController) {
    Button(onClick = {nc.navigateToHomePopBack()}) {
        Text("Go to Detail")
    }
}