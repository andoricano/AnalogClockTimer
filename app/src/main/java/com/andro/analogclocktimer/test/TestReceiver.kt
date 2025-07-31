package com.andro.analogclocktimer.test

import android.app.Application
import android.content.BroadcastReceiver
import android.content.Context
import android.content.Intent
import android.util.Log
import com.andro.analogclocktimer.App
import com.andro.analogclocktimer.App.Companion.app
import javax.inject.Inject

class TestReceiver : BroadcastReceiver() {
    companion object {
        // adb cmd
        private const val TAG = "TestReceiver"
        const val ACTION_COMMAND = "com.andro.analogclocktimer.ACTION_COMMAND"
        private const val EXTRA_COMMAND = "extra_command"
        private const val START_TIMER = "start"
        private const val STOP_TIMER = "stop"
    }
    private val testTool = app.testTool

    override fun onReceive(context: Context, intent: Intent) {
        if (intent.action != ACTION_COMMAND) return

        val command = intent.getStringExtra(EXTRA_COMMAND) ?: return

        when (command) {
            START_TIMER -> {
                Log.d(TAG, "Start timer command received")
                testTool.mainViewModel?.startTimer()
            }
            STOP_TIMER -> {
                Log.d(TAG, "Stop timer command received")
                testTool.mainViewModel?.stopTimer()
            }
            else -> {
                Log.w(TAG, "Unknown command received: $command")
            }
        }
    }
}