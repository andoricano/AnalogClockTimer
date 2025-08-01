package com.andro.analogclocktimer

import android.util.Log
import com.andro.analogclocktimer.data.Clock
import com.andro.analogclocktimer.data.getTimeNow
import com.andro.analogclocktimer.data.plusOneSecond
import kotlinx.coroutines.CoroutineScope
import kotlinx.coroutines.Job
import kotlinx.coroutines.delay
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.update
import kotlinx.coroutines.isActive
import kotlinx.coroutines.launch

/**
 * one session cycle
 * - setTime - start - over - end
 * - setTime - start - out - end
 * */
class TimerLogic (
    private val scope : CoroutineScope
) {
    companion object{
        private const val TAG = "TimerLogic"
    }

    //측정 중 현재 시간
    private val _currentTime = MutableStateFlow( getTimeNow())
    val currentTime : StateFlow<Clock>
        get() = _currentTime
    private var startTime = Clock(h = 0, m = 0, s = 0)
    private var endTime = Clock(h = 0, m = 0, s = 0)

    private var timerJob : Job? = null

    fun testUpdateClockTimer(c : Clock){
        _currentTime.update { c }
    }

    fun setTimeSystem(start : Clock, end : Clock){
        startTime = start
        endTime = end
        _currentTime.update { startTime }
    }

    //타이머 시작
    fun startTimer(){
        if(timerJob?.isActive == true) return
        timerJob = scope.launch {
            while(isActive){
                delay(1000)
                _currentTime.update{
                    currentTime.value.plusOneSecond()
                }
                Log.i(TAG, "current Time : ${currentTime.value}")
            }
        }
    }

    //타이머 정지
    fun stopTimer(){
        timerJob?.cancel()
        Log.i(TAG, "current Time : ${currentTime.value}")
    }

    //user out
    fun exitTimer(){
        timerJob?.cancel()
        endTimerSession()
    }

    //time over
    fun overTimer(){
        stopTimer()
    }

    //session out
    fun endTimerSession(){
        _currentTime.update { getTimeNow() }
    }
}