// Explicitly require this file (not included in the main
// Rico bundle) to install the following global helpers.

this.getEditorElement = () => document.querySelector("rico-editor")

this.getToolbarElement = () => getEditorElement().toolbarElement

this.getEditorController = () => getEditorElement().editorController

this.getEditor = () => getEditorController().editor

this.getComposition = () => getEditorController().composition

this.getDocument = () => getComposition().document

this.getSelectionManager = () => getEditorController().selectionManager
