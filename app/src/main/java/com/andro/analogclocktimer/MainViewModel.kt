package com.andro.analogclocktimer

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
}