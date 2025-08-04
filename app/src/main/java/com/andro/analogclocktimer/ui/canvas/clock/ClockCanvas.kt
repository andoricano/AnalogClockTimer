package com.andro.analogclocktimer.ui.canvas.clock

import android.widget.TextClock
import androidx.compose.foundation.Canvas
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.runtime.Composable
import androidx.compose.runtime.collectAsState
import androidx.compose.runtime.getValue
import androidx.compose.ui.Modifier
import androidx.compose.ui.geometry.Offset
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.graphics.StrokeCap
import androidx.hilt.navigation.compose.hiltViewModel
import com.andro.analogclocktimer.MainViewModel
import com.andro.analogclocktimer.data.Clock

@Composable
fun ClockCanvas(vm: MainViewModel = hiltViewModel()) {
    val currentTime by vm.currentTimer.collectAsState(initial = Clock(0, 0, 0))

    Box(modifier = Modifier.fillMaxSize()) {
        ClockBackground()
        HourHand(currentTime)
        MinuteHand(currentTime)
        TimeText(currentTime,this)
        ClockNumbers(modifier = Modifier.fillMaxSize())
    }
}

@Composable
fun ClockBackground() {
    Canvas(modifier = Modifier.fillMaxSize()) {
        val center = Offset(size.width / 2, size.height / 2)
        val radiusOuter = size.minDimension / 2 * 0.9f
        val radiusInner = radiusOuter * 0.8f

        drawCircle(Color.Black, radiusOuter, center)
        drawCircle(Color.LightGray, radiusInner, center)
    }
}
