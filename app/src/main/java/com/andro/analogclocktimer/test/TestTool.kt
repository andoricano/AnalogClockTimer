package com.andro.analogclocktimer.test

import android.content.Context
import android.util.Log
import com.andro.analogclocktimer.MainViewModel
import dagger.hilt.android.qualifiers.ApplicationContext
import javax.inject.Inject
import javax.inject.Singleton

@Singleton
class TestTool @Inject constructor(
    @ApplicationContext private val context: Context
) {
    companion object{
        private const val TAG = "TestTool-->"
    }

    init{
        Log.i(TAG, "$TAG Start!")
    }
    val mainViewModel : MainViewModel? = null

    fun getTest(tag : String){
        Log.i(TAG, "getTest : $tag")
    }
}