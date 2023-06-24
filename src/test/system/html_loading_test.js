import { assert, expectDocument, test, testGroup } from "test/test_helper"
// import { OBJECT_REPLACEMENT_CHARACTER } from "rico/constants"

testGroup("HTML loading", () => {
  // testGroup("inline elements", { template: "editor_with_styled_content" }, () => {
  //   const cases = {
  //     "BR before block element styled otherwise": {
  //       html: `a<br><figure class="attachment"><img src="${TEST_IMAGE_URL}"></figure>`,
  //       expectedDocument: `a\n${OBJECT_REPLACEMENT_CHARACTER}\n`,
  //     },
  //
  //     "BR in text before block element styled otherwise": {
  //       html: `<p>a<br>b<figure class="attachment"><img src="${TEST_IMAGE_URL}"></figure></p>`,
  //       expectedDocument: `a\nb${OBJECT_REPLACEMENT_CHARACTER}\n`,
  //     },
  //   }
  //
  //   for (const name in cases) {
  //     const details = cases[name]
  //     test(name, () => {
  //       getEditor().loadHTML(details.html)
  //       expectDocument(details.expectedDocument)
  //     })
  //   }
  // })

  testGroup("bold elements", { template: "editor_with_bold_styles" }, () => {
    test("<strong> with font-weight: 500", () => {
      getEditor().loadHTML("<strong>a</strong>")
      assert.textAttributes([ 0, 1 ], { bold: true })
      expectDocument("a\n")
    })

    test("<span> with font-weight: 600", () => {
      getEditor().loadHTML("<span>a</span>")
      assert.textAttributes([ 0, 1 ], { bold: true })
      expectDocument("a\n")
    })

    test("<article> with font-weight: bold", () => {
      getEditor().loadHTML("<article>a</article>")
      assert.textAttributes([ 0, 1 ], { bold: true })
      expectDocument("a\n")
    })
  })

  testGroup("styled block elements", { template: "editor_with_block_styles" }, () => {
    test("<em> in <blockquote> with font-style: italic", () => {
      getEditor().loadHTML("<blockquote>a<em>b</em></blockquote>")
      assert.textAttributes([ 0, 1 ], {})
      assert.textAttributes([ 1, 2 ], { italic: true })
      assert.blockAttributes([ 0, 2 ], [ "quote" ])
      expectDocument("ab\n")
    })

    test("<strong> in <li> with font-weight: bold", () => {
      getEditor().loadHTML("<ul><li>a<strong>b</strong></li></ul>")
      assert.textAttributes([ 0, 1 ], {})
      assert.textAttributes([ 1, 2 ], { bold: true })
      assert.blockAttributes([ 0, 2 ], [ "bulletList", "bullet" ])
      expectDocument("ab\n")
    })

    test("newline in <li> with font-weight: bold", () => {
      getEditor().loadHTML("<ul><li>a<br>b</li></ul>")
      assert.textAttributes([ 0, 2 ], {})
      assert.blockAttributes([ 0, 2 ], [ "bulletList", "bullet" ])
      expectDocument("a\nb\n")
    })
  })

  testGroup("in a table", { template: "editor_in_table" }, () => {
    test("block elements", () => {
      getEditor().loadHTML("<h1>a</h1><blockquote>b</blockquote>")
      assert.blockAttributes([ 0, 2 ], [ "heading1" ])
      assert.blockAttributes([ 2, 4 ], [ "quote" ])
      expectDocument("a\nb\n")
    })
  })

  testGroup("text after closing tag", { template: "editor_empty" }, () => {
    test("parses text as separate block", () => {
      getEditor().loadHTML("<h1>a</h1>b")
      assert.blockAttributes([ 0, 2 ], [ "heading1" ])
      assert.blockAttributes([ 2, 4 ], [])
      expectDocument("a\nb\n")
    })
  })
})
