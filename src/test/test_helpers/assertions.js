import DocumentView from "rico/views/document_view"
import { normalizeRange } from "rico/core/helpers"

const { assert } = QUnit

assert.locationRange = function (start, end) {
  const expectedLocationRange = normalizeRange([ start, end ])
  const actualLocationRange = getEditorController().getLocationRange()
  this.deepEqual(actualLocationRange, expectedLocationRange)
}

assert.selectedRange = function (range) {
  const expectedRange = normalizeRange(range)
  const actualRange = getEditor().getSelectedRange()
  this.deepEqual(actualRange, expectedRange)
}

assert.textAttributes = function (range, attributes) {
  const document = window.getDocument().getDocumentAtRange(range)
  const blocks = document.getBlocks()
  if (blocks.length !== 1) {
    throw `range ${JSON.stringify(range)} spans more than one block`
  }

  const locationRange = window.getDocument().locationRangeFromRange(range)
  const textIndex = locationRange[0].index
  const textRange = [ locationRange[0].offset, locationRange[1].offset ]
  const text = window.getDocument().getTextAtIndex(textIndex).getTextAtRange(textRange)
  const pieces = text.getPieces()
  if (pieces.length !== 1) {
    throw `range ${JSON.stringify(range)} must only span one piece`
  }

  const piece = pieces[0]
  this.deepEqual(piece.getAttributes(), attributes)
}

assert.blockAttributes = function (range, attributes) {
  const document = window.getDocument().getDocumentAtRange(range)
  const blocks = document.getBlocks()
  if (blocks.length !== 1) {
    throw `range ${JSON.stringify(range)} spans more than one block`
  }

  const block = blocks[0]
  this.deepEqual(block.getAttributes(), attributes)
}

assert.documentHTMLEqual = function (ricoDocument, html) {
  this.equal(getHTML(ricoDocument), html)
}

const getHTML = (ricoDocument) => DocumentView.render(ricoDocument).innerHTML

export const expectDocument = (expectedDocumentValue, element) => {
  if (!element) element = getEditorElement()
  assert.equal(element.editor.getDocument().toString(), expectedDocumentValue)
}

export { assert, getHTML }
