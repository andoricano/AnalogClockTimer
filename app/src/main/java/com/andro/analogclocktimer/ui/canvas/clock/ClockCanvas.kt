package com.andro.analogclocktimer.ui.canvas.clock

import androidx.compose.foundation.Canvas
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

@Composable
fun ClockCanvas(vm : MainViewModel = hiltViewModel()) {
    val currentTime by vm.currentTimer.collectAsState()

    Canvas(modifier = Modifier.fillMaxSize()) {
        val center = Offset(size.width / 2, size.height / 2)
        val radiusOuter = size.minDimension / 2 * 0.9f
        val radiusInner = radiusOuter * 0.8f

        drawCircle(color = Color.Black, radius = radiusOuter, center = center)
        drawCircle(color = Color.LightGray, radius = radiusInner, center = center)

        val hourLength = radiusInner * 0.5f
        val minuteLength = radiusOuter * 0.7f

        val hourAngle = ((currentTime.h % 12) + currentTime.m / 60f) * 30f - 90f
        val minuteAngle = currentTime.m * 6f - 90f

        fun angleToOffset(angle: Float, length: Float): Offset {
            val rad = Math.toRadians(angle.toDouble())
            return Offset(
                x = center.x + (length * kotlin.math.cos(rad)).toFloat(),
                y = center.y + (length * kotlin.math.sin(rad)).toFloat()
            )
        }

        drawLine(
            color = Color.Black,
            start = center,
            end = angleToOffset(hourAngle, hourLength),
            strokeWidth = 8f,
            cap = StrokeCap.Round
        )

        drawLine(
            color = Color.DarkGray,
            start = center,
            end = angleToOffset(minuteAngle, minuteLength),
            strokeWidth = 5f,
            cap = StrokeCap.Round
        )
    }
}