package com.andro.analogclocktimer.ui.canvas.clock

import androidx.compose.foundation.Canvas
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.runtime.Composable
import androidx.compose.runtime.collectAsState
import androidx.compose.runtime.getValue
import androidx.compose.ui.Modifier
import androidx.compose.ui.geometry.Offset
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.graphics.asImageBitmap
import androidx.compose.ui.graphics.drawscope.Stroke
import androidx.compose.ui.platform.LocalContext
import androidx.compose.ui.unit.IntOffset
import androidx.compose.ui.unit.IntSize
import androidx.compose.ui.unit.dp
import androidx.hilt.navigation.compose.hiltViewModel
import com.andro.analogclocktimer.MainActivity
import com.andro.analogclocktimer.MainViewModel
import com.andro.analogclocktimer.data.Clock

@Composable
fun ClockCanvas(vm: MainViewModel = hiltViewModel()) {
    val currentTime by vm.currentTimer.collectAsState(initial = Clock(0, 0, 0))

    Box(modifier = Modifier.fillMaxSize()) {
        ClockBg()
        HourHand(currentTime)
        MinuteHand(currentTime)
        TimeText(currentTime,this)
        ClockNumbers(modifier = Modifier.fillMaxSize())
    }
}