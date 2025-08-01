package com.andro.analogclocktimer

import android.util.Log
import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
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


}