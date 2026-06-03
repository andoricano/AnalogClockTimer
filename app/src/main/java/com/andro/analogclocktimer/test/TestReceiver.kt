package com.andro.analogclocktimer.test

import android.content.BroadcastReceiver
import android.content.Context
import android.content.Intent
import android.util.Log
import com.andro.analogclocktimer.App.Companion.app
import com.andro.analogclocktimer.data.Clock

class TestReceiver : BroadcastReceiver() {
    companion object {
        // adb cmd
        //ex)./start-adb.sh cmd
        private const val TAG = "TestReceiver"
        const val ACTION_COMMAND = "com.andro.analogclocktimer.ACTION_COMMAND"
        private const val EXTRA_COMMAND = "extra_command"
        private const val START_TIMER = "start"
        private const val STOP_TIMER = "stop"
        private const val SET_CLOCK_TIME = "setClockTime"
        private const val HELP = "help"
    }
    private val testTool = app.testTool

    override fun onReceive(context: Context, intent: Intent) {
        if (intent.action != ACTION_COMMAND) return

        val command = intent.getStringExtra(EXTRA_COMMAND) ?: return
        Log.d("TestReceiver", "Received command: '$command'")

        try {
            when (command) {
                HELP ->{
                    helpLog()
                }
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
                        command.startsWith(SET_CLOCK_TIME) -> {
                            val value = command.split(",")
                            if (value[1].length == 6) {
                                val hh1 = value[1].substring(0, 2).toIntOrNull() ?:0
                                val mm1 = value[1].substring(2, 4).toIntOrNull() ?:0
                                val ss1 = value[1].substring(4, 6).toIntOrNull() ?:0

                                Log.d(TAG, "Set Click time from Clock($hh1,$mm1,$ss1)")

                                testTool.mainViewModel?.setCurrentTime(Clock(hh1, mm1, ss1))
                            }
                        }

                        else -> {
                            Log.w(TAG, "Unknown command: $command")
                        }
                    }
                }
            }
        }catch (e : Exception){
            e.printStackTrace()
        }
    }

    private fun helpLog(){
        Log.i(TAG, "====================================")
        Log.i(TAG, "====================================")
        Log.i(TAG, " ")

        Log.i(TAG,"batch file name :    ./start-adb.sh")
        Log.i(TAG,"Timer Start :        $START_TIMER")
        Log.i(TAG,"Timer Stop :         $STOP_TIMER")
        Log.i(TAG,"Timer Setting :      setTimer,n,n")
        Log.i(TAG,"Clock Location :     location,n")
        Log.i(TAG,"Clock Size :         size,n")
        Log.i(TAG,"Clock Theme :        theme,n")
        Log.i(TAG,"Set Clock Time :     $SET_CLOCK_TIME,n")

        Log.i(TAG, " ")
        Log.i(TAG, "====================================")
        Log.i(TAG, "====================================")
    }
}