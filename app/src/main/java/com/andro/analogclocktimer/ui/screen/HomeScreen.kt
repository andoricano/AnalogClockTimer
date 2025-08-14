package com.andro.analogclocktimer.ui.screen

import android.annotation.SuppressLint
import androidx.compose.foundation.background
import androidx.compose.foundation.gestures.detectTapGestures
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.BoxWithConstraints
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.ArrowForward
import androidx.compose.material.icons.filled.KeyboardArrowDown
import androidx.compose.material3.Button
import androidx.compose.material3.Icon
import androidx.compose.material3.SegmentedButtonDefaults.Icon
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.LaunchedEffect
import androidx.compose.runtime.collectAsState
import androidx.compose.runtime.getValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.input.pointer.pointerInput
import androidx.compose.ui.unit.dp
import androidx.hilt.navigation.compose.hiltViewModel
import androidx.navigation.NavController
import com.andro.analogclocktimer.App.Companion.app
import com.andro.analogclocktimer.MainViewModel
import com.andro.analogclocktimer.navigateToTheme
import com.andro.analogclocktimer.ui.canvas.clock.ClockCanvas
import com.andro.analogclocktimer.ui.composable.BasicButton
import kotlinx.coroutines.flow.update

@SuppressLint("UnusedBoxWithConstraintsScope")
@Composable
fun HomeScreen(nc: NavController,vm : MainViewModel = hiltViewModel()) {
    LaunchedEffect(Unit) {
        app.testTool.mainViewModel = vm
    }
    val menuVisible by vm.menuState.collectAsState()
    Column(
        modifier = Modifier
            .fillMaxSize()
            .pointerInput(Unit) {
                detectTapGestures { offset ->
                    vm.menuState.update { true }
                }
            },
        horizontalAlignment = Alignment.CenterHorizontally,
        verticalArrangement = Arrangement.Center
    ) {
        BoxWithConstraints {
            val side = minOf(maxWidth, maxHeight)

            BoxWithConstraints(
                modifier = Modifier.size(side)
                    .align(Alignment.Center)
            ) {
                ClockCanvas()
            }
        }
        if (menuVisible) {
            Column (modifier = Modifier.padding(20.dp),
                verticalArrangement = Arrangement.spacedBy(16.dp)){
                BasicButton("Go to Theme",
                    icon = {
                        Icon(
                            imageVector = Icons.Default.ArrowForward,
                            contentDescription = "Arrow",
                            tint = Color.White
                        )
                    }) {
                    nc.navigateToTheme()
                }

                BasicButton(
                    "Hide Buttons",
                    icon = {
                        Icon(
                            imageVector = Icons.Default.KeyboardArrowDown,
                            contentDescription = "Arrow",
                            tint = Color.White
                        )
                    }
                ) {
                    vm.menuState.update { false }
                }
            }
        }

    }
}