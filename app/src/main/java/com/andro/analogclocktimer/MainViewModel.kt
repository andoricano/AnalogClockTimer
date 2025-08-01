package com.andro.analogclocktimer

import android.util.Log
import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import com.andro.analogclocktimer.data.Clock
import dagger.hilt.android.lifecycle.HiltViewModel
import javax.inject.Inject

@HiltViewModel
class MainViewModel @Inject constructor(
    private val timerRepo: TimerRepo,
) : ViewModel(){
companion object {
        private const val TAG = "MainViewModel"
    }
    private val timerLogic = TimerLogic(viewModelScope)
    val currentTimer = timerLogic.currentTime

    fun startTimer(){
        Log.i(TAG,"receiver success start")
        timerLogic.startTimer()
    }

    fun stopTimer(){
        Log.i(TAG,"receiver success stop")
        timerLogic.stopTimer()
    }

    fun setTimer(start : Clock, end : Clock){
        Log.i(TAG, "set time your time")
        timerLogic.setTimeSystem(start, end)
    }

    fun setSize(value: Int) {

    }

    fun setLocation(value: Int) {

    }

    fun setTheme(value: Int) {

    }


}