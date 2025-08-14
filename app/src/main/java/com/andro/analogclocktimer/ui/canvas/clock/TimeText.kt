package com.andro.analogclocktimer.ui.canvas.clock

import android.util.Log
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
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.unit.Dp
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.andro.analogclocktimer.data.Clock

@Composable
fun ClockNumbers(size : Dp) {
    val numbers = (1..12).toList()
    Box(modifier = Modifier.size(size)) {
        val radius = (size.value)/2-40
        val center = (size.value) / 2 - 12

        numbers.forEach { number ->
            val radian = Math.toRadians(((number % 12) * 30 - 90).toDouble())
            val x = (center + (radius * kotlin.math.cos(radian)))
            val y = (center + (radius * kotlin.math.sin(radian)))
            Log.i("ClockNumbers", "number[$number] : $radian, (${x.toInt()},${y.toInt()})")

            Text(
                text = number.toString(),
                modifier = Modifier
                    .offset((x).dp, (y).dp)
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