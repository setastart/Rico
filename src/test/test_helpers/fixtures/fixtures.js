import * as config from "rico/config"
import { ZERO_WIDTH_SPACE } from "rico/constants"
import { makeElement } from "rico/core/helpers"

import Text from "rico/models/text"
import Block from "rico/models/block"
import Document from "rico/models/document"
import StringPiece from "rico/models/string_piece"

import editorDefaultAriaLabel from "./editor_default_aria_label"
import editorEmpty from "./editor_empty"
import editorHtml from "./editor_html"
import editorInTable from "./editor_in_table"
import editorWithBlockStyles from "./editor_with_block_styles"
import editorWithBoldStyles from "./editor_with_bold_styles"
import editorWithImage from "./editor_with_image"
import editorWithLabels from "./editor_with_labels"
import editorWithStyledContent from "./editor_with_styled_content"
import editorWithToolbarAndInput from "./editor_with_toolbar_and_input"
import editorsWithForms from "./editors_with_forms"
import { TEST_IMAGE_URL } from "./test_image_url"

export const fixtureTemplates = {
  "editor_default_aria_label": editorDefaultAriaLabel,
  "editor_empty": editorEmpty,
  "editor_html": editorHtml,
  "editor_in_table": editorInTable,
  "editor_with_block_styles": editorWithBlockStyles,
  "editor_with_bold_styles": editorWithBoldStyles,
  "editor_with_image": editorWithImage,
  "editor_with_labels": editorWithLabels,
  "editor_with_styled_content": editorWithStyledContent,
  "editor_with_toolbar_and_input": editorWithToolbarAndInput,
  "editors_with_forms": editorsWithForms,
}

export { TEST_IMAGE_URL }

const createDocument = function (...parts) {
  const blocks = parts.map((part) => {
    const [ string, textAttributes, blockAttributes ] = Array.from(part)
    const text = Text.textForStringWithAttributes(string, textAttributes)
    return new Block(text, blockAttributes)
  })

  return new Document(blocks)
}

export const createCursorTarget = (name) =>
  makeElement({
    tagName: "span",
    textContent: ZERO_WIDTH_SPACE,
    data: {
      ricoCursorTarget: name,
      ricoSerialize: false,
    },
  })

const cursorTargetLeft = createCursorTarget("left").outerHTML
const cursorTargetRight = createCursorTarget("right").outerHTML

const blockComment = "<!--block-->"

const removeWhitespace = (string) => string.replace(/\s/g, "")

export const fixtures = {
  "bold text": {
    document: createDocument([ "abc", { bold: true } ]),
    html: `<p>${blockComment}<strong>abc</strong></p>`,
    serializedHTML: "<p><strong>abc</strong></p>",
  },

  "bold, italic text": {
    document: createDocument([ "abc", { bold: true, italic: true } ]),
    html: `<p>${blockComment}<strong><em>abc</em></strong></p>`,
  },

  "text with newline": {
    document: createDocument([ "ab\nc" ]),
    html: `<p>${blockComment}ab<br>c</p>`,
  },

  "text with link": {
    document: createDocument([ "abc", { href: "http://example.com" } ]),
    html: `<p>${blockComment}<a href="http://example.com">abc</a></p>`,
  },

  "text with link and formatting": {
    document: createDocument([ "abc", { italic: true, href: "http://example.com" } ]),
    html: `<p>${blockComment}<a href="http://example.com"><em>abc</em></a></p>`,
  },

  "partially formatted link": {
    document: new Document([
      new Block(
        new Text([
          new StringPiece("ab", { href: "http://example.com" }),
          new StringPiece("c", { href: "http://example.com", italic: true }),
        ])
      ),
    ]),
    html: `<p>${blockComment}<a href="http://example.com">ab<em>c</em></a></p>`,
  },

  "spaces 1": {
    document: createDocument([ " a" ]),
    html: `<p>${blockComment}&nbsp;a</p>`,
  },

  "spaces 2": {
    document: createDocument([ "  a" ]),
    html: `<p>${blockComment}&nbsp; a</p>`,
  },

  "spaces 3": {
    document: createDocument([ "   a" ]),
    html: `<p>${blockComment}&nbsp; &nbsp;a</p>`,
  },

  "spaces 4": {
    document: createDocument([ " a " ]),
    html: `<p>${blockComment}&nbsp;a&nbsp;</p>`,
  },

  "spaces 5": {
    document: createDocument([ "a  b" ]),
    html: `<p>${blockComment}a&nbsp; b</p>`,
  },

  "spaces 6": {
    document: createDocument([ "a   b" ]),
    html: `<p>${blockComment}a &nbsp; b</p>`,
  },

  "spaces 7": {
    document: createDocument([ "a    b" ]),
    html: `<p>${blockComment}a&nbsp; &nbsp; b</p>`,
  },

  "spaces 8": {
    document: createDocument([ "a b " ]),
    html: `<p>${blockComment}a b&nbsp;</p>`,
  },

  "spaces 9": {
    document: createDocument([ "a b c" ]),
    html: `<p>${blockComment}a b c</p>`,
  },

  "spaces 10": {
    document: createDocument([ "a " ]),
    html: `<p>${blockComment}a&nbsp;</p>`,
  },

  "spaces 11": {
    document: createDocument([ "a  " ]),
    html: `<p>${blockComment}a &nbsp;</p>`,
  },

  "spaces and formatting": {
    document: new Document([
      new Block(
        new Text([
          new StringPiece(" a "),
          new StringPiece("b", { href: "http://b.com" }),
          new StringPiece(" "),
          new StringPiece("c", { bold: true }),
          new StringPiece(" d"),
          new StringPiece(" e ", { italic: true }),
          new StringPiece(" f  "),
        ])
      ),
    ]),
    html: `<p>${blockComment}&nbsp;a <a href="http://b.com">b</a> <strong>c</strong> d<em> e </em>&nbsp;f &nbsp;</p>`,
  },

  "quote formatted block": {
    document: createDocument([ "abc", {}, [ "quote" ] ]),
    html: `<blockquote>${blockComment}abc</blockquote>`,
  },

  "code formatted block": {
    document: createDocument([ "123", {}, [ "code" ] ]),
    html: `<pre>${blockComment}123</pre>`,
  },

  "code with newline": {
    document: createDocument([ "12\n3", {}, [ "code" ] ]),
    html: `<pre>${blockComment}12\n3</pre>`,
  },

  "multiple blocks with block comments in their text": {
    document: createDocument([ `a${blockComment}b`, {}, [ "quote" ] ], [ `${blockComment}c`, {}, [ "code" ] ]),
    html: `<blockquote>${blockComment}a&lt;!--block--&gt;b</blockquote><pre>${blockComment}&lt;!--block--&gt;c</pre>`,
    serializedHTML: "<blockquote>a&lt;!--block--&gt;b</blockquote><pre>&lt;!--block--&gt;c</pre>",
  },

  "unordered list with one item": {
    document: createDocument([ "a", {}, [ "bulletList", "bullet" ] ]),
    html: `<ul><li>${blockComment}a</li></ul>`,
  },

  "unordered list with bold text": {
    document: createDocument([ "a", { bold: true }, [ "bulletList", "bullet" ] ]),
    html: `<ul><li>${blockComment}<strong>a</strong></li></ul>`,
  },

  "unordered list with partially formatted text": {
    document: new Document([
      new Block(new Text([ new StringPiece("a"), new StringPiece("b", { italic: true }) ]), [ "bulletList", "bullet" ]),
    ]),
    html: `<ul><li>${blockComment}a<em>b</em></li></ul>`,
  },

  "unordered list with two items": {
    document: createDocument([ "a", {}, [ "bulletList", "bullet" ] ], [ "b", {}, [ "bulletList", "bullet" ] ]),
    html: `<ul><li>${blockComment}a</li><li>${blockComment}b</li></ul>`,
  },

  "unordered list surrounded by unformatted blocks": {
    document: createDocument([ "a" ], [ "b", {}, [ "bulletList", "bullet" ] ], [ "c" ]),
    html: `<p>${blockComment}a</p><ul><li>${blockComment}b</li></ul><p>${blockComment}c</p>`,
  },

  "ordered list": {
    document: createDocument([ "a", {}, [ "numberList", "number" ] ]),
    html: `<ol><li>${blockComment}a</li></ol>`,
  },

  "ordered list and an unordered list": {
    document: createDocument([ "a", {}, [ "bulletList", "bullet" ] ], [ "b", {}, [ "numberList", "number" ] ]),
    html: `<ul><li>${blockComment}a</li></ul><ol><li>${blockComment}b</li></ol>`,
  },

  "empty block with attributes": {
    document: createDocument([ "", {}, [ "quote" ] ]),
    html: `<blockquote>${blockComment}<br></blockquote>`,
  },

  "nested quote and code formatted block": {
    document: createDocument([ "ab3", {}, [ "quote", "code" ] ]),
    html: `<blockquote><pre>${blockComment}ab3</pre></blockquote>`,
  },

  "nested code and quote formatted block": {
    document: createDocument([ "ab3", {}, [ "code", "quote" ] ]),
    html: `<pre><blockquote>${blockComment}ab3</blockquote></pre>`,
  },

  "nested code blocks in quote": {
    document: createDocument(
      [ "a\n", {}, [ "quote" ] ],
      [ "b", {}, [ "quote", "code" ] ],
      [ "\nc\n", {}, [ "quote" ] ],
      [ "d", {}, [ "quote", "code" ] ]
    ),
    html: removeWhitespace(
      `<blockquote>
        ${blockComment}
        a
        <br>
        <br>
        <pre>
          ${blockComment}
          b
        </pre>
        ${blockComment}
        <br>
        c
        <br>
        <br>
        <pre>
          ${blockComment}
          d
        </pre>
      </blockquote>`
    ),
    serializedHTML: removeWhitespace(
      `<blockquote>
        a
        <br>
        <br>
        <pre>
          b
        </pre>
        <br>
        c
        <br>
        <br>
        <pre>
          d
        </pre>
      </blockquote>`
    ),
  },

  "nested code, quote, and list in quote": {
    document: createDocument(
      [ "a\n", {}, [ "quote" ] ],
      [ "b", {}, [ "quote", "code" ] ],
      [ "\nc\n", {}, [ "quote" ] ],
      [ "d", {}, [ "quote", "quote" ] ],
      [ "\ne\n", {}, [ "quote" ] ],
      [ "f", {}, [ "quote", "bulletList", "bullet" ] ]
    ),
    html: removeWhitespace(
      `<blockquote>
        ${blockComment}
        a
        <br>
        <br>
        <pre>
          ${blockComment}
          b
        </pre>
        ${blockComment}
        <br>
        c
        <br>
        <br>
        <blockquote>
          ${blockComment}
          d
        </blockquote>
        ${blockComment}
        <br>
        e
        <br>
        <br>
        <ul>
          <li>
            ${blockComment}
            f
          </li>
        </ul>
      </blockquote>`
  ),
    serializedHTML: removeWhitespace(
      `<blockquote>
        a
        <br>
        <br>
        <pre>
          b
        </pre>
        <br>
        c
        <br>
        <br>
        <blockquote>
          d
        </blockquote>
        <br>
        e
        <br>
        <br>
        <ul>
          <li>
            f
          </li>
        </ul>
      </blockquote>`
    ),
  },

  "nested quotes at different nesting levels": {
    document: createDocument(
      [ "a", {}, [ "quote", "quote", "quote" ] ],
      [ "b", {}, [ "quote", "quote" ] ],
      [ "c", {}, [ "quote" ] ],
      [ "d", {}, [ "quote", "quote" ] ]
    ),
    html: removeWhitespace(
      `<blockquote>
        <blockquote>
          <blockquote>
            ${blockComment}
            a
          </blockquote>
          ${blockComment}
          b
        </blockquote>
        ${blockComment}
        c
        <blockquote>
          ${blockComment}
          d
        </blockquote>
      </blockquote>`
    ),
    serializedHTML: removeWhitespace(
      `<blockquote>
        <blockquote>
          <blockquote>
            a
          </blockquote>
          b
        </blockquote>
        c
        <blockquote>
          d
        </blockquote>
      </blockquote>`
    ),
  },

  "nested quote and list": {
    document: createDocument([ "ab3", {}, [ "quote", "bulletList", "bullet" ] ]),
    html: `<blockquote><ul><li>${blockComment}ab3</li></ul></blockquote>`,
  },

  "nested list and quote": {
    document: createDocument([ "ab3", {}, [ "bulletList", "bullet", "quote" ] ]),
    html: `<ul><li><blockquote>${blockComment}ab3</blockquote></li></ul>`,
  },

  "nested lists and quotes": {
    document: createDocument(
      [ "a", {}, [ "bulletList", "bullet", "quote" ] ],
      [ "b", {}, [ "bulletList", "bullet", "quote" ] ]
    ),
    html: `<ul><li><blockquote>${blockComment}a</blockquote></li><li><blockquote>${blockComment}b</blockquote></li></ul>`,
  },

  "nested quote and list with two items": {
    document: createDocument(
      [ "a", {}, [ "quote", "bulletList", "bullet" ] ],
      [ "b", {}, [ "quote", "bulletList", "bullet" ] ]
    ),
    html: `<blockquote><ul><li>${blockComment}a</li><li>${blockComment}b</li></ul></blockquote>`,
  },

  "nested unordered lists": {
    document: createDocument(
      [ "a", {}, [ "bulletList", "bullet" ] ],
      [ "b", {}, [ "bulletList", "bullet", "bulletList", "bullet" ] ],
      [ "c", {}, [ "bulletList", "bullet", "bulletList", "bullet" ] ]
    ),
    html: `<ul><li>${blockComment}a<ul><li>${blockComment}b</li><li>${blockComment}c</li></ul></li></ul>`,
  },

  "nested lists": {
    document: createDocument(
      [ "a", {}, [ "numberList", "number" ] ],
      [ "b", {}, [ "numberList", "number", "bulletList", "bullet" ] ],
      [ "c", {}, [ "numberList", "number", "bulletList", "bullet" ] ]
    ),
    html: `<ol><li>${blockComment}a<ul><li>${blockComment}b</li><li>${blockComment}c</li></ul></li></ol>`,
  },

  "blocks beginning with newlines": {
    document: createDocument([ "\na", {}, [ "quote" ] ], [ "\nb", {}, [] ], [ "\nc", {}, [ "quote" ] ]),
    html: `<blockquote>${blockComment}<br>a</blockquote><p>${blockComment}<br>b</p><blockquote>${blockComment}<br>c</blockquote>`,
  },

  "blocks beginning with formatted text": {
    document: createDocument(
      [ "a", { bold: true }, [ "quote" ] ],
      [ "b", { italic: true }, [] ],
      [ "c", { bold: true }, [ "quote" ] ]
    ),
    html: `<blockquote>${blockComment}<strong>a</strong></blockquote><p>${blockComment}<em>b</em></p><blockquote>${blockComment}<strong>c</strong></blockquote>`,
  },

  "text with newlines before block": {
    document: createDocument([ "a\nb" ], [ "c", {}, [ "quote" ] ]),
    html: `<p>${blockComment}a<br>b</p><blockquote>${blockComment}c</blockquote>`,
  },

  "empty heading block": {
    document: createDocument([ "", {}, [ "heading1" ] ]),
    html: `<h1>${blockComment}<br></h1>`,
  },

  "two adjacent headings": {
    document: createDocument([ "a", {}, [ "heading1" ] ], [ "b", {}, [ "heading1" ] ]),
    html: `<h1>${blockComment}a</h1><h1>${blockComment}b</h1>`,
  },

  "heading in ordered list": {
    document: createDocument([ "a", {}, [ "numberList", "number", "heading1" ] ]),
    html: `<ol><li><h1>${blockComment}a</h1></li></ol>`,
  },

  "headings with formatted text": {
    document: createDocument([ "a", { bold: true }, [ "heading1" ] ], [ "b", { italic: true, bold: true }, [ "heading1" ] ]),
    html: `<h1>${blockComment}<strong>a</strong></h1><h1>${blockComment}<strong><em>b</em></strong></h1>`,
  },

  "bidrectional text": {
    document: createDocument(
      [ "a" ],
      [ "ل", {}, [ "quote" ] ],
      [ "b", {}, [ "bulletList", "bullet" ] ],
      [ "ל", {}, [ "bulletList", "bullet" ] ],
      [ "", {}, [ "bulletList", "bullet" ] ],
      [ "cید" ],
      [ "\n گ" ]
    ),
    html: `<p>${blockComment}a</p>\
<blockquote dir="rtl">${blockComment}ل</blockquote>\
<ul><li>${blockComment}b</li></ul>\
<ul dir="rtl"><li>${blockComment}ל</li><li>${blockComment}<br></li></ul>\
<p>${blockComment}cید</p>\
<p dir="rtl">${blockComment}<br>&nbsp;گ</p>\
`,
    serializedHTML:
      "\
<p>a</p>\
<blockquote dir=\"rtl\">ل</blockquote>\
<ul><li>b</li></ul>\
<ul dir=\"rtl\"><li>ל</li><li><br></li></ul>\
<p>cید</p>\
<p dir=\"rtl\"><br>&nbsp;گ</p>\
",
  },
}

export const eachFixture = (callback) => {
  for (const name in fixtures) {
    const details = fixtures[name]
    callback(name, details)
  }
}
