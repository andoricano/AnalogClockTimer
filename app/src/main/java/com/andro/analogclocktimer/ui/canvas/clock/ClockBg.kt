package com.andro.analogclocktimer.ui.canvas.clock

import androidx.compose.foundation.Canvas
import androidx.compose.foundation.background
import androidx.compose.foundation.isSystemInDarkTheme
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.lightColorScheme
import androidx.compose.runtime.Composable
import androidx.compose.runtime.collectAsState
import androidx.compose.runtime.getValue
import androidx.compose.runtime.rememberUpdatedState
import androidx.compose.ui.Modifier
import androidx.compose.ui.geometry.Offset
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.graphics.asImageBitmap
import androidx.compose.ui.graphics.drawscope.Stroke
import androidx.compose.ui.platform.LocalContext
import androidx.compose.ui.unit.IntOffset
import androidx.compose.ui.unit.IntSize
import androidx.compose.ui.unit.dp
import com.andro.analogclocktimer.MainActivity


@Composable
fun ClockBg() {
    val strokeColor = if (isSystemInDarkTheme()) Color.White else  Color.Black
    val vm = (LocalContext.current as MainActivity).vm

    val bitmap by vm.renderingBitmap.collectAsState()
    val imageBitmap = bitmap?.asImageBitmap()
    Canvas(modifier = Modifier.fillMaxSize()) {
        val center = Offset(size.width / 2f, size.height / 2f)
        val radiusOuter = size.minDimension / 2f

        imageBitmap?.let {
            val left = center.x - radiusOuter
            val top = center.y - radiusOuter
            val dstSize = IntSize((radiusOuter * 2).toInt(), (radiusOuter * 2).toInt())

            drawImage(
                image = it,
                srcOffset = IntOffset.Zero,
                srcSize = IntSize(it.width, it.height),
                dstOffset = IntOffset(left.toInt(), top.toInt()),
                dstSize = dstSize
            )
        }

        drawCircle(
            color = strokeColor,
            radius = radiusOuter,
            style = Stroke(width = 4.dp.toPx()),
            center = center
        )
    }
}
