package com.andro.analogclocktimer.test

import android.app.Application
import android.content.BroadcastReceiver
import android.content.Context
import android.content.Intent
import android.util.Log
import com.andro.analogclocktimer.App
import com.andro.analogclocktimer.App.Companion.app
import com.andro.analogclocktimer.data.Clock
import javax.inject.Inject

class TestReceiver : BroadcastReceiver() {
    companion object {
        // adb cmd
        private const val TAG = "TestReceiver"
        const val ACTION_COMMAND = "com.andro.analogclocktimer.ACTION_COMMAND"
        private const val EXTRA_COMMAND = "extra_command"
        private const val START_TIMER = "start"
        private const val STOP_TIMER = "stop"

        fun sizeCommand(n: Int): String = "size$n"
        fun locationCommand(n: Int): String = "location$n"
        fun themeCommand(n: Int): String = "theme$n"
        fun setTimer(n : Int) : String = "setTimer$n"
    }
    private val testTool = app.testTool

    override fun onReceive(context: Context, intent: Intent) {
        Log.w(TAG, "Unknown command received: $intent")
        if (intent.action != ACTION_COMMAND) return

        val command = intent.getStringExtra(EXTRA_COMMAND) ?: return

        when (command) {
            START_TIMER -> {
                testTool.mainViewModel?.startTimer()
            }

            STOP_TIMER -> {
                testTool.mainViewModel?.stopTimer()
            }

            else -> {
                when {
                    command.startsWith("size") -> {
                        val value = command.removePrefix("size").toIntOrNull()
                        if (value != null) {
                            Log.d(TAG, "Set size to $value")
                            testTool.mainViewModel?.setSize(value)
                        }
                    }

                    command.startsWith("location") -> {
                        val value = command.removePrefix("location").toIntOrNull()
                        if (value != null) {
                            Log.d(TAG, "Set location to $value")
                            testTool.mainViewModel?.setLocation(value)
                        }
                    }

                    command.startsWith("theme") -> {
                        val value = command.removePrefix("theme").toIntOrNull()
                        if (value != null) {
                            Log.d(TAG, "Set theme to $value")
                            testTool.mainViewModel?.setTheme(value)
                        }
                    }
                    command.startsWith("setTimer") -> {
                        val value = command.removePrefix("setTimer").split(",")
                        if (value.size == 2) {
                            val hh1 = value[0].substring(0, 2).toInt()
                            val mm1 = value[0].substring(2, 4).toInt()
                            val ss1 = value[0].substring(4, 6).toInt()

                            val hh2 = value[1].substring(0, 2).toInt()
                            val mm2 = value[1].substring(2, 4).toInt()
                            val ss2 = value[1].substring(4, 6).toInt()

                            Log.d(TAG, "Set timer from Clock($hh1,$mm1,$ss1) to Clock($hh2,$mm2,$ss2)")

                            testTool.mainViewModel?.setTimer(Clock(hh1, mm1, ss1), Clock(hh2, mm2, ss2))
                        }
                    }

                    else -> {
                        Log.w(TAG, "Unknown command: $command")
                    }
                }
            }
        }
    }
}