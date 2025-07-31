package com.andro.analogclocktimer.test

import android.content.Context
import android.util.Log
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

    fun getTest(tag : String){
        Log.i(TAG, "getTest : $tag")
    }
}