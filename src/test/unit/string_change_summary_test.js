import { assert, test, testGroup } from "test/test_helper"

import { summarizeStringChange } from "rico/core/helpers"

testGroup("summarizeStringChange", () => {
  const assertions = {
    "no change": {
      oldString: "abc",
      newString: "abc",
      change: { added: "", removed: "" },
    },
    "adding a character": {
      oldString: "",
      newString: "a",
      change: { added: "a", removed: "" },
    },
    "appending a character": {
      oldString: "ab",
      newString: "abc",
      change: { added: "c", removed: "" },
    },
    "appending a multibyte character": {
      oldString: "a💩",
      newString: "a💩💩",
      change: { added: "💩", removed: "" },
    },
    "prepending a character": {
      oldString: "bc",
      newString: "abc",
      change: { added: "a", removed: "" },
    },
    "inserting a character": {
      oldString: "ac",
      newString: "abc",
      change: { added: "b", removed: "" },
    },
    "inserting a string": {
      oldString: "ac",
      newString: "aZZZc",
      change: { added: "ZZZ", removed: "" },
    },
    "replacing a character": {
      oldString: "abc",
      newString: "aZc",
      change: { added: "Z", removed: "b" },
    },
    "replacing a character with a string": {
      oldString: "abc",
      newString: "aXYc",
      change: { added: "XY", removed: "b" },
    },
    "replacing a string with a character": {
      oldString: "abcde",
      newString: "aXe",
      change: { added: "X", removed: "bcd" },
    },
    "replacing a string with a string": {
      oldString: "abcde",
      newString: "aBCDe",
      change: { added: "BCD", removed: "bcd" },
    },
    "removing a character": {
      oldString: "abc",
      newString: "ac",
      change: { added: "", removed: "b" },
    },
  }

  for (const name in assertions) {
    test(name, () => {
      const details = assertions[name]
      const { oldString, newString, change } = details
      assert.deepEqual(summarizeStringChange(oldString, newString), change)
    })
  }
})
