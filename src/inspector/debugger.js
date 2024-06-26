/* eslint-disable
    id-length,
    no-empty,
*/

// This file is not included in the main Rico bundle and
// should be explicitly required to enable the debugger.

const DEBUG_METHODS = {
  AttachmentEditorController: [
    "didClickRemoveButton",
    "uninstall",
  ],

  "Rico.CompositionController": [
    "didClickAttachment"
  ],

  EditorController: [
    "setEditor",
    "loadDocument",
  ],

  "Rico.Level2InputController": [
    "elementDidMutate",
    "events.beforeinput",
    "events.input",
    "events.compositionend",
  ],

  "Rico.ToolbarController": [
    "didClickActionButton",
    "didClickAttributeButton",
    "didClickDialogButton",
    "didKeyDownDialogInput",
  ]
}

import { findClosestElementFromNode } from "rico/core/helpers"

let errorListeners = []

Rico.Debugger = {
  addErrorListener(listener) {
    if (!errorListeners.includes(listener)) {
      errorListeners.push(listener)
    }
  },

  removeErrorListener(listener) {
    errorListeners = errorListeners.filter((l) => l !== listener)
  },
}

const installMethodDebugger = function(className, methodName) {
  const [ objectName, ...constructorNames ] = className.split(".")

  const parts = methodName.split(".")
  const propertyNames = parts.slice(0, parts.length - 1)
  methodName = parts[parts.length - 1]

  let object = this[objectName]
  constructorNames.forEach((constructorName) => {
    object = object[constructorName]
  })
  object = object.prototype
  propertyNames.forEach((propertyName) => {
    object = object[propertyName]
  })

  if (typeof object?.[methodName] === "function") {
    object[methodName] = wrapFunctionWithErrorHandler(object[methodName])
  } else {
    throw new Error("Can't install on non-function")
  }
}

const wrapFunctionWithErrorHandler = function(fn) {
  const ricoDebugWrapper = function() {
    try {
      return fn.apply(this, arguments)
    } catch (error) {
      reportError(error)
      throw error
    }
  }
  return ricoDebugWrapper
}

const reportError = function(error) {
  Rico.Debugger.lastError = error

  console.error("Rico error!")
  console.log(error.stack)

  const { activeElement } = document
  const editorElement = findClosestElementFromNode(activeElement, { matchingSelector: "rico-editor" })

  if (editorElement) {
    notifyErrorListeners(error, editorElement)
  } else {
    console.warn("Can't find <rico-editor> element. document.activeElement =", activeElement)
  }
}

const notifyErrorListeners = (error, element) => {
  errorListeners.forEach((listener) => {
    try {
      listener(error, element)
    } catch (error1) {}
  })
}

(function() {
  console.groupCollapsed("Rico debugger")

  for (const className in DEBUG_METHODS) {
    const methodNames = DEBUG_METHODS[className]

    methodNames.forEach((methodName) => {
      try {
        installMethodDebugger(className, methodName)
        console.log(`✓ ${className}#${methodName}`)
      } catch (error) {
        console.warn(`✗ ${className}#${methodName}:`, error.message)
      }
    })
  }

  console.groupEnd()
})()
