package com.andro.analogclocktimer.ui.canvas.clock

import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.BoxScope
import androidx.compose.foundation.layout.offset
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.platform.LocalDensity
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.unit.IntOffset
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.andro.analogclocktimer.data.Clock
import kotlin.math.roundToInt

@Composable
fun ClockNumbers(modifier: Modifier = Modifier) {
    val numbers = (1..12).toList()
    Box(modifier = modifier) {
        val radius = 140.dp
        val center = with(receiver = LocalDensity.current) { radius.toPx() }

        numbers.forEach { number ->
            val angle = Math.toRadians(((number % 12) * 30 - 90).toDouble())
            val x = center + (center * 0.8 * kotlin.math.cos(angle))
            val y = center + (center * 0.8 * kotlin.math.sin(angle))

            Text(
                text = number.toString(),
                modifier = Modifier
                    .offset { IntOffset(x.roundToInt()+90, y.roundToInt() +420) }
                    .size(24.dp),
                color = Color.White,
                fontSize = 18.sp,
                fontWeight = FontWeight.Bold,
                textAlign = TextAlign.Center
            )
        }
    }
}


@Composable
fun TimeText(currentTime: Clock, boxScope: BoxScope) {
    boxScope.run {
        Text(
            text = "%02d:%02d".format(currentTime.h, currentTime.m),
            modifier = Modifier.align(Alignment.Center).padding(top = 16.dp),
            color = Color.White,
            fontSize = 24.sp,
            fontWeight = FontWeight.Bold
        )
    }
}