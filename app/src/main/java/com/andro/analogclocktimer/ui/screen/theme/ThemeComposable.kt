package com.andro.analogclocktimer.ui.screen.theme

import androidx.compose.foundation.Image
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.aspectRatio
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.material3.Button
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.collectAsState
import androidx.compose.runtime.getValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.asImageBitmap
import androidx.compose.ui.layout.ContentScale
import androidx.compose.ui.platform.LocalContext
import androidx.compose.ui.unit.dp
import com.andro.analogclocktimer.MainActivity
import com.andro.analogclocktimer.ui.composable.BasicButton


@Composable
fun ThemeScreenMid(
    modifier: Modifier
){
    val vm = (LocalContext.current as MainActivity).vm
    val bitmap by vm.renderingBitmap.collectAsState()

    Column(
        modifier = Modifier.fillMaxWidth().then(modifier).padding(15.dp),
        Arrangement.Center
    ) {
        bitmap?.let {
            Image(
                bitmap = it.asImageBitmap(),
                contentDescription = null,
                modifier = Modifier
                    .fillMaxWidth()
                    .aspectRatio(1f)
                    .clip(CircleShape),
                contentScale = ContentScale.Crop
            )
        }
    }
}

@Composable
fun ThemeScreenBtm(
    modifier: Modifier
){
    val activity = LocalContext.current as MainActivity
    val rowList = listOf(
        Pair(ThemeMenu("배경 선택",null){ activity.checkAndRequestPermission() },
        ThemeMenu("폰트 선택",null){}),
        Pair(ThemeMenu("전자 시계",null){},
        ThemeMenu("테마 저장",null){activity.vm.changeThemeBg()}),
    )
    Column(
        modifier = Modifier.fillMaxWidth().then(modifier),
        verticalArrangement = Arrangement.spacedBy(16.dp),
        horizontalAlignment = Alignment.CenterHorizontally
    ) {
        rowList.forEach {
            Row (
                horizontalArrangement = Arrangement.spacedBy(16.dp)
            ){
                BasicButton(it.first.text, width = 140.dp, icon = it.first.icon ){it.first.onClick()}
                BasicButton(it.second.text, width = 140.dp, icon = it.second.icon ){it.second.onClick()}
            }
        }
    }
}

private data class ThemeMenu(
    val text : String,
    val icon: @Composable (() -> Unit)? = null,
    val onClick : () -> Unit
)