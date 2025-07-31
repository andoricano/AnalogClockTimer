package com.andro.analogclocktimer

import androidx.lifecycle.ViewModel
import com.andro.analogclocktimer.test.TestTool
import dagger.hilt.android.lifecycle.HiltViewModel
import javax.inject.Inject

@HiltViewModel
class MainViewModel @Inject constructor(
    private val testTool: TestTool
) : ViewModel() {
    companion object {
        private const val TAG = "MainViewModel"
    }
    fun useTool() {
        testTool.getTest(TAG)
    }
}