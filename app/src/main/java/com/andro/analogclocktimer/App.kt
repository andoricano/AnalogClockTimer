package com.andro.analogclocktimer

import android.app.Application
import android.util.Log
import com.andro.analogclocktimer.test.TestTool
import dagger.hilt.android.HiltAndroidApp
import javax.inject.Inject

@HiltAndroidApp
class App : Application() {
    companion object{
        lateinit var app: App
            private set
        private const val TAG = "AnalogClockApp"
    }
    @Inject
    lateinit var testTool : TestTool

    override fun onCreate() {
        super.onCreate()
        app = this
        Log.i(TAG,"$TAG Start!")
    }
}