import {
  TEST_IMAGE_URL,
  assert,
  createCursorTarget,
  eachFixture,
  fixtures,
  getHTML,
  test,
  testGroup,
} from "test/test_helper"

import * as config from "trix/config"
import HTMLParser from "trix/models/html_parser"
import { delay } from "../test_helpers/timing_helpers"

const cursorTargetLeft = createCursorTarget("left").outerHTML
const cursorTargetRight = createCursorTarget("right").outerHTML

testGroup("HTMLParser", () => {
  eachFixture((name, { html, serializedHTML, document }) => {
    test(name, () => {
      const parsedDocument = HTMLParser.parse(html).getDocument()
      assert.documentHTMLEqual(parsedDocument.copyUsingObjectsFromDocument(document), html)
    })
  })

  eachFixture((name, { html, serializedHTML, document }) => {
    if (serializedHTML) {
      test(`${name} (serialized)`, () => {
        const parsedDocument = HTMLParser.parse(serializedHTML).getDocument()
        assert.documentHTMLEqual(parsedDocument.copyUsingObjectsFromDocument(document), html)
      })
    }
  })

  testGroup("nested line breaks", () => {
    const cases = {
      "<div>a<div>b</div>c</div>": "<p><!--block-->a<br>b<br>c</p>",
      "<div>a<div><div><div>b</div></div></div>c</div>": "<p><!--block-->a<br>b<br>c</p>",
      "<blockquote>a<div>b</div>c</blockquote>": "<blockquote><!--block-->a<br>b<br>c</blockquote>",
    }
    // TODO:
    // "<div><div>a</div><div>b</div>c</div>": "<div><!--block-->a<br>b<br>c</div>"
    // "<blockquote><div>a</div><div>b</div><div>c</div></blockquote>": "<blockquote><!--block-->a<br>b<br>c</blockquote>"
    // "<blockquote><div>a<br></div><div><br></div><div>b<br></div></blockquote>": "<blockquote><!--block-->a<br><br>b</blockquote>"

    for (const [ html, expectedHTML ] of Object.entries(cases)) {
      test(html, () => {
        assert.documentHTMLEqual(HTMLParser.parse(html).getDocument(), expectedHTML)
      })
    }
  })

  test("parses unfamiliar html", () => {
    const html =
      "<meta charset=\"UTF-8\"><span style=\"font-style: italic\">abc</span><span>d</span><section style=\"margin:0\"><blink>123</blink><a href=\"http://example.com\">45<b>6</b></a>x<br />y</section><p style=\"margin:0\">9</p>"
    const expectedHTML =
      "<p><!--block--><em>abc</em>d</p><p><!--block-->123<a href=\"http://example.com\">45<strong>6</strong></a>x<br>y</p><p><!--block-->9</p>"
    assert.documentHTMLEqual(HTMLParser.parse(html).getDocument(), expectedHTML)
  })

  test("ignores leading whitespace before <meta> tag", () => {
    const html = " \n <meta charset=\"UTF-8\"><pre>abc</pre>"
    const expectedHTML = "<pre><!--block-->abc</pre>"
    assert.documentHTMLEqual(HTMLParser.parse(html).getDocument(), expectedHTML)
  })

  test("ignores content after </html>", () => {
    const html = `
      <html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:w="urn:schemas-microsoft-com:office:word" xmlns:m="http://schemas.microsoft.com/office/2004/12/omml" xmlns="http://www.w3.org/TR/REC-html40">
      <head>
      <meta http-equiv=Content-Type content="text/html; charset=utf-8">
      <meta name=ProgId content=Word.Document>
      </head>

      <body lang=EN-US link=blue vlink="#954F72" style='tab-interval:.5in'>
      <!--StartFragment--><span lang=EN style='font-size:12.0pt;font-family:
      "Arial",sans-serif;mso-fareast-font-family:"Times New Roman";mso-ansi-language:
      EN;mso-fareast-language:EN-US;mso-bidi-language:AR-SA'>abc</span><!--EndFragment-->
      </body>

      </html>
      TAxelFCg��K��`

    const expectedHTML = "<p><!--block-->abc</p>"
    assert.documentHTMLEqual(HTMLParser.parse(html).getDocument(), expectedHTML)
  })

  test("parses incorrectly nested list html", () => {
    const html = "<ul><li>a</li><ul><li>b</li><ol><li>1</li><li>2</li><ol></ul></ul>"
    const expectedHTML =
      "<ul><li><!--block-->a<ul><li><!--block-->b<ol><li><!--block-->1</li><li><!--block-->2</li></ol></li></ul></li></ul>"
    assert.documentHTMLEqual(HTMLParser.parse(html).getDocument(), expectedHTML)
  })

  test("ignores whitespace between block elements", () => {
    const html = "<p>a</p> \n <p>b</p>     <article>c</article>  \n\n <section>d</section> "
    const expectedHTML =
      "<p><!--block-->a</p><p><!--block-->b</p><p><!--block-->c</p><p><!--block-->d</p>"
    assert.documentHTMLEqual(HTMLParser.parse(html).getDocument(), expectedHTML)
  })

  test("ingores whitespace between nested block elements", () => {
    const html = "<ul> <li>a</li> \n  <li>b</li>  </ul><div>  <div> \n <blockquote>c</blockquote>\n </div>  \n</div>"
    const expectedHTML = "<ul><li><!--block-->a</li><li><!--block-->b</li></ul><blockquote><!--block-->c</blockquote>"
    assert.documentHTMLEqual(HTMLParser.parse(html).getDocument(), expectedHTML)
  })

  test("ignores inline whitespace that can't be displayed", () => {
    const html = " a  \n b    <span>c\n</span><span>d  \ne </span> f <span style=\"white-space: pre\">  g\n\n h  </span>"
    const expectedHTML = "<p><!--block-->a b c d e f &nbsp; g<br><br>&nbsp;h &nbsp;</p>"
    assert.documentHTMLEqual(HTMLParser.parse(html).getDocument(), expectedHTML)
  })

  test("parses significant whitespace in empty inline elements", () => {
    const html = "a<span style='mso-spacerun:yes'> </span>b<span style='mso-spacerun:yes'>  </span>c"
    const expectedHTML = "<p><!--block-->a b c</p>"
    assert.documentHTMLEqual(HTMLParser.parse(html).getDocument(), expectedHTML)
  })

  test("parses block elements with leading breakable whitespace", () => {
    const html =
      "<blockquote> <span>a</span> <blockquote>\n <strong>b</strong> <pre> <span>c</span></pre></blockquote></blockquote>"
    const expectedHTML =
      "<blockquote><!--block-->a<blockquote><!--block--><strong>b</strong><pre><!--block--> c</pre></blockquote></blockquote>"
    assert.documentHTMLEqual(HTMLParser.parse(html).getDocument(), expectedHTML)
  })

  test("parses block elements with leading non-breaking whitespace", () => {
    const html = "<blockquote>&nbsp;<span>a</span></blockquote>"
    const expectedHTML = "<blockquote><!--block-->&nbsp;a</blockquote>"
    assert.documentHTMLEqual(HTMLParser.parse(html).getDocument(), expectedHTML)
  })

  test("converts newlines to spaces", () => {
    const html = "<p>a\nb \nc \n d \n\ne</p><pre>1\n2</pre>"
    const expectedHTML = "<p><!--block-->a b c d e</p><pre><!--block-->1\n2</pre>"
    assert.documentHTMLEqual(HTMLParser.parse(html).getDocument(), expectedHTML)
  })

  test("parses entire HTML document", () => {
    const html =
      "<html><head><style>.bold {font-weight: bold}</style></head><body><span class=\"bold\">abc</span></body></html>"
    const expectedHTML = "<p><!--block--><strong>abc</strong></p>"
    assert.documentHTMLEqual(HTMLParser.parse(html).getDocument(), expectedHTML)
  })

  test("parses inline element following block element", () => {
    const html = "<blockquote>abc</blockquote><strong>123</strong>"
    const expectedHTML = "<blockquote><!--block-->abc</blockquote><p><!--block--><strong>123</strong></p>"
    assert.documentHTMLEqual(HTMLParser.parse(html).getDocument(), expectedHTML)
  })

  test("parses text nodes following block elements", () => {
    const html = "<ul><li>a</li></ul>b<blockquote>c</blockquote>d"
    const expectedHTML =
      "<ul><li><!--block-->a</li></ul><p><!--block-->b</p><blockquote><!--block-->c</blockquote><p><!--block-->d</p>"
    assert.documentHTMLEqual(HTMLParser.parse(html).getDocument(), expectedHTML)
  })

  test("parses whitespace-only text nodes without a containing block element", () => {
    const html = "a <strong>b</strong> <em>c</em>"
    const expectedHTML = "<p><!--block-->a <strong>b</strong> <em>c</em></p>"
    assert.documentHTMLEqual(HTMLParser.parse(html).getDocument(), expectedHTML)
  })

  test("parses spaces around cursor targets", () => {
    const html = `<p>a ${cursorTargetLeft}<span>b</span>${cursorTargetRight} c</p>`
    const expectedHTML = "<p><!--block-->a b c</p>"
    assert.documentHTMLEqual(HTMLParser.parse(html).getDocument(), expectedHTML)
  })

  test("parses spanned text elements that don't have a parser function", () => {
    assert.notOk(config.textAttributes.strike.parser)
    const html = "<del>a <strong>b</strong></del>"
    const expectedHTML = "<p><!--block--><del>a </del><strong><del>b</del></strong></p>"
    assert.documentHTMLEqual(HTMLParser.parse(html).getDocument(), expectedHTML)
  })

  test("translates tables into plain text", () => {
    const html = "<table><tr><td>a</td><td>b</td></tr><tr><td>1</td><td><p>2</p></td></tr><table>"
    const expectedHTML = "<p><!--block-->a | b<br>1 | 2</p>"
    assert.documentHTMLEqual(HTMLParser.parse(html).getDocument(), expectedHTML)
  })

  test("allows customizing table separater", () => {
    withParserConfig({ tableCellSeparator: "*", tableRowSeparator: "-" }, () => {
      const html = "<table><tr><td>a</td><td>b</td></tr><tr><td>1</td><td><p>2</p></td></tr><table>"
      const expectedHTML = "<p><!--block-->a*b-1*2</p>"
      assert.documentHTMLEqual(HTMLParser.parse(html).getDocument(), expectedHTML)
    })
  })

  test("includes empty cells when translating tables into plain text", () => {
    const html = "<table><tr><td> </td><td></td></tr><tr><td>1</td><td><p>2</p></td></tr><table>"
    const expectedHTML = "<p><!--block-->&nbsp;|&nbsp;<br>1 | 2</p>"
    assert.documentHTMLEqual(HTMLParser.parse(html).getDocument(), expectedHTML)
  })

  test("allows removing empty table cells from translated tables", () => {
    withParserConfig({ removeBlankTableCells: true }, () => {
      const html = "<table><tr><td> </td><td>\n</td></tr><tr><td>1</td><td><p>2</p></td></tr><table>"
      const expectedHTML = "<p><!--block-->1 | 2</p>"
      assert.documentHTMLEqual(HTMLParser.parse(html).getDocument(), expectedHTML)
    })
  })

  // test("translates block element margins to newlines", () => {
  //   const html =
  //     "<p style=\"margin: 0 0 1em 0\">a</p><p style=\"margin: 0\">b</p><article style=\"margin: 1em 0 0 0\">c</article>"
  //   const expectedHTML = "<p><!--block-->a<br><br></p><p><!--block-->b</p><p><!--block--><br>c</p>"
  //   const document = HTMLParser.parse(html).getDocument()
  //   assert.documentHTMLEqual(document, expectedHTML)
  // })
  //
  // test("skips translating empty block element margins to newlines", () => {
  //   const html =
  //     "<div style=\"margin: 0 0 1em 0\">a</div><div style=\"margin: 0 0 1em 0\"><span></span></div><div style=\"margin: 0\">b</div>"
  //   const expectedHTML = "<p><!--block-->a<br><br></p><p><!--block--><br></p><p><!--block-->b</p>"
  //   const document = HTMLParser.parse(html).getDocument()
  //   assert.documentHTMLEqual(document, expectedHTML)
  // })

  test("ignores text nodes in script elements", () => {
    const html = "<p>a<script>alert(\"b\")</script></p>"
    const expectedHTML = "<p><!--block-->a</p>"
    assert.documentHTMLEqual(HTMLParser.parse(html).getDocument(), expectedHTML)
  })

  test("ignores iframe elements", () => {
    const html = "<p>a<iframe src=\"data:text/html;base64,PHNjcmlwdD5hbGVydCgneHNzJyk7PC9zY3JpcHQ+\">b</iframe></p>"
    const expectedHTML = "<p><!--block-->a</p>"
    assert.documentHTMLEqual(HTMLParser.parse(html).getDocument(), expectedHTML)
  })

  test("sanitizes unsafe html", async () => {
    window.unsanitized = []
    HTMLParser.parse(`
      <img onload="window.unsanitized.push('img.onload');" src="${TEST_IMAGE_URL}">
      <img onerror="window.unsanitized.push('img.onerror');" src="data:image/gif;base64,TOTALLYBOGUS">
      <script>
        window.unsanitized.push('script tag');
      </script>`)

    await delay(20)
    assert.deepEqual(window.unsanitized, [])
    delete window.unsanitized
  })

  test("forbids href attributes with javascript: protocol", () => {
    const html =
      "<a href=\"javascript:alert()\">a</a> <a href=\" javascript: alert()\">b</a> <a href=\"JavaScript:alert()\">c</a>"
    const expectedHTML = "<p><!--block-->a b c</p>"
    assert.documentHTMLEqual(HTMLParser.parse(html).getDocument(), expectedHTML)
  })

  test("parses foreground color when configured", () => {
    const attrConfig = { foregroundColor: { styleProperty: "color" } }

    withTextAttributeConfig(attrConfig, () => {
      const html = "<span style=\"color: rgb(60, 179, 113);\">green</span>"
      const expectedHTML = "<p><!--block--><span style=\"color: rgb(60, 179, 113);\">green</span></p>"
      const document = HTMLParser.parse(html).getDocument()
      assert.documentHTMLEqual(document, expectedHTML)
    })
  })

  test("parses background color when configured", () => {
    const attrConfig = { backgroundColor: { styleProperty: "backgroundColor" } }

    withTextAttributeConfig(attrConfig, () => {
      const html = "<span style=\"background-color: yellow;\">on yellow</span>"
      const expectedHTML = "<p><!--block--><span style=\"background-color: yellow;\">on yellow</span></p>"
      const document = HTMLParser.parse(html).getDocument()
      assert.documentHTMLEqual(document, expectedHTML)
    })
  })

  test("parses configured foreground color on formatted text", () => {
    const attrConfig = { foregroundColor: { styleProperty: "color" } }

    withTextAttributeConfig(attrConfig, () => {
      const html = "<strong style=\"color: rgb(60, 179, 113);\">GREEN</strong>"
      const expectedHTML = "<p><!--block--><strong style=\"color: rgb(60, 179, 113);\">GREEN</strong></p>"
      const document = HTMLParser.parse(html).getDocument()
      assert.documentHTMLEqual(document, expectedHTML)
    })
  })

  test("parses foreground color using configured parser function", () => {
    const attrConfig = {
      foregroundColor: {
        styleProperty: "color",
        parser(element) {
          const { color } = element.style
          if (color === "rgb(60, 179, 113)") {
            return color
          }
        },
      },
    }

    withTextAttributeConfig(attrConfig, () => {
      const html = "<span style=\"color: rgb(60, 179, 113);\">green</span><span style=\"color: yellow;\">not yellow</span>"
      const expectedHTML = "<p><!--block--><span style=\"color: rgb(60, 179, 113);\">green</span>not yellow</p>"
      const document = HTMLParser.parse(html).getDocument()
      assert.documentHTMLEqual(document, expectedHTML)
    })
  })
})

const withParserConfig = (attrConfig = {}, fn) => {
  withConfig("parser", attrConfig, fn)
}

const withTextAttributeConfig = (attrConfig = {}, fn) => {
  withConfig("textAttributes", attrConfig, fn)
}

const withConfig = (section, newConfig = {}, fn) => {
  const originalConfig = Object.assign({}, config[section])
  const copy = (section, properties) => {
    for (const [ key, value ] of Object.entries(properties)) {
      if (value) {
        config[section][key] = value
      } else {
        delete config[section][key]
      }
    }
  }

  try {
    copy(section, newConfig)
    fn()
  } finally {
    copy(section, originalConfig)
  }
}

const getOrigin = () => {
  const { protocol, hostname, port } = window.location
  return `${protocol}//${hostname}${port ? `:${port}` : ""}`
}
