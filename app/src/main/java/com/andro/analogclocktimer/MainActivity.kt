package com.andro.analogclocktimer

import android.os.Bundle
import androidx.activity.ComponentActivity
import androidx.activity.compose.setContent
import androidx.activity.enableEdgeToEdge
import androidx.activity.viewModels
import androidx.lifecycle.lifecycleScope
import androidx.navigation.compose.rememberNavController
import com.andro.analogclocktimer.App.Companion.app
import com.andro.analogclocktimer.ui.theme.AnalogClockTimerTheme
import dagger.hilt.android.AndroidEntryPoint

@AndroidEntryPoint
class MainActivity : ComponentActivity() {

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        enableEdgeToEdge()
        setContent {
            NavGraph(rememberNavController())
        }
        initTestLogic()
    }
    private fun initLifecycleLogic(){
        val scope = lifecycleScope

    }

    private fun initTestLogic(){

    }
}
