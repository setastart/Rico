import Rico from "rico/rico"

export * from "rico/core/helpers/functions"
export * from "rico/core/helpers/global"
export * from "./test_helpers/event_helpers"
export * from "./test_helpers/assertions"
export * from "./test_helpers/test_helpers"
export * from "./test_helpers/test_stubs"
export * from "./test_helpers/functions"
export * from "./test_helpers/fixtures/fixtures"
export * from "./test_helpers/event_helpers"
export * from "./test_helpers/input_helpers"
export * from "./test_helpers/editor_helpers"
export * from "./test_helpers/toolbar_helpers"
export * from "./test_helpers/selection_helpers"

window.Rico = Rico
Rico.config.undo.interval = 0

QUnit.config.hidepassed = true
QUnit.config.testTimeout = 20000

document.head.insertAdjacentHTML(
  "beforeend",
  `<style type="text/css">
    #rico-container { height: 150px; }
    rico-toolbar { margin-bottom: 10px; }
    rico-toolbar button { border: 1px solid #ccc; background: #fff; }
    rico-toolbar button.active { background: #d3e6fd; }
    rico-toolbar button:disabled { color: #ccc; }
    #qunit { position: relative !important; }
  </style>`
)
