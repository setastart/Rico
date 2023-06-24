import { triggerEvent } from "./event_helpers"
import { selectionChangeObserver } from "rico/observers/selection_change_observer"
import { delay, nextFrame } from "./timing_helpers"

export const clickToolbarButton = async (selector) => {
  selectionChangeObserver.update()
  const button = getToolbarButton(selector)
  triggerEvent(button, "mousedown")
  await delay(5)
}

export const typeToolbarKeyCommand = async (selector) => {
  const button = getToolbarButton(selector)
  const { ricoKey } = button.dataset
  if (ricoKey) {
    const keyCode = ricoKey.toUpperCase().charCodeAt(0)
    triggerEvent(getEditorElement(), "keydown", { keyCode, charCode: 0, metaKey: true, ctrlKey: true })
  }
  await nextFrame()
}

export const clickToolbarDialogButton = async ({ method }) => {
  const button = getToolbarElement().querySelector(`[data-rico-dialog] [data-rico-method='${method}']`)
  triggerEvent(button, "click")
  await nextFrame()
}

export const isToolbarButtonActive = function (selector) {
  const button = getToolbarButton(selector)
  return button.hasAttribute("data-rico-active") && button.classList.contains("rico-active")
}

export const isToolbarButtonDisabled = (selector) => getToolbarButton(selector).disabled

export const typeInToolbarDialog = async (string, { attribute }) => {
  const dialog = getToolbarDialog({ attribute })
  const input = dialog.querySelector(`[data-rico-input][name='${attribute}']`)
  const button = dialog.querySelector("[data-rico-method='setAttribute']")
  input.value = string
  triggerEvent(button, "click")
  await nextFrame()
}

export const isToolbarDialogActive = function (selector) {
  const dialog = getToolbarDialog(selector)
  return dialog.hasAttribute("data-rico-active") && dialog.classList.contains("rico-active")
}

const getToolbarButton = ({ attribute, action }) =>
  getToolbarElement().querySelector(`[data-rico-attribute='${attribute}'], [data-rico-action='${action}']`)

const getToolbarDialog = ({ attribute, action }) => getToolbarElement().querySelector(`[data-rico-dialog='${attribute}']`)
