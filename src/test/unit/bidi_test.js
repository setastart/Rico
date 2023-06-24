import { assert, test, testGroup } from "test/test_helper"
import { getDirection } from "rico/core/helpers"

testGroup("BIDI", () => {
  test("detects text direction", () => {
    assert.equal(getDirection("abc"), "ltr")
    assert.equal(getDirection("אבג"), "rtl")
  })
})
