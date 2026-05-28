import { exec } from "node:child_process"

/**
 * Initiates a timer that will notify the user after a specified number of seconds.
 * @param seconds
 * @param note
 */
export function createTimer(seconds: number, note: string) {
  if (!Number.isSafeInteger(seconds)) throw new Error("seconds must be an integer")
  if (seconds <= 0) throw new Error("seconds must be positive")

  if (!note) throw new Error("note is required")

  const id = Date.now().toString()
  const unitName = `vicinae-timer-${id}`

  const cmd = `systemd-run --user --on-active="${seconds}s" --timer-property=AccuracySec=1s --unit="${unitName}" --property=Description="${note}" -- ${getNotifyCmd(note)}`

  exec(cmd, error => {
    if (error) throw error
  })

  return { id, unitName }
}

/**
 * Cancels a timer that was previously started.
 * @param unitName
 */
export function cancelTimer(unitName: string) {
  if (!unitName) throw new Error("unitName is required")
  exec(`systemctl --user stop ${unitName}.timer`, error => {
    if (error) throw error
  })
}

/**
 * Returns the command to notify the user.
 * @param note
 */
export function getNotifyCmd(note: string) {
  if (!note) throw new Error("note is required")

  return `/bin/bash -c 'notify-send -a "Vicinae" "Timer" "${note}"'`
}
