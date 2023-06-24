import View from "inspector/view"
import UTF16String from "rico/core/utilities/utf16_string"

class SelectionView extends View {
  static title = "Selection"
  static template = "selection"
  static events = {
    "rico-selection-change": function() {
      return this.render()
    },
    "rico-render": function() {
      return this.render()
    },
  }

  render() {
    this.document = this.editor.getDocument()
    this.range = this.editor.getSelectedRange()
    this.locationRange = this.composition.getLocationRange()
    this.characters = this.getCharacters()
    return super.render(...arguments)
  }

  getCharacters() {
    const chars = []
    const utf16string = UTF16String.box(this.document.toString())
    const rangeIsExpanded = this.range[0] !== this.range[1]
    let position = 0
    while (position < utf16string.length) {
      let string = utf16string.charAt(position).toString()
      if (string === "\n") {
        string = "⏎"
      }
      const selected = rangeIsExpanded && position >= this.range[0] && position < this.range[1]
      chars.push({ string, selected })
      position++
    }
    return chars
  }

  getTitle() {
    return `${this.title} (${this.range.join()})`
  }
}

Rico.Inspector.registerView(SelectionView)
