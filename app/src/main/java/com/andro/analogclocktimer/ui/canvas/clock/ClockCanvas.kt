package com.andro.analogclocktimer.ui.canvas.clock

import android.annotation.SuppressLint
import android.util.Log
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.BoxWithConstraints
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.runtime.Composable
import androidx.compose.runtime.collectAsState
import androidx.compose.runtime.getValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.min
import androidx.hilt.navigation.compose.hiltViewModel
import com.andro.analogclocktimer.MainViewModel
import com.andro.analogclocktimer.data.Clock

@Composable
fun ClockCanvas(vm: MainViewModel = hiltViewModel()) {
    val currentTime by vm.currentTimer.collectAsState(initial = Clock(0, 0, 0))
    Log.i("currentTime", "currentTime : $currentTime")
    BoxWithConstraints(
        contentAlignment = Alignment.Center,
        modifier = Modifier.fillMaxSize().padding(10.dp)
    ) {
        val size = min(maxWidth, maxHeight)

        Box(modifier = Modifier.size(size)) {
            ClockBg()
            SecondHand(currentTime)
            HourHand(currentTime)
            MinuteHand(currentTime)
            ClockNumbers(size)
        }
    }
}