import { assert, test, testGroup } from "test/test_helper"

import Document from "trix/models/document"
import HTMLParser from "trix/models/html_parser"

testGroup("Document", () => {
  test("getStringAtRange does not leak trailing block breaks", () => {
    const document = Document.fromString("Hey")
    assert.equal(document.getStringAtRange([ 0, 0 ]), "")
    assert.equal(document.getStringAtRange([ 0, 1 ]), "H")
    assert.equal(document.getStringAtRange([ 0, 2 ]), "He")
    assert.equal(document.getStringAtRange([ 0, 3 ]), "Hey")
    assert.equal(document.getStringAtRange([ 0, 4 ]), "Hey\n")
  })

  test("findRangesForTextAttribute", () => {
    const document = HTMLParser.parse(
      `
      <p>Hello <strong>world, <em>this</em> is</strong> a <strong>test</strong>.<br></p>
    `
    ).getDocument()
    assert.deepEqual(document.findRangesForTextAttribute("bold"), [
      [ 6, 20 ],
      [ 23, 27 ],
    ])
    assert.deepEqual(document.findRangesForTextAttribute("italic"), [ [ 13, 17 ] ])
    assert.deepEqual(document.findRangesForTextAttribute("href"), [])
  })

  test("findRangesForTextAttribute withValue", () => {
    const document = HTMLParser.parse(
      `
      <p>Hello <a href="http://google.com/">world, <em>this</em> is</a> a <a href="http://basecamp.com/">test</a>.<br></p>
    `
    ).getDocument()
    assert.deepEqual(document.findRangesForTextAttribute("href"), [
      [ 6, 20 ],
      [ 23, 27 ],
    ])
    assert.deepEqual(document.findRangesForTextAttribute("href", { withValue: "http://google.com/" }), [ [ 6, 20 ] ])
    assert.deepEqual(document.findRangesForTextAttribute("href", { withValue: "http://basecamp.com/" }), [ [ 23, 27 ] ])
    assert.deepEqual(document.findRangesForTextAttribute("href", { withValue: "http://amazon.com/" }), [])
  })
})
