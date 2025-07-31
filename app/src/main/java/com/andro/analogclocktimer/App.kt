package com.andro.analogclocktimer

import android.app.Application
import android.util.Log
import dagger.hilt.android.HiltAndroidApp

@HiltAndroidApp
class App : Application() {
    companion object{
        private const val TAG = "AnalogClockApp"
    }

    override fun onCreate() {
        super.onCreate()
        Log.i(TAG,"$TAG Start!")
    }
}