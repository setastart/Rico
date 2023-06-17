export const insertString = function (string) {
  getComposition().insertString(string)
  render()
}

export const insertText = function (text) {
  getComposition().insertText(text)
  render()
}

export const insertDocument = function (document) {
  getComposition().insertDocument(document)
  render()
}

export const replaceDocument = function (document) {
  getComposition().setDocument(document)
  render()
}


const render = () => getEditorController().render()
