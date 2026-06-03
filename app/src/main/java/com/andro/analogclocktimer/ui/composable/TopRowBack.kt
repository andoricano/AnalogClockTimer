package com.andro.analogclocktimer.ui.composable

import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.material3.Icon
import androidx.compose.material3.IconButton
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.res.painterResource
import com.andro.analogclocktimer.R

@Composable
fun TopRowBack(modifier: Modifier = Modifier,onClick : () -> Unit){
    Row (
        modifier = Modifier.fillMaxWidth().then(modifier),
        verticalAlignment = Alignment.CenterVertically
    ){
        IconButton(onClick) {
            Icon(
                painter = painterResource(id = R.drawable.arrow_back_24dp),
                contentDescription = "My Icon"
            )
        }
    }
}