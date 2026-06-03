package com.andro.analogclocktimer.data

data class Clock(val h: Int, val m: Int, val s: Int)

fun getTimeNow(): Clock {
    val cal = java.util.Calendar.getInstance().apply {
        timeInMillis = System.currentTimeMillis()
    }
    val clock = Clock(
        h = cal.get(java.util.Calendar.HOUR_OF_DAY),
        m = cal.get(java.util.Calendar.MINUTE),
        s = cal.get(java.util.Calendar.SECOND)
    )
    return clock
}

/**return new instance*/
fun Clock.plusOneSecond(): Clock {
    val total = h * 3600 + m * 60 + s + 1
    val newH = (total / 3600) % 24
    val newM = (total / 60) % 60
    val newS = total % 60
    return Clock(newH, newM, newS)
}