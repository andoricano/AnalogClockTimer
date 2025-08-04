package com.andro.analogclocktimer.ui.canvas.clock

import androidx.compose.foundation.Canvas
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.runtime.Composable
import androidx.compose.ui.Modifier
import androidx.compose.ui.geometry.Offset
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.graphics.StrokeCap
import com.andro.analogclocktimer.data.Clock


@Composable
fun HourHand(clock: Clock) {
    Canvas(modifier = Modifier.fillMaxSize()) {
        val center = Offset(size.width / 2, size.height / 2)
        val radius = size.minDimension / 2 * 0.8f
        val angle = ((clock.h % 12) + clock.m / 60f) * 30f - 90f
        val end = angleToOffset(angle, radius * 0.5f, center)

        drawLine(Color.Black, center, end, strokeWidth = 8f, cap = StrokeCap.Round)
    }
}

@Composable
fun MinuteHand(clock: Clock) {
    Canvas(modifier = Modifier.fillMaxSize()) {
        val center = Offset(size.width / 2, size.height / 2)
        val radius = size.minDimension / 2 * 0.9f
        val angle = clock.m * 6f - 90f
        val end = angleToOffset(angle, radius * 0.7f, center)

        drawLine(Color.DarkGray, center, end, strokeWidth = 5f, cap = StrokeCap.Round)
    }
}

private fun angleToOffset(angle: Float, length: Float, center: Offset): Offset {
    val rad = Math.toRadians(angle.toDouble())
    return Offset(
        x = center.x + (length * kotlin.math.cos(rad)).toFloat(),
        y = center.y + (length * kotlin.math.sin(rad)).toFloat()
    )
}