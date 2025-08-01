package com.andro.analogclocktimer.ui.screen

import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.material3.Button
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.LaunchedEffect
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.hilt.navigation.compose.hiltViewModel
import androidx.navigation.NavController
import com.andro.analogclocktimer.App.Companion.app
import com.andro.analogclocktimer.MainViewModel
import com.andro.analogclocktimer.navigateToTheme
import com.andro.analogclocktimer.ui.canvas.clock.ClockCanvas

@Composable
fun HomeScreen(nc: NavController,vm : MainViewModel = hiltViewModel()) {
    LaunchedEffect(Unit) {
        app.testTool.mainViewModel = vm
    }
    Column(
        modifier = Modifier.fillMaxSize(),
        horizontalAlignment = Alignment.CenterHorizontally,
        verticalArrangement = Arrangement.Center
    ) {

        Box(modifier = Modifier.weight(0.75f)) {
            ClockCanvas()
        }
        Box(modifier = Modifier.weight(0.25f)) {
            Button(onClick = { nc.navigateToTheme() }) {
                Text("Go to Theme")

            }
        }
    }
}