import RicoObject from "rico/core/object" // Don't override window.Object

import { getDirection } from "rico/core/helpers"

import Piece from "rico/models/piece"
import StringPiece from "rico/models/string_piece"
import SplittableList from "rico/models/splittable_list"

import Hash from "rico/core/collections/hash"

export default class Text extends RicoObject {
  static textForStringWithAttributes(string, attributes) {
    const piece = new StringPiece(string, attributes)
    return new this([ piece ])
  }

  static fromJSON(textJSON) {
    const pieces = Array.from(textJSON).map((pieceJSON) => Piece.fromJSON(pieceJSON))
    return new this(pieces)
  }

  constructor(pieces = []) {
    super(...arguments)
    const notEmpty = pieces.filter((piece) => !piece.isEmpty())
    this.pieceList = new SplittableList(notEmpty)
  }

  copy() {
    return this.copyWithPieceList(this.pieceList)
  }

  copyWithPieceList(pieceList) {
    return new this.constructor(pieceList.consolidate().toArray())
  }

  copyUsingObjectMap(objectMap) {
    const pieces = this.getPieces().map((piece) => objectMap.find(piece) || piece)
    return new this.constructor(pieces)
  }

  appendText(text) {
    return this.insertTextAtPosition(text, this.getLength())
  }

  insertTextAtPosition(text, position) {
    return this.copyWithPieceList(this.pieceList.insertSplittableListAtPosition(text.pieceList, position))
  }

  removeTextAtRange(range) {
    return this.copyWithPieceList(this.pieceList.removeObjectsInRange(range))
  }

  replaceTextAtRange(text, range) {
    return this.removeTextAtRange(range).insertTextAtPosition(text, range[0])
  }

  moveTextFromRangeToPosition(range, position) {
    if (range[0] <= position && position <= range[1]) return
    const text = this.getTextAtRange(range)
    const length = text.getLength()
    if (range[0] < position) {
      position -= length
    }
    return this.removeTextAtRange(range).insertTextAtPosition(text, position)
  }

  addAttributeAtRange(attribute, value, range) {
    const attributes = {}
    attributes[attribute] = value
    return this.addAttributesAtRange(attributes, range)
  }

  addAttributesAtRange(attributes, range) {
    return this.copyWithPieceList(
      this.pieceList.transformObjectsInRange(range, (piece) => piece.copyWithAdditionalAttributes(attributes))
    )
  }

  removeAttributeAtRange(attribute, range) {
    return this.copyWithPieceList(
      this.pieceList.transformObjectsInRange(range, (piece) => piece.copyWithoutAttribute(attribute))
    )
  }

  setAttributesAtRange(attributes, range) {
    return this.copyWithPieceList(
      this.pieceList.transformObjectsInRange(range, (piece) => piece.copyWithAttributes(attributes))
    )
  }

  getAttributesAtPosition(position) {
    return this.pieceList.getObjectAtPosition(position)?.getAttributes() || {}
  }

  getCommonAttributes() {
    const objects = Array.from(this.pieceList.toArray()).map((piece) => piece.getAttributes())
    return Hash.fromCommonAttributesOfObjects(objects).toObject()
  }

  getCommonAttributesAtRange(range) {
    return this.getTextAtRange(range).getCommonAttributes() || {}
  }

  getExpandedRangeForAttributeAtOffset(attributeName, offset) {
    let right
    let left = right = offset
    const length = this.getLength()

    while (left > 0 && this.getCommonAttributesAtRange([ left - 1, right ])[attributeName]) {
      left--
    }
    while (right < length && this.getCommonAttributesAtRange([ offset, right + 1 ])[attributeName]) {
      right++
    }

    return [ left, right ]
  }

  getTextAtRange(range) {
    return this.copyWithPieceList(this.pieceList.getSplittableListInRange(range))
  }

  getStringAtRange(range) {
    return this.pieceList.getSplittableListInRange(range).toString()
  }

  getStringAtPosition(position) {
    return this.getStringAtRange([ position, position + 1 ])
  }

  startsWithString(string) {
    return this.getStringAtRange([ 0, string.length ]) === string
  }

  endsWithString(string) {
    const length = this.getLength()
    return this.getStringAtRange([ length - string.length, length ]) === string
  }

  getLength() {
    return this.pieceList.getEndPosition()
  }

  isEmpty() {
    return this.getLength() === 0
  }

  isEqualTo(text) {
    return super.isEqualTo(text) || text?.pieceList?.isEqualTo(this.pieceList)
  }

  isBlockBreak() {
    return this.getLength() === 1 && this.pieceList.getObjectAtIndex(0).isBlockBreak()
  }

  eachPiece(callback) {
    return this.pieceList.eachObject(callback)
  }

  getPieces() {
    return this.pieceList.toArray()
  }

  getPieceAtPosition(position) {
    return this.pieceList.getObjectAtPosition(position)
  }

  contentsForInspection() {
    return { pieceList: this.pieceList.inspect() }
  }

  toSerializableText() {
    const pieceList = this.pieceList.selectSplittableList((piece) => piece.isSerializable())
    return this.copyWithPieceList(pieceList)
  }

  toString() {
    return this.pieceList.toString()
  }

  toJSON() {
    return this.pieceList.toJSON()
  }

  toConsole() {
    return JSON.stringify(this.pieceList.toArray().map((piece) => JSON.parse(piece.toConsole())))
  }

  // BIDI

  getDirection() {
    return getDirection(this.toString())
  }

  isRTL() {
    return this.getDirection() === "rtl"
  }
}
