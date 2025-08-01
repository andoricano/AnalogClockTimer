#!/bin/bash

COMMAND=${1:-start}

case "$COMMAND" in
  start|stop)
    ;;
  size[0-9]*|location[0-9]*|theme[0-9]*)
    ;;
  setTimer[0-9][0-9][0-9][0-9][0-9][0-9],[0-9][0-9][0-9][0-9][0-9][0-9])
    ;;
  *)
    echo "Usage: $0 start|stop|sizeN|locationN|themeN|setTimerXXXXXX,XXXXXX"
    exit 1
    ;;
esac

adb shell am broadcast -a com.andro.analogclocktimer.ACTION_COMMAND --es extra_command "$COMMAND" -n com.andro.analogclocktimer/.test.TestReceiver
