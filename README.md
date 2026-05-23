# Timer

A native Linux timer extension for Vicinae, built with React and TypeScript. It supports natural language input,
background execution, and customizable presets.

## Requirements

This extension relies heavily on native Linux utilities. It will **not** work on macOS or Windows. This is obviously not
because Vicinae itself does not support these platforms.

- **systemd:** Background timers use `systemd-run` transient timers. Your Linux distribution must use `systemd`.
- **libnotify:** Requires `notify-send` for desktop notifications.

## Features

- Timers are managed by `systemd`, ensuring they track absolute time and trigger correctly even if your system goes to sleep.
- Supports flexible time inputs and optional notes directly in the search bar.
- Define frequently used timers in the extension preferences.
- Active timers survive Vicinae UI restarts via the Cache API.

## Usage

Type a duration and an optional note into the search bar:

- `5` -> 5 minutes
- `45s` -> 45 seconds
- `1:30` -> 1 minute, 30 seconds
- `2h Deep work` -> 2 hours with the note "Deep work"
- `15m Check laundry` -> 15 minutes with the note "Check laundry"

Active timers are displayed in the main list, showing the remaining countdown and the absolute completion time. You can
cancel individual timers or use the `Ctrl + Shift + Backspace` shortcut to cancel all.

## Configuration

Configure the extension via Vicinae Preferences:

- **Timer Presets:** A comma-separated list of your favorite timers.  
  _Example:_ `5m Tea, 25m Pomodoro, 1h Focus`
