package com.andro.analogclocktimer

import android.content.Context
import android.graphics.Bitmap
import android.graphics.BitmapFactory
import android.net.Uri
import android.util.Log
import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import com.andro.analogclocktimer.data.Clock
import dagger.hilt.android.lifecycle.HiltViewModel
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.asStateFlow
import kotlinx.coroutines.flow.update
import kotlinx.coroutines.launch
import kotlinx.coroutines.withContext
import javax.inject.Inject

@HiltViewModel
class MainViewModel @Inject constructor(
    private val timerRepo: TimerRepo,
) : ViewModel(){
    companion object {
        private const val TAG = "MainViewModel"
    }
    private val _renderingBitmap = MutableStateFlow<Bitmap?>(null)
    val renderingBitmap: StateFlow<Bitmap?> = _renderingBitmap.asStateFlow()

    private val _savedBitmap = MutableStateFlow<Bitmap?>(null)
    val savedBitmap: StateFlow<Bitmap?> = _savedBitmap.asStateFlow()

    fun changeThemeBg() {
        _savedBitmap.value = _renderingBitmap.value
        Log.i(TAG, "savedBitmap updated: ${_savedBitmap.value}")
    }

    fun loadBitmapFromUri(context: Context, uri: Uri) {
        viewModelScope.launch(Dispatchers.IO) {
            val bitmap = context.contentResolver.openInputStream(uri)?.use {
                BitmapFactory.decodeStream(it)
            }
            bitmap?.let {
                val circularBitmap = getCircularBitmap(it)
                withContext(Dispatchers.Main) {
                    _renderingBitmap.value = circularBitmap
                }
            }
        }
    }

    fun getCircularBitmap(src: Bitmap): Bitmap {
        val size = minOf(src.width, src.height)
        val output = Bitmap.createBitmap(size, size, Bitmap.Config.ARGB_8888)
        val canvas = android.graphics.Canvas(output)
        val paint = android.graphics.Paint().apply { isAntiAlias = true }
        val rect = android.graphics.Rect(0, 0, size, size)
        val rectF = android.graphics.RectF(rect)

        canvas.drawARGB(0, 0, 0, 0)
        canvas.drawOval(rectF, paint)

        paint.xfermode = android.graphics.PorterDuffXfermode(android.graphics.PorterDuff.Mode.SRC_IN)
        val left = (src.width - size) / 2
        val top = (src.height - size) / 2
        canvas.drawBitmap(src, -left.toFloat(), -top.toFloat(), paint)

        return output
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

    fun setCurrentTime(c : Clock){
        timerLogic.testUpdateClockTimer(c)
    }

}