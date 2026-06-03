package com.andro.analogclocktimer

import android.content.Context
import dagger.hilt.android.qualifiers.ApplicationContext
import javax.inject.Inject
import javax.inject.Singleton


@Singleton
class TimerRepo @Inject constructor(
    @ApplicationContext private val context: Context
) {

}