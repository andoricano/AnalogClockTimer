
COMMAND="$1"

if [[ -z "$COMMAND" ]]; then
  echo "Usage: $0 <command>"
  exit 1
fi

adb shell am broadcast \
  -a com.andro.analogclocktimer.ACTION_COMMAND \
  --es extra_command "$COMMAND" \
  -n com.andro.analogclocktimer/.test.TestReceiver