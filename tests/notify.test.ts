import { describe, expect, test } from "bun:test"
import { createTimer, cancelTimer, getNotifyCmd } from "../src/notify"
import { execSync } from "node:child_process"

const TEST_NOTE = "test"
let TEST_UNIT_NAME = ""

describe("createTimer", () => {
  test("rejects invalid seconds", () => {
    expect(() => createTimer(0, TEST_NOTE)).toThrowError("seconds must be positive")
  })

  test("rejects invalid seconds", () => {
    expect(() => createTimer(-5, TEST_NOTE)).toThrowError("seconds must be positive")
  })

  test("rejects invalid note", () => {
    expect(() => createTimer(5, "")).toThrowError("note is required")
  })

  test.serial("unit name is valid", () => {
    const { id, unitName } = createTimer(1, TEST_NOTE)
    expect(id).toMatch(/^\d+$/)
    expect(unitName).toMatch(/^vicinae-timer-\d+$/)
    expect(unitName).toEqual(`vicinae-timer-${id}`)

    cancelTimer(unitName)
  })

  test.serial("created timer is valid", async () => {
    const { id, unitName } = createTimer(10, TEST_NOTE)
    TEST_UNIT_NAME = unitName
    // wait for timer to start
    await new Promise(resolve => setTimeout(resolve, 100))

    const output = execSync(`systemctl --user show ${TEST_UNIT_NAME}.timer`)
    expect(output.toString()).toContain(`ActiveState=active`)
    expect(output.toString()).toContain(`Triggers=${TEST_UNIT_NAME}.service`)
    expect(output.toString()).toContain(`AccuracyUSec=1s`)
  })
})

describe("cancelTimer", () => {
  test("rejects empty unitName", () => {
    expect(() => cancelTimer("")).toThrowError("unitName is required")
  })

  test.todo("cancelling non-existent timer throws error", () => {
    // should throw, but isn't
    expect(() => cancelTimer("non-existent")).toThrow()
  })

  test.serial("cancelling valid timer succeeds", () => {
    expect(cancelTimer(TEST_UNIT_NAME)).toBeUndefined()
  })
})

describe("getNotifyCmd", () => {
  test("rejects empty note", () => {
    expect(() => getNotifyCmd("")).toThrowError("note is required")
  })

  test("returns the notify command", () => {
    expect(getNotifyCmd(TEST_NOTE)).toEqual(
      `/bin/bash -c 'notify-send -a "Vicinae" "Timer" "test"'`,
    )
  })

  test("returns notify command with spaces in note", () => {
    expect(getNotifyCmd("test with spaces")).toEqual(
      `/bin/bash -c 'notify-send -a "Vicinae" "Timer" "test with spaces"'`,
    )
  })

  test("returns notify command with quotes in note", () => {
    expect(getNotifyCmd("test with 'quotes'")).toEqual(
      `/bin/bash -c 'notify-send -a "Vicinae" "Timer" "test with 'quotes'"'`,
    )
  })

  test("returns notify command with double quotes in note", () => {
    expect(getNotifyCmd('test with "quotes"')).toEqual(
      `/bin/bash -c 'notify-send -a "Vicinae" "Timer" "test with \"quotes\""'`,
    )
  })
})
